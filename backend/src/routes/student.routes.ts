import { Router } from 'express';
import { z } from 'zod';
import { schoolAuth } from '../middleware/schoolAuth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  completeProfile,
  deleteStudentDocument,
  getStudents,
  uploadStudents,
} from '../controllers/student.controller.js';
import { uploadPaymentProof, getSchoolPayments } from '../controllers/payment.controller.js';
import {
  completeProfileSchema,
  paymentProofSchema,
  schoolIdParam,
  uploadStudentsSchema,
} from '../validation/school.schema.js';
import { slug } from '../validation/common.js';

const router = Router();

// Every route below is scoped to one school; schoolAuth rejects a :schoolId
// that does not match the session token.
router.use('/:schoolId', schoolAuth);

router.get(
  '/:schoolId/students',
  validate({ params: schoolIdParam }),
  asyncHandler(getStudents)
);

router.post(
  '/:schoolId/students',
  validate({ params: schoolIdParam, body: uploadStudentsSchema }),
  asyncHandler(uploadStudents)
);

router.delete(
  '/:schoolId/students/:subjectSlug',
  validate({ params: schoolIdParam.extend({ subjectSlug: slug('Subject') }) }),
  asyncHandler(deleteStudentDocument)
);

router.post(
  '/:schoolId/complete-profile',
  validate({ params: schoolIdParam, body: completeProfileSchema }),
  asyncHandler(completeProfile)
);

router.get(
  '/:schoolId/payment',
  validate({ params: schoolIdParam }),
  asyncHandler(getSchoolPayments)
);

router.post(
  '/:schoolId/payment',
  validate({ params: schoolIdParam, body: paymentProofSchema }),
  asyncHandler(uploadPaymentProof)
);

export default router;
