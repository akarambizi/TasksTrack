export interface IAuthData {
    email: string;
    password?: string;
    username?: string;
    token?: string;
    newPassword?: string;
}

export interface IAuthResult {
    success: boolean;
    message?: string;
    token?: string;
    userId?: string;
    userEmail?: string;
}