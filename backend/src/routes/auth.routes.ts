import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getRegistrationStatus,
} from '../controllers/auth.controller.js';
import { schoolAuth } from '../middleware/schoolAuth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validation/auth.schema.js';

const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), asyncHandler(register));
authRouter.post('/login', validate({ body: loginSchema }), asyncHandler(login));
authRouter.post('/logout', asyncHandler(logout));
authRouter.get('/me', schoolAuth, asyncHandler(me));
authRouter.post('/verify-email', validate({ body: verifyEmailSchema }), asyncHandler(verifyEmail));
authRouter.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  asyncHandler(forgotPassword)
);
authRouter.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  asyncHandler(resetPassword)
);
authRouter.get('/registration-status', asyncHandler(getRegistrationStatus));

export default authRouter;
