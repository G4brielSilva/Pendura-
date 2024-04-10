/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';

export class Logger {
    public static async log(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = Date.now();
        next();
        res.on('finish', () => {
            const { statusCode } = res;
            const elapsedTime = Date.now() - start;
            console.log(`${req.method} ${req.path} - ${statusCode} ${elapsedTime}ms`);
        });
    }
}
