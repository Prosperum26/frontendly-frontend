import { useEffect } from 'react';
import { getSocket } from '../../../services/socket';

export const useCodeSync = (roomId: string, onCodeChange: (code: string) => void) => {
  useEffect(() => {
    const socket = getSocket();

    socket.emit('join-room', roomId);

    socket.on('code-change', onCodeChange);

    return () => {
      socket.off('code-change', onCodeChange);
      socket.emit('leave-room', roomId);
    };
  }, [roomId, onCodeChange]);
};

export default useCodeSync;
