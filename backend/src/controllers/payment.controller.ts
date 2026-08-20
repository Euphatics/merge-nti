import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const uploadPaymentProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const { paymentProofUrl, amount } = req.body;

    if (!paymentProofUrl) {
      res.status(400).json({ error: 'Missing payment proof URL' });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        schoolId: parseInt(schoolId as string),
        paymentProofUrl,
        amount: amount ? parseFloat(amount) : null,
        status: 'PENDING'
      }
    });

    res.status(200).json({ message: 'Payment proof uploaded successfully', payment });
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ error: 'Failed to upload payment proof' });
  }
};

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        school: {
          select: { schoolName: true, email: true, schoolAddress: true, isListLocked: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { status, adminNotes } = req.body; // 'VERIFIED' or 'REJECTED'

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be VERIFIED or REJECTED.' });
      return;
    }

    const payment = await prisma.payment.update({
      where: { id: parseInt(paymentId as string) },
      data: {
        status,
        adminNotes
      }
    });

    if (status === 'VERIFIED') {
      await prisma.school.update({
        where: { id: payment.schoolId },
        data: { isListLocked: true }
      });
    }

    res.status(200).json({ message: `Payment ${status.toLowerCase()} successfully`, payment });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
