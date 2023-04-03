import 'crypto'
import { hash, verify} from 'argon2';
import { projectSecret } from '../common';

export const generateToken = (userId: string) => {
    
};

export const generateHash = async (password: string): Promise<string> => {
    return await hash(password, {
        secret: Buffer.from(projectSecret, 'utf8'),
        hashLength: 64
    })
};

export const verifyPassword = async (hash: string, password: string) => {
    try {
        if(await verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
};
