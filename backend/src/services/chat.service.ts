import { Chat, Message, User } from '../types/index.js';

const mockMessages: Message[] = [
  {
    id: 'm1',
    chatId: 'c1',
    senderId: '2',
    text: 'Hello there!',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    chatId: 'c1',
    senderId: '1',
    text: 'Hi! How are you?',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm3',
    chatId: 'c2',
    senderId: '3',
    text: 'Hey team!',
    createdAt: new Date().toISOString(),
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'hashed',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

const mockChats: Chat[] = [
  {
    id: 'c1',
    name: 'John & Jane',
    isGroup: false,
    participants: [mockUsers[0], mockUsers[1]],
    messages: [mockMessages[0], mockMessages[1]],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastMessage: {
      createdAt: mockMessages[1].createdAt,
      senderId: mockMessages[1].senderId,
      text: mockMessages[1].text,
    },
  },
  {
    id: 'c2',
    name: 'Team Chat',
    isGroup: true,
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    messages: [mockMessages[2]],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    lastMessage: {
      createdAt: mockMessages[2].createdAt,
      senderId: mockMessages[2].senderId,
      text: mockMessages[2].text,
    },
  },
];

export const getUserChats = (userId: string): Chat[] => {
  return mockChats.filter((chat) =>
    chat.participants.some((p) => p.id === userId)
  );
};

export const generateMockChats = (userId: string): Chat[] => {
  return getUserChats(userId);
};

export const getChatById = (chatId: string): Chat | undefined => {
  return mockChats.find((chat) => chat.id === chatId);
};

export const getChatMessages = (chatId: string): Message[] => {
  const chat = mockChats.find((c) => c.id === chatId);
  return chat?.messages || [];
};
