import api from '../../../services/api';
import type { Room, MatchState } from '../types/challenge.types';

export const challengeService = {
  async createRoom(name: string): Promise<Room> {
    const response = await api.post<Room>('/challenge/rooms', { name });
    return response.data;
  },

  async joinRoom(roomId: string): Promise<Room> {
    const response = await api.post<Room>(`/challenge/rooms/${roomId}/join`);
    return response.data;
  },

  async getRooms(): Promise<Room[]> {
    const response = await api.get<Room[]>('/challenge/rooms');
    return response.data;
  },

  async getMatchState(roomId: string): Promise<MatchState> {
    const response = await api.get<MatchState>(`/challenge/matches/${roomId}`);
    return response.data;
  },
};

export default challengeService;
