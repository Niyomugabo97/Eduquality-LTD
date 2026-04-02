"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sendAdminRegistrationNotification } from "@/lib/send-email";

// Define schema for validation
const registrationSchema = z.object({
  companyName: z.string().min(1, "Company/User Name is required."),
  email: z.string().email("Invalid email address."),
  tinNumber: z.string().min(1, "TIN Number is required."),
  phoneNumber: z.string().min(1, "Phone Number is required."),
  location: z.string().min(1, "Location is required."),
  selectedServices: z
    .array(z.string())
    .min(1, "At least one service must be selected."),
});

export async function registerInterest(prevState: any, formData: FormData) {
  const data = {
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    tinNumber: formData.get("tinNumber"),
    phoneNumber: formData.get("phoneNumber"),
    location: formData.get("location"),
    selectedServices: formData.getAll("selectedServices"),
  };

  // Validate data
  const parsed = registrationSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.registration.create({
      data: {
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        tinNumber: parsed.data.tinNumber,
        phoneNumber: parsed.data.phoneNumber,
        location: parsed.data.location,
        selectedServices: parsed.data.selectedServices,
      },
    });
      await sendAdminRegistrationNotification(parsed.data);
    return {
      success: true,
      message: "Registration submitted successfully! We'll contact you soon.",
    };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {
        success: false,
        message:
          "This email is already registered. Please use a different email or contact us.",
      };
    }
    console.error("Database error:", error);
    return {
      success: false,
      message: "Failed to submit registration. Please try again.",
    };
  }
}


export async function getRegistrations() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: registrations };
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return { success: false, message: "Failed to fetch registrations." };
  }
}

export async function getRegistrationById(id: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
    });
    if (!registration) {
      return { success: false, message: "Registration not found." };
    }
    return { success: true, data: registration };
  } catch (error) {
    console.error(`Failed to fetch registration with ID ${id}:`, error);
    return { success: false, message: "Failed to fetch registration." };
  }
}

export async function deleteRegistration(id: string) {
  try {
    await prisma.registration.delete({
      where: { id },
    });
    revalidatePath("/dashboard"); // Revalidate the dashboard page to show updated list
    return { success: true, message: "Registration deleted successfully." };
  } catch (error) {
    console.error(`Failed to delete registration with ID ${id}:`, error);
    return { success: false, message: "Failed to delete registration." };
  }
}

export async function updateRegistration(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;

  const data = {
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    tinNumber: formData.get("tinNumber"),
    phoneNumber: formData.get("phoneNumber"),
    location: formData.get("location"),
    selectedServices: formData.getAll("selectedServices"),
  };

  const parsed = registrationSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.registration.update({
      where: { id },
      data: {
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        tinNumber: parsed.data.tinNumber,
        phoneNumber: parsed.data.phoneNumber,
        location: parsed.data.location,
        selectedServices: parsed.data.selectedServices,
      },
    });
    revalidatePath("/dashboard"); // Revalidate the dashboard page
    return { success: true, message: "Registration updated successfully!" };
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      };
    }
    console.error(`Failed to update registration with ID ${id}:`, error);
    return { success: false, message: "Failed to update registration." };
  }
}
