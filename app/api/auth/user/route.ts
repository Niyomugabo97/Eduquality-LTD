import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Get user from database using session token
    // In a real app, you'd validate the session token properly
    // For now, we'll return a mock user ID for testing
    const mockUserId = "test-user-id-12345";

    return NextResponse.json({
      success: true,
      data: { id: mockUserId }
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
