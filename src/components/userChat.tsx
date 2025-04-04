import { Message } from '../assets/types/messages.type';

export const UserChat = ({ msg }: { msg: Message }) => {
  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-1'>
        <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm'>
          {msg?.name[0]?.toLocaleUpperCase()}
        </div>
      </div>
      <div className='col-span-8'>
        <div className='bg-gray-100 p-3 rounded-lg rounded-tl-none'>
          <p>{msg?.message}</p>
        </div>
        <span className='text-xs text-gray-500 mt-1'>
          {new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Para formato 24 horas
          }).format(new Date())}
        </span>
      </div>
      <div className='col-span-3'></div>
    </div>
  );
};
