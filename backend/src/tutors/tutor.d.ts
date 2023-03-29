import {uuid, Uuid} from 'uuid';
export interface TutorPATCHQuery {
    ttid: string,
    when: Date?,
}

export interface TutorPOSTQuery {
    when: Date,
}

export interface TutorPOSTResponse {
    id: string,
}

export interface TutorDELETEQuery {
    id: string,
}