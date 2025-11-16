// This file is used to setup test types for TypeScript
import '@testing-library/jest-dom'

// Set up environment variables for tests
// Note: In tests, we use process.env but in app code we use import.meta.env
process.env.VITE_API_URL = 'https://api.example.com/'

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

// Mock getComputedStyle for Ant Design components
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn().mockReturnValue(''),
    paddingLeft: '0px',
    paddingRight: '0px',
  })),
})

jest.useFakeTimers({ advanceTimers: true })
