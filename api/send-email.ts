import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"
import formidable from "formidable"
import fs from "fs"

// Configure CORS
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "https://lifelong-wellness.vercel.app",
  "https://www.lifelongwellness.co.in",
  "https://lifelongwellness.co.in",
]

// Email transporter configuration
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
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
      // Add connection timeout settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    throw new Error("Email configuration error")
  }
}

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
        <div class="field"><strong>Name:</strong> ${data.fullName}</div>
        <div class="field"><strong>Email:</strong> ${data.email}</div>
        <div class="field"><strong>Phone:</strong> ${data.phone}</div>
        ${data.consultationType ? `<div class="field"><strong>Consultation Type:</strong> ${data.consultationType}</div>` : ""}
        ${data.message ? `<div class="field"><strong>Message:</strong> ${data.message.replace(/\n/g, "<br>")}</div>` : ""}
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
        <p>Best regards,<br><strong>Dr. Megha Shaha</strong><br>Lifelong Wellness</p>
      </div>
    </body>
    </html>
  `
}

// Parse form data with smaller file size limit to prevent timeouts
const parseForm = (req: VercelRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    try {
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // Reduced to 5MB to prevent timeouts
        allowEmptyFiles: false,
        filter: ({ mimetype }) => {
          return !!(mimetype && ["image/jpeg", "image/png", "image/gif", "application/pdf"].includes(mimetype))
        },
      })

      // Set a timeout for form parsing
      const timeout = setTimeout(() => {
        reject(new Error("Form parsing timeout"))
      }, 25000) // 25 seconds timeout

      form.parse(req, (err, fields, files) => {
        clearTimeout(timeout)
        if (err) {
          console.error("Form parsing error:", err)
          reject(new Error(`Form parsing failed: ${err.message}`))
        } else {
          resolve({ fields, files })
        }
      })
    } catch (error) {
      console.error("Form setup error:", error)
      reject(new Error("Failed to setup form parser"))
    }
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now()
  console.log(`[${new Date().toISOString()}] Email handler called with method: ${req.method}`)

  // Set response timeout headers
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Keep-Alive", "timeout=30")

  try {
    // Validate environment variables first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing email credentials")
      return res.status(500).json({
        success: false,
        message: "Email service not configured",
        timestamp: new Date().toISOString(),
      })
    }

    // Handle CORS
    const origin = req.headers.origin
    const isAllowedOrigin =
      origin &&
      (allowedOrigins.includes(origin) ||
        /https:\/\/lifelong-wellness-.*\.vercel\.app/.test(origin) ||
        /https:\/\/lifelong-wellness-git-.*\.vercel\.app/.test(origin))

    if (isAllowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", origin)
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Credentials", "true")

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end()
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
        timestamp: new Date().toISOString(),
      })
    }

    console.log("Parsing form data...")
    const parseStartTime = Date.now()

    // Parse form data with timeout
    const { fields, files } = await parseForm(req)

    console.log(`Form parsed in ${Date.now() - parseStartTime}ms, fields:`, Object.keys(fields))

    // Extract fields
    const getField = (field: any) => (Array.isArray(field) ? field[0] : field)

    const email = getField(fields.email)
    const phone = getField(fields.phone)

    // Validate required fields
    if (!email || !phone) {
      console.error("Missing required fields:", { email: !!email, phone: !!phone })
      return res.status(400).json({
        success: false,
        message: "Email and phone are required fields",
        timestamp: new Date().toISOString(),
      })
    }

    // Prepare email data
    const emailData = {
      fullName: getField(fields.fullName) || `${getField(fields.name) || ""} ${getField(fields.surname) || ""}`.trim(),
      email,
      phone,
      message: getField(fields.message) || getField(fields.concern) || "",
      consultationType: getField(fields.consultationType) || "",
      type: (getField(fields.type) || "contact") as "consultation" | "contact" | "callback",
    }

    console.log("Email data prepared:", { ...emailData, email: "***", phone: "***" })

    // Handle file attachment
    let attachment: { filename: string; path: string } | null = null
    if (files.paymentScreenshot) {
      const file = Array.isArray(files.paymentScreenshot) ? files.paymentScreenshot[0] : files.paymentScreenshot
      if (file && file.filepath) {
        attachment = {
          filename: file.originalFilename || "payment-screenshot",
          path: file.filepath,
        }
        console.log("Attachment found:", attachment.filename)
      }
    }

    // Create transporter
    console.log("Creating email transporter...")
    const transporter = createTransporter()

    // Quick verification with timeout
    console.log("Verifying email transporter...")
    const verifyStartTime = Date.now()

    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Verification timeout")), 10000)),
      ])
      console.log(`Email transporter verified in ${Date.now() - verifyStartTime}ms`)
    } catch (verifyError: any) {
      console.error("Email transporter verification failed:", verifyError.message)
      return res.status(500).json({
        success: false,
        message: "Email service configuration error",
        error: verifyError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Send email with timeout and retry logic
    const sendWithRetry = async (mailOptions: any, retries = 1): Promise<any> => {
      try {
        console.log(`Attempting to send email, retries left: ${retries}`)
        const sendStartTime = Date.now()

        const result = await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Email send timeout")), 15000)),
        ])

        console.log(`Email sent successfully in ${Date.now() - sendStartTime}ms:`, (result as any).messageId)
        return result
      } catch (error: any) {
        console.error("Email send error:", error.message)
        if (retries > 0) {
          console.log("Retrying email send...")
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return sendWithRetry(mailOptions, retries - 1)
        }
        throw error
      }
    }

    // Send to admin
    console.log("Sending email to admin...")
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
      subject: `New ${emailData.type === "consultation" ? "Consultation" : "Contact"} Request`,
      html: createEmailTemplate(emailData),
      attachments: attachment ? [attachment] : undefined,
    })

    // Send auto-reply
    console.log("Sending auto-reply...")
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: emailData.email,
      subject: emailData.type === "consultation" ? "Your Consultation Request Received" : "Thank You for Contacting Us",
      html: createAutoReplyTemplate(emailData),
    })

    // Clean up uploaded file
    if (attachment?.path) {
      try {
        fs.unlinkSync(attachment.path)
        console.log("Temporary file cleaned up")
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError)
      }
    }

    const totalTime = Date.now() - startTime
    console.log(`Email process completed successfully in ${totalTime}ms`)

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      processingTime: totalTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    const totalTime = Date.now() - startTime
    console.error(`Handler error after ${totalTime}ms:`, error)

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      processingTime: totalTime,
      timestamp: new Date().toISOString(),
    })
  }
}
