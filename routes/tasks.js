const express = require('express');
const pool = require('../config/db');

const router = express.Router();

function validateTaskPayload(req, res, next) {
  const { title, description, status } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string.');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string if provided.');
  }

  const allowedStatuses = ['To Do', 'In Progress', 'Completed'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push(`Status must be one of: ${allowedStatuses.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { status, search, sort } = req.query;

  let query =
    'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE user_id = ?';
  const params = [userId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  let orderBy = ' ORDER BY id DESC';
  if (sort === 'title') {
    orderBy = ' ORDER BY title ASC';
  } else if (sort === 'status') {
    orderBy = ' ORDER BY status ASC';
  }

  query += orderBy;

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(query, params);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

router.get('/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = req.user.id;

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(
      'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(tasks[0]);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

router.post('/', validateTaskPayload, async (req, res) => {
  const userId = req.user.id;
  const { title, description = '', status = 'To Do' } = req.body;

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title.trim(), description.trim(), status]
    );

    const newTask = {
      id: result.insertId,
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

router.put('/:id', validateTaskPayload, async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = req.user.id;
  const { title, description = '', status = 'To Do' } = req.body;

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await connection.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title.trim(), description.trim(), status, taskId]
    );

    const updatedTask = {
      id: taskId,
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      status,
      updated_at: new Date().toISOString(),
    };

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

router.delete('/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = req.user.id;

  const connection = await pool.getConnection();
  try {
    const [tasks] = await connection.query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await connection.query('DELETE FROM tasks WHERE id = ?', [taskId]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

module.exports = router;
