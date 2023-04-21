import {uuid, Uuid} from 'uuid';
import { UUID } from '../common';

export interface TutorDetails {
    id: UUID,
    subjects: UUID[]?
}

export interface UpdateTutor {
    subjects: [string],
}

export interface TutorPOSTQuery {
    when: string,
}

export interface TutorPOSTResponse {
    id: string,
}

export interface TutorDELETEQuery {
    id: string,
}

export interface TutorSubjectRelation {
    tutor_id: string,
    subject_id: string,
}