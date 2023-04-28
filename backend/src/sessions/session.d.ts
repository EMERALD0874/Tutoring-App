export interface Session {
    id: string;
    student_id: string;
    tutor_id: string;
    appointment: string;
}

export interface CreateSession {
    id: string;
    student_id: string;
    tutor_id: string;
    appointment: string;
}

export interface UpdateSession {
    id?: string;
    student_id?: string;
    tutor_id?: string;
    appointment?: string;
}
