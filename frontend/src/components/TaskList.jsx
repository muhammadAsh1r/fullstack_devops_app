import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>You're all caught up! No tasks pending.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

export default TaskList;
