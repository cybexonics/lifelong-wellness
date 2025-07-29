export interface EmailRequest {
  name?: string;
  surname?: string;
  fullName?: string;
  email: string;
  phone: string;
  concern?: string;
  message?: string;
  consultationType?: string;
  type: "consultation" | "callback" | "contact";
}

export const sendEmailRequest = async (
  data: EmailRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Sending email request:", data);

    // Prepare the complete request body
    const requestBody = {
      name: data.name || "",
      surname: data.surname || "",
      fullName: data.fullName || `${data.name || ""} ${data.surname || ""}`.trim(),
      email: data.email,
      phone: data.phone,
      message: data.message || data.concern || "",
      consultationType: data.consultationType || "",
      type: data.type,
    };

    const response = await fetch("http://localhost:3001/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send request. Please try again or contact us directly.",
    };
  }
};

// Utility function to check if server is running
export const checkServerHealth = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/health");
    if (!response.ok) {
      throw new Error("Server not healthy");
    }
    return await response.json();
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};