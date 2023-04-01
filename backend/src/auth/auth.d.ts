export interface LoginRequest {
    username: string;
    password: string;
}

export interface Token {
    id: string;
    token: string;
    userId: string;
    expires: Date;
}

export interface TokenResponse{
    token: string;
    userId: string;
}

export interface RegisterUser {
    first_name: string;
    last_name: string;
    about: string;
    email: string;
    birthdate: Date;
    username: string;
    password: string;
}