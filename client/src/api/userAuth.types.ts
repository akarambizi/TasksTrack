export interface IUserData {
    email: string;
    username: string;
    password?: string;
}

export interface IPasswordResetData {
    email: string;
    password: string;
    token: string;
}
