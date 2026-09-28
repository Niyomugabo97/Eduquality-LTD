import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/actions/auth";
import { readActivityPostInput } from "@/lib/activity-post-input";
import { buildActivityFromInput, readActivityPosts, writeActivityPosts } from "@/lib/activity-posts";

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

    const posts = await readActivityPosts();
    const existingPost = posts.find((post) => post.id === id);
    if (!existingPost) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    const updatedPost = {
      ...buildActivityFromInput({ ...input, id }),
      createdAt: existingPost.createdAt,
    };
    await writeActivityPosts(posts.map((post) => post.id === id ? updatedPost : post));

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
    const posts = await readActivityPosts();
    const remainingPosts = posts.filter((post) => post.id !== id);
    if (remainingPosts.length === posts.length) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    await writeActivityPosts(remainingPosts);
    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, message: "Failed to delete post." }, { status: 500 });
  }
}