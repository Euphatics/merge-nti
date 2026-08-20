import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ALLOWED_FOLDERS, uploadBuffer, UPLOAD_FOLDERS } from '../config/cloudinary.js';
import type { UploadFolder } from '../config/cloudinary.js';
import { uploadDocument } from '../middleware/upload.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

/**
 * Accepts either a school session cookie or an admin Bearer token.
 * Both audiences upload files, and both tokens are signed with the same secret.
 */
function requireAnyAuth(req: Request, _res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    try {
      jwt.verify(cookieToken, env.JWT_TOKEN);
      next();
      return;
    } catch {
      // Fall through to the Bearer check rather than rejecting outright — an
      // admin may hold a stale school cookie from testing.
    }
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      jwt.verify(authHeader.slice('Bearer '.length).trim(), env.JWT_TOKEN);
      next();
      return;
    } catch {
      /* handled below */
    }
  }

  next(ApiError.unauthorized('Authentication required to upload files.'));
}

/**
 * POST /api/upload
 * Field name: `file`. Optional `?folder=` from the allowlist.
 * Returns the Cloudinary URL and public ID.
 */
router.post(
  '/upload',
  requireAnyAuth,
  uploadDocument.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded. Use the field name "file".');

    const requested = req.query.folder as string | undefined;
    if (requested && !ALLOWED_FOLDERS.includes(requested)) {
      throw ApiError.badRequest(
        `Unknown upload folder "${requested}". Allowed: ${ALLOWED_FOLDERS.join(', ')}.`
      );
    }

    const folder = (requested ?? UPLOAD_FOLDERS.paymentProofs) as UploadFolder;

    // resource_type 'auto' — PDFs are not images, and forcing 'image' here is
    // what previously broke every PDF upload.
    const asset = await uploadBuffer(req.file.buffer, folder);

    res.status(200).json({
      message: 'File uploaded successfully',
      url: asset.url,
      publicId: asset.publicId,
      // Retained for older callers that read `filename`.
      filename: asset.publicId,
      format: asset.format,
      bytes: asset.bytes,
    });
  })
);

export default router;
