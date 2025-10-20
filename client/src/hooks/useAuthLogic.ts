import { useState, useEffect } from 'react';
import { AuthService, UserData } from '@/services/authService';
import { AuthContextType } from '@/context/AuthContext';

/**
 * Custom hook that handles all authentication logic and state management
 */
export const useAuthLogic = (): AuthContextType => {
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

  return {
    isAuthenticated,
    login,
    logout,
    user,
    isLoading
  };
};
