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
import { connectDatabase } from './config/prisma.js';
import { getDashboardStats } from './services/stats.service.js';
import { PresenceUpdate, DashboardStats } from './types/dashboard.js';

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

const onlineUsers: Map<string, Set<string>> = new Map();

const getOnlineUserIds = (): string[] => {
  return Array.from(onlineUsers.keys());
};

const emitPresence = (): void => {
  const presenceUpdate: PresenceUpdate = {
    onlineUsers: getOnlineUserIds(),
  };
  io.emit('dashboard:presence', presenceUpdate);
};

let cachedStats: DashboardStats | null = null;

const emitStats = async (): Promise<void> => {
  try {
    cachedStats = await getDashboardStats(getOnlineUserIds().length);
    io.emit('dashboard:stats', cachedStats);
  } catch (error) {
    console.error('Failed to emit stats:', error);
  }
};

const statsInterval = setInterval(emitStats, 10000);

io.on('connection', (socket) => {
  const user = socket.data.user as AuthUser;
  console.log('Client connected:', socket.id, 'User:', user?.userId);

  if (user?.userId) {
    if (!onlineUsers.has(user.userId)) {
      onlineUsers.set(user.userId, new Set());
    }
    onlineUsers.get(user.userId)!.add(socket.id);
    emitPresence();
  }

  socket.on('connected', async (userId: string) => {
    console.log(`User ${userId} connected`);
    const chats = await getChats(userId);
    socket.emit('messages', chats);
  });

  socket.on('sendMessage', async (message: unknown) => {
    const result = await sendMessage(message, (event, data) => {
      io.emit(event, data);
    });
    if ('error' in result) {
      socket.emit('error', { message: result.error });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const user = socket.data.user as AuthUser;
    if (user?.userId) {
      const userSockets = onlineUsers.get(user.userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(user.userId);
        }
      }
      emitPresence();
    }
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    httpServer.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    clearInterval(statsInterval);
    process.exit(1);
  }
};

startServer();
