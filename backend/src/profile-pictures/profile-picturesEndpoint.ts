import { NextFunction, Request, Response, Router } from 'express';
import { v4 as genUuid } from 'uuid';
import {
    createProfilePicture,
    selectProfilePicture,
    deleteProfilePicture,
} from './profile-picturesDIs';
import { ProfilePicture } from './profile-pictures';
import { validate as validateUuid } from 'uuid';
import { authenticate } from '../auth/authCommon';
import multer from 'multer';
import { filter } from 'lodash';

export const profilePictureRouter = Router();
// Memory storage is used because we are saving to the database, not the file system
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (request, file, callback) => {
        if (
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png'
        ) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
});

profilePictureRouter
    .route('/:id')
    .all((req: Request, res: Response, next: NextFunction) => {
        if (!validateUuid(req.params.id)) {
            res.status(400);
            res.json({ error: 'Invalid UUID' });
            return;
        }
        next();
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const profile_picture = await selectProfilePicture(req.params.id);
        if (profile_picture === undefined) {
            res.status(404);
            return res.json({
                error:
                    'Could not find profile_picture with id=' + req.params.id,
            });
        }
        res.set('Content-Type', profile_picture.file_type);
        res.status(200);
        return res.end(profile_picture.profile_picture);
    })
    .post(
        authenticate,
        upload.single('file'), // 'file' is the field name that will be used in the HTML upload button.
        async (req: Request, res: Response, next: NextFunction) => {
            const image = req.file;
            if (!image || !image.buffer) {
                res.status(404);
                return res.json({ error: 'Could not read image file' });
            }

            // Delete old profile picture
            const oldPfp = await selectProfilePicture(req.params.id);
            if (oldPfp !== undefined) {
                const deleteOldPfp = await deleteProfilePicture(
                    oldPfp as ProfilePicture
                );
                if (deleteOldPfp === undefined) {
                    res.status(400);
                    return res.json({
                        error: 'Database error removing old profile picture',
                    });
                }
            }

            // Insert new profile picture
            const file_type = req.file?.mimetype;
            if (file_type === undefined) {
                res.status(404);
                return res.json({ error: 'Error reading file mimetype' });
            }
            const pfp: ProfilePicture = {
                id: genUuid(),
                user_id: req.params.id,
                profile_picture: req.file?.buffer as Buffer,
                file_type: file_type,
            };
            const insert = await createProfilePicture(pfp);
            if (!insert) {
                res.status(404);
                return res.json({ error: 'Database error inserting picture' });
            }
            res.status(201);
            return res.json({ id: pfp.id, user_id: pfp.user_id });
        }
    );
