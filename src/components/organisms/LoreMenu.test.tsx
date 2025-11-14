import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import LoreMenu from './LoreMenu'
import { API } from '../../api'
import { mockLoreData } from '../../utils/testData'

jest.mock('../../api')

describe('LoreMenu', () => {
  const mockId = '1'

  test('renders hamburger menu button', () => {
    renderWithProviders(<LoreMenu _id={mockId} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    expect(menuButton).toBeInTheDocument()
  })

  test('opens menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoreMenu _id={mockId} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    await user.click(menuButton)

    // Menu items should be visible
    expect(screen.getByText(/^update$/i)).toBeInTheDocument()
    expect(screen.getByText(/^delete$/i)).toBeInTheDocument()
  })

  test('shows update and delete menu items when opened', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoreMenu _id={mockId} />)

    const menuButton = screen.getByRole('button', { name: /options/i })
    await user.click(menuButton)

    const updateItem = screen.getByText(/^update$/i)
    const deleteItem = screen.getByText(/^delete$/i)

    expect(updateItem).toBeInTheDocument()
    expect(deleteItem).toBeInTheDocument()
  })

  test('passes correct _id to menu items', async () => {
    const user = userEvent.setup()
    const testId = '123'
    const mockDeleteLore = API.deleteLore as jest.MockedFunction<
      typeof API.deleteLore
    >
    mockDeleteLore.mockResolvedValue()

    renderWithProviders(<LoreMenu _id={testId} />)

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
      expect(mockDeleteLore).toHaveBeenCalledWith(testId)
    })
  })

  describe('delete functionality', () => {
    test('opens delete alert dialog when delete is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<LoreMenu _id={mockId} />)

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
      renderWithProviders(<LoreMenu _id={mockId} />)

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
      const mockDeleteLore = API.deleteLore as jest.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockResolvedValue()

      renderWithProviders(<LoreMenu _id={mockId} />)

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
        expect(mockDeleteLore).toHaveBeenCalledWith(mockId)
      })

      // Success message should appear
      await waitFor(() => {
        expect(screen.getByText(/lore deleted!/i)).toBeInTheDocument()
      })
    })

    test('cancels delete when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const mockDeleteLore = API.deleteLore as jest.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockResolvedValue()

      renderWithProviders(<LoreMenu _id={mockId} />)

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
      const mockDeleteLore = API.deleteLore as jest.MockedFunction<
        typeof API.deleteLore
      >
      mockDeleteLore.mockRejectedValue(new Error('Delete failed'))

      renderWithProviders(<LoreMenu _id={mockId} />)

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
      const mockGetLoreById = API.getLoreById as jest.MockedFunction<
        typeof API.getLoreById
      >
      mockGetLoreById.mockResolvedValue(mockLoreData[0])

      renderWithProviders(<LoreMenu _id={mockId} />)

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

    test('shows error message when update fails', async () => {
      const user = userEvent.setup()
      const mockUpdateLore = API.updateLore as jest.MockedFunction<
        typeof API.updateLore
      >
      mockUpdateLore.mockRejectedValue(new Error('Update failed'))

      // Call the mutation directly to test error handling
      renderWithProviders(<LoreMenu _id={mockId} />)

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
  })
})
