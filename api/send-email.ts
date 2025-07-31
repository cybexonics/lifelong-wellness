import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { VercelRequest, VercelResponse } from '@vercel/node';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "https://lifelong-wellness.vercel.app",
  "https://www.lifelongwellness.co.in",
  "https://lifelongwellness.co.in",
  /https:\/\/lifelong-wellness-.*\.vercel\.app/,
  /https:\/\/lifelong-wellness-git-.*\.vercel\.app/
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' 
        ? origin === allowed 
        : allowed.test(origin))
    ) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF) and PDFs are allowed'));
    }
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For development only
  }
});

// Verify SMTP connection with retries
const verifySMTPConnection = async (attempts = 3): Promise<void> => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection established');
  } catch (error) {
    console.error(`❌ SMTP connection failed (attempt ${4 - attempts}/3)`);
    if (attempts > 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return verifySMTPConnection(attempts - 1);
    }
    throw new Error('Failed to establish SMTP connection');
  }
};

verifySMTPConnection().catch(err => {
  console.error('Critical SMTP error:', err.message);
});

// Email template functions
const createEmailTemplate = (data: {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  consultationType?: string;
  type: 'consultation' | 'contact' | 'callback';
}): string => {
  const isConsultation = data.type === 'consultation';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .field { margin: 15px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; }
        .priority { background: #dc2626; color: white; padding: 5px 10px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>New ${isConsultation ? 'Consultation' : 'Contact'} Request</p>
        </div>
        
        <div class="field">
          <strong>Name:</strong> ${data.fullName}
        </div>
        
        <div class="field">
          <strong>Email:</strong> ${data.email}
        </div>
        
        <div class="field">
          <strong>Phone:</strong> ${data.phone}
        </div>
        
        ${data.consultationType ? `
        <div class="field">
          <strong>Consultation Type:</strong> ${data.consultationType}
        </div>` : ''}
        
        ${data.message ? `
        <div class="field">
          <strong>Message:</strong> ${data.message.replace(/\n/g, '<br>')}
        </div>` : ''}
      </div>
    </body>
    </html>
  `;
};

const createAutoReplyTemplate = (data: {
  fullName: string;
  type: 'consultation' | 'contact' | 'callback';
}): string => {
  const isConsultation = data.type === 'consultation';
  const firstName = data.fullName.split(' ')[0] || data.fullName;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .highlight { background: #ecfdf5; padding: 15px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>Thank You for Contacting Us</p>
        </div>
        
        <p>Dear ${firstName},</p>
        
        <div class="highlight">
          <p>We've received your ${isConsultation ? 'consultation request' : 'message'} and will respond within 24 hours.</p>
          ${isConsultation ? '<p><strong>Your consultation is confirmed!</strong></p>' : ''}
        </div>
        
        <p>For immediate assistance, please contact us at:</p>
        <p><strong>Phone/WhatsApp:</strong> +91 94210 69326</p>
        <p><strong>Email:</strong> meghahshaha@gmail.com</p>
        
        <p>Best regards,<br>
        <strong>Dr. Megha Shaha</strong><br>
        Lifelong Wellness</p>
      </div>
    </body>
    </html>
  `;
};

// API Endpoints
app.post('/api/send-email', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.email || !req.body.phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone are required fields'
      });
    }

    // Prepare email data
    const emailData = {
      fullName: req.body.fullName || `${req.body.name || ''} ${req.body.surname || ''}`.trim(),
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message || req.body.concern || '',
      consultationType: req.body.consultationType || '',
      type: req.body.type || 'contact'
    };

    // Send email with retry logic
    const sendWithRetry = async (mailOptions: any, retries = 3) => {
      try {
        return await transporter.sendMail(mailOptions);
      } catch (error) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return sendWithRetry(mailOptions, retries - 1);
        }
        throw error;
      }
    };

    // Send to admin
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'meghahshaha@gmail.com',
      subject: `New ${emailData.type === 'consultation' ? 'Consultation' : 'Contact'} Request`,
      html: createEmailTemplate(emailData),
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    });

    // Send auto-reply
    await sendWithRetry({
      from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
      to: emailData.email,
      subject: emailData.type === 'consultation'
        ? 'Your Consultation Request Received'
        : 'Thank You for Contacting Us',
      html: createAutoReplyTemplate(emailData)
    });

    // Clean up file
    if (req.file) fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error: any) {
    console.error('Email error:', error);
    
    // Clean up file if error occurred
    if (req?.file) fs.unlinkSync(req.file.path);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large (max 10MB)' 
        : 'File upload error'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 SMTP: ${process.env.EMAIL_USER}`);
    console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Vercel serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  // Add Vercel-specific headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Powered-By', 'Vercel');
  
  // Forward to Express app
  return app(req, res);
};