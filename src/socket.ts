import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

let io: SocketIOServer | null = null;

export const initializeSocket = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Replace with your frontend URL for security
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Listen for the client joining rooms
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Client ${socket.id} joined room: ${conversationId}`);
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.IO initialized');
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error(
      'Socket.IO has not been initialized. Call initializeSocket first.'
    );
  }
  return io;
};
