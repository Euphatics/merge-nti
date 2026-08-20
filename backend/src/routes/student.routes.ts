import { Router } from 'express';
import { schoolAuth } from '../middleware/schoolAuth.middleware.js';
import { uploadStudents, getStudents, completeProfile } from '../controllers/student.controller.js';

const router = Router();

router.post('/:schoolId/students', schoolAuth, uploadStudents);
router.get('/:schoolId/students', schoolAuth, getStudents);
router.post('/:schoolId/complete-profile', schoolAuth, completeProfile);

export default router;
