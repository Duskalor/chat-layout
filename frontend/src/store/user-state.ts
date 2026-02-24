import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Messages } from '../assets/types/messages.type';
import { User } from '../assets/types/users.type';
import { Chat } from '../assets/types/chat.type';
import { LoginCredentials } from '../assets/types/auth.type';
import { socket } from '../lib/socket-client';
import { login as loginApi } from '../lib/auth-api';

type fn = (message: Messages) => void;

interface UserState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  token: string | null;
  sendMessage: null | fn;
  setUser: (user: Omit<User, 'password'>) => void;
  setChats: (Chats: Chat[]) => void;
  chats: Chat[];
  handleSend: (user: Messages) => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

export const userState = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      sendMessage: null,
      chats: [],
      setUser: (user: Omit<User, 'password'>) => set({ user }),
      setChats: (chats: Chat[]) => set({ chats }),
      handleSend: (message: Messages) => {
        socket.emit('sendMessage', message);
      },
      login: async (credentials: LoginCredentials) => {
        try {
          const response = await loginApi(credentials);
          if (response.success) {
            set({
              user: response.user,
              isAuthenticated: true,
              token: response.token,
              chats: response.chats || [],
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          chats: [],
        });
        socket.disconnect();
      },
    }),
    { name: 'user' }
  )
);
