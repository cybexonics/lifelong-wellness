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

const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://www.lifelongwellness.co.in" : "http://localhost:3000"

// Debug function to check server status
export const debugServer = async (): Promise<any> => {
  try {
    console.log("Running server debug check...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(`${API_BASE_URL}/api/debug`, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Debug check failed: ${response.status}`)
    }

    const result = await response.json()
    console.log("Debug check result:", result)
    return result
  } catch (error: any) {
    console.error("Debug check failed:", error)
    throw error
  }
}

export const sendEmailRequest = async (data: EmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Starting email send process...")

    // Run debug check first
    try {
      const debugResult = await debugServer()
      console.log("Server debug passed:", debugResult)

      if (!debugResult.environment.EMAIL_USER || !debugResult.environment.EMAIL_PASS) {
        throw new Error("Server email configuration is missing")
      }

      if (!debugResult.modules.nodemailer) {
        throw new Error("Server nodemailer module not available")
      }

      if (!debugResult.modules.formidable) {
        throw new Error("Server formidable module not available")
      }

      if (debugResult.transporterTest && debugResult.transporterTest.includes("FAILED")) {
        throw new Error(`Email service test failed: ${debugResult.transporterTest}`)
      }
    } catch (debugError: any) {
      console.error("Pre-flight debug check failed:", debugError)
      throw new Error(`Server configuration error: ${debugError.message}`)
    }

    const formData = new FormData()

    // Append all fields to FormData
    if (data.name) formData.append("name", data.name)
    if (data.surname) formData.append("surname", data.surname)
    if (data.fullName) formData.append("fullName", data.fullName)
    formData.append("email", data.email)
    formData.append("phone", data.phone)
    if (data.message) formData.append("message", data.message)
    if (data.concern) formData.append("concern", data.concern)
    if (data.consultationType) formData.append("consultationType", data.consultationType)
    formData.append("type", data.type)

    if (data.paymentScreenshot) {
      if (data.paymentScreenshot.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Please use a file smaller than 5MB.")
      }
      formData.append("paymentScreenshot", data.paymentScreenshot)
    }

    console.log("Sending email request...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log("Request timeout, aborting...")
      controller.abort()
    }, 60000) // 60 second timeout

    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      body: formData,
      credentials: "include",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Response received:", response.status, response.statusText)

    if (!response.ok) {
      let errorMessage = "Failed to send email"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        console.error("Server error response:", errorData)
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("Email sent successfully:", result)
    return result
  } catch (error: any) {
    console.error("Email sending error:", error)

    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    }

    throw new Error(error.message || "Failed to send request. Please try again or contact us directly.")
  }
}

export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
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
