

Register a User

Bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"nasim","email":"nasim@example.com","password":"123456"}'

 Login & Save Token

Bash
# 1. Get the token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nasim","password":"123456"}'

# 2. SAVE THE TOKEN 
export TOKEN="PASTE_YOUR_TOKEN_HERE"

Create a Task

Bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJuYXNpbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4MDY0NDk4LCJleHAiOjE3NzgxNTA4OTh9.jIphhyRCXdjY-RUuxAA1_pHVg79IgRA7WaBRM_NdyAE"" \
  -H "Content-Type: application/json" \
  -d '{"title":"running","description":"SUST","status":"To Do"}'

  Get All Tasks

Bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJuYXNpbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4MDY0NDk4LCJleHAiOjE3NzgxNTA4OTh9.jIphhyRCXdjY-RUuxAA1_pHVg79IgRA7WaBRM_NdyAE""

  update the task

Bash
curl -X PUT http://localhost:3000/api/tasks/14 \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJuYXNpbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4MDY0NDk4LCJleHAiOjE3NzgxNTA4OTh9.jIphhyRCXdjY-RUuxAA1_pHVg79IgRA7WaBRM_NdyAE"" \
  -H "Content-Type: application/json" \
  -d '{"title":"walking","description":"SUST","status":"In Progress"}'

  Delete a Task

Bash
curl -X DELETE http://localhost:3000/api/tasks/14 \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJuYXNpbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4MDY0NDk4LCJleHAiOjE3NzgxNTA4OTh9.jIphhyRCXdjY-RUuxAA1_pHVg79IgRA7WaBRM_NdyAE""





  