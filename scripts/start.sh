#!/bin/bash
# Start both frontend and backend servers

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Starting OKR Manager..."

# Start backend
echo "Starting backend on http://127.0.0.1:8000"
cd "$PROJECT_ROOT/back-end"
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Start frontend
echo "Starting frontend on http://localhost:5173"
cd "$PROJECT_ROOT/front-end"
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Save PIDs for stop script
echo "$BACKEND_PID" > "$PROJECT_ROOT/.backend.pid"
echo "$FRONTEND_PID" > "$PROJECT_ROOT/.frontend.pid"

echo ""
echo "Services started:"
echo "  Backend:  http://127.0.0.1:8000"
echo "  API Docs: http://127.0.0.1:8000/docs"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Run ./scripts/stop.sh to stop all services"

# Wait for both processes
wait
