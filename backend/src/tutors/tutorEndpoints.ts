import { NextFunction, request, Request, Response, Router } from 'express';
import { getConnection, makeUuid } from '../common';
import { TypedRequestBody, TypedResponse } from '../types';
import { TutorDELETEQuery, UpdateTutor, TutorPOSTQuery, TutorPOSTResponse, TutorDetails } from './tutor';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { deleteSubject, deleteTutor, getTutor, insertSubject, insertTutor } from './tutorDIs';
import { authenticate } from '../auth/authCommon';

export const tutorsRouter = Router();

// /api/tutors/:userid
tutorsRouter.route("/:id")
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        next();
    }, authenticate)
    // GET /api/tutors/:userid
    // Returns an existing user if the tutor exists, along with avail times.
    .get(async (req: Request, res: TypedResponse<TutorDetails>, _: NextFunction) => {
        const userid = makeUuid(req.params.id);
        if (userid === undefined) {
            res.status(400).json({ error: "invalid uuid" });
            return;
        }

        try {
            const result = await getTutor(userid);
            if (!result) {
                res.status(404).json({ error: `Tutor ${userid} not found.` });
            }
            else {
                res.status(200).json(result);
            }

        } catch (x) {
            console.log(`GET /api/tutors/:userid failed to query db ${x}`)
            res.status(500).json({ error: `could not scrape database` }).end();
        }

    })

    // PATCH /api/tutors/:userid
    // QUERY PARAMS:
    // ttid: Tutor time id. Used as specifier.
    // when: Date, updates the internal date.
    // 
    // 
    // Updates the tutor appointments in the database
    .patch(async (req: TypedRequestBody<UpdateTutor>, res: Response, _: NextFunction) => {
        // Update subjects
        const newSubjects = req.body.subjects;
        const user = await getTutor(req.params.id);
        if (!user)
        {
            res.status(404).json({error: `Tutor ${req.params.id} not found`});
            return;
        }

        const currentSubjects = user.subjects ?? [];
        const subjectsToAdd: string[] = [];
        const subjectsToRemove: string[] = [];

        newSubjects.forEach((subject) => {
            if (!currentSubjects.includes(subject)) {
                subjectsToAdd.push(subject);
            }
        })

        currentSubjects.forEach((subject) => {
            if(!newSubjects.includes(subject)) {
                subjectsToRemove.push(subject);
            }
        })

        subjectsToAdd.forEach(async (subject) => {
            await insertSubject(user.id, subject)
        });

        subjectsToRemove.forEach(async (subject) => {
            await deleteSubject(user.id, subject)
        });

        const updatedUser = await getTutor(req.params.id);
        if (!updatedUser)
        {
            res.status(500).json({error: `Internal Server Error`});
            console.log(`Error retrieving user after update: ${req.params.id}`)
            return;
        }
        res.status(200).json(updatedUser);

    })
    // POST /api/tutors/:userid
    // QUERY PARAMS:
    // id: id of the times
    //
    // Adds tutor time to database 
    .post(async (req: TypedRequestBody<TutorPOSTQuery>, res: TypedResponse<TutorPOSTResponse>, _: NextFunction) => {
        const userId = makeUuid(req.params.id);
        if (!userId) {
            res.status(400).json({ error: "invalid uuid" });
            return;
        }
        
        try {
            const result = await insertTutor(userId)
            if (result === undefined) {
                res.status(400).json({ error: "no rows inserted" }).end()
                
            }
            else {
                res.json({ id: result })
            }  
        }
        catch (x) {
            console.log(`POST /api/tutor/:id could not execute query ${x}`);
            res.status(500).json({ error: "internal sql error" }).end()
        }
    })
    // DELETE /api/tutors/:userid
    // QUERY PARAMS:
    // id: id of the time slot
    //
    // Deletes tutor time from database
    .delete(async (req: TypedRequestBody<TutorDELETEQuery>, res: Response, _: NextFunction) => {
        const userId = makeUuid(req.params.userid);

        if (userId === undefined) {
            res.status(400).json({ error: "invalid uuid" });
            return;
        }

        try {
            const result = await deleteTutor(userId);
            if (!result) {
                res.status(404).json({error: 'User not found in tutor list'});
            }
            res.status(200).json({id: userId});
            return;
        } catch (x) {
            console.log(`POST /api/tutor/:id failed to do query ${x}`);
            res.status(500).json({ error: "could not execute query" }).end()
        }
    });

// Begin tutor subjects
tutorsRouter.route("/:userId/:subjectId")
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.userId)) {
            res.status(400);
            res.json({ error: 'Invalid User UUID' });
            return;
        }

        if (!validateUuid(req.params.subjectId)) {
            res.status(400);
            res.json({ error: 'Invalid Subject UUID' });
            return;
        }
        next();
    }, authenticate)

