import { validateToken } from '@/api/userAuth';
import { createContext, useEffect, useState } from 'react';
import { ToastService } from '@/services/toastService';
import { Loading } from '@/components/ui/loading';

// Auth context type definition
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, userEmail?: string) => void;
  logout: () => void;
  user: { email?: string } | null;
  isLoading: boolean;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
  user: null,
  isLoading: true
};

// Create and export the context
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define login function
  const login = (newToken: string, userEmail?: string) => {
    // Store auth data in localStorage
    localStorage.setItem('authToken', newToken);
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
      setUser({ email: userEmail });
    }

    setToken(newToken);
    setIsAuthenticated(true);
  };

  // Define logout function
  const logout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try {
          // Validate the stored token
          const result = await validateToken(storedToken);

          if (result.success) {
            setIsAuthenticated(true);
            setToken(storedToken);

            // Extract user info from token if available
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
              setUser({ email: userEmail });
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
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Create the context value object
  const contextValue: AuthContextType = {
    isAuthenticated,
    token,
    login,
    logout,
    user,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? <Loading fullScreen text="Loading application..." /> : children}
    </AuthContext.Provider>
  );
};
