import { create } from 'zustand';
import { Message } from '../assets/types/messages.type';

type fn = (message: Message) => void;

interface UserState {
  name: string;
  sendMessage: null | fn;
  setName: (name: string) => void;
  setSendMessage: (fn: fn) => void;
}

export const userState = create<UserState>((set) => ({
  name: 'Ana',
  sendMessage: null,
  setName: (name: string) => set({ name }),
  setSendMessage: (fn: fn) => set(() => ({ sendMessage: fn })),
}));
