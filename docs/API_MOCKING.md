# API Mocking Guide

## Overview

The API module is globally mocked for all tests using Jest's automatic mocking feature. This provides consistent test data across all test files without needing to manually mock the API in each test.

## Files

- **`src/api/__mocks__/index.ts`** - Mock implementation of the API module
- **`src/utils/testData.ts`** - Reusable test data that can be imported in any test
- **`src/utils/testUtils.tsx`** - Test utility functions including `renderWithProviders`

## Usage

### Basic Usage

Simply call `jest.mock('../../api')` at the top of your test file, and the API will automatically use the mock implementation. Use `renderWithProviders` from `testUtils` to render components with all necessary providers:

```typescript
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import { API } from '../../api'
import { mockLoreData } from '../../utils/testData'
import MyComponent from './MyComponent'

// Enable the mock
jest.mock('../../api')

describe('MyComponent', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    jest.clearAllMocks()
  })

  test('fetches and displays lore data', async () => {
    renderWithProviders(<MyComponent />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
    })

    expect(API.getAllLore).toHaveBeenCalledTimes(1)
  })
})
```

### Default Mock Behavior

The mock API provides the following default behaviors:

- **`getAllLore()`** - Returns `mockLoreData` (3 lore items)
- **`createLore(newLore)`** - Returns a new lore item with generated ID and timestamps
- **`deleteLore(_id)`** - Returns undefined (success)
- **`updateLore(updatedLore)`** - Returns the updated lore with new timestamp
- **`getLoreById(_id)`** - Returns the matching lore item or rejects with error

### Customizing Mock Behavior

You can override the default behavior for specific tests:

```typescript
test('handles API error', async () => {
  const mockGetAllLore = API.getAllLore as jest.MockedFunction<
    typeof API.getAllLore
  >
  mockGetAllLore.mockRejectedValue(new Error('Network error'))

  // Your test code here...
})

test('returns empty lore list', async () => {
  const mockGetAllLore = API.getAllLore as jest.MockedFunction<
    typeof API.getAllLore
  >
  mockGetAllLore.mockResolvedValue([])

  // Your test code here...
})
```

### Using Test Data

Import `mockLoreData` when you need to reference the default test data:

```typescript
import { mockLoreData } from '../../utils/testData'

test('displays correct lore titles', () => {
  // Use mockLoreData to verify expected values
  expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
})
```

## Test Data

The default test data includes 3 lore items:

1. **The Ancient Prophecy** - Fantasy Quest
2. **The Forgotten Temple** - Adventure Chronicles
3. **The Dragon's Lair** - Fantasy Quest

You can extend or modify the test data in `src/utils/testData.ts` as needed.

## Test Utilities

### renderWithProviders

A custom render function that wraps components with all necessary providers (QueryClient, ChakraProvider):

```typescript
import { renderWithProviders } from '../../utils/testUtils'

test('renders component', () => {
  renderWithProviders(<MyComponent />)
  // Test your component...
})
```

This function:

- Creates a new QueryClient for each test (ensures isolation)
- Disables retries for faster test failures
- Wraps your component with QueryClientProvider and ChakraProvider
- Uses your custom theme automatically

## Best Practices

1. **Always clear mocks** - Use `jest.clearAllMocks()` in `beforeEach()` to reset call counts
2. **Use renderWithProviders** - Always render components with `renderWithProviders` instead of plain `render`
3. **Be specific** - Override mock behavior only for tests that need different responses
4. **Use TypeScript** - Cast mocks with `as jest.MockedFunction<>` for type safety
5. **Import test data** - Use `mockLoreData` for consistency across tests
