export type LoginResponse = {
    token: string;
    userId: number;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    name: string;
    password: string;
    keyword: string;
    language: string;
};