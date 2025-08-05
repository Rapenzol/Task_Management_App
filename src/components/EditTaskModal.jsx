// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task); // Reset values when modal opens
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Task</h2>
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select name="priority" value={editedTask.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
