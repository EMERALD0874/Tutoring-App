import { QueryResult } from 'pg';
import { UUID, getConnection } from '../common';
import { ProfilePicture } from './profile-pictures';

export const selectProfilePicture = async (
    id: UUID
): Promise<ProfilePicture | undefined> => {
    const sql = `
        SELECT
            id,
            user_id,
            profile_picture,
            file_type
        FROM
            profile_pictures
        WHERE
            user_id=$1;
    `;
    const result: QueryResult<ProfilePicture> =
        await getConnection<QueryResult>((db) => {
            return db.query(sql, [id]);
        });
    if (result.rows.length != 1) {
        return undefined;
    }
    return result.rows[0];
};
export const createProfilePicture = async (
    pfp: ProfilePicture
): Promise<UUID | undefined> => {
    const sql = `
        INSERT INTO profile_pictures (
            id,
            user_id,
            profile_picture,
            file_type
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id
        ;
    `;
    const result: QueryResult<{ id: UUID }> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [
                pfp.id,
                pfp.user_id,
                pfp.profile_picture,
                pfp.file_type,
            ]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0].id;
};

export const deleteProfilePicture = async (
    pfp: ProfilePicture
): Promise<UUID | undefined> => {
    const sql = `
        DELETE FROM
            profile_pictures
        WHERE
            id = $1
        RETURNING
            id;
    `;
    const result: QueryResult<{ id: UUID }> = await getConnection<QueryResult>(
        (db) => {
            return db.query(sql, [pfp.id]);
        }
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return result.rows[0].id;
};
