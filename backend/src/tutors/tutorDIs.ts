import { QueryResult } from 'pg';
import { getConnection, makeUuid, slots, UUID } from '../common';
import {
    TutorDetails,
    TutorSubjectRelation,
    TutorTime,
    UpdateTutorTime,
} from './tutor';
import * as _ from 'lodash';

export const _getFullTutor = async (id: UUID): Promise<TutorDetails> => {
    if (!(await selectTutor(id))) {
        return {
            id: '',
            subjects: [],
            times: [],
        };
    }

    const subjects = await selectSubjectsByTutor(id);
    const times = await selectTimesByTutor(id);
    return {
        id: id,
        subjects: subjects,
        times: times,
    };
};
export const selectTutors = async (): Promise<UUID[]> => {
    const sql = `
        SELECT 
            id
        FROM 
            tutors;
    `;

    const result: QueryResult<{ id: UUID }> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, []);
        }
    );

    return result.rows.map((row) => {
        return row.id;
    });
};

export const selectTutor = async (id: UUID): Promise<string | undefined> => {
    const sql = `
        SELECT 
            id
        FROM 
            tutors
        WHERE
            id = $1;
    `;

    const result: QueryResult<{ id: UUID }> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [id]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id;
};

export const insertTutor = async (id: UUID): Promise<string | undefined> => {
    const sql = `
        INSERT INTO tutors
            (id)
        VALUES 
            ($1)
        RETURNING
            id
    `;

    const result: QueryResult<{ id: string }> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [id]);
        });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id;
};

export const deleteTutor = async (id: UUID): Promise<string | undefined> => {
    const sql = `
        DELETE FROM
            tutors
        WHERE 
            id = $1
        RETURNING
            id;
    `;

    const result: QueryResult<{ id: string }> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [id]);
        });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id;
};

export const selectSubjectsByTutor = async (tutorId: UUID): Promise<UUID[]> => {
    const sql = `
        SELECT
            subject_id
        FROM 
            tutors_subjects
        WHERE
            tutor_id = $1;
    `;

    const result: QueryResult<{ subject_id: UUID }> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [tutorId]);
        });

    return result.rows.map((row) => {
        return row.subject_id;
    });
};

export const insertTutorSubject = async (
    tutorId: UUID,
    subjectId: UUID
): Promise<TutorSubjectRelation | undefined> => {
    const sql = `
        INSERT INTO tutors_subjects
            (tutor_id, subject_id)
        VALUES 
            ($1, $2)
        RETURNING
            subject_id
    `;

    const result: QueryResult<TutorSubjectRelation> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [tutorId, subjectId]);
        });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteTutorSubject = async (
    tutorId: UUID,
    subjectId: UUID
): Promise<TutorSubjectRelation | undefined> => {
    const sql = `
        DELETE FROM
            tutors_subjects
        WHERE
            tutor_id=$1 AND subject_id=$2
        RETURNING 
            tutor_id,
            subject_id
        ;
    `;

    const result: QueryResult<TutorSubjectRelation> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [tutorId, subjectId]);
        });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteAllSubjectsForTutor = async (id: UUID): Promise<UUID> => {
    const sql = `
        DELETE FROM
            tutors_subjects
        WHERE
            tutor_id=$1
        RETURNING 
            tutor_id
        ;
    `;

    const result: QueryResult<TutorSubjectRelation> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [id]);
        });

    return id;
};

export const selectTimesByTutor = async (
    tutorId: UUID
): Promise<TutorTime[]> => {
    const sql = `
        SELECT
            id as timeId,
            date_time as datetime,
            duration_hours as durationHours
        FROM 
            tutor_times
        WHERE
            tutor_id = $1;
    `;

    const result: QueryResult<TutorTime> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [tutorId]);
        }
    );

    return result.rows;
};

export const selectTutorTime = async (
    timeId: UUID
): Promise<TutorTime | undefined> => {
    const sql = `
        SELECT 
            tutor_id as tutorId,
            id as timeId,
            date_time as datetime,
            duration_hours as durationHours
        FROM 
            tutor_times
        WHERE
            id = $1;
    `;

    const result: QueryResult<TutorTime> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [timeId]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const insertTutorTime = async (
    tutorId: UUID,
    timeId: UUID,
    datetime: Date,
    duration: Number
): Promise<TutorTime | undefined> => {
    const sql = `
        INSERT INTO tutor_times
            (tutor_id, id, date_time, duration_hours)
        VALUES 
            (${slots(4)})
        RETURNING
            id as timeId,
            date_time as datetime,
            duration_hours as durationHours;
    `;

    const result: QueryResult<TutorTime> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [tutorId, timeId, datetime, duration]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteTutorTime = async (
    tutorId: UUID,
    timeId: UUID
): Promise<UUID | undefined> => {
    const sql = `
        DELETE FROM tutor_times
        WHERE 
            id = $1 AND tutor_id = $2
        RETURNING
            id;
    `;

    const result: QueryResult<{ id: string }> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [timeId, tutorId]);
        });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].id;
};

export const deleteAllTutorTimes = async (tutorId: UUID): Promise<UUID> => {
    const sql = `
        DELETE FROM tutor_times
        WHERE 
            tutor_id = $1
        RETURNING
            tutor_id;
    `;

    const result: QueryResult<{ tutor_id: string }> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [tutorId]);
        });

    return tutorId;
};

export const updateTutorTime = async (
    timeId: UUID,
    data: UpdateTutorTime
): Promise<TutorTime | undefined> => {
    const sql = `
        UPDATE tutor_times
        SET
            date_time = $1,
            duration_hours = $2
        WHERE 
            id = $3
        RETURNING
            tutor_id,
            id,
            date_time,
            duration_hours;
    `; // Have to manually insert time id, node-pg issue

    const result: QueryResult<TutorTime> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [data.datetime, data.durationHours, timeId]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};
