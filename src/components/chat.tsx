import { useEffect, useRef } from 'react';
import { Message } from '../assets/types/messages.type';
import { userState } from '../store/user-state';
import { AnotherChat } from './anotherChat';
import { Input } from './Input';
import { UserChat } from './userChat';

type ChatProps = {
  messages: Message[];
  // onSend: (text: string) => void;
};

export const Chat = ({ messages }: ChatProps) => {
  const name = userState().name;
  const divElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const objDiv = divElement.current;
    objDiv!.scrollTop = objDiv!.scrollHeight;
  }, [messages]);
  return (
    <div>
      <section className='bg-gray-100 h-screen flex flex-col'>
        <div className='container mx-auto p-4 flex flex-col h-full max-w-4xl'>
          <div className='bg-white rounded-t-lg shadow p-4 flex items-center'>
            <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
              A
            </div>
            <div className='ml-3'>
              <h2 className='font-bold'>Grupo Chat</h2>
              <p className='text-sm text-gray-500'>En línea</p>
            </div>
          </div>

          <div
            id='messages'
            ref={divElement}
            className='flex-1 bg-white overflow-y-auto p-4 space-y-4'
          >
            {messages.map((msg, i) =>
              msg.name !== name ? (
                <UserChat msg={msg} key={i} />
              ) : (
                <AnotherChat msg={msg} key={i} />
              )
            )}
          </div>

          <Input />
        </div>
      </section>
    </div>
  );
};
