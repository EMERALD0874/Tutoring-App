import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import {
    createDepartment,
    deleteDepartment,
    selectDepartments,
} from './departmentDIs';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { Department } from './departments';

export const departmentsRouter = Router();

departmentsRouter
    .route('/')
    .all((req: Request, res: Response, next: NextFunction) => {
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
