import { z } from 'zod';

/** A positive integer route parameter, e.g. /schools/:id. */
export const idParam = (name: string) =>
  z.object({
    [name]: z.coerce.number({ message: `Invalid ${name}` }).int().positive(`Invalid ${name}`),
  });

/** Standard page/limit pagination, capped so a client cannot request the whole table. */
export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type Pagination = z.infer<typeof paginationQuery>;

/** Converts validated pagination into Prisma's skip/take. */
export function toSkipTake({ page, limit }: Pagination) {
  return { skip: (page - 1) * limit, take: limit, page, limit };
}

/** A trimmed, length-bounded string. Prevents oversized values reaching VARCHAR columns. */
export const boundedString = (max: number, label = 'Value') =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`);

/** Same, but required and non-empty after trimming. */
export const requiredString = (max: number, label = 'Value') =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be at most ${max} characters`);

/** An optional field that treats '' and null as "not provided". */
export const optionalString = (max: number, label = 'Value') =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => {
      const trimmed = typeof v === 'string' ? v.trim() : '';
      return trimmed === '' ? null : trimmed;
    })
    .refine((v) => v === null || v.length <= max, `${label} must be at most ${max} characters`);

/** An optional integer that accepts '' / null / undefined as null. */
export const optionalInt = (label = 'Value') =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((v) => {
      if (v === null || v === undefined || v === '') return null;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : NaN;
    })
    .refine((v) => v === null || !Number.isNaN(v), `${label} must be a number`);

/** An https/http URL, bounded to the VARCHAR(1000) columns that store them. */
export const urlString = (label = 'URL') =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(1000, `${label} is too long`)
    .refine((v) => /^https?:\/\//i.test(v), `${label} must start with http:// or https://`);

/** Subject and class identifiers used across syllabus, results and PYQ records. */
export const slug = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(100, `${label} is too long`)
    .regex(/^[a-z0-9-]+$/i, `${label} may only contain letters, numbers and hyphens`);

/** An exam year, bounded to a sane range so typos are caught at the edge. */
export const examYear = z.coerce
  .number({ message: 'Year must be a number' })
  .int('Year must be a whole number')
  .min(2000, 'Year must be 2000 or later')
  .max(2100, 'Year must be 2100 or earlier');
