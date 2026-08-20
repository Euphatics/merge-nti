import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const uploadStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const { subjectSlug, documentUrl, fileName, studentCount } = req.body;

    if (!subjectSlug || !documentUrl || !fileName || !studentCount) {
      res.status(400).json({ error: 'Missing subjectSlug, documentUrl, fileName, or studentCount' });
      return;
    }

    const school = await prisma.school.findUnique({
      where: { id: parseInt(schoolId as string) }
    });

    if (!school) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    if (school.isListLocked) {
      res.status(403).json({ error: 'Student list is locked for this school. Cannot modify.' });
      return;
    }

    // Upsert the document for the given school and subject
    await prisma.studentDocument.upsert({
      where: {
        schoolId_subjectSlug: {
          schoolId: parseInt(schoolId as string),
          subjectSlug
        }
      },
      update: {
        documentUrl,
        fileName,
        studentCount: parseInt(studentCount as string)
      },
      create: {
        schoolId: parseInt(schoolId as string),
        subjectSlug,
        documentUrl,
        fileName,
        studentCount: parseInt(studentCount as string)
      }
    });

    res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to save document record' });
  }
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const documents = await prisma.studentDocument.findMany({
      where: { schoolId: parseInt(schoolId as string) },
      orderBy: { subjectSlug: 'asc' }
    });
    
    const school = await prisma.school.findUnique({
      where: { id: parseInt(schoolId as string) },
      include: { coordinator: true }
    });

    const latestPayment = await prisma.payment.findFirst({
      where: { schoolId: parseInt(schoolId as string) },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ 
      documents,
      isListLocked: school?.isListLocked || false,
      paymentStatus: latestPayment?.status.toLowerCase() || 'none',
      schoolProfile: {
        schoolName: school?.schoolName || '—',
        schoolCode: school?.id ? `NTI-${school.id}` : '—',
        schoolAddress: school?.schoolAddress || '—',
        inchargeTeacher: school?.coordinator?.name || '—',
        inchargeContact: school?.coordinator?.phone || '—',
        createdAt: school?.createdAt,
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const {
      schoolAddress,
      city,
      state,
      pinCode,
      country,
      phoneLandline,
      phoneMobile,
      website,
      affiliationBoard,
      affiliationNo,
      schoolType,
      yearOfEstablishment,
      totalStrength,

      principalName,
      principalDesignation,
      principalEmail,
      principalMobile,

      coordinatorName,
      coordinatorDesignation,
      coordinatorEmail,
      coordinatorMobile,

      subjects,
      classes,
      count1to4,
      count5to7,
      count8to10,
      count11to12,
      totalCount,
    } = req.body;

    const parsedSchoolId = parseInt(schoolId as string);
    if (isNaN(parsedSchoolId)) {
      res.status(400).json({ error: 'Invalid school ID' });
      return;
    }

    // Verify school exists before attempting update
    const existingSchool = await prisma.school.findUnique({
      where: { id: parsedSchoolId },
      select: { id: true },
    });
    if (!existingSchool) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.school.update({
        where: { id: parsedSchoolId },
        data: {
          schoolAddress,
          city,
          state,
          pinCode,
          country,
          phoneLandline,
          phoneMobile,
          website,
          affiliationBoard,
          affiliationNo,
          schoolType,
          yearOfEstablishment: yearOfEstablishment ? parseInt(yearOfEstablishment) : null,
          totalStrength: totalStrength ? parseInt(totalStrength) : null,
          isProfileComplete: true,
        }
      });

      if (principalName) {
        await tx.principal.upsert({
          where: { schoolId: parsedSchoolId },
          update: {
            name: principalName,
            designation: principalDesignation || 'Principal',
            email: principalEmail || null,
            phone: principalMobile || '',
          },
          create: {
            schoolId: parsedSchoolId,
            name: principalName,
            designation: principalDesignation || 'Principal',
            email: principalEmail || null,
            phone: principalMobile || '',
          }
        });
      }

      if (coordinatorName) {
        await tx.coordinator.upsert({
          where: { schoolId: parsedSchoolId },
          update: {
            name: coordinatorName,
            designation: coordinatorDesignation || 'Coordinator',
            email: coordinatorEmail || null,
            country: country || 'India',
            phone: coordinatorMobile || '',
          },
          create: {
            schoolId: parsedSchoolId,
            name: coordinatorName,
            designation: coordinatorDesignation || 'Coordinator',
            email: coordinatorEmail || null,
            country: country || 'India',
            phone: coordinatorMobile || '',
          }
        });
      }

      if (subjects || classes) {
        await tx.participationDetail.upsert({
          where: { schoolId: parsedSchoolId },
          update: {
            subjects: subjects || '',
            classes: classes || '',
            count1to4: count1to4 ? parseInt(count1to4) : null,
            count5to7: count5to7 ? parseInt(count5to7) : null,
            count8to10: count8to10 ? parseInt(count8to10) : null,
            count11to12: count11to12 ? parseInt(count11to12) : null,
            totalCount: totalCount ? parseInt(totalCount) : null,
          },
          create: {
            schoolId: parsedSchoolId,
            subjects: subjects || '',
            classes: classes || '',
            count1to4: count1to4 ? parseInt(count1to4) : null,
            count5to7: count5to7 ? parseInt(count5to7) : null,
            count8to10: count8to10 ? parseInt(count8to10) : null,
            count11to12: count11to12 ? parseInt(count11to12) : null,
            totalCount: totalCount ? parseInt(totalCount) : null,
          }
        });
      }
    }, {
      maxWait: 5000, // default is 2000
      timeout: 20000 // default is 5000, increased to 20 seconds
    });

    res.status(200).json({ message: 'Profile completed successfully' });
  } catch (error: any) {
    console.error('Error completing profile:', error);
    const message = error?.message || 'Failed to complete profile';
    res.status(500).json({ error: message });
  }
};
