import { create } from 'zustand';
import { Messages } from '../assets/types/messages.type';
import { User } from '../assets/types/users.type';
import { Chat } from '../assets/types/chat.type';
import { socket } from '../lib/socket-client';

type fn = (message: Messages) => void;

interface UserState {
  user: null | User;
  sendMessage: null | fn;
  setUser: (user: User) => void;
  setChats: (Chats: Chat[]) => void;
  chats: Chat[];
  handleSend: (user: Messages) => void;
}

export const userState = create<UserState>((set) => ({
  user: null,
  sendMessage: null,
  chats: [],
  setUser: (user: User) => set({ user }),
  setChats: (chats: Chat[]) => set({ chats }),
  handleSend: (message: Messages) => {
    socket.emit('sendMessage', message);
  },
}));
