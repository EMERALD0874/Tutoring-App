import { NextFunction, Request, Response, Router } from 'express';
import {
    createDepartment,
    deleteDepartment,
    selectDepartments,
} from './departmentDIs';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { Department } from './departments';
import { validate as validateUuid } from 'uuid';
import { authenticate } from '../auth/authCommon';

export const departmentsRouter = Router();

departmentsRouter
    .route('/')
    .all(authenticate, (req: Request, res: Response, next: NextFunction) => {
        next();
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const departmentRows = await selectDepartments();
        return res.json(departmentRows);
    })
    .post(
        async (
            req: TypedRequestBody<Department>,
            res: TypedResponse<Department | Alert>,
            next: NextFunction
        ) => {
            const dep: Department = { name: req.body.name };
            if (!dep.name) {
                res.status(400);
                res.json({ error: 'Empty string for department name' });
                next();
            }
            try {
                const create: Department | undefined = await createDepartment(
                    dep
                );
                if (create === undefined) {
                    res.status(500);
                    res.json({ error: 'Error creating department' });
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

departmentsRouter
    .route('/:id')
    .all((req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        next();
    }, authenticate)
    .delete(
        async (
            req: TypedRequestBody<Department>,
            res: TypedResponse<Department | Alert>,
            next: NextFunction
        ) => {
            try {
                const del: Department | undefined = await deleteDepartment(
                    req.params.id
                );
                if (del === undefined) {
                    res.status(500);
                    res.json({ error: 'Error creating department' });
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
