import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import multer from "multer"
import path from "path"
import fs from "fs"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
})

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email transporter error:", error)
  } else {
    console.log("✅ Email server is ready to send messages")
  }
})

// Helper function to create professional email template
const createEmailTemplate = (data: any, type: string) => {
  const isConsultation = type === "consultation"
  const title = isConsultation ? "New Consultation Request" : "New Contact Form Submission"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #10b981; }
        .field-label { font-weight: 600; color: #059669; margin-bottom: 5px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
        .field-value { color: #333; font-size: 16px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        .priority { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: 600; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Lifelong Wellness</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${title}</p>
        </div>
        <div class="content">
          ${isConsultation ? '<div class="priority">🚨 PRIORITY: Consultation Request</div>' : ""}
          
          <div class="field">
            <div class="field-label">Full Name</div>
            <div class="field-value">${data.fullName || `${data.name || ""} ${data.surname || ""}`.trim()}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${data.phone}</div>
          </div>
          
          ${
            data.consultationType
              ? `
          <div class="field">
            <div class="field-label">Consultation Type</div>
            <div class="field-value">${data.consultationType}</div>
          </div>
          `
              : ""
          }
          
          ${
            data.message
              ? `
          <div class="field">
            <div class="field-label">Message / Health Concerns</div>
            <div class="field-value">${data.message}</div>
          </div>
          `
              : ""
          }
          
          ${
            data.type === "consultation"
              ? `
          <div class="field">
            <div class="field-label">Request Type</div>
            <div class="field-value">50% OFF Consultation Booking</div>
          </div>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p style="margin: 0; color: #6b7280;">
            📧 Received at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
            Please respond within 24 hours for consultation requests
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Helper function for auto-reply email
const createAutoReplyTemplate = (data: any, type: string) => {
  const isConsultation = type === "consultation"
  const name = data.fullName || `${data.name || ""} ${data.surname || ""}`.trim()

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - Lifelong Wellness</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .highlight { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Lifelong Wellness</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank You for Reaching Out!</p>
        </div>
        <div class="content">
          <h2 style="color: #059669; margin-bottom: 20px;">Dear ${name},</h2>
          
          <p>Thank you for your interest in our holistic wellness services! We have received your ${isConsultation ? "consultation request" : "message"} and are excited to help you on your journey to optimal health.</p>
          
          ${
            isConsultation
              ? `
          <div class="highlight">
            <h3 style="margin: 0 0 10px 0;">🎉 Your 50% OFF Consultation is Reserved!</h3>
            <p style="margin: 0;">We'll contact you within 24 hours to schedule your personalized consultation.</p>
          </div>
          `
              : `
          <div class="highlight">
            <h3 style="margin: 0 0 10px 0;">📞 We'll Be In Touch Soon!</h3>
            <p style="margin: 0;">Our team will respond to your inquiry within 2 hours.</p>
          </div>
          `
          }
          
          <h3 style="color: #059669;">What Happens Next?</h3>
          <ul style="padding-left: 20px;">
            <li>Our wellness coordinator will contact you shortly</li>
            <li>We'll discuss your health goals and concerns</li>
            <li>Schedule your ${isConsultation ? "discounted consultation" : "appointment"} at your convenience</li>
            <li>Begin your personalized healing journey</li>
          </ul>
          
          <div class="contact-info">
            <h4 style="color: #059669; margin-bottom: 15px;">📞 Contact Information</h4>
            <p><strong>Phone:</strong> +91 94210 69326</p>
            <p><strong>WhatsApp:</strong> +91 94210 69326 (24x7 Support)</p>
            <p><strong>Email:</strong>meghahshaha@gmail.com</p>
            <p><strong>Working Hours:</strong> Mon-Sat: 9 AM - 7 PM, Sun: 10 AM - 4 PM</p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to call or WhatsApp us directly.</p>
          
          <p style="margin-top: 30px;">
            Warm regards,<br>
            <strong>Dr. Megha Shaha</strong><br>
            <em>Holistic Wellness Practitioner</em><br>
            Lifelong Wellness
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// API endpoint for sending emails
app.post("/api/send-email", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    console.log("📧 Received email request:", req.body)
    console.log("📎 File uploaded:", req.file ? req.file.filename : "No file")

    const { name, surname, fullName, email, phone, message, consultationType, type } = req.body

    // Validate required fields
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required fields",
      })
    }

    // Determine email type
    const emailType = type === "consultation" || consultationType ? "consultation" : "contact"

    // Prepare email data
    const emailData = {
      fullName: fullName || `${name || ""} ${surname || ""}`.trim(),
      email,
      phone,
      message: message || "",
      consultationType: consultationType || "",
      type,
    }

    // Email options for admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: "meghahshaha@gmail.com",
      subject:
        emailType === "consultation"
          ? `🚨 NEW CONSULTATION REQUEST - ${emailData.fullName}`
          : `📧 New Contact Form Submission - ${emailData.fullName}`,
      html: createEmailTemplate(emailData, emailType),
      attachments: [],
    }

    // Add payment screenshot if uploaded
    if (req.file) {
      adminMailOptions.attachments.push({
        filename: `payment-screenshot-${emailData.fullName.replace(/\s+/g, "-")}.${req.file.originalname
          .split(".")
          .pop()}`,
        path: req.file.path,
      })
    }

    // Auto-reply email options
    const autoReplyOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject:
        emailType === "consultation"
          ? "🌿 Your Consultation Request Received - Lifelong Wellness"
          : "🌿 Thank You for Contacting Us - Lifelong Wellness",
      html: createAutoReplyTemplate(emailData, emailType),
    }

    // Send admin email
    const adminResult = await transporter.sendMail(adminMailOptions)
    console.log("✅ Admin email sent:", adminResult.messageId)

    // Send auto-reply email
    const autoReplyResult = await transporter.sendMail(autoReplyOptions)
    console.log("✅ Auto-reply sent:", autoReplyResult.messageId)

    // Clean up uploaded file after sending email
    if (req.file) {
      setTimeout(() => {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log("Error deleting file:", err)
          else console.log("✅ Uploaded file cleaned up")
        })
      }, 5000) // Delete after 5 seconds
    }

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      adminMessageId: adminResult.messageId,
      autoReplyMessageId: autoReplyResult.messageId,
    })
  } catch (error) {
    console.error("❌ Email sending error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Email server is running",
    timestamp: new Date().toISOString(),
  })
})

// Test email endpoint
app.get("/api/test-email", async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: "rahulsharma18535@gmail.com",
      subject: "🧪 Test Email - Lifelong Wellness Server",
      html: `
        <h2>✅ Email Server Test</h2>
        <p>This is a test email to verify the email server is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        <p><strong>Server Status:</strong> Running</p>
      `,
    }

    const result = await transporter.sendMail(testMailOptions)
    console.log("✅ Test email sent:", result.messageId)

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("❌ Test email error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    })
  }
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on http://localhost:${PORT}`)
  console.log(`📧 Admin email: rahulsharma18535@gmail.com`)
  console.log(`🔧 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🧪 Test email: http://localhost:${PORT}/api/test-email`)

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  WARNING: Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file")
  } else {
    console.log(`✅ Email configured for: ${process.env.EMAIL_USER}`)
  }
})

export default app
