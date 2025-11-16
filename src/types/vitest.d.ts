/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { InlineConfig } from 'vitest'

declare module 'vite' {
  interface UserConfig {
    test?: InlineConfig
  }
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any>
    extends jest.Matchers<void>,
      TestingLibraryMatchers<T, void> {}
}

// Make vi available as a global type (it's already available at runtime via globals: true)
declare global {
  namespace vi {
    type MockedFunction<T> = import('vitest').MockedFunction<T>
  }
}
