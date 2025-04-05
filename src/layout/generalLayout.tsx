import { Outlet, useNavigate } from 'react-router-dom';
import { userState } from '../store/user-state';
import { useEffect } from 'react';
import { Sidebar } from '../components/sidebar';

export const GeneralLayout = () => {
  const navigate = useNavigate();
  const user = userState().user;
  useEffect(() => {
    if (!user) {
      navigate('/users');
    }
  }, [user, navigate]);

  if (!user) return null;
  return (
    <main className='bg-[#F3F3F1]'>
      <section className='container mx-auto h-screen  p-5'>
        <div className='flex h-full rounded-2xl shadow-2xl p-5 bg-white'>
          <div className='w-[400px]  xl:w-[500px] '>
            <Sidebar />
          </div>
          <div className='flex-1'>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
