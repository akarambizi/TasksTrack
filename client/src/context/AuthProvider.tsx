import { Loading } from '@/components/ui/loading';
import { AuthContext } from './AuthContext';
import { useAuthLogic } from '@/hooks/useAuthLogic';

/**
 * Clean auth provider component that only handles context provision
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authValue = useAuthLogic();

  return (
    <AuthContext.Provider value={authValue}>
      {authValue.isLoading ? <Loading fullScreen text="Loading application..." /> : children}
    </AuthContext.Provider>
  );
};
