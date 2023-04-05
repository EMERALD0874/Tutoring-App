import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';

import { selectUserByID, selectUsers, deleteUser, updateUser } from './userDIs';
import { User, UpdateUser } from './user';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { authenticate } from '../auth/authCommon';

export const usersRouter = Router();

usersRouter
    .route('/')
    .all(
        authenticate,
        async (req: Request, res: Response, next: NextFunction) => {
            next();
        }
    )
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const userRows = await selectUsers();
        return res.json(userRows);
    });

usersRouter
    .route('/:id')
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        next();
    }, authenticate)
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const user = await selectUserByID(req.params.id);

        if (user === undefined) {
            res.status(404);
            res.json({ error: 'User not found.' });
        } else {
            res.status(200);
            res.json(user);
        }
    })
    .delete(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedId = await deleteUser(req.params.id);

            if (deletedId == null) {
                res.status(404);
            } else {
                res.status(200);
            }

            res.json({ id: deletedId });
        } catch (error) {
            res.status(500);
            res.json({ error: 'Internal Server Error' });
        }
    })
    .patch(
        async (
            req: TypedRequestBody<UpdateUser>,
            res: TypedResponse<User | Alert>,
            next: NextFunction
        ) => {
            try {
                const updatedUser = await updateUser(req.params.id, req.body);
                res.json(updatedUser);
                res.status(200);
            } catch (error) {
                res.json({ error: `Error updating user ${req.params.id}` });
                res.status(500);
            }
        }
    );
