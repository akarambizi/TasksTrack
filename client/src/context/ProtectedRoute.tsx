import { Login } from '@/components';
import { Loading } from '@/components/ui/loading';
import { useAuthContext } from './useAuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};
