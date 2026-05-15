import { useEffect } from 'react';
import { getSocket } from '../../../services/socket';
import type { MatchState } from '../types/challenge.types';

export const useLiveSync = (roomId: string, onMatchUpdate: (state: MatchState) => void) => {
  useEffect(() => {
    const socket = getSocket();

    socket.emit('join-match', roomId);

    socket.on('match-update', onMatchUpdate);

    return () => {
      socket.off('match-update', onMatchUpdate);
      socket.emit('leave-match', roomId);
    };
  }, [roomId, onMatchUpdate]);
};

export default useLiveSync;
