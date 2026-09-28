"use server";

import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/app/actions/auth";

export async function getFoundationRecords() {
  await requireAdminAuth();

  try {
    const [beneficiaries, exits] = await Promise.all([
      prisma.beneficiary.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.beneficiaryExit.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          beneficiaryFullName: true,
          beneficiaryRegistrationNumber: true,
          gender: true,
          dateOfBirth: true,
          school: true,
          classLevel: true,
          district: true,
          parentGuardianName: true,
          parentGuardianContact: true,
          parentGuardianEmail: true,
          caretakerMentor: true,
          dateOfExit: true,
          exitReasons: true,
          otherExitReason: true,
          dismissalReasons: true,
          otherDismissalReason: true,
          previousDisciplinaryActions: true,
          disciplinaryDatesOutcomes: true,
          committeeDecision: true,
          committeeReason: true,
          beneficiaryDeclarationName: true,
          guardianEmailVerified: true,
          guardianVerifiedAt: true,
          foundationRepresentativeName: true,
          foundationRepresentativePosition: true,
          foundationApprovedAt: true,
          witnessName: true,
          witnessPositionRelationship: true,
          propertyIdentityCard: true,
          propertyFoundationUniform: true,
          propertyBooksMaterials: true,
          propertyElectronicDevices: true,
          propertyOther: true,
          propertyVerifiedBy: true,
          propertyVerifiedAt: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { success: true, data: { beneficiaries, exits } };
  } catch (error) {
    console.error("Failed to fetch Foundation records:", error);
    return { success: false, message: "Failed to fetch Foundation records." };
  }
}