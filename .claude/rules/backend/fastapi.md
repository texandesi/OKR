---
paths:
  - "src/**/*.py"
  - "tests/**/test_*.py"
---

# Standards & Guodelines

## Coding Guidelines

### Style (Python)

- Use type hints for all function signatures
- Follow PEP 8 style guidelines (enforced via ruff)
- Use async/await for I/O-bound operations
- Keep files under 300 lines; split into smaller modules when needed
- Use dataclasses or Pydantic models for structured data
- Prefer composition over inheritance

### Naming Conventions (Python)

- Modules/packages: snake_case (e.g., `user_service.py`)
- Classes: PascalCase (e.g., `UserRepository`)
- Functions/variables: snake_case (e.g., `get_user_by_id`)
- Constants: SCREAMING_SNAKE_CASE
- Private members: prefix with underscore (e.g., `_internal_method`)

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

## More Coding Guidelines

1. **Use Type Annotations**: Always use type hints for function parameters and return types to improve code readability and enable better IDE support.
2. **Follow PEP 8**: Adhere to the PEP 8 style guide for Python code to maintain consistency and readability.

3. **Organize Code**: Structure your FastAPI application using routers to separate different parts of your application logically.

4. **Use Dependency Injection**: Leverage FastAPI's dependency injection system to manage dependencies effectively.

5. **Error Handling**: Implement proper error handling using FastAPI's exception handlers to provide meaningful error responses.

## Testing Guidelines

1. **Use pytest**: Utilize pytest for writing and running tests. It is compatible with FastAPI and provides powerful testing capabilities.

2. **Test Endpoints**: Write tests for all API endpoints to ensure they behave as expected. Use FastAPI's `TestClient` for testing.

3. **Mock External Services**: When testing, mock external services to avoid hitting real endpoints and to ensure tests run quickly and reliably.

4. **Coverage**: Aim for high test coverage, ideally above 80%, to ensure that most of your code is tested.

5. **Continuous Integration**: Integrate your tests into a CI/CD pipeline to automatically run tests on every push or pull request.
