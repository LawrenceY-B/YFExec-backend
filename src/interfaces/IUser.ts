export interface IUser{
    name: string;
    phone: string;
    email: string;
    password: string | null;
    role: 'EXEC' | 'WELFARE' | 'USER';
    user_id: string;
    isVerified: boolean;
    verificationToken: string;
}