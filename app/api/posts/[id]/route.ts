import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/actions/auth";
import { readActivityPostInput } from "@/lib/activity-post-input";
import { buildActivityFromInput, updateActivityPost, deleteActivityPost } from "@/lib/activity-posts";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getAdminSession();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const input = await readActivityPostInput(request);
    const title = String(input.title || "").trim();
    const description = String(input.description || "").trim();
    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required." }, { status: 400 });
    }

    const updatedPost = await updateActivityPost(id, buildActivityFromInput({ ...input, id }));
    if (!updatedPost) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post updated successfully.", data: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update post." },
      { status: error instanceof Error && error.message.startsWith("Image ") ? 400 : 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getAdminSession();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteActivityPost(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, message: "Failed to delete post." }, { status: 500 });
  }
}
