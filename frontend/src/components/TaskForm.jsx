import React, { useState } from 'react';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ title, description });
    
    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="task-form-card">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title <span style={{color: 'var(--color-danger)'}}>*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            rows="2"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={!title.trim()}>
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
