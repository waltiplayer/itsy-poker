import { beforeEach, vi } from 'vitest'

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})
