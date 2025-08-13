// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = ({ onFilter, onSort, onSearch, onAddTaskClick }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className='navbar-title'>Task Manager</h2>
      </div>

      <div className="navbar-right">
        <select onChange={(e) => onFilter(e.target.value)}>
          <option value="">Filter by Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select onChange={(e) => onSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => onSearch(e.target.value)}
        />

        <button className="add-task-btn" onClick={onAddTaskClick}>
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default Navbar;
