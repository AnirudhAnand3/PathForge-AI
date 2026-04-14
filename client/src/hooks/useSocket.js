import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

let socketInstance = null;

export const useSocket = () => {
  const { user, token } = useSelector(s => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user) return;

    if (!socketInstance) {
      socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });
    }
    socketRef.current = socketInstance;

    socketInstance.emit('user:join', user.id || user._id);

    return () => {
      // Don't disconnect on component unmount — keep singleton alive
    };
  }, [token, user]);

  const emit = (event, data) => socketRef.current?.emit(event, data);
  const on   = (event, cb)   => { socketRef.current?.on(event, cb); return () => socketRef.current?.off(event, cb); };

  return { socket: socketRef.current, emit, on };
};