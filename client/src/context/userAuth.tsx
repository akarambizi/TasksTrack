import { validateToken } from '@/api';
import { Login } from '@/components';
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

// Create an AuthContext to manage authentication state
interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            validateToken(token)
                .then(() => setIsAuthenticated(true))
                .catch(() => setIsAuthenticated(false));
        }
    }, []);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        Cookies.remove('authToken'); // Remove the cookie on logout
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Login></Login>;
    }

    return <>{children}</>;
};
