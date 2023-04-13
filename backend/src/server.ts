import express, { Request, Response, Router } from 'express';
import { tutorsRouter } from './tutors/tutorEndpoints';
import { usersRouter } from './users/userEndpoints';
import { sessionsRouter } from './sessions/sessionEndpoints';
import { json as jsonParser } from 'body-parser';
import { host, port } from './common';
import { departmentsRouter } from './departments/departmentsEndpoints';
import { subjectsRouter } from './subjects/subjectsEndpoints';
import { usersRouter } from './users/userEndpoints';
import { authRouter } from './auth/authEndpoints';

export const app = express();
app.use(jsonParser());

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/tutors', tutorsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/departments', departmentsRouter);
apiRouter.use('/subjects', subjectsRouter);
apiRouter.use('/sessions', sessionsRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server started on ${host}:${port}`);
});


