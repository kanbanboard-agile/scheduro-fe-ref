'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getWorkspaceDetail } from '@/lib/api/workspace';
import Header from '@/components/dashboard/workspace/Header';
import KanbanPage from './kanban';
import { getTaskByWorkspace } from '@/lib/api/task';
import { toast } from 'sonner';

export default function WorkspacePage() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState({
    'To Do': [],
    Ongoing: [],
    Done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspaceAndTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil data workspace
        const workspaceResponse = await getWorkspaceDetail(slug);
        if (!workspaceResponse.success || !workspaceResponse.data) {
          throw new Error(workspaceResponse.message || 'Failed to fetch workspace');
        }
        console.log('Workspace API Response:', workspaceResponse.data);

        // Validasi workspace ID
        const workspaceData = workspaceResponse.data;
        if (!workspaceData.id) {
          throw new Error('Workspace ID is missing');
        }

        // Ambil data task
        const tasksResponse = await getTaskByWorkspace(workspaceData.id);
        if (!tasksResponse.success || !Array.isArray(tasksResponse.data)) {
          throw new Error(tasksResponse.message || 'Failed to fetch tasks');
        }
        console.log('Tasks API Response:', tasksResponse.data);
        console.log(
          'Task statuses:',
          tasksResponse.data.map((task) => task.status)
        );

        // Format task ke dalam kolom
        const formattedTasks = {
          'To Do': tasksResponse.data.filter((task) => task.status === 'To Do').sort((a, b) => (a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0)),
          Ongoing: tasksResponse.data.filter((task) => task.status === 'Ongoing' || task.status === 'In Progress').sort((a, b) => (a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0)),
          Done: tasksResponse.data.filter((task) => task.status === 'Done').sort((a, b) => (a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0)),
        };
        console.log('Formatted tasks:', formattedTasks);

        setWorkspace(workspaceData);
        setTasks(formattedTasks);
      } catch (err) {
        console.error('Error fetching workspace or tasks:', err);
        setError(err.message || 'An error occurred while loading the workspace.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchWorkspaceAndTasks();
    }
  }, [slug]);

  if (loading) {
    return <div>Loading workspace...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!workspace) {
    return <div>No workspace found.</div>;
  }

  return (
    <div>
      <Header workspace={workspace} onUpdate={setWorkspace} />
      <KanbanPage workspace={workspace} tasks={tasks} />
    </div>
  );
}
