import {uuid, Uuid} from 'uuid';
export interface TutorPATCHQuery {
    ttid: string,
    when: string?,
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