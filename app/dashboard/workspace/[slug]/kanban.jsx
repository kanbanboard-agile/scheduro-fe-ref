'use client';

import { DndContext, useSensor, useSensors, KeyboardSensor, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState, useCallback, useMemo, useEffect } from 'react';
import KanbanColumn from '@/components/dashboard/workspace/KanbanColumn';
import TaskCard from '@/components/dashboard/Task/TaskCard';
import { updateTask } from '@/lib/api/task';
import { toast } from 'sonner';

// Performance optimization: Use a simple collision detection algorithm
const simpleCollisionDetection = ({ collisionRect, droppableRects, droppableContainers }) => {
  const intersections = [];

  for (const droppableContainer of droppableContainers) {
    const { id } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect && testIntersection(rect, collisionRect)) {
      intersections.push({
        id,
        data: { droppableContainer },
      });
    }
  }

  return intersections;
};

// Simple rectangle intersection test
function testIntersection(rect1, rect2) {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}

export default function KanbanPage({ workspace, tasks: initialTasks }) {
  // Use memoized initial state to prevent unnecessary re-renders
  const initialTaskState = useMemo(
    () =>
      initialTasks || {
        'To Do': [],
        Ongoing: [],
        Done: [],
      },
    [initialTasks]
  );

  const [tasks, setTasks] = useState(initialTaskState);
  const [activeTask, setActiveTask] = useState(null);

  // Sync tasks when initialTasks changes (for new generated tasks)
  useEffect(() => {
    //console.log('KanbanPage useEffect - initialTasks changed:', initialTasks);
    //console.log('Current tasks state:', tasks);
    
    if (initialTasks) {
      setTasks(initialTasks);
      //console.log('Updated tasks state to:', initialTasks);
    }
  }, [initialTasks]);

  // Optimized sensors with higher activation thresholds to reduce false triggers
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 }, // Increased from 2 to 5
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 10 }, // Added delay, increased tolerance
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    keyboardCodes: {
      start: ['Enter', 'Space'],
      cancel: ['Escape'],
      end: ['Enter', 'Space'],
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // Memoize the column lookup for faster access during drag operations
  const findColumnForTask = useCallback(
    (taskId) => {
      for (const column in tasks) {
        if (tasks[column].some((task) => task.id == taskId)) {
          return column;
        }
      }
      return null;
    },
    [tasks]
  );

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      const activeId = active.id;
      const sourceColumn = findColumnForTask(activeId);

      if (sourceColumn) {
        const foundTask = tasks[sourceColumn].find((task) => task.id == activeId);
        setActiveTask(foundTask);
      }
    },
    [tasks, findColumnForTask]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over || active.id === over.id) return;

      const sourceColumn = findColumnForTask(active.id);
      if (!sourceColumn) return;

      const taskToMove = tasks[sourceColumn].find((task) => task.id == active.id);
      if (!taskToMove) return;

      // Determine target column
      const columns = ['To Do', 'Ongoing', 'Done'];
      const targetColumn = columns.includes(over.id) ? over.id : findColumnForTask(over.id);

      if (!targetColumn || !Array.isArray(tasks[targetColumn])) return;

      // Create new tasks state with immutable operations
      const updatedTasks = { ...tasks };

      if (sourceColumn === targetColumn) {
        // Reordering within the same column
        const oldIndex = tasks[targetColumn].findIndex((task) => task.id == active.id);
        const newIndex = tasks[targetColumn].findIndex((task) => task.id == over.id);
        updatedTasks[targetColumn] = arrayMove(tasks[targetColumn], oldIndex, newIndex);
      } else {
        // Moving to a different column
        const updatedSource = tasks[sourceColumn].filter((task) => task.id != active.id);
        const updatedTarget = [...tasks[targetColumn], { ...taskToMove, status: targetColumn }];

        // Sort by deadline using optimized comparator
        const sortedTarget = updatedTarget.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });

        updatedTasks[sourceColumn] = updatedSource;
        updatedTasks[targetColumn] = sortedTarget;
      }

      // Update state immediately for responsive UI
      setTasks(updatedTasks);

      // Perform API update in the background
      try {
        const response = await updateTask({
          ...taskToMove,
          status: targetColumn,
        });

        if (!response.success) throw new Error('Failed to update task');
        toast.success(`Task moved to ${targetColumn}`);
      } catch (error) {
        setTasks(tasks); // Revert to original tasks on error
        toast.error('Error updating task status');
      }
    },
    [tasks, findColumnForTask]
  );

  const updateTaskInState = useCallback((updatedTask, deletedTaskId) => {
    setTasks((prevTasks) => {
      // Handle task deletion
      if (deletedTaskId) {
        const newTasks = {};
        for (const column in prevTasks) {
          newTasks[column] = prevTasks[column].filter((t) => t.id != deletedTaskId);
        }
        return newTasks;
      }

      // Handle task update
      if (!updatedTask || !updatedTask.id) return prevTasks;

      // Create a shallow copy of the state
      const newTasks = { ...prevTasks };

      // Remove task from previous column
      for (const column in newTasks) {
        const taskIndex = newTasks[column].findIndex((t) => t.id == updatedTask.id);
        if (taskIndex !== -1) {
          newTasks[column] = [...newTasks[column]];
          newTasks[column].splice(taskIndex, 1);
          break;
        }
      }

      // Add task to the target column
      const targetColumn = updatedTask.status && ['To Do', 'Ongoing', 'Done'].includes(updatedTask.status) ? updatedTask.status : 'To Do';

      newTasks[targetColumn] = [...newTasks[targetColumn], updatedTask];

      // Sort by deadline
      newTasks[targetColumn].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });

      return newTasks;
    });
  }, []);

  // Memoize dropAnimation to prevent unnecessary re-renders
  const dropAnimation = useMemo(
    () => ({
      sideEffects: defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: '0.5',
          },
        },
      }),
    }),
    []
  );

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={simpleCollisionDetection}>
      <div className="flex flex-col sm:flex-row gap-4 p-4 overflow-x-auto">
        {['To Do', 'Ongoing', 'Done'].map((column) => (
          <KanbanColumn key={column} title={column} tasks={tasks[column] || []} onTaskUpdate={updateTaskInState} className="w-full sm:w-1/3" workspace={workspace} />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="opacity-80 w-full max-w-[300px] shadow-xl">
            <TaskCard task={activeTask} status={activeTask.status} onTaskUpdate={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
