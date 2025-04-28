"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS, PRIORITY } from "@/lib/utils";
import { TaskStatusBadge } from "@/components/dashboard/Task/TaskStatusBadge";
import { PriorityBadge } from "@/components/dashboard/Task/PriorityBadge";
import { TaskForm } from "@/components/dashboard/Task/TaskForm";
import { toast } from "sonner";
import { getUserTasks } from "@/lib/api/task";
import { getWorkspaceById } from "@/lib/api/workspace";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.id) {
        console.error("User ID is undefined. Skipping API call.");
        setError("User ID is not available. Please log in again.");
        setLoading(false);
        return;
      }

      const userId = user.id;
      const response = await getUserTasks(userId);
      console.log("Tasks loaded successfully:", response);

      if (response.success && response.data.length > 0) {
        const formattedTasks = await Promise.all(
          response.data.map(async (item) => {
            // Periksa apakah perlu memanggil getWorkspaceById
            let workspace = { data: { name: item.workspaceName, slug: "#" } };
            if (!item.workspaceName) {
              workspace = await getWorkspaceById(item.workspaceId);
            }
            return {
              ...item, // Langsung gunakan item karena tidak ada item.task
              workspaceName: workspace?.data?.name || "Unknown",
              workspaceSlug: workspace?.data?.slug || "#",
              priority: item.priority || "Medium",
            };
          })
        );
        console.log("Formatted tasks:", formattedTasks);
        setTasks(formattedTasks);
      } else {
        console.error("No tasks found or API failed:", response.message);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "deadline":
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        case "priority": {
          const priorityOrder = {
            [PRIORITY.URGENT]: 1,
            [PRIORITY.HIGH]: 2,
            [PRIORITY.MEDIUM]: 3,
            [PRIORITY.LOW]: 4,
          };
          return (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
        }
        case "status": {
          const statusOrder = {
            [STATUS.TODO]: 1,
            [STATUS.ONGOING]: 2,
            [STATUS.DONE]: 3,
          };
          return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
        }
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterAndSortTasks(); // Panggil fungsi filter dan sort setiap kali searchQuery, sortBy, atau tasks berubah
  }, [searchQuery, sortBy, tasks]);

  const handleTaskSaved = (savedTask, isEditing) => {
    loadTasks();
    if (isEditing) {
      toast.success("Task updated successfully");
    } else {
      toast.success("Task added successfully");
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
  };

  const displayTasks =
    filteredTasks.length > 0
      ? filteredTasks
      : isLoading
        ? []
        : tasks.filter((task) => task && task.id);

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-gray-50"
          />

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

            <Button variant="outline" size="icon" onClick={loadTasks}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-auto">
            <TaskForm
              onTaskSaved={handleTaskSaved}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
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
              {displayTasks.map((task, index) =>
                task && task.id ? (
                  <tr
                    key={task.id}
                    className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                  >
                    <td className="p-3 max-w-xs align-middle" title={task.title}>
                      <TaskForm
                        isEditing={true}
                        taskToEdit={task}
                        onTaskSaved={handleTaskSaved}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-full p-0 text-primary font-semibold hover:text-primary-hover cursor-pointer truncat hover:underline"
                            title={task.title} // Menampilkan judul lengkap saat hover
                            aria-label={`Edit task: ${task.title}`}
                          >
                            {task.title.length > 10
                              ? `${task.title.slice(0, 10)}...`
                              : task.title}
                          </Button>
                        }
                      />
                    </td>
                    <td
                      className="p-3 max-w-xs align-middle truncate"
                      title={task.description}
                    >
                      {task.description.length > 30
                        ? `${task.description.slice(0, 30)}...`
                        : task.description}
                    </td>
                    <td className="p-3 align-middle">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="p-3 align-middle whitespace-nowrap">
                      {formatDate(task.deadline)}
                    </td>
                    <td
                      className="p-3 align-middle max-w-[150px] truncate"
                      title={task.workspaceName}
                    >
                      <Link
                        href={`/dashboard/workspace/${task.workspaceSlug}`}
                        className="text-blue-600 hover:underline truncate block"
                        title={task.workspaceName}
                      >
                        {task.workspaceName}
                      </Link>
                    </td>
                    <td className="p-3 align-middle">
                      <PriorityBadge priority={task.priority} />
                    </td>
                  </tr>
                ) : null
              )}
              {displayTasks.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
