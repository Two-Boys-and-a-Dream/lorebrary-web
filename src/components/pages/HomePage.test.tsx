import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import HomePage from './HomePage'
import { API } from '../../api'
import { theme } from '../../theme'

// Mock the API module
jest.mock('../../api', () => ({
  API: {
    getAllLore: jest.fn(),
    getLoreById: jest.fn(),
    updateLore: jest.fn(),
    deleteLore: jest.fn(),
  },
}))

const mockLoreData = [
  {
    _id: '1',
    title: 'Test Lore 1',
    subtitle: 'Test Subtitle 1',
    game: 'Test Game 1',
    text: 'Test text 1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Test Lore 2',
    subtitle: 'Test Subtitle 2',
    game: 'Test Game 2',
    text: 'Test text 2',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
]

const renderHomePage = () => {
  // Create a new QueryClient for each test to ensure isolation
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <HomePage />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

describe('HomePage Component', () => {
  test('renders HomePage component successfully', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    mockGetAllLore.mockResolvedValue(mockLoreData)

    renderHomePage()

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetAllLore).toHaveBeenCalledTimes(1)
    })
  })

  test('displays loading skeletons initially', () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    mockGetAllLore.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockLoreData), 100))
    )

    renderHomePage()

    // Should not show lore content initially (still loading)
    expect(screen.queryByText('Test Lore 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Lore 2')).not.toBeInTheDocument()
  })

  test('displays lore items after data is fetched', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    const mockGetLoreById = API.getLoreById as jest.MockedFunction<
      typeof API.getLoreById
    >

    mockGetAllLore.mockResolvedValue(mockLoreData)
    mockGetLoreById.mockImplementation((id: string) => {
      return Promise.resolve(mockLoreData.find((lore) => lore._id === id)!)
    })

    renderHomePage()

    // Wait for the data to be loaded - check for actual lore titles
    await waitFor(() => {
      expect(screen.getByText('Test Lore 1')).toBeInTheDocument()
      expect(screen.getByText('Test Lore 2')).toBeInTheDocument()
    })

    // Should render two lore items
    expect(mockGetAllLore).toHaveBeenCalledTimes(1)
  })

  test('displays error message when API call fails', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    const errorMessage = 'Failed to fetch lore'
    mockGetAllLore.mockRejectedValue(new Error(errorMessage))

    renderHomePage()

    // Wait for error message to appear (error is prefixed with "Error: ")
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch lore/)).toBeInTheDocument()
    })
  })

  test('handles empty lore list', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    mockGetAllLore.mockResolvedValue([])

    renderHomePage()

    // Wait for the query to complete
    await waitFor(() => {
      expect(mockGetAllLore).toHaveBeenCalledTimes(1)
    })

    // Verify API was called
    expect(mockGetAllLore).toHaveBeenCalledTimes(1)
  })
})
