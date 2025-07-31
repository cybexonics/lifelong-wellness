import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] Test endpoint called`)

  // Handle CORS
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

  // Simple test endpoint
  if (req.method === "POST") {
    try {
      const body = req.body || {}
      console.log("Test request body:", body)

      return res.status(200).json({
        success: true,
        message: "Test endpoint working",
        receivedData: body,
        timestamp: new Date().toISOString(),
        headers: {
          "content-type": req.headers["content-type"],
          "user-agent": req.headers["user-agent"],
          origin: req.headers.origin,
        },
      })
    } catch (error: any) {
      console.error("Test endpoint error:", error)
      return res.status(500).json({
        success: false,
        message: "Test endpoint failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
    timestamp: new Date().toISOString(),
  })
}
