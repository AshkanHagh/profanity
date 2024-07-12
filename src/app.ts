import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import checkerRoute from './routes/checker.route';

import { ErrorMiddleware } from './middlewares/error';
import { RouteNowFoundError } from './libs/utils';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : process.env.ORIGIN, methods : ['POST', 'GET'],
    allowedHeaders : ['Authorization', 'Content-Type', 'Access-Control-Allow-Credentials'], credentials : true
}));
app.use(helmet());
app.use(helmet({crossOriginResourcePolicy : {policy : 'cross-origin'}}));

app.get('/', (req : Request, res : Response) => res.status(200).json({success : true, message : 'Welcome'}));

app.use('/api/profanity', checkerRoute);

app.all('*', (req : Request, res : Response, next : NextFunction) => {
    next(new RouteNowFoundError(`Route : ${req.originalUrl} not found`));
});

app.use(ErrorMiddleware);
export default app;