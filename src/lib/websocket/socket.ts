import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { registerSocketHandlers } from "./handlers";

export function createSocketServer(httpServer: HttpServer): Server {
  const options: Partial<ServerOptions> = {
    path: '/api/socket',
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
        : process.env.NEXT_PUBLIC_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  };

  const io = new Server(httpServer, options);

  io.on('connection', (socket) => {
    registerSocketHandlers(socket, io);
  });

  return io;
}

