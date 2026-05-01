# Project Structure

## Directory Layout

```
TASK-MANAGER-CRUD-APP-Task-3/
├── app.js                    # Main Express application
├── package.json              # Project dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore configuration
├── README.md                 # Project documentation
├── API_TESTING.md            # API testing guide
├── config/
│   └── db.js                 # MySQL connection pool configuration
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── authorization.js      # Role-based authorization middleware
├── routes/
│   ├── auth.js               # Authentication routes (register/login)
│   └── tasks.js              # Task CRUD routes
├── scripts/
│   └── setup-db.js           # Database schema setup script
├── public/
│   ├── index.html            # Frontend (optional UI)
│   └── styles.css            # Frontend styling (optional UI)
└── node_modules/             # Installed dependencies
```

## File Descriptions

### Core Application Files

**app.js**
- Main Express server entry point
- Middleware setup and route configuration
- Error handling and 404 routes
- Server initialization on port 3000

**config/db.js**
- MySQL connection pool creation
- Database configuration from environment variables
- Connection pool management (10 connections, no queue limit)

**package.json**
- Project metadata and version
- npm scripts (start, setup-db)
- Dependencies: express, mysql2, jsonwebtoken, bcryptjs, dotenv

### Middleware

**middleware/auth.js**
- JWT token verification middleware
- Extracts and validates tokens from Authorization header
- Attaches decoded user info to request object
- Returns 401 if token missing, 403 if invalid

**middleware/authorization.js**
- Role-based access control middleware
- Restricts routes based on user roles (admin, user)
- Returns 403 Forbidden if user lacks required role

### Routes

**routes/auth.js**
- `POST /auth/register` - User registration with validation
- `POST /auth/login` - User authentication with JWT token generation
- Password hashing with bcryptjs
- Duplicate username/email checking

**routes/tasks.js**
- `GET /api/tasks` - List user's tasks with filters/search/sort
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- All routes scoped to authenticated user
- Input validation for all requests

### Scripts

**scripts/setup-db.js**
- Creates `task_manager` database (if not exists)
- Creates `users` table with authentication fields
- Creates `tasks` table with foreign key to users
- Establishes one-to-many relationship

### Configuration

**.env.example**
- Template for environment variables
- Database connection settings
- JWT secret configuration
- Server port setting

**.gitignore**
- Excludes node_modules/
- Excludes .env and environment files
- Excludes log files

## Database Schema

### users table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR 255, UNIQUE)
- email (VARCHAR 255, UNIQUE)
- password_hash (VARCHAR 255)
- role (ENUM: admin, user)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### tasks table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT, FOREIGN KEY → users.id)
- title (VARCHAR 255)
- description (TEXT)
- status (ENUM: To Do, In Progress, Completed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL server host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | your_password |
| `DB_NAME` | Database name | task_manager |
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | JWT signing secret | your_secure_secret |

## Authentication Flow

1. User registers with username, email, password
2. Password hashed with bcryptjs (10 salt rounds)
3. User logs in with username and password
4. Server verifies password and generates JWT token
5. Token includes user id, username, role
6. Client sends token in Authorization header for protected routes
7. Authentication middleware verifies token on each request
8. Token expires after 24 hours

## Authorization Flow

1. User authenticated and token contains role
2. Authorization middleware checks required role
3. Admin role has access to all routes
4. Regular users can only access their own tasks
5. Task endpoints verify user_id matches authenticated user

## Error Handling

- All errors caught with try-catch blocks
- Validation errors return 400 with detailed messages
- Authentication errors return 401 or 403
- Resource not found returns 404
- Server errors return 500 with generic error message
- Console logging for server-side debugging
