// Email configuration and utility functions
export interface EmailData {
  name: string
  email: string
  phone: string
  concern?: string
  message?: string
}

export const formatEmailContent = (data: EmailData, type: "consultation" | "callback") => {
  const subject =
    type === "consultation"
      ? "New Consultation Request - Lifelong Wellness"
      : "New Call Back Request - Lifelong Wellness"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #22c55e; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Lifelong Wellness</h1>
          <p>New ${type === "consultation" ? "Consultation" : "Call Back"} Request</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Full Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email Address:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone Number:</div>
            <div class="value">${data.phone}</div>
          </div>
          ${
            data.concern
              ? `
          <div class="field">
            <div class="label">Primary Health Concern:</div>
            <div class="value">${data.concern}</div>
          </div>
          `
              : ""
          }
          ${
            data.message
              ? `
          <div class="field">
            <div class="label">${type === "consultation" ? "Message" : "Best Time to Call"}:</div>
            <div class="value">${data.message}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <div class="label">Request Type:</div>
            <div class="value">${type === "consultation" ? "Free Consultation Booking" : "Call Back Request"}</div>
          </div>
          <div class="field">
            <div class="label">Submitted At:</div>
            <div class="value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This request was submitted through the Lifelong Wellness website.</p>
          <p>Please respond within 24 hours for the best customer experience.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject, html }
}
