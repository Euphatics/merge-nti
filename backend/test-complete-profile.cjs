const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const schoolId = 1; // Assuming the newly created school has ID 1

    // First, verify the school exists
    let school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
        // Create dummy school if doesn't exist
        school = await prisma.school.create({
            data: {
                id: 1,
                schoolName: 'Test School',
                email: 'test@school.com',
                username: 'testschool',
                passwordHash: 'hash',
                status: 'APPROVED',
            }
        });
        console.log('Created dummy school');
    }

    const payload = {
        schoolAddress: "Address",
        city: "City",
        state: "State",
        pinCode: "123456",
        country: "India",
        phoneLandline: "",
        phoneMobile: "1234567890",
        website: "",
        affiliationBoard: "CBSE",
        affiliationNo: "123",
        schoolType: "Private",
        yearOfEstablishment: "",
        totalStrength: "",
        principalName: "Principal Name",
        principalDesignation: "",
        principalEmail: "",
        principalMobile: "",
        coordinatorName: "Coordinator Name",
        coordinatorDesignation: "",
        coordinatorEmail: "",
        coordinatorMobile: "1234567890",
        subjects: "Mathematics Olympiad",
        classes: "1-4, 5-7",
        count1to4: "52",
        count5to7: "23",
        count8to10: "2312",
        count11to12: "12",
        totalCount: "2399"
    };

    const {
        schoolAddress, city, state, pinCode, country, phoneLandline, phoneMobile, website, affiliationBoard, affiliationNo, schoolType, yearOfEstablishment, totalStrength,
        principalName, principalDesignation, principalEmail, principalMobile,
        coordinatorName, coordinatorDesignation, coordinatorEmail, coordinatorMobile,
        subjects, classes, count1to4, count5to7, count8to10, count11to12, totalCount
    } = payload;

    await prisma.$transaction(async (tx) => {
      const parsedSchoolId = schoolId;
      await tx.school.update({
        where: { id: parsedSchoolId },
        data: {
          schoolAddress, city, state, pinCode, country, phoneLandline, phoneMobile, website, affiliationBoard, affiliationNo, schoolType,
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
    });
    console.log("SUCCESS!");
  } catch (error) {
    console.error("ERROR!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
