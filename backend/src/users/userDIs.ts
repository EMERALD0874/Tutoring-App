import { getConnection } from "../common";

export const getUsers = async () => {
    const conn = await getConnection();

    const sql = ```
    SELECT
        id,
        first_name,
        last_name,
        about,
        email,
        birthdate
    FROM 
        users;
    ```;
};