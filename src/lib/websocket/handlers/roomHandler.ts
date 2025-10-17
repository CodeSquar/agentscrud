import { Socket } from "socket.io";

export function registerRoomHandlers(socket: Socket) {
  socket.on('joinRoom', (roomId: string) => {
    if (!roomId) {
      socket.emit('error', { message: 'roomId is required' });
      return;
    }
    socket.join(roomId);
    console.log('user joined room', roomId);
  });
}

