import nodemailer from 'nodemailer';
import 'dotenv/config';
sgMail.setDataResidency('eu');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setDataResidency('eu');

// Create transporter using SendGrid SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // This is literally the word 'apikey'
    pass: process.env.SENDGRID_API_KEY // Store API key in env variable
  }
});

export async function sendEmail(emailData, type) {
  try {
    const info = await transporter.sendMail({
      from: 'meghalifelongwellness@gmail.com', // must be your verified sender
      to: 'meghalifelongwellness@gmail.com',
      subject: type === 'consultation'
        ? 'New Consultation Request'
        : 'New Callback Request',
      text: `
        Name: ${emailData.name}
        Email: ${emailData.email}
        Phone: ${emailData.phone}
        Concern: ${emailData.concern || 'N/A'}
        Message: ${emailData.message || 'N/A'}
      `
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Error sending admin email:', err);
    return { success: false };
  }
}

export async function sendAutoReply(emailData, type) {
  try {
    const info = await transporter.sendMail({
      from: 'meghalifelongwellness@gmail.com',
      to: emailData.email,
      subject: 'We received your request',
      text: `Hi ${emailData.name},\n\nWe have received your ${
        type === 'consultation' ? 'consultation request' : 'callback request'
      } and will get back to you soon.\n\nThank you,\nLifelong Wellness`
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Error sending auto-reply:', err);
    return { success: false };
  }
}