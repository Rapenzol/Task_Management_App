import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import TaskColumn from './components/TaskColumn';
import EditTaskModal from './components/EditTaskModal';
import Navbar from './components/Navbar';
import ViewTaskModal from './components/ViewCardModal';
import AddTaskModal from './components/AddTaskModal';
import 'react-quill-new/dist/quill.snow.css';
import './App.css';


const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  // open view modal
  const handleViewClick = (task) => {
    setViewingTask(task);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setViewingTask(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleFilter = (value) => {
    setFilter(value);
  };
  
  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filter ? task.priority === filter : true;
    const matchesSearch = searchTerm
      ? task.title.toLowerCase().includes(searchTerm)
      : true;
    return matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="App">
      <Navbar onFilter={handleFilter} onSort={handleSort} onSearch={handleSearch} onAddTaskClick={() => setShowAddModal(true)}/>
      {/* <TaskForm addTask={addTask} /> */}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="board-container">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={sortedTasks.filter((task) => task.status === status)}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onAddTaskClick={() =>setShowAddModal(true)}
            />
          ))}
        </div>
      </DndContext>

       {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} onAddTask={addTask} />
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
