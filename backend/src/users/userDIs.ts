import { QueryResult } from "pg";
import { getConnection, slots } from "../common";
import { UpdateUser, User } from "./user";

export const selectUsers = (): User[] => {
    getConnection((conn) => {
        const sql = `
            SELECT
                id,
                first_name,
                last_name,
                about,
                email,
                birthdate
            FROM 
                users;
        `;

        conn.query(sql, []).then(
            (result) => {
                const rows: User[] = result.rows;
                return rows;
            }
        );
        throw Error('Error retrieving users');
    });

    throw Error('Error connecting to database');

    
};

export const selectUserByID = (id: string): User | undefined => {
    getConnection((conn) => {
        const sql = `
            SELECT
                id,
                first_name,
                last_name,
                about,
                email,
                birthdate
            FROM 
                users
            WHERE
                id = $1;
        `;

        conn.query(sql, [id]).then(
            (result) => {
                if (result.rowCount === 0) {
                    return undefined
                }
                const row: User = result.rows[0];

                return row;
            }
            
        );
        throw Error('Error retrieving user');
    });

    throw Error('Error connecting to database');
};

export const insertUser = (user: User): User | undefined => {
    getConnection((conn) => {
            const sql = `
                INSERT INTO users (
                    id,
                    first_name,
                    last_name,
                    about,
                    email,
                    birthdate
                    )
                VALUES (${slots(6)})
                RETURNING 
                    id,
                    first_name,
                    last_name,
                    about,
                    email,
                    birthdate;
            `;

            conn.query(sql, [
                user.id,
                user.first_name,
                user.last_name,
                user.about,
                user.email,
                user.birthdate
            ]).then( (result) => {
                if(result.rowCount === 0) {
                    return undefined;
                }

                const row: User = result.rows[0];
            
                return row;
            });
            throw Error('Error inserting user');

    });
    throw Error('Error connecting to database');

};

export const deleteUser = (id: string): string => {
    getConnection((conn) => {
        const sql = `
            DELETE FROM
                users
            WHERE
                id = $1
            RETURNING id;
        `;

        conn.query(sql, [id]).then(
            (result) => {
                return id;
            }
        );
        throw Error('Error deleting user');
    });
    throw Error('Error connecting to database');

};

export const updateUser = (id: string, user: UpdateUser): User | undefined => {

    const currUser = selectUserByID(id);

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

    updatedValues.push(id)
    
    getConnection((conn) => {
        const sql = `
            UPDATE
                users
            SET
                (${updatedFields.join(', ')}) = (${slots(updatedFields.length)})
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

        conn.query(sql, updatedValues).then(
            (result) => {
                if (result.rowCount === 0) {
                    throw Error('Error updating user');
                }

                const newUser: User = result.rows[0];
                return newUser;
            }
        );
        throw Error('Error updating user');

    });
    throw Error('Error connecting to database');
};
