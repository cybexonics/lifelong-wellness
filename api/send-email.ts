import type { VercelRequest, VercelResponse } from "@vercel/node"

// Simple CORS handler
const setCorsHeaders = (res: VercelResponse, origin?: string) => {
  const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8081",
    "https://lifelong-wellness.vercel.app",
    "https://www.lifelongwellness.co.in",
    "https://lifelongwellness.co.in",
  ]

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
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now()
  console.log(`[${new Date().toISOString()}] Handler started - Method: ${req.method}`)

  try {
    // Set CORS headers
    setCorsHeaders(res, req.headers.origin)

    // Handle preflight
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request")
      return res.status(200).end()
    }

    // Only allow POST
    if (req.method !== "POST") {
      console.log(`Method ${req.method} not allowed`)
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
        timestamp: new Date().toISOString(),
      })
    }

    // Check environment variables
    console.log("Checking environment variables...")
    if (!process.env.EMAIL_USER) {
      console.error("EMAIL_USER not found")
      return res.status(500).json({
        success: false,
        message: "EMAIL_USER not configured",
        timestamp: new Date().toISOString(),
      })
    }

    if (!process.env.EMAIL_PASS) {
      console.error("EMAIL_PASS not found")
      return res.status(500).json({
        success: false,
        message: "EMAIL_PASS not configured",
        timestamp: new Date().toISOString(),
      })
    }

    console.log("Environment variables OK")

    // Try to import nodemailer
    console.log("Importing nodemailer...")
    let nodemailer
    try {
      nodemailer = await import("nodemailer")
      console.log("Nodemailer imported successfully")
    } catch (importError: any) {
      console.error("Failed to import nodemailer:", importError)
      return res.status(500).json({
        success: false,
        message: "Failed to load email service",
        error: importError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Try to import formidable
    console.log("Importing formidable...")
    let formidable
    try {
      formidable = await import("formidable")
      console.log("Formidable imported successfully")
    } catch (importError: any) {
      console.error("Failed to import formidable:", importError)
      return res.status(500).json({
        success: false,
        message: "Failed to load form parser",
        error: importError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Create transporter
    console.log("Creating email transporter...")
    let transporter
    try {
      transporter = nodemailer.default.createTransport({
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
      console.log("Transporter created successfully")
    } catch (transportError: any) {
      console.error("Failed to create transporter:", transportError)
      return res.status(500).json({
        success: false,
        message: "Failed to create email transporter",
        error: transportError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Parse form data
    console.log("Parsing form data...")
    let fields: any = {}
    let files: any = {}

    try {
      const form = formidable.default({
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowEmptyFiles: false,
      })

      const parseResult = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Form parsing timeout"))
        }, 20000)

        form.parse(req, (err: any, parsedFields: any, parsedFiles: any) => {
          clearTimeout(timeout)
          if (err) {
            console.error("Form parsing error:", err)
            reject(err)
          } else {
            resolve({ fields: parsedFields, files: parsedFiles })
          }
        })
      })

      fields = parseResult.fields
      files = parseResult.files
      console.log("Form parsed successfully, fields:", Object.keys(fields))
    } catch (parseError: any) {
      console.error("Form parsing failed:", parseError)
      return res.status(400).json({
        success: false,
        message: "Failed to parse form data",
        error: parseError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Extract and validate fields
    const getField = (field: any) => (Array.isArray(field) ? field[0] : field)

    const email = getField(fields.email)
    const phone = getField(fields.phone)

    if (!email || !phone) {
      console.error("Missing required fields:", { email: !!email, phone: !!phone })
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
        timestamp: new Date().toISOString(),
      })
    }

    // Prepare email data
    const emailData = {
      fullName:
        getField(fields.fullName) ||
        `${getField(fields.name) || ""} ${getField(fields.surname) || ""}`.trim() ||
        "Unknown",
      email,
      phone,
      message: getField(fields.message) || getField(fields.concern) || "",
      consultationType: getField(fields.consultationType) || "",
      type: getField(fields.type) || "contact",
    }

    console.log("Email data prepared:", { ...emailData, email: "***", phone: "***" })

    // Create simple email template
    const createSimpleTemplate = (data: typeof emailData) => `
      <h2>🌿 Lifelong Wellness - New ${data.type === "consultation" ? "Consultation" : "Contact"} Request</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.consultationType ? `<p><strong>Consultation Type:</strong> ${data.consultationType}</p>` : ""}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
      <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
    `

    // Send email to admin
    console.log("Sending email to admin...")
    try {
      const adminResult = await transporter.sendMail({
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
        subject: `New ${emailData.type === "consultation" ? "Consultation" : "Contact"} Request`,
        html: createSimpleTemplate(emailData),
      })
      console.log("Admin email sent:", adminResult.messageId)
    } catch (adminEmailError: any) {
      console.error("Failed to send admin email:", adminEmailError)
      return res.status(500).json({
        success: false,
        message: "Failed to send notification email",
        error: adminEmailError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Send auto-reply
    console.log("Sending auto-reply...")
    try {
      const firstName = emailData.fullName.split(" ")[0] || emailData.fullName
      const autoReplyResult = await transporter.sendMail({
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: emailData.email,
        subject:
          emailData.type === "consultation" ? "Your Consultation Request Received" : "Thank You for Contacting Us",
        html: `
          <h2>🌿 Lifelong Wellness</h2>
          <p>Dear ${firstName},</p>
          <p>We've received your ${emailData.type === "consultation" ? "consultation request" : "message"} and will respond within 24 hours.</p>
          <p>For immediate assistance, please contact us at:</p>
          <p><strong>Phone/WhatsApp:</strong> +91 94210 69326</p>
          <p><strong>Email:</strong> meghahshaha@gmail.com</p>
          <p>Best regards,<br><strong>Dr. Megha Shaha</strong><br>Lifelong Wellness</p>
        `,
      })
      console.log("Auto-reply sent:", autoReplyResult.messageId)
    } catch (autoReplyError: any) {
      console.error("Failed to send auto-reply:", autoReplyError)
      // Don't fail the whole request if auto-reply fails
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
    console.error("Error stack:", error.stack)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
      processingTime: totalTime,
      timestamp: new Date().toISOString(),
    })
  }
}
