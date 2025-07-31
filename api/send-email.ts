import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for your domain
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Step 1: Basic test - can we return a response?
    console.log("Step 1: Handler started")

    // Step 2: Check environment variables exist
    console.log("Step 2: Checking env vars")
    console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER)
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS)

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        error: "Missing environment variables",
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
      })
    }

    // Step 3: Try to get request body
    console.log("Step 3: Getting request body")
    const body = req.body || {}
    console.log("Body:", body)

    // Step 4: Check required fields
    if (!body.email || !body.phone) {
      return res.status(400).json({
        error: "Missing email or phone",
        received: body,
      })
    }

    // Step 5: Try to require nodemailer
    console.log("Step 5: Requiring nodemailer")
    let nodemailer
    try {
      nodemailer = require("nodemailer")
      console.log("Nodemailer loaded successfully")
    } catch (err: any) {
      console.error("Nodemailer require failed:", err)
      return res.status(500).json({
        error: "Failed to load nodemailer",
        message: err.message,
      })
    }

    // Step 6: Create transporter
    console.log("Step 6: Creating transporter")
    let transporter
    try {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      console.log("Transporter created")
    } catch (err: any) {
      console.error("Transporter creation failed:", err)
      return res.status(500).json({
        error: "Failed to create transporter",
        message: err.message,
      })
    }

    // Step 7: Send email
    console.log("Step 7: Sending email")
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || "meghahshaha@gmail.com",
        subject: "Test Email",
        text: `Name: ${body.fullName || "Unknown"}\nEmail: ${body.email}\nPhone: ${body.phone}`,
      })

      console.log("Email sent:", info.messageId)

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
      })
    } catch (err: any) {
      console.error("Email send failed:", err)
      return res.status(500).json({
        error: "Failed to send email",
        message: err.message,
        code: err.code,
      })
    }
  } catch (error: any) {
    console.error("Handler error:", error)
    return res.status(500).json({
      error: "Handler failed",
      message: error.message,
      stack: error.stack,
    })
  }
}
