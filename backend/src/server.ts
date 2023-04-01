import express, { Request, Response, Router } from 'express';
import { usersRouter } from './users/userEndpoints';
import { sessionsRouter } from './sessions/sessionEndpoints';
import { json as jsonParser } from 'body-parser';
import { port } from './common';
import { departmentsRouter } from './departments/departmentsEndpoints';
import { subjectsRouter } from './subjects/subjectsEndpoints';
import { usersRouter } from './users/userEndpoints';
import { authRouter } from './auth/authEndpoints';

export const app = express();
app.use(jsonParser());
const port = +(process.env.SERVICE_PORT || 3000);
const host = process.env.SERVICE_HOST || 'localhost';

const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/departments', departmentsRouter);
apiRouter.use('/subjects', subjectsRouter);
apiRouter.use('/sessions', sessionsRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


