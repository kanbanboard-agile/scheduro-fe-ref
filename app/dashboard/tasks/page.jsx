'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATUS, PRIORITY } from '@/lib/utils';
import { TaskStatusBadge } from '@/components/dashboard/Task/TaskStatusBadge';
import { PriorityBadge } from '@/components/dashboard/Task/PriorityBadge';
import { TaskForm } from '@/components/dashboard/Task/TaskForm';
import { toast } from 'sonner';
import { getUserTasks } from '@/lib/api/task';
import { getWorkspaceById } from '@/lib/api/workspace';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

// Priority order mapping
const PRIORITY_ORDER = {
  [PRIORITY.URGENT]: 1,
  [PRIORITY.HIGH]: 2,
  [PRIORITY.MEDIUM]: 3,
  [PRIORITY.LOW]: 4,
};

// Status order mapping
const STATUS_ORDER = {
  [STATUS.TODO]: 1,
  [STATUS.ONGOING]: 2,
  [STATUS.DONE]: 3,
};

// Date formatter with memoization
const dateFormatterCache = new Map();
const formatDate = (dateString) => {
  if (!dateString) return 'No deadline';

  // Use cached result if available
  if (dateFormatterCache.has(dateString)) {
    return dateFormatterCache.get(dateString);
  }

  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Cache the result
  dateFormatterCache.set(dateString, formatted);
  return formatted;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    if (!tasks.length) return [];

    let filtered = tasks;

    // Apply search filter
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter((task) => (task.title && task.title.toLowerCase().includes(query)) || (task.description && task.description.toLowerCase().includes(query)));
    }

    // Apply sorting - optimized with stable sort comparators
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'deadline': {
          // Handle null/undefined dates gracefully
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        }
        case 'priority':
          return (PRIORITY_ORDER[a.priority] || 5) - (PRIORITY_ORDER[b.priority] || 5);
        case 'status':
          return (STATUS_ORDER[a.status] || 4) - (STATUS_ORDER[b.status] || 4);
        default:
          return 0;
      }
    });
  }, [debouncedQuery, sortBy, tasks]);

  // Load tasks with batch processing
  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      setError('User ID is not available. Please log in again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getUserTasks(user.id);

      if (response.success && response.data.length > 0) {
        // Pre-process initial task data
        const initialTasks = response.data.map((item) => ({
          ...item,
          workspaceName: item.workspaceName || 'Loading...',
          workspaceSlug: item.workspaceSlug || '#',
          priority: item.priority || 'Medium',
        }));

        // Set initial data quickly
        setTasks(initialTasks);
        setIsLoading(false);

        // Batch workspace requests in groups of 5
        const batchSize = 5;
        const batches = [];

        for (let i = 0; i < response.data.length; i += batchSize) {
          batches.push(response.data.slice(i, i + batchSize));
        }

        // Process batches sequentially
        const processedTasks = [...initialTasks];

        for (const batch of batches) {
          const batchPromises = batch.map(async (item, idx) => {
            // Skip fetch if we already have the data
            if (item.workspaceName && item.workspaceSlug) {
              return item;
            }

            try {
              const workspace = await getWorkspaceById(item.workspaceId);
              return {
                ...item,
                workspaceName: workspace?.data?.name || 'Unknown',
                workspaceSlug: workspace?.data?.slug || '#',
              };
            } catch (err) {
              return item;
            }
          });

          const batchResults = await Promise.all(batchPromises);

          // Update tasks with this batch
          batchResults.forEach((updatedTask) => {
            const taskIndex = processedTasks.findIndex((t) => t.id === updatedTask.id);
            if (taskIndex >= 0) {
              processedTasks[taskIndex] = updatedTask;
            }
          });

          // Update state with each batch
          setTasks([...processedTasks]);
        }
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Effect to load tasks when user changes
  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user, loadTasks]);

  const handleTaskSaved = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <Input placeholder="Search by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs bg-gray-50" />

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={loadTasks} aria-label="Refresh tasks">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-auto">
            <TaskForm
              onTaskSaved={(task) => {
                handleTaskSaved();
                toast.success('Task added successfully');
              }}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto" style={{ height: '500px', overflowY: 'auto' }}>
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-50">
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Deadline</th>
                <th className="text-left p-3 font-medium">Workspace</th>
                <th className="text-left p-3 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-3">{task.title}</td>
                    <td className="p-3">{task.description}</td>
                    <td className="p-3">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="p-3">{formatDate(task.deadline)}</td>
                    <td className="p-3">
                      <Link href={`/workspace/${task.workspaceSlug}`} passHref>
                        {task.workspaceName}
                      </Link>
                    </td>
                    <td className="p-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
