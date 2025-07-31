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

// Test simple endpoint first
export const testSimpleEndpoint = async (): Promise<any> => {
  try {
    console.log("Testing simple endpoint...")

    const response = await fetch(`${API_BASE_URL}/api/test-simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: true }),
      credentials: "include",
    })

    console.log("Simple test response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Simple test failed: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Simple test result:", result)
    return result
  } catch (error: any) {
    console.error("Simple test failed:", error)
    throw error
  }
}

export const sendEmailRequest = async (data: EmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Starting email send process...")

    // Test simple endpoint first
    try {
      await testSimpleEndpoint()
      console.log("Simple endpoint test passed")
    } catch (testError: any) {
      console.error("Simple endpoint test failed:", testError)
      throw new Error(`Server connectivity issue: ${testError.message}`)
    }

    // For now, send as JSON instead of FormData to avoid parsing issues
    const requestData = {
      fullName: data.fullName || `${data.name || ""} ${data.surname || ""}`.trim(),
      email: data.email,
      phone: data.phone,
      message: data.message || data.concern || "",
      consultationType: data.consultationType || "",
      type: data.type,
    }

    console.log("Sending email request with data:", { ...requestData, email: "***", phone: "***" })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log("Request timeout, aborting...")
      controller.abort()
    }, 30000) // 30 second timeout

    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Email response status:", response.status)
    console.log("Email response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorMessage = "Failed to send email"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        console.error("Server error response:", errorData)
      } catch {
        const errorText = await response.text()
        errorMessage = `Server error: ${response.status} - ${errorText}`
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
