import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { ClipboardList } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://app-taskapp-backend-yourname-gxccb0e2cwf2a6fj.southeastasia-01.azurewebsites.net/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      setTasks([response.data, ...tasks]);
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task.');
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task.');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <ClipboardList className="header-icon" size={32} />
          <h1>Task Manager</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <TaskForm onAdd={addTask} />
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onUpdate={updateTask} 
              onDelete={deleteTask} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
