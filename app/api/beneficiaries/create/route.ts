import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const requiredFields = [
  "registrationNumber",
  "fullName",
  "dateOfBirth",
  "school",
  "classLevel",
  "district",
  "parentGuardianName",
  "parentGuardianContact",
  "dateOfRegistration",
] as const;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(
      Array.from(formData.entries()).filter(([, value]) => typeof value === "string")
    ) as Record<string, string>;

    for (const field of requiredFields) {
      if (!values[field]?.trim()) {
        return NextResponse.json(
          { success: false, message: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    if (!["Male", "Female"].includes(values.gender)) {
      return NextResponse.json(
        { success: false, message: "Please select a valid gender." },
        { status: 400 }
      );
    }

    const photo = formData.get("photo");
    if (!(photo instanceof File) || photo.size === 0 || !photo.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "A valid beneficiary photo is required." },
        { status: 400 }
      );
    }

    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Photo size must not exceed 5MB." },
        { status: 400 }
      );
    }

    const photoUrl = await uploadImageToCloudinary(photo);
    const beneficiary = await prisma.beneficiary.create({
      data: {
        registrationNumber: values.registrationNumber.trim(),
        fullName: values.fullName.trim(),
        gender: values.gender as "Male" | "Female",
        dateOfBirth: values.dateOfBirth.trim(),
        nationalId: values.nationalId?.trim() || null,
        photo: photoUrl,
        school: values.school.trim(),
        classLevel: values.classLevel.trim(),
        educationLevel: values.educationLevel?.trim() || null,
        province: values.province?.trim() || null,
        district: values.district.trim(),
        sector: values.sector?.trim() || null,
        cell: values.cell?.trim() || null,
        village: values.village?.trim() || null,
        parentGuardianName: values.parentGuardianName.trim(),
        parentGuardianContact: values.parentGuardianContact.trim(),
        parentGuardianEmail: values.parentGuardianEmail?.trim() || null,
        parentGuardianAddress: values.parentGuardianAddress?.trim() || null,
        caretakerMentor: values.caretakerMentor?.trim() || null,
        sponsorshipStartDate: values.sponsorshipStartDate?.trim() || null,
        sponsorshipType: values.sponsorshipType?.trim() || null,
        orphanStatus: values.orphanStatus?.trim() || null,
        livingArrangement: values.livingArrangement?.trim() || null,
        specialNeeds: values.specialNeeds?.trim() || null,
        healthInformation: values.healthInformation?.trim() || null,
        dateOfRegistration: values.dateOfRegistration.trim(),
        registeredBy: values.registeredBy?.trim() || null,
        notes: values.notes?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Beneficiary registered successfully.",
        data: { id: beneficiary.id, registrationNumber: beneficiary.registrationNumber },
      },
      { status: 201 }
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This registration number is already in use." },
        { status: 409 }
      );
    }

    console.error("Beneficiary registration error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to save the beneficiary registration." },
      { status: 500 }
    );
  }
}