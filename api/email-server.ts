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

// Configure allowed origins (development + production)
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "https://lifelong-wellness.vercel.app",
  /https:\/\/lifelong-wellness-.*\.vercel\.app/,
  /https:\/\/lifelong-wellness-git-.*\.vercel\.app/
];

// Enhanced CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin
      
      // Check against allowed origins
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        return allowed.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF) and PDFs are allowed'));
    }
  }
});

// Email transporter with enhanced configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Only for development/testing
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 10000      // 10 seconds
});

// Verify transporter with retry logic
const verifyTransporter = async (attempts = 3): Promise<void> => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (error) {
    console.error(`❌ SMTP verification failed (attempt ${4 - attempts}/3):`, error);
    if (attempts > 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return verifyTransporter(attempts - 1);
    }
    throw new Error("Failed to verify SMTP connection after 3 attempts");
  }
};

verifyTransporter().catch(err => {
  console.error("Critical SMTP error:", err);
});

// Email template functions with TypeScript interfaces
interface EmailData {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  consultationType?: string;
  type: 'consultation' | 'contact' | 'callback';
}

const createEmailTemplate = (data: EmailData): string => {
  const isConsultation = data.type === "consultation";
  const title = isConsultation ? "New Consultation Request" : "New Contact Form Submission";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #10b981; }
        .field-label { font-weight: 600; color: #047857; margin-bottom: 5px; font-size: 14px; }
        .field-value { color: #1e293b; font-size: 15px; }
        .priority-tag { background: #ef4444; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; display: inline-block; margin-left: 8px; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>${title} ${isConsultation ? '<span class="priority-tag">PRIORITY</span>' : ''}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Client Name</div>
            <div class="field-value">${data.fullName}</div>
          </div>
          <div class="field">
            <div class="field-label">Contact Email</div>
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
          </div>` : ''}
          ${data.message ? `
          <div class="field">
            <div class="field-label">Message</div>
            <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>` : ''}
        </div>
        <div class="footer">
          Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </div>
      </div>
    </body>
    </html>
  `;
};

const createAutoReplyTemplate = (data: EmailData): string => {
  const isConsultation = data.type === "consultation";
  const name = data.fullName.split(' ')[0] || data.fullName;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; text-align: center; }
        .content { padding: 20px; }
        .highlight-box { background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🌿 Lifelong Wellness</h2>
          <p>Thank You for Contacting Us</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <div class="highlight-box">
            <p>We've received your ${isConsultation ? 'consultation request' : 'message'} and will respond within 24 hours.</p>
            ${isConsultation ? '<p><strong>Your 50% OFF consultation is confirmed!</strong></p>' : ''}
          </div>
          
          <p>For immediate assistance, please contact us at:</p>
          <p><strong>Phone/WhatsApp:</strong> +91 94210 69326</p>
          <p><strong>Email:</strong> meghahshaha@gmail.com</p>
          
          <p>We appreciate your interest in our holistic wellness services and look forward to helping you on your health journey.</p>
          
          <p>Warm regards,<br>
          <strong>Dr. Megha Shaha</strong><br>
          Holistic Wellness Practitioner</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply directly to this email.
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint for sending emails with enhanced error handling
app.post(
  "/api/send-email",
  upload.single("paymentScreenshot"),
  async (req, res) => {
    try {
      // Validate required fields
      if (!req.body.email || !req.body.phone) {
        return res.status(400).json({
          success: false,
          message: "Email and phone number are required"
        });
      }

      // Prepare email data
      const emailData: EmailData = {
        fullName: req.body.fullName || `${req.body.name || ''} ${req.body.surname || ''}`.trim(),
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message || req.body.concern || '',
        consultationType: req.body.consultationType || '',
        type: req.body.type || 'contact'
      };

      // Prepare attachments if file was uploaded
      const attachments = req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : [];

      // Send email with retry logic
      const sendWithRetry = async (mailOptions: any, retries = 3) => {
        try {
          return await transporter.sendMail(mailOptions);
        } catch (error) {
          if (retries > 0) {
            console.log(`Retrying email (${retries} attempts left)...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return sendWithRetry(mailOptions, retries - 1);
          }
          throw error;
        }
      };

      // Send to admin
      const adminResult = await sendWithRetry({
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || "cybexonicsitconsultants@gmail.com",
        subject: `New ${emailData.type === 'consultation' ? 'Consultation' : 'Contact'} Request: ${emailData.fullName}`,
        html: createEmailTemplate(emailData),
        attachments
      });

      // Send auto-reply to client
      const autoReplyResult = await sendWithRetry({
        from: `"Lifelong Wellness" <${process.env.EMAIL_USER}>`,
        to: emailData.email,
        subject: emailData.type === 'consultation' 
          ? "Your Consultation Request Received" 
          : "Thank You for Contacting Us",
        html: createAutoReplyTemplate(emailData)
      });

      // Clean up uploaded file
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        data: {
          adminMessageId: adminResult.messageId,
          autoReplyMessageId: autoReplyResult.messageId
        }
      });

    } catch (error: any) {
      console.error("Email sending error:", error);

      // Clean up file if exists
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test email connectivity
    await transporter.verify();
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "email-server",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: "Email service unavailable",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error("Server error:", err);

  // Handle specific error types
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum size is 10MB"
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error",
      error: err.message
    });
  }

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: "Request blocked by CORS policy"
    });
  }

  // Generic error response
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start local server if not in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER}`);
    console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  // Add Vercel-specific headers if needed
  res.setHeader('X-Powered-By', 'Vercel');
  
  // Forward to Express app
  return app(req, res);
};