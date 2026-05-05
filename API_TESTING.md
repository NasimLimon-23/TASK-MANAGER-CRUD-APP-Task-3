Databse run and local host run
  npm run setup-db
  npm start

Register a User

Bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"aa","email":"aa@example.com","password":"123456"}'

 Login & Save Token

Bash
# 1. Get the token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aa","password":"123456"}'

# 2. SAVE THE TOKEN (Replace the string below with your actual token)
export TOKEN="PASTE_YOUR_TOKEN_HERE"

Create a Task

Bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3OTgxMjI4LCJleHAiOjE3NzgwNjc2Mjh9.IrS9PnHWeh6I8y1rgmjpo4eeY4dPWiUamA17aex3WBY"" \
  -H "Content-Type: application/json" \
  -d '{"title":"walk","description":"street","status":"To Do"}'

  Get All Tasks

Bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3OTgxMjI4LCJleHAiOjE3NzgwNjc2Mjh9.IrS9PnHWeh6I8y1rgmjpo4eeY4dPWiUamA17aex3WBY""

  Update a Task (e.g., ID 13)

Bash
curl -X PUT http://localhost:3000/api/tasks/13 \
  -H "Authorization: Bearer " \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy Groceries","description":"Milk, Eggs, and Bread","status":"In Progress"}'

  Delete a Task

Bash
curl -X DELETE http://localhost:3000/api/tasks/13 \
  -H "Authorization: Bearer "





  