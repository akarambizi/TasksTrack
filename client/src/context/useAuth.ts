import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';

// Hook for using auth context
export const useAuth = (): AuthContextType => useContext(AuthContext);
