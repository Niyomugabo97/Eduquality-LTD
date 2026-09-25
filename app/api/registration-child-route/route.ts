import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      registrationNumber,
      fullName,
      gender,
      dateOfBirth,
      nationalId,
      photo,

      school,
      classLevel,
      educationLevel,

      province,
      district,
      sector,
      cell,
      village,

      parentGuardianName,
      parentGuardianContact,
      parentGuardianEmail,
      parentGuardianAddress,

      caretakerMentor,
      sponsorshipStartDate,
      sponsorshipType,

      orphanStatus,
      livingArrangement,
      specialNeeds,
      healthInformation,

      dateOfRegistration,
      registeredBy,
      notes,
    } = body;

    // Required fields
    if (
      !registrationNumber ||
      !fullName ||
      !gender ||
      !dateOfBirth ||
      !school ||
      !classLevel ||
      !district ||
      !parentGuardianName ||
      !parentGuardianContact ||
      !dateOfRegistration
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Check duplicate registration number
    const existingBeneficiary = await prisma.beneficiary.findUnique({
      where: {
        registrationNumber,
      },
    });

    if (existingBeneficiary) {
      return NextResponse.json(
        {
          success: false,
          message: "A beneficiary with this registration number already exists.",
        },
        { status: 409 }
      );
    }

    // Create beneficiary
    const beneficiary = await prisma.beneficiary.create({
      data: {
        registrationNumber,
        fullName,
        gender,
        dateOfBirth,
        nationalId: nationalId || null,
        photo: photo || null,

        school,
        classLevel,
        educationLevel: educationLevel || null,

        province: province || null,
        district,
        sector: sector || null,
        cell: cell || null,
        village: village || null,

        parentGuardianName,
        parentGuardianContact,
        parentGuardianEmail: parentGuardianEmail || null,
        parentGuardianAddress: parentGuardianAddress || null,

        caretakerMentor: caretakerMentor || null,
        sponsorshipStartDate: sponsorshipStartDate || null,
        sponsorshipType: sponsorshipType || null,

        orphanStatus: orphanStatus || null,
        livingArrangement: livingArrangement || null,
        specialNeeds: specialNeeds || null,
        healthInformation: healthInformation || null,

        dateOfRegistration,
        registeredBy: registeredBy || null,
        notes: notes || null,

        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Beneficiary registered successfully.",
        data: {
          id: beneficiary.id,
          registrationNumber: beneficiary.registrationNumber,
          fullName: beneficiary.fullName,
          status: beneficiary.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Beneficiary registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register beneficiary.",
      },
      { status: 500 }
    );
  }
}