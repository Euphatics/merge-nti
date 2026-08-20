import { z } from 'zod';
import { optionalInt, optionalString, requiredString, slug, urlString } from './common.js';

export const schoolIdParam = z.object({
  schoolId: z.coerce.number({ message: 'Invalid school ID' }).int().positive('Invalid school ID'),
});

/**
 * The "complete profile" wizard payload.
 *
 * Every bound here mirrors the corresponding column width in schema.prisma, so
 * an over-long value is a 400 with a named field rather than a 500 from MySQL.
 */
export const completeProfileSchema = z.object({
  schoolAddress: optionalString(2000, 'School address'),
  city: optionalString(100, 'City'),
  state: optionalString(100, 'State'),
  pinCode: optionalString(20, 'PIN code'),
  country: optionalString(100, 'Country'),
  phoneLandline: optionalString(50, 'Landline'),
  phoneMobile: optionalString(50, 'Mobile number'),
  website: optionalString(255, 'Website'),
  affiliationBoard: optionalString(100, 'Affiliation board'),
  affiliationNo: optionalString(100, 'Affiliation number'),
  schoolType: optionalString(100, 'School type'),
  yearOfEstablishment: optionalInt('Year of establishment'),
  totalStrength: optionalInt('Total strength'),

  principalName: optionalString(255, 'Principal name'),
  principalDesignation: optionalString(100, 'Principal designation'),
  principalEmail: optionalString(255, 'Principal email'),
  principalMobile: optionalString(50, 'Principal mobile'),

  coordinatorName: optionalString(255, 'Coordinator name'),
  coordinatorDesignation: optionalString(100, 'Coordinator designation'),
  coordinatorEmail: optionalString(255, 'Coordinator email'),
  coordinatorMobile: optionalString(50, 'Coordinator mobile'),

  subjects: optionalString(500, 'Subjects'),
  classes: optionalString(255, 'Classes'),
  count1to4: optionalInt('Class 1–4 count'),
  count5to7: optionalInt('Class 5–7 count'),
  count8to10: optionalInt('Class 8–10 count'),
  count11to12: optionalInt('Class 11–12 count'),
  totalCount: optionalInt('Total count'),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

export const uploadStudentsSchema = z.object({
  subjectSlug: slug('Subject'),
  documentUrl: urlString('Document URL'),
  fileName: requiredString(255, 'File name'),
  studentCount: z.coerce
    .number({ message: 'Student count must be a number' })
    .int('Student count must be a whole number')
    .min(1, 'Student count must be at least 1')
    .max(10000, 'Student count looks too large'),
});

export const paymentProofSchema = z.object({
  paymentProofUrl: urlString('Payment proof URL'),
  amount: z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((v) => {
      if (v === null || v === undefined || v === '') return null;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : NaN;
    })
    .refine((v) => v === null || (!Number.isNaN(v) && v >= 0), 'Amount must be a positive number'),
});
