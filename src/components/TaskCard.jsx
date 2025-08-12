import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './TaskCard.css';

const TaskCard = ({ task, onCardClick, deleteTask }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)`: undefined,
    borderLeft: `6px solid ${getPriorityColor(task.priority)}`,
  };
  function getPriorityColor(priority) {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
      default:
        return 'green';
    }
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="task-card"
    >
      <div className="task-option">
        <div className="task-title" {...listeners}>
          {task.title}
        </div>
        <div className="task-actions">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(task); // Edit task
            }}
          >
            ✏️
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id); // Delete task
            }}
          >
            🗑
          </button>
        </div>

      </div>
      {task.description && (
        <div className="task-desc">
          {task.description}
        </div>
      )}


    </div>
  );
};

export default TaskCard;
