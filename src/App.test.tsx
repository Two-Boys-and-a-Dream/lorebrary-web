/**
 * App Component Integration Tests
 *
 * These tests cover complete user interaction flows through the application,
 * simulating real user behavior from start to finish. Tests include:
 * - Creating, updating, and deleting lore items
 * - Form validation and error handling
 * - User cancellation flows
 * - Network error scenarios
 * - UI interactions (modals, accordions, menus)
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'
import API from './api/API'
import type { Lore, NewLore } from './types/data'
import { mockLoreData } from './utils/testData'

// Mock the API module
vi.mock('./api/API')

// Helper function to get form inputs by name attribute
const getInputByName = (name: string) => {
  return screen.getByRole('textbox', {
    name: (_accessibleName, element) => {
      return (element as HTMLInputElement).name === name
    },
  })
}

describe('App Component - Full User Interaction Flows', () => {
  // Reset mock implementations before each test
  beforeEach(() => {
    // Reset getAllLore to return mockLoreData by default
    const mockGetAllLore = API.getAllLore as vi.MockedFunction<
      typeof API.getAllLore
    >
    mockGetAllLore.mockResolvedValue(mockLoreData)

    // Reset createLore to its default successful implementation
    const mockCreateLore = API.createLore as vi.MockedFunction<
      typeof API.createLore
    >
    mockCreateLore.mockImplementation((newLore: NewLore) => {
      const lore: Lore = {
        id: `${mockLoreData.length + 1}`,
        ...newLore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return Promise.resolve(lore)
    })

    // Reset updateLore to its default successful implementation
    const mockUpdateLore = API.updateLore as vi.MockedFunction<
      typeof API.updateLore
    >
    mockUpdateLore.mockImplementation((updatedLore: Lore) => {
      return Promise.resolve({
        ...updatedLore,
        updatedAt: new Date().toISOString(),
      })
    })

    // Reset deleteLore to its default successful implementation
    const mockDeleteLore = API.deleteLore as vi.MockedFunction<
      typeof API.deleteLore
    >
    mockDeleteLore.mockResolvedValue(undefined)
  })

  describe('Initial app load and data display', () => {
    test('renders app with navbar and loads lore items', async () => {
      render(<App />)

      // Navbar should be present
      expect(
        screen.getByRole('button', { name: /add lore/i })
      ).toBeInTheDocument()

      // Wait for lore items to load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
        expect(screen.getByText(mockLoreData[1].title)).toBeInTheDocument()
      })

      // Verify API was called
      expect(API.getAllLore).toHaveBeenCalledTimes(1)
    })

    test('displays all lore item details correctly', async () => {
      render(<App />)

      // Wait for first lore item to load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Verify lore content is displayed
      expect(screen.getByText(mockLoreData[0].text)).toBeInTheDocument()
    })
  })

  describe('Create lore flow', () => {
    test('complete flow: open modal, fill form, create lore, see new item', async () => {
      const user = userEvent.setup()
      const mockCreateLore = API.createLore as vi.MockedFunction<
        typeof API.createLore
      >

      render(<App />)

      // Wait for initial data load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Step 1: Click Add button
      const addButton = screen.getByRole('button', { name: /add lore/i })
      await user.click(addButton)

      // Step 2: Verify modal is open
      expect(screen.getByText(/create lore/i)).toBeInTheDocument()

      // Step 3: Fill out the form
      await user.type(getInputByName('title'), 'Epic Quest Begins')
      await user.type(getInputByName('subtitle'), 'The hero awakens')
      await user.type(getInputByName('game'), 'Fantasy RPG')
      await user.type(
        getInputByName('text'),
        'In a land far away, a hero begins their journey to save the kingdom.'
      )

      // Step 4: Submit the form
      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      // Step 5: Verify API was called with correct data
      await waitFor(() => {
        expect(mockCreateLore).toHaveBeenCalledWith({
          title: 'Epic Quest Begins',
          subtitle: 'The hero awakens',
          game: 'Fantasy RPG',
          text: 'In a land far away, a hero begins their journey to save the kingdom.',
        })
      })

      // Step 6: Verify success toast appears
      await waitFor(() => {
        expect(screen.getByText(/lore created/i)).toBeInTheDocument()
      })

      // Step 7: Verify modal closes
      await waitFor(() => {
        expect(screen.queryByText(/create lore/i)).not.toBeInTheDocument()
      })

      // Step 8: Verify lore list is refreshed (getAllLore called again)
      await waitFor(() => {
        expect(API.getAllLore).toHaveBeenCalledTimes(2)
      })
    })

    test('validation flow: attempt submit with empty form, see errors, fill form, succeed', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Open modal
      await user.click(screen.getByRole('button', { name: /add lore/i }))

      // Try to submit empty form
      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      // Should see validation error
      await waitFor(() => {
        expect(
          screen.getByText(/please fill out all fields/i)
        ).toBeInTheDocument()
      })

      // Modal should still be open
      expect(screen.getByText(/create lore/i)).toBeInTheDocument()

      // Fill in the form
      await user.type(getInputByName('title'), 'Valid Title')
      await user.type(getInputByName('subtitle'), 'Valid Subtitle')
      await user.type(getInputByName('game'), 'Valid Game')
      await user.type(getInputByName('text'), 'Valid content')

      // Submit again
      await user.click(createButton)

      // Should succeed and close modal
      await waitFor(() => {
        expect(screen.getByText(/lore created/i)).toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    test('cancellation flow: open modal, fill form, close without saving', async () => {
      const user = userEvent.setup()
      const mockCreateLore = API.createLore as vi.MockedFunction<
        typeof API.createLore
      >

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Open modal and fill form
      await user.click(screen.getByRole('button', { name: /add lore/i }))
      await user.type(getInputByName('title'), 'Unsaved')

      // Close modal without saving - use Cancel button instead of close icon
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/create lore/i)).not.toBeInTheDocument()
      })

      // Create API should not have been called
      expect(mockCreateLore).not.toHaveBeenCalled()
    })
  })

  describe('Update lore flow', () => {
    test('complete flow: open menu, click update, modify fields, save, see changes', async () => {
      const user = userEvent.setup()
      const mockUpdateLore = API.updateLore as vi.MockedFunction<
        typeof API.updateLore
      >

      render(<App />)

      // Wait for lore items to load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Find the lore card and open its menu
      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })

      // Click the hamburger menu button (first one)
      const menuButtons = screen.getAllByRole('button', { name: /options/i })
      await user.click(menuButtons[0])

      // Click Update option
      const updateMenuItem = screen.getByText(/^update$/i)
      await user.click(updateMenuItem)

      // Modal should open with Update title and pre-filled data
      await waitFor(() => {
        expect(screen.getByText(/update lore/i)).toBeInTheDocument()
      })

      // Verify fields are pre-filled
      // Note: First displayed item is mockLoreData[1] due to sorting by createdAt
      const titleInput = getInputByName('title')
      expect(titleInput).toHaveValue(mockLoreData[1].title)

      // Modify the title
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Quest Title')

      // Submit the update
      const updateButton = screen.getByRole('button', { name: /^update$/i })
      await user.click(updateButton)

      // Verify API was called with updated data
      await waitFor(() => {
        expect(mockUpdateLore).toHaveBeenCalledWith(
          expect.objectContaining({
            id: mockLoreData[1].id,
            title: 'Updated Quest Title',
          })
        )
      })

      // Success toast should appear
      await waitFor(() => {
        expect(screen.getByText(/lore updated/i)).toBeInTheDocument()
      })

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/update lore/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Delete lore flow', () => {
    test('complete flow: open menu, click delete, confirm, see item removed', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >

      render(<App />)

      // Wait for lore items to load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Find the lore card and open its menu
      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })

      // Click the hamburger menu button (first one)
      const menuButtons = screen.getAllByRole('button', { name: /options/i })
      await user.click(menuButtons[0])

      // Click Delete option
      const deleteMenuItem = screen.getByText(/^delete$/i)
      await user.click(deleteMenuItem)

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(
          screen.getByText(/are you sure.*you can't undo/i)
        ).toBeInTheDocument()
      })

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /^delete$/i })
      await user.click(confirmButton)

      // Verify API was called
      // Note: First displayed item is mockLoreData[1] due to sorting by createdAt
      await waitFor(() => {
        expect(mockDeleteLore).toHaveBeenCalledWith(mockLoreData[1].id)
      })

      // Success toast should appear
      await waitFor(() => {
        expect(screen.getByText(/lore deleted/i)).toBeInTheDocument()
      })

      // Dialog should close
      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure.*you can't undo/i)
        ).not.toBeInTheDocument()
      })
    })

    test('cancellation flow: open delete dialog, cancel', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Open menu and click delete
      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })
      const menuButtons = screen.getAllByRole('button', { name: /options/i })
      await user.click(menuButtons[0])

      const deleteMenuItem = screen.getByText(/^delete$/i)
      await user.click(deleteMenuItem)

      // Wait for confirmation dialog
      await waitFor(() => {
        expect(
          screen.getByText(/are you sure.*you can't undo/i)
        ).toBeInTheDocument()
      })

      // Click Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      // Dialog should close
      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure.*you can't undo/i)
        ).not.toBeInTheDocument()
      })

      // Delete API should not have been called
      expect(mockDeleteLore).not.toHaveBeenCalled()

      // Lore item should still be visible
      expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
    })
  })

  describe('View lore details flow', () => {
    test('complete flow: click info icon to view context details in popover', async () => {
      const user = userEvent.setup()
      render(<App />)

      // The first displayed item is mockLoreData[1] (The Forgotten Temple) due to sorting by date (newest first)
      const firstDisplayedItem = mockLoreData[1]

      // Wait for lore items to load with full content (not just skeletons)
      await waitFor(() => {
        expect(screen.getByText(firstDisplayedItem.title)).toBeInTheDocument()
        expect(screen.getByText(firstDisplayedItem.text)).toBeInTheDocument()
      })

      // Find the info icon buttons - get the first one
      const infoIcons = screen.getAllByLabelText('info-circle')
      const firstInfoIcon = infoIcons[0]

      // Initially, detailed context (game, subtitle) should not be visible
      const gameElements = screen.queryAllByText(
        `Game: ${firstDisplayedItem.game}`
      )
      expect(gameElements.length).toBe(0)

      // Click info icon to open popover
      await user.click(firstInfoIcon)

      // Context details should now be visible in the popover
      await waitFor(() => {
        const gameTexts = screen.getAllByText(
          `Game: ${firstDisplayedItem.game}`
        )
        expect(gameTexts.length).toBeGreaterThan(0)
        const infoTexts = screen.getAllByText(
          `Info: ${firstDisplayedItem.subtitle}`
        )
        expect(infoTexts.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error handling flows', () => {
    test('network error on initial load shows error message', async () => {
      const mockGetAllLore = API.getAllLore as vi.MockedFunction<
        typeof API.getAllLore
      >
      mockGetAllLore.mockRejectedValue(new Error('Network connection failed'))

      render(<App />)

      await screen.findByText(/network connection failed/i)

      // Error message should appear
      await waitFor(() => {
        expect(
          screen.getByText(/network connection failed/i)
        ).toBeInTheDocument()
      })
    })

    test('error on create shows specific error message', async () => {
      const user = userEvent.setup()
      const mockCreateLore = API.createLore as vi.MockedFunction<
        typeof API.createLore
      >
      mockCreateLore.mockRejectedValue(new Error('Failed to create'))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Open modal and fill form
      await user.click(screen.getByRole('button', { name: /add lore/i }))
      await user.type(getInputByName('title'), 'Test')
      await user.type(getInputByName('subtitle'), 'Test')
      await user.type(getInputByName('game'), 'Test')
      await user.type(getInputByName('text'), 'Test')

      // Submit
      await user.click(screen.getByRole('button', { name: /^create$/i }))

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/failed to create/i)).toBeInTheDocument()
      })

      // Modal should remain open
      expect(screen.getByText(/create lore/i)).toBeInTheDocument()
    })

    test('network error on delete shows error toast', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockRejectedValue(new Error('Delete failed'))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Open menu and delete
      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })
      const menuButtons = screen.getAllByRole('button', { name: /options/i })
      await user.click(menuButtons[0])

      await user.click(screen.getByText(/^delete$/i))

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure.*you can't undo/i)
        ).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /^delete$/i }))

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Multiple operations flow', () => {
    test('create, update, and delete lore items in sequence', async () => {
      const user = userEvent.setup()
      const mockUpdateLore = API.updateLore as vi.MockedFunction<
        typeof API.updateLore
      >
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >

      render(<App />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Operation 1: Create new lore
      await user.click(screen.getByRole('button', { name: /add lore/i }))

      // Verify modal is open before filling form
      await waitFor(() => {
        expect(screen.getByText(/create lore/i)).toBeInTheDocument()
      })

      await user.type(getInputByName('title'), 'New Story')
      await user.type(getInputByName('subtitle'), 'Chapter 1')
      await user.type(getInputByName('game'), 'Adventure')
      await user.type(getInputByName('text'), 'Content here')

      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      // Wait for the create button to stop being in loading state
      await waitFor(
        () => {
          const button = screen.queryByRole('button', { name: /creating/i })
          expect(button).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Wait for modal to close (modal closes on success in onSuccess callback)
      await waitFor(
        () => {
          expect(screen.queryByText(/create lore/i)).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Operation 2: Update existing lore
      // Wait for the lore cards to be available again
      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })

      await waitFor(() => {
        expect(
          screen.getAllByRole('heading', { level: 4 }).length
        ).toBeGreaterThan(0)
      })
      const menuButtons = screen.getAllByRole('button', { name: /options/i })
      await user.click(menuButtons[0])
      await user.click(screen.getByText(/^update$/i))

      await waitFor(() => {
        expect(screen.getByText(/update lore/i)).toBeInTheDocument()
      })

      const titleInput = getInputByName('title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Modified Title')
      await user.click(screen.getByRole('button', { name: /^update$/i }))

      await waitFor(() => {
        expect(mockUpdateLore).toHaveBeenCalled()
      })

      // Operation 3: Delete a lore
      const menuButtonsForDelete = screen.getAllByRole('button', {
        name: /options/i,
      })
      await user.click(menuButtonsForDelete[0])
      await user.click(screen.getByText(/^delete$/i))

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure.*you can't undo/i)
        ).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /^delete$/i }))

      await waitFor(() => {
        expect(mockDeleteLore).toHaveBeenCalled()
      })
    })
  })

  describe('Theme toggle flow', () => {
    test('toggles between dark and light mode', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(mockLoreData[0].title)).toBeInTheDocument()
      })

      // Find the theme toggle button
      const themeButton = screen.getByRole('button', {
        name: /toggle color mode/i,
      })
      expect(themeButton).toBeInTheDocument()

      // App starts in dark mode, so sun icon should be present (to switch to light)
      const sunIcon = screen.getByLabelText('sun')
      expect(sunIcon).toBeInTheDocument()

      // Click to toggle to light mode
      await user.click(themeButton)

      // After toggle, moon icon should be present (to switch to dark)
      await waitFor(() => {
        const moonIcon = screen.getByLabelText('moon')
        expect(moonIcon).toBeInTheDocument()
      })

      // Sun icon should not be present anymore
      expect(screen.queryByLabelText('sun')).not.toBeInTheDocument()

      // Toggle back to dark mode
      await user.click(themeButton)

      // Sun icon should be back
      await waitFor(() => {
        const sunIconAgain = screen.getByLabelText('sun')
        expect(sunIconAgain).toBeInTheDocument()
      })

      // Moon icon should not be present anymore
      expect(screen.queryByLabelText('moon')).not.toBeInTheDocument()
    })
  })
})
