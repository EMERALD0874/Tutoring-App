import {
    NextFunction,
    request,
    Request,
    response,
    Response,
    Router,
} from 'express';
import { makeUuid, UUID } from '../common';
import { TypedRequestBody, TypedResponse } from '../types';
import {
    TutorDELETEQuery,
    UpdateTutor,
    TutorDetails,
    NewTutor,
    UpdateTutorTime,
    TutorTime,
    NewTutorTime,
    TutorSubjectRelation,
} from './tutor';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import {
    deleteTutorSubject,
    deleteTutor,
    selectTutors,
    insertTutorSubject,
    insertTutor,
    selectSubjectsByTutor,
    selectTimesByTutor,
    _getFullTutor,
    insertTutorTime,
    selectTutor,
    deleteAllTutorTimes,
    deleteTutorTime,
    selectTutorTime,
    updateTutorTime,
    deleteAllSubjectsForTutor,
} from './tutorDIs';
import { authenticate } from '../auth/authCommon';
import { selectUserByID } from '../users/userDIs';
import { selectSubjectById, selectSubjects } from '../subjects/subjectsDIs';

export const tutorsRouter = Router();

// General tutor endpoints
tutorsRouter
    .route('/')
    .all(authenticate, (req: Request, res: Response, next: NextFunction) => {
        next();
    })
    .get(
        async (
            req: Request,
            res: TypedResponse<TutorDetails[]>,
            next: NextFunction
        ) => {
            const result = await selectTutors();
            try {
                const tutors = result.map(
                    async (tutorId): Promise<TutorDetails> => {
                        return await _getFullTutor(tutorId);
                    }
                );
                res.status(200).json(
                    (await Promise.all(tutors)).filter(
                        (tutor) => tutor.id !== ''
                    )
                );
            } catch {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    )
    .post(
        async (
            req: TypedRequestBody<NewTutor>,
            res: TypedResponse<TutorDetails>,
            next: NextFunction
        ) => {
            try {
                const errors: string[] = [];

                const userExists = selectUserByID(req.body.tutorId) != null;
                if (userExists) {
                    res.status(400).json({
                        error: `User ${req.body.tutorId} already exists.`,
                    });
                    return;
                }

                try {
                    await insertTutor(req.body.tutorId);
                } catch {
                    res.status(500).json({ error: 'Error creating tutor' });
                    return;
                }

                req.body.subjects.forEach(async (subject) => {
                    try {
                        const result = await insertTutorSubject(
                            req.body.tutorId,
                            subject
                        );
                        if (!result) {
                            errors.push(
                                `Error adding subject ${subject} for tutor ${req.body.tutorId}`
                            );
                        }
                    } catch {
                        errors.push(
                            `Error adding subject ${subject} for tutor ${req.body.tutorId}`
                        );
                    }
                });

                req.body.times.forEach(async (time) => {
                    try {
                        const timeId = genUuid();
                        const result = await insertTutorTime(
                            req.body.tutorId,
                            timeId,
                            time.datetime,
                            time.durationHours
                        );
                        if (!result) {
                            errors.push(
                                `Error creating time ${JSON.stringify(time)}`
                            );
                        }
                    } catch {
                        errors.push(
                            `Error creating time ${JSON.stringify(time)}`
                        );
                    }
                });

                if (errors.length > 0) {
                    res.status(201).json({
                        error: `Tutor created with errors: \n${errors.join(
                            '\n'
                        )}`,
                    });
                    return;
                }

                const fullTutor = await _getFullTutor(req.body.tutorId);
                res.status(201).json(fullTutor);
            } catch {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    );

// /api/tutors/:userid
tutorsRouter
    .route('/:id')
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        const exists = await selectTutor(req.params.id);

        if (!exists) {
            res.status(404).json({
                error: `Tutor ${req.params.id} not found.`,
            });
            return;
        }

        next();
    }, authenticate)
    // GET /api/tutors/:userid
    // Returns an existing user if the tutor exists, along with avail times.
    .get(
        async (
            req: Request,
            res: TypedResponse<TutorDetails>,
            _: NextFunction
        ) => {
            const userid = req.params.id as UUID;

            try {
                const result = await _getFullTutor(userid);
                res.status(200).json(result);
            } catch (x) {
                console.log(`GET /api/tutors/:userid failed to query db ${x}`);
                res.status(500)
                    .json({ error: `Internal Server Error` })
                    .end();
            }
        }
    )

    // PATCH /api/tutors/:userid
    // QUERY PARAMS:
    // ttid: Tutor time id. Used as specifier.
    // when: Date, updates the internal date.
    //
    //
    // Updates the tutor appointments in the database
    .patch(
        async (
            req: TypedRequestBody<UpdateTutor>,
            res: TypedResponse<{ id: string }>,
            _: NextFunction
        ) => {
            // Update subjects
            const newSubjects = req.body.subjects;
            const errors: string[] = [];

            const user = await _getFullTutor(req.params.id);
            if (user == null) {
                res.status(500).json({
                    error: `Error retrieving tutor ${req.params.id}`,
                });
                return;
            }

            //SUBJECTS
            const currentSubjects = user.subjects ?? [];
            const subjectsToAdd: string[] = [];
            const subjectsToRemove: string[] = [];

            newSubjects.forEach((subject) => {
                if (!currentSubjects.includes(subject)) {
                    subjectsToAdd.push(subject);
                }
            });

            currentSubjects.forEach((subject) => {
                if (!newSubjects.includes(subject)) {
                    subjectsToRemove.push(subject);
                }
            });

            subjectsToAdd.forEach(async (subject) => {
                try {
                    await insertTutorSubject(user.id, subject);
                } catch {
                    errors.push(`Error adding subject ${subject}`);
                }
            });

            subjectsToRemove.forEach(async (subject) => {
                try {
                    await deleteTutorSubject(user.id, subject);
                } catch {
                    errors.push(`Error removing subject ${subject}`);
                }
            });

            // TIMES
            try {
                const deletedTimes = await deleteAllTutorTimes(user.id);
            } catch {
                errors.push('Error clearing previous tutor times');
            }

            if (errors.length > 0) {
                res.status(201).json({
                    error: `Tutor created with errors: \n${errors.join('\n')}`,
                });
                return;
            }

            req.body.times.forEach(async (tutorTime) => {
                try {
                    const timeId = genUuid();
                    await insertTutorTime(
                        req.params.id,
                        timeId,
                        tutorTime.datetime,
                        tutorTime.durationHours
                    );
                } catch {
                    errors.push(
                        `Error inserting tutor time: ${tutorTime.datetime.toLocaleDateString()} ${
                            tutorTime.durationHours
                        }`
                    );
                }
            });

            if (errors.length > 0) {
                res.status(201).json({
                    error: `Tutor created with errors: \n${errors.join('\n')}`,
                });
                return;
            }

            const updatedUser = await _getFullTutor(req.params.id);
            if (!updatedUser) {
                res.status(500).json({ error: `Internal Server Error` });
                console.log(
                    `Error retrieving user after update: ${req.params.id}`
                );
                return;
            }
            res.status(200).json(updatedUser);
        }
    )
    .delete(async (req: Request, res: Response, _: NextFunction) => {
        try {
            try {
                await deleteAllTutorTimes(req.params.id);
            } catch {
                res.status(500).json({
                    error: 'Error deleting tutor: Tutor Times Error',
                });
                return;
            }

            try {
                await deleteAllSubjectsForTutor(req.params.id);
            } catch {
                res.status(500).json({
                    error: 'Error deleting tutor: Subjects Error',
                });
                return;
            }

            const tutorResult = await deleteTutor(req.params.id);
            if (!tutorResult) {
                res.status(500).json({ error: 'Error deleting tutor' });
                return;
            }
            res.status(200).json({ id: tutorResult });
        } catch {
            res.status(500).json({ error: `Internal Server Error` });
            return;
        }
    });

// Begin tutor subjects
tutorsRouter
    .route('/:userId/subjects/')
    .all(
        async (
            req: Request,
            res: TypedResponse<string[]>,
            next: NextFunction
        ) => {
            if (!validateUuid(req.params.userId)) {
                res.status(400);
                res.json({ error: 'Invalid User UUID' });
                return;
            }

            next();
        },
        authenticate
    )
    .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await selectSubjectsByTutor(req.params.userId);
            res.status(200).json(result);
        } catch {
            res.status(500).json({
                error: `Error retrieving subjects for tutor ${req.params.userId}`,
            });
        }
    })
    .post(
        async (
            req: TypedRequestBody<{ subjectId: UUID }>,
            res: TypedResponse<TutorSubjectRelation>,
            next: NextFunction
        ) => {
            const subjectId = makeUuid(req.body.subjectId);
            if (!subjectId) {
                res.status(400).json({
                    error: `'${req.body.subjectId}' is not a valid UUID`,
                });
            }

            try {
                if (!(await selectSubjectById(req.body.subjectId))) {
                    res.status(404).json({
                        error: `ID ${req.body.subjectId} not associated with subject`,
                    });
                    return;
                }
            } catch {
                res.status(500).json({ error: `Internal Server Error` });
                return;
            }

            try {
                const result = await insertTutorSubject(
                    req.params.userId,
                    req.body.subjectId
                );
                if (!result) {
                    res.status(500).json({
                        error: `Error adding subject ${req.body.subjectId} to tutor ${req.params.userId}`,
                    });
                    return;
                }
                res.status(201).json(result);
            } catch {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    );

tutorsRouter
    .route('/:userId/subjects/:subjectId')
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.userId)) {
            res.status(400);
            res.json({ error: 'Invalid User UUID' });
            return;
        }

        if (!validateUuid(req.params.subjectId)) {
            res.status(400);
            res.json({ error: 'Invalid Subject UUID' });
            return;
        }
        next();
    }, authenticate)
    .delete(
        async (
            req: Request,
            res: TypedResponse<TutorSubjectRelation>,
            next: NextFunction
        ) => {
            try {
                const result = await deleteTutorSubject(
                    req.params.userId,
                    req.params.subjectId
                );
                if (!result) {
                    res.status(500).json({
                        error: `Error deleting subject ${req.params.subjectId} from tutor ${req.params.userId}`,
                    });
                    return;
                }
                res.status(200).json(result);
            } catch {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    );

tutorsRouter
    .route('/:userId/times')
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.userId)) {
            res.status(400);
            res.json({ error: 'Invalid User UUID' });
            return;
        }

        next();
    }, authenticate)
    .get(
        async (
            req: Request,
            res: TypedResponse<TutorTime[]>,
            next: NextFunction
        ) => {
            try {
                const result = await selectTimesByTutor(req.params.userId);
                res.status(200).json(result);
            } catch {
                res.status(500).json({
                    error: `Error retrieving tutor times for user ${req.params.userId}`,
                });
            }
        }
    )
    .post(
        async (
            req: TypedRequestBody<NewTutorTime>,
            res: TypedResponse<TutorTime>,
            next: NextFunction
        ) => {
            const timeId = genUuid();
            try {
                const result = await insertTutorTime(
                    req.params.userId,
                    timeId,
                    req.body.datetime,
                    req.body.durationHours
                );
                if (!result) {
                    res.status(500).json({
                        error: `Error creating tutor time for user ${req.params.userId}`,
                    });
                    return;
                }

                res.status(201).json(result);
            } catch {
                res.status(500).json({ error: `Internal Server Error` });
            }
        }
    );

