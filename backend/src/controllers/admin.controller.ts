import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import prisma from '../config/prisma.js';

// ── Helpers ────────────────────────────────────────────────────

/** Parse an ID param and return it, or send a 400 and return null. */
function parseIdParam(raw: any, res: Response, label = 'ID'): number | null {
  const id = parseInt(raw as string, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: `Invalid ${label}` });
    return null;
  }
  return id;
}

/** Default pagination values */
function parsePagination(query: any): { skip: number; take: number } {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 50));
  return { skip: (page - 1) * limit, take: limit };
}

// ── Controllers ────────────────────────────────────────────────

/**
 * POST /api/admin/login
 * Validates admin credentials (bcrypt hashed) and returns a signed JWT.
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
      console.error('ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set in environment');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    if (username !== adminUsername) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const validPassword = await bcryptjs.compare(password, adminPasswordHash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const token = jwt.sign({ role: 'admin' }, jwtSecret, {
      expiresIn: '24h',
    });

    res.status(200).json({
      message: 'Admin login successful',
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/admin/stats
 * Returns aggregate dashboard statistics.
 */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalSchools = await prisma.school.count();
    const totalStudents = await prisma.student.count();
    const pendingApprovals = await prisma.school.count({ where: { status: 'PENDING' } });
    const verifiedSchools = await prisma.school.count({ where: { status: 'APPROVED' } });
    const pendingPayments = await prisma.payment.count({ where: { status: 'PENDING' } });

    res.status(200).json({
      totalSchools,
      totalStudents,
      pendingApprovals,
      verifiedSchools,
      pendingPayments,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

/**
 * GET /api/admin/schools
 * Lists all schools with coordinator, student count, and payment info.
 * Supports ?search=, ?status=, ?page=, ?limit= query params.
 */
export const getSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const { skip, take } = parsePagination(req.query);

    const where: any = {};

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { schoolName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ];
    }

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        include: {
          coordinator: true,
          _count: {
            select: { students: true, payments: true },
          },
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
      status: s.status,
      isVerified: s.isVerified,
      isListLocked: s.isListLocked,
      createdAt: s.createdAt,
      coordinator: s.coordinator
        ? {
            name: s.coordinator.name,
            designation: s.coordinator.designation,
            country: s.coordinator.country,
            phone: s.coordinator.phone,
          }
        : null,
      studentCount: s._count.students,
      paymentCount: s._count.payments,
    }));

    res.status(200).json({ schools: formatted, total, page: Math.floor(skip / take) + 1, limit: take });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
};

/**
 * GET /api/admin/schools/:id
 * Returns a single school with full detail: coordinator, all students, all payments.
 */
export const getSchoolDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id, res, 'school ID');
    if (id === null) return;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        coordinator: true,
        students: {
          orderBy: [{ subjectSlug: 'asc' }, { srNo: 'asc' }],
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!school) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    res.status(200).json({ school });
  } catch (error) {
    console.error('Error fetching school detail:', error);
    res.status(500).json({ error: 'Failed to fetch school details' });
  }
};

/**
 * PATCH /api/admin/schools/:id/status
 * Approve or reject a school registration.
 * Body: { status: 'APPROVED' | 'REJECTED' }
 */
export const updateSchoolStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id, res, 'school ID');
    if (id === null) return;

    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
      return;
    }

    const school = await prisma.school.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      message: `School ${status.toLowerCase()} successfully`,
      school: {
        id: school.id,
        schoolName: school.schoolName,
        status: school.status,
      },
    });
  } catch (error) {
    console.error('Error updating school status:', error);
    res.status(500).json({ error: 'Failed to update school status' });
  }
};

/**
 * DELETE /api/admin/schools/:id
 * Deletes a school and all related data (cascade).
 */
export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id, res, 'school ID');
    if (id === null) return;

    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    await prisma.school.delete({
      where: { id },
    });

    res.status(200).json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ error: 'Failed to delete school' });
  }
};

