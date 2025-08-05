import { beforeEach, vi } from 'vitest'

// Mock WebRTC APIs
global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
  createDataChannel: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  close: vi.fn(),
  onicecandidate: null,
  ondatachannel: null,
  onconnectionstatechange: null,
  connectionState: 'new',
  localDescription: null,
  remoteDescription: null,
}))

global.RTCSessionDescription = vi.fn().mockImplementation((init) => init)
global.RTCIceCandidate = vi.fn().mockImplementation((init) => init)

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  onopen: null,
  onmessage: null,
  onclose: null,
  onerror: null,
  readyState: WebSocket.CONNECTING,
}))

// Mock fetch for any HTTP requests
global.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})