import express, { Request, Response, Router } from 'express';
import { usersRouter } from './users/userEndpoints'

export const app = express();
const port = 3000;

const apiRouter = Router()
apiRouter.use('/users', usersRouter)

app.use('/api', apiRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
