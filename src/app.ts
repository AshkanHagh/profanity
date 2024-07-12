import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.get('/', (req : Request, res : Response) => res.status(200).json({success : true, message : 'Welcome'}));

export default app;