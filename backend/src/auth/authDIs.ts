import { QueryResult } from 'pg';
import { getConnection, slots } from '../common';
import { TokenResponse } from './auth';

export const getAuthToken = async (id: string): Promise<string | undefined> => {
    const sql = `
            SELECT
                token
            FROM
                auth_tokens
            WHERE
                id = $1;
        `;
    
    const result: QueryResult<{token: string}> = await getConnection((conn) => {
        return conn.query(sql, [id]);
    });

    if (result.rowCount == 0) {
        return undefined;
    }

    return result.rows[0].token;
};

export const getAuthTokenByUserId = async (userId: string): Promise<string | undefined> => {
    const sql = `
            SELECT
                token
            FROM
                auth_tokens
            WHERE
                userId = $1;
        `;
    
    const result: QueryResult<{token: string}> = await getConnection((conn) => {
        return conn.query(sql, [userId]);
    });

    if (result.rowCount == 0) {
        return undefined;
    }

    return result.rows[0].token;
};

export const getPassHashByUsername = async (username: string): Promise<string | undefined> => {
    const sql = `
            SELECT
                password_hash
            FROM 
                users
            WHERE
                username = $1;
        `;

    const result: QueryResult<{password_hash: string}> = await getConnection((conn) => {
        return conn.query(sql, [username])
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].password_hash;
}