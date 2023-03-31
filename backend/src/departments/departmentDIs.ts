import { Query, QueryResult } from "pg";
import { getConnection } from "../common";
// import { getConnection, slots } from "../common";
import { Department } from "./departments";
import { UUID } from "../common";

export const selectDepartments = async (): Promise<Department[]> => {
    const sql = `
        SELECT
            name
        FROM
            departments
        `;
    const result: QueryResult<Department> = await getConnection<QueryResult>((db) =>
    {
        return db.query(sql, [])
    });
    return result.rows;
}

 export const createDepartment = async (dep: Department): Promise<Department> => 
 {
     const sql = `
     INSERT INTO users (
         name
     )
     VALUES ($1, $2)
     RETURNING 
         id,
         name;
     `;
        const result: QueryResult<Department> = await getConnection<QueryResult>((db) => {
            return db.query(sql, []);
        });
        return result;
}
// export const deleteDepartment = (id: UUID): Department => 
// {

// }