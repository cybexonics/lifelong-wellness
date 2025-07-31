import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] Handler started`)

  // Set CORS headers first
  const origin = req.headers.origin
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
    })
  }

  try {
    console.log("Step 1: Checking environment variables")

    // Check environment variables
    if (!process.env.EMAIL_USER) {
      console.error("EMAIL_USER missing")
      return res.status(500).json({
        success: false,
        message: "EMAIL_USER not configured",
      })
    }

    if (!process.env.EMAIL_PASS) {
      console.error("EMAIL_PASS missing")
      return res.status(500).json({
        success: false,
        message: "EMAIL_PASS not configured",
      })
    }

    console.log("Step 2: Environment variables OK")

    // Try to parse the request body
    console.log("Step 3: Parsing request body")
    let body: any = {}

    try {
      // Handle different content types
      const contentType = req.headers["content-type"] || ""
      console.log("Content-Type:", contentType)

      if (contentType.includes("application/json")) {
        body = req.body || {}
      } else if (contentType.includes("multipart/form-data")) {
        // For now, let's skip file handling and just get basic fields
        console.log("Multipart form data detected - using basic parsing")
        body = req.body || {}
      } else {
        console.log("Unknown content type, using req.body")
        body = req.body || {}
      }

      console.log("Body keys:", Object.keys(body))
    } catch (bodyError: any) {
      console.error("Body parsing error:", bodyError)
      return res.status(400).json({
        success: false,
        message: "Failed to parse request body",
        error: bodyError.message,
      })
    }

    console.log("Step 4: Extracting email data")

    // Extract basic fields
    const email = body.email || body.fields?.email?.[0] || body.fields?.email
    const phone = body.phone || body.fields?.phone?.[0] || body.fields?.phone
    const fullName = body.fullName || body.fields?.fullName?.[0] || body.fields?.fullName || "Unknown"
    const message = body.message || body.fields?.message?.[0] || body.fields?.message || ""
    const type = body.type || body.fields?.type?.[0] || body.fields?.type || "contact"

    console.log("Extracted data:", { email: !!email, phone: !!phone, fullName, type })

    if (!email || !phone) {
      console.error("Missing required fields")
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      })
    }

    console.log("Step 5: Importing nodemailer")

    // Dynamic import of nodemailer
    let nodemailer: any
    try {
      nodemailer = await import("nodemailer")
      console.log("Nodemailer imported successfully")
    } catch (importError: any) {
      console.error("Nodemailer import failed:", importError)
      return res.status(500).json({
        success: false,
        message: "Failed to load email service",
        error: importError.message,
      })
    }

    console.log("Step 6: Creating transporter")

    // Create transporter
    let transporter: any
    try {
      transporter = nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      console.log("Transporter created")
    } catch (transportError: any) {
      console.error("Transporter creation failed:", transportError)
      return res.status(500).json({
        success: false,
        message: "Failed to create email transporter",
        error: transportError.message,
      })
    }

    console.log("Step 7: Sending email")

    // Send simple email
    try {
      const mailOptions = {
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
        subject: `New ${type} Request`,
        html: `
          <h3>New Contact Request</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      }

      console.log("Sending email to:", mailOptions.to)
      const result = await transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", result.messageId)

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      })
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError)
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: emailError.message,
      })
    }
  } catch (error: any) {
    console.error("Handler error:", error)
    console.error("Error stack:", error.stack)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}
