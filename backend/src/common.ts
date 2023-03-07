import { Pool, PoolClient } from 'pg';

// Environment Variables
export const port: number = +(process.env.PROJECT_PORT || 5000);
export const host: string = process.env.PROJECT_HOST || 'localhost'
const pool = new Pool({
        host: process.env.DB_HOST ?? 'localhost',
        port: +(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_SCHEMA ?? 'postgres',
        user: 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres'
});

// Database Access Helper Functions
export const getConnection = async (): Promise<PoolClient> => {
    return await pool.connect();
};
