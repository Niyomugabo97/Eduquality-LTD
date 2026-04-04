"use server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface RegistrationFormData {
  companyName: string;
  email: string;
  tinNumber: string;
  phoneNumber: string;
  location: string;
  selectedServices: string[];
}

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

export async function sendContactEmail(formData: ContactFormData) {
  try {
    const transporter = createTransporter();

    // Email content for the company
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
              <td style="padding: 8px 0; color: #333;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px 0; color: #333;">${
                formData.phone || "Not provided"
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${
            formData.message
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
          <p style="color: #333; margin: 0 0 15px 0;">Dear ${formData.name},</p>
          <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
            Thank you for reaching out to EDUQUALITY LTD. We have received your message and our team will review it shortly.
          </p>
          <p style="color: #555; line-height: 1.6; margin: 0;">
            We typically respond to all inquiries within 24 hours during business days. If your matter is urgent, please don't hesitate to call us directly at <strong>+250 784 761 274</strong>.
          </p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
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
            Email: info@eduquality.rw<br>
            Phone: +250 788 123 456<br>
            Address: Kigali, Rwanda
          </p>
        </div>
      </div>
    `;

    // Send email to company
    await transporter.sendMail({
      from: `"EDUQUALITY LTD Contact Form" <${process.env.NODEMAILER_USER}>`,
      to: "info@eduquality.rw", // Admin email
      subject: `New Contact Message from ${formData.name}`,
      html: companyEmailContent,
      replyTo: formData.email,
    });

    // Send auto-reply to visitor
    await transporter.sendMail({
      from: `"EDUQUALITY LTD" <${process.env.NODEMAILER_USER}>`,
      to: formData.email,
      subject: "Thank you for contacting EDUQUALITY LTD",
      html: autoReplyContent,
    });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message:
        "Failed to send message. Please try again or contact us directly.",
    };
  }
}

export async function sendAdminRegistrationNotification(
  formData: RegistrationFormData
) {
  try {
    const transporter = createTransporter();
    const adminEmail = "info@eduquality.rw";

    const adminNotificationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0066FF; margin: 0;">New Service Registration Received!</h1>
          <p style="color: #666; margin: 5px 0;">EDUQUALITY LTD - Admin Notification</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 150px;">Company/User Name:</td>
              <td style="padding: 8px 0; color: #333;">${
                formData.companyName
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">TIN Number:</td>
              <td style="padding: 8px 0; color: #333;">${
                formData.tinNumber
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone Number:</td>
              <td style="padding: 8px 0; color: #333;">${
                formData.phoneNumber
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 8px 0; color: #333;">${formData.location}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Requested Services:</h3>
          <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
            ${formData.selectedServices
              .map((service) => `<li>${service}</li>`)
              .join("")}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This notification was sent from the EDUQUALITY LTD website.
          </p>
          <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
            Received on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EDUQUALITY LTD Notifications" <${process.env.NODEMAILER_USER}>`,
      to: adminEmail,
      subject: `New Service Registration from ${formData.companyName}`,
      html: adminNotificationContent,
      replyTo: formData.email, // Reply to the registrant's email
    });

    console.log(
      "Admin notification email sent successfully for new registration."
    );
    return { success: true };
  } catch (error) {
    console.error(
      "Error sending admin registration notification email:",
      error
    );
    return { success: false };
  }
}
