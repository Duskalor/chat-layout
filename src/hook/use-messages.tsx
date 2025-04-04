import { useEffect, useState } from 'react';
import { socket } from '../lib/socket-client';
import { type Message } from '../assets/types/messages.type';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsloading] = useState(true);
  useEffect(() => {
    // socket.on('connect', () => {
    //   console.log('connected');
    // });

    socket.on('messages', (data) => {
      setMessages(data);
      setIsloading(false);
    });
    socket.on('new_message', (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const handleSend = (message: Message) => {
    socket.emit('sendMessage', message);
  };

  return { handleSend, messages, isloading };
};
