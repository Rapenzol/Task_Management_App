import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import './TaskColumn.css';

const TaskColumn = ({ status, tasks, updateTask, deleteTask }) => {
  const statusClass = status.toLowerCase().replace(" ", "");
  const [selectedTask, setSelectedTask] = useState(null);
  const { setNodeRef } = useDroppable({ id: status });

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

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => {
            updateTask(updatedTask);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskColumn;
