import { useState, useEffect } from 'react';
import { AuthService, UserData } from '@/services/authService';
import { ToastService } from '@/services/toastService';
import { AuthContextType } from '@/context/userAuth';

/**
 * Custom hook that handles all authentication logic and state management
 */
export const useAuthLogic = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Login function - stores token and user data
   */
  const login = (newToken: string, userEmail?: string) => {
    AuthService.setToken(newToken, userEmail);

    setToken(newToken);
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

    setToken(null);
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

      try {
        const isValid = await AuthService.validateStoredToken();

        if (isValid) {
          setIsAuthenticated(true);
          setToken(storedToken);

          const userData = AuthService.getUserData();
          if (userData) {
            setUser(userData);
          }
        } else {
          // Token invalid, clear storage
          logout();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
        ToastService.error('Session expired. Please log in again.');
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    token,
    login,
    logout,
    user,
    isLoading
  };
};
