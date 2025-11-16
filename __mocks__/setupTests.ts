// This file is used to setup test types for TypeScript
import { expect, vi, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Set up environment variables for tests
// Note: In tests, we use process.env but in app code we use import.meta.env
process.env.VITE_API_URL = 'https://api.example.com'

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.scrollTo for components that trigger scroll behavior (e.g., modals)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock getComputedStyle for Ant Design components
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
    paddingLeft: '0px',
    paddingRight: '0px',
  })),
})

// Configure Ant Design to disable animations in tests
// This prevents act() warnings from animation components
beforeAll(() => {
  // Disable CSS animations
  const style = document.createElement('style')
  style.innerHTML = `
    * {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `
  document.head.appendChild(style)

  // Mock requestAnimationFrame to execute immediately
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  }

  // Mock cancelAnimationFrame
  global.cancelAnimationFrame = () => {}
})

// Use real timers for better animation handling
vi.useRealTimers()
