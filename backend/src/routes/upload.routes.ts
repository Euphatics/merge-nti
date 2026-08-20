import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

const router = Router();

// Allowed Cloudinary folder paths (whitelist)
const ALLOWED_FOLDERS = [
  'olympiad/payment-proofs',
  'olympiad/results',
];

// Use memory storage — file stays in RAM, we stream it to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) and PDFs are allowed'));
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max
  },
});

/**
 * Simple auth check: accepts either a school JWT cookie or an admin Bearer token.
 * This allows both school users and admins to upload files.
 */
function requireAnyAuth(req: Request, res: Response, next: Function): void {
  const jwtSecret = process.env.JWT_TOKEN;
  if (!jwtSecret) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Check school cookie
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    try {
      (jwt.verify as any)(cookieToken, jwtSecret);
      return next();
    } catch { /* fall through to Bearer check */ }
  }

  // Check admin Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      (jwt.verify as any)(authHeader.split(' ')[1], jwtSecret);
      return next();
    } catch { /* fall through */ }
  }

  res.status(401).json({ error: 'Authentication required' });
}

/**
 * POST /api/upload
 * Accepts a single file with field name "file".
 * Uploads it to Cloudinary and returns the secure URL.
 * Optional query param: ?folder=olympiad/results (defaults to olympiad/payment-proofs)
 */
router.post('/upload', requireAnyAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    const requestedFolder = (req.query.folder as string) || 'olympiad/payment-proofs';
    const folder = ALLOWED_FOLDERS.includes(requestedFolder)
      ? requestedFolder
      : 'olympiad/payment-proofs';

    // Upload buffer to Cloudinary via a stream
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      filename: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Failed to upload file to cloud storage' });
  }
});

export default router;
