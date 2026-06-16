import { NextResponse } from "next/server"
import { profileAboutUpdateSchema } from "@/lib/profile-about"
import { profileCommunityToDbUpdates } from "@/lib/profile-community"
import { notificationPreferencesToDbUpdates } from "@/lib/profile-notifications"
import { isUsernameTaken, isValidUsername, sanitizeUsernameInput } from "@/lib/username"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

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
    const parsed = profileAboutUpdateSchema.safeParse(json)

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

    const updates: Record<string, unknown> = {
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

    if (parsed.data.hometown !== undefined) {
      updates.hometown = parsed.data.hometown
    }

    if (parsed.data.currentCity !== undefined) {
      updates.current_city = parsed.data.currentCity
    }

    if (parsed.data.languages !== undefined) {
      updates.languages = parsed.data.languages.length ? parsed.data.languages : null
    }

    if (parsed.data.skills !== undefined) {
      updates.skills = parsed.data.skills.length ? parsed.data.skills : null
    }

    if (parsed.data.prepGoal !== undefined) {
      updates.prep_goal = parsed.data.prepGoal
    }

    if (parsed.data.yearsPreparing !== undefined) {
      updates.years_preparing = parsed.data.yearsPreparing
    }

    if (parsed.data.householdAdults !== undefined) {
      updates.household_adults = parsed.data.householdAdults
    }

    if (parsed.data.householdChildren !== undefined) {
      updates.household_children = parsed.data.householdChildren
    }

    if (parsed.data.householdPets !== undefined) {
      updates.household_pets = parsed.data.householdPets
    }

    if (parsed.data.householdSpecialNeeds !== undefined) {
      updates.household_special_needs = parsed.data.householdSpecialNeeds.length
        ? parsed.data.householdSpecialNeeds
        : null
    }

    if (parsed.data.showHometown !== undefined) {
      updates.show_hometown = nextProfilePublic ? parsed.data.showHometown : false
    }

    if (parsed.data.showCurrentCity !== undefined) {
      updates.show_current_city = nextProfilePublic ? parsed.data.showCurrentCity : false
    }

    if (parsed.data.showLanguages !== undefined) {
      updates.show_languages = nextProfilePublic ? parsed.data.showLanguages : false
    }

    if (parsed.data.showSkills !== undefined) {
      updates.show_skills = nextProfilePublic ? parsed.data.showSkills : false
    }

    if (parsed.data.showPrepGoal !== undefined) {
      updates.show_prep_goal = nextProfilePublic ? parsed.data.showPrepGoal : false
    }

    if (parsed.data.showYearsPreparing !== undefined) {
      updates.show_years_preparing = nextProfilePublic ? parsed.data.showYearsPreparing : false
    }

    if (parsed.data.showHousehold !== undefined) {
      updates.show_household = nextProfilePublic ? parsed.data.showHousehold : false
    }

    Object.assign(updates, profileCommunityToDbUpdates(parsed.data))
    Object.assign(updates, notificationPreferencesToDbUpdates(parsed.data))

    if (parsed.data.showCommunityIntent !== undefined) {
      updates.show_community_intent = nextProfilePublic ? parsed.data.showCommunityIntent : false
    }
    if (parsed.data.showCommunityLocations !== undefined) {
      updates.show_community_locations = nextProfilePublic ? parsed.data.showCommunityLocations : false
    }
    if (parsed.data.showCommunityLivingPref !== undefined) {
      updates.show_community_living_pref = nextProfilePublic ? parsed.data.showCommunityLivingPref : false
    }
    if (parsed.data.showCommunityInvestment !== undefined) {
      updates.show_community_investment = nextProfilePublic ? parsed.data.showCommunityInvestment : false
    }
    if (parsed.data.showCommunityFoodPref !== undefined) {
      updates.show_community_food_pref = nextProfilePublic ? parsed.data.showCommunityFoodPref : false
    }
    if (parsed.data.showCommunityTimeline !== undefined) {
      updates.show_community_timeline = nextProfilePublic ? parsed.data.showCommunityTimeline : false
    }

    if (parsed.data.profilePublic === false) {
      updates.show_quiz_scores = false
      updates.show_country = false
      updates.show_hometown = false
      updates.show_current_city = false
      updates.show_languages = false
      updates.show_skills = false
      updates.show_prep_goal = false
      updates.show_years_preparing = false
      updates.show_household = false
      updates.show_community_intent = false
      updates.show_community_locations = false
      updates.show_community_living_pref = false
      updates.show_community_investment = false
      updates.show_community_food_pref = false
      updates.show_community_timeline = false
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
