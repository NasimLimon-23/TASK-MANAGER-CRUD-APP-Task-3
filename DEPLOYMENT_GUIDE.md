# Deployment & Setup Guide

## Task 3 vs Task 4 Comparison

### Task 3: In-Memory Task Manager
- In-memory storage (arrays/objects)
- No database
- No authentication
- Basic CRUD operations
- Single shared task list

### Task 4: Profile-Based Task Manager (This Project)
- MySQL database for persistent storage
- JWT authentication & authorization
- Role-based access control (RBAC)
- Per-user task isolation
- Advanced filtering, search, and sorting

## Initial Setup Steps

### Step 1: Prerequisites
- Ensure MySQL is installed and running
- Node.js 14+ installed
- npm installed
- Git installed

#### Check installations:
```bash
node --version
npm --version
mysql --version
```

### Step 2: Clone & Configure Repository
```bash
git clone <repository-url>
cd TASK-MANAGER-CRUD-APP-Task-3
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager
PORT=3000
JWT_SECRET=your_very_secure_secret_key_change_in_production
```

### Step 5: Setup Database
```bash
npm run setup-db
```

This will:
- Create `task_manager` database
- Create `users` table
- Create `tasks` table with foreign key constraint

Verify with MySQL client:
```bash
mysql -u root -p task_manager
SHOW TABLES;
DESCRIBE users;
DESCRIBE tasks;
```

### Step 6: Start the Server
```bash
npm start
```

Expected output:
```
Task Manager server running on http://localhost:3000
```

## Quick Start Testing

### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dev_user",
    "email": "dev@example.com",
    "password": "TestPass123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dev_user",
    "password": "TestPass123"
  }'
```

Save the returned `token`:
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "title": "Set up database",
    "description": "Configure MySQL for production",
    "status": "In Progress"
  }'
```

### 4. List Tasks
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Database Backup & Recovery

### Backup Database
```bash
mysqldump -u root -p task_manager > backup_task_manager.sql
```

### Restore Database
```bash
mysql -u root -p task_manager < backup_task_manager.sql
```

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `DB_PASSWORD` to secure password
- [ ] Use environment-specific `.env` files (don't commit to git)
- [ ] Enable HTTPS in production
- [ ] Set up proper logging with Winston or similar
- [ ] Implement rate limiting for auth endpoints
- [ ] Add password reset functionality
- [ ] Set up automated database backups
- [ ] Use connection pooling (already done in config/db.js)
- [ ] Implement API versioning
- [ ] Add request validation with express-validator
- [ ] Set up monitoring and alerting
- [ ] Configure CORS if frontend on different domain

## Common Issues & Solutions

### Issue: "Error: connect ECONNREFUSED"
**Solution**: MySQL not running
```bash
# macOS
brew services start mysql

# Ubuntu/Linux
sudo systemctl start mysql
sudo systemctl start mariadb
```

### Issue: "ER_ACCESS_DENIED_FOR_USER"
**Solution**: Wrong MySQL credentials in .env
```bash
# Test connection:
mysql -h localhost -u root -p -e "SELECT 1;"
```

### Issue: "ENOTFOUND localhost"
**Solution**: Update DB_HOST in .env
- Try `127.0.0.1` instead of `localhost`
- Or check MySQL is listening on correct port

### Issue: "Table doesn't exist"
**Solution**: Run database setup
```bash
npm run setup-db
```

### Issue: "Invalid token"
**Solution**: 
- Token expired (24 hour expiry)
- JWT_SECRET changed
- Re-login to get new token

## Monitoring & Debugging

### Enable Debug Logging
Add to app.js:
```javascript
const debug = require('debug')('app');
// Use debug() for console output
```

### Monitor Query Performance
```bash
mysql> SET GLOBAL log_queries_not_using_indexes = 1;
mysql> SHOW PROCESSLIST;
```

### Check Server Logs
```bash
npm start  # Logs to console
```

### Test API Endpoints
```bash
# Postman, Insomnia, or Thunder Client recommended
# Or use curl as shown in API_TESTING.md
```

## Security Best Practices

1. **Passwords**: Hashed using bcryptjs with 10 salt rounds
2. **Tokens**: JWT signed with secret, 24-hour expiry
3. **SQL Injection**: Protected with parameterized queries
4. **Input Validation**: All inputs validated before processing
5. **CORS**: Configure as needed for frontend domain
6. **Headers**: Set security headers (consider express-helmet)
7. **Rate Limiting**: Implement for authentication endpoints
8. **Logging**: Monitor for suspicious activity

## Scaling Considerations

### Database Optimization
- Add indexes on frequently queried columns
- Archive old tasks after specified period
- Consider denormalization for read-heavy operations

### Application Server
- Use process manager (PM2) for clustering
- Load balance multiple instances
- Cache tokens with Redis

### Example PM2 Setup
```bash
npm install -g pm2
pm2 start app.js -i max
pm2 logs
pm2 save
pm2 startup
```

## Version Control

Ensure `.env` is in `.gitignore`:
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

Never commit sensitive files:
```bash
git status  # Should not show .env
```

## Useful WordPress & Database Commands

### MySQL Commands
```sql
-- View all users
SELECT id, username, email, role FROM users;

-- View user's tasks
SELECT * FROM tasks WHERE user_id = 1;

-- Delete user and cascade tasks
DELETE FROM users WHERE id = 1;

-- View database size
SELECT SUM(ROUND(((data_length + index_length) / 1024 / 1024), 2)) 
FROM information_schema.TABLES 
WHERE table_schema = 'task_manager';
```

### Node.js Debugging
```bash
node --inspect app.js  # Chrome DevTools debugging
```

## Next Steps

1. Review [API_TESTING.md](API_TESTING.md) for endpoint examples
2. Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for code organization
3. Implement frontend (optional - API works standalone)
4. Add additional features from optional requirements
5. Deploy to production environment
