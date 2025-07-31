export interface EmailRequest {
  name?: string;
  surname?: string;
  fullName?: string;
  email: string;
  phone: string;
  concern?: string;
  message?: string;
  consultationType?: string;
  type: 'consultation' | 'callback' | 'contact';
  paymentScreenshot?: File;
}

const API_BASE_URL = 'https://www.lifelongwellness.co.in/api';

export const sendEmailRequest = async (
  data: EmailRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();

    // Append all fields to FormData
    if (data.name) formData.append('name', data.name);
    if (data.surname) formData.append('surname', data.surname);
    if (data.fullName) formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    if (data.message) formData.append('message', data.message);
    if (data.concern) formData.append('concern', data.concern);
    if (data.consultationType) formData.append('consultationType', data.consultationType);
    formData.append('type', data.type);
    if (data.paymentScreenshot) {
      formData.append('paymentScreenshot', data.paymentScreenshot);
    }

    const response = await fetch(`${API_BASE_URL}/send-email`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Email sending error:', error);
    throw new Error(
      error.message || 'Failed to send request. Please try again or contact us directly.'
    );
  }
};

export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Server not responding');
    }
    return await response.json();
  } catch (error) {
    console.error('Server connection check failed:', error);
    throw error;
  }
};