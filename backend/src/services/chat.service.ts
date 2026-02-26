import { prisma } from '../config/prisma.js';
import { Chat, Message, User } from '../types/index.js';

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: { id: userId },
      },
    },
    include: {
      participants: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return chats.map((chat) => ({
    id: chat.id,
    name: chat.name,
    isGroup: chat.isGroup,
    participants: chat.participants,
    messages: chat.messages.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      senderId: m.senderId,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    })),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    lastMessage: chat.messages.length > 0 ? {
      text: chat.messages[chat.messages.length - 1].text,
      senderId: chat.messages[chat.messages.length - 1].senderId,
      createdAt: chat.messages[chat.messages.length - 1].createdAt.toISOString(),
    } : undefined,
  }));
};

export const generateMockChats = async (userId: string): Promise<Chat[]> => {
  return getUserChats(userId);
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      participants: true,
      messages: true,
    },
  });

  if (!chat) return null;

  return {
    id: chat.id,
    name: chat.name,
    isGroup: chat.isGroup,
    participants: chat.participants,
    messages: chat.messages.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      senderId: m.senderId,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    })),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  });

  return messages.map((m) => ({
    id: m.id,
    chatId: m.chatId,
    senderId: m.senderId,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
  }));
};

export const createMessage = async (
  text: string,
  chatId: string,
  senderId: string
): Promise<Message> => {
  const createdMessage = await prisma.message.create({
    data: {
      text,
      chatId,
      senderId,
    },
  });

  await prisma.lastMessage.upsert({
    where: { chatId },
    create: {
      text,
      senderId,
      createdAt: createdMessage.createdAt.toISOString(),
      chatId,
    },
    update: {
      text,
      senderId,
      createdAt: createdMessage.createdAt.toISOString(),
    },
  });

  return {
    id: createdMessage.id,
    chatId: createdMessage.chatId,
    senderId: createdMessage.senderId,
    text: createdMessage.text,
    createdAt: createdMessage.createdAt.toISOString(),
  };
};
