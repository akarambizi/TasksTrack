import { validateToken } from '@/api';
import { Login } from '@/components';
import { useCookies } from "react-cookie";
import { createContext, useContext, useEffect, useState } from 'react';

// Create an AuthContext to manage authentication state
interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void; // Updated to accept a token parameter
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
    const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

    useEffect(() => {
        const token = cookies.authToken;
        if (token) {
            validateToken(token)
                .then(() => setIsAuthenticated(true))
                .catch(() => setIsAuthenticated(false));
        }
    }, [cookies.authToken]);

    const login = (token: string) => {
        setCookie("authToken", token, {
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 3600 // 1 hour
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeCookie("authToken", { path: "/" });
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
