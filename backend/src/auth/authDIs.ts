import { QueryResult } from 'pg';
import { getConnection, slots } from '../common';
import { Token, TokenInfo } from './auth';

export const deleteOldTokens = async (): Promise<number> => {
    const sql = `
        DELETE FROM 
            auth_tokens 
        WHERE 
            expires < (now() at time zone 'utc');
    `;

    const result: QueryResult<{}> = await getConnection((conn) => {
        return conn.query(sql, []);
    });
    
    return result.rowCount;
};

export const getAuthToken = async (
    token: string
): Promise<TokenInfo | undefined> => {
    const sql = `
            SELECT
                user_id,
                expires
            FROM
                auth_tokens
            WHERE
                token = $1;
        `;

    const result: QueryResult<TokenInfo> = await getConnection((conn) => {
        return conn.query(sql, [token]);
    });

    if (result.rowCount == 0) {
        return undefined;
    }

    return result.rows[0];
};

export const insertToken = async (token: Token): Promise<Token | undefined> => {
    const sql = `
            INSERT INTO auth_tokens (
                token,
                user_id,
                expires
                )
            VALUES (${slots(3)})
            RETURNING
                token,
                user_id,
                expires;
    `;

    const result: QueryResult<Token> = await getConnection((conn) => {
        return conn.query(sql, [token.token, token.user_id, token.expires]);
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const getAuthTokenByUserId = async (
    userId: string
): Promise<string | undefined> => {
    const sql = `
            SELECT
                token
            FROM
                auth_tokens
            WHERE
                user_id = $1;
        `;

    const result: QueryResult<{ token: string }> = await getConnection(
        (conn) => {
            return conn.query(sql, [userId]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].token;
};

export const getPassHashByUsername = async (
    username: string
): Promise<string | undefined> => {
    const sql = `
            SELECT
                password_hash
            FROM 
                users
            WHERE
                username = $1;
        `;

    const result: QueryResult<{ password_hash: string }> = await getConnection(
        (conn) => {
            return conn.query(sql, [username]);
        }
    );

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0].password_hash;
};
