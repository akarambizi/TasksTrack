import { useContext } from 'react';
import { AuthContext, AuthContextType } from './userAuth';

// Hook for using auth context
export const useAuth = (): AuthContextType => useContext(AuthContext);
