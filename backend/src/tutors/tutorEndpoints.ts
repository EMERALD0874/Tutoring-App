import { NextFunction, request, Request, Response, Router } from 'express';
import { getConnection, makeUuid } from '../common';
import { TypedRequestBody, TypedResponse } from '../types';
import { TutorDELETEQuery, TutorPATCHQuery, TutorPOSTQuery, TutorPOSTResponse } from './tutor';
import { v4, validate } from 'uuid';

export const tutorsRouter = Router();

// /api/tutors/:userid
tutorsRouter.route("/:userid")
    .all(
        async (_: Request, __: Response, next: NextFunction) => {
            next();
        }
    )
    // GET /api/tutors/:userid
    // Returns an existing user if the tutor exists, along with avail times.
    .get(async (req: Request, resp: Response, _: NextFunction) => {
        try {
            const query = await getConnection(async (db) => {
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
                users
            JOIN 
                tutors ON users.id = tutors.id
            JOIN
                tutor_times ON tutors.id = tutor_times.tutor_id
            WHERE
                users.id = $1;`,
                    [req.params.userid]);
            });
            if (query.rows.length === 0) {
                resp.status(404).json({ error: "failed to find any rows" }).end();
            }
            else {
                resp.json(query.rows).end();
            }
        } catch (x) {
            console.log(`GET /api/tutors/:userid failed to query db ${x}`)
            resp.status(500).json({ error: `could not scrape database` }).end();
        }

    })
    // PATCH /api/tutors/:userid
    // QUERY PARAMS:
    // ttid: Tutor time id. Used as specifier.
    // when: Date, updates the internal date.
    // 
    // 
    // Updates the tutor appointments in the database
    .patch(async (req: TypedRequestBody<TutorPATCHQuery>, resp: Response, _: NextFunction) => {
        // date parse
        const date: Date =
            new Date((
                req.body.when ??
                "NOT A DATE"
            ));
        console.log(`${req.body.when}, ${date}`);
        if (Number.isNaN(date.valueOf())) {
            resp.status(400).json({ error: "invalid date" }).end();
            return;
        }
        try {
            const result = await getConnection(async (db) => {
                return db.query(`
            UPDATE 
                tutor_times
            SET
                day_of = $1,
                start_time = $2
            WHERE
                tutor_id = $3 AND
                id = $4;`,
                    [
                        date.toISOString().split('T')[0],
                        date.toISOString().split('T')[1],
                        req.params.userid,
                        req.body.ttid
                    ])
            });
            if (result.rowCount === 0) {
                resp.status(404).json({ error: `no rows found with id ${req.params.ttid}` }).end();
            } else {
                resp.status(200).end();
            }
        } catch (x) {
            console.log(`PATCH /api/tutors/:userid failed to query db ${x}`)
            resp.status(500).json({ error: `could not update database` }).end();
        }
    })
    // POST /api/tutors/:userid
    // QUERY PARAMS:
    // id: id of the times
    //
    // Adds tutor time to database 
    .post(async (req: TypedRequestBody<TutorPOSTQuery>, resp: TypedResponse<TutorPOSTResponse>, _: NextFunction) => {
        const date: Date =
            new Date((
                req.body.when ??
                "NOT A DATE"
            ));
        if (Number.isNaN(date.valueOf())) {
            resp.status(400).end();
            return;
        }
        try {
            const result: string | undefined = await getConnection(async (db) => {
                const id = v4();
                const good = await db.query(`
            INSERT INTO
                tutor_times
                (
                    tutor_id,
                    id,
                    day_of, 
                    start_time
                )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                );`,
                    [
                        req.params.userid,
                        id,
                        date.toISOString().split('T')[0],
                        date.toISOString().split('T')[1],
                    ]);
                if (good.rowCount > 0) {
                    return id;
                } else { return undefined; }
            });

            if (result === undefined) {
                resp.status(400).json({ error: "no rows inserted" }).end()
            }
            else {
                resp.json({ id: result }).end()
            }
        }
        catch (x) {
            console.log(`POST /api/tutor/:id could not execute query ${x}`);
            resp.status(500).json({ error: "internal sql error" }).end()
        }
    })
    // DELETE /api/tutors/:userid
    // QUERY PARAMS:
    // id: id of the time slot
    //
    // Deletes tutor time from database
    .delete(async (req: TypedRequestBody<TutorDELETEQuery>, resp: Response, _: NextFunction) => {
        try {
            const result = await getConnection(async (db) => {
                return db.query(`
                DELETE FROM 
                    tutor_times
                WHERE
                    id = $1 AND
                    tutor_id = $2;`,
                    [
                        req.body.id,
                        req.params.userid
                    ]);
            });
            if (result.rowCount > 0) {
                resp.status(200).end()
            }
            else {
                resp.status(404).json({ error: "no tutor time found" }).end()
            }
        } catch (x) {
            console.log(`POST /api/tutor/:id failed to do query ${x}`);
            resp.status(500).json({ error: "could not execute query" }).end()
        }
    });
