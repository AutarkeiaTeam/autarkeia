import { NextResponse } from "next/server"
import { z } from "zod"
import { isUsernameTaken, isValidUsername, sanitizeUsernameInput } from "@/lib/username"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

const profileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(1).max(50).optional(),
    username: z.string().trim().optional(),
    bio: z.string().max(280).optional(),
    avatarUrl: z.union([z.string().url(), z.null()]).optional(),
    profilePublic: z.boolean().optional(),
    showQuizScores: z.boolean().optional(),
    showCountry: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.displayName !== undefined ||
      data.username !== undefined ||
      data.bio !== undefined ||
      data.avatarUrl !== undefined ||
      data.profilePublic !== undefined ||
      data.showQuizScores !== undefined ||
      data.showCountry !== undefined,
    { message: "account.validation.nothing_to_update" }
  )

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
    }

    const json = await request.json().catch(() => null)
    const parsed = profileUpdateSchema.safeParse(json)

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || "account.validation.invalid_form_data"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: current, error: currentError } = await admin
      .from("profiles")
      .select("username, profile_public")
      .eq("id", user.id)
      .maybeSingle()

    if (currentError || !current) {
      return NextResponse.json({ error: "account.info.save_error" }, { status: 500 })
    }

    const updates: Record<string, string | boolean | null> = {
      updated_at: new Date().toISOString(),
    }

    if (parsed.data.displayName !== undefined) {
      updates.display_name = parsed.data.displayName
    }

    if (parsed.data.bio !== undefined) {
      const trimmedBio = parsed.data.bio.trim()
      updates.bio = trimmedBio || null
    }

    if (parsed.data.avatarUrl !== undefined) {
      updates.avatar_url = parsed.data.avatarUrl
    }

    if (parsed.data.username !== undefined) {
      const username = sanitizeUsernameInput(parsed.data.username)
      if (!isValidUsername(username)) {
        return NextResponse.json({ error: "account.info.username_invalid" }, { status: 400 })
      }

      if (username !== current.username?.toLowerCase()) {
        if (await isUsernameTaken(username, user.id)) {
          return NextResponse.json({ error: "account.info.username_taken" }, { status: 409 })
        }
        updates.username = username
      }
    }

    const nextProfilePublic =
      parsed.data.profilePublic !== undefined
        ? parsed.data.profilePublic
        : current.profile_public

    if (parsed.data.profilePublic !== undefined) {
      updates.profile_public = parsed.data.profilePublic
    }

    if (parsed.data.showQuizScores !== undefined) {
      updates.show_quiz_scores = nextProfilePublic ? parsed.data.showQuizScores : false
    }

    if (parsed.data.showCountry !== undefined) {
      updates.show_country = nextProfilePublic ? parsed.data.showCountry : false
    }

    if (parsed.data.profilePublic === false) {
      updates.show_quiz_scores = false
      updates.show_country = false
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json({ error: "account.info.username_taken" }, { status: 409 })
      }
      console.error("account profile update failed:", updateError.message)
      return NextResponse.json({ error: "account.info.save_error" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("account profile PATCH error:", err)
    return NextResponse.json({ error: "account.info.save_error" }, { status: 500 })
  }
}
