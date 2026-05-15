import React, { useState } from 'react';
import { Trash2, Edit2, X, Check } from 'lucide-react';

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const isCompleted = task.status === 'completed';

  const handleToggleStatus = () => {
    onUpdate(task.id, { 
      status: isCompleted ? 'pending' : 'completed' 
    });
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isEditing) {
    return (
      <div className="task-item">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            rows="2"
          />
          <div className="edit-actions">
            <button className="btn-secondary btn-icon" onClick={handleCancelEdit} title="Cancel">
              <X size={18} />
            </button>
            <button className="btn-primary btn-icon" onClick={handleSaveEdit} title="Save" disabled={!editTitle.trim()}>
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-checkbox-container">
        <input 
          type="checkbox" 
          className="task-checkbox"
          checked={isCompleted}
          onChange={handleToggleStatus}
        />
      </div>
      
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          Created: {formatDate(task.created_at)}
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          className="btn-icon" 
          onClick={() => setIsEditing(true)}
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button 
          className="btn-icon btn-danger" 
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
