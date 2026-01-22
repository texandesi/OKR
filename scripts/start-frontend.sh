#!/bin/bash
# Start frontend server only

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Starting frontend on http://localhost:5173"
cd "$PROJECT_ROOT/front-end"
npm run dev
