import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "info@eduquality.rw" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 400 }
      );
    }

    // Create admin with hashed password
    const hashedPassword = await bcrypt.hash("Test@12345", 10);
    
    const admin = await prisma.admin.create({
      data: {
        name: "Admin",
        email: "info@eduquality.rw",
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json(
      { message: "Admin created successfully", admin: { id: admin.id, email: admin.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { message: "Failed to create admin", error: String(error) },
      { status: 500 }
    );
  }
}
