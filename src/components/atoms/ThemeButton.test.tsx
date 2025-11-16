import { describe, test, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import ThemeButton from './ThemeButton'

describe('ThemeButton', () => {
  const mockToggleTheme = vi.fn()

  test('renders successfully', () => {
    renderWithProviders(<ThemeButton darkMode toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /toggle color mode/i })
    expect(button).toBeInTheDocument()
  })

  test('has correct aria-label', () => {
    renderWithProviders(<ThemeButton darkMode toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /toggle color mode/i })
    expect(button).toHaveAttribute('aria-label', 'Toggle color mode')
  })

  test('toggles color mode when clicked', async () => {
    const user = userEvent.setup()
    const toggleFn = vi.fn()
    renderWithProviders(<ThemeButton darkMode toggleTheme={toggleFn} />)

    const button = screen.getByRole('button', { name: /toggle color mode/i })

    // Click to toggle
    await user.click(button)

    // Should call the toggle function
    expect(toggleFn).toHaveBeenCalledTimes(1)
  })

  test('is clickable', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeButton darkMode toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /toggle color mode/i })

    // Verify button is enabled
    expect(button).toBeEnabled()

    // Should be able to click it
    await user.click(button)
  })
})
