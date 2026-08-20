import { Router } from 'express';
import { schoolAuth } from '../middleware/schoolAuth.middleware.js';
import { uploadPaymentProof } from '../controllers/payment.controller.js';

const router = Router();

// School route for payment proof upload (requires auth)
router.post('/schools/:schoolId/payment', schoolAuth, uploadPaymentProof);

export default router;
