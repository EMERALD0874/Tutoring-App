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
    //password?: string // This should be change only with auth routes
}
