import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./AddTaskModal.css";
import api from "../api";

const AddTaskModal = ({ onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Low",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");

    try {
      const res = await api.post("/tasks", formData);
      onTaskAdded(res.data); // ✅ backend se task data
      onClose();
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
      alert(`Failed to add task: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Task</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
