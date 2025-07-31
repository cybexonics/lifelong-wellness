export interface EmailRequest {
  name?: string
  surname?: string
  fullName?: string
  email: string
  phone: string
  concern?: string
  message?: string
  consultationType?: string
  type: "consultation" | "callback" | "contact"
  paymentScreenshot?: File
}

// Use your working domain
const API_BASE_URL = "https://www.lifelongwellness.co.in"

export const sendEmailRequest = async (data: EmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("🚀 Starting email send process...")

    // Prepare request data
    const requestData = {
      fullName: data.fullName || `${data.name || ""} ${data.surname || ""}`.trim(),
      email: data.email,
      phone: data.phone,
      message: data.message || data.concern || "",
      consultationType: data.consultationType || "",
      type: data.type,
    }

    console.log("📤 Sending email request to:", `${API_BASE_URL}/api/send-email`)

    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    console.log("📥 Response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Failed to send email"
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
        console.error("Server error response:", errorData)
      } catch {
        const errorText = await response.text()
        errorMessage = `Server error: ${response.status} - ${errorText}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("✅ Email sent successfully:", result)
    return {
      success: true,
      message: result.message || "Email sent successfully",
    }
  } catch (error: any) {
    console.error("❌ Email sending error:", error)
    throw new Error(error.message || "Failed to send request. Please try again.")
  }
}

export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`)
    if (!response.ok) {
      throw new Error("Server not responding")
    }
    const result = await response.json()
    console.log("Server health check:", result)
    return result
  } catch (error) {
    console.error("Server connection check failed:", error)
    throw error
  }
}
