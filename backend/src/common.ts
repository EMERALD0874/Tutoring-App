import { Pool, PoolClient } from 'pg';
import { validate, validate as validateUuid } from 'uuid';

// Environment Variables
export const port: number = +(process.env.PROJECT_PORT || 5000);
export const host: string = process.env.PROJECT_HOST || 'localhost';
const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: +(process.env.DB_PORT ?? '5432'),
    database: process.env.DB_SCHEMA ?? 'postgres',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
});

// Database Access Helper Functions

// getConnection(cb: (client: PoolClient) => void)
// This facilitates the automatic creation and cleanup of connections
// to the postgres db server. Supply the cb as a callback after the
// connection has been made.
//
// Example:
// ```ts
// getConnection(async (client: PoolClient) => {
//     return client.query("SELECT NOW();");
// })
// .then((ret) => {
//     console.log(ret.rows);
// })
// ```
// Yes, this could have been a regular function, but ofc garbage collected
// languages don't have a "drop" interface because the language never knows
// when the object is no longer in use, so this semi-hack is used.

export async function getConnection<T>(
    cb: (pg: PoolClient) => Promise<T>
): Promise<T> {
    var client = await pool.connect();
    var ret: T;
    ret = await cb(client);
    client.release();
    return ret;
}

export const slots = (n: number): string => {
    return [...Array(n).keys()].map((i) => `$${i + 1}`).join(', ');
};

export type UUID = string;
export const makeUuid = (id: string): UUID | undefined => {
    return validateUuid(id) ? (id as UUID) : undefined;
};
