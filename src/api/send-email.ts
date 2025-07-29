// API route for sending emails
import nodemailer from "nodemailer"
import { type EmailData, formatEmailContent } from "../lib/email"

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  })
}

export const sendEmail = async (data: EmailData, type: "consultation" | "callback") => {
  try {
    const transporter = createTransporter()
    const { subject, html } = formatEmailContent(data, type)

    const mailOptions = {
      from: {
        name: "Lifelong Wellness Website",
        address: process.env.EMAIL_USER || "noreply@lifelongwellness.com",
      },
      to: "rahulsharma18535@gmail.com", // Destination email
      subject: subject,
      html: html,
      replyTo: data.email, // Allow direct reply to the user
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Auto-reply email to the user
export const sendAutoReply = async (data: EmailData, type: "consultation" | "callback") => {
  try {
    const transporter = createTransporter()

    const autoReplyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You - Lifelong Wellness</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
          .contact-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Lifelong Wellness</h1>
            <p>Thank you for reaching out!</p>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            
            <p>Thank you for your interest in our holistic healing services. We have received your ${type === "consultation" ? "consultation request" : "call back request"} and are excited to help you on your wellness journey.</p>
            
            <div class="highlight">
              <h3>What happens next?</h3>
              <ul>
                <li>Dr. Megha Shaha will personally review your request</li>
                <li>We'll contact you within 24 hours to schedule your ${type === "consultation" ? "free consultation" : "call"}</li>
                <li>You'll receive a confirmation with all the details</li>
              </ul>
            </div>
            
            <p>In the meantime, feel free to explore our website to learn more about our natural healing methods and success stories.</p>
            
            <div class="contact-info">
              <h3>Contact Information:</h3>
              <p><strong>Phone:</strong> +91 94210 69326</p>
              <p><strong>Email:</strong> hello@lifelongwellness.com</p>
              <p><strong>WhatsApp:</strong> Available 24x7 for support</p>
            </div>
            
            <p>We look forward to supporting you in achieving optimal health naturally!</p>
            
            <p>With gratitude,<br>
            <strong>Dr. Megha Shaha</strong><br>
            Lifelong Wellness</p>
          </div>
          <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>If you have urgent questions, please call us at +91 94210 69326</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: {
        name: "Dr. Megha Shaha - Lifelong Wellness",
        address: process.env.EMAIL_USER || "noreply@lifelongwellness.com",
      },
      to: data.email,
      subject: `Thank you for your ${type === "consultation" ? "consultation request" : "call back request"} - Lifelong Wellness`,
      html: autoReplyHtml,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Auto-reply sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending auto-reply:", error)
    return { success: false, error: error.message }
  }
}
