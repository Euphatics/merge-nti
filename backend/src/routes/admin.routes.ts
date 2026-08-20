import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { adminAuth } from '../middleware/adminAuth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  adminLogin,
  getStats,
  getSchools,
  getSchoolDetail,
  updateSchoolStatus,
  deleteSchool,
  getAllStudents,
  getPayments,
  verifyPayment,
  addResult,
  deleteResult,
  getRegistrationWindow,
  upsertRegistrationWindow,
} from '../controllers/admin.controller.js';
import { uploadGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller.js';
import { addPyq, deletePyq } from '../controllers/pyq.controller.js';
import { idParam, paginationQuery } from '../validation/common.js';
import {
  addResultSchema,
  adminLoginSchema,
  galleryImageSchema,
  pyqSchema,
  registrationWindowSchema,
  schoolsQuery,
  studentsQuery,
  updateSchoolStatusSchema,
  verifyPaymentSchema,
} from '../validation/admin.schema.js';

const adminRouter = Router();

/** Admin login is the highest-value credential in the system — limit it tightly. */
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

adminRouter.post(
  '/login',
  adminLoginLimiter,
  validate({ body: adminLoginSchema }),
  asyncHandler(adminLogin)
);

// Everything below requires a valid admin Bearer token.
adminRouter.use(adminAuth);

adminRouter.get('/stats', asyncHandler(getStats));

adminRouter.get('/schools', validate({ query: schoolsQuery }), asyncHandler(getSchools));
adminRouter.get('/schools/:id', validate({ params: idParam('id') }), asyncHandler(getSchoolDetail));
adminRouter.patch(
  '/schools/:id/status',
  validate({ params: idParam('id'), body: updateSchoolStatusSchema }),
  asyncHandler(updateSchoolStatus)
);
adminRouter.delete('/schools/:id', validate({ params: idParam('id') }), asyncHandler(deleteSchool));

adminRouter.get('/students', validate({ query: studentsQuery }), asyncHandler(getAllStudents));

adminRouter.get('/payments', validate({ query: paginationQuery }), asyncHandler(getPayments));
adminRouter.post(
  '/payments/:paymentId/verify',
  validate({ params: idParam('paymentId'), body: verifyPaymentSchema }),
  asyncHandler(verifyPayment)
);

adminRouter.post('/results', validate({ body: addResultSchema }), asyncHandler(addResult));
adminRouter.delete('/results/:id', validate({ params: idParam('id') }), asyncHandler(deleteResult));

adminRouter.post('/pyqs', validate({ body: pyqSchema }), asyncHandler(addPyq));
adminRouter.delete('/pyqs/:id', validate({ params: idParam('id') }), asyncHandler(deletePyq));

adminRouter.get('/registration-window', asyncHandler(getRegistrationWindow));
adminRouter.put(
  '/registration-window',
  validate({ body: registrationWindowSchema }),
  asyncHandler(upsertRegistrationWindow)
);

adminRouter.post(
  '/gallery',
  uploadImage.single('file'),
  validate({ body: galleryImageSchema }),
  asyncHandler(uploadGalleryImage)
);
adminRouter.delete(
  '/gallery/:id',
  validate({ params: idParam('id') }),
  asyncHandler(deleteGalleryImage)
);

export default adminRouter;
