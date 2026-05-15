import React from 'react';
import type { Room } from '../types/challenge.types';

interface RoomCardProps {
  room: Room;
  onJoin: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>
      <p>Status: {room.status}</p>
      <p>Players: {room.players.length}/{room.maxPlayers}</p>
      <button onClick={onJoin}>Join Room</button>
    </div>
  );
};

export default RoomCard;
