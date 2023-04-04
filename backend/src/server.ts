import express, { Request, Response, Router } from 'express';
import { usersRouter } from './users/userEndpoints';
import { sessionsRouter } from './sessions/sessionEndpoints';
import { json as jsonParser } from 'body-parser';

export const app = express();
app.use(jsonParser());
const port = +(process.env.SERVICE_PORT || 3000);
const host = process.env.SERVICE_HOST || 'localhost';

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/sessions', sessionsRouter);

app.use('/api', apiRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


