import { User } from './users.type';
import { Chat } from './chat.type';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<User, 'password'>;
  token: string;
  chats?: Chat[];
  message?: string;
}
