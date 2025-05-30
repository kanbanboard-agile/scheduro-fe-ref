'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATUS } from '@/lib/utils';
import { UserProfileCard } from '@/components/dashboard/workspace/UserProfileCard';
import { ToDoListCard } from '@/components/dashboard/workspace/ToDoList';
import { StatsCard } from '@/components/dashboard/Task/StatsCard';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserWorkspaces } from '@/lib/api/workspace';
import { getUserTasks } from '@/lib/api/task';
import { GenerateTaskButton } from '@/components/dashboard/task/GenerateTaskButton';

// Memoized child components to prevent unnecessary re-renders
const MemoizedStatsCard = React.memo(StatsCard);
const MemoizedUserProfileCard = React.memo(UserProfileCard);
const MemoizedToDoListCard = React.memo(ToDoListCard);

// Pre-compute months array once during component initialization
const getMonthLabels = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - 3 + i);
    months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }

  return months;
};

// Static month labels - prevents recalculation
const MONTH_LABELS = getMonthLabels();

// Tooltip component extracted to prevent re-renders
const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 border rounded shadow">
      <p className="font-medium mb-1">{label}</p>
      <div className="space-y-1">
        <p className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#879ADA] inline-block mr-2"></span>
          To Do: {data.todo}
        </p>
        <p className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#455CB0] inline-block mr-2"></span>
          Ongoing: {data.ongoing}
        </p>
        <p className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#354273] inline-block mr-2"></span>
          Done: {data.done}
        </p>
        <p className="font-medium pt-1 border-t mt-1">Total: {data.todo + data.ongoing + data.done}</p>
      </div>
    </div>
  );
});

