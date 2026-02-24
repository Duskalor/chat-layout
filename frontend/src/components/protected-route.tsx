import { Navigate, useLocation } from 'react-router-dom';
import { userState } from '../store/user-state';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ children, fallbackPath = '/login' }: ProtectedRouteProps) => {
  const isAuthenticated = userState((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
