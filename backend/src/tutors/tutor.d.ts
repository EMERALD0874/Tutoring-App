import { uuid, Uuid } from 'uuid';
import { UUID } from '../common';

export interface TutorDetails {
    id: UUID;
    subjects: UUID[];
    times: TutorTime[];
}

export interface NewTutor {
    tutorId: UUID;
    subjects: UUID[];
    times: NewTutorTime[];
}

export interface TutorTime {
    tutorId: UUID;
    timeId: UUID;
    datetime: Date; //Extract Date YYYY-MM-DD and Time HH:MM XX
    durationHours: Number;
}

export interface NewTutorTime {
    datetime: Date; //Extract Date YYYY-MM-DD and Time HH:MM XX
    durationHours: Number;
}

export interface UpdateTutor {
    times: [NewTutorTime];
    subjects: [string];
}

export interface TutorPOSTQuery {
    when: string;
}

export interface TutorPOSTResponse {
    id: string;
}

export interface TutorDELETEQuery {
    id: string;
}

export interface TutorSubjectRelation {
    tutor_id: string;
    subject_id: string;
}

export interface UpdateTutorTime {
    datetime?: Date; //Extract Date YYYY-MM-DD and Time HH:MM XX
    durationHours?: Number;
}