export default function DashboardPage() {
  // Reduced state to minimize re-renders
  const [data, setData] = useState({
    workspaces: [],
    totalTasks: 0,
    tasksDone: 0,
    toDoTasks: [],
    chartData: [],
    isLoading: true,
    error: null,
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/'); // Ubah dari /login ke /
    }
  }, [authLoading, user, router]);

  // Single calculation of combined loading state
  const combinedLoading = authLoading || data.isLoading;

  // Check if chart should be displayed - memoized
  const hasChartData = useMemo(() => data.totalTasks > 0, [data.totalTasks]);

  // Memoize stats data
  const statsData = useMemo(
    () => [
      {
        title: 'Workspace',
        value: data.workspaces.length,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146070/workspaces_shxqcw.svg',
      },
      {
        title: 'My Tasks',
        value: data.totalTasks,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146054/my-tasks_aoabbt.svg',
      },
      {
        title: 'Tasks Done',
        value: data.tasksDone,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146010/my-tasks-done_cdnmvn.svg',
      },
    ],
    [data.workspaces.length, data.totalTasks, data.tasksDone]
  );

  // Chart display variables calculation - optimized with early return
  const { maxValue, yAxisTicks } = useMemo(() => {
    if (!data.chartData || data.chartData.length === 0) {
      return { maxValue: 5, yAxisTicks: [0, 1, 2, 3, 4, 5] };
    }

    let max = 0;
    // Use for loop instead of forEach for better performance
    for (let i = 0; i < data.chartData.length; i++) {
      const week = data.chartData[i];
      const weekTotal = week.todo + week.ongoing + week.done;
      const weekMax = Math.max(week.todo, week.ongoing, week.done, weekTotal / 2);
      if (weekMax > max) max = weekMax;
    }

    const finalMax = Math.max(Math.ceil(max) + 1, 5);
    // Pre-compute ticks array
    const ticks = Array.from({ length: finalMax + 1 }, (_, i) => i);

    return { maxValue: finalMax, yAxisTicks: ticks };
  }, [data.chartData]);

  // Improved monthly data calculation with optimized date handling
  const calculateMonthlyData = useCallback((tasks) => {
    if (!tasks?.length) {
      return MONTH_LABELS.map((label) => ({
        week: label,
        todo: 0,
        ongoing: 0,
        done: 0,
      }));
    }

    // Pre-calculate month boundaries once
    const now = new Date();
    const months = [];

    for (let i = 0; i < 4; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // Calculate month boundaries
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      // Cap end date to today if in future
      if (monthEnd > now) {
        monthEnd.setTime(now.getTime());
      }

      // Store as timestamps for faster comparison
      months.unshift({
        start: monthStart.getTime(),
        end: monthEnd.getTime(),
        label: monthYear,
      });
    }

    // Initialize data structure with zero counts
    const data = months.map((month) => ({
      week: month.label,
      todo: 0,
      ongoing: 0,
      done: 0,
    }));

    // Use a single loop for processing tasks
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Default to current time if no deadline
      let taskTimestamp = now.getTime();

      // Try to parse deadline date if exists
      if (task.deadline) {
        const parsedDate = new Date(task.deadline);
        // Use parsed date if valid
        if (!isNaN(parsedDate.getTime())) {
          taskTimestamp = parsedDate.getTime();
        }
      }

      // Find which month this task belongs to (using binary search would be even faster for many months)
      let assigned = false;
      for (let j = 0; j < months.length; j++) {
        const month = months[j];
        if (taskTimestamp >= month.start && taskTimestamp <= month.end) {
          // Use lookup object for status instead of if-else chain
          const statusMap = {
            [STATUS.TODO]: 'todo',
            [STATUS.ONGOING]: 'ongoing',
            [STATUS.DONE]: 'done',
          };

          // Increment the appropriate counter
          const statusKey = statusMap[task.status];
          if (statusKey) {
            data[j][statusKey] += 1;
          }

          assigned = true;
          break;
        }
      }

      // If not assigned to any month, put in most recent month
      if (!assigned) {
        const lastIndex = data.length - 1;
        const statusMap = {
          [STATUS.TODO]: 'todo',
          [STATUS.ONGOING]: 'ongoing',
          [STATUS.DONE]: 'done',
        };

        const statusKey = statusMap[task.status];
        if (statusKey) {
          data[lastIndex][statusKey] += 1;
        }
      }
    }

    return data;
  }, []);

  // Data loading optimization - avoid recreating this function
  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use a single Promise.all to load data in parallel
      const [workspaceResponse, taskResponse] = await Promise.all([getUserWorkspaces(user.id), getUserTasks(user.id)]);

      if (!workspaceResponse.success || !taskResponse.success) {
        throw new Error('Failed to fetch data');
      }

      // Extract workspaces with efficient mapping
      const workspaces = workspaceResponse.data.map((item) => item.workspace);

      // Process tasks efficiently
      const fetchedTasks = taskResponse.data;
      const tasksDone = fetchedTasks.filter((task) => task.status === STATUS.DONE).length;

      // Get to-do tasks - avoid unnecessary filtering with slice
      const toDoTasks = [];
      let todoCount = 0;
      for (let i = 0; i < fetchedTasks.length && todoCount < 6; i++) {
        if (fetchedTasks[i].status === STATUS.TODO) {
          toDoTasks.push(fetchedTasks[i]);
          todoCount++;
        }
      }

      // Calculate chart data
      const chartData = calculateMonthlyData(fetchedTasks);

      // Batch state updates into a single update
      setData({
        workspaces,
        totalTasks: fetchedTasks.length,
        tasksDone,
        toDoTasks,
        chartData,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error loading data:', err);

      // Reset all states on error in a single update
      setData((prev) => ({
        ...prev,
        workspaces: [],
        totalTasks: 0,
        tasksDone: 0,
        toDoTasks: [],
        chartData: [],
        isLoading: false,
        error: 'Failed to load dashboard data',
      }));
    }
  }, [user, calculateMonthlyData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load data when user is authenticated - with proper dependencies
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData();
    }
  }, [authLoading, user, loadData]);

  // Pre-calculated skeleton arrays to avoid creating in render
  const STATS_SKELETONS = [0, 1, 2];

  return (
    <div className="p-6">
      {/* Generate Task Button */}
      <div className="flex justify-end mb-4">
        <GenerateTaskButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 py-4">
          {/* Stats Cards */}
          <div className="grid gap-2 grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))]">
            {combinedLoading
              ? STATS_SKELETONS.map((index) => (
                <Card key={index} className="min-w-[180px] h-[88px] border-[#6387CE]">
                  <CardContent className="px-4 py-2 flex items-center gap-3 w-full">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <div className="flex flex-col justify-center text-left leading-tight">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))
              : statsData.map((stat, index) => <MemoizedStatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />)}
          </div>

          {/* Desktop Chart - React.memo applied to complex components */}
          <div className="bg-white p-6 rounded-lg w-full text-center h-[480px] mt-8 shadow-xl md:block hidden">
            {combinedLoading ? (
              <>
                <Skeleton className="h-6 w-48 mx-auto my-4" />
                <Skeleton className="w-full h-[350px] mx-auto" />
              </>
            ) : (
              <>
                <h2 className="text-l font-medium my-4 mt-8 text-center">Productivity Chart (Last 4 Months)</h2>
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height={350} className="mx-auto">
                    <BarChart data={data.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, maxValue]} ticks={yAxisTicks} tickFormatter={(value) => Math.round(value)} />
                      <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ marginTop: '10px' }} />
                      <Bar dataKey="todo" fill="#879ADA" name="To Do" />
                      <Bar dataKey="ongoing" fill="#455CB0" name="Ongoing" />
                      <Bar dataKey="done" fill="#354273" name="Done" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <p className="text-gray-500">No task data available for the last 4 months</p>
                    <p className="text-gray-400 text-sm mt-2">Create tasks with deadlines to see your productivity chart</p>
                    {data.error && <p className="text-red-500 mt-2">{data.error}</p>}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Chart - Using the same CustomTooltip component */}
          <div className="bg-white p-4 rounded-lg shadow-lg md:hidden block mt-8">
            {combinedLoading ? (
              <>
                <Skeleton className="h-6 w-48 mx-auto my-4 mb-6" />
                <Skeleton className="w-full h-[300px]" />
              </>
            ) : (
              <>
                <h2 className="text-l font-medium my-4 mb-6 text-center">Productivity Chart (Last 4 Months)</h2>
                {hasChartData ? (
                  <div className="h-[300px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }} barGap={2} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, maxValue]} ticks={yAxisTicks} tickFormatter={(value) => Math.round(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            fontSize: '12px',
                            paddingTop: '10px',
                            textAlign: 'center',
                          }}
                        />
                        <Bar dataKey="todo" fill="#354273" name="To Do" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ongoing" fill="#455CB0" name="Ongoing" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="done" fill="#879ADA" name="Done" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[250px]">
                    <p className="text-gray-500">No task data available</p>
                    <p className="text-gray-400 text-sm mt-2">Add tasks with deadlines to see your chart</p>
                    {data.error && <p className="text-red-500 mt-2">{data.error}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar with memoized components */}
        <div className="py-4 col-span-1 space-y-6 md:block hidden">
          <MemoizedUserProfileCard isLoading={combinedLoading} user={user || { name: 'Guest', email: 'guest@example.com' }} />
          <MemoizedToDoListCard isLoading={combinedLoading} tasks={data.toDoTasks} />
        </div>
      </div>
    </div>
  );
}
