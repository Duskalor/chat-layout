export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    createdAt: string;
    senderId: string;
    text: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: Omit<User, 'password'>;
  token: string;
  chats: Chat[];
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
