import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import profanityRoute from './routes/profanity.route';

import { RouteNowFoundError } from './libs/utils';
import { ErrorMiddleware } from './middlewares/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(helmet());
app.use(helmet({crossOriginResourcePolicy : {policy : 'cross-origin'}}));

app.get('/api', (req : Request, res : Response) => res.status(200).json({success : true, message : 'Welcome'}));

app.use('/api/profanity', profanityRoute);

app.all('*', (req : Request, res : Response, next : NextFunction) => {
    next(new RouteNowFoundError(`Route : ${req.originalUrl} not found`));
});

app.use(ErrorMiddleware);
export default app;