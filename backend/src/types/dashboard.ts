export interface DashboardStats {
  totalMessages: number;
  activeChats: number;
  onlineUsers: number;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export interface PresenceUpdate {
  onlineUsers: string[];
}
