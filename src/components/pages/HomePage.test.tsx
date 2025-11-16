import { describe, test, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import HomePage from './HomePage'
import API from '../../api/API'
import { mockLoreData } from '../../utils/testData'

// Mock the API module - the mock implementation is in src/api/__mocks__/index.ts
vi.mock('../../api/API')

describe('HomePage Component', () => {
  test('renders HomePage component successfully', async () => {
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
      typeof API.getAllLore
    >

    renderWithProviders(<HomePage />)

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetAllLore).toHaveBeenCalledTimes(1)
    })
  })

  test('displays loading skeletons initially', async () => {
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
      typeof API.getAllLore
    >

    // Store the original implementation
    const originalImplementation = mockGetAllLore.getMockImplementation()

    mockGetAllLore.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockLoreData), 100))
    )

    renderWithProviders(<HomePage />)

    // Should not show lore content initially (still loading)
    expect(screen.queryByText(mockLoreData[0].title)).not.toBeInTheDocument()
    expect(screen.queryByText(mockLoreData[1].title)).not.toBeInTheDocument()

    // Wait for loading to complete and restore mock
    await waitFor(() => {
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
    })

    // Restore the original mock implementation
    if (originalImplementation) {
      mockGetAllLore.mockImplementation(originalImplementation)
    }
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
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
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
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
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

  test('sorts lore by creation date (newest first)', async () => {
    // Ensure mock is reset to default implementation
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
      typeof API.getAllLore
    >
    mockGetAllLore.mockResolvedValue(mockLoreData)

    renderWithProviders(<HomePage />)

    // Wait for data to load - check that items are displayed
    await waitFor(() => {
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
    })

    // Get all lore card titles
    const loreTitles = screen
      .getAllByRole('heading', { level: 4 })
      .map((heading) => heading.textContent)
      .filter((text) => text !== '')

    // Expected order: newest to oldest based on createdAt
    // mockLoreData[0] = 'The Ancient Prophecy' (2025-01-02)
    // mockLoreData[1] = 'The Forgotten Temple' (2025-01-03) - newest
    // mockLoreData[2] = 'The Dragon's Lair' (2025-01-01) - oldest
    expect(loreTitles).toEqual([
      mockLoreData[1].title, // The Forgotten Temple (2025-01-03) - newest first
      mockLoreData[0].title, // The Ancient Prophecy (2025-01-02)
      mockLoreData[2].title, // The Dragon's Lair (2025-01-01) - oldest last
    ])
  })
})
