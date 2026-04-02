import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;
    const adminId = cookieStore.get("session_token")?.value;

    const currentUserId = userId || adminId;

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Try to find as regular user first
    let user: any = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // If not found, try as admin
    if (!user) {
      const admin = await prisma.admin.findUnique({
        where: { id: currentUserId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      
      if (admin) {
        user = { ...admin, isAdmin: true };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
