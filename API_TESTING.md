Register a User

Bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'

 Login & Save Token

Bash
# 1. Get the token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123"}'

# 2. SAVE THE TOKEN (Replace the string below with your actual token)
export TOKEN="PASTE_YOUR_TOKEN_HERE"

Create a Task

Bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy Groceries","description":"Milk and Eggs","status":"To Do"}'

  Get All Tasks

Bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

  Update a Task (e.g., ID 13)

Bash
curl -X PUT http://localhost:3000/api/tasks/13 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy Groceries","description":"Milk, Eggs, and Bread","status":"In Progress"}'

  Delete a Task

Bash
curl -X DELETE http://localhost:3000/api/tasks/13 \
  -H "Authorization: Bearer $TOKEN"