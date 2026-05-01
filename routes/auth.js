const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required and must be a non-empty string.');
  }

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const connection = await pool.getConnection();
  try {
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username.trim(), email.trim()]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username.trim(), email.trim(), hashedPassword, 'user']
    );

    const newUser = {
      id: result.insertId,
      username: username.trim(),
      email: email.trim(),
      role: 'user',
    };

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username is required.');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const connection = await pool.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE username = ?',
      [username.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    connection.release();
  }
});

module.exports = router;
