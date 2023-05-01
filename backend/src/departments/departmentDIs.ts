import { QueryResult } from 'pg';
import { getConnection } from '../common';
import { Department } from './departments';

export const selectDepartments = async (): Promise<Department[]> => {
    const sql = `
        SELECT
            name
        FROM
            departments;
        `;
    const result: QueryResult<Department> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, []);
        }
    );
    return result.rows;
};

export const createDepartment = async (
    dep: Department
): Promise<Department | undefined> => {
    const sql = `
    INSERT INTO departments (
        name
    )
    VALUES ($1)
    RETURNING 
        name;
    `;
    const result: QueryResult<Department> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [dep.name]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0];
};

export const deleteDepartment = async (
    department: string
): Promise<Department | undefined> => {
    const sql = `
        DELETE FROM
            departments
        WHERE
            name=$1
        RETURNING (
            name
        );
    `;
    const result: QueryResult<Department> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [department]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0];
};
