import { createContext } from 'react';

// Export for use in the useAuth hook
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

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);