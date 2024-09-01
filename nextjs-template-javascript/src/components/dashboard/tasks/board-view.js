'use client';

import * as React from 'react';
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { logger } from '@/lib/default-logger';

import { ColumnItem } from './column-item';
import { ColumnList } from './column-list';
import { TaskCard } from './task-card';
import { TasksContext } from './tasks-context';

const dropAnimation = { ...defaultDropAnimation };

export function BoardView() {
  const {
    columns,
    tasks,
    setCurrentColumnId,
    setCurrentTaskId,
    createColumn,
    clearColumn,
    deleteColumn,
    createTask,
    dragTask,
  } = React.useContext(TasksContext);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [active, setActive] = React.useState(null);

  const collisionDetection = useCollisionDetection(columns, active);

  const activeTask = React.useMemo(() => {
    return active?.type === 'task' ? tasks.get(active.id) : undefined;
  }, [tasks, active]);

  const handleDragStart = React.useCallback((event) => {
    if (!canDrag(event)) {
      return;
    }

    setActive({ id: event.active.id, type: event.active.data.current.type });
  }, []);

  const handleDragOver = React.useCallback((_) => {
    // console.log('handleDragOver', event);
  }, []);

  const handleDragEnd = React.useCallback(
    (event) => {
      if (!canDrop(event)) {
        return;
      }

      dragTask(
        { id: event.active.id, type: event.active.data.current.type },
        { id: event.over.id, type: event.over.data.current.type }
      );
    },
    [dragTask]
  );

  return (
    <DndContext
      collisionDetection={collisionDetection}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <ColumnList>
        {Array.from(columns.values()).map(({ taskIds, ...column }) => {
          const tasksFiltered = taskIds
            .map((taskId) => tasks.get(taskId))
            .filter((task) => typeof task !== 'undefined');

          return (
            <ColumnItem
              column={column}
              key={column.id}
              onColumnClear={clearColumn}
              onColumnDelete={deleteColumn}
              onColumnEdit={setCurrentColumnId}
              onTaskCreate={createTask}
              onTaskOpen={setCurrentTaskId}
              tasks={tasksFiltered}
            />
          );
        })}
        <Box sx={{ flex: '0 0 auto' }}>
          <Button color="secondary" onClick={createColumn} startIcon={<PlusIcon />}>
            Add column
          </Button>
        </Box>
      </ColumnList>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div style={{ cursor: 'grab' }}>
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function useCollisionDetection(columns, active) {
  const lastOverId = React.useRef(null);

  return React.useCallback(
    (args) => {
      /**
       * Custom collision detection strategy optimized for multiple containers
       *
       * - First, find any droppable containers intersecting with the pointer.
       * - If there are none, find intersecting containers with the active draggable.
       * - If there are no intersecting containers, return the last matched intersection
       */

      if (active?.type === 'column' && columns.has(active.id)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => columns.has(container.id)),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId !== null) {
        if (columns.has(overId)) {
          const columnTasks = columns.get(overId)?.taskIds ?? [];

          if (columnTasks.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && columnTasks.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [active, columns]
  );
}

function canDrag({ active }) {
  if (active.data.current?.type !== 'task') {
    logger.warn('[DnD] onDragStart missing or invalid active type. Must be "task"');
    return false;
  }

  return true;
}

function canDrop({ active, over }) {
  if (!over) {
    // Since all draggable tasks are inside droppable columns,
    // in theory there should always be an "over".
    return false;
  }

  if (!active.data.current || !['task'].includes(active.data.current.type)) {
    // You might want to be able to drag columns.
    // We do did not implement this functionality.
    logger.warn('onDragEnd missing or invalid active type. Must be "task"');
    return false;
  }

  if (!over.data.current || !['column', 'task'].includes(over.data.current.type)) {
    logger.warn('onDragEnd missing or invalid over type, Must be "column" or "task"');
    return false;
  }

  return true;
}
