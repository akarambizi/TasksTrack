import { Loading } from '@/components/ui/loading';
import { AuthContext, AuthContextType } from './AuthContext';
import { useState, useEffect } from 'react';
import { AuthService, UserData } from '@/services/authService';

/**
 * Clean auth provider component that handles context provision and authentication logic
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Login function - stores token and user data
   */
  const login = (newToken: string, userEmail?: string) => {
    AuthService.setToken(newToken, userEmail);
    setIsAuthenticated(true);

    if (userEmail) {
      setUser({ email: userEmail });
    }
  };

  /**
   * Logout function - clears all auth data
   */
  const logout = () => {
    AuthService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Check authentication status on app load
   */
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      const storedToken = AuthService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Trust stored token - server validates on each API call
      setIsAuthenticated(true);
      const userData = AuthService.getUserData();
      if (userData) {
        setUser(userData);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const authValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user,
    isLoading
  };

  return (
    <AuthContext.Provider value={authValue}>
      {isLoading ? <Loading fullScreen text="Loading application..." /> : children}
    </AuthContext.Provider>
  );
};
