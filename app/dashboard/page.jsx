'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Custom hook for data fetching
const useUserData = (userId) => {
  const [data, setData] = useState({
    workspaces: [],
    totalTasks: 0,
    tasksDone: 0,
    toDoTasks: [],
    chartData: [],
    isLoading: true,
    error: null,
  });

  const refreshData = useCallback(async () => {
    if (!userId) return;

    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use Promise.all to fetch data in parallel
      const [workspaceResponse, taskResponse] = await Promise.all([getUserWorkspaces(userId), getUserTasks(userId)]);

      if (!workspaceResponse.success) {
        throw new Error('Failed to fetch workspaces');
      }

      if (!taskResponse.success) {
        throw new Error('Failed to fetch tasks');
      }

      const fetchedWorkspaces = workspaceResponse.data.map((item) => item.workspace);
      const fetchedTasks = taskResponse.data;

      // Calculate task stats
      const doneTasksCount = fetchedTasks.filter((task) => task.status === STATUS.DONE).length;

      const toDoList = fetchedTasks.filter((task) => task.status === STATUS.TODO).slice(0, 6);

      const weeksData = calculateWeeklyData(fetchedTasks);

      setData({
        workspaces: fetchedWorkspaces,
        totalTasks: fetchedTasks.length,
        tasksDone: doneTasksCount,
        toDoTasks: toDoList,
        chartData: weeksData,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setData((prev) => ({
        ...prev,
        workspaces: [],
        totalTasks: 0,
        tasksDone: 0,
        toDoTasks: [],
        chartData: [],
        isLoading: false,
        error: err.message || 'Error loading data',
      }));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refreshData();
    }
  }, [userId, refreshData]);

  return { ...data, refreshData };
};

// Memoized helper functions
const getLastFourWeeks = () => {
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const weeks = [];
  const currentWeekStart = new Date(fourWeeksAgo);

  while (currentWeekStart.getDay() !== 1) {
    currentWeekStart.setDate(currentWeekStart.getDate() + 1);
  }

  let weekIndex = 1;
  while (currentWeekStart < now && weekIndex <= 4) {
    const weekEnd = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    if (weekEnd > now) {
      weekEnd.setTime(now.getTime());
    }
    weeks.push({
      start: new Date(currentWeekStart),
      end: new Date(weekEnd),
      label: `Week ${weekIndex}`,
    });
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekIndex++;
  }

  return weeks;
};

const calculateWeeklyData = (tasks) => {
  const weeks = getLastFourWeeks();
  const data = weeks.map((week) => ({
    week: week.label,
    todo: 0,
    ongoing: 0,
    done: 0,
  }));

  if (!tasks || tasks.length === 0) return data;

  // Pre-categorize tasks by status for faster lookup
  const tasksByStatus = {
    [STATUS.TODO]: [],
    [STATUS.ONGOING]: [],
    [STATUS.DONE]: [],
  };

  tasks.forEach((task) => {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task);
    }
  });

  // Process each week's data
  weeks.forEach((week, index) => {
    Object.entries(tasksByStatus).forEach(([status, statusTasks]) => {
      const count = statusTasks.filter((task) => {
        const taskDate = task.deadline ? new Date(task.deadline) : null;
        return taskDate && taskDate >= week.start && taskDate <= week.end;
      }).length;

      if (status === STATUS.TODO) data[index].todo += count;
      else if (status === STATUS.ONGOING) data[index].ongoing += count;
      else if (status === STATUS.DONE) data[index].done += count;
    });

    // Add tasks without deadline to the last week's todo
    if (index === data.length - 1) {
      const noDeadlineTasks = tasksByStatus[STATUS.TODO].filter((task) => !task.deadline).length;
      data[index].todo += noDeadlineTasks;
    }
  });

  return data;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch user data with optimized hook
  const { workspaces, totalTasks, tasksDone, toDoTasks, chartData, isLoading, error, refreshData } = useUserData(user?.id);

  // Memoize derived values to prevent unnecessary recalculations
  const statsData = useMemo(
    () => [
      {
        title: 'Workspace',
        value: workspaces.length,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146070/workspaces_shxqcw.svg',
      },
      {
        title: 'My Tasks',
        value: totalTasks,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146054/my-tasks_aoabbt.svg',
      },
      {
        title: 'Tasks Done',
        value: tasksDone,
        icon: 'https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742146010/my-tasks-done_cdnmvn.svg',
      },
    ],
    [workspaces.length, totalTasks, tasksDone]
  );

  const hasChartData = useMemo(() => chartData.length > 0 && chartData.some((week) => week.todo > 0 || week.ongoing > 0 || week.done > 0), [chartData]);

  const maxValue = useMemo(() => {
    let max = 0;
    chartData.forEach((week) => {
      const weekMax = Math.max(week.todo, week.ongoing, week.done);
      if (weekMax > max) {
        max = weekMax;
      }
    });
    return Math.ceil(max);
  }, [chartData]);

  const yAxisTicks = useMemo(() => Array.from({ length: maxValue + 1 }, (_, i) => i), [maxValue]);

  const combinedLoading = authLoading || isLoading;

  // Memoize tooltip content
  const renderTooltipContent = useCallback(({ payload }) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.week}</p>
          <p>To Do: {data.todo}</p>
          <p>ongoing: {data.ongoing}</p>
          <p>Done: {data.done}</p>
        </div>
      );
    }
    return null;
  }, []);

  // Use React.memo for large components or consider lazy loading

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 py-4">
          <div className="grid gap-2 grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))]">
            {combinedLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
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
              : statsData.map((stat, index) => <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />)}
          </div>

          <div className="bg-white p-6 rounded-lg w-full text-center h-[480px] mt-8 shadow-xl md:block hidden">
            {combinedLoading ? (
              <>
                <Skeleton className="h-6 w-48 mx-auto my-4" />
                <Skeleton className="w-full h-[350px] mx-auto" />
              </>
            ) : (
              <>
                <h2 className="text-l font-medium my-4 mt-8 text-center">Productivity Chart (Last 4 Weeks)</h2>
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height={350} className="mx-auto">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, maxValue]} ticks={yAxisTicks} tickFormatter={(value) => Math.round(value)} />
                      <Tooltip content={renderTooltipContent} />
                      <Legend wrapperStyle={{ marginTop: '10px' }} />
                      <Bar dataKey="todo" fill="#879ADA" name="To Do" />
                      <Bar dataKey="ongoing" fill="#455CB0" name="Ongoing" />
                      <Bar dataKey="done" fill="#354273" name="Done" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 mt-16">No data available for the last 4 weeks</p>
                )}
              </>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg md:hidden block mt-8">
            {combinedLoading ? (
              <>
                <Skeleton className="h-6 w-48 mx-auto my-4 mb-6" />
                <Skeleton className="w-full h-[300px]" />
              </>
            ) : (
              <>
                <h2 className="text-l font-medium my-4 mb-6 text-center">Productivity Chart (Last 4 Weeks)</h2>
                {hasChartData ? (
                  <div className="h-[300px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }} barGap={2} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, maxValue]} ticks={yAxisTicks} tickFormatter={(value) => Math.round(value)} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '8px',
                          }}
                          content={renderTooltipContent}
                        />
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
                  <p className="text-center text-gray-500 mt-16">No data available for the last 4 weeks</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="py-4 col-span-1 space-y-6 md:block hidden">
          <UserProfileCard isLoading={combinedLoading} user={user || { name: 'Guest', email: 'guest@example.com' }} />
          <ToDoListCard isLoading={combinedLoading} tasks={toDoTasks} />
        </div>
      </div>
    </div>
  );
}
