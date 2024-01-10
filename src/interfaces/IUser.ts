export interface IUser{
    name: string;
    phone: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'WELFARE' | 'USER';
    user_id: string;
    isVerified: boolean;
}