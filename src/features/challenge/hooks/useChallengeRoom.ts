import { useState, useEffect } from 'react';
import { challengeService } from '../services/challenge.service';
import type { Room } from '../types/challenge.types';

export const useChallengeRoom = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await challengeService.joinRoom(roomId);
        setRoom(data);
      } catch (error) {
        console.error('Failed to load room:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  return { room, loading };
};

export default useChallengeRoom;
