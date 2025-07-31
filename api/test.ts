import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    return res.status(200).json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      environment: {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        NODE_ENV: process.env.NODE_ENV,
      },
      method: req.method,
      url: req.url,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    })
  }
}
