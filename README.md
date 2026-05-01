# TASK-MANAGER-CRUD-APP-Task-3

A simple Task Manager CRUD application built with Node.js and Express.js. It uses in-memory storage for tasks and provides a browser-based UI for creating, reading, updating, and deleting tasks.

## Features

- Create new tasks with title, optional description, and status
- Read all tasks with search, filter, and sort support
- Update existing tasks
- Delete tasks
- In-memory storage without a database

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the browser at:

```text
http://localhost:3000
```

## API Endpoints

- `GET /api/tasks` - list tasks
- `GET /api/tasks/:id` - get a single task
- `POST /api/tasks` - create a task
- `PUT /api/tasks/:id` - update a task
- `DELETE /api/tasks/:id` - delete a task
