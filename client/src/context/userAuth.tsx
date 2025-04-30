import { Login } from '@/components';
import { useValidateToken } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from "react-cookie";

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

    const isLocalhost = window.location.hostname === "localhost";

    const { mutate: validateTokenMutation } = useValidateToken();

    useEffect(() => {
        const token = cookies.authToken;
        if (token) {
            validateTokenMutation(token, {
                onSuccess: () => {
                    setIsAuthenticated(true);
                },
                onError: (error) => {
                    setIsAuthenticated(false);
                }
            });
        }
    }, [cookies.authToken, validateTokenMutation]);

    const login = (token: string) => {
        setCookie("authToken", token, {
            path: "/",
            secure: !isLocalhost, // Use secure cookies only in non-localhost environments
            sameSite: isLocalhost ? "lax" : "strict", // Use lax for localhost
            maxAge: 10800 // 3 hours in seconds
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
