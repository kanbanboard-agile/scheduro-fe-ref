import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { STATUS, PRIORITY } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { getUserWorkspaces } from '@/lib/api/workspace';
import { useAuth } from '@/lib/AuthContext';
import { createTask, updateTask } from '@/lib/api/task';

export function TaskForm({ slug, onTaskSaved, initialStatus, trigger, isEditing = false, taskToEdit = null, fixedWorkspace = null }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: initialStatus || STATUS.TODO,
    priority: PRIORITY.MEDIUM,
    workspace: fixedWorkspace?.id || '',
  });
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [errors, setErrors] = useState({});
  const titleMaxLength = 60;
  const descMaxLength = 254;

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        if (!user || !user.id) {
          toast.error('User ID is not available. Please log in again.');
          setLoading(false);
          return;
        }

        const userId = user.id;
        const response = await getUserWorkspaces(userId);

        if (response.success) {
          const workspaceData = response.data.map((item) => item.workspace);
          setAvailableWorkspaces(workspaceData);
        } else {
          toast.error('Failed to fetch workspaces from API');
        }
      } catch (error) {
        toast.error('Error fetching workspaces: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (open && !fixedWorkspace) {
      fetchWorkspaces();
    } else {
      setLoading(false);
    }
  }, [open, user, fixedWorkspace]);

  useEffect(() => {
    if (open && isEditing && taskToEdit) {
      setTask({
        id: taskToEdit.id || '',
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        deadline: taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '',
        status: taskToEdit.status || STATUS.TODO,
        priority: taskToEdit.priority || PRIORITY.MEDIUM,
        workspace: fixedWorkspace?.id || taskToEdit.workspaceId || '',
      });
    } else if (!open) {
      handleReset();
    }
  }, [open, isEditing, taskToEdit, fixedWorkspace]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' && value.length > titleMaxLength) return;
    if (name === 'description' && value.length > descMaxLength) return;

    setTask((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!task.title.trim()) newErrors.title = 'Task title is required';
    if (!task.workspace) newErrors.workspace = 'Workspace is required';
    if (!task.deadline) newErrors.deadline = 'Deadline is required';
    if (!task.status) newErrors.status = 'Status is required';
    if (!task.priority) newErrors.priority = 'Priority is required';

    // Validasi tambahan untuk deadline (opsional: tidak boleh di masa lalu)
    if (task.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (task.deadline < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (isEditing && !task.id) {
      toast.error('Task ID is missing. Please try again.');
      return;
    }

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly.');
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
        toast.success(isEditing ? 'Task updated successfully' : 'Task created successfully');
        if (typeof onTaskSaved === 'function') {
          onTaskSaved(response.data, isEditing);
        }
        setOpen(false);
      } else {
        toast.error(response.message || 'Failed to save task');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred while saving the task.');
    }
  };

  const handleReset = () => {
    setTask({
      title: '',
      description: '',
      deadline: '',
      status: initialStatus || STATUS.TODO,
      priority: PRIORITY.MEDIUM,
      workspace: fixedWorkspace?.id || '',
    });
    setErrors({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] !max-w-full rounded-l-2xl p-4 md:p-6 bg-gray-50 border-l shadow-xl overflow-y-auto">
        <SheetHeader className="mb-4 md:-ml-4">
          <h3 className="text-lg font-semibold">{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
          <DialogTitle className="text-sm text-gray-500">{isEditing ? 'Update task details' : 'Add new task to your workspace'}</DialogTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.title ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${task.title.length >= titleMaxLength ? 'text-red-500' : 'text-gray-500'}`}>
                {task.title.length}/{titleMaxLength}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium block mb-1">
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
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${task.description.length >= descMaxLength ? 'text-red-500' : 'text-gray-500'}`}>
                {task.description.length}/{descMaxLength}
              </span>
            </div>
          </div>

          {fixedWorkspace ? (
            <div>
              <label className="text-sm font-medium block mb-1">Workspace</label>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700">{fixedWorkspace.name}</div>
            </div>
          ) : (
            <div>
              <label htmlFor="workspace" className="text-sm font-medium block mb-1">
                Workspace
              </label>
              <Select
                value={task.workspace}
                onValueChange={(value) => {
                  setTask((prev) => ({ ...prev, workspace: value }));
                  if (errors.workspace) setErrors((prev) => ({ ...prev, workspace: undefined }));
                }}
              >
                <SelectTrigger className={`w-full border rounded-lg ${errors.workspace ? 'border-red-300' : 'border-gray-300'}`}>
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
              {errors.workspace && <p className="text-sm text-red-500 mt-1">{errors.workspace}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deadline" className="text-sm font-medium block mb-1">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={task.deadline}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.deadline ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
              />
              {errors.deadline && <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>}
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-medium block mb-1">
                Status
              </label>
              <Select
                value={task.status}
                onValueChange={(value) => {
                  setTask((prev) => ({ ...prev, status: value }));
                  if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }));
                }}
              >
                <SelectTrigger className={`w-full border rounded-lg ${errors.status ? 'border-red-300' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS.TODO}>To Do</SelectItem>
                  <SelectItem value={STATUS.ONGOING}>Ongoing</SelectItem>
                  <SelectItem value={STATUS.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="text-sm font-medium block mb-1">
              Priority
            </label>
            <Select
              value={task.priority}
              onValueChange={(value) => {
                setTask((prev) => ({ ...prev, priority: value }));
                if (errors.priority) setErrors((prev) => ({ ...prev, priority: undefined }));
              }}
              defaultValue={PRIORITY.MEDIUM}
            >
              <SelectTrigger className={`w-full border rounded-lg ${errors.priority ? 'border-red-300' : 'border-gray-300'}`}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                <SelectItem value={PRIORITY.MEDIUM}>Medium</SelectItem>
                <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button type="button" variant="outline" className="bg-gray-300 text-gray-700 w-full sm:w-auto" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-400 w-full sm:w-auto cursor-pointer">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
