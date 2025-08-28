import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import TaskColumn from './components/TaskColumn';
import EditTaskModal from './components/EditTaskModal';
import Navbar from './components/Navbar';
import ViewTaskModal from './components/ViewCardModal';
import AddTaskModal from './components/AddTaskModal';
import api from './api'; //  Axios instance import kiya
import 'react-quill-new/dist/quill.snow.css';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Add task
  const addTask = async (newTask) => {
    try {
      const res = await api.post('/tasks', newTask);
      setTasks([...tasks, res.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Update task
  const updateTask = async (updatedTask) => {
    try {
      const res = await api.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks(tasks.map(task => task._id === updatedTask._id ? res.data : task));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task) => setEditingTask(task);
  const handleCloseModal = () => setEditingTask(null);

  // ✅ Open view modal
  const handleViewClick = (task) => setViewingTask(task);

  // ✅ Close view modal
  const handleCloseViewModal = () => setViewingTask(null);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      const updatedTask = { ...taskToUpdate, status: newStatus };
      const res = await api.put(`/tasks/${taskId}`, updatedTask);

      setTasks(tasks.map(task => task._id === taskId ? res.data : task));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleFilter = (value) => setFilter(value);
  const handleSort = (value) => setSortBy(value);
  const handleSearch = (value) => setSearchTerm(value.toLowerCase());

  // ✅ Filtered + Sorted tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filter ? task.priority === filter : true;
    const matchesSearch = searchTerm
      ? task.title.toLowerCase().includes(searchTerm)
      : true;
    return matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    else if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="App">
      <Navbar
        onFilter={handleFilter}
        onSort={handleSort}
        onSearch={handleSearch}
        onAddTaskClick={() => setShowAddModal(true)}
      />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="board-container">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <TaskColumn
              key={status}
              status={status}
              id={status}
              tasks={sortedTasks.filter((task) => task.status === status)}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onAddTaskClick={() => setShowAddModal(true)}
            />
          ))}
        </div>
      </DndContext>

      {showAddModal && (
        <AddTaskModal 
        onClose={() => setShowAddModal(false)} 
        onTaskAdded={addTask} />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={updateTask}
          onClose={handleCloseModal}
        />
      )}
      {/* View Modal */}
      {viewingTask && (
        <ViewTaskModal
          task={viewingTask}
          onClose={handleCloseViewModal}
        />
      )}
    </div>
  );
};

export default App;
