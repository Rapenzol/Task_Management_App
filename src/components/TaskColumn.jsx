import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import ViewTaskModal from './ViewCardModal';  
import './TaskColumn.css';

const TaskColumn = ({ status, tasks = [], updateTask, deleteTask, token }) => {
  // console.log('Tasks in TaskColumn:', tasks);
  const statusClass = status?.toLowerCase().replace(/\s/g, "") || "";
  const [selectedTask, setSelectedTask] = useState(null);      // For Edit Modal
  const [viewingTask, setViewingTask] = useState(null);        // For View Modal
  const { setNodeRef } = useDroppable({ id: status });


  return (
    <div className={`column ${statusClass}`}>
      <h2>{status}</h2>

      <div ref={setNodeRef} className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onCardClick={setSelectedTask}    // Edit
            deleteTask={deleteTask}
            onViewClick={setViewingTask}     // View
          />
        ))}
      </div>

      {/* Edit Modal */}
      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => {
            updateTask(updatedTask);
            setSelectedTask(null);
          }}
          token={token}
        />
      )}

      {/* View Modal */}
      {viewingTask && (
        <ViewTaskModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskColumn;
