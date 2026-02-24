import { NavLink, useNavigate } from 'react-router-dom';
import { Chat } from '../assets/types/chat.type';
import { useMessages } from '../hook/use-messages';
import { userState } from '../store/user-state';
import { useState } from 'react';

export const Sidebar = () => {
  const { chats } = useMessages();
  const [filtered, setFiltered] = useState('');
  const user = userState().user;
  const logout = userState((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/users');
  };

  const filteredChats =
    filtered !== ''
      ? chats.filter((chat) =>
          chat.name.toLowerCase().includes(filtered.trim().toLowerCase())
        )
      : chats;

  return (
    <section className='xl:px-3 py-4 border-r border-border h-full'>
      <div className='border-b border-borderGray pb-5 pr-5'>
        <div className='flex justify-between items-center h-[80px]'>
          <div className='  p-2 font-bold text-2xl'>Chats</div>
          <h1>{user?.name}</h1>
        </div>
        <input
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
          type='text'
          className='w-full bg-surface-alt rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
        />
      </div>
      <ul className='flex flex-col '>
        {filteredChats.map((msg) => {
          return <ChatUser key={msg.id} chat={msg} />;
        })}
      </ul>
      <footer>
        <button onClick={handleLogout}>Cerrar</button>
      </footer>
    </section>
  );
};

const ChatUser = ({ chat }: { chat: Chat }) => {
  return (
    <NavLink
      to={chat.id}
      className={({ isActive }) => {
        return `h-[100px] flex hover:bg-surface-alt transition-colors  items-center gap-3 border-b-borderGray border-b cursor-pointer pr-10 pl-2 ${
          isActive ? 'bg-primary-light' : ''
        }`;
      }}
    >
      <span className='w-14 h-14 min-w-[56px] bg-primary text-text-inverse rounded-full flex justify-center items-center text-lg'>
        {chat?.name[0].toUpperCase()}
      </span>
      <div>
        <p>{chat.name}</p>
        <p className='line-clamp-1'>{chat.lastMessage.text}</p>
      </div>
    </NavLink>
  );
};
