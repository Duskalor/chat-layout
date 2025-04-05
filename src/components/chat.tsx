import { useEffect, useRef } from 'react';
import { userState } from '../store/user-state';
import { AnotherChat } from './anotherChat';
import { Input } from './Input';
import { UserChat } from './userChat';
import { useParams } from 'react-router-dom';

const colors = [
  { bg: 'bg-red-700', text: 'text-red-700' },
  { bg: 'bg-blue-700', text: 'text-blue-700' },
  { bg: 'bg-green-700', text: 'text-green-700' },
  { bg: 'bg-yellow-700', text: 'text-yellow-700' },
  { bg: 'bg-orange-700', text: 'text-orange-700' },
  { bg: 'bg-purple-700', text: 'text-purple-700' },
  { bg: 'bg-black', text: 'text-black' },
  { bg: 'bg-sky-700', text: 'text-sky-700' },
  { bg: 'bg-teal-700', text: 'text-teal-700' },
  { bg: 'bg-amber-700', text: 'text-amber-700' },
  { bg: 'bg-lime-700', text: 'text-lime-700' },
  { bg: 'bg-indigo-700', text: 'text-indigo-700' },
];
export const Chat = () => {
  const { chatID } = useParams();
  const user = userState().user;
  const { chats } = userState();
  const chat = chats.find((c) => c.id === chatID);
  const divElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const objDiv = divElement.current;
    objDiv!.scrollTop = objDiv!.scrollHeight;
  }, [chats]);

  if (!chat) return null;

  const colorMessages = chat.messages.map((c) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];
    return {
      ...c,
      color,
    };
  });
  const newChat = { ...chat, messages: colorMessages };

  return (
    <div className='h-full'>
      <section className='bg-gray-100 h-full  flex flex-col'>
        <div className='container mx-auto p-4 flex flex-col h-full max-w-4xl'>
          <div className='bg-white rounded-t-lg shadow p-4 flex items-center'>
            <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
              A
            </div>
            <div className='ml-3'>
              <h2 className='font-bold'>{chat?.name}</h2>
              <p className='text-sm text-gray-500'>En línea</p>
            </div>
          </div>

          <div
            id='messages'
            ref={divElement}
            className='flex-1 bg-white overflow-y-auto p-4 space-y-4'
          >
            {newChat?.messages.map((messages, i) => {
              return messages.userID === user?.id ? (
                <UserChat msg={messages} key={i} />
              ) : (
                <AnotherChat
                  isGroup={chat.isGroup}
                  msg={messages}
                  key={i}
                  participants={chat.participants}
                />
              );
            })}
          </div>

          <Input chatID={chat.id} />
        </div>
      </section>
    </div>
  );
};
