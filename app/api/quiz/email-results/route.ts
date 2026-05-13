import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const quizType = typeof body?.quizType === "string" ? body.quizType : ""

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  if (quizType !== "emergency-readiness" && quizType !== "self-sufficiency") {
    return NextResponse.json({ error: "Invalid quiz type." }, { status: 400 })
  }

  // Placeholder: wire to Resend / SendGrid / etc. in production
  return NextResponse.json({
    ok: true,
    message:
      "Thanks — in production we would email your score breakdown and product recommendations. You can still create an account later to save progress.",
  })
}
