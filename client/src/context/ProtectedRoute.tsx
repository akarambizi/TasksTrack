import { Login } from '@/components';
import { Loading } from '@/components/ui/loading';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};
