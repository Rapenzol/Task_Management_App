import React, { useState } from 'react';
import TaskCard from './TaskCard';
import './TaskColumn.css';
import EditTaskModal from './EditTaskModal';

const TaskColumn = ({ status, tasks, updateTask, deleteTask }) => {
  const statusClass = status.toLowerCase().replace(" ", "");
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className={`column ${statusClass}`}>
      <h2>{status}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
          onCardClick={setSelectedTask}
        />
      ))}
      <EditTaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default TaskColumn;
