import { Client } from 'pg';

// Environment Variables
export const port: number = +(process.env.PROJECT_PORT || 5000);
export const host: string = process.env.PROJECT_HOST || 'localhost'

// Database Access Helper Functions
export const getConnection = async (): Promise<Client> => {
    const client = new Client({
        host: process.env.DB_HOST ?? 'postgres',
        port: +(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_SCHEMA ?? 'postgres',
        user: 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres'
    })
    await client.connect();
    return client;
};
