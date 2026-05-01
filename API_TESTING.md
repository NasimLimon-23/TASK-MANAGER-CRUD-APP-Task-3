# API Testing Guide

## Overview

This document provides examples for testing all endpoints of the Profile-based Task Manager API.

## Prerequisites

- API running on `http://localhost:3000`
- MySQL database set up and configured
- Tools: `curl`, Postman, or any HTTP client

## Authentication Endpoints

### 1. Register a New User

**Endpoint**: `POST /auth/register`

**Request**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Success Response (201)**:
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases**:
- Empty/invalid username: Returns 400 with validation error
- Duplicate username/email: Returns 409 Conflict
- Password less than 6 characters: Returns 400 with validation error

### 2. Login User

**Endpoint**: `POST /auth/login`

**Request**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Success Response (200)**:
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Store the token** - Use it for all subsequent requests in the `Authorization` header.

## Task Endpoints

**All task endpoints require authentication** - Add header: `Authorization: Bearer <token>`

### 3. Create Task

**Endpoint**: `POST /api/tasks`

**Request**:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Complete project setup",
    "description": "Install dependencies and configure database",
    "status": "In Progress"
  }'
```

**Success Response (201)**:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project setup",
  "description": "Install dependencies and configure database",
  "status": "In Progress",
  "created_at": "2024-05-01T10:30:00.000Z",
  "updated_at": "2024-05-01T10:30:00.000Z"
}
```

### 4. Get All Tasks

**Endpoint**: `GET /api/tasks`

**Request**:
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Complete project setup",
    "description": "Install dependencies and configure database",
    "status": "In Progress",
    "created_at": "2024-05-01T10:30:00.000Z",
    "updated_at": "2024-05-01T10:30:00.000Z"
  }
]
```

### 5. Get All Tasks with Filters

**Query Parameters**:
- `status` - Filter by status (To Do, In Progress, Completed)
- `search` - Search in title and description
- `sort` - Sort by field (id, title, status)

**Examples**:

Filter by status:
```bash
curl -X GET "http://localhost:3000/api/tasks?status=Completed" \
  -H "Authorization: Bearer <token>"
```

Search tasks:
```bash
curl -X GET "http://localhost:3000/api/tasks?search=project" \
  -H "Authorization: Bearer <token>"
```

Sort by title:
```bash
curl -X GET "http://localhost:3000/api/tasks?sort=title" \
  -H "Authorization: Bearer <token>"
```

Combined filters:
```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do&search=bug&sort=title" \
  -H "Authorization: Bearer <token>"
```

### 6. Get Single Task

**Endpoint**: `GET /api/tasks/:id`

**Request**:
```bash
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200)**:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project setup",
  "description": "Install dependencies and configure database",
  "status": "In Progress",
  "created_at": "2024-05-01T10:30:00.000Z",
  "updated_at": "2024-05-01T10:30:00.000Z"
}
```

**Error Response (404)**:
```json
{
  "error": "Task not found."
}
```

### 7. Update Task

**Endpoint**: `PUT /api/tasks/:id`

**Request**:
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Complete project setup - Updated",
    "description": "Install dependencies and configure database - Done",
    "status": "Completed"
  }'
```

**Success Response (200)**:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project setup - Updated",
  "description": "Install dependencies and configure database - Done",
  "status": "Completed",
  "updated_at": "2024-05-01T11:00:00.000Z"
}
```

### 8. Delete Task

**Endpoint**: `DELETE /api/tasks/:id`

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (204)**:
- No content returned

## Error Handling

### Missing Authentication Token

**Response (401)**:
```json
{
  "error": "Access token required."
}
```

### Invalid or Expired Token

**Response (403)**:
```json
{
  "error": "Invalid or expired token."
}
```

### Validation Error

**Response (400)**:
```json
{
  "errors": [
    "Title is required and must be a non-empty string.",
    "Status must be one of: To Do, In Progress, Completed."
  ]
}
```

### Internal Server Error

**Response (500)**:
```json
{
  "error": "Internal server error."
}
```

## Testing Workflow

1. **Register a user**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

2. **Login and get token**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

3. **Copy the token from response**

4. **Create a task**
   ```bash
   curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <paste_token_here>" \
     -d '{"title":"My First Task","status":"To Do"}'
   ```

5. **List tasks**
   ```bash
   curl -X GET http://localhost:3000/api/tasks \
     -H "Authorization: Bearer <paste_token_here>"
   ```

6. **Update task**
   ```bash
   curl -X PUT http://localhost:3000/api/tasks/1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <paste_token_here>" \
     -d '{"title":"Updated Task","status":"In Progress"}'
   ```

7. **Delete task**
   ```bash
   curl -X DELETE http://localhost:3000/api/tasks/1 \
     -H "Authorization: Bearer <paste_token_here>"
   ```

## Using Postman

1. Import as raw requests or create environment variables:
   - `token` - JWT token from login response
   - `baseUrl` - http://localhost:3000

2. Set header `Authorization: Bearer {{token}}` for all protected routes

3. Test endpoints sequentially from Register → Login → CRUD operations
