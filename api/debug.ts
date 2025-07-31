import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] Debug endpoint called`)

  // Set CORS headers
  const origin = req.headers.origin
  const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8081",
    "https://lifelong-wellness.vercel.app",
    "https://www.lifelongwellness.co.in",
    "https://lifelongwellness.co.in",
  ]

  const isAllowedOrigin =
    origin &&
    (allowedOrigins.includes(origin) ||
      /https:\/\/lifelong-wellness-.*\.vercel\.app/.test(origin) ||
      /https:\/\/lifelong-wellness-git-.*\.vercel\.app/.test(origin))

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    // Check environment variables
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Check if we can import required modules
    const moduleCheck = {
      nodemailer: false,
      formidable: false,
      fs: false,
    }

    try {
      await import("nodemailer")
      moduleCheck.nodemailer = true
    } catch (e) {
      console.error("Nodemailer import failed:", e)
    }

    try {
      await import("formidable")
      moduleCheck.formidable = true
    } catch (e) {
      console.error("Formidable import failed:", e)
    }

    try {
      await import("fs")
      moduleCheck.fs = true
    } catch (e) {
      console.error("FS import failed:", e)
    }

    // Test nodemailer if available
    let transporterTest: string | null = null
    if (moduleCheck.nodemailer && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = await import("nodemailer")
        const transporter = nodemailer.default.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        })

        await transporter.verify()
        transporterTest = "SUCCESS"
      } catch (e: any) {
        transporterTest = `FAILED: ${e.message}`
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      modules: moduleCheck,
      transporterTest,
      headers: {
        "content-type": req.headers["content-type"],
        "user-agent": req.headers["user-agent"],
        origin: req.headers.origin,
      },
      method: req.method,
      url: req.url,
    })
  } catch (error: any) {
    console.error("Debug endpoint error:", error)
    return res.status(500).json({
      success: false,
      message: "Debug endpoint failed",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }
}
