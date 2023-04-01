import { QueryResult } from 'pg';
import { getConnection, slots } from '../common';
import { UpdateUser, User } from './user';

export const selectUsers = async (): Promise<User[]> => {
    const sql = `
        SELECT
            id,
            first_name,
            last_name,
            username,
            about,
            email,
            birthdate
        FROM 
            users;
    `;

    const result: QueryResult<User> = await getConnection<QueryResult>(
        (conn) => {
            return conn.query(sql, []);
        }
    );

    return result.rows;
};

export const selectUserByID = async (id: string): Promise<User | undefined> => {
    const sql = `
            SELECT
                id,
                first_name,
                last_name,
                username,
                about,
                email,
                birthdate
            FROM 
                users
            WHERE
                id = $1;
        `;

    const result: QueryResult<User> = await getConnection((conn) => {
        return conn.query(sql, [id]);
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
    const sql = `
        SELECT
            id,
            first_name,
            last_name,
            username,
            about,
            email,
            birthdate
        FROM 
            users
        WHERE
            username = $1;
    `;

    const result: QueryResult<User> = await getConnection((conn) => {
        return conn.query(sql, [username])
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const insertUser = async (user: User): Promise<User | undefined> => {
    const sql = `
        INSERT INTO users (
            id,
            first_name,
            last_name,
            username,
            about,
            email,
            birthdate
            )
        VALUES (${slots(7)})
        RETURNING 
            id,
            first_name,
            last_name,
            username,
            about,
            email,
            birthdate;
    `;

    const result: QueryResult<User> = await getConnection((conn) => {
        return conn.query(sql, [
            user.id,
            user.first_name,
            user.last_name,
            user.username,
            user.about,
            user.email,
            user.birthdate,
        ]);
    });

    if (result.rowCount === 0) {
        return undefined;
    }

    return result.rows[0];
};

export const deleteUser = async (id: string): Promise<string | undefined> => {
    const sql = `
            DELETE FROM
                users
            WHERE
                id = $1
            RETURNING id;
    `;

    const userPresent = await selectUserByID(id);
    if (userPresent == null) {
        return undefined;
    }

    const result: QueryResult<{ id: string }> = await getConnection((conn) => {
        return conn.query(sql, [id]);
    });

    return id;
};

export const updateUser = async (
    id: string,
    user: UpdateUser
): Promise<User | undefined> => {
    const currUser = await selectUserByID(id);

    if (currUser == null) {
        return undefined;
    }

    let updatedFields: string[] = [];
    let updatedValues: any[] = [];

    if (user.first_name != null) {
        updatedFields.push('first_name');
        updatedValues.push(user.first_name);
    }

    if (user.last_name != null) {
        updatedFields.push('last_name');
        updatedValues.push(user.last_name);
    }

    if (user.about != null) {
        updatedFields.push('about');
        updatedValues.push(user.about);
    }

    if (user.email != null) {
        updatedFields.push('email');
        updatedValues.push(user.email);
    }

    if (user.birthdate != null) {
        updatedFields.push('birthdate');
        updatedValues.push(user.birthdate);
    }

    if (user.username != null) {
        updatedFields.push('username');
        updatedValues.push(user.username);
    }

    if (updatedFields.length === 0) {
        return currUser;
    }
    updatedValues.push(id);

    const setString =
        updatedFields.length > 1
            ? `(${updatedFields.join(', ')}) = (${slots(updatedFields.length)})`
            : `${updatedFields[0]} = $1`;

    const sql = `
            UPDATE
                users
            SET
                ${setString}
            WHERE
                id = $${updatedValues.length}
            RETURNING 
                id,
                first_name,
                last_name,
                about,
                email,
                birthdate;
    `;

    const result: QueryResult<User> = await getConnection((conn) => {
        return conn.query(sql, updatedValues);
    });

    if (result.rowCount === 0) {
        throw Error('Error updating user');
    }

    return result.rows[0];
};
