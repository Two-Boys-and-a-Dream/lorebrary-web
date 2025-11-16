import { describe, test, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import LoreMenu from './LoreMenu'
import API from '../../api/API'
import { mockLoreData } from '../../utils/testData'

vi.mock('../../api/API')

describe('LoreMenu', () => {
  const mockLore = mockLoreData[0]

  test('renders hamburger menu button', () => {
    renderWithProviders(<LoreMenu lore={mockLore} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    expect(menuButton).toBeInTheDocument()
  })

  test('opens menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoreMenu lore={mockLore} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    await user.click(menuButton)

    // Menu items should be visible
    expect(screen.getByText(/^update$/i)).toBeInTheDocument()
    expect(screen.getByText(/^delete$/i)).toBeInTheDocument()
  })

  test('shows update and delete menu items when opened', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoreMenu lore={mockLore} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    await user.click(menuButton)

    const updateItem = screen.getByText(/^update$/i)
    const deleteItem = screen.getByText(/^delete$/i)

    expect(updateItem).toBeInTheDocument()
    expect(deleteItem).toBeInTheDocument()
  })

  test('passes correct id to menu items', async () => {
    const user = userEvent.setup()
    const testLore = { ...mockLoreData[0], id: '123' }
    const mockDeleteLore = API.deleteLore as vi.MockedFunction<
      typeof API.deleteLore
    >
    mockDeleteLore.mockResolvedValue()

    renderWithProviders(<LoreMenu lore={testLore} />)

    // Open menu and delete
    const menuButton = screen.getByRole('button', { name: /options/i })
    await user.click(menuButton)

    const deleteItem = screen.getByText(/^delete$/i)
    await user.click(deleteItem)

    const confirmButton = await screen.findByRole('button', {
      name: /^delete$/i,
    })
    await user.click(confirmButton)

    // Should call API with correct ID
    await waitFor(() => {
      expect(mockDeleteLore).toHaveBeenCalledWith(testLore.id)
    })
  })

  describe('delete functionality', () => {
    test('opens delete alert dialog when delete is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      // Click delete
      const deleteItem = screen.getByRole('menuitem', { name: /delete/i })
      await user.click(deleteItem)

      // Alert dialog should appear - use findByText which waits automatically
      const dialogTitle = await screen.findByText(/delete lore/i)
      expect(dialogTitle).toBeInTheDocument()
    })

    test('closes menu after delete item is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      // Click delete
      const deleteItem = screen.getByRole('menuitem', { name: /delete/i })
      await user.click(deleteItem)

      // Menu should close (confirmation dialog appears)
      const dialogTitle = await screen.findByText(/delete lore/i)
      expect(dialogTitle).toBeInTheDocument()
    })

    test('deletes lore when delete is confirmed', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockResolvedValue()

      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu and click delete
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const deleteItem = screen.getByText(/^delete$/i)
      await user.click(deleteItem)

      // Confirm deletion in alert dialog
      const confirmButton = await screen.findByRole('button', {
        name: /^delete$/i,
      })
      await user.click(confirmButton)

      // API should be called
      await waitFor(() => {
        expect(mockDeleteLore).toHaveBeenCalledWith(mockLore.id)
      })

      // Success message should appear
      await waitFor(() => {
        expect(screen.getByText(/lore deleted!/i)).toBeInTheDocument()
      })
    })

    test('cancels delete when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockResolvedValue()

      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu and click delete
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const deleteItem = screen.getByText(/^delete$/i)
      await user.click(deleteItem)

      // Cancel deletion
      const cancelButton = await screen.findByRole('button', {
        name: /cancel/i,
      })
      await user.click(cancelButton)

      // API should not be called
      expect(mockDeleteLore).not.toHaveBeenCalled()

      // Alert dialog should close
      await waitFor(() => {
        expect(screen.queryByText(/delete lore/i)).not.toBeInTheDocument()
      })
    })

    test('shows error message when delete fails', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as vi.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockRejectedValue(new Error('Delete failed'))

      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu and click delete
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const deleteItem = screen.getByText(/^delete$/i)
      await user.click(deleteItem)

      // Confirm deletion
      const confirmButton = await screen.findByRole('button', {
        name: /^delete$/i,
      })
      await user.click(confirmButton)

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('update functionality', () => {
    test('opens update modal when update is clicked', async () => {
      const user = userEvent.setup()
      const mockGetLoreById = API.getLoreById as vi.MockedFunction<
        typeof API.getLoreById
      >
      mockGetLoreById.mockResolvedValue(mockLoreData[0])

      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      // Click update
      const updateItem = screen.getByText(/^update$/i)
      await user.click(updateItem)

      // Update modal should appear
      await waitFor(() => {
        expect(screen.getByText(/update lore/i)).toBeInTheDocument()
      })
    })

    test('closes update modal when close is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<LoreMenu lore={mockLore} />)

      // Open menu and click update
      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const updateItem = screen.getByText(/^update$/i)
      await user.click(updateItem)

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByText(/update lore/i)).toBeInTheDocument()
      })

      // Close the modal
      const closeButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(closeButton)

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/update lore/i)).not.toBeInTheDocument()
      })
    })

    test('shows error message when update fails', async () => {
      const user = userEvent.setup()
      const mockUpdateLore = API.updateLore as vi.MockedFunction<
        typeof API.updateLore
      >
      mockUpdateLore.mockRejectedValue(new Error('Update failed'))

      // Call the mutation directly to test error handling
      renderWithProviders(<LoreMenu lore={mockLore} />)

      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const updateItem = screen.getByText(/^update$/i)
      await user.click(updateItem)

      // Fill the form to make it valid
      const inputs = await screen.findAllByRole('textbox')
      for (const input of inputs) {
        await user.type(input, 'test')
      }

      const submitButton = screen.getByRole('button', { name: /^update$/i })
      await user.click(submitButton)

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/update failed/i)).toBeInTheDocument()
      })
    })

    test('shows success message and closes modal when update succeeds', async () => {
      const user = userEvent.setup()
      const mockUpdateLore = API.updateLore as vi.MockedFunction<
        typeof API.updateLore
      >
      mockUpdateLore.mockResolvedValue({
        ...mockLoreData[0],
        title: 'Updated Title',
        updatedAt: new Date().toISOString(),
      })

      renderWithProviders(<LoreMenu lore={mockLore} />)

      const menuButton = screen.getByRole('button', { name: /options/i })
      await user.click(menuButton)

      const updateItem = screen.getByText(/^update$/i)
      await user.click(updateItem)

      // Fill the form to make it valid
      const inputs = await screen.findAllByRole('textbox')
      for (const input of inputs) {
        await user.clear(input)
        await user.type(input, 'Updated')
      }

      const submitButton = screen.getByRole('button', { name: /^update$/i })
      await user.click(submitButton)

      // Success message should appear
      await waitFor(() => {
        expect(screen.getByText(/lore updated!/i)).toBeInTheDocument()
      })

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/update lore/i)).not.toBeInTheDocument()
      })
    })
  })
})
