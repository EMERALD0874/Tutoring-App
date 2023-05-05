import { QueryResult } from 'pg';
import { getConnection, slots } from '../common';
import { Session, UpdateSession } from './session';

export const selectSessions = async (): Promise<Session[]> => {
    const sql = `
        SELECT
            id,
            student_id,
            tutor_id,
            appointment
        FROM 
            sessions;
    `;

    const result: QueryResult<Session> = await getConnection<QueryResult>(
        (conn) => {
            return conn.query(sql, []);
        }
    );

    return result.rows;
};

export const selectSessionByID = async (
    id: string
): Promise<Session | undefined> => {
    const sql = `
            SELECT
                id,
                student_id,
                tutor_id, 
                appointment
            FROM 
                sessions
            WHERE
                id = $1;
        `;

    const result: QueryResult<Session> = await getConnection((conn) => {
        return conn.query(sql, [id]);
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const insertSession = async (
    session: Session
): Promise<Session | undefined> => {
    const sql = `
        INSERT INTO sessions (
            id,
            student_id,
            tutor_id,
            appointment
            )
        VALUES (${slots(4)})
        RETURNING 
            id,
            student_id,
            tutor_id,
            appointment;
    `;
    const result: QueryResult<Session> = await getConnection((conn) => {
        return conn.query(sql, [
            session.id,
            session.student_id,
            session.tutor_id,
            session.appointment,
        ]);
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteSession = async (
    id: string
): Promise<string | undefined> => {
    const sql = `
            DELETE FROM
                sessions
            WHERE
                id = $1
            RETURNING id;
    `;

    const sessionPresent = await selectSessionByID(id);
    if (sessionPresent == null) {
        return undefined;
    }

    const result: QueryResult<{ id: string }> = await getConnection((conn) => {
        return conn.query(sql, [id]);
    });

    return id;
};

export const updateSession = async (
    id: string,
    session: UpdateSession
): Promise<Session | undefined> => {
    const currSession = await selectSessionByID(id);

    if (currSession == null) {
        return undefined;
    }

    let updatedFields: string[] = [];
    let updatedValues: any[] = [];

    if (session.student_id != null) {
        updatedFields.push('student_id');
        updatedValues.push(session.student_id);
    }

    if (session.tutor_id != null) {
        updatedFields.push('tutor_id');
        updatedValues.push(session.tutor_id);
    }

    if (session.appointment != null) {
        updatedFields.push('appointment');
        updatedValues.push(session.appointment);
    }

    if (updatedFields.length === 0) {
        return currSession;
    }
    updatedValues.push(id);

    const setString =
        updatedFields.length > 1
            ? `(${updatedFields.join(', ')}) = (${slots(updatedFields.length)})`
            : `${updatedFields[0]} = $1`;

    const sql = `
            UPDATE
                sessions
            SET
                ${setString}
            WHERE
                id = $${updatedValues.length}
            RETURNING 
                id,
                student_id,
                appointment;
    `;

    const result: QueryResult<Session> = await getConnection((conn) => {
        return conn.query(sql, updatedValues);
    });

    if (result.rowCount === 0) {
        throw Error('Error updating session');
    }

    return result.rows[0];
};

export const deleteOldSessions = async (): Promise<number> => {
    // const sql = `
    //     DELETE * FROM sessions
    //     JOIN tutor_times 
    //         ON sessions.appointment=tutor_times.id 
    //     WHERE tutor_times.datetime > CURRENT_DATE;
    // `;
    const sql = `
        WITH times AS (SELECT * FROM tutor_times WHERE datetime > current_date)
        DELETE 
            * 
        FROM 
            sessions 
        WHERE 
            appointment IN (SELECT id FROM times);
    `;

    const result: QueryResult<{}> = await getConnection((conn) => {
        return conn.query(sql, []);
    });

    return result.rowCount;
};
