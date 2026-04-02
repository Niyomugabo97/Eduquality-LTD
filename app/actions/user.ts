"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export async function createUser(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsed = createUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    await prisma.admin.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
    });
    revalidatePath("/dashboard"); // Revalidate dashboard if users are listed there
    return { success: true, message: "User created successfully!" };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      };
    }
    console.error("Database error:", error);
    return {
      success: false,
      message: "Failed to create user. Please try again.",
    };
  }
}

// You can add more actions here for managing users (e.g., updateUser, deleteUser)
