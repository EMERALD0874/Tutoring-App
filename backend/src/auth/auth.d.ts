export interface LoginRequest {
    username: string;
    password: string;
}

export interface Token {
    token: string;
    user_id: string;
    expires: Date;
}

export interface TokenInfo {
    user_id: string;
    expires: Date;
}

export interface TokenResponse {
    token: string;
    userId: string;
}

export interface RegisterUser {
    first_name: string;
    last_name: string;
    email: string;
    birthdate: Date;
    username: string;
    password: string;
}
