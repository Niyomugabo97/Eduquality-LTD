import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        hidden: false // Only fetch visible products
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform products to include Cloudinary image URLs
    const transformedProducts = products.map((product: any) => {
      if (product.images && product.images.length > 0) {
        return {
          ...product,
          media: {
            images: product.images, // Direct Cloudinary URLs
            mainImage: product.mainImage, // Direct Cloudinary URL
          }
        };
      }
      return {
        ...product,
        media: {
          images: [],
          mainImage: null,
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
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
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
