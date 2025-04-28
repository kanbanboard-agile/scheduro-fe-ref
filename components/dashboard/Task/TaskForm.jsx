"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { STATUS, PRIORITY } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { getUserWorkspaces } from "@/lib/api/workspace";
import { useAuth } from "@/lib/AuthContext";
import { createTask, updateTask } from "@/lib/api/task";

export function TaskForm({
  slug,
  onTaskSaved,
  initialStatus,
  trigger,
  isEditing = false,
  taskToEdit = null,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: initialStatus || STATUS.TODO,
    priority: PRIORITY.MEDIUM,
    workspace: "",
  });
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        // Validasi user dan userId
        if (!user || !user.id) {
          console.error("User ID is undefined. Skipping API call.");
          setErrors("User ID is not available. Please log in again.");
          setLoading(false);
          return;
        }

        const userId = user.id; // Ambil userId dari user
        // console.log("User ID:", userId);

        const response = await getUserWorkspaces(userId);

        if (response.success) {
          const workspaceData = response.data.map((item) => item.workspace);
          // console.log("Mapped workspaces:", workspaceData);
          setAvailableWorkspaces(workspaceData);
        } else {
          setErrors("Failed to fetch workspaces from API");
        }
      } catch (error) {
        console.error("Error details:", error);
        setErrors("Error fetching workspaces: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchWorkspaces(); // Panggil API saat form dibuka
    }
  }, [open, user]);

  useEffect(() => {
    if (open && isEditing && taskToEdit) {
      console.log("Editing task:", taskToEdit); // Log untuk debugging
      setTask({
        id: taskToEdit.id || "", // Pastikan id diatur saat mengedit
        title: taskToEdit.title || "", // Nilai default untuk title
        description: taskToEdit.description || "", // Nilai default untuk description
        deadline: taskToEdit.deadline
          ? new Date(taskToEdit.deadline).toISOString().split("T")[0] // Format deadline ke yyyy-MM-dd
          : new Date().toISOString().split("T")[0], // Nilai default untuk deadline adalah tanggal hari ini
        status: taskToEdit.status || STATUS.TODO, // Nilai default untuk status
        priority: taskToEdit.priority || PRIORITY.MEDIUM, // Nilai default untuk priority
        workspace: taskToEdit.workspaceId || "", // Nilai default untuk workspace
      });
    } else if (!open) {
      handleReset();
    }
  }, [open, isEditing, taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (isEditing && !task.id) {
      console.error("Task ID is undefined. Cannot update task.");
      toast.error("Task ID is missing. Please try again.");
      return;
    }

    const newErrors = {};
    if (!task.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (!task.workspace) {
      newErrors.workspace = "Workspace is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await updateTask({
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          priority: task.priority,
          workspaceId: task.workspace,
        });

      } else {
        response = await createTask({
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          priority: task.priority,
          workspaceId: task.workspace,
        });
      }

      if (response.success) {
        toast.success(
          isEditing ? "Task updated successfully" : "Task created successfully"
        );

        if (typeof onTaskSaved === "function") {
          onTaskSaved(response.data, isEditing);
        }

        setOpen(false);
      } else {
        toast.error("Failed to save task", {
          description: response.message || "An error occurred.",
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("An error occurred while saving the task.");
    }
  };

  const handleReset = () => {
    setTask({
      title: "",
      description: "",
      deadline: "",
      status: initialStatus || STATUS.TODO,
      priority: PRIORITY.MEDIUM,
      workspace: slug || "",
    });
    setErrors({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] !max-w-full rounded-l-2xl p-4 md:p-6 bg-gray-50 border-l shadow-xl overflow-y-auto"
      >
        <SheetHeader className="mb-4 md:-ml-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h3>
          <DialogTitle className="text-sm text-gray-500">
            {isEditing
              ? "Update task details"
              : "Add new task to your workspace"}
          </DialogTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-sm font-medium block mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              autoFocus
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.title
                ? "border-red-300 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium block mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={task.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Workspace */}
          <div>
            <label
              htmlFor="workspace"
              className="text-sm font-medium block mb-1"
            >
              Workspace
            </label>
            <Select
              value={task.workspace}
              onValueChange={(value) => {
                setTask((prev) => ({ ...prev, workspace: value })); // Simpan workspace ID
                if (errors.workspace) {
                  setErrors((prev) => ({ ...prev, workspace: undefined }));
                }
              }}
            >
              <SelectTrigger
                className={`w-full border rounded-lg ${errors.workspace ? "border-red-300" : "border-gray-300"
                  }`}
              >
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {availableWorkspaces.length > 0 ? (
                  availableWorkspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="default" value="default" disabled>
                    Workspace not available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.workspace && (
              <p className="text-sm text-red-500 mt-1">{errors.workspace}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="text-sm font-medium block mb-1"
              >
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={task.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium block mb-1"
              >
                Status
              </label>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  setTask((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS.TODO}>To Do</SelectItem>
                  <SelectItem value={STATUS.ONGOING}>Ongoing</SelectItem>
                  <SelectItem value={STATUS.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="text-sm font-medium block mb-1"
            >
              Priority
            </label>
            <Select
              value={task.priority}
              onValueChange={(value) =>
                setTask((prev) => ({ ...prev, priority: value }))
              }
              defaultValue={PRIORITY.MEDIUM}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                <SelectItem value={PRIORITY.MEDIUM}>Medium</SelectItem>
                <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-300 text-gray-700 w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-400 w-full sm:w-auto cursor-pointer"
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
