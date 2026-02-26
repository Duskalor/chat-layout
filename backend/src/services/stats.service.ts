import { prisma } from '../config/prisma.js';
import { DashboardStats } from '../types/dashboard.js';

export const getDashboardStats = async (onlineUsersCount: number): Promise<DashboardStats> => {
  const [totalMessages, activeChats, totalTodos, completedTodos] = await Promise.all([
    prisma.message.count(),
    prisma.chat.count(),
    prisma.todo.count(),
    prisma.todo.count({
      where: { completed: true },
    }),
  ]);

  return {
    totalMessages,
    activeChats,
    onlineUsers: onlineUsersCount,
    totalTodos,
    completedTodos,
    pendingTodos: totalTodos - completedTodos,
  };
};
