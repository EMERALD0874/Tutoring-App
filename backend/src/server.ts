import express, { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as cron from 'cron';
import { json as jsonParser } from 'body-parser';
import cors, { CorsOptions } from 'cors';

import { host, port } from './common';
import { tutorsRouter } from './tutors/tutorEndpoints';
import { usersRouter } from './users/userEndpoints';
import { sessionsRouter } from './sessions/sessionEndpoints';
import { departmentsRouter } from './departments/departmentsEndpoints';
import { subjectsRouter } from './subjects/subjectsEndpoints';
import { authRouter } from './auth/authEndpoints';
import { profilePictureRouter } from './profile-pictures/profile-picturesEndpoint';
import { appointmentJob } from './jobs/cleanAppointments';
import { tokenJob } from './jobs/cleanTokens';

export const app = express();

var corsOptions: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(jsonParser());
app.use(cors());

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/tutors', tutorsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/departments', departmentsRouter);
apiRouter.use('/subjects', subjectsRouter);
apiRouter.use('/sessions', sessionsRouter);
apiRouter.use('/profile-pictures', profilePictureRouter);
apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.use('/api', apiRouter);

app.listen(port, async () => {
    console.log(`Server started on ${host}:${port}`);

    // Cron job system
    const sessionCronJob = new cron.CronJob(
        appointmentJob.cron,
        () => {
            appointmentJob.action()
        },
        null,
        true,
        'America/Chicago'
    );
    const tokenCronJob = new cron.CronJob(
        tokenJob.cron,
        () => {
            tokenJob.action()
        },
        null,
        true,
        'America/Chicago'
    );

    sessionCronJob.start();
    tokenCronJob.start();
});
