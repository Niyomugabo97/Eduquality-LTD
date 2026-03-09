import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Registration ID is required" },
        { status: 400 }
      );
    }

    const deletedRegistration = await prisma.registration.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
      data: deletedRegistration
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
