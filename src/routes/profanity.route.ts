import { Router } from 'express';
import { profanity } from '../controllers/profanity.controller';

const router = Router();

router.post('/check', profanity);

export default router;