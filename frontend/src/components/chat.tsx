import { useEffect, useMemo, useRef } from 'react';
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
    if (objDiv) {
      objDiv!.scrollTop = objDiv!.scrollHeight;
    }
  }, [chat]);

  const newChat = useMemo(() => {
    const userColorMap = new Map();

    chat?.participants.forEach((participant, index) => {
      const colorIndex = index % colors.length;
      userColorMap.set(participant.id, colors[colorIndex]);
    });

    const colorMessages = chat?.messages.map((msg) => {
      return {
        ...msg,
        color: userColorMap.get(msg.userID) || colors[0],
      };
    });

    return { ...chat, messages: colorMessages };
  }, [chat]);
  if (!chat) return null;

  return (
    <div className='h-full'>
      <section className='bg-gray-100 h-full  flex flex-col'>
        <div className='container mx-auto p-4 flex flex-col h-full max-w-4xl'>
          <div className='bg-surface rounded-t-lg shadow-sm p-4 flex items-center'>
            <div className='w-10 h-10 rounded-full bg-primary text-text-inverse flex items-center justify-center font-semibold'>
              A
            </div>
            <div className='ml-3'>
              <h2 className='font-semibold text-text-primary'>{chat?.name}</h2>
              <p className='text-sm text-text-secondary'>En línea</p>
            </div>
          </div>

          <div
            id='messages'
            ref={divElement}
            className='flex-1 bg-surface-alt overflow-y-auto p-4'
          >
            {newChat.messages &&
              newChat?.messages.map((messages, i) => {
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
