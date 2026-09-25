import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

async function hashOtp(otp: string): Promise<string> {
  return createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { exitId, otp } = await request.json();

    if (!exitId || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Exit ID and OTP are required.",
        },
        { status: 400 }
      );
    }

    const exit = await prisma.beneficiaryExit.findUnique({
      where: {
        id: exitId,
      },
    });

    if (!exit) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiary exit record not found.",
        },
        { status: 404 }
      );
    }

    // Check if verification code has expired
    if (exit.guardianVerificationExpiresAt && new Date() > exit.guardianVerificationExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Check if too many attempts
    if (exit.guardianVerificationAttempts && exit.guardianVerificationAttempts >= 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many verification attempts. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Verify the OTP
    const hashedOtp = await hashOtp(otp);
    
    if (hashedOtp !== exit.guardianVerificationCode) {
      // Increment attempt counter
      await prisma.beneficiaryExit.update({
        where: {
          id: exitId,
        },
        data: {
          guardianVerificationAttempts: (exit.guardianVerificationAttempts || 0) + 1,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    // Verification successful - update status
    await prisma.beneficiaryExit.update({
      where: {
        id: exitId,
      },
      data: {
        status: "GUARDIAN_VERIFIED",
        guardianVerificationCode: null,
        guardianVerificationExpiresAt: null,
        guardianVerificationAttempts: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification successful.",
    });
  } catch (error) {
    console.error("VERIFY CODE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify code.",
      },
      { status: 500 }
    );
  }
}
