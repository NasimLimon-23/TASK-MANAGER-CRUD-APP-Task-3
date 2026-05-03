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
    "username": "newuser",
    "email": "newuser@example.com", 
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
    "username": "newuser",
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "status": "To Do"
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
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

```
# Search by title
curl "http://localhost:3000/api/tasks?search=First" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Filter by status
curl "http://localhost:3000/api/tasks?status=To%20Do" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Sort by title
curl "http://localhost:3000/api/tasks?sort=title" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "In Progress"
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"  // Paste this in browser console
  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testuser', password: 'password123' })
  })
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
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

## Quick Test Examples

### Start Server
```bash
npm start
```
The app will run on `http://localhost:3000`

### Create Test User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login with Test User
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Response**: Copy the `token` value for use in task operations.

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and vegetables",
    "status": "To Do"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Search Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?search=groceries" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Filter by Status
```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Sort Tasks
```bash
# Sort by title
curl -X GET "http://localhost:3000/api/tasks?sort=title" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sort by status
curl -X GET "http://localhost:3000/api/tasks?sort=status" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Combined Filters
```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do&search=buy&sort=title" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Buy groceries - Updated",
    "description": "Milk, eggs, bread, vegetables, and fruits",
    "status": "In Progress"
  }'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Test Error Cases

### Try Access Without Token
```bash
curl -X GET http://localhost:3000/api/tasks
```
**Response**: `{"error":"Access token required."}`

### Try With Invalid Token
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer invalid_token_here"
```
**Response**: `{"error":"Invalid or expired token."}`

### Try Access Task of Another User
```bash
# User 1 creates task with ID 1
# User 2 tries to access task 1
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer user2_token_here"
```
**Response**: `{"error":"Task not found."}`

### Invalid Registration Data
```bash
# Missing email
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```
**Response**: `{"errors":["Valid email is required."]}`

### Duplicate Registration
```bash
# Try to register same username twice
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Response**: `{"error":"Username or email already exists."}`

### Short Password
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "123"
  }'
```
**Response**: `{"errors":["Password must be at least 6 characters long."]}`

### Invalid Task Title
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "",
    "status": "To Do"
  }'
```
**Response**: `{"errors":["Title is required and must be a non-empty string."]}`

### Invalid Status Value
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "My Task",
    "status": "Invalid Status"
  }'
```
**Response**: `{"errors":["Status must be one of: To Do, In Progress, Completed."]}`

## Using Postman

1. Import as raw requests or create environment variables:
   - `token` - JWT token from login response
   - `baseUrl` - http://localhost:3000

2. Set header `Authorization: Bearer {{token}}` for all protected routes

3. Test endpoints sequentially from Register → Login → CRUD operations

## Frontend Testing

1. Open `http://localhost:3000` in browser
2. Test registration form
3. Test login form
4. Test task creation, editing, deletion
5. Test search and filtering
6. Test logout functionality

## Summary of Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Working | Valid email, unique username/email required |
| User Login | ✅ Working | Returns JWT token valid for 24 hours |
| Task Creation | ✅ Working | Requires authentication, user-specific |
| Task Read (All) | ✅ Working | Returns user's tasks only |
| Task Read (Single) | ✅ Working | Task must belong to authenticated user |
| Task Update | ✅ Working | Only owner can update |
| Task Delete | ✅ Working | Only owner can delete |
| Search | ✅ Working | Searches title and description |
| Filter by Status | ✅ Working | To Do, In Progress, Completed |
| Sort | ✅ Working | By id, title, or status |
| Authentication | ✅ Working | JWT protection on all task routes |
| User Isolation | ✅ Working | Each user sees only their tasks |

// Register
fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser99',
    email: 'test99@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ Register response:', d);
  // Now try login
  return fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser99',
      password: 'password123'
    })
  }).then(r => r.json()).then(d => console.log('✅ Login response:', d));
})
.catch(e => console.error('❌ Error:', e))

## Complete Terminal Commands for API Testing

This section provides all the curl commands needed to test the API end-to-end. Replace `YOUR_JWT_TOKEN_HERE` with your actual JWT token from login.

### 1. Start the Server
```bash
npm start
```

### 2. Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Login and Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Copy the `token` value from the response for use in subsequent requests.**

### 4. Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "status": "To Do"
  }'
```

### 5. Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 6. Get Single Task (replace 1 with actual task ID)
```bash
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 7. Search Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?search=task" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 8. Filter by Status
```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 9. Sort Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?sort=title" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 10. Combined Filters
```bash
curl -X GET "http://localhost:3000/api/tasks?status=To%20Do&search=task&sort=title" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 11. Update a Task (replace 1 with actual task ID)
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "In Progress"
  }'
```

### 12. Delete a Task (replace 1 with actual task ID)
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Error Testing Commands

#### Try Access Without Token
```bash
curl -X GET http://localhost:3000/api/tasks
```
**Expected**: `{"error":"Access token required."}`

#### Try With Invalid Token
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer invalid_token_here"
```
**Expected**: `{"error":"Invalid or expired token."}`

#### Try Access Task of Another User
```bash
# First, create a task with User A, then try to access it with User B's token
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer user_b_token_here"
```
**Expected**: `{"error":"Task not found."}`

#### Invalid Registration Data
```bash
# Missing email
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```
**Expected**: `{"errors":["Valid email is required."]}`

#### Duplicate Registration
```bash
# Try to register same username twice
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Expected**: `{"error":"Username or email already exists."}`

#### Short Password
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "123"
  }'
```
**Expected**: `{"errors":["Password must be at least 6 characters long."]}`

#### Invalid Task Title
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "",
    "status": "To Do"
  }'
```
**Expected**: `{"errors":["Title is required and must be a non-empty string."]}`

#### Invalid Status Value
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My Task",
    "status": "Invalid Status"
  }'
```
**Expected**: `{"errors":["Status must be one of: To Do, In Progress, Completed."]}`

## Testing Workflow Summary

1. **Start Server**: `npm start`
2. **Register User**: Use register endpoint
3. **Login**: Get JWT token
4. **Create Task**: Test task creation
5. **List Tasks**: Verify task retrieval
6. **Update Task**: Test task updates
7. **Delete Task**: Test task deletion
8. **Test Filters**: Search, filter, sort
9. **Test Errors**: Try invalid requests

## Frontend Testing

1. Open `http://localhost:3000` in browser
2. Test registration form
3. Test login form
4. Test task creation, editing, deletion
5. Test search and filtering
6. Test logout functionality

## Summary of Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Working | Valid email, unique username/email required |
| User Login | ✅ Working | Returns JWT token valid for 24 hours |
| Task Creation | ✅ Working | Requires authentication, user-specific |
| Task Read (All) | ✅ Working | Returns user's tasks only |
| Task Read (Single) | ✅ Working | Task must belong to authenticated user |
| Task Update | ✅ Working | Only owner can update |
| Task Delete | ✅ Working | Only owner can delete |
| Search | ✅ Working | Searches title and description |
| Filter by Status | ✅ Working | To Do, In Progress, Completed |
| Sort | ✅ Working | By id, title, or status |
| Authentication | ✅ Working | JWT protection on all task routes |
| User Isolation | ✅ Working | Each user sees only their tasks |
