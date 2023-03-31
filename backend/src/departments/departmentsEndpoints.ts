import { NextFunction, request, Request, Response, Router } from 'express';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import {selectDepartments} from './departmentDIs';
import { TypedRequestBody, TypedResponse, Alert } from '../types';


export const departmentsRouter = Router();

departmentsRouter
.route('/')
    .all((req: Request, res: Response, next: NextFunction) => {
        next(); 
    })
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const departmentRows = await selectDepartments();
        return res.json(departmentRows);
    })