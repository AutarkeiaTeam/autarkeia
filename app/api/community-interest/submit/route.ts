import { NextResponse } from "next/server"
import { communityInterestSchema, communityInterestToRow } from "@/lib/community-interest"
import { communityInterestInputToProfileFields } from "@/lib/profile-community"
import { sendCommunityInterestConfirmation } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    const parsed = communityInterestSchema.safeParse(json)

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || "communities.validation.invalid_form_data"
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
        { error: "communities.validation.submit_save_failed" },
        { status: 500 }
      )
    }

    if (user?.id) {
      const profileUpdates = communityInterestInputToProfileFields(parsed.data)
      const { error: profileError } = await admin
        .from("profiles")
        .update({ ...profileUpdates, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (profileError) {
        console.error("community interest profile sync failed:", profileError.message)
        return NextResponse.json(
          { error: "communities.validation.submit_save_failed" },
          { status: 500 }
        )
      }
    }

    try {
      await sendCommunityInterestConfirmation(parsed.data, parsed.data.locale)
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
      { error: err instanceof Error ? err.message : "communities.validation.submit_failed" },
      { status: 500 }
    )
  }
}
