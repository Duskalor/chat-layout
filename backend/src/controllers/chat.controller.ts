import { parse } from 'valibot';
import { prisma } from '../config/prisma.js';
import { getUserChats } from '../services/chat.service.js';
import { messageSchema } from '../middleware/validate.js';
import { Chat, Message } from '../types/index.js';

// Field normalization helper: frontend sends camelCase variants
const normalizeMessageFields = (msg: Record<string, unknown>): Record<string, unknown> => {
  return {
    ...msg,
    chatId: msg.chatId ?? msg.chatID,
    senderId: msg.senderId ?? msg.userID,
    createdAt: msg.createdAt ?? msg.createAt,
  };
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  return getUserChats(userId);
};

export const sendMessage = async (
  message: unknown,
  emitFn: (event: string, data: unknown) => void
): Promise<Message | { error: string }> => {
  try {
    // Field normalization: chatID → chatId, userID → senderId, createAt → createdAt
    const normalizedMessage = normalizeMessageFields(message as Record<string, unknown>);
    const validatedMessage = parse(messageSchema, normalizedMessage) as Message;
    
    const createdMessage = await prisma.message.create({
      data: {
        text: validatedMessage.text,
        chatId: validatedMessage.chatId,
        senderId: validatedMessage.senderId,
      },
    });

    const messageWithTimestamp: Message = {
      id: createdMessage.id,
      text: createdMessage.text,
      chatId: createdMessage.chatId,
      senderId: createdMessage.senderId,
      createdAt: createdMessage.createdAt.toISOString(),
    };
    
    emitFn('new_message', messageWithTimestamp);
    return messageWithTimestamp;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid message payload';
    return { error: errorMessage };
  }
};
