const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedStatuses = ['To Do', 'In Progress', 'Completed'];
let tasks = [];
let nextId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function validateTaskPayload(req, res, next) {
  const { title, description, status } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string.');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string if provided.');
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    errors.push(`Status must be one of: ${allowedStatuses.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

app.get('/api/tasks', (req, res) => {
  let result = [...tasks];
  const { status, search, sort } = req.query;

  if (status) {
    result = result.filter((task) => task.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter((task) =>
      task.title.toLowerCase().includes(searchLower) ||
      (task.description || '').toLowerCase().includes(searchLower)
    );
  }

  if (sort === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'status') {
    result.sort((a, b) => a.status.localeCompare(b.status));
  } else if (sort === 'id') {
    result.sort((a, b) => a.id - b.id);
  }

  res.json(result);
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = getTaskById(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  res.json(task);
});

app.post('/api/tasks', validateTaskPayload, (req, res) => {
  const { title, description = '', status = 'To Do' } = req.body;
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', validateTaskPayload, (req, res) => {
  const id = Number(req.params.id);
  const task = getTaskById(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description = '', status = 'To Do' } = req.body;
  task.title = title.trim();
  task.description = description.trim();
  task.status = status;
  task.updatedAt = new Date().toISOString();

  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Task Manager server running on http://localhost:${PORT}`);
});
