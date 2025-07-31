import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first - including the new Vercel preview URL
  const origin = req.headers.origin
  const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8081",
    "https://lifelong-wellness.vercel.app",
    "https://lifelong-wellness-ftia-54wwept5g.vercel.app", // Add your current preview URL
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
  } else {
    // For debugging, allow all origins temporarily
    res.setHeader("Access-Control-Allow-Origin", "*")
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Handle preflight
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request from:", origin)
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    console.log("Handler called from origin:", origin)
    console.log("Request headers:", req.headers)

    // Check environment variables
    const hasEmailUser = !!process.env.EMAIL_USER
    const hasEmailPass = !!process.env.EMAIL_PASS

    console.log("Environment check:", { hasEmailUser, hasEmailPass })

    if (!hasEmailUser || !hasEmailPass) {
      return res.status(500).json({
        success: false,
        message: "Email credentials not configured",
        debug: { hasEmailUser, hasEmailPass },
      })
    }

    // Get request body
    let requestData: any = {}
    try {
      requestData = req.body || {}
      console.log("Request body keys:", Object.keys(requestData))
    } catch (bodyError: any) {
      console.error("Body parsing error:", bodyError)
      return res.status(400).json({
        success: false,
        message: "Failed to parse request body",
        error: bodyError.message,
      })
    }

    // Extract fields
    const email = requestData.email
    const phone = requestData.phone
    const fullName = requestData.fullName || "Test User"

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
        received: { email: !!email, phone: !!phone },
      })
    }

    // Import and use nodemailer
    try {
      console.log("Attempting to import nodemailer...")
      const nodemailer = require("nodemailer")
      console.log("Nodemailer imported successfully")

      console.log("Creating transporter...")
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      console.log("Transporter created successfully")

      console.log("Attempting to send email...")
      const result = await transporter.sendMail({
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
        subject: "Test Email from API",
        html: `
          <h3>Test Email</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Origin:</strong> ${origin}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      })

      console.log("Email sent successfully:", result.messageId)

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      })
    } catch (emailError: any) {
      console.error("Email error:", emailError)
      return res.status(500).json({
        success: false,
        message: "Email sending failed",
        error: emailError.message,
        stack: emailError.stack?.substring(0, 500),
      })
    }
  } catch (error: any) {
    console.error("Handler error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: error.stack?.substring(0, 500),
    })
  }
}
