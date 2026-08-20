import { z } from 'zod';
import { boundedString, examYear, paginationQuery, requiredString, slug, urlString } from './common.js';

export const adminLoginSchema = z.object({
  username: requiredString(100, 'Username'),
  password: z.string().min(1, 'Password is required').max(128),
});

export const schoolsQuery = paginationQuery.extend({
  search: boundedString(150, 'Search').optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const studentsQuery = paginationQuery.extend({
  search: boundedString(150, 'Search').optional(),
  subjectSlug: slug('Subject').optional(),
});

export const updateSchoolStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], { message: 'Status must be APPROVED or REJECTED' }),
});

export const verifyPaymentSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED'], { message: 'Status must be VERIFIED or REJECTED' }),
  adminNotes: boundedString(2000, 'Admin notes').optional(),
});

export const addResultSchema = z.object({
  subjectSlug: slug('Subject'),
  classSlug: slug('Class'),
  year: examYear,
  resultUrl: urlString('Result URL'),
});

export const registrationWindowSchema = z
  .object({
    startDate: z.coerce.date({ message: 'Invalid start date' }),
    endDate: z.coerce.date({ message: 'Invalid end date' }),
  })
  .refine((v) => v.startDate < v.endDate, {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

export const galleryImageSchema = z.object({
  name: requiredString(255, 'Name'),
  school: requiredString(255, 'School'),
  className: requiredString(100, 'Class'),
});

export const pyqSchema = z.object({
  subjectSlug: slug('Subject'),
  classSlug: slug('Class'),
  year: examYear,
  type: z.enum(['Question Paper', 'Answer Key', 'Solution'], {
    message: 'Type must be Question Paper, Answer Key or Solution',
  }),
  paperUrl: urlString('Paper URL'),
  // Returned by POST /api/upload; retained so deleting the row also removes the file.
  publicId: boundedString(255, 'Public ID').optional(),
});

export const pyqQuery = paginationQuery.extend({
  subjectSlug: slug('Subject').optional(),
  classSlug: slug('Class').optional(),
  year: examYear.optional(),
});

export const resultsQuery = paginationQuery.extend({
  subjectSlug: slug('Subject').optional(),
  classSlug: slug('Class').optional(),
  year: examYear.optional(),
});
