import { Router } from 'express';
import { profanityChecker } from '../controllers/checker.controller';

const router = Router();

router.post('/', profanityChecker);

export default router;