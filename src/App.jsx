import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import TaskColumn from "./components/TaskColumn";
import EditTaskModal from "./components/EditTaskModal";
import Navbar from "./components/Navbar";
import ViewTaskModal from "./components/ViewCardModal";
import AddTaskModal from "./components/AddTaskModal";
import Login from "./components/LoginForm";
import Register from "./components/Register";
import api from "./api";
import "react-quill-new/dist/quill.snow.css";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [token, setToken] = useState(null);

  // Fetch tasks when token exists
  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response?.status === 401) setToken(null);
      }
    };

    fetchTasks();
  }, [token]);

  // Add task
  const addTask = async (newTask) => {
    try {
      const res = await api.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, res.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update task
  const updateTask = async (updatedTask) => {
    try {
      const res = await api.put(`/tasks/${updatedTask._id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? res.data : t)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task) => setEditingTask(task);
  const handleCloseModal = () => setEditingTask(null);

  const handleViewClick = (task) => setViewingTask(task);
  const handleCloseViewModal = () => setViewingTask(null);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      const taskToUpdate = tasks.find((t) => t._id === taskId);
      const updatedTask = { ...taskToUpdate, status: newStatus };
      const res = await api.put(`/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleFilter = (value) => setFilter(value);
  const handleSort = (value) => setSortBy(value);
  const handleSearch = (value) => setSearchTerm(value.toLowerCase());

  const handleLogout = () => setToken(null); // ✅ just clear state

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filter ? t.priority === filter : true;
    const matchesSearch = searchTerm ? t.title.toLowerCase().includes(searchTerm) : true;
    return matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  const Dashboard = () => (
    <div className="App">
      <Navbar
        onFilter={handleFilter}
        onSort={handleSort}
        onSearch={handleSearch}
        onAddTaskClick={() => setShowAddModal(true)}
        onLogout={handleLogout}
      />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="board-container">
          {["To Do", "In Progress", "Done"].map((status) => (
            <TaskColumn
              key={status}
              status={status}
              id={status}
              tasks={sortedTasks.filter((t) => t.status === status)}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onAddTaskClick={() => setShowAddModal(true)}
            />
          ))}
        </div>
      </DndContext>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onTaskAdded={addTask} />}
      {editingTask && <EditTaskModal task={editingTask} onSave={updateTask} onClose={handleCloseModal} />}
      {viewingTask && <ViewTaskModal task={viewingTask} onClose={handleCloseViewModal} />}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
