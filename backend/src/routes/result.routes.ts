import { Router } from 'express';
import { getResults } from '../controllers/admin.controller.js';

const router = Router();

// Public route to fetch results
router.get('/results', getResults);

export default router;
