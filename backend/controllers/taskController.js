const db = require('../db/config');

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await db.query(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title, description || '']
        );

        // Fetch the newly created task
        const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        
        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        // Ensure task exists
        const [existingTasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existingTasks.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const currentTask = existingTasks[0];
        
        // Use new values or fallback to current values
        const updateTitle = title !== undefined ? title : currentTask.title;
        const updateDesc = description !== undefined ? description : currentTask.description;
        const updateStatus = status !== undefined ? status : currentTask.status;

        await db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
            [updateTitle, updateDesc, updateStatus, id]
        );

        // Return updated task
        const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully', id });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
