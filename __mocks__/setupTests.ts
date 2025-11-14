// This file is used to setup test types for TypeScript
import '@testing-library/jest-dom'

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.scrollTo for components that trigger scroll behavior (e.g., modals)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

jest.useFakeTimers({ advanceTimers: true })
