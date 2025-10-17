//websockets server
import { createServer } from 'http'
import { parse } from 'url';
import next from 'next';
import { PrismaClient } from "@prisma/client";
import { createSocketServer } from "@/lib/websocket/socket";

const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
    // Crear servidor HTTP
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url || '', true);
        handle(req, res, parsedUrl);
    });

    // Crear servidor WebSocket (Socket.IO)
    const io = createSocketServer(httpServer);
   
    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Ready on http://localhost:${PORT}`);
    });
});

// Cleanup de Prisma al cerrar el servidor
const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received. Closing Prisma connection...`);
    await prisma.$disconnect();
    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));