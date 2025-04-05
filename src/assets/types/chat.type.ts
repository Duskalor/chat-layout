import { MessagesRequest } from './messages.type';
import { User } from './users.type';

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: User[];
  messages: MessagesRequest[];
  createAt: Date;
  updateAt: Date;
  lastMessage: {
    createdAt: string;
    senderId: string;
    text: string;
  };
}
