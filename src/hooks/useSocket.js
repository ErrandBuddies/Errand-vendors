import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import socketService from '@/lib/socket';

/**
 * Custom hook for managing Socket.IO connection
 * Handles connection lifecycle based on authentication state
 */
export const useSocket = () => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if user is not authenticated
      socketService.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // Connect to socket
    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    if (socketInstance) {
      const handleConnect = () => {
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);

      // Set initial connection status
      setIsConnected(socketInstance.connected);

      return () => {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
      };
    }
  }, [isAuthenticated]);

  return {
    socket,
    isConnected,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};

export default useSocket;
