import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    console.log('=== Cloudinary Upload Request Started ===');
    
    const formData = await request.formData();
    
    // Get form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : undefined;
    const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : undefined;
    const province = formData.get("province") as string;
    const district = formData.get("district") as string;
    const sector = formData.get("sector") as string;
    const village = formData.get("village") as string;
    const available = formData.get("available") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;

    // Get user session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please login." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Clean userId to remove any invalid characters
    const cleanUserId = sessionToken.replace(/[^a-zA-Z0-9]/g, '');
    
    console.log('=== User Auth Debug ===');
    console.log('Session token:', sessionToken);
    console.log('Cleaned userId:', cleanUserId);

    // Get files
    const imageFiles = formData.getAll("image") as File[];

    console.log('=== Cloudinary Upload Debug ===');
    console.log('Image files count:', imageFiles.length);
    console.log('Image files:', imageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));

    if (imageFiles.length === 0) {
      return NextResponse.json({ success: false, message: "At least one image is required." }, { status: 400 });
    }

    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    const imageNames: string[] = [];
    const imageTypes: string[] = [];

    console.log('=== Processing Images for Cloudinary ===');
    
    for (const file of imageFiles) {
      try {
        console.log(`Uploading image: ${file.name}`);
        
        // Upload to Cloudinary
        const imageUrl = await uploadImageToCloudinary(file);
        
        imageUrls.push(imageUrl);
        imageNames.push(file.name);
        imageTypes.push(file.type);
        
        console.log(`✅ Uploaded: ${file.name} -> ${imageUrl}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error);
        return NextResponse.json({ 
          success: false, 
          message: `Failed to upload image: ${file.name}` 
        }, { status: 500 });
      }
    }

    // Create product with Cloudinary URLs
    const productData: any = {
      title,
      description,
      category,
      price,
      latitude,
      longitude,
      province,
      district,
      sector,
      village,
      available: available !== "false", // Convert to boolean, default to true
      contactNumber,
      whatsappNumber,
      user: {
        connect: { id: cleanUserId }
      },
      // Store Cloudinary URLs directly in the product
      images: imageUrls,
      imageNames,
      imageTypes,
      mainImage: imageUrls.length > 0 ? imageUrls[0] : null,
      mainImageIndex: 0,
    };

    console.log('=== Creating Product with Cloudinary URLs ===');
    console.log('Product data:', {
      title: productData.title,
      imageCount: imageUrls.length,
      mainImage: productData.mainImage,
    });

    const product = await prisma.product.create({
      data: productData,
    });

    console.log('✅ Product created with ID:', product.id);

    return NextResponse.json({ 
      success: true, 
      message: "Product uploaded successfully to Cloudinary!", 
      productId: product.id,
      imageUrls: imageUrls
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to upload product. Please try again." 
    }, { status: 500 });
  }
}
