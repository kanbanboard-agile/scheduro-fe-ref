"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { cn, PRIORITY } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { updateTask, deleteTask } from "@/lib/api/task";
import { getPriorityBadgeStyles } from "@/lib/utils";

const TaskCard = React.memo(({ task, status, onTaskUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [isDraggingStarted, setIsDraggingStarted] = useState(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  // Validasi task
  if (!task || !task.id) {
    console.warn("Invalid task in TaskCard:", task);
    return null;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { status },
  });

  useEffect(() => {
    setIsDraggingStarted(isDragging);
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0.2s ease" : transition,
    zIndex: isDragging ? 9999 : 0,
  };

  useEffect(() => {
    const preventDragAndOpenDialog = (e) => {
      if (isDraggingStarted) {
        // console.log("Blocked dialog open due to dragging");
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      handleOpenDialog();
    };

    const titleElement = titleRef.current;
    const descElement = descriptionRef.current;

    if (titleElement) {
      titleElement.addEventListener("click", preventDragAndOpenDialog);
      titleElement.addEventListener("touchend", preventDragAndOpenDialog, {
        passive: false,
      });
    }

    if (descElement) {
      descElement.addEventListener("click", preventDragAndOpenDialog);
      descElement.addEventListener("touchend", preventDragAndOpenDialog, {
        passive: false,
      });
    }

    return () => {
      if (titleElement) {
        titleElement.removeEventListener("click", preventDragAndOpenDialog);
        titleElement.removeEventListener("touchend", preventDragAndOpenDialog);
      }
      if (descElement) {
        descElement.removeEventListener("click", preventDragAndOpenDialog);
        descElement.removeEventListener("touchend", preventDragAndOpenDialog);
      }
    };
  }, [isDraggingStarted]);

  const handleOpenDialog = () => {
    if (!isDraggingStarted) {
      // console.log("Opening dialog for task:", task);
      setEditedTask({
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
      });
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditedTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field, value) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTask = async () => {
    try {
      if (!editedTask?.id) throw new Error("Task ID is missing");
      if (!editedTask.title.trim()) throw new Error("Title cannot be empty");
      const formattedTask = {
        ...editedTask,
        id: editedTask.id.toString(),
        deadline: editedTask.deadline ? new Date(editedTask.deadline).toISOString() : null,
        status: editedTask.status || status,
      };
      // console.log("Sending updated task to API:", formattedTask);
      const response = await updateTask(formattedTask);
      // console.log("Update task response:", response);
      if (!response.success) throw new Error(response.message || "Failed to update task");
      const updatedTask = response.data?.task || response.data;
      if (!updatedTask || !updatedTask.id) {
        throw new Error("Invalid task data in API response");
      }
      // console.log("Task updated:", updatedTask);
      onTaskUpdate({ ...updatedTask, id: updatedTask.id.toString() });
      toast.success("Task updated successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (!task?.id) throw new Error("Task ID is missing");
      // console.log("Deleting task with ID:", task.id);
      const response = await deleteTask({ id: task.id.toString() });
      // console.log("Delete task response:", response);
      if (!response.success) throw new Error(response.message || "Failed to delete task");
      // console.log("Task deleted, ID:", task.id);
      onTaskUpdate(null, task.id.toString());
      toast.success("Task deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error, { status: error.status, contentType: error.contentType });
      toast.error(error.message || "Failed to delete task");
    }
  };

  const handleOpenDeleteDialog = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const formattedTime = task.deadline
    ? new Date(task.deadline).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "No Deadline";

  return (
    <>
      <motion.div
        layout
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <motion.div
          ref={setNodeRef}
          style={style}
          className={cn(
            `group relative rounded-xl border bg-white shadow-md 
       hover:shadow-lg hover:-translate-y-1 
       transition-all duration-200 cursor-grab p-4 
       focus:outline-none focus:ring-2 focus:ring-blue-400`,
            isDragging && "opacity-80 scale-[1.03] ring-2 ring-blue-300"
          )}
          {...attributes}
          {...listeners}
          tabIndex={0}
        >
          <div className="flex flex-col gap-3 h-full">
            {/* Top Area: Title and Delete */}
            <div className="flex items-start justify-between">
              <h3
                ref={titleRef}
                className="text-base font-semibold leading-tight text-gray-800 hover:text-blue-600 hover:underline cursor-pointer line-clamp-2"
              >
                {task.title}
              </h3>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isDragging ? 0 : 1 }}
                whileHover={{ scale: 1.1 }}
                onMouseDown={handleOpenDeleteDialog}
                onTouchStart={handleOpenDeleteDialog}
                className="hidden group-hover:flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </motion.button>
            </div>

            {/* Priority Badge */}
            {task.priority && (
              <div className="self-start">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold py-0.5 px-2 rounded-md",
                    ...getPriorityBadgeStyles(task.priority)
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <p
                ref={descriptionRef}
                className="text-sm text-gray-600 leading-snug line-clamp-3"
              >
                {task.description}
              </p>
            )}

            {/* Footer: Deadline */}
            <div className="flex items-center justify-between border-t pt-2 mt-auto text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editedTask.title || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedTask.description || ""}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTask.priority || PRIORITY.LOW}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
                    <SelectItem value={PRIORITY.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedTask.status || status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={editedTask.deadline || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;