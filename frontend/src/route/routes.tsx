import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GeneralLayout } from '../layout/generalLayout';
import { Chat } from '../components/chat';
import { LoginForm } from '../components/login-form';
import { ProtectedRoute } from '../components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <GeneralLayout />
      </ProtectedRoute>
    ),
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
    element: <Navigate to='/login' replace />,
  },
]);
