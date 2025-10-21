import authData from './auth.ts';
import { IAuthData, IAuthResult } from '../../../api/userAuth.types.ts';

// Response objects for each auth endpoint
const loginSuccessResponse = (user: IAuthData): IAuthResult & { token: string } => ({ success: true, token: `mock-token-${user.email}`, message: 'Login successful' });
const loginFailureResponse: IAuthResult = { success: false, message: 'Invalid credentials' };

const registerSuccessResponse: IAuthResult = { success: true, message: 'Registration successful' };
const registerFailureResponse: IAuthResult = { success: false, message: 'User already exists' };

const resetPasswordSuccessResponse: IAuthResult = { success: true, message: 'Password reset successful' };
const resetPasswordFailureResponse: IAuthResult = { success: false, message: 'User not found' };

const logoutResponse: IAuthResult = { success: true, message: 'Logout successful' };

function getUsers(): IAuthData[] {
    return authData.auth;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function authMiddleware(req: any, res: any, next: any) {
    if (req.method === 'POST' && req.path === '/auth/login') {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find((u: IAuthData) => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).jsonp(loginFailureResponse);
        }
        return res.jsonp(loginSuccessResponse(user));
    }

    if (req.method === 'POST' && req.path === '/auth/register') {
        const { email } = req.body;
        const users = getUsers();
        if (users.find((u: IAuthData) => u.email === email)) {
            return res.status(400).jsonp(registerFailureResponse);
        }
        return res.jsonp(registerSuccessResponse);
    }

    if (req.method === 'POST' && req.path === '/auth/reset-password') {
        const { email } = req.body;
        const users = getUsers();
        const user = users.find((u: IAuthData) => u.email === email);
        if (!user) {
            return res.status(404).jsonp(resetPasswordFailureResponse);
        }
        return res.jsonp(resetPasswordSuccessResponse);
    }

    if (req.method === 'POST' && req.path === '/auth/logout') {
        return res.jsonp(logoutResponse);
    }

    next();
}
