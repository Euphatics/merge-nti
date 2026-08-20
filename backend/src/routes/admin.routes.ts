import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.middleware.js';
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
  upsertRegistrationWindow
} from '../controllers/admin.controller.js';
import { uploadGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const adminRouter = Router();

// Public — no auth needed
adminRouter.post('/login', adminLogin);

// Protected — require admin JWT
adminRouter.get('/stats', adminAuth, getStats);
adminRouter.get('/schools', adminAuth, getSchools);
adminRouter.get('/schools/:id', adminAuth, getSchoolDetail);
adminRouter.patch('/schools/:id/status', adminAuth, updateSchoolStatus);
adminRouter.delete('/schools/:id', adminAuth, deleteSchool);
adminRouter.get('/students', adminAuth, getAllStudents);
adminRouter.get('/payments', adminAuth, getPayments);
adminRouter.post('/payments/:paymentId/verify', adminAuth, verifyPayment);
adminRouter.post('/results', adminAuth, addResult);
adminRouter.delete('/results/:id', adminAuth, deleteResult);
adminRouter.get('/registration-window', adminAuth, getRegistrationWindow);
adminRouter.put('/registration-window', adminAuth, upsertRegistrationWindow);
adminRouter.post('/gallery', adminAuth, upload.single('file'), uploadGalleryImage);
adminRouter.delete('/gallery/:id', adminAuth, deleteGalleryImage);

export default adminRouter;
