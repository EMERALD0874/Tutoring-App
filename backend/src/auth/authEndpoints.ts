import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { TypedRequestBody, TypedResponse, Alert } from '../types';
import { User } from '../users/user';
import { getUserByUsername } from '../users/userDIs';
import { LoginRequest, RegisterUser, TokenResponse } from './auth';
import { generateToken, verifyPassword } from './authCommon';
import { getAuthToken, getAuthTokenByUserId, getPassHashByUsername } from './authDIs';

export const authRouter = Router();

authRouter
    .route('/login')
    .post( 
        async (
        req: TypedRequestBody<LoginRequest>,
        res: TypedResponse<TokenResponse | Alert>,
        next: NextFunction
    ) => {
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
            res: TypedResponse<object | Alert>,
            next: NextFunction
        ) => {}
    );