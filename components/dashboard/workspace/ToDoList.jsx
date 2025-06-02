'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserTasks } from '@/lib/api/task';
import { getWorkspaceById } from '@/lib/api/workspace';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { STATUS } from '@/lib/utils';

export function ToDoListCard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fungsi untuk memuat tugas
  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      setError('User ID is not available. Please log in again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserTasks(user.id);
      // console.log('API Response:', response); // Debugging: Lihat respons API

      if (response.success && response.data.length > 0) {
        // Ambil detail workspace untuk setiap tugas
        const taskPromises = response.data.map(async (item) => {
          try {
            if (item.workspaceName && item.workspaceSlug) {
              return {
                ...item,
                workspaceName: item.workspaceName,
                workspaceSlug: item.workspaceSlug,
              };
            }

            const workspace = await getWorkspaceById(item.workspaceId);
            return {
              ...item,
              workspaceName: workspace?.data?.name || 'Unknown',
              workspaceSlug: workspace?.data?.slug || '#',
            };
          } catch (err) {
            // console.warn(`Failed to fetch workspace for task ${item.id}:`, err); // Debugging
            return {
              ...item,
              workspaceName: 'Unknown',
              workspaceSlug: '#',
            };
          }
        });

        const results = await Promise.allSettled(taskPromises);
        const formattedTasks = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter((task) => {
            // Filter hanya tugas dengan status TODO, case-insensitive
            const isTodo = task && task.id && task.status?.toLowerCase() === STATUS.TODO.toLowerCase();
            // console.log(`Task ${task?.id}: status=${task?.status}, isTodo=${isTodo}`); // Debugging
            return isTodo;
          });

        // console.log('Filtered TODO Tasks:', formattedTasks); // Debugging
        setTasks(formattedTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      // console.error('Failed to load tasks:', err); // Debugging
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Muat tugas saat komponen dimuat atau user berubah
  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user, loadTasks]);

  return (
    <Card className="border border-[#6387CE] p-4 rounded-lg">
      {isLoading ? (
        <>
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <ul className="mt-2 space-y-2">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <li key={index} className="flex items-center p-2 bg-white rounded-md shadow space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : error ? (
        <div className="text-center text-sm text-red-500 py-3">{error}</div>
      ) : (
        <>
          <h3 className="py-3 text-l font-medium text-center">Your To Do List</h3>
          <ul className="mt-2 space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="flex items-center p-2 bg-white rounded-md shadow space-x-3 hover:bg-gray-100 transition-colors">
                  <Link href={`/dashboard/workspace/${task.workspaceSlug}`} className="flex items-center space-x-3 w-full" title={`View workspace: ${task.workspaceName}`}>
                    <img src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238508/your-todo-list_rgg7ab.svg" alt="To Do Icon" className="w-8 h-8" />
                    <div className="py-0.5 flex flex-col">
                      <span className="text-sm font-medium">{task.title}</span>
                      <span className="text-xs text-gray-500">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'No Deadline'}
                      </span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-center text-sm text-gray-500">No tasks to do</li>
            )}
          </ul>
        </>
      )}
    </Card>
  );
}
