import http from 'http';
import app from './app';
import { config } from './config/config';
import { connectDB } from './config/database';
import { initializeSocket } from './socket';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting Down....');
  console.log(err);
  process.exit(1);
});

connectDB();

const httpServer = http.createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting Down...');
  console.log(err);
  httpServer.close(() => {
    process.exit(1);
  });
});
