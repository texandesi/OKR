# CLAUDE.md

## Project Overview

This is my personal development workspace. I work primarily on web applications using modern Python/JavaScript/TypeScript frameworks. 

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Python (FastAPI/Flask)
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library, pytest
- **Build Tools**: Vite, ESBuild
- **Python**: Python 3.11+, uv/pip, virtual environments

## Coding Preferences

### Style (JavaScript/TypeScript)

- Use TypeScript with strict mode enabled
- Prefer functional components with hooks over class components
- Use arrow functions for component definitions
- Keep files under 300 lines; split into smaller modules when needed

### Style (Python)

- Use type hints for all function signatures
- Follow PEP 8 style guidelines (enforced via ruff)
- Use async/await for I/O-bound operations
- Keep files under 300 lines; split into smaller modules when needed
- Use dataclasses or Pydantic models for structured data
- Prefer composition over inheritance

### Naming Conventions (JavaScript/TypeScript)

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/hooks: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE
- CSS classes: kebab-case with BEM methodology when not using Tailwind

### Naming Conventions (Python)

- Modules/packages: snake_case (e.g., `user_service.py`)
- Classes: PascalCase (e.g., `UserRepository`)
- Functions/variables: snake_case (e.g., `get_user_by_id`)
- Constants: SCREAMING_SNAKE_CASE
- Private members: prefix with underscore (e.g., `_internal_method`)

### Code Organization (JavaScript/TypeScript)

```
src/
  components/     # Reusable UI components
  features/       # Feature-specific modules
  hooks/          # Custom React hooks
  utils/          # Helper functions
  types/          # TypeScript type definitions
  api/            # API client and endpoints
```

### Code Organization (Python)

```
src/
  api/            # FastAPI/Flask routes and endpoints
  models/         # Pydantic models and SQLAlchemy ORM
  services/       # Business logic layer
  repositories/   # Data access layer
  utils/          # Helper functions
  config/         # Configuration and settings
tests/
  unit/           # Unit tests
  integration/    # Integration tests
```

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

- Always start work in /Users/sanjeevpai/Developer/apps/ as the base folder for all projects and do all work relative to that folder. If the folder does not exist, then let me know and do not proceed till an updated location is provided.
- Always add proper error handling for async operations
- Include JSDoc comments for exported functions
- Write unit tests for utility functions and hooks
- Use environment variables for configuration (never hardcode secrets)
- Prefer composition over inheritance

## Git Workflow

- Branch naming: `feature/`, `fix/`, `refactor/` prefixes
- Write descriptive commit messages in imperative mood
- Keep commits atomic and focused

## When Helping Me

1. Ask clarifying questions if requirements are ambiguous
2. Suggest improvements but implement what I ask for first
3. Include brief explanations for non-obvious code decisions
4. Flag potential security concerns or performance issues
5. Prefer simple solutions over clever ones
