# AI Task Architect

## Overview
A full-stack task management application where an "AI Agent" breaks down complex tasks into actionable steps. Built with FastAPI backend and React frontend featuring a modern glassmorphism design.

## Project Structure
```
/
├── backend/
│   └── main.py          # FastAPI server with TaskService
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── main.jsx     # React entry point
│   │   └── index.css    # Tailwind styles + custom animations
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js
│   └── postcss.config.js
├── requirements.txt     # Python dependencies
└── replit.md           # This file
```

## Architecture

### Backend (FastAPI)
- **TaskService class**: Dependency injection pattern for task management
- **Pydantic models**: Strict type validation for all data
- **Async/await**: Full async support throughout
- **Endpoints**:
  - `GET /tasks` - List all tasks
  - `POST /tasks` - Create manual task
  - `PUT /tasks/{id}` - Toggle task completion
  - `DELETE /tasks/{id}` - Delete task
  - `POST /tasks/generate` - AI-simulated task breakdown

### Frontend (React + Vite)
- **Tailwind CSS**: Utility-first styling
- **Glassmorphism UI**: Modern frosted glass aesthetic
- **Features**:
  - Manual task addition
  - "Magic Add" button for AI task generation
  - Loading animation during AI processing
  - Progress bar with smooth transitions
  - AI-generated vs manual task badges

### AI Simulation
The `simulate_llm_breakdown()` function uses keyword matching to generate contextual subtasks. It includes a 1.5s delay to simulate LLM latency.

## Running the Application
- Backend runs on port 8000
- Frontend runs on port 5000 (proxies API calls to backend)

## Recent Changes
- December 16, 2025: Initial project setup with full CRUD functionality and AI task generation
