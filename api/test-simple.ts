import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] Simple test endpoint called`)

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
    // Just return basic info
    return res.status(200).json({
      success: true,
      message: "Simple test endpoint working",
      timestamp: new Date().toISOString(),
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"],
        "user-agent": req.headers["user-agent"],
        origin: req.headers.origin,
      },
      body: req.body,
      environment: {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error: any) {
    console.error("Simple test error:", error)
    return res.status(500).json({
      success: false,
      message: "Simple test failed",
      error: error.message,
    })
  }
}
