import { parse } from 'valibot';
import { userState } from '../store/user-state';
import { messageSchema } from '../assets/types/messages.type';

export const Input = ({ chatID }: { chatID: string }) => {
  const handleSend = userState((state) => state.handleSend);
  const user = userState().user;
  if (!user) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const finalData = parse(messageSchema, {
      text: data.message,
      userID: user.id,
      chatID,
    });
    handleSend(finalData);
    event.currentTarget.reset();
  };

  return (
    <div className='bg-white rounded-b-lg shadow p-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center'>
          <input
            autoComplete='off'
            type='text'
            name='message'
            className='flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
            placeholder='Escribe un mensaje...'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
