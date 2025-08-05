import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onCardClick, updateTask, deleteTask }) => {
  return (
    <div className="task-card" onClick={() => onCardClick(task)}>
      <div className="task-title">{task.title}</div>
      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            updateTask(task); // ID ke jagah pura task bhejo
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
