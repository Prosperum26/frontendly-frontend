import React from 'react';
import { useMatchmaking } from '../hooks/useMatchmaking';

export const ChallengeLobby: React.FC = () => {
  const { rooms, loading, loadRooms, createRoom } = useMatchmaking();

  React.useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <div className="challenge-lobby">
      <h2>Challenge Lobby</h2>
      {loading ? (
        <div>Loading rooms...</div>
      ) : (
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              <p>{room.players.length}/{room.maxPlayers} players</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeLobby;
