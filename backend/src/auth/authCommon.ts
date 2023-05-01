import 'crypto';
import { hash, verify } from 'argon2';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { isAfter, addDays, nextDay, format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { projectSecret } from '../common';
import { getAuthToken, insertToken } from './authDIs';
import { User } from '../users/user';
import { Token } from './auth';
import { selectUserByID, selectUserByUsername } from '../users/userDIs';

export const generateToken = async (userId: string): Promise<string> => {
    const now = new Date();
    const tomorrow = new Date(addDays(now, 1));
    const newToken: Token = {
        user_id: userId,
        token: genUuid(),
        expires: tomorrow,
    };

    insertToken(newToken);
    return newToken.token;
};

const verifyToken = async (req: Request): Promise<User | undefined> => {
    const rawToken = req.header('Authorization');

    if (rawToken === undefined) {
        throw Error('Missing Authorization Token');
    }

    if (rawToken.indexOf('Bearer') == -1) {
        throw Error('Invalid Token Format');
    }

    const token = rawToken.replace('Bearer', '').trim();

    const now = new Date();
    const tokenInfo = await getAuthToken(token);

    if (!tokenInfo) {
        throw Error('Error retrieving token');
    }

    if (isAfter(now, tokenInfo.expires)) {
        throw Error('Token is expired');
    }

    return await selectUserByID(tokenInfo.user_id);
};

export const generateHash = async (password: string): Promise<string> => {
    return await hash(password, {
        secret: Buffer.from(projectSecret, 'utf8'),
        hashLength: 64,
    });
};

export const verifyHash = async (
    hash: string,
    plain: string
): Promise<boolean> => {
    try {
        if (
            await verify(hash, plain, {
                secret: Buffer.from(projectSecret, 'utf8'),
                hashLength: 64,
            })
        ) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

export const verifyLogin = async (
    username: string,
    password: string
): Promise<boolean | undefined> => {
    const user = await selectUserByUsername(username);
    if (user === undefined) {
        return undefined;
    }

    return await verifyHash(user.password_hash, password);
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await verifyToken(req);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'Missing Authorization Token':
                    res.status(403);
                    res.json({ error: 'Missing authorization token' });
                    break;
                case 'Invalid Token Format':
                    res.status(400);
                    res.json({ error: 'Invalid Token Format' });
                    break;
                case 'Token is expired':
                // Maybe we need to prompt to refresh the token? I don't know
                case 'Error retrieving token':
                default:
                    res.status(403);
                    res.json({ error: 'Unauthorized' });
                    break;
            }
            return;
        }
    }
    next();
};
