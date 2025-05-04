'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getWorkspaceDetail } from '@/lib/api/workspace';
import Header from '@/components/dashboard/workspace/Header';
import KanbanPage from './kanban';
import { getTaskByWorkspace } from '@/lib/api/task';
import { toast } from 'sonner';

// Task sorter function - extracted for reuse and memoization
const sortTasksByDeadline = (a, b) => {
  if (!a.deadline && !b.deadline) return 0;
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;
  return new Date(a.deadline) - new Date(b.deadline);
};

// Skeleton Component for loading state
const SkeletonLoader = ({ height = '20px', width = '100%' }) => (
  <div
    style={{
      height,
      width,
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      animation: 'pulse 1.5s infinite ease-in-out',
    }}
  />
);

export default function WorkspacePage() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format tasks into columns - memoized to prevent unnecessary recalculations
  const tasks = useMemo(() => {
    if (!taskData.length) {
      return { 'To Do': [], Ongoing: [], Done: [] };
    }

    return {
      'To Do': taskData.filter((task) => task.status === 'To Do').sort(sortTasksByDeadline),
      Ongoing: taskData.filter((task) => task.status === 'Ongoing' || task.status === 'In Progress').sort(sortTasksByDeadline),
      Done: taskData.filter((task) => task.status === 'Done').sort(sortTasksByDeadline),
    };
  }, [taskData]);

  // Memoized fetch function to avoid recreation on rerenders
  const fetchWorkspaceAndTasks = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      // Use Promise.all to fetch data in parallel
      const [workspaceResponse, tasksResponse] = await Promise.all([
        getWorkspaceDetail(slug),
        getWorkspaceDetail(slug).then((res) => {
          if (!res.success || !res.data?.id) {
            throw new Error(res.message || 'Invalid workspace data');
          }
          return getTaskByWorkspace(res.data.id);
        }),
      ]);

      // Validate workspace response
      if (!workspaceResponse.success || !workspaceResponse.data) {
        throw new Error(workspaceResponse.message || 'Failed to fetch workspace');
      }

      const workspaceData = workspaceResponse.data;

      // Validate tasks response
      if (!tasksResponse.success || !Array.isArray(tasksResponse.data)) {
        throw new Error(tasksResponse.message || 'Failed to fetch tasks');
      }

      // Update state with fetched data
      setWorkspace(workspaceData);
      setTaskData(tasksResponse.data);
    } catch (err) {
      console.error('Error fetching workspace or tasks:', err);
      setError(err.message || 'An error occurred while loading the workspace.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Effect for data fetching - runs only when slug changes
  useEffect(() => {
    if (slug) {
      fetchWorkspaceAndTasks();
    }
  }, [slug, fetchWorkspaceAndTasks]);

  // Early return for loading and error states
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader height="50px" /> {/* Header Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <SkeletonLoader height="400px" /> {/* Kanban Column Skeleton */}
          <SkeletonLoader height="400px" />
          <SkeletonLoader height="400px" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!workspace) {
    return <div>No workspace found.</div>;
  }

  // Priority hint for browser to prioritize rendering
  return (
    <>
      {/* Provide rendering hint to the browser */}
      <div style={{ content: 'priority' }}></div>
      <div>
        <Header workspace={workspace} onUpdate={setWorkspace} />
        <KanbanPage workspace={workspace} tasks={tasks} />
      </div>
    </>
  );
}
