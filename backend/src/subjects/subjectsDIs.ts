import { QueryResult } from 'pg';
import { getConnection } from '../common';
import { Subject } from './subjects';

export const selectSubjects = async (): Promise<Subject[]> => {
    const sql = `
        SELECT
            name,
            department
        FROM
            subjects;
        `;
    const result: QueryResult<Subject> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, []);
        }
    );
    return result.rows;
};

export const createSubject = async (
    sub: Subject
): Promise<Subject | undefined> => {
    const sql = `
    INSERT INTO subjects (
        name,
        department
    )
    VALUES ($1, $2)
    RETURNING
        name,
        department
    ;
    `;
    const result: QueryResult<Subject> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [sub.name, sub.department]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0];
};

export const deleteSubject = async (
    subName: string
): Promise<Subject | undefined> => {
    const sql = `
        DELETE FROM
            subjects
        WHERE
            name=$1
        RETURNING 
            name,
            department
        ;
    `;
    const result: QueryResult<Subject> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [subName]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0];
};
