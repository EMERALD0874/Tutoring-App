import { QueryResult } from "pg";
import { getConnection } from "../common";
// import { getConnection, slots } from "../common";
import { Department } from "./departments"

export const selectDepartments = (): Department[] => {
    const sql = `
        SELECT
            name
        FROM
            departments
        `;
    const conn = getConnection((db) =>
    {
        

        db.query(sql, []).then((result) => {
            
        });
    });
}
export const createDepartment = (dep: Department): Department => 
{

}
export const deleteDepartment = (id: string): Department => 
{

}