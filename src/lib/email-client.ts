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

// Use the correct domain for production
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://www.lifelongwellness.co.in" : "http://localhost:3000"

// Test the connection first
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Testing connection to:", `${API_BASE_URL}/api/test-email`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/api/test-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: true }),
      credentials: "include",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Test response status:", response.status)

    if (!response.ok) {
      throw new Error(`Test failed with status: ${response.status}`)
    }

    const result = await response.json()
    console.log("Test connection successful:", result)
    return result
  } catch (error: any) {
    console.error("Connection test failed:", error)
    if (error.name === "AbortError") {
      throw new Error("Connection test timed out")
    }
    throw new Error(error.message || "Connection test failed")
  }
}

export const sendEmailRequest = async (data: EmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    // Test connection first
    console.log("Testing connection before sending email...")
    await testConnection()

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
      // Check file size before sending
      if (data.paymentScreenshot.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Please use a file smaller than 5MB.")
      }
      formData.append("paymentScreenshot", data.paymentScreenshot)
    }

    console.log("Sending email request to:", `${API_BASE_URL}/api/send-email`)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log("Request timeout, aborting...")
      controller.abort()
    }, 45000) // 45 second timeout

    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      body: formData,
      credentials: "include",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

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
      throw new Error("Request timed out. Please try again with a smaller file or check your internet connection.")
    }

    if (error.message.includes("net::ERR_CONNECTION_RESET")) {
      throw new Error("Connection was reset. Please check your internet connection and try again.")
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
