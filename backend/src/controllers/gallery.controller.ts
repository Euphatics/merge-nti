import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { destroyAsset, uploadBuffer, UPLOAD_FOLDERS } from '../config/cloudinary.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * GET /api/gallery
 * Public. Returns absolute image URLs.
 *
 * Rows created before the Cloudinary migration hold a relative path such as
 * `/uploads/gallery/123.jpg`. Those files no longer exist, so they are filtered
 * out rather than rendered as broken images.
 */
export const getGalleryImages = async (_req: Request, res: Response): Promise<void> => {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });

  const usable = images.filter((img) => /^https?:\/\//i.test(img.image));

  if (usable.length !== images.length) {
    logger.warn(
      { skipped: images.length - usable.length },
      'Gallery rows still reference local-disk paths from before the Cloudinary migration'
    );
  }

  res.status(200).json(
    usable.map((img) => ({
      id: img.id,
      image: img.image,
      name: img.name,
      school: img.school,
      className: img.className,
      createdAt: img.createdAt,
    }))
  );
};

/**
 * POST /api/admin/gallery
 * Accepts a single image in the `file` field plus name/school/className.
 */
export const uploadGalleryImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) throw ApiError.badRequest('No image file uploaded. Use the field name "file".');

  const { name, school, className } = req.body;

  const asset = await uploadBuffer(req.file.buffer, UPLOAD_FOLDERS.gallery, {
    resourceType: 'image',
  });

  const image = await prisma.galleryImage.create({
    data: { image: asset.url, publicId: asset.publicId, name, school, className },
  });

  res.status(201).json({ message: 'Gallery image uploaded successfully', data: image });
};

/** DELETE /api/admin/gallery/:id */
export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) throw ApiError.notFound('Image not found');

  await prisma.galleryImage.delete({ where: { id } });

  // Best-effort asset cleanup — the row is already deleted, so a Cloudinary
  // hiccup must not surface as a failed delete.
  if (image.publicId) {
    destroyAsset(image.publicId).catch((err) =>
      logger.warn({ err, publicId: image.publicId }, 'Failed to remove gallery asset from Cloudinary')
    );
  }

  res.status(200).json({ message: 'Gallery image deleted successfully' });
};
