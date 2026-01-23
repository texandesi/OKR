# CLAUDE.md

## Project Overview

OKR is a full-stack web application for managing Objectives and Key Results. It enables organizations to define strategic goals (objectives), measure progress (key results), and track KPIs across teams and groups. The platform supports collaborative goal-setting, progress tracking, recurring schedules, polls for feedback, and team streaks to promote consistent goal execution.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Python (FastAPI/Flask)
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library, pytest
- **Build Tools**: Vite, ESBuild
- **Python**: Python 3.11+, uv/pip, virtual environments

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database

# Python
python -m venv .venv        # Create virtual environment
source .venv/bin/activate   # Activate venv (macOS/Linux)
uv pip install -r requirements.txt  # Install dependencies
pytest                      # Run tests
pytest --cov=src            # Run tests with coverage
ruff check .                # Run linter
ruff format .               # Format code
mypy src/                   # Type checking
```

## Important Notes

- Always start work in /Users/sanjeevpai/Developer/apps/ as the base folder for all projects and do all work relative to that folder.
- If the folder does not exist, then let me know and do not proceed till an updated location is provided.
- Always add proper error handling for async operations
- Include JSDoc comments for exported functions
- Write unit tests for utility functions and hooks
- Use environment variables for configuration (never hardcode secrets)
- Prefer composition over inheritance

## Git Workflow

- Branch naming: `feature/`, `fix/`, `refactor/` prefixes
- The main develoopment branch is called `dev`
- The production release beanch is called `main`
- Write descriptive commit messages in imperative mood
- Keep commits atomic and focused

## When Helping Me

1. Ask clarifying questions if requirements are ambiguous
2. Suggest improvements but implement what I ask for first
3. Include brief explanations for non-obvious code decisions
4. Flag potential security concerns or performance issues
5. Prefer simple solutions over clever ones
