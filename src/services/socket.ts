import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/env';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

export const connectSocket = (): void => {
  const socketInstance = getSocket();
  if (!socketInstance.connected) {
    socketInstance.connect();
  }
};

export const disconnectSocket = (): void => {
  const socketInstance = getSocket();
  if (socketInstance.connected) {
    socketInstance.disconnect();
  }
};

export default getSocket;
