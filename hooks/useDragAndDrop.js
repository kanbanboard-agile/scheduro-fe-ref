"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import {
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner"; // Impor toast

export function useDragAndDrop(tasks, statuses, saveToLocalStorage, setTask) {
    const [activeId, setActiveId] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const tasksRef = useRef(tasks);

    tasksRef.current = tasks;

    const sensors = useSensors(useSensor(PointerSensor));

    const dropAnimation = useMemo(
        () => ({
            sideEffects: defaultDropAnimationSideEffects({
                styles: {
                    active: {
                        opacity: "0.5",
                    },
                },
            }),
        }),
        []
    );

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        setActiveId(active.id);
        const draggedCard = tasksRef.current.find((task) => task.id === active.id);
        setActiveCard(draggedCard);
    }, []);

    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;

            setActiveId(null);
            setActiveCard(null);

            if (!over || active.id === over.id) return;

            const oldIndex = tasksRef.current.findIndex(
                (task) => task.id === active.id
            );
            if (oldIndex === -1) return;

            const updatedTask = [...tasksRef.current];
            const draggedCard = updatedTask[oldIndex];

            if (statuses.includes(over.id)) {
                const oldStatus = draggedCard.status; // Simpan status lama
                draggedCard.status = over.id; // Perbarui status
                const newStatus = draggedCard.status;

                // Tampilkan toast jika status berubah
                if (oldStatus !== newStatus) {
                    toast.success("Status updated", {
                        description: `Task "${draggedCard.title}" has been moved to "${newStatus}".`,
                    });
                }

                const newTask = [
                    ...updatedTask.filter((task) => task.id !== active.id),
                    draggedCard,
                ];
                setTask(newTask);
                saveToLocalStorage(newTask);
            } else {
                const newIndex = tasksRef.current.findIndex(
                    (task) => task.id === over.id
                );
                if (newIndex === -1) return;

                const overCardStatus = tasksRef.current[newIndex].status;
                const oldStatus = draggedCard.status; // Simpan status lama
                if (draggedCard.status !== overCardStatus) {
                    draggedCard.status = overCardStatus;
                    const newStatus = draggedCard.status;

                    // Tampilkan toast jika status berubah
                    if (oldStatus !== newStatus) {
                        toast.success("Status updated", {
                            description: `Task "${draggedCard.title}" has been moved to "${newStatus}".`,
                        });
                    }
                }

                const newTask = arrayMove(updatedTask, oldIndex, newIndex);
                setTask(newTask);
                saveToLocalStorage(newTask);
            }
        },
        [statuses, saveToLocalStorage, setTask]
    );

    return {
        sensors,
        handleDragStart,
        handleDragEnd,
        dropAnimation,
        activeId,
        activeCard,
    };
}
