'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskForm } from '@/components/dashboard/Task/TaskForm';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/dashboard/Task/TaskCard';
import { memo } from 'react';
import { PiPlus } from 'react-icons/pi';

function KanbanColumn({ title, tasks = [], onTaskUpdate, className, workspace }) {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

  // Validasi title
  const validTitle = ['To Do', 'Ongoing', 'Done'].includes(title) ? title : 'To Do';

  // Validasi tasks
  const validTasks = Array.isArray(tasks) ? tasks.filter((task) => task && task.id && ['string', 'number'].includes(typeof task.id)) : [];

  const columnStyles = {
    'To Do': isOver ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400' : 'bg-gray-50 border-transparent hover:border-blue-200',
    Ongoing: isOver ? 'bg-yellow-100 border-yellow-400 ring-2 ring-blue-400' : 'bg-gray-50 border-transparent hover:border-yellow-200',
    Done: isOver ? 'bg-green-100 border-green-400 ring-2 ring-green-400' : 'bg-gray-50 border-transparent hover:border-blue-200',
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className={`flex flex-col min-h-[calc(100vh-12rem)] mx-2 overflow-x-hidden touch-pan-y ${className || ''}`}>
      <div className="flex items-center justify-between mb-4 px-4 py-2 bg-white rounded-t-lg shadow-sm shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">{validTitle}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{validTasks.length}</span>
        </div>
        <TaskForm
          onTaskSaved={onTaskUpdate}
          initialStatus={validTitle}
          fixedWorkspace={workspace}
          trigger={
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200">
              <PiPlus className="h-5 w-5 text-blue-600 cursor-pointer" />
            </div>
          }
        />
      </div>
      <motion.div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-4 rounded-b-lg border-2 border-dashed transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden relative ${columnStyles[validTitle]}`}
        style={{ minHeight: '600px', maxHeight: 'calc(100vh - 6rem)' }}
        animate={isOver ? { scale: 1.02, backgroundColor: columnStyles[validTitle].split(' ')[0] } : { scale: 1, backgroundColor: 'transparent' }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 overflow-y-auto py-2 px-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <SortableContext items={validTasks.map((task) => task.id.toString())} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {validTasks.length > 0 ? (
                <div className="space-y-3 min-h-full">
                  {validTasks.map((task) => (
                    <TaskCard key={task.id} task={task} status={validTitle} onTaskUpdate={onTaskUpdate} />
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                  <p className="italic">No tasks yet</p>
                  <p className="text-xs mt-1 text-gray-400">{isOver ? 'Drop here!' : 'Drop tasks here'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </SortableContext>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(KanbanColumn);
