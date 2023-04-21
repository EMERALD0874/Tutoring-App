import { QueryResult } from 'pg';
import { getConnection, makeUuid, UUID } from '../common';
import { TutorDetails, TutorSubjectRelation } from './tutor';
import * as _ from 'lodash';

export const getTutor = async (id: UUID): Promise<TutorDetails | undefined> => {
    const sql = `
        SELECT 
            tutor_subjects.tutor_id,
            tutors_subjects.subject_id
        FROM 
            tutors 
        LEFT JOIN
            tutors_subjects
        ON tutor.id = tutors_subjects.tutor_id
        WHERE
            tutor.id = $1;
    `;

    const result: QueryResult<TutorSubjectRelation> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [id]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    const subjects: UUID[] = []

    result.rows.forEach((row) => {subjects.push(row.subject_id)})

    return {
        id: id,
        subjects: subjects
    }
}

export const insertTutor = async (id: UUID): Promise<string | undefined> => {
    const sql = `
        INSERT INTO tutors
            (id)
        VALUES 
            ($1)
        RETURNING
            id
    `;

    const result: QueryResult<{id: string}> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [id]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id
};

export const deleteTutor = async (id: UUID): Promise<string | undefined> => {
    const sql = `
        DELETE FROM tutors
            (id)
        WHERE 
            id = $1
        RETURNING
            id;
    `;

    const result: QueryResult<{id: string}> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [id]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id
};

export const insertSubject = async (tutorId: UUID, subjectId: UUID): Promise<TutorSubjectRelation | undefined> => {
    const sql = `
        INSERT INTO tutors_subjects
            (tutor_id, subject_id)
        VALUES 
            ($1, $2)
        RETURNING
            subject_id
    `;

    const result: QueryResult<TutorSubjectRelation> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [tutorId, subjectId]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteSubject = async (tutorId: UUID, subjectId: UUID): Promise<TutorSubjectRelation | undefined> => {
    const sql = `
        DELETE FROM
            tutors_subjects
        WHERE
            tutor_id=$1,
            subject_id=$2
        RETURNING 
            tutor_id,
            subject_id
        ;
    `;

    const result: QueryResult<TutorSubjectRelation> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [tutorId, subjectId]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteAllSubjectsForTutor = async (id: UUID): Promise<string | undefined> =>  {
    const sql = `
        DELETE FROM
            tutors_subjects
        WHERE
            tutor_id=$1,
        RETURNING 
            tutor_id
        ;
    `;

    const result: QueryResult<TutorSubjectRelation> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [id]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].tutor_id;
}