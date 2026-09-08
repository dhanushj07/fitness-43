import { io, Socket } from 'socket.io-client';
import { AppNotification } from '../types';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // In browser, connect to current host origin
    const url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[FitFlow Client Socket] Connected to realtime server:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[FitFlow Client Socket] Disconnected:', reason);
    });
  }
  return socket;
}

export function subscribeToRealtimeUpdates(callbacks: {
  onAttendance?: (data: { record: any; totalFloorCount: number; message: string }) => void;
  onSessionBooked?: (data: { session: any; message: string }) => void;
  onSessionCancelled?: (data: { sessionId: string; message: string }) => void;
  onNewNotification?: (notification: AppNotification) => void;
}): () => void {
  const s = getSocket();

  if (callbacks.onAttendance) {
    s.on('attendance:checked-in', callbacks.onAttendance);
  }
  if (callbacks.onSessionBooked) {
    s.on('session:booked', callbacks.onSessionBooked);
  }
  if (callbacks.onSessionCancelled) {
    s.on('session:cancelled', callbacks.onSessionCancelled);
  }
  if (callbacks.onNewNotification) {
    s.on('notification:new', callbacks.onNewNotification);
  }

  // Return unsubscribe cleanup function
  return () => {
    if (callbacks.onAttendance) s.off('attendance:checked-in', callbacks.onAttendance);
    if (callbacks.onSessionBooked) s.off('session:booked', callbacks.onSessionBooked);
    if (callbacks.onSessionCancelled) s.off('session:cancelled', callbacks.onSessionCancelled);
    if (callbacks.onNewNotification) s.off('notification:new', callbacks.onNewNotification);
  };
}
