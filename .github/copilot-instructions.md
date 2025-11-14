# GitHub Copilot Instructions for Lorebrary Web

## Project Overview

This is a React + TypeScript web application using Chakra UI for styling and React Query for data fetching. The app manages "Lore" items with CRUD operations.

## Code Style & Standards

### General

- Use TypeScript for all new files
- Use functional components with hooks (no class components)
- Use arrow functions for component definitions
- Use named exports for utilities, default exports for components
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Imports

- Group imports in this order: React, third-party libraries, local imports
- Use absolute imports via TypeScript path aliases when available
- Sort imports alphabetically within each group

### TypeScript

- Always define explicit types for function parameters and return types
- Use `interface` for object types, `type` for unions/intersections
- Prefer type inference for simple variable declarations
- Use `unknown` instead of `any` when the type is truly unknown
- Export types alongside their related code

### React Components

- One component per file
- Component files should be named with PascalCase (e.g., `HomePage.tsx`)
- Props should be defined as interfaces with the suffix `Props`
- Use destructuring for props
- Keep components small and focused (single responsibility)
- Extract complex logic into custom hooks

```typescript
interface MyComponentProps {
  title: string
  isActive?: boolean
}

const MyComponent = ({ title, isActive = false }: MyComponentProps) => {
  // Component logic
}

export default MyComponent
```

### State Management

- Use React Query for server state (data fetching, caching)
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Avoid prop drilling - consider Context API or React Query for shared state

### Styling

- Use Chakra UI components and props for styling
- Use the custom theme defined in `src/theme/theme.ts`
- Prefer Chakra's responsive array syntax for responsive design
- Keep custom CSS minimal - use `App.module.css` only when necessary

## Testing Standards

### General Testing Practices

- Write tests for all components and critical utility functions
- Test files should be co-located with the code they test
- Name test files with `.test.tsx` or `.test.ts` suffix
- Use descriptive test names that explain the expected behavior

### Jest Configuration

**IMPORTANT**: Our Jest config has `clearMocks: true` enabled globally, which automatically clears all mocks between tests. You do NOT need to call `jest.clearAllMocks()` in `beforeEach` blocks.

### Testing Utilities

- Import from `@testing-library/react` for testing utilities
- Use `renderWithProviders` from `src/utils/testUtils.tsx` to render components
- Use `mockLoreData` from `src/utils/testData.ts` for consistent test data
- API module is globally mocked via `src/api/__mocks__/index.ts`

### Writing Tests

```typescript
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import { API } from '../../api'
import { mockLoreData } from '../../utils/testData'
import MyComponent from './MyComponent'

// Mock the API module
jest.mock('../../api')

describe('MyComponent', () => {
  // NO need for beforeEach with jest.clearAllMocks() - it's automatic!

  test('renders successfully', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  test('fetches and displays data', async () => {
    renderWithProviders(<MyComponent />)

    await waitFor(() => {
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
    })

    expect(API.getAllLore).toHaveBeenCalledTimes(1)
  })

  test('handles errors gracefully', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<typeof API.getAllLore>
    mockGetAllLore.mockRejectedValue(new Error('Network error'))

    renderWithProviders(<MyComponent />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Best Practices

- Test user-facing behavior, not implementation details
- Use `screen.getByRole` over `getByTestId` when possible
- Use `waitFor` for async operations
- Mock only external dependencies (API calls, external libraries)
- Keep tests focused - one assertion per test when possible
- Use descriptive test names that read like documentation

### Query Priorities (React Testing Library)

1. `getByRole` - Preferred (accessibility-focused)
2. `getByLabelText` - For form fields
3. `getByPlaceholderText` - For inputs without labels
4. `getByText` - For non-interactive text
5. `getByDisplayValue` - For form elements
6. `getByAltText` - For images
7. `getByTitle` - For supplementary information
8. `getByTestId` - Last resort only

### API Mocking

The API module is automatically mocked with sensible defaults:

- `getAllLore()` returns 3 sample lore items
- `createLore()` creates a new lore with generated ID
- `deleteLore()` resolves successfully
- `updateLore()` returns updated lore with new timestamp
- `getLoreById()` finds lore by ID

Override default behavior only when needed:

```typescript
const mockAPI = API.getAllLore as jest.MockedFunction<typeof API.getAllLore>
mockAPI.mockResolvedValue([]) // Empty array for this specific test
```

## Component Structure

### Atomic Design Organization

- **atoms/** - Basic building blocks (buttons, inputs)
- **molecules/** - Simple component groups (form fields with labels)
- **organisms/** - Complex components (forms, navbars, menus)
- **pages/** - Full page components
- **layouts/** - Layout wrappers

### File Structure Pattern

```
src/
  components/
    atoms/
      MyAtom.tsx
      index.ts           # Export barrel file
    pages/
      HomePage.tsx
      HomePage.test.tsx  # Co-located test
      index.ts
  api/
    API.ts
    __mocks__/
      index.ts           # Mock implementation
  utils/
    testUtils.tsx        # Testing utilities
    testData.ts          # Mock data for tests
```

## API & Data Fetching

### Using React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../api'

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['lore'],
  queryFn: () => API.getAllLore(),
})

// Mutation
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: API.createLore,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['lore'] })
  },
})
```

### Error Handling

- Always handle loading and error states in components
- Display user-friendly error messages
- Use Chakra's `Alert` component for error messages

## Git & Commits

- Write clear, descriptive commit messages
- Use conventional commits format: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- Keep commits atomic and focused on a single change

## Performance

- Use React Query's caching to minimize API calls
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`
- Use code splitting with `React.lazy` for route-based code splitting
- Avoid unnecessary re-renders

## Accessibility

- Use semantic HTML elements
- Ensure all interactive elements are keyboard accessible
- Use Chakra UI's built-in accessibility features
- Add ARIA labels where necessary
- Test with screen readers when possible

## Documentation

- Add JSDoc comments for complex functions and utilities
- Document non-obvious component props
- Keep README up to date with setup instructions
- Document testing patterns in `docs/API_MOCKING.md`

## Common Patterns

### Custom Hooks

```typescript
export const useLore = () => {
  return useQuery({
    queryKey: ['lore'],
    queryFn: () => API.getAllLore(),
  })
}
```

### Form Handling with Chakra UI

```typescript
const [formData, setFormData] = useState<NewLore>({
  title: '',
  subtitle: '',
  game: '',
  text: '',
})

const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  mutation.mutate(formData)
}
```

### Conditional Rendering

```typescript
if (isLoading) return <Spinner />
if (error) return <Alert status="error">{error.message}</Alert>
if (!data?.length) return <Text>No items found</Text>
return <ItemList items={data} />
```

## Don't

- Don't use `any` type
- Don't mutate state directly
- Don't forget to handle loading/error states
- Don't test implementation details
- Don't call `jest.clearAllMocks()` in tests (it's automatic)
- Don't use inline styles when Chakra props are available
- Don't commit console.log statements
- Don't ignore TypeScript errors
- Don't skip accessibility considerations
