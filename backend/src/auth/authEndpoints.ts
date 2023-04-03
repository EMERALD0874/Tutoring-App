import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { NewUser, User } from '../users/user';
import { getUserByUsername } from '../users/userDIs';
import { LoginRequest, RegisterUser, TokenResponse } from './auth';
import { generateHash, generateToken, verifyPassword } from './authCommon';
import { getAuthToken, getAuthTokenByUserId, getPassHashByUsername } from './authDIs';
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

        if(req.body.username == null) {
            res.status(400);
            res.json({error: 'Field "username" must not be empty'})
            return;
        } 

        if(req.body.password == null) {
            res.status(400);
            res.json({error: 'Field "password" must not be empty'})
        }

        const passHash = await getPassHashByUsername(req.body.username);
        if (passHash == undefined) {
            res.status(404);
            res.json({error: `User ${req.body.username} not found.`});
            return;
        }

        if (await verifyPassword(passHash, req.body.password)) {
            const user = await getUserByUsername(req.body.username);
            if (user == null) {
                res.status(500);
                res.json({error: 'Internal Server Error'});
                return;
            }

            const token = await getAuthTokenByUserId(user.id);
            if (token == null) {
                return {
                    token: generateToken(user.id),
                    userId: user.id
                };
            }
            
            return {
                token: token,
                userId: user.id
            };

        }
        else {
            res.status(401);
            res.json({error: 'Unauthorized'});
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

            if(!req.body.username) {
                invalidFields.push('username');
            }
            if(!req.body.birthdate) {
                invalidFields.push('birthdate');
            }
            if(!req.body.email) {
                invalidFields.push('email');
            }
            if(!req.body.first_name) {
                invalidFields.push('first_name');
            }
            if(!req.body.last_name) {
                invalidFields.push('last_name');
            }
            if(!req.body.password) {
                invalidFields.push('password')
            }

            if(invalidFields.length > 0) {
                res.status(500);
                res.json({error: `The following required fields were missing: \n ${invalidFields.join('\t\n')}`})
            }
            
            const newUser: NewUser = {
                id: genUuid(),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                birthdate: req.body.birthdate,
                username: req.body.username,
                password_hash: await generateHash(req.body.password)
            }

            const userData: User | undefined = await insertUser(newUser);

            if (!userData) {
                res.status(500);
                res.json({error: 'Error creating user'});
            }
            else {
                res.status(201);
                res.json(userData);
            }
        }
    );