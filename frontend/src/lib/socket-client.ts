import { io } from 'socket.io-client';
import { config } from './config';
import { userState } from '../store/user-state';

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
