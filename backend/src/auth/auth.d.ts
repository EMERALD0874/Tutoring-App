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

export interface TokenResponse {
    token: string;
    userId: string;
}

export interface RegisterUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    birthdate: Date;
    username: string;
    password: string;
}
