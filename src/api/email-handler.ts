// Express.js API handler (if you're using Express backend)
import express, { Request, Response } from "express"
import * as emailModule from "./send-email"

const router = express.Router()

router.post("/send-email", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, concern, message, type } = req.body

    // Validate required fields
    if (!name || !email || !phone || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, phone, and type are required",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    // Validate type
    if (!["consultation", "callback"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be either "consultation" or "callback"',
      })
    }

    const emailData = { name, email, phone, concern, message }

    // Send email to admin
    const adminEmailResult = await emailModule.sendEmail(emailData, type)

    if (!adminEmailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email to admin",
      })
    }

    // Send auto-reply to user
    const autoReplyResult = await emailModule.sendAutoReply(emailData, type)

    if (!autoReplyResult.success) {
      console.warn("Auto-reply failed, but admin email was sent successfully")
    }

    res.json({
      success: true,
      message: `${type === "consultation" ? "Consultation request" : "Call back request"} sent successfully!`,
      adminEmailId: adminEmailResult.messageId,
      autoReplyId: autoReplyResult.messageId,
    })
  } catch (error) {
    console.error("Email handler error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export default router
