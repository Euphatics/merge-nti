import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Cloudinary folders the app is allowed to write to. */
export const UPLOAD_FOLDERS = {
  paymentProofs: 'olympiad/payment-proofs',
  studentLists: 'olympiad/student-lists',
  results: 'olympiad/results',
  pyqs: 'olympiad/pyqs',
  gallery: 'olympiad/gallery',
} as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[keyof typeof UPLOAD_FOLDERS];

export const ALLOWED_FOLDERS: readonly string[] = Object.values(UPLOAD_FOLDERS);

export interface UploadedAsset {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Streams a buffer to Cloudinary and returns the stored asset.
 *
 * `resource_type: 'auto'` matters: the previous hardcoded `'image'` silently
 * broke every PDF upload, even though the mime filter accepted PDFs.
 */
export function uploadBuffer(
  buffer: Buffer,
  folder: UploadFolder,
  options: { resourceType?: 'auto' | 'image' | 'raw' } = {}
): Promise<UploadedAsset> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: options.resourceType ?? 'auto' },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary returned no result'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Removes an asset. Failures are reported to the caller but are not fatal —
 * an orphaned Cloudinary file is a smaller problem than a delete that appears
 * to fail while the database row is already gone.
 */
export async function destroyAsset(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(async () => {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  });
}

export default cloudinary;
