import { createBrowserRouter } from 'react-router-dom';
import { GeneralLayout } from '../layout/generalLayout';
import { Chat } from '../components/chat';
import { SelectUser } from '../components/select-user';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: GeneralLayout,
    children: [
      {
        path: '/:chatID',
        Component: Chat,
      },
      {
        path: '/',
        element: <div>Aqui</div>,
      },
    ],
  },
  {
    path: '/users',
    Component: SelectUser,
  },
]);
