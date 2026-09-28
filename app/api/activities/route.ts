import { NextResponse } from "next/server";
import { buildActivityFromInput, readActivityPosts, createActivityPost } from "@/lib/activity-posts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await readActivityPosts();
    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching activity posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch activities." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      message: "Activity published successfully.",
      data: createdPost,
    });
  } catch (error) {
    console.error("Error publishing activity:", error);
    return NextResponse.json(
      { success: false, message: "Failed to publish activity." },
      { status: 500 }
    );
  }
}
