import { createContext } from 'react';

export interface UserData {
  email?: string;
}

// Export for use in the useAuthContext hook
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (token: string, userEmail?: string) => void;
  logout: () => void;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);