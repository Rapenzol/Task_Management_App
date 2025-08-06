import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import './TaskColumn.css';
import EditTaskModal from './EditTaskModal';

const TaskColumn = ({ status, tasks, updateTask, deleteTask }) => {
  const statusClass = status.toLowerCase().replace(" ", "");
  const [selectedTask, setSelectedTask] = useState(null);

  // DND-kit: droppable setup
  const { setNodeRef } = useDroppable({
    id: status, // id must match column identifier
  });

  return (
    <div className={`column ${statusClass}`}>
      <h2>{status}</h2>
      <div ref={setNodeRef} className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
            onCardClick={setSelectedTask}
          />
        ))}
      </div>

      {/* Modal open on edit */}
      <EditTaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};
export default TaskColumn;
