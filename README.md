# TASK-MANAGER-CRUD-APP-Task-3

A profile-based Task Manager CRUD application built with Node.js, Express.js, and MySQL. Features JWT authentication, role-based access control, and per-user task management.

## Features

- User authentication with JWT tokens
- Password hashing with bcrypt
- Role-based access control (admin, user)
- Per-user task management
- Search, filter, and sort support
- MySQL database for persistent storage
- Comprehensive error handling and validation

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs

## Prerequisites

- Node.js 14+
- MySQL 5.7+
- npm

## Run locally

### 1. Clone and setup

```bash
git clone <repository-url>
cd TASK-MANAGER-CRUD-APP-Task-3
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
PORT=3000
JWT_SECRET=your_secure_jwt_secret_here
```

### 3. Setup database

```bash
npm run setup-db
```

This creates the `task_manager` database and tables for users and tasks.

### 4. Start the server

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Tasks (Protected - requires JWT token)

- `GET /api/tasks` - List user's tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Query Parameters

- `?status=<status>` - Filter by status
- `?search=<query>` - Search by title/description
- `?sort=<field>` - Sort by field (id, title, status)

## Usage Examples

### Register a user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

Response includes JWT token:

```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Complete project",
    "description": "Finish the Node.js project",
    "status": "In Progress"
  }'
```

### Get tasks with filters

```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do&sort=title" \
  -H "Authorization: Bearer <token>"
```

## Database Schema

### Users Table

- `id` - Auto-increment primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Bcrypted password
- `role` - User role (admin, user)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Tasks Table

- `id` - Auto-increment primary key
- `user_id` - Foreign key to users
- `title` - Task title
- `description` - Task description
- `status` - Task status (To Do, In Progress, Completed)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- Users can only access their own tasks
- All inputs are validated before processing
- SQL queries use parameterized statements to prevent SQL injection

