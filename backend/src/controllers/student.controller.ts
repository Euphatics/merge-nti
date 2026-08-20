import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import type { CompleteProfileInput } from '../validation/school.schema.js';

/**
 * POST /api/schools/:schoolId/students
 * Records the uploaded student-list document for one subject.
 */
export const uploadStudents = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);
  const { subjectSlug, documentUrl, fileName, studentCount } = req.body;

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { id: true, isListLocked: true },
  });

  if (!school) throw ApiError.notFound('School not found');
  if (school.isListLocked) {
    throw ApiError.forbidden(
      'Your student list is locked because payment has been verified. Contact the admin to make changes.'
    );
  }

  const document = await prisma.studentDocument.upsert({
    where: { schoolId_subjectSlug: { schoolId, subjectSlug } },
    update: { documentUrl, fileName, studentCount },
    create: { schoolId, subjectSlug, documentUrl, fileName, studentCount },
  });

  res.status(200).json({ message: 'Document uploaded successfully', document });
};

/**
 * DELETE /api/schools/:schoolId/students/:subjectSlug
 * Removes a subject's uploaded list. Previously the frontend dropped it from
 * local state only, so it reappeared on the next page load.
 */
export const deleteStudentDocument = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);
  const { subjectSlug } = req.params as { subjectSlug: string };

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { id: true, isListLocked: true },
  });

  if (!school) throw ApiError.notFound('School not found');
  if (school.isListLocked) {
    throw ApiError.forbidden(
      'Your student list is locked because payment has been verified. Contact the admin to make changes.'
    );
  }

  const existing = await prisma.studentDocument.findUnique({
    where: { schoolId_subjectSlug: { schoolId, subjectSlug } },
    select: { id: true },
  });
  if (!existing) throw ApiError.notFound('No document uploaded for that subject');

  await prisma.studentDocument.delete({ where: { id: existing.id } });

  res.status(200).json({ message: 'Document removed successfully' });
};

/**
 * GET /api/schools/:schoolId/students
 * Everything the school panel needs on load: documents, lock state, latest
 * payment status and the profile header.
 */
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);

  const [documents, school, latestPayment] = await prisma.$transaction([
    prisma.studentDocument.findMany({
      where: { schoolId },
      orderBy: { subjectSlug: 'asc' },
    }),
    prisma.school.findUnique({ where: { id: schoolId }, include: { coordinator: true } }),
    prisma.payment.findFirst({ where: { schoolId }, orderBy: { createdAt: 'desc' } }),
  ]);

  if (!school) throw ApiError.notFound('School not found');

  res.status(200).json({
    documents,
    isListLocked: school.isListLocked,
    paymentStatus: latestPayment?.status.toLowerCase() ?? 'none',
    paymentNotes: latestPayment?.adminNotes ?? null,
    schoolProfile: {
      schoolName: school.schoolName,
      schoolCode: `NTI-${school.id}`,
      schoolAddress: school.schoolAddress ?? '—',
      inchargeTeacher: school.coordinator?.name ?? '—',
      inchargeContact: school.coordinator?.phone ?? '—',
      status: school.status,
      createdAt: school.createdAt,
    },
  });
};

/**
 * POST /api/schools/:schoolId/complete-profile
 * Writes the school, principal, coordinator and participation rows in one
 * transaction so a partial save can never leave a half-completed profile.
 */
export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);
  const input = req.body as CompleteProfileInput;

  const existing = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
  if (!existing) throw ApiError.notFound('School not found');

  await prisma.$transaction(
    async (tx) => {
      await tx.school.update({
        where: { id: schoolId },
        data: {
          schoolAddress: input.schoolAddress,
          city: input.city,
          state: input.state,
          pinCode: input.pinCode,
          country: input.country,
          phoneLandline: input.phoneLandline,
          phoneMobile: input.phoneMobile,
          website: input.website,
          affiliationBoard: input.affiliationBoard,
          affiliationNo: input.affiliationNo,
          schoolType: input.schoolType,
          yearOfEstablishment: input.yearOfEstablishment,
          totalStrength: input.totalStrength,
          isProfileComplete: true,
        },
      });

      if (input.principalName) {
        const principal = {
          name: input.principalName,
          designation: input.principalDesignation ?? 'Principal',
          email: input.principalEmail,
          phone: input.principalMobile ?? '',
        };
        await tx.principal.upsert({
          where: { schoolId },
          update: principal,
          create: { schoolId, ...principal },
        });
      }

      if (input.coordinatorName) {
        const coordinator = {
          name: input.coordinatorName,
          designation: input.coordinatorDesignation ?? 'Coordinator',
          email: input.coordinatorEmail,
          country: input.country ?? 'India',
          phone: input.coordinatorMobile ?? '',
        };
        await tx.coordinator.upsert({
          where: { schoolId },
          update: coordinator,
          create: { schoolId, ...coordinator },
        });
      }

      if (input.subjects || input.classes) {
        const participation = {
          subjects: input.subjects ?? '',
          classes: input.classes ?? '',
          count1to4: input.count1to4,
          count5to7: input.count5to7,
          count8to10: input.count8to10,
          count11to12: input.count11to12,
          totalCount: input.totalCount,
        };
        await tx.participationDetail.upsert({
          where: { schoolId },
          update: participation,
          create: { schoolId, ...participation },
        });
      }
    },
    { maxWait: 5000, timeout: 20000 }
  );

  res.status(200).json({ message: 'Profile completed successfully' });
};
