import { describe, it, expect, beforeEach, vi } from 'vitest'
import { connectToSignallingServer } from '../../client/scripts/signalling'

// Mock WebSocket
class MockWebSocket {
  url: string
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  readyState: number = WebSocket.CONNECTING

  constructor(url: string) {
    this.url = url
    // Simulate async connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN
      if (this.onopen) {
        this.onopen(new Event('open'))
      }
    }, 0)
  }

  send() {
    // Mock send implementation
  }

  close() {
    this.readyState = WebSocket.CLOSED
    if (this.onclose) {
      this.onclose(new CloseEvent('close'))
    }
  }
}

describe('Signalling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.WebSocket = MockWebSocket as any
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        hostname: 'localhost',
        search: ''
      },
      writable: true
    })
  })

  describe('connectToSignallingServer', () => {
    it('should establish WebSocket connection successfully', async () => {
      const promise = connectToSignallingServer()
      
      // Wait for the connection to be established
      await expect(promise).resolves.toBeUndefined()
    })

    it('should use correct WebSocket URL for HTTP', async () => {
      const mockWebSocket = vi.fn().mockImplementation((url) => {
        expect(url).toBe('ws://localhost:3000')
        return new MockWebSocket(url)
      })
      global.WebSocket = mockWebSocket

      await connectToSignallingServer()
      
      expect(mockWebSocket).toHaveBeenCalledWith('ws://localhost:3000')
    })

    it('should use secure WebSocket for HTTPS', async () => {
      // Mock HTTPS location
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com'
        },
        writable: true
      })

      const mockWebSocket = vi.fn().mockImplementation((url) => {
        expect(url).toBe('wss://example.com:3000')
        return new MockWebSocket(url)
      })
      global.WebSocket = mockWebSocket

      await connectToSignallingServer()
      
      expect(mockWebSocket).toHaveBeenCalledWith('wss://example.com:3000')
    })

    it('should reject on WebSocket error', async () => {
      class FailingMockWebSocket {
        url: string
        onopen: ((event: Event) => void) | null = null
        onclose: ((event: CloseEvent) => void) | null = null
        onerror: ((event: Event) => void) | null = null
        onmessage: ((event: MessageEvent) => void) | null = null
        readyState: number = WebSocket.CONNECTING

        constructor(url: string) {
          this.url = url
          // Immediately trigger error instead of success
          setTimeout(() => {
            this.readyState = WebSocket.CLOSED
            if (this.onerror) {
              this.onerror(new Event('error'))
            }
          }, 0)
        }

        send() {}
        close() {}
      }

      global.WebSocket = FailingMockWebSocket as any

      await expect(connectToSignallingServer()).rejects.toBeInstanceOf(Event)
    })

    it('should handle message parsing errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      class MessageMockWebSocket extends MockWebSocket {
        constructor(url: string) {
          super(url)
          setTimeout(() => {
            this.readyState = WebSocket.OPEN
            if (this.onopen) {
              this.onopen(new Event('open'))
            }
            // Send invalid JSON after connection is established
            setTimeout(() => {
              if (this.onmessage) {
                this.onmessage(new MessageEvent('message', { data: 'invalid json' }))
              }
            }, 10)
          }, 0)
        }
      }

      global.WebSocket = MessageMockWebSocket as any

      await connectToSignallingServer()
      
      // Wait a bit for the message processing
      await new Promise(resolve => setTimeout(resolve, 20))
      
      expect(consoleSpy).toHaveBeenCalledWith('Error parsing signalling message:', expect.any(Error))
    })
  })
})
