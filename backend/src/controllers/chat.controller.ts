import { parse } from 'valibot';
import { getUserChats } from '../services/chat.service.js';
import { messageSchema } from '../middleware/validate.js';
import { Chat, Message } from '../types/index.js';

export const getChats = (userId: string): Chat[] => {
  return getUserChats(userId);
};

export const sendMessage = (
  message: unknown,
  emitFn: (event: string, data: unknown) => void
): Message | { error: string } => {
  try {
    const validatedMessage = parse(messageSchema, message) as Message;
    const messageWithTimestamp: Message = {
      ...validatedMessage,
      createdAt: new Date().toISOString(),
    };
    emitFn('new_message', messageWithTimestamp);
    return messageWithTimestamp;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid message payload';
    return { error: errorMessage };
  }
};
