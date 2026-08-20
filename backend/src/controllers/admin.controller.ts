import type { Request, Response } from 'express';
import type { Prisma, RegistrationStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { validatedQuery } from '../middleware/validate.middleware.js';
import { toSkipTake } from '../validation/common.js';
import type { Pagination } from '../validation/common.js';

const ADMIN_SESSION_EXPIRES_IN = '12h';

/** Wraps a page of rows in the shape the admin tables expect. */
function paginated<T>(rows: T[], total: number, page: number, limit: number, key: string) {
  return { [key]: rows, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

/**
 * POST /api/admin/login
 * Compares against ADMIN_USERNAME / ADMIN_PASSWORD_HASH and returns a Bearer token.
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const usernameMatches = username === env.ADMIN_USERNAME;
  // Always run the hash comparison so a wrong username is not faster than a
  // wrong password.
  const passwordMatches = await bcryptjs.compare(password, env.ADMIN_PASSWORD_HASH);

  if (!usernameMatches || !passwordMatches) {
    throw ApiError.unauthorized('Invalid admin credentials');
  }

  const token = jwt.sign({ role: 'admin' }, env.JWT_TOKEN, {
    expiresIn: ADMIN_SESSION_EXPIRES_IN,
  });

  res.status(200).json({ message: 'Admin login successful', token });
};

/** GET /api/admin/stats */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  // One round trip instead of five sequential ones.
  const [totalSchools, totalStudents, pendingApprovals, verifiedSchools, pendingPayments] =
    await prisma.$transaction([
      prisma.school.count(),
      prisma.student.count(),
      prisma.school.count({ where: { status: 'PENDING' } }),
      prisma.school.count({ where: { status: 'APPROVED' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
    ]);

  res.status(200).json({
    totalSchools,
    totalStudents,
    pendingApprovals,
    verifiedSchools,
    pendingPayments,
  });
};

/** GET /api/admin/schools — supports ?search= &status= &page= &limit= */
export const getSchools = async (req: Request, res: Response): Promise<void> => {
  const query = validatedQuery<Pagination & { search?: string; status?: string }>(req);
  const { skip, take, page, limit } = toSkipTake(query);

  const where: Prisma.SchoolWhereInput = {};
  if (query.status) where.status = query.status as RegistrationStatus;
  if (query.search) {
    where.OR = [
      { schoolName: { contains: query.search } },
      { email: { contains: query.search } },
      { username: { contains: query.search } },
    ];
  }

  const [schools, total] = await prisma.$transaction([
    prisma.school.findMany({
      where,
      include: {
        coordinator: true,
        _count: { select: { students: true, payments: true, studentDocuments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.school.count({ where }),
  ]);

  const formatted = schools.map((s) => ({
    id: s.id,
    schoolName: s.schoolName,
    email: s.email,
    username: s.username,
    schoolAddress: s.schoolAddress,
    city: s.city,
    state: s.state,
    status: s.status,
    isVerified: s.isVerified,
    isListLocked: s.isListLocked,
    isProfileComplete: s.isProfileComplete,
    createdAt: s.createdAt,
    coordinator: s.coordinator
      ? {
          name: s.coordinator.name,
          designation: s.coordinator.designation,
          country: s.coordinator.country,
          phone: s.coordinator.phone,
          email: s.coordinator.email,
        }
      : null,
    studentCount: s._count.students,
    paymentCount: s._count.payments,
    documentCount: s._count.studentDocuments,
  }));

  res.status(200).json(paginated(formatted, total, page, limit, 'schools'));
};

/** GET /api/admin/schools/:id */
export const getSchoolDetail = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const school = await prisma.school.findUnique({
    where: { id },
    include: {
      coordinator: true,
      principal: true,
      participation: true,
      studentDocuments: { orderBy: { subjectSlug: 'asc' } },
      students: { orderBy: [{ subjectSlug: 'asc' }, { srNo: 'asc' }] },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!school) throw ApiError.notFound('School not found');

  // The hash must never leave the server, even to an authenticated admin.
  const { passwordHash: _hash, verifyToken: _vt, forgotPasswordToken: _ft, ...safe } = school;

  res.status(200).json({ school: safe });
};

/** PATCH /api/admin/schools/:id/status */
export const updateSchoolStatus = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const school = await prisma.school.update({ where: { id }, data: { status } });

  res.status(200).json({
    message: `School ${status.toLowerCase()} successfully`,
    school: { id: school.id, schoolName: school.schoolName, status: school.status },
  });
};

/** DELETE /api/admin/schools/:id — cascades to students, payments and documents. */
export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const school = await prisma.school.findUnique({ where: { id }, select: { id: true } });
  if (!school) throw ApiError.notFound('School not found');

  await prisma.school.delete({ where: { id } });

  res.status(200).json({ message: 'School deleted successfully' });
};

/** GET /api/admin/students — supports ?search= &subjectSlug= &page= &limit= */
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  const query = validatedQuery<Pagination & { search?: string; subjectSlug?: string }>(req);
  const { skip, take, page, limit } = toSkipTake(query);

  const where: Prisma.StudentWhereInput = {};
  if (query.subjectSlug) where.subjectSlug = query.subjectSlug;
  if (query.search) {
    where.OR = [
      { studentName: { contains: query.search } },
      { fatherName: { contains: query.search } },
    ];
  }

  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      include: { school: { select: { schoolName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.student.count({ where }),
  ]);

  res.status(200).json(paginated(students, total, page, limit, 'students'));
};

/** GET /api/admin/payments */
export const getPayments = async (req: Request, res: Response): Promise<void> => {
  const query = validatedQuery<Pagination>(req);
  const { skip, take, page, limit } = toSkipTake(query);

  const [payments, total] = await prisma.$transaction([
    prisma.payment.findMany({
      include: {
        school: {
          select: { id: true, schoolName: true, email: true, schoolAddress: true, isListLocked: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.payment.count(),
  ]);

  res.status(200).json(paginated(payments, total, page, limit, 'payments'));
};

/**
 * POST /api/admin/payments/:paymentId/verify
 * Verifying a payment also locks the school's student list.
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  const paymentId = Number(req.params.paymentId);
  const { status, adminNotes } = req.body;

  const existing = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { id: true, schoolId: true },
  });
  if (!existing) throw ApiError.notFound('Payment not found');

  // The status change and the list lock must land together — a verified payment
  // with an unlocked list would let a school edit what the admin just approved.
  const [payment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status, adminNotes: adminNotes ?? null },
    }),
    prisma.school.update({
      where: { id: existing.schoolId },
      data: { isListLocked: status === 'VERIFIED' },
    }),
  ]);

  res.status(200).json({ message: `Payment ${status.toLowerCase()} successfully`, payment });
};

/** GET /api/results — public. Supports ?subjectSlug= &classSlug= &year= */
export const getResults = async (req: Request, res: Response): Promise<void> => {
  const query = validatedQuery<
    Pagination & { subjectSlug?: string; classSlug?: string; year?: number }
  >(req);
  const { skip, take, page, limit } = toSkipTake(query);

  const where: Prisma.ResultWhereInput = {};
  if (query.subjectSlug) where.subjectSlug = query.subjectSlug;
  if (query.classSlug) where.classSlug = query.classSlug;
  if (query.year) where.year = query.year;

  const [results, total] = await prisma.$transaction([
    prisma.result.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.result.count({ where }),
  ]);

  res.status(200).json(paginated(results, total, page, limit, 'results'));
};

/** POST /api/admin/results */
export const addResult = async (req: Request, res: Response): Promise<void> => {
  const result = await prisma.result.create({ data: req.body });
  res.status(201).json({ message: 'Result added successfully', result });
};

/** DELETE /api/admin/results/:id */
export const deleteResult = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const existing = await prisma.result.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw ApiError.notFound('Result not found');

  await prisma.result.delete({ where: { id } });
  res.status(200).json({ message: 'Result deleted successfully' });
};

/** GET /api/admin/registration-window */
export const getRegistrationWindow = async (_req: Request, res: Response): Promise<void> => {
  const window = await prisma.registrationWindow.findFirst({ orderBy: { id: 'desc' } });
  res.status(200).json({ window: window ?? null });
};

/** PUT /api/admin/registration-window — creates the row on first use. */
export const upsertRegistrationWindow = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.body;

  const existing = await prisma.registrationWindow.findFirst({ orderBy: { id: 'desc' } });

  const window = existing
    ? await prisma.registrationWindow.update({
        where: { id: existing.id },
        data: { startDate, endDate },
      })
    : await prisma.registrationWindow.create({ data: { startDate, endDate } });

  res.status(200).json({ message: 'Registration window updated successfully', window });
};
