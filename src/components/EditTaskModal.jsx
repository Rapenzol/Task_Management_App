import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import axios from "axios"; //  Add axios
import "./EditTaskModal.css";

const EditTaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    description: "",
    status: "To Do",
    priority: "Low",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        _id: task._id, //  MongoDB ID use karo
        title: task.title || "",
        description: task.description || "",
        status: task.status || "To Do",
        priority: task.priority || "Low",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      //  API Call for Update
      const { data } = await axios.put(
        `http://localhost:5000/tasks/${formData._id}`,
        formData
      );

      onSave(data); // Updated task return
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
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
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group description-editor">
            <label>Description</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter task description..."
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
