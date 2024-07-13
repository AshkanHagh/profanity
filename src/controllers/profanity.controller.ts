import type { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncError';
import { profanityService } from '../services/profanity.service';
import type { TProfanityCheck } from '../types/index.type';

export const profanity = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { message } = req.body as {message : string};
        const profanityCheck : TProfanityCheck = await profanityService(message);
        res.status(200).json({success : true, ...profanityCheck});
        
    } catch (error) {
        return next(error);
    }
});