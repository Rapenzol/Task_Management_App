import React, { useState } from 'react';
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
  const [editTaskData, setEditTaskData] = useState(null); // ✅ NEW

  const addTask = (newTask) => {
    if (editTaskData) {
      // ✅ Editing existing task
      setTasks(tasks.map((task) => (task.id === editTaskData.id ? { ...newTask, id: editTaskData.id } : task)));
      setEditTaskData(null); // Clear edit mode
    } else {
      // ✅ Adding new task
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
  };

  const updateTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setEditTaskData(taskToEdit); // ✅ Send data to form
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

  return (
    <>
      <Navbar
        onSearch={setSearchTerm}
        onFilter={setPriorityFilter}
        onSort={setSortBy}
      />
      <TaskForm addTask={addTask} editTask={editTaskData} /> {/* ✅ Pass editTask */}
      <div className="board-container">
        <TaskColumn
          status="To Do"
          tasks={getFilteredTasks("To Do")}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <TaskColumn
          status="In Progress"
          tasks={getFilteredTasks("In Progress")}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <TaskColumn
          status="Done"
          tasks={getFilteredTasks("Done")}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </div>
    </>
  );
};

export default App;
