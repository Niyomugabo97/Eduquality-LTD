import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      exitId,
      foundationRepresentativeName,
      foundationRepresentativePosition,
      witnessName,
      witnessPositionRelationship,
      propertyVerifiedBy,
    } = body;

    // --------------------------------------------------
    // 1. Validate Exit ID
    // --------------------------------------------------
    if (!exitId) {
      return NextResponse.json(
        {
          success: false,
          message: "Exit ID is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 2. Validate required Foundation representative data
    // --------------------------------------------------
    if (!foundationRepresentativeName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Foundation representative name is required.",
        },
        { status: 400 }
      );
    }

    if (!foundationRepresentativePosition?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Foundation representative position is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. Find the beneficiary exit
    // --------------------------------------------------
    const exit = await prisma.beneficiaryExit.findUnique({
      where: {
        id: exitId,
      },
    });

    if (!exit) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiary exit form not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 4. Prevent finalizing an already finalized form
    // --------------------------------------------------
    if (exit.status === "FINALIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "This beneficiary exit form has already been finalized.",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // 5. Guardian email must be verified
    // --------------------------------------------------
    if (!exit.guardianEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Guardian email has not been verified. Please verify the guardian email before finalizing the exit form.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. Update and finalize the exit
    // --------------------------------------------------
    const finalizedExit = await prisma.beneficiaryExit.update({
      where: {
        id: exitId,
      },

      data: {
        foundationRepresentativeName:
          foundationRepresentativeName.trim(),

        foundationRepresentativePosition:
          foundationRepresentativePosition.trim(),

        witnessName: witnessName?.trim() || null,

        witnessPositionRelationship:
          witnessPositionRelationship?.trim() || null,

        propertyVerifiedBy:
          propertyVerifiedBy?.trim() || null,

        propertyVerifiedAt: propertyVerifiedBy?.trim()
          ? new Date()
          : null,

        foundationApprovedAt: new Date(),

        status: "FINALIZED",
      },
    });

    // --------------------------------------------------
    // 7. Return successful response
    // --------------------------------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Beneficiary exit form finalized successfully.",
        data: {
          id: finalizedExit.id,
          status: finalizedExit.status,
          beneficiaryFullName: finalizedExit.beneficiaryFullName,
          beneficiaryRegistrationNumber:
            finalizedExit.beneficiaryRegistrationNumber,
          guardianEmailVerified:
            finalizedExit.guardianEmailVerified,
          foundationRepresentativeName:
            finalizedExit.foundationRepresentativeName,
          foundationRepresentativePosition:
            finalizedExit.foundationRepresentativePosition,
          witnessName: finalizedExit.witnessName,
          witnessPositionRelationship:
            finalizedExit.witnessPositionRelationship,
          propertyVerifiedBy: finalizedExit.propertyVerifiedBy,
          propertyVerifiedAt: finalizedExit.propertyVerifiedAt,
          foundationApprovedAt:
            finalizedExit.foundationApprovedAt,
          updatedAt: finalizedExit.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Finalize beneficiary exit error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while finalizing the beneficiary exit.",
      },
      { status: 500 }
    );
  }
}