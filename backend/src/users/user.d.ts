export interface User {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    about: string;
    email: string;
    birthdate: Date;
}

export interface UpdateUser {
    first_name?: string;
    last_name?: string;
    about?: string;
    email?: string;
    birthdate?: Date;
    username?: string;
}

export interface NewUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    birthdate: Date;
    username: string;
    password_hash: string
}
