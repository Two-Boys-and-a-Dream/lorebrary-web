# GitHub Copilot Instructions for Lorebrary Web

## Project Overview

React + TypeScript SPA for managing "Lore" items (game-related text snippets) with full CRUD operations. Built with Vite bundler, Ant Design (antd) for styling, and TanStack React Query for server state management.

**Tech Stack**: React 19, TypeScript, Ant Design v5, TanStack React Query v5, Vite, Vitest + Testing Library

**Key Architecture Pattern**: React Query acts as client-side cache. The `HomePage` fetches all lore and sets individual items in cache by ID (`['lore', id]`). Child components like `LoreItem` read from this cache using `queryClient.getQueryData()`. This eliminates prop drilling while maintaining data consistency.

## Developer Workflows

### Build & Test Commands

- **`npm start`** - Dev server on port 3000 (Vite with HMR)
- **`npm run dev`** - Alternative dev server command (Vite)
- **`npm run build`** - Production build (TypeScript check + Vite build)
- **`npm run preview`** - Preview production build locally
- **`npm test`** - Run Vitest tests (must pass 100% coverage on all metrics)
- **`npm run verify`** - Pre-push validation (prettier, lint, type-check, tests)
- **`npm run lint`** - ESLint with flat config (modern setup, see `docs/ESLINT_CONFIG.md`)
- **`npm run ts:check`** - TypeScript validation without emitting files

### Pre-commit/Pre-push Hooks

Git hooks run automatically via `simple-git-hooks`:

- **pre-commit**: `npm run pretty` (auto-formats code)
- **pre-push**: `npm run lint` (blocks push on lint errors)

### Coverage Requirements

Vitest enforces **100% coverage** on all metrics (statements, branches, functions, lines). Tests must be comprehensive. See `vite.config.ts` for thresholds.

### Environment Variables

Vite requires environment variables to be prefixed with `VITE_` to be exposed to client code:

- **`VITE_API_URL`** - API endpoint URL (required)
- Create a `.env` file in project root based on `.env.example`
- Access in code using `import.meta.env.VITE_API_URL` (not `process.env`)
- In tests, use `process.env.VITE_API_URL` (Vitest runs in jsdom, not browser)
- Never commit `.env` files - only `.env.example`

## Code Style & Standards

### TypeScript Strictness

- `strict: true` with all strict mode flags enabled
- `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch` enforced
- Always define explicit types for function parameters/returns
- Use `interface` for object shapes, `type` for unions/intersections
- Use `unknown` instead of `any`

### React Component Patterns

- Functional components only (no classes)
- Default exports for components, named exports for utilities
- Component files: PascalCase (e.g., `HomePage.tsx`)
- Props interfaces: `ComponentNameProps` suffix
- Destructure props in function signature
- One component per file, co-located tests (`Component.test.tsx`)

## Critical Architecture: React Query Cache Pattern

**The HomePage is the source of truth.** It fetches all lore and populates the query cache:

```typescript
// In HomePage: Fetch all and cache individually
const { data } = useQuery({
  queryKey: ['lore'],
  queryFn: async () => {
    const lore = await API.getAllLore()
    // ⚡ Critical: Set each item in cache by ID
    lore.forEach((element) =>
      queryClient.setQueryData(['lore', element.id], element)
    )
    return lore
  },
})

// In LoreItem: Read from cache (no API call)
const queryClient = useQueryClient()
const data = queryClient.getQueryData<Lore>(['lore', id])
```

**Why**: This pattern eliminates prop drilling. Child components access data via cache keys without re-fetching. Mutations invalidate `['lore']` to trigger refetch, which repopulates individual caches.

**Mutation Pattern**: All mutations (create/update/delete) must:

1. Show message notification on success/error using `App.useApp()` hook
2. Invalidate `['lore']` query on success (triggers HomePage refetch)

```typescript
const { message } = App.useApp()

const mutation = useMutation({
  mutationFn: API.deleteLore,
  onError: (error: Error) => {
    message.error(error.message)
  },
  onSuccess: async () => {
    message.success('Lore deleted!')
    await queryClient.invalidateQueries({ queryKey: ['lore'], exact: true })
  },
})
```

## Styling with Ant Design

- All styling via Ant Design components and props (minimal custom CSS)
- Custom theme: `src/theme/theme.ts` (purple theme with dark/light mode support)
- Dark mode managed by `ConfigProvider` with `theme.algorithm` (dark/light algorithms)
- Use `App.useApp()` for message notifications, modals, and notifications (no `contextHolder` needed)
- Use inline styles or Ant Design's `style` prop for component-specific styling
- Theme switching: `antdTheme.darkAlgorithm` / `antdTheme.defaultAlgorithm`

## Testing Standards

### Test Setup & Mocking

**Global test setup** (`__mocks__/setupTests.ts`):

- API module auto-mocked via `vi.mock('../../api/API')`
- `clearMocks: true` in config - **never** call `vi.clearAllMocks()` manually
- Real timers enabled globally with `vi.useRealTimers()` for better animation handling
- `window.matchMedia`, `window.scrollTo`, and `window.getComputedStyle` mocked for Ant Design compatibility
- `process.env.VITE_API_URL` set for tests (note: Vitest uses `process.env`, app uses `import.meta.env`)

**Test utilities** (`src/utils/testUtils.tsx`):

- `renderWithProviders()` - Wraps components with QueryClient + ConfigProvider + App (antd)
- Creates fresh QueryClient per test with `retry: false` for fast failures
- Includes `App` wrapper to enable `App.useApp()` hooks in tests

### API Mock Behavior (`src/api/__mocks__/API.ts`)

Default implementations:

- `getAllLore()` → `mockLoreData` (3 items)
- `createLore(newLore)` → new Lore with generated ID & timestamps
- `deleteLore(id)` → resolves successfully
- `updateLore(updatedLore)` → returns updated lore with new `updatedAt`
- `getLoreById(id)` → finds by ID or rejects "Lore not found"

Override when needed:

```typescript
const mockAPI = API.getAllLore as vi.MockedFunction<typeof API.getAllLore>
mockAPI.mockRejectedValue('Network error')
```

### Test Pattern Example

```typescript
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import API from '../../api/API'
import { mockLoreData } from '../../utils/testData'
import MyComponent from './MyComponent'

vi.mock('../../api/API')

describe('MyComponent', () => {
  // NO vi.clearAllMocks() needed - automatic via vite.config.ts

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

  test('handles string errors', async () => {
    const mockAPI = API.getAllLore as vi.MockedFunction<typeof API.getAllLore>
    mockAPI.mockRejectedValue('Network error')
    renderWithProviders(<MyComponent />)
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  test('handles non-string errors', async () => {
    const mockAPI = API.getAllLore as vi.MockedFunction<typeof API.getAllLore>
    mockAPI.mockRejectedValue({ code: 500 })
    renderWithProviders(<MyComponent />)
    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
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
- Use Ant Design's `Alert` component for error messages or `message.error()` for notifications

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
- Ant Design components are already optimized - avoid wrapping in unnecessary memoization

## Accessibility

- Use semantic HTML elements
- Ensure all interactive elements are keyboard accessible
- Use Ant Design's built-in accessibility features
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

### Form Handling with Ant Design

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
- Don't call `vi.clearAllMocks()` in tests (it's automatic)
- Don't use inline styles when Ant Design props are available
- Don't commit console.log statements
- Don't ignore TypeScript errors
- Don't skip accessibility considerations
