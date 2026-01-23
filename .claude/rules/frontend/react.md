---
paths:
  - "src/**/*.ts, src/**/*.tsx"
  - "tests/**/*.ts, src/**/*.tsx"
---

# React Framework Guidelines

## Component Structure

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use TypeScript for type safety

## Naming Conventions

- Component files: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useUserData`)
- Constants: UPPER_SNAKE_CASE

## Styling

- Prefer CSS modules or styled-components
- Avoid inline styles when possible
- Keep styles scoped to components

## State Management

- Use `useState` for local component state
- Use `useContext` for global state when appropriate
- Consider Redux or Zustand for complex state

## Performance

- Memoize expensive components with `React.memo`
- Use `useCallback` for event handlers passed as props
- Lazy load components with `React.lazy` when appropriate

## Testing

- Write unit tests for all components
- Aim for >80% code coverage
- Test user interactions, not implementation details
