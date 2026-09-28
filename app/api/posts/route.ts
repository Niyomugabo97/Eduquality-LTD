import { NextResponse } from "next/server";
import { buildActivityFromInput, readActivityPosts, createActivityPost } from "@/lib/activity-posts";
import { getAdminSession } from "@/app/actions/auth";
import { readActivityPostInput } from "@/lib/activity-post-input";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await readActivityPosts();
    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await readActivityPostInput(request);

    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required." },
        { status: 400 }
      );
    }

    const newPost = buildActivityFromInput(body);
    const createdPost = await createActivityPost(newPost);

    return NextResponse.json({
      success: true,
      message: "Post published successfully.",
      data: createdPost,
    });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to publish post." },
      { status: error instanceof Error && error.message.startsWith("Image ") ? 400 : 500 }
    );
  }
}
