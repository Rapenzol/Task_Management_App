import React from "react";
import "./ViewCardModal.css";

const ViewTaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{task.title}</h2>
        <div className="modal-details">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span></p>
          <p><strong>Priority:</strong> <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
