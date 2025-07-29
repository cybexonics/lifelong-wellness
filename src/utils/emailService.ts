// Email service utility for sending consultation and callback requests
export interface EmailRequestData {
  name?: string
  fullName?: string
  email: string
  phone: string
  concern?: string
  message?: string
  type: "consultation" | "callback" | "contact" | "booking"
  consultationType?: string
}

export interface EmailResponse {
  success: boolean
  message: string
}

// Get the API base URL based on environment
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return ""
  }
  // In development, use localhost
  return "http://localhost:3001"
}

export const sendEmailRequest = async (data: EmailRequestData): Promise<EmailResponse> => {
  try {
    const apiUrl = `${getApiBaseUrl()}/api/send-email`

    console.log("Sending email request to:", apiUrl)
    console.log("Request data:", data)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        message: result.message || "Email sent successfully! We'll contact you soon.",
      }
    } else {
      throw new Error(result.message || "Failed to send email")
    }
  } catch (error) {
    console.error("Email service error:", error)

    // Provide user-friendly error messages
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      return {
        success: false,
        message: "Connection error. Please check your internet connection and try again.",
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    }
  }
}
