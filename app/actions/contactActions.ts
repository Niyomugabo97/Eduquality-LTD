"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { ContactStatus } from "@prisma/client"; // Import ContactStatus enum

// Define schema for validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(), // Phone is optional
  message: z.string().min(1, "Message is required."),
  status: z.nativeEnum(ContactStatus).optional(), // Status is optional for creation, defaults to 'New'
});

// Re-use the transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
};

export async function createContact(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined, // Ensure empty string becomes undefined for optional field
    message: formData.get("message"),
  };

  // Validate data
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const newContact = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        status: ContactStatus.New, // Always set to New on creation
      },
    });

    // Send email notification to company (admin)
    const transporter = createTransporter();
    const adminEmail = "myeduquality@gmail.com"; // The admin's email address

    const companyEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F17105; margin: 0;">New Contact Message</h1>
          <p style="color: #666; margin: 5px 0;">EDUQUALITY LTD</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #333;">${parsed.data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${parsed.data.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px 0; color: #333;">${
                parsed.data.phone || "Not provided"
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${
            parsed.data.message
          }</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This message was sent from the EDUQUALITY LTD website contact form
          </p>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
            Received on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    // Auto-reply email content for the visitor
    const autoReplyContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F17105; margin: 0;">Thank You for Contacting Us!</h1>
          <p style="color: #666; margin: 5px 0;">EDUQUALITY LTD</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #333; margin: 0 0 15px 0;">Dear ${parsed.data.name},</p>
          <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
            Thank you for reaching out to EDUQUALITY LTD. We have received your message and our team will review it shortly.
          </p>
          <p style="color: #555; line-height: 1.6; margin: 0;">
            We typically respond to all inquiries within 24 hours during business days. If your matter is urgent, please don't hesitate to call us directly at <strong>+250 784 761 274</strong>.
          </p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${parsed.data.message}</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="color: #F17105; margin: 0 0 15px 0;">Our Services</h3>
          <p style="color: #555; font-size: 14px; line-height: 1.5;">
            Management Consultancy • Business Strategy Development • Chemical Manufacturing<br>
            Global Trading Services • Wholesale Trade • Technical Testing & Analysis<br>
            Fertilizers & Agrochemicals • Cargo Handling • Professional Consulting
          </p>
        </div>
        
        <div style="text-align: center; background-color: #F17105; color: white; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">EDUQUALITY</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Quality Education Solutions • Professional Services • Available 24/7</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            <strong>Contact Information:</strong><br>
            Email: myeduquality@gmail.com<br>
            Phone: +250 788 123 456<br>
            Address: Kigali, Rwanda
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EDUQUALITY LTD Contact Form" <${process.env.NODEMAILER_USER}>`,
      to: adminEmail,
      subject: `New Contact Message from ${parsed.data.name}`,
      html: companyEmailContent,
      replyTo: parsed.data.email,
    });

    await transporter.sendMail({
      from: `"EDUQUALITY LTD" <${process.env.NODEMAILER_USER}>`,
      to: parsed.data.email,
      subject: "Thank you for contacting EDUQUALITY LTD",
      html: autoReplyContent,
    });

    revalidatePath("/dashboard/contacts"); // Revalidate the contacts dashboard page
    return { success: true, message: "Message sent successfully!" };
  } catch (error: any) {
    console.error("Database or Email sending error:", error);
    return {
      success: false,
      message:
        "Failed to send message. Please try again or contact us directly.",
    };
  }
}

export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: contacts };
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return { success: false, message: "Failed to fetch contacts." };
  }
}

export async function getContactById(id: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      return { success: false, message: "Contact not found." };
    }
    return { success: true, data: contact };
  } catch (error) {
    console.error(`Failed to fetch contact with ID ${id}:`, error);
    return { success: false, message: "Failed to fetch contact." };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });
    revalidatePath("/dashboard/contacts"); // Revalidate the contacts dashboard page
    return { success: true, message: "Contact deleted successfully." };
  } catch (error) {
    console.error(`Failed to delete contact with ID ${id}:`, error);
    return { success: false, message: "Failed to delete contact." };
  }
}

export async function updateContact(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
    status: formData.get("status"),
  };

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.contact.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        status: parsed.data.status, // Update status as well
      },
    });
    revalidatePath("/dashboard/contacts"); // Revalidate the contacts dashboard page
    return { success: true, message: "Contact updated successfully!" };
  } catch (error: any) {
    console.error(`Failed to update contact with ID ${id}:`, error);
    return { success: false, message: "Failed to update contact." };
  }
}
