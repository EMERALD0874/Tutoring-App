import { Request, Response, Router } from 'express';
import { getConnection } from '../common';

export const tutorsRouter = Router();

tutorsRouter.route("/:id")
    .get((req: Request, resp: Response) => {
        getConnection().then((db) => {
            db.query(`
            SELECT * FROM users 
                JOIN 
                    tutors ON users.id = tutors.id
                WHERE
                    users.id = $1;`, [req.params.id])
                .then((query) => {
                    if (query.rows.length < 0) {
                        resp.status(404).end();
                    }
                    else {
                        resp.send(query.rows[0]).end();
                    }
                });
        });
    })
    .post((req: Request, resp: Response) => {

    });