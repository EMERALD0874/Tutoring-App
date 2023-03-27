import express, { Request, Response, Router } from 'express';
import uuid from "uuid";
import { getConnection } from './common';
import { tutorsRouter } from './tutors/tutorEndpoints';
import { usersRouter } from './users/userEndpoints';
import { json as jsonParser } from 'body-parser';

export const app = express();
app.use(jsonParser());
const port = 3000;

const apiRouter = Router();
apiRouter.use('/tutors', tutorsRouter);
apiRouter.use('/users', usersRouter);

app.use('/api', apiRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
