import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // This endpoint is deprecated - images are now stored in Cloudinary
    // Return the image from the product's Cloudinary URL
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { mainImage: { contains: id } },
          { images: { has: id } }
        ]
      },
      select: {
        id: true,
        images: true,
        mainImage: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Return the Cloudinary URL
    const imageUrl = product.mainImage || product.images[0];
    
    if (imageUrl) {
      // Redirect to Cloudinary URL
      return NextResponse.redirect(imageUrl);
    }

    return NextResponse.json(
      { error: "No image available" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { 
        error: "Failed to serve image",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
