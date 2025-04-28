"use client";

import {
  DndContext,
  useSensor,
  useSensors,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  rectIntersection,
} from "@dnd-kit/core";
import { useState, useCallback } from "react";
import KanbanColumn from "@/components/dashboard/workspace/KanbanColumn";
import TaskCard from "@/components/dashboard/Task/TaskCard";
import { updateTask } from "@/lib/api/task";
import { toast } from "sonner";

export default function KanbanPage({ workspace, tasks: initialTasks }) {
  const [tasks, setTasks] = useState(
    initialTasks || {
      "To Do": [],
      Ongoing: [],
      Done: [],
    }
  );
  const [activeTask, setActiveTask] = useState(null);

  console.log("KanbanPage tasks:", tasks); // Debugging

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 2 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 0, tolerance: 8 },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    keyboardCodes: {
      start: ["Enter", "Space"],
      cancel: ["Escape"],
      end: ["Enter", "Space"],
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;

    for (const column in tasks) {
      const foundTask = tasks[column].find((task) => task.id == activeId);
      if (foundTask) {
        setActiveTask(foundTask);
        break;
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const sourceColumn = Object.keys(tasks).find((key) =>
      tasks[key].some((task) => task.id == active.id)
    );
    const targetColumn = over.id;

    if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
      const taskToMove = tasks[sourceColumn].find((task) => task.id == active.id);
      if (!taskToMove) {
        console.warn("Task to move not found:", active.id);
        return;
      }

      const updatedSource = tasks[sourceColumn].filter((task) => task.id != active.id);
      const updatedTarget = [...tasks[targetColumn], { ...taskToMove, status: targetColumn }];

      const sortedTarget = updatedTarget.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [sourceColumn]: updatedSource,
        [targetColumn]: sortedTarget,
      }));

      try {
        const response = await updateTask({
          ...taskToMove,
          status: targetColumn,
        });

        if (response.success) {
          toast.success(`Task moved to ${targetColumn}`);
        } else {
          setTasks((prevTasks) => ({
            ...prevTasks,
            [sourceColumn]: [...prevTasks[sourceColumn], taskToMove],
            [targetColumn]: prevTasks[targetColumn].filter((task) => task.id != taskToMove.id),
          }));
          toast.error("Failed to update task status");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        setTasks((prevTasks) => ({
          ...prevTasks,
          [sourceColumn]: [...prevTasks[sourceColumn], taskToMove],
          [targetColumn]: prevTasks[targetColumn].filter((task) => task.id != taskToMove.id),
        }));
        toast.error("Error updating task status");
      }
    }
  };

  const updateTaskInState = useCallback((updatedTask, deletedTaskId) => {
    console.log("updateTaskInState called with:", { updatedTask, deletedTaskId }); // Debugging
    setTasks((prevTasks) => {
      const newTasks = {
        "To Do": [...prevTasks["To Do"]],
        Ongoing: [...prevTasks["Ongoing"]],
        Done: [...prevTasks["Done"]],
      };

      if (deletedTaskId) {
        // Hapus task dari semua kolom
        for (const column in newTasks) {
          newTasks[column] = newTasks[column].filter((t) => t.id != deletedTaskId);
        }
        console.log("Task deleted, new state:", newTasks);
        return newTasks;
      }

      if (!updatedTask || !updatedTask.id) {
        console.warn("Invalid updated task:", updatedTask);
        return prevTasks;
      }

      // Cari task di semua kolom
      let taskFound = false;
      for (const column in newTasks) {
        const taskIndex = newTasks[column].findIndex((t) => t.id == updatedTask.id);
        if (taskIndex !== -1) {
          taskFound = true;
          // Hapus task dari kolom lama
          newTasks[column].splice(taskIndex, 1);
          break;
        }
      }

      // Tambahkan task ke kolom baru berdasarkan status
      const targetColumn = updatedTask.status && ["To Do", "Ongoing", "Done"].includes(updatedTask.status)
        ? updatedTask.status
        : "To Do"; // Fallback ke To Do
      newTasks[targetColumn].push({ ...updatedTask });

      // Urutkan kolom berdasarkan deadline
      newTasks[targetColumn].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });

      console.log("Task updated, new state:", newTasks);
      return newTasks;
    });
  }, []);

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={rectIntersection}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 overflow-x-auto">
        <KanbanColumn
          title="To Do"
          tasks={tasks["To Do"] || []}
          onTaskUpdate={updateTaskInState}
          className="w-full sm:w-1/3"
        />
        <KanbanColumn
          title="Ongoing"
          tasks={tasks["Ongoing"] || []}
          onTaskUpdate={updateTaskInState}
          className="w-full sm:w-1/3"
        />
        <KanbanColumn
          title="Done"
          tasks={tasks["Done"] || []}
          onTaskUpdate={updateTaskInState}
          className="w-full sm:w-1/3"
        />
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="opacity-80 w-full max-w-[300px] shadow-xl">
            <TaskCard task={activeTask} status={activeTask.status} onTaskUpdate={() => { }} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}