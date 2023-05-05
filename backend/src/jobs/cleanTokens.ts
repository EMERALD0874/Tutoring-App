import { deleteOldTokens } from '../auth/authDIs';


export const tokenJob = {
    cron: '0 0 * * * *',
    action: async () => {
        const result = await deleteOldTokens()
        console.log(`[CRON ${(new Date()).toTimeString()}]: ${result} tokens deleted.`);
    }
}