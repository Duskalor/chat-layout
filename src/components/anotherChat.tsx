import { Message } from '../assets/types/messages.type';

export const AnotherChat = ({ msg }: { msg: Message }) => {
  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-3'></div>
      <div className='col-span-8 justify-self-end'>
        <div className='bg-blue-500 text-white p-3 rounded-lg rounded-tr-none'>
          <p>{msg.message}</p>
        </div>
        <span className='text-xs text-gray-500 mt-1 block text-right'>
          {new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date())}
        </span>
      </div>
      <div className='col-span-1 flex justify-end'>
        <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm'>
          {msg.name[0].toLocaleUpperCase()}
        </div>
      </div>
    </div>
  );
};
