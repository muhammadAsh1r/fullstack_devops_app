# Todo Task Manager - DevOps Project

This is a complete, modern full-stack Todo Task Manager application built with React, Node.js/Express, and MySQL. It is fully containerized using Docker, making it suitable for a DevOps CI/CD Azure deployment lab.

## Project Structure

```
devops_project/
├── frontend/             # React + Vite frontend application
├── backend/              # Node.js + Express backend REST API
├── db/                   # MySQL database schema and initialization
├── docker-compose.yml    # Docker Compose configuration for local setup
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) (for containerized setup)
- Node.js (if running locally without Docker)

## Setup Instructions

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository and navigate to the project root.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Build and start all services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/tasks`

### Option 2: Run Locally (Without Docker)

You will need a local MySQL server running.

**1. Setup Database:**
- Create a database and user matching the `.env` configuration.
- Import the schema:
  ```bash
  mysql -u root -p < db/schema.sql
  ```

**2. Setup Backend:**
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env to match your local MySQL credentials
npm start
```

**3. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

The backend provides a RESTful API at `http://localhost:5000/tasks`.

### GET `/tasks`
Retrieve all tasks.
**Sample Response:**
```json
[
  {
    "id": 1,
    "title": "Setup CI/CD Pipeline",
    "description": "Deploy to Azure using GitHub Actions",
    "status": "pending",
    "created_at": "2024-05-15T12:00:00.000Z"
  }
]
```

### POST `/tasks`
Create a new task.
**Payload:**
```json
{
  "title": "New Task",
  "description": "Optional description"
}
```

### PUT `/tasks/:id`
Update an existing task.
**Payload:**
```json
{
  "title": "Updated Task",
  "status": "completed"
}
```

### DELETE `/tasks/:id`
Delete a task by ID.

## Important Parts & Best Practices

- **Docker Networking**: In `docker-compose.yml`, the backend connects to the MySQL database using the service name `db` as the host. The frontend connects to the backend through the published port `5000` because it runs in the browser on the host machine.
- **Environment Variables**: Sensitive credentials and configurable endpoints are extracted to `.env` files, which should not be committed to version control.
- **Error Handling**: The backend includes standardized error handling and try-catch blocks for robust async database operations.
- **Design**: The frontend uses standard responsive CSS targeting a clean, modern aesthetic similar to standard enterprise tools (like Microsoft To-Do), ensuring ease of use without distracting animations.
