import { Messages } from '../assets/types/messages.type';

export const UserChat = ({ msg }: { msg: Messages }) => {
  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-3'></div>
      <div className='col-span-9 justify-self-end'>
        <div className='bg-primary text-text-inverse px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm'>
          <p>{msg.text}</p>
        </div>
        <span className='text-xs text-text-secondary mt-1.5 block text-right'>
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
