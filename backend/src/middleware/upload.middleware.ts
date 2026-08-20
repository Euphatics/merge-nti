import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Document types schools actually submit.
 *
 * Student lists are prepared in Excel or Word; the previous filter accepted
 * only images and PDFs, so every spreadsheet upload was rejected by the server
 * even though the panel's file picker offered them.
 */
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/csv',
];

type FileFilter = NonNullable<multer.Options['fileFilter']>;

function fileFilter(allowed: string[], label: string): FileFilter {
  return (_req, file, cb) => {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(ApiError.badRequest(`Unsupported file type "${file.mimetype}". Allowed: ${label}.`));
  };
}

/** Accepts images and documents — payment proofs, student lists, results, PYQs. */
export const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: fileFilter(
    [...IMAGE_TYPES, ...DOCUMENT_TYPES],
    'JPEG, PNG, WebP, GIF, PDF, Word, Excel, CSV'
  ),
});

/** Accepts images only — gallery photos. */
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: fileFilter(IMAGE_TYPES, 'JPEG, PNG, WebP, GIF'),
});
