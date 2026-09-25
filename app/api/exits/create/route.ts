import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      exitId,

      beneficiaryFullName,
      beneficiaryRegistrationNumber,
      gender,
      dateOfBirth,
      school,
      classLevel,
      district,

      parentGuardianName,
      parentGuardianContact,
      parentGuardianEmail,
      caretakerMentor,

      dateOfExit,
      exitReasons,
      otherExitReason,

      dismissalReasons,
      otherDismissalReason,

      previousDisciplinaryActions,
      disciplinaryDatesOutcomes,

      committeeDecision,
      committeeReason,

      beneficiaryDeclarationName,

      propertyIdentityCard,
      propertyFoundationUniform,
      propertyBooksMaterials,
      propertyElectronicDevices,
      propertyOther,

      propertyVerifiedBy,

      foundationRepresentativeName,
      foundationRepresentativePosition,

      witnessName,
      witnessPositionRelationship,
    } = body;

    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------

    if (!beneficiaryFullName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiary full name is required.",
        },
        { status: 400 }
      );
    }

    if (!beneficiaryRegistrationNumber?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Beneficiary registration number is required.",
        },
        { status: 400 }
      );
    }

    if (!parentGuardianName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Parent/Guardian name is required.",
        },
        { status: 400 }
      );
    }

    if (!parentGuardianEmail?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Parent/Guardian email is required.",
        },
        { status: 400 }
      );
    }

    const email = parentGuardianEmail
      .trim()
      .toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid Parent/Guardian email.",
        },
        { status: 400 }
      );
    }

    if (!["Male", "Female"].includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gender.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // PREPARE DATA
    // --------------------------------------------------

    const data = {
      beneficiaryFullName:
        beneficiaryFullName.trim(),

      beneficiaryRegistrationNumber:
        beneficiaryRegistrationNumber.trim(),

      gender,

      dateOfBirth:
        dateOfBirth?.trim() || "",

      school:
        school?.trim() || "",

      classLevel:
        classLevel?.trim() || "",

      district:
        district?.trim() || "",

      parentGuardianName:
        parentGuardianName.trim(),

      parentGuardianContact:
        parentGuardianContact?.trim() || "",

      parentGuardianEmail:
        email,

      caretakerMentor:
        caretakerMentor?.trim() || "",

      dateOfExit:
        dateOfExit?.trim() || "",

      exitReasons:
        Array.isArray(exitReasons)
          ? exitReasons
          : [],

      otherExitReason:
        otherExitReason?.trim() || null,

      dismissalReasons:
        Array.isArray(dismissalReasons)
          ? dismissalReasons
          : [],

      otherDismissalReason:
        otherDismissalReason?.trim() || null,

      previousDisciplinaryActions:
        Array.isArray(
          previousDisciplinaryActions
        )
          ? previousDisciplinaryActions
          : [],

      disciplinaryDatesOutcomes:
        disciplinaryDatesOutcomes?.trim() ||
        null,

      committeeDecision:
        committeeDecision?.trim() || null,

      committeeReason:
        committeeReason?.trim() || null,

      beneficiaryDeclarationName:
        beneficiaryDeclarationName?.trim() ||
        null,

      propertyIdentityCard:
        Boolean(propertyIdentityCard),

      propertyFoundationUniform:
        Boolean(propertyFoundationUniform),

      propertyBooksMaterials:
        Boolean(propertyBooksMaterials),

      propertyElectronicDevices:
        Boolean(propertyElectronicDevices),

      propertyOther:
        propertyOther?.trim() || null,

      propertyVerifiedBy:
        propertyVerifiedBy?.trim() || null,

      foundationRepresentativeName:
        foundationRepresentativeName?.trim() ||
        null,

      foundationRepresentativePosition:
        foundationRepresentativePosition?.trim() ||
        null,

      witnessName:
        witnessName?.trim() || null,

      witnessPositionRelationship:
        witnessPositionRelationship?.trim() ||
        null,
    };

    // ==================================================
    // UPDATE EXISTING EXIT
    // ==================================================

    if (exitId) {
      const existingExit =
        await prisma.beneficiaryExit.findUnique({
          where: {
            id: exitId,
          },
        });

      if (!existingExit) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Beneficiary exit form not found.",
          },
          { status: 404 }
        );
      }

      if (existingExit.status === "FINALIZED") {
        return NextResponse.json(
          {
            success: false,
            message:
              "This beneficiary exit has already been finalized and cannot be edited.",
          },
          { status: 409 }
        );
      }

      const emailChanged =
        existingExit.parentGuardianEmail !==
        email;

      const updatedExit =
        await prisma.beneficiaryExit.update({
          where: {
            id: exitId,
          },

          data: {
            ...data,

            ...(emailChanged
              ? {
                  guardianVerificationCode:
                    null,

                  guardianVerificationExpiresAt:
                    null,

                  guardianVerificationAttempts:
                    0,

                  guardianEmailVerified:
                    false,

                  guardianVerifiedAt:
                    null,

                  status: "DRAFT",
                }
              : {}),
          },
        });

      return NextResponse.json(
        {
          success: true,
          message:
            "Beneficiary exit form updated successfully.",

          data: {
            id: updatedExit.id,
            status: updatedExit.status,
            guardianEmailVerified:
              updatedExit.guardianEmailVerified,
          },
        },
        { status: 200 }
      );
    }

    // ==================================================
    // CREATE NEW EXIT
    // ==================================================

    const newExit =
      await prisma.beneficiaryExit.create({
        data: {
          ...data,

          status: "DRAFT",

          guardianEmailVerified: false,

          guardianVerificationAttempts: 0,
        },
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Beneficiary exit form created successfully.",

        data: {
          id: newExit.id,
          status: newExit.status,
          guardianEmailVerified:
            newExit.guardianEmailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create/update beneficiary exit error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while saving the beneficiary exit form.",
      },
      { status: 500 }
    );
  }
}