tutorsRouter
    .route('/:userId/times/:timeId')
    .all(async (req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.userId)) {
            res.status(400);
            res.json({ error: 'Invalid User UUID' });
            return;
        }

        if (!validateUuid(req.params.timeId)) {
            res.status(400);
            res.json({ error: 'Invalid Tutor Time UUID' });
            return;
        }
        next();
    }, authenticate)
    // QUERY PARAMS:
    // id: id of the time slot
    //
    // Deletes tutor time from database
    .delete(
        async (
            req: TypedRequestBody<TutorDELETEQuery>,
            res: Response,
            _: NextFunction
        ) => {
            try {
                const result = await deleteTutorTime(
                    req.params.userId,
                    req.params.timeId
                );
                if (!result) {
                    res.status(404).json({
                        error: `Error deleting tutor time ${req.params.timeId} from user ${req.params.userId}`,
                    });
                }
                res.status(200).json({
                    tutorId: req.params.userId,
                    timeId: req.params.timeId,
                });
                return;
            } catch (x) {
                console.log(`POST /api/tutor/:id failed to do query ${x}`);
                res.status(500)
                    .json({ error: 'could not execute query' })
                    .end();
            }
        }
    )
    .patch(
        async (
            req: TypedRequestBody<UpdateTutorTime>,
            res: TypedResponse<TutorTime>,
            next: NextFunction
        ) => {
            try {
                const oldTime = await selectTutorTime(req.params.timeId);

                if (!oldTime) {
                    res.status(404).json({
                        error: `Tutor time ${req.params.timeId} not found`,
                    });
                    return;
                }

                const newTime: UpdateTutorTime = {
                    datetime: req.body.datetime ?? oldTime.datetime,
                    durationHours:
                        req.body.durationHours ?? oldTime.durationHours,
                };

                const result = await updateTutorTime(
                    req.params.timeId,
                    newTime
                );

                if (!result) {
                    res.status(500).json({
                        error: `Error updating Tutor Time ${req.params.timeId}`,
                    });
                    return;
                }

                res.status(201).json(result);
            } catch {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    );
