import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { getChats, sendMessage } from './controllers/chat.controller.js';
import { AuthUser } from './middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

const authenticateSocket = (socket: Socket): AuthUser | null => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, config.jwtSecret) as AuthUser;
  } catch {
    return null;
  }
};

io.use((socket, next) => {
  const user = authenticateSocket(socket);
  if (!user) {
    return next(new Error('Authentication error'));
  }
  socket.data.user = user;
  next();
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id, 'User:', socket.data.user?.userId);

  socket.on('connected', (userId: string) => {
    console.log(`User ${userId} connected`);
    const chats = getChats(userId);
    socket.emit('messages', chats);
  });

  socket.on('sendMessage', (message: unknown) => {
    const result = sendMessage(message, (event, data) => {
      io.emit(event, data);
    });
    if ('error' in result) {
      socket.emit('error', { message: result.error });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
