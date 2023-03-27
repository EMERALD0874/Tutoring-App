import { Response, Request } from 'express';
import { Send } from 'express-serve-static-core';

export interface TypedRequestBody<B> extends Request {
    body: B;
}

export interface TypedResponse<ResBody> extends Response {
    json: Send<ResBody | { error: unknown }, this>;
}

export interface Alert {
    message?: string;
    error?: string;
}
