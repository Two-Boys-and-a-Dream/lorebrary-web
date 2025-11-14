import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import HomePage from './HomePage'
import { API } from '../../api'
import { mockLoreData } from '../../utils/testData'

// Mock the API module - the mock implementation is in src/api/__mocks__/index.ts
jest.mock('../../api')

describe('HomePage Component', () => {
  test('renders HomePage component successfully', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >

    renderWithProviders(<HomePage />)

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

    renderWithProviders(<HomePage />)

    // Should not show lore content initially (still loading)
    expect(screen.queryByText(mockLoreData[0].title)).not.toBeInTheDocument()
    expect(screen.queryByText(mockLoreData[1].title)).not.toBeInTheDocument()
  })

  test('displays lore items after data is fetched', async () => {
    renderWithProviders(<HomePage />)

    // Wait for the data to be loaded - check for actual lore titles
    await waitFor(() => {
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockLoreData[1].title)).toBeInTheDocument()
    })

    // Should render lore items
    expect(API.getAllLore).toHaveBeenCalledTimes(1)
  })

  test('displays error message when API call fails', async () => {
    const mockGetAllLore = API.getAllLore as jest.MockedFunction<
      typeof API.getAllLore
    >
    const errorMessage = 'Failed to fetch lore'
    mockGetAllLore.mockRejectedValue(new Error(errorMessage))

    renderWithProviders(<HomePage />)

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

    renderWithProviders(<HomePage />)

    // Wait for the query to complete
    await waitFor(() => {
      expect(API.getAllLore).toHaveBeenCalledTimes(1)
    })

    // Verify API was called
    expect(API.getAllLore).toHaveBeenCalledTimes(1)
  })
})
