import { deleteOldTutorTimes } from '../tutors/tutorDIs'
import { deleteOldSessions } from '../sessions/sessionDIs';

export const appointmentJob = {
    cron: '0 1 * * * *',
    action: async () => {
            const deletedSessions = await deleteOldSessions();
            const deletedTimes = await deleteOldTutorTimes();
            console.log(`[CRON ${(new Date()).toTimeString()}]: Deleted ${deletedTimes} tutor times and ${deletedSessions} sessions.`)
    }
}