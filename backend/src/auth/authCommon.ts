import 'crypto'
import { hash, verify} from 'argon2';

export const generateToken = (userId: string) => {
    
};

export const generateHash = () => {};

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
