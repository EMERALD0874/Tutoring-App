import express, { Request, Response, Router } from 'express';
import { usersRouter } from './users/userEndpoints'
import uuid from "uuid";
import { getConnection } from './common';
import { tutorsRouter } from './tutors/tutorEndpoints';

export const app = express();
const port = 3000;

const apiRouter = Router()
apiRouter.use('/users', usersRouter)
apiRouter.use('/tutors', tutorsRouter)

app.use('/api', apiRouter)

// handler for userid
app.param('id', (req: Request, resp: Response, next: Function, id: string) => {
    if (!uuid.validate(id)) {
        console.log(`PARAM :id; invalid uuid input: ${id}`);
        resp.status(400).end();
        return;
    }
    // oh joy blue and red functions
    getConnection((db) => {
        db.query("SELECT * FROM user WHERE id = $1;", [id])
            .then((v) => {
                if (v.rows.length > 0) {
                    // pass control
                    req.params.id = id;
                    next();
                } else {
                    console.log(`PARAM :id; no user found with id ${id}`);
                    resp.status(404).end();
                    return;
                }
            });
    });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
