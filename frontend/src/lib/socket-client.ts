import { io } from 'socket.io-client';
import { config } from './config';
import { userState } from '../store/user-state';
import { PresenceUpdate, DashboardStats } from '../assets/types/dashboard.type';

// Lazy subscription to avoid circular dependency
let authToken: string | null = null;
let initialized = false;

const initAuthSubscription = () => {
  if (initialized) return;
  initialized = true;
  
  userState.subscribe((state) => {
    authToken = state.token;
  });
};

export const getSocketAuth = () => {
  initAuthSubscription();
  return { token: authToken };
};

export const socket = io(config.URL, {
  auth: getSocketAuth,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  socket.emit('dashboard:subscribe');
});

socket.on('dashboard:presence', (data: PresenceUpdate) => {
  userState.getState().setOnlineUsers(data.onlineUsers);
});

socket.on('dashboard:stats', (data: DashboardStats) => {
  userState.getState().setDashboardStats(data);
});
