import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Create UI', status: 'To Do', priority: 'High' },
    { id: 2, title: 'Fix bugs', status: 'In Progress', priority: 'Medium' },
    { id: 3, title: 'Deploy app', status: 'Done', priority: 'Low' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [editTaskData, setEditTaskData] = useState(null);

  const addTask = (newTask) => {
    if (editTaskData) {
      setTasks(tasks.map((task) =>
        task.id === editTaskData.id ? { ...newTask, id: editTaskData.id } : task
      ));
      setEditTaskData(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
  };

  const updateTask = (task) => {
    setEditTaskData(task);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getFilteredTasks = (status) => {
    let filtered = tasks.filter(task => task.status === status);

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (sortBy === 'alphabetical') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'status') {
      const order = { 'To Do': 1, 'In Progress': 2, 'Done': 3 };
      filtered = filtered.sort((a, b) => order[a.status] - order[b.status]);
    }

    return filtered;
  };

  // ✅ Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedTaskId = parseInt(active.id);
    const newStatus = over.id;

    setTasks(prev =>
      prev.map(task =>
        task.id === draggedTaskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <>
      <Navbar
        onSearch={setSearchTerm}
        onFilter={setPriorityFilter}
        onSort={setSortBy}
      />
      {editTaskData && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm addTask={addTask} editTask={editTaskData} />
            <button onClick={() => setEditTaskData(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Always show TaskForm for adding new task */}
      <TaskForm addTask={addTask} editTask={null} />


      {/* ✅ Wrap in DndContext */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="board-container">
          {["To Do", "In Progress", "Done"].map(status => (
            <TaskColumn
              key={status}
              status={status}
              tasks={getFilteredTasks(status)}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default App;
