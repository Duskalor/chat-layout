import { Messages } from '../assets/types/messages.type';
import { User } from '../assets/types/users.type';

type MessagesColor = Messages & {
  color: {
    bg: string;
    text: string;
  };
};

interface Props {
  msg: MessagesColor;
  participants: User[];
  isGroup: boolean;
}

export const AnotherChat = ({ isGroup, msg, participants }: Props) => {
  const anotherUser = participants.find((par) => par.id === msg.userID);
  const { color } = msg;

  return (
    <div className='grid grid-cols-12 gap-2'>
      {isGroup ? (
        <div className='col-span-1'>
          <div
            className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center text-white text-sm`}
          >
            {anotherUser?.name[0].toLocaleUpperCase()}
          </div>
        </div>
      ) : null}
      <div className='col-span-8'>
        <div className='bg-gray-100 p-3 rounded-lg rounded-tl-none'>
          {isGroup ? (
            <p className={`text-xs ${color.text}`}>{anotherUser?.name}</p>
          ) : null}
          <p>{msg.text}</p>
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
