import { NextResponse } from "next/server"
import { contactMessageSchema, contactMessageToRow } from "@/lib/contact"
import { sendContactConfirmation, sendContactNotification } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    const parsed = contactMessageSchema.safeParse(json)

    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join("; ") || "Invalid form data"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const admin = createAdminClient()
    const row = contactMessageToRow(parsed.data, user?.id ?? null)

    const { error: insertError } = await admin.from("contact_messages").insert(row)

    if (insertError) {
      console.error("contact_messages insert failed:", insertError.message)
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 500 }
      )
    }

    try {
      await sendContactConfirmation(parsed.data)
    } catch (emailError) {
      console.error(
        "contact confirmation email failed:",
        emailError instanceof Error ? emailError.message : emailError
      )
    }

    try {
      await sendContactNotification(parsed.data)
    } catch (emailError) {
      console.error(
        "contact notification email failed:",
        emailError instanceof Error ? emailError.message : emailError
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("contact submit error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    )
  }
}