/**
 * GET /api/admin/students
 * Lists all students across all schools. Supports ?search=, ?subjectSlug=, ?page=, ?limit=
 */
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const subjectSlug = req.query.subjectSlug as string | undefined;
    const { skip, take } = parsePagination(req.query);

    const where: any = {};

    if (subjectSlug) {
      where.subjectSlug = subjectSlug;
    }

    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { fatherName: { contains: search } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          school: {
            select: { schoolName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.student.count({ where }),
    ]);

    res.status(200).json({ students, total, page: Math.floor(skip / take) + 1, limit: take });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

/**
 * GET /api/admin/payments
 * Lists all payments with school info. Supports ?page=, ?limit=
 */
export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skip, take } = parsePagination(req.query);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          school: {
            select: { schoolName: true, email: true, schoolAddress: true, isListLocked: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.payment.count(),
    ]);

    res.status(200).json({ payments, total, page: Math.floor(skip / take) + 1, limit: take });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

/**
 * POST /api/admin/payments/:paymentId/verify
 * Verify or reject a payment. Locks the school student list on verification.
 * Body: { status: 'VERIFIED' | 'REJECTED', adminNotes?: string }
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = parseIdParam(req.params.paymentId, res, 'payment ID');
    if (paymentId === null) return;

    const { status, adminNotes } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be VERIFIED or REJECTED.' });
      return;
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        adminNotes,
      },
    });

    if (status === 'VERIFIED') {
      await prisma.school.update({
        where: { id: payment.schoolId },
        data: { isListLocked: true },
      });
    }

    res.status(200).json({
      message: `Payment ${status.toLowerCase()} successfully`,
      payment,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

/**
 * GET /api/results
 * Public endpoint to fetch all results
 */
export const getResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skip, take } = parsePagination(req.query);
    const [results, total] = await Promise.all([
      prisma.result.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.result.count()
    ]);
    res.status(200).json({ results, total, page: Math.floor(skip / take) + 1, limit: take });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

/**
 * POST /api/admin/results
 * Add a new result (admin protected)
 */
export const addResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectSlug, classSlug, year, resultUrl } = req.body;
    
    if (!subjectSlug || !classSlug || !year || !resultUrl) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const parsedYear = parseInt(year as string, 10);
    if (isNaN(parsedYear)) {
      res.status(400).json({ error: 'Invalid year' });
      return;
    }

    const result = await prisma.result.create({
      data: {
        subjectSlug,
        classSlug,
        year: parsedYear,
        resultUrl,
      },
    });
    
    res.status(201).json({ message: 'Result added successfully', result });
  } catch (error) {
    console.error('Error adding result:', error);
    res.status(500).json({ error: 'Failed to add result' });
  }
};

/**
 * DELETE /api/admin/results/:id
 * Delete a result (admin protected)
 */
export const deleteResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id, res, 'result ID');
    if (id === null) return;

    await prisma.result.delete({ where: { id } });
    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
};

/**
 * GET /api/admin/registration-window
 * Returns the current registration window config (single row, id=1).
 */
export const getRegistrationWindow = async (_req: Request, res: Response): Promise<void> => {
  try {
    const window = await prisma.registrationWindow.findFirst({
      orderBy: { id: 'desc' },
    });
    res.status(200).json({ window: window || null });
  } catch (error) {
    console.error('Error fetching registration window:', error);
    res.status(500).json({ error: 'Failed to fetch registration window' });
  }
};

/**
 * PUT /api/admin/registration-window
 * Creates or updates the registration window.
 * Body: { startDate: string (ISO), endDate: string (ISO) }
 */
export const upsertRegistrationWindow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Both startDate and endDate are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    if (start >= end) {
      res.status(400).json({ error: 'Start date must be before end date' });
      return;
    }

    // Upsert: find existing record, update if exists, create otherwise
    const existing = await prisma.registrationWindow.findFirst({
      orderBy: { id: 'desc' },
    });

    let window;
    if (existing) {
      window = await prisma.registrationWindow.update({
        where: { id: existing.id },
        data: { startDate: start, endDate: end },
      });
    } else {
      window = await prisma.registrationWindow.create({
        data: { startDate: start, endDate: end },
      });
    }

    res.status(200).json({ message: 'Registration window updated successfully', window });
  } catch (error) {
    console.error('Error updating registration window:', error);
    res.status(500).json({ error: 'Failed to update registration window' });
  }
};

