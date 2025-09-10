import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // This will use lifelongwellnessmegha@gmail.com
    pass: process.env.EMAIL_PASS
  }
});

// Email template for admin
const createAdminEmailTemplate = (data: {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  consultationType?: string;
  type: "consultation" | "contact" | "callback";
}): string => {
  const isConsultation = data.type === "consultation";
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .field { margin: 15px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; }
        .notice { background: #f5f5f5; padding: 10px; border-left: 4px solid #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>New ${isConsultation ? "Consultation" : "Contact"} Request</p>
        </div>
        
        <div class="notice">
          <p>This message was submitted through your website contact form by:</p>
          <p><strong>${data.fullName}</strong> (${data.email})</p>
        </div>
        
        <div class="field">
          <strong>Name:</strong> ${data.fullName}
        </div>
        
        <div class="field">
          <strong>Email:</strong> ${data.email}
        </div>
        
        <div class="field">
          <strong>Phone:</strong> ${data.phone}
        </div>
        
        ${data.consultationType ? `
        <div class="field">
          <strong>Consultation Type:</strong> ${data.consultationType}
        </div>` : ''}
        
        ${data.message ? `
        <div class="field">
          <strong>Message:</strong> ${data.message.replace(/\n/g, "<br>")}
        </div>` : ''}
      </div>
    </body>
    </html>
  `;
};

// Auto-reply template for user
const createAutoReplyTemplate = (data: {
  fullName: string;
  type: "consultation" | "contact" | "callback";
}): string => {
  const isConsultation = data.type === "consultation";
  const firstName = data.fullName.split(" ")[0] || data.fullName;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .highlight { background: #ecfdf5; padding: 15px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>Thank You for Contacting Us</p>
        </div>
        
        <p>Dear ${firstName},</p>
        
        <div class="highlight">
          <p>We've received your ${isConsultation ? "consultation request" : "message"} and will respond within 24 hours.</p>
          ${isConsultation ? "<p><strong>Your consultation is confirmed!</strong></p>" : ""}
        </div>
        
        <p>For immediate assistance, please contact us at:</p>
        <p><strong>Phone/WhatsApp:</strong> +91 94210 69326</p>
        <p><strong>Email:</strong> lifelongwellnessmegha@gmail.com</p>
        
        <p>Best regards,<br>
        <strong>Dt. Megha Shaha</strong><br>
        Lifelong Wellness</p>
      </div>
    </body>
    </html>
  `;
};

// Parse multipart form data
const parseMultipartData = async (
  req: VercelRequest
): Promise<{ fields: Record<string, string>; files: Record<string, Buffer> }> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          resolve({ fields: {}, files: {} });
          return;
        }

        const parts = buffer.toString().split(`--${boundary}`);
        const fields: Record<string, string> = {};
        const files: Record<string, Buffer> = {};

        for (const part of parts) {
          if (part.includes("Content-Disposition: form-data")) {
            const nameMatch = part.match(/name="([^"]+)"/);
            if (!nameMatch) continue;

            const fieldName = nameMatch[1];

            if (part.includes("Content-Type:")) {
              const contentStart = part.indexOf("\r\n\r\n") + 4;
              const contentEnd = part.lastIndexOf("\r\n");
              if (contentStart < contentEnd) {
                const fileContent = Buffer.from(
                  part.slice(contentStart, contentEnd),
                  "binary"
                );
                files[fieldName] = fileContent;
              }
            } else {
              const valueStart = part.indexOf("\r\n\r\n") + 4;
              const valueEnd = part.lastIndexOf("\r\n");
              if (valueStart < valueEnd) {
                fields[fieldName] = part.slice(valueStart, valueEnd).trim();
              }
            }
          }
        }

        resolve({ fields, files });
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
};

// Email sending with retry logic
const sendWithRetry = async (
  mailOptions: nodemailer.SendMailOptions,
  retries = 3
): Promise<any> => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Email send attempt failed (${4 - retries}/3):`, error);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendWithRetry(mailOptions, retries - 1);
    }
    throw error;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  const allowedOrigins = [
    "https://www.lifelongwellness.co.in",
    "https://lifelongwellness.co.in",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    let fields: Record<string, string> = {};
    let files: Record<string, Buffer> = {};

    // Parse request data
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const parsed = await parseMultipartData(req);
      fields = parsed.fields;
      files = parsed.files;
    } else if (contentType.includes("application/json")) {
      fields = req.body || {};
    } else {
      fields = req.body || {};
    }

    // Validate required fields
    if (!fields.email || !fields.phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required fields",
      });
    }

    // Prepare email data
    const emailData = {
      fullName: fields.fullName || `${fields.name || ""} ${fields.surname || ""}`.trim(),
      email: fields.email,
      phone: fields.phone,
      message: fields.message || fields.concern || "",
      consultationType: fields.consultationType || "",
      type: (fields.type as "consultation" | "contact" | "callback") || "contact",
    };

    // Prepare attachments
    const attachments: Attachment[] = [];
    if (files.paymentScreenshot) {
      attachments.push({
        filename: "payment-screenshot.jpg",
        content: files.paymentScreenshot,
      });
    }

    // Send to ADMIN (appears to come from user)
    await sendWithRetry({
      from: {
        name: "Lifelong Wellness",
        address: process.env.EMAIL_USER as string // This ensures lifelongwellnessmegha@gmail.com is used
      },
      to: process.env.EMAIL_USER as string, // Admin email
      replyTo: `"${emailData.fullName}" <${emailData.email}>`, // Replies go to user
      subject: `New ${emailData.type === "consultation" ? "Consultation" : "Contact"} Request`,
      html: createAdminEmailTemplate(emailData),
      attachments,
    });

    // Send AUTO-REPLY to USER
    await sendWithRetry({
      from: {
        name: "Lifelong Wellness",
        address: process.env.EMAIL_USER as string
      },
      to: emailData.email,
      subject: emailData.type === "consultation" ? "Your Consultation Request Received" : "Thank You for Contacting Us",
      html: createAutoReplyTemplate(emailData),
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}