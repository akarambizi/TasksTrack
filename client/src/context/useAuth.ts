import { useContext } from 'react';
import { AuthContext, AuthContextType } from './userAuthProvider';

// Hook for using auth context
export const useAuth = (): AuthContextType => useContext(AuthContext);
