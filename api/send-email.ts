import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] API called from:`, req.headers.origin || req.headers.referer)

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    console.log("Step 1: Handler started")

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing environment variables")
      return res.status(500).json({
        error: "Missing environment variables",
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
      })
    }

    console.log("Step 2: Environment variables OK")

    // Get request body
    const body = req.body || {}
    console.log("Step 3: Request body received:", Object.keys(body))

    // Check required fields
    if (!body.email || !body.phone) {
      return res.status(400).json({
        error: "Missing email or phone",
        received: { email: !!body.email, phone: !!body.phone },
      })
    }

    console.log("Step 4: Required fields present")

    // Import nodemailer
    const nodemailer = require("nodemailer")
    console.log("Step 5: Nodemailer imported")

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    console.log("Step 6: Transporter created")

    // Send email
    const info = await transporter.sendMail({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h3>🌿 Lifelong Wellness - New Contact Request</h3>
        <p><strong>Name:</strong> ${body.fullName || "Unknown"}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Message:</strong> ${body.message || "No message"}</p>
        <p><strong>Type:</strong> ${body.type || "contact"}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `,
    })

    console.log("Step 7: Email sent successfully:", info.messageId)

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    })
  } catch (error: any) {
    console.error("Handler error:", error)
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      step: "Unknown",
    })
  }
}
