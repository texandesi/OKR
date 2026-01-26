---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "tests/**/*.ts"
  - "tests/**/*.tsx"
---

# React Framework Guidelines

### Style (JavaScript/TypeScript)

- Use TypeScript with strict mode enabled
- Prefer functional components with hooks over class components
- Use arrow functions for component definitions
- Keep files under 300 lines; split into smaller modules when needed

### Naming Conventions (JavaScript/TypeScript)

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/hooks: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE
- CSS classes: kebab-case with BEM methodology when not using Tailwind

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

## Component Structure

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use TypeScript for type safety

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
