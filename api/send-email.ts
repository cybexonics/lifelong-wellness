import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("=== EMAIL API STARTED ===")

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
      console.log("OPTIONS request handled")
      return res.status(200).end()
    }

    if (req.method !== "POST") {
      console.log("Invalid method:", req.method)
      return res.status(405).json({ error: "Method not allowed" })
    }

    console.log("POST request received")

    // Check environment variables first
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS
    const adminEmail = process.env.ADMIN_EMAIL

    console.log("Environment check:", {
      hasEmailUser: !!emailUser,
      hasEmailPass: !!emailPass,
      hasAdminEmail: !!adminEmail,
    })

    if (!emailUser || !emailPass) {
      console.log("Missing credentials")
      return res.status(400).json({
        error: "Email credentials not configured",
        hasEmailUser: !!emailUser,
        hasEmailPass: !!emailPass,
      })
    }

    // Get request body
    const body = req.body || {}
    console.log("Request body keys:", Object.keys(body))

    // Validate required fields
    if (!body.email || !body.phone) {
      console.log("Missing required fields")
      return res.status(400).json({
        error: "Email and phone are required",
        received: {
          email: !!body.email,
          phone: !!body.phone,
        },
      })
    }

    console.log("Required fields present")

    // Try to import nodemailer safely
    let nodemailer: any
    try {
      console.log("Importing nodemailer...")
      nodemailer = require("nodemailer")
      console.log("Nodemailer imported successfully")
    } catch (importError: any) {
      console.error("Nodemailer import failed:", importError)
      return res.status(500).json({
        error: "Failed to import nodemailer",
        message: importError.message,
      })
    }

    // Create transporter safely
    let transporter: any
    try {
      console.log("Creating transporter...")
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        timeout: 10000, // 10 second timeout
      })
      console.log("Transporter created")
    } catch (transporterError: any) {
      console.error("Transporter creation failed:", transporterError)
      return res.status(500).json({
        error: "Failed to create email transporter",
        message: transporterError.message,
      })
    }

    // Send email safely
    try {
      console.log("Sending email...")

      const mailOptions = {
        from: `"Lifelong Wellness" <${emailUser}>`,
        to: adminEmail || "meghahshaha@gmail.com",
        subject: "New Contact Form Submission",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">🌿 Lifelong Wellness - New Contact</h2>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${body.fullName || "Not provided"}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone}</p>
              <p><strong>Message:</strong> ${body.message || "No message provided"}</p>
              <p><strong>Type:</strong> ${body.type || "contact"}</p>
              <p><strong>Consultation Type:</strong> ${body.consultationType || "N/A"}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", info.messageId)

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
        timestamp: new Date().toISOString(),
      })
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError)
      return res.status(500).json({
        error: "Failed to send email",
        message: emailError.message,
        code: emailError.code || "UNKNOWN",
      })
    }
  } catch (globalError: any) {
    console.error("Global error:", globalError)
    return res.status(500).json({
      error: "Internal server error",
      message: globalError.message,
      stack: globalError.stack?.substring(0, 500),
    })
  }
}
