import { z } from 'zod';

const ErrorSchema = z.object({
    statusCode : z.number(),
    message : z.string()
});

export type TErrorHandler = z.infer<typeof ErrorSchema>

const MessageSchema = z.object({
    message : z.string()
});

export type TMessage = z.infer<typeof MessageSchema>

const responseSchema = z.object({
    isProfanity : z.boolean(),
    score : z.number(),
    flaggedFor : z.string().optional()
});

export type TResponse = z.infer<typeof responseSchema>