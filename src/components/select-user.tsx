import { userState } from '../store/user-state';

export const SelectUser = ({ users }: { users: string[] }) => {
  const name = userState().name;
  const setName = userState().setName;
  const handleName = (name: string) => {
    setName(name);
  };
  return (
    <div className='grid  grid-cols-3 mx-auto w-full gap-5'>
      {users.map((user, i) => {
        return (
          <div
            key={i}
            onClick={() => handleName(user)}
            className={`p-5 rounded ${
              name === user ? 'bg-red-800' : 'bg-red-500'
            }  text-white cursor-pointer text-center`}
          >
            {user}
          </div>
        );
      })}
    </div>
  );
};
