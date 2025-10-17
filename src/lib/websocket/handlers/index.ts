import { Socket, Server } from "socket.io";
import { registerRoomHandlers } from "./roomHandler";
import { registerMessageHandlers } from "./messageHandler";

export function registerSocketHandlers(socket: Socket, io: Server) {
  console.log('a user connected', socket.id);
  
  registerRoomHandlers(socket);
  registerMessageHandlers(socket, io);

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
  });
}

