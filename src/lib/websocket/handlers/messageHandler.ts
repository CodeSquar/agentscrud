import { Socket, Server } from "socket.io";
import { createMessage } from "@/lib/db/messages";

export function registerMessageHandlers(socket: Socket, io: Server) {
  socket.on('sendMessage', async (message: string, roomId: string, userId: string) => {
    if (!message) {
      socket.emit('error', { message: 'message is required' });
      return;
    }
    if (!roomId) {
      socket.emit('error', { message: 'roomId is required' });
      return;
    }
    if (!userId) {
      socket.emit('error', { message: 'userId is required' });
      return;
    }
    try {
      const newMessage = await createMessage({
        content: message,
        sender_id: userId,
        receiver_id: null
      });
      io.to(roomId).emit('message', newMessage);
    } catch (error) {
      socket.emit('error', { message: 'error saving message' });
    }
  });
}

