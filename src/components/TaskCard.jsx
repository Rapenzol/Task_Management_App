import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './TaskCard.css';

const TaskCard = ({ task, onCardClick, deleteTask }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card"
    >
      <div className="task-title">{task.title}</div>
      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick(task); // ✅ Only open modal/edit form
          }}
        >
          ✏️
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
