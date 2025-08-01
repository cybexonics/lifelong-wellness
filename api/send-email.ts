import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"
import multer from "multer"

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only images (JPEG, PNG, GIF) and PDFs are allowed"))
    }
  },
})

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Email template functions
const createEmailTemplate = (data: {
  fullName: string
  email: string
  phone: string
  message?: string
  consultationType?: string
  type: "consultation" | "contact" | "callback"
}): string => {
  const isConsultation = data.type === "consultation"

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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>New ${isConsultation ? "Consultation" : "Contact"} Request</p>
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
        
        ${
          data.consultationType
            ? `
        <div class="field">
          <strong>Consultation Type:</strong> ${data.consultationType}
        </div>`
            : ""
        }
        
        ${
          data.message
            ? `
        <div class="field">
          <strong>Message:</strong> ${data.message.replace(/\n/g, "<br>")}
        </div>`
            : ""
        }
      </div>
    </body>
    </html>
  `
}

const createAutoReplyTemplate = (data: {
  fullName: string
  type: "consultation" | "contact" | "callback"
}): string => {
  const isConsultation = data.type === "consultation"
  const firstName = data.fullName.split(" ")[0] || data.fullName

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
        <p><strong>Email:</strong> meghahshaha@gmail.com</p>
        
        <p>Best regards,<br>
        <strong>Dr. Megha Shaha</strong><br>
        Lifelong Wellness</p>
      </div>
    </body>
    </html>
  `
}

// Helper function to handle multipart form data
const parseMultipartForm = (req: VercelRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const uploadSingle = upload.single("paymentScreenshot")
    uploadSingle(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          fields: req.body,
          files: (req as any).file ? { paymentScreenshot: (req as any).file } : {},
        })
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  const allowedOrigins = [
    "https://www.lifelongwellness.co.in",
    "https://lifelongwellness.co.in",
    "http://localhost:3000",
    "http://localhost:5173",
  ]

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin || "")) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*")
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(req)

    // Validate required fields
    if (!fields.email || !fields.phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required fields",
      })
    }

    // Prepare email data
    const emailData = {
      fullName: fields.fullName || `${fields.name || ""} ${fields.surname || ""}`.trim(),
      email: fields.email,
      phone: fields.phone,
      message: fields.message || fields.concern || "",
      consultationType: fields.consultationType || "",
      type: fields.type || "contact",
    }

    // Prepare attachments
    const attachments: NonNullable<nodemailer.SendMailOptions["attachments"]> = []
    if (files.paymentScreenshot) {
      attachments.push({
        filename: files.paymentScreenshot.originalname,
        content: files.paymentScreenshot.buffer,
      })
    }

    // Send email with retry logic
    const sendWithRetry = async (mailOptions: any, retries = 3) => {
      try {
        return await transporter.sendMail(mailOptions)
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return sendWithRetry(mailOptions, retries - 1)
        }
        throw error
      }
    }

    // Send to admin
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: "meghahshaha@gmail.com",
      subject: `New ${emailData.type === "consultation" ? "Consultation" : "Contact"} Request`,
      html: createEmailTemplate(emailData),
      attachments,
    })

    // Send auto-reply
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: emailData.email,
      subject: emailData.type === "consultation" ? "Your Consultation Request Received" : "Thank You for Contacting Us",
      html: createAutoReplyTemplate(emailData),
    })

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error: any) {
    console.error("Email error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
