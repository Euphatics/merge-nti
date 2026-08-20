import type { Request, Response } from 'express';
import type { Prisma, PyqType } from '@prisma/client';
import prisma from '../config/prisma.js';
import { destroyAsset } from '../config/cloudinary.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { validatedQuery } from '../middleware/validate.middleware.js';
import { toSkipTake } from '../validation/common.js';
import type { Pagination } from '../validation/common.js';

/**
 * The admin UI and the public pages exchange papers as human-readable labels
 * ("Question Paper"), while the column is an enum. These two maps are the only
 * place that translation happens.
 */
const LABEL_TO_ENUM: Record<string, PyqType> = {
  'Question Paper': 'QUESTION_PAPER',
  'Answer Key': 'ANSWER_KEY',
  Solution: 'SOLUTION',
};

const ENUM_TO_LABEL: Record<PyqType, string> = {
  QUESTION_PAPER: 'Question Paper',
  ANSWER_KEY: 'Answer Key',
  SOLUTION: 'Solution',
};

function toApi(pyq: {
  id: number;
  subjectSlug: string;
  classSlug: string;
  year: number;
  type: PyqType;
  paperUrl: string;
  createdAt: Date;
}) {
  return {
    id: pyq.id,
    subjectSlug: pyq.subjectSlug,
    classSlug: pyq.classSlug,
    year: pyq.year,
    type: ENUM_TO_LABEL[pyq.type],
    paperUrl: pyq.paperUrl,
    createdAt: pyq.createdAt,
  };
}

/**
 * GET /api/pyqs
 * Public. Supports ?subjectSlug= &classSlug= &year= &page= &limit=
 */
export const getPyqs = async (req: Request, res: Response): Promise<void> => {
  const query = validatedQuery<
    Pagination & { subjectSlug?: string; classSlug?: string; year?: number }
  >(req);
  const { skip, take, page, limit } = toSkipTake(query);

  const where: Prisma.PyqWhereInput = {};
  if (query.subjectSlug) where.subjectSlug = query.subjectSlug;
  if (query.classSlug) where.classSlug = query.classSlug;
  if (query.year) where.year = query.year;

  const [pyqs, total] = await prisma.$transaction([
    prisma.pyq.findMany({
      where,
      orderBy: [{ year: 'desc' }, { subjectSlug: 'asc' }, { classSlug: 'asc' }],
      skip,
      take,
    }),
    prisma.pyq.count({ where }),
  ]);

  res.status(200).json({
    pyqs: pyqs.map(toApi),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
};

/**
 * POST /api/admin/pyqs
 * Re-uploading the same subject/class/year/type replaces the existing row
 * rather than creating a duplicate the public page would render twice.
 */
export const addPyq = async (req: Request, res: Response): Promise<void> => {
  const { subjectSlug, classSlug, year, type, paperUrl, publicId } = req.body;
  const typeEnum = LABEL_TO_ENUM[type as string];

  if (!typeEnum) throw ApiError.badRequest(`Unknown paper type "${type}"`);

  const pyq = await prisma.pyq.upsert({
    where: {
      subjectSlug_classSlug_year_type: { subjectSlug, classSlug, year, type: typeEnum },
    },
    update: { paperUrl, publicId: publicId ?? null },
    create: { subjectSlug, classSlug, year, type: typeEnum, paperUrl, publicId: publicId ?? null },
  });

  res.status(201).json({ message: 'Paper saved successfully', pyq: toApi(pyq) });
};

/** DELETE /api/admin/pyqs/:id */
export const deletePyq = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const pyq = await prisma.pyq.findUnique({ where: { id } });
  if (!pyq) throw ApiError.notFound('Paper not found');

  await prisma.pyq.delete({ where: { id } });

  // The row is already gone; a failed asset cleanup should not fail the request.
  if (pyq.publicId) {
    destroyAsset(pyq.publicId).catch((err) =>
      logger.warn({ err, publicId: pyq.publicId }, 'Failed to remove PYQ asset from Cloudinary')
    );
  }

  res.status(200).json({ message: 'Paper deleted successfully' });
};
