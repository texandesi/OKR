#!/bin/bash
# Start backend server only

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Starting backend on http://127.0.0.1:8000"
cd "$PROJECT_ROOT/back-end"
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
