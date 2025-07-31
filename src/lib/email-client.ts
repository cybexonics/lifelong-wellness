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

// Detect the correct API base URL
const getApiBaseUrl = () => {
  // If we're in the browser, use the current origin
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // For server-side, use environment variable or fallback
  return process.env.NEXT_PUBLIC_API_URL || "https://www.lifelongwellness.co.in"
}

const API_BASE_URL = getApiBaseUrl()

console.log("API_BASE_URL:", API_BASE_URL)

export const sendEmailRequest = async (data: EmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Starting email send process...")
    console.log("Using API base URL:", API_BASE_URL)

    // First, let's test if the API is reachable
    try {
      const testResponse = await fetch(`${API_BASE_URL}/api/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!testResponse.ok) {
        throw new Error(`Test endpoint failed: ${testResponse.status}`)
      }

      console.log("Test endpoint successful")
    } catch (testError: any) {
      console.error("Test endpoint failed:", testError)
      throw new Error(`API not accessible: ${testError.message}`)
    }

    // Prepare request data
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
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Email response status:", response.status)

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
