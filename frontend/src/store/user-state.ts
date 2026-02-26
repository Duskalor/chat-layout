import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Messages } from '../assets/types/messages.type';
import { User } from '../assets/types/users.type';
import { Chat } from '../assets/types/chat.type';
import { LoginCredentials } from '../assets/types/auth.type';
import { Todo } from '../assets/types/todo.type';
import { DashboardStats } from '../assets/types/dashboard.type';
import { socket } from '../lib/socket-client';
import { login as loginApi } from '../lib/auth-api';
import { getTodos, createTodo as createTodoApi, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi } from '../lib/todo-api';

type fn = (message: Messages) => void;

interface UserState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  token: string | null;
  sendMessage: null | fn;
  setUser: (user: Omit<User, 'password'>) => void;
  setChats: (Chats: Chat[]) => void;
  chats: Chat[];
  todos: Todo[];
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  dashboardStats: DashboardStats | null;
  setDashboardStats: (stats: DashboardStats) => void;
  handleSend: (user: Messages) => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const userState = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      sendMessage: null,
      chats: [],
      todos: [],
      onlineUsers: [],
      dashboardStats: null,
      setUser: (user: Omit<User, 'password'>) => set({ user }),
      setChats: (chats: Chat[]) => set({ chats }),
      setOnlineUsers: (onlineUsers: string[]) => set({ onlineUsers }),
      setDashboardStats: (dashboardStats: DashboardStats) => set({ dashboardStats }),
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
            get().fetchTodos();
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
          todos: [],
          onlineUsers: [],
          dashboardStats: null,
        });
        socket.disconnect();
      },
      fetchTodos: async () => {
        try {
          const todos = await getTodos();
          set({ todos });
        } catch (error) {
          console.error('Failed to fetch todos:', error);
        }
      },
      addTodo: async (title: string) => {
        try {
          const newTodo = await createTodoApi(title);
          set((state) => ({ todos: [newTodo, ...state.todos] }));
        } catch (error) {
          console.error('Failed to add todo:', error);
        }
      },
      toggleTodo: async (id: string) => {
        const currentTodo = get().todos.find((t) => t.id === id);
        if (!currentTodo) return;

        try {
          const updatedTodo = await updateTodoApi(id, {
            completed: !currentTodo.completed,
          });
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? updatedTodo : t
            ),
          }));
        } catch (error) {
          console.error('Failed to toggle todo:', error);
        }
      },
      deleteTodo: async (id: string) => {
        try {
          await deleteTodoApi(id);
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete todo:', error);
        }
      },
    }),
    { name: 'user' }
  )
);
