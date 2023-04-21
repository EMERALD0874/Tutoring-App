import { NextFunction, Request, Response, Router } from 'express';
import { createSubject, deleteSubject, selectSubjects } from './subjectsDIs';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { Subject } from './subjects';
import { authenticate } from '../auth/authCommon';

export const subjectsRouter = Router();

subjectsRouter
    .route('/')
    .all(authenticate, (req: Request, res: Response, next: NextFunction) => {next()})
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const subjectRows = await selectSubjects();
        return res.json(subjectRows);
    })
    .post(
        async (
            req: TypedRequestBody<Subject>,
            res: TypedResponse<Subject | Alert>,
            next: NextFunction
        ) => {
            const subject: Subject = {
                name: req.body.name,
                department: req.body.department,
            };
            if (!subject.name) {
                res.status(400);
                res.json({ error: 'Empty string for subject name' });
                next();
            }
            if (!subject.department) {
                res.status(400);
                res.json({ error: 'Empty string for subject' });
            }
            try {
                const create: Subject | undefined = await createSubject(
                    subject
                );
                if (create === undefined) {
                    res.status(500);
                    res.json({ error: 'Error creating subject' });
                    next();
                }
                res.status(201);
                res.json(create);
            } catch (error) {
                res.status(500);
                res.json({ error: 'Internal server error' });
            }
        }
    );

subjectsRouter
    .route('/:id')
    .all(authenticate, (req: Request, res: Response, next: NextFunction) => {next()})
    .delete(
        async (
            req: TypedRequestBody<Subject>,
            res: TypedResponse<Subject | Alert>,
            next: NextFunction
        ) => {
            try {
                const del: Subject | undefined = await deleteSubject(
                    req.params.id
                );
                if (del === undefined) {
                    res.status(500);
                    res.json({ error: 'Error deleting subject' });
                    next();
                }
                res.status(201);
                res.json(del);
            } catch (error) {
                res.status(500);
                res.json({ error: 'Internal server error' });
            }
        }
    );
