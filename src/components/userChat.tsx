import { Messages } from '../assets/types/messages.type';

export const UserChat = ({ msg }: { msg: Messages }) => {
  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-3'></div>
      <div className='col-span-9 justify-self-end'>
        <div className='bg-blue-500 text-white p-3 rounded-lg rounded-tr-none'>
          <p>{msg.text}</p>
        </div>
        <span className='text-xs text-gray-500 mt-1 block text-right'>
          {new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date())}
        </span>
      </div>
    </div>
  );
};
