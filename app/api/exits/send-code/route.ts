import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash, randomInt } from "crypto";
import { Resend } from "resend";

function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

async function hashOtp(otp: string): Promise<string> {
  return createHash("sha256").update(otp).digest("hex");
}

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    const { exitId } =
      await request.json();

    if (!exitId) {
      return NextResponse.json(
        {
          success: false,
          message: "Exit ID is required.",
        },
        { status: 400 }
      );
    }

    const exit =
      await prisma.beneficiaryExit.findUnique({
        where: {
          id: exitId,
        },
      });

    if (!exit) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Beneficiary exit record not found.",
        },
        { status: 404 }
      );
    }

    const otp = generateOtp();

    const hashedOtp =
      await hashOtp(otp);

    const expiresAt = new Date(
      Date.now() +
        10 * 60 * 1000
    );

    await prisma.beneficiaryExit.update({
      where: {
        id: exitId,
      },
      data: {
        guardianVerificationCode:
          hashedOtp,

        guardianVerificationExpiresAt:
          expiresAt,

        guardianVerificationAttempts: 0,

        status:
          "PENDING_GUARDIAN_VERIFICATION",
      },
    });

    const fromEmail =
      process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error(
        "RESEND_FROM_EMAIL is not configured."
      );
    }

    const result =
      await resend.emails.send({
        from: fromEmail,

        to: exit.parentGuardianEmail,

        subject:
          "NIBEZA Foundation - Verification Code",

        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>NIBEZA Foundation</h2>

            <p>
              A beneficiary exit record requires
              parent/guardian email verification.
            </p>

            <p>
              Your verification code is:
            </p>

            <h1 style="letter-spacing: 6px;">
              ${otp}
            </h1>

            <p>
              This code expires in
              <strong>10 minutes</strong>.
            </p>

            <p>
              If you did not expect this email,
              please contact NIBEZA Foundation.
            </p>
          </div>
        `,
      });

    if (result.error) {
      console.error(
        "RESEND ERROR:",
        result.error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Verification email could not be sent.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Verification code sent successfully.",
    });
  } catch (error) {
    console.error(
      "SEND CODE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send verification code.",
      },
      { status: 500 }
    );
  }
}