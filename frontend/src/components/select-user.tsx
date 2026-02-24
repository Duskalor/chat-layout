import { useEffect, useState } from 'react';
import { userState } from '../store/user-state';
import { config } from '../lib/config';
import { User } from '../assets/types/users.type';
import { useNavigate } from 'react-router-dom';

export const SelectUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const US = userState().user;
  const setUser = userState().setUser;

  const handleName = (user: User) => {
    setUser(user);
    navigate('/');
  };

  useEffect(() => {
    fetch(`${config.URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  return (
    <div className='grid  grid-cols-2 mx-auto w-full gap-5 p-5 h-screen'>
      {users.map((user) => {
        const { name, id } = user;
        return (
          <div
            key={id}
            onClick={() => handleName(user)}
            className={`p-5 rounded ${
              US?.name === name ? 'bg-red-800' : 'bg-red-600 hover:bg-red-500'
            }  text-white cursor-pointer text-center text-3xl flex justify-center items-center`}
          >
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
};
