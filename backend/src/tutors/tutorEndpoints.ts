import { request, Request, Response, Router } from 'express';
import { getConnection } from '../common';
import { TypedRequestBody } from '../types';
import { TutorPATCHQuery } from './tutor';

export const tutorsRouter = Router();

// /api/tutors/:userid
tutorsRouter.route("/:userid")
    // GET /api/tutors/:userid
    // Returns an existing user if the tutor exists, along with avail times.
    .get(async (req: Request, resp: Response) => {
        var query = await getConnection(async (db) => {
            return db.query(`
            SELECT 
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.about AS about,
                users.email AS email,
                users.birthdate AS birthday,
                tutor_times.id AS time_id,
                tutor_times.day_of AS day_of,
                tutor_times.start_time AS start_time
            FROM 
                users, tutor_times
            JOIN 
                tutors ON users.id = tutors.id
            JOIN
                tutor_times ON tutors.id = tutor_times.tutor_id
            WHERE
                users.id = $1;`,
                [req.params.userid]);
        });
        if (query.rows.length < 0) {
            resp.status(404).end();
        }
        else {
            resp.send(query.rows[0]).end();
        }
    })
    // PATCH /api/tutors/:userid
    // QUERY PARAMS:
    // ttid: Tutor time id. Used as specifier.
    // when: ISO 8601 date, to update day_of AND start_time.
    // 
    // Updates the tutor appointments in the database
    .patch(async (req: TypedRequestBody<TutorPATCHQuery>, resp: Response) => {
        const query = req.body;

        // date parse
        // const date: Date =
        //     new Date((
        //         req.body.when ??
        //         "NOT A DATE"
        //     ));
        // if (Number.isNaN(date.valueOf())) {
        //     resp.status(400).end();
        //     return;
        // }

        const date: Date;
        if (query.when === undefined) {
            const query = await getConnection(async (db) => {
                return db.query(`
                SELECT
                    day_of,
                    start_time
                FROM
                    tutor_times
                JOIN 
                    tutors ON users.id = tutors.id
                JOIN
                    tutor_times ON tutors.id = tutor_times.tutor_id
                WHERE
                    users.id = $1;`,
                [req.params.userid]);
            });

        }

        var result = await getConnection(async (db) => {
            // TODO: incoreect query. join the tables
            return db.query(`
            UPDATE 
                tutor_times
            SET
                day_of = $1,
                start_time = $2,
            WHERE
                tutor_id = $3 AND
                id = $4;`,
                [
                    date.toISOString().split('T')[0],
                    date.toISOString().split('T')[1],
                    req.params.userid,
                    query.ttid
                ])
        });
        if (result.rowCount == 0) {
            resp.status(404).end();
        } else {
            resp.status(200).end();
        }
    })
    .put(async (req: Request, resp: Response) => { })
    .delete(async (req: Request, resp: Response) => { });
