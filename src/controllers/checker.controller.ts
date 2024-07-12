import type { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncError';
import type { TMessage, TResponse } from '../types/index.type';
import { profanityCheckerService } from '../services/checker.service';

export const profanityChecker = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { message } = req.body as TMessage;
        const flaggedFor : TResponse = await profanityCheckerService(message);

        res.status(200).json({success : true, flaggedFor});
        
    } catch (error : unknown) {
        return next(error);
    }
})