interface EmailRequest {
  name?: string;
  surname?: string;
  fullName?: string;
  email: string;
  phone: string;
  message?: string;
  consultationType?: string;
  type: 'consultation' | 'callback';
  paymentScreenshot?: File;
}

export const sendEmailRequest = async (data: EmailRequest): Promise<{ 
  success: boolean; 
  message: string;
  adminMessageId?: string;
  autoReplyMessageId?: string;
}> => {
  try {
    const formData = new FormData();
    
    // Append all data fields
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'paymentScreenshot' && value !== undefined) {
        formData.append(key, String(value));
      }
    }

    // Append file if exists
    if (data.paymentScreenshot) {
      formData.append('paymentScreenshot', data.paymentScreenshot);
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData,
      // Headers are automatically set by browser for FormData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    return {
      success: true,
      message: result.message,
      adminMessageId: result.adminMessageId,
      autoReplyMessageId: result.autoReplyMessageId,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send request. Please try again or contact us directly.',
    };
  }
};

// Helper function to use in your components
export const handleEmailSubmit = async (formData: EmailRequest) => {
  const result = await sendEmailRequest(formData);
  
  if (result.success) {
    console.log('Email sent successfully:', result);
    return { success: true, message: 'Your message has been sent successfully!' };
  } else {
    console.error('Failed to send email:', result.message);
    return { success: false, message: result.message };
  }
};