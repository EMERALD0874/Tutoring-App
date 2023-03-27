import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';

import {
    selectUserByID,
    selectUsers,
    insertUser,
    deleteUser,
    updateUser,
} from './userDIs';
import { User, CreateUser, UpdateUser } from './user';
import { TypedRequestBody, TypedResponse, Alert } from '../types';

export const usersRouter = Router();

usersRouter
    .route('/')
    .all((req: Request, res: Response, next: NextFunction) => {
        // Future auth section
        next();
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const userRows = await selectUsers();
        return res.json(userRows);
    })
    .post(
        async (
            req: TypedRequestBody<CreateUser>,
            res: TypedResponse<User | Alert>,
            next: NextFunction
        ) => {
            let missingFields: string[] = [];

            // If anyone knows a better way to check the properties of an object, that would be nice
            if (req.body.username == null || req.body.username.trim() === '') {
                missingFields.push('username');
            }

            if (req.body.password == null || req.body.password.trim() === '') {
                missingFields.push('password');
            }

            if (
                req.body.first_name == null ||
                req.body.first_name.trim() === ''
            ) {
                missingFields.push('first_name');
            }

            if (
                req.body.last_name == null ||
                req.body.last_name.trim() === ''
            ) {
                missingFields.push('last_name');
            }

            //Should this be required?
            if (req.body.about == null || req.body.about.trim() === '') {
                missingFields.push('about');
            }

            if (req.body.email == null || req.body.email.trim() === '') {
                missingFields.push('email');
            }

            if (req.body.birthdate == null) {
                missingFields.push('birthdate');
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

            //Create user
            const newUser: User = {
                id: genUuid(),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                about: req.body.about,
                birthdate: req.body.birthdate,
            };

            //Add user to database and send response
            try {
                const user: User | undefined = await insertUser(newUser);
                if (user === undefined) {
                    res.status(500);
                    res.json({ error: 'Error creating user' });
                    next();
                }

                res.status(201);
                res.json(user);
            } catch (error) {
                res.status(500);
                res.json({ error: 'Internal Server Error' });
            }
        }
    );

usersRouter
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
