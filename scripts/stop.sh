#!/bin/bash
# Stop frontend and backend servers

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Stopping OKR Manager services..."

# Kill backend
if [ -f "$PROJECT_ROOT/.backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/.backend.pid")
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "Stopping backend (PID: $BACKEND_PID)"
        kill "$BACKEND_PID" 2>/dev/null
    fi
    rm -f "$PROJECT_ROOT/.backend.pid"
fi

# Kill frontend
if [ -f "$PROJECT_ROOT/.frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/.frontend.pid")
    if kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "Stopping frontend (PID: $FRONTEND_PID)"
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    rm -f "$PROJECT_ROOT/.frontend.pid"
fi

# Also kill any remaining uvicorn and vite processes for this project
pkill -f "uvicorn app.main:app" 2>/dev/null
pkill -f "vite.*front-end" 2>/dev/null

echo "All services stopped."
