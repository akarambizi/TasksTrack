export interface IUserData {
    email: string;
    password?: string;
}

export interface IPasswordResetData {
    newPassword: string;
    token: string;
}
