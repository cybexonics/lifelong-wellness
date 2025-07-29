import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { Request, Response } from 'express';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Updated CORS for production
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads (memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.log('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

const createEmailTemplate = (data: any, type: string) => {
  const isConsultation = type === 'consultation';
  const title = isConsultation ? 'New Consultation Request' : 'New Contact Form Submission';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #10b981; }
        .field-label { font-weight: 600; color: #059669; margin-bottom: 5px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
        .field-value { color: #333; font-size: 16px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        .priority { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: 600; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Lifelong Wellness</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${title}</p>
        </div>
        <div class="content">
          ${isConsultation ? '<div class="priority">🚨 PRIORITY: Consultation Request</div>' : ''}
          
          <div class="field">
            <div class="field-label">Full Name</div>
            <div class="field-value">${data.fullName || `${data.name || ''} ${data.surname || ''}`.trim()}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${data.phone}</div>
          </div>
          
          ${data.consultationType ? `
          <div class="field">
            <div class="field-label">Consultation Type</div>
            <div class="field-value">${data.consultationType}</div>
          </div>
          ` : ''}
          
          ${data.message ? `
          <div class="field">
            <div class="field-label">Message / Health Concerns</div>
            <div class="field-value">${data.message}</div>
          </div>
          ` : ''}
          
          ${data.type === 'consultation' ? `
          <div class="field">
            <div class="field-label">Request Type</div>
            <div class="field-value">50% OFF Consultation Booking</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p style="margin: 0; color: #6b7280;">
            📧 Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const createAutoReplyTemplate = (data: any, type: string) => {
  const isConsultation = type === 'consultation';
  const name = data.fullName || `${data.name || ''} ${data.surname || ''}`.trim();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - Lifelong Wellness</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .highlight { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Lifelong Wellness</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank You for Reaching Out!</p>
        </div>
        <div class="content">
          <h2 style="color: #059669; margin-bottom: 20px;">Dear ${name},</h2>
          
          <p>Thank you for your interest in our holistic wellness services! We have received your ${isConsultation ? 'consultation request' : 'message'} and are excited to help you on your journey to optimal health.</p>
          
          ${isConsultation ? `
          <div class="highlight">
            <h3 style="margin: 0 0 10px 0;">🎉 Your 50% OFF Consultation is Reserved!</h3>
            <p style="margin: 0;">We'll contact you within 24 hours to schedule your personalized consultation.</p>
          </div>
          ` : `
          <div class="highlight">
            <h3 style="margin: 0 0 10px 0;">📞 We'll Be In Touch Soon!</h3>
            <p style="margin: 0;">Our team will respond to your inquiry within 2 hours.</p>
          </div>
          `}
          
          <h3 style="color: #059669;">What Happens Next?</h3>
          <ul style="padding-left: 20px;">
            <li>Our wellness coordinator will contact you shortly</li>
            <li>We'll discuss your health goals and concerns</li>
            <li>Schedule your ${isConsultation ? 'discounted consultation' : 'appointment'} at your convenience</li>
            <li>Begin your personalized healing journey</li>
          </ul>
          
          <div class="contact-info">
            <h4 style="color: #059669; margin-bottom: 15px;">📞 Contact Information</h4>
            <p><strong>Phone:</strong> +91 94210 69326</p>
            <p><strong>WhatsApp:</strong> +91 94210 69326 (24x7 Support)</p>
            <p><strong>Email:</strong> meghahshaha@gmail.com</p>
          </div>
          
          <p style="margin-top: 30px;">
            Warm regards,<br>
            <strong>Dr. Megha Shaha</strong><br>
            <em>Holistic Wellness Practitioner</em><br>
            Lifelong Wellness
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint for sending emails
app.post('/api/send-email', upload.single('paymentScreenshot'), async (req: Request, res: Response) => {
  try {
    console.log('📧 Received email request:', req.body);

    const { name, surname, fullName, email, phone, message, consultationType, type } = req.body;

    // Validate required fields
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone are required fields',
      });
    }

    const emailType = type === 'consultation' || consultationType ? 'consultation' : 'contact';
    const emailData = {
      fullName: fullName || `${name || ''} ${surname || ''}`.trim(),
      email,
      phone,
      message: message || '',
      consultationType: consultationType || '',
      type,
    };

    // Email options
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'meghahshaha@gmail.com',
      subject: emailType === 'consultation'
        ? `🚨 NEW CONSULTATION REQUEST - ${emailData.fullName}`
        : `📧 New Contact Form Submission - ${emailData.fullName}`,
      html: createEmailTemplate(emailData, emailType),
      attachments: [] as any[],
    };

    // Add attachment if exists
    if (req.file) {
      adminMailOptions.attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    // Auto-reply email
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailType === 'consultation'
        ? '🌿 Your Consultation Request Received - Lifelong Wellness'
        : '🌿 Thank You for Contacting Us - Lifelong Wellness',
      html: createAutoReplyTemplate(emailData, emailType),
    };

    // Send both emails in parallel
    const [adminResult, autoReplyResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyOptions),
    ]);

    console.log('✅ Emails sent successfully');
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      adminMessageId: adminResult.messageId,
      autoReplyMessageId: autoReplyResult.messageId,
    });
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Email server is running',
    timestamp: new Date().toISOString(),
  });
});

// Export for Vercel serverless
module.exports = app;