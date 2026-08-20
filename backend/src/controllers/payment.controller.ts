import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * POST /api/schools/:schoolId/payment
 * Records a payment proof for admin review.
 *
 * Admin-side listing and verification live in admin.controller.ts — this file
 * previously carried unrouted duplicates of both.
 */
export const uploadPaymentProof = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);
  const { paymentProofUrl, amount } = req.body;

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { id: true },
  });
  if (!school) throw ApiError.notFound('School not found');

  // A school with a submission already awaiting review should not be able to
  // queue up several proofs for the same registration.
  const pending = await prisma.payment.findFirst({
    where: { schoolId, status: 'PENDING' },
    select: { id: true },
  });
  if (pending) {
    throw ApiError.conflict(
      'You already have a payment proof awaiting review. Please wait for the admin to verify it.'
    );
  }

  const payment = await prisma.payment.create({
    data: { schoolId, paymentProofUrl, amount, status: 'PENDING' },
  });

  res.status(201).json({ message: 'Payment proof uploaded successfully', payment });
};

/**
 * GET /api/schools/:schoolId/payment
 * The school's own payment history.
 */
export const getSchoolPayments = async (req: Request, res: Response): Promise<void> => {
  const schoolId = Number(req.params.schoolId);

  const payments = await prisma.payment.findMany({
    where: { schoolId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      status: true,
      adminNotes: true,
      paymentProofUrl: true,
      createdAt: true,
    },
  });

  res.status(200).json({ payments });
};
