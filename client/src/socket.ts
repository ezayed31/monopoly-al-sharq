import { io, Socket } from 'socket.io-client';

// In production the socket connects to the same origin (server serves the frontend).
// In dev mode connect to the local server port.
const SOCKET_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
