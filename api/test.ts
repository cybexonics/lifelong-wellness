import type { VercelRequest, VercelResponse } from "@vercel/node"

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[${new Date().toISOString()}] Test API called`)

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  return res.status(200).json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      "user-agent": req.headers["user-agent"],
    },
    environment: {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
    },
  })
}
