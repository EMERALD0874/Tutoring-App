import { NextFunction, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { NewUser, User } from '../users/user';
import { selectUserByUsername } from '../users/userDIs';
import { LoginRequest, RegisterUser, TokenResponse } from './auth';
import { generateHash, generateToken, verifyLogin } from './authCommon';
import { getAuthTokenByUserId } from './authDIs';
import { insertUser } from '../users/userDIs';

export const authRouter = Router();

authRouter
    .route('/login')
    .post(
        async (
            req: TypedRequestBody<LoginRequest>,
            res: TypedResponse<TokenResponse | Alert>,
            next: NextFunction
        ) => {
            if (req.body.username == null) {
                res.status(400);
                res.json({ error: 'Field "username" must not be empty' });
                return;
            }

            if (req.body.password == null) {
                res.status(400);
                res.json({ error: 'Field "password" must not be empty' });
            }

            const user = await selectUserByUsername(req.body.username);
            if (user == undefined) {
                res.status(404);
                res.json({ error: `User ${req.body.username} not found.` });
                return;
            }

            if (await verifyLogin(req.body.username, req.body.password)) {
                const token = await getAuthTokenByUserId(user.id);
                if (!token) {
                    res.status(201);
                    res.json({
                        token: await generateToken(user.id),
                        userId: user.id,
                    });
                    return;
                }

                res.status(201);
                res.json({
                    token: token,
                    userId: user.id,
                });
                return;
            } else {
                res.status(401);
                res.json({ error: 'Unauthorized' });
                return;
            }
        }
    );

authRouter
    .route('/register')
    .post(
        async (
            req: TypedRequestBody<RegisterUser>,
            res: TypedResponse<User | Alert>,
            next: NextFunction
        ) => {
            const invalidFields: string[] = [];

            if (!req.body.username) {
                invalidFields.push('username');
            }
            if (!req.body.birthdate) {
                invalidFields.push('birthdate');
            }
            if (!req.body.email) {
                invalidFields.push('email');
            }
            if (!req.body.first_name) {
                invalidFields.push('first_name');
            }
            if (!req.body.last_name) {
                invalidFields.push('last_name');
            }
            if (!req.body.password) {
                invalidFields.push('password');
            }

            if (invalidFields.length > 0) {
                res.status(500);
                res.json({
                    error: `The following required fields were missing: \n ${invalidFields.join(
                        '\t\n'
                    )}`,
                });
                return;
            }

            if ((await selectUserByUsername(req.body.username)) !== undefined) {
                res.status(409);
                res.json({
                    error: `User "${req.body.username}" already exists`,
                });
                return;
            }

            const newUser: NewUser = {
                id: genUuid(),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                birthdate: req.body.birthdate,
                username: req.body.username,
                password_hash: await generateHash(req.body.password),
            };

            const userData: User | undefined = await insertUser(newUser);

            if (!userData) {
                res.status(500);
                res.json({ error: 'Error creating user' });
            } else {
                res.status(201);
                res.json(userData);
            }
        }
    );
