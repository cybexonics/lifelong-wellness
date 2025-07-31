import type { VercelRequest, VercelResponse } from "@vercel/node"

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
      return res.status(200).end()
    }

    return res.status(200).json({
      success: true,
      message: "Test endpoint working!",
      timestamp: new Date().toISOString(),
      method: req.method,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
