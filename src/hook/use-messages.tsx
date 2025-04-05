import { useEffect, useState } from 'react';
import { socket } from '../lib/socket-client';
import { userState } from '../store/user-state';
import { Messages } from '../assets/types/messages.type';
import { Chat } from '../assets/types/chat.type';

export const useMessages = () => {
  const user = userState((state) => state.user);
  const chats = userState((state) => state.chats);
  const setChats = userState((state) => state.setChats);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    console.log('Inicializando conexión de socket');

    if (user?.id) {
      socket.emit('connected', user.id);
    }

    // Handler para mensajes iniciales
    const handleMessages = (data: Chat[]) => {
      setChats(data);
      setIsloading(false);
    };

    const handleNewMessage = (data: Messages) => {
      const currentChats = userState.getState().chats;

      const chatIndex = currentChats.findIndex((c) => c.id === data.chatID);
      console.log(chatIndex);
      if (chatIndex === -1) {
        console.log(`Chat con ID ${data.chatID} no encontrado`);
        return;
      }

      const chat = currentChats[chatIndex];
      if (!chat || !chat.messages) {
        console.log('El chat o sus mensajes no existen', chat);
        return;
      }

      const newChats = currentChats.with(chatIndex, {
        ...chat,
        messages: [
          ...chat.messages,
          {
            ...data,
            id: crypto.randomUUID(),
            createAt: new Date().toISOString(),
          },
        ],
      });

      // const newChats = [...currentChats];
      // newChats[chatIndex] = {
      //   ...chat,
      //   messages: [
      //     ...chat.messages,
      //     {
      //       ...data,
      //       id: crypto.randomUUID(),
      //       createAt: new Date().toISOString(),
      //     },
      //   ],
      // };

      setChats(newChats);
    };

    socket.on('messages', handleMessages);
    socket.on('new_message', handleNewMessage);

    // Función de limpieza
    return () => {
      socket.off('messages', handleMessages);
      socket.off('new_message', handleNewMessage);
    };
  }, [user?.id]);

  return { chats, isloading };
};
