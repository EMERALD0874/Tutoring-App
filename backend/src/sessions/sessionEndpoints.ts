import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';

import {
    selectSessionByID,
    selectSessions,
    insertSession,
    deleteSession,
    updateSession,
} from './sessionDIs';
import { Session, CreateSession, UpdateSession } from './session';
import { TypedRequestBody, TypedResponse, Alert } from '../types';

export const sessionsRouter = Router();

sessionsRouter
    .route('/')
    .all((req: Request, res: Response, next: NextFunction) => {
        // Future auth section
        next();
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const userRows = await selectSessions();
        return res.json(userRows);
    })
    .post(
        async (
            req: TypedRequestBody<CreateSession>,
            res: TypedResponse<Session | Alert>,
            next: NextFunction
        ) => {
            let missingFields: string[] = [];

            // If anyone knows a better way to check the properties of an object, that would be nice
            if (req.body.student_id == null || req.body.student_id.trim() === '') {
                missingFields.push('student_id');
            }
            if (req.body.tutor_id == null || req.body.tutor_id.trim() === '') {
                missingFields.push('tutor_id');
            }
            if (req.body.appointment == null || req.body.appointment.trim() === '') {
                missingFields.push('appointment');
            }

            if (missingFields.length !== 0) {
                res.status(400);
                res.json({
                    error: `Missing required fields: ${missingFields.join(
                        ', '
                    )}`,
                });
                next();
            }

            //Create session
            const newSession: Session = {
                id: genUuid(),
                student_id: req.body.student_id,
                tutor_id: req.body.tutor_id,
                appointment: req.body.appointment,
            };

            //Add session to database and send response
            try {
                const session: Session | undefined = await insertSession(newSession);
                if (session === undefined) {
                    res.status(500);
                    res.json({ error: 'Error creating session' });
                    next();
                }

                res.status(201);
                res.json(session);
            } catch (error) {
                res.status(500);
                res.json({ error: 'Internal Server Error' });
            }
        }
    );

sessionsRouter
    .route('/:id')
    .all((req: Request, res: Response, next: NextFunction) => {
        // Future auth section
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        next();
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const session = await selectSessionByID(req.params.id);

        if (session === undefined) {
            res.status(404);
            res.json({ error: 'Session not found.' });
        } else {
            res.status(200);
            res.json(session);
        }
    })
    .delete(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedId = await deleteSession(req.params.id);
            if (deletedId == null) {
                res.status(404);
            }
            else {
                res.status(200);
            }
            res.json({ id: deletedId });
        } catch (error) {
            console.log(error)
            res.status(500);
            res.json({ error: 'Internal Server Error' });
        }
    })
    .patch(
        async (
            req: TypedRequestBody<UpdateSession>,
            res: TypedResponse<Session | Alert>,
            next: NextFunction
        ) => {
            try {
                const updatedSession = await updateSession(req.params.id, req.body);
                res.json(updatedSession);
                res.status(200);
            } catch (error) {
                res.json({ error: `Error updating user ${req.params.id}` });
                res.status(500);
            }
        }
    );