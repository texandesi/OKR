---
name: development-workflow
description: Standard workflows for development, testing, database management, and git operations.
---

# Development Workflow

## Common Commands

### Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
```

### Database

```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

### Python

```bash
python -m venv .venv        # Create virtual environment
source .venv/bin/activate   # Activate venv (macOS/Linux)
uv pip install -r requirements.txt  # Install dependencies
pytest                      # Run tests
pytest --cov=src            # Run tests with coverage
ruff check .                # Run linter
ruff format .               # Format code
mypy src/                   # Type checking
```

## Git Workflow

- **Branch naming**: `feature/`, `fix/`, `refactor/` prefixes
- **Main development branch**: `dev`
- **Production release branch**: `main`
- **Commit messages**:
  - Write descriptive commit messages in imperative mood
  - Keep commits atomic and focused

## Server Management

- **Start**: `scripts/start.sh`
- **Stop**: `scripts/stop.sh`
