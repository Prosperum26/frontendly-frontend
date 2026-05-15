import { useState } from 'react';
import { challengeService } from '../services/challenge.service';
import type { Room } from '../types/challenge.types';

export const useMatchmaking = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await challengeService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (name: string) => {
    const room = await challengeService.createRoom(name);
    setRooms((prev) => [...prev, room]);
    return room;
  };

  return { rooms, loading, loadRooms, createRoom };
};

export default useMatchmaking;
