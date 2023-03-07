import { QueryResult } from "pg";
import { getConnection } from "../common";
// import { getConnection, slots } from "../common";
import { Department } from "./departments"
export const selectDepartments = async (): Promise<Department> => {
    const conn = await getConnection();

    const sql = `
        SELECT
            name
        FROM
            departments
    `;

    const result: QueryResult<Department> = await conn.query(sql, []);
    await conn.end();
    
    return Promise.resolve
}