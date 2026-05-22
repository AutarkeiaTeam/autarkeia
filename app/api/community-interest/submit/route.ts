import { NextResponse } from "next/server"
import { communityInterestSchema, communityInterestToRow } from "@/lib/community-interest"
import { sendCommunityInterestConfirmation } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    const parsed = communityInterestSchema.safeParse(json)

    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join("; ") || "Invalid form data"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const admin = createAdminClient()
    const row = communityInterestToRow(parsed.data, user?.id ?? null)

    const { error: insertError } = await admin.from("community_interest").insert(row)

    if (insertError) {
      console.error("community_interest insert failed:", insertError.message)
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 }
      )
    }

    try {
      await sendCommunityInterestConfirmation(parsed.data)
    } catch (emailError) {
      console.error(
        "community interest confirmation email failed:",
        emailError instanceof Error ? emailError.message : emailError
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("community-interest submit error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    )
  }
}
