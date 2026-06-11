"use client"

import { FormEvent, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { initialsFromDisplayName } from "@/lib/avatar-initials"
import {
  AVATAR_BUCKET,
  avatarStoragePath,
  avatarUrlWithCacheBust,
  resizeAvatarToWebp,
  validateAvatarFile,
} from "@/lib/avatar-upload"
import { createClient } from "@/lib/supabase/client"
import { supabaseClient } from "@/lib/supabase-client"
import type { Tier } from "@/lib/auth-server"
import {
  oauthProviderSecurityUrl,
  showsPasswordForm,
  type PrimaryAuthMethod,
} from "@/lib/account-auth"
import { AboutMeForm } from "@/components/account/about-me-form"
import { CommunityPreferencesForm } from "@/components/account/community-preferences-form"
import { NotificationPreferencesForm } from "@/components/account/notification-preferences-form"
import type { ProfileAboutData } from "@/lib/profile-about"
import type { ProfileCommunityData } from "@/lib/profile-community"
import type { NotificationPreferencesData } from "@/lib/profile-notifications"
import { isValidUsername, sanitizeUsernameInput } from "@/lib/username"

const BIO_MAX = 280

type AccountSettingsProps = {
  userId: string
  email: string
  displayName: string
  username: string
  bio: string
  avatarUrl: string | null
  siteHost: string
  profilePublic: boolean
  showQuizScores: boolean
  showCountry: boolean
  memberSince: string
  tier: Tier
  authMethod: PrimaryAuthMethod
  aboutMe: ProfileAboutData
  communityPreferences: ProfileCommunityData
  notificationPreferences: NotificationPreferencesData
}

function fieldClassName() {
  return "w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
}

function labelClassName() {
  return "mb-1.5 block text-xs font-medium text-[#3d5166]"
}

function readOnlyClassName() {
  return "rounded-lg border border-[#e8edf2] bg-[#f9fafc] px-4 py-2.5 text-sm text-[#3d5166]"
}

export function AccountSettings({
  userId,
  email,
  displayName: initialDisplayName,
  username: initialUsername,
  bio: initialBio,
  avatarUrl: initialAvatarUrl,
  siteHost,
  profilePublic: initialProfilePublic,
  showQuizScores: initialShowQuizScores,
  showCountry: initialShowCountry,
  memberSince,
  tier,
  authMethod,
  aboutMe,
  communityPreferences,
  notificationPreferences,
}: AccountSettingsProps) {
  const { t, locale } = useI18n()
  const router = useRouter()

  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)
  const [infoMessage, setInfoMessage] = useState("")
  const [infoError, setInfoError] = useState("")
  const [isSavingInfo, setIsSavingInfo] = useState(false)
  const [avatarError, setAvatarError] = useState("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [profilePublic, setProfilePublic] = useState(initialProfilePublic)
  const [showQuizScores, setShowQuizScores] = useState(initialShowQuizScores)
  const [showCountry, setShowCountry] = useState(initialShowCountry)
  const [privacyMessage, setPrivacyMessage] = useState("")
  const [privacyError, setPrivacyError] = useState("")
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const memberSinceLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    return formatter.format(new Date(memberSince))
  }, [locale, memberSince])

  const canChangePassword = showsPasswordForm(authMethod)
  const oauthSecurityUrl =
    authMethod.type === "oauth-only"
      ? oauthProviderSecurityUrl(authMethod.oauthProvider)
      : null

  const clearSignOutCookies = () => {
    document.cookie = "autarkeia-user=; path=/; max-age=0; SameSite=Lax"
    document.cookie = "autarkeia-email=; path=/; max-age=0; SameSite=Lax"
    document.cookie = "autarkeia-tier=; path=/; max-age=0; SameSite=Lax"
    window.dispatchEvent(new Event("autarkeia-auth-change"))
  }

  const translateAccountError = (message: string) =>
    message.startsWith("account.") ? t(message) : message

  const avatarInitials = useMemo(
    () => initialsFromDisplayName(displayName, username),
    [displayName, username]
  )

  const patchProfile = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }
    if (!response.ok) {
      throw new Error(data?.error || "account.info.save_error")
    }
  }

  const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setAvatarError("")
    const validationError = validateAvatarFile(file)
    if (validationError === "format") {
      setAvatarError(t("account.info.avatar_error_format"))
      return
    }
    if (validationError === "size") {
      setAvatarError(t("account.info.avatar_error_size"))
      return
    }

    try {
      setIsUploadingAvatar(true)
      const blob = await resizeAvatarToWebp(file)
      const supabase = createClient()
      const path = avatarStoragePath(userId)
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, blob, { upsert: true, contentType: "image/webp" })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
      const publicUrl = avatarUrlWithCacheBust(publicData.publicUrl)
      await patchProfile({ avatarUrl: publicUrl })
      setAvatarUrl(publicUrl)
      window.dispatchEvent(new Event("autarkeia-auth-change"))
      router.refresh()
    } catch {
      setAvatarError(t("account.info.save_error"))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarError("")
    try {
      setIsRemovingAvatar(true)
      const supabase = createClient()
      await supabase.storage.from(AVATAR_BUCKET).remove([avatarStoragePath(userId)])
      await patchProfile({ avatarUrl: null })
      setAvatarUrl(null)
      window.dispatchEvent(new Event("autarkeia-auth-change"))
      router.refresh()
    } catch {
      setAvatarError(t("account.info.save_error"))
    } finally {
      setIsRemovingAvatar(false)
    }
  }

  const handleSaveInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setInfoMessage("")
    setInfoError("")

    const trimmed = displayName.trim().slice(0, 50)
    if (!trimmed) {
      setInfoError(t("account.info.display_name_required"))
      return
    }

    const normalizedUsername = sanitizeUsernameInput(username)
    if (!normalizedUsername) {
      setInfoError(t("account.info.username_required"))
      return
    }
    if (!isValidUsername(normalizedUsername)) {
      setInfoError(t("account.info.username_invalid"))
      return
    }

    const trimmedBio = bio.trim().slice(0, BIO_MAX)

    try {
      setIsSavingInfo(true)
      await patchProfile({
        displayName: trimmed,
        username: normalizedUsername,
        bio: trimmedBio,
      })

      setDisplayName(trimmed)
      setUsername(normalizedUsername)
      setBio(trimmedBio)
      setInfoMessage(t("account.info.save_success"))
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "account.info.save_error"
      setInfoError(translateAccountError(message))
    } finally {
      setIsSavingInfo(false)
    }
  }

  const handleSavePrivacy = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPrivacyMessage("")
    setPrivacyError("")

    try {
      setIsSavingPrivacy(true)
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePublic,
          showQuizScores: profilePublic ? showQuizScores : false,
          showCountry: profilePublic ? showCountry : false,
        }),
      })
      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }

      if (!response.ok) {
        throw new Error(data?.error || "account.public_profile.save_error")
      }

      if (!profilePublic) {
        setShowQuizScores(false)
        setShowCountry(false)
      }

      setPrivacyMessage(t("account.public_profile.save_success"))
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "account.public_profile.save_error"
      setPrivacyError(translateAccountError(message))
    } finally {
      setIsSavingPrivacy(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError(t("account.password.current_required"))
      return
    }
    if (newPassword.length < 8) {
      setPasswordError(t("account.password.too_short"))
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("account.password.mismatch"))
      return
    }

    try {
      setIsSavingPassword(true)
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })

      if (signInError) {
        setPasswordError(t("account.password.current_incorrect"))
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordMessage(t("account.password.success"))
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t("account.password.update_error"))
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      setDeleteError("")

      const res = await fetch("/api/account/delete", { method: "POST" })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setDeleteError(
          typeof data?.error === "string" ? data.error : t("account.delete.error")
        )
        return
      }

      await supabaseClient.auth.signOut().catch(() => undefined)
      clearSignOutCookies()
      router.push("/?account_deleted=1")
      router.refresh()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t("account.delete.error"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-light text-[#0d1b2a]">{t("account.title")}</h1>
          <p className="mt-1 text-sm text-[#3d5166]">{t("account.subtitle")}</p>
        </header>

        <div className="space-y-6">
          <section
            className="rounded-2xl border border-[#d4dce8] bg-white p-6"
            style={{ borderWidth: "0.5px" }}
          >
            <h2 className="text-lg font-medium text-[#0d1b2a]">{t("account.info.heading")}</h2>
            <form onSubmit={handleSaveInfo} className="mt-5 space-y-4">
              <div>
                <p className={labelClassName()}>{t("account.info.avatar_label")}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <UserAvatar src={avatarUrl} fallbackInitials={avatarInitials} size={96} />
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => void handleAvatarSelect(e)}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar || isRemovingAvatar}
                      className="rounded-lg border border-[#d4dce8] bg-white px-4 py-2 text-sm font-medium text-[#0d1b2a] hover:border-[#009b70] disabled:opacity-60"
                    >
                      {isUploadingAvatar
                        ? t("account.info.avatar_uploading")
                        : t("account.info.avatar_upload_button")}
                    </button>
                    {avatarUrl ? (
                      <button
                        type="button"
                        onClick={() => void handleRemoveAvatar()}
                        disabled={isUploadingAvatar || isRemovingAvatar}
                        className="rounded-lg border border-[#d4dce8] bg-white px-4 py-2 text-sm font-medium text-[#9f1d1d] hover:border-[#c43a3a] disabled:opacity-60"
                      >
                        {t("account.info.avatar_remove_button")}
                      </button>
                    ) : null}
                  </div>
                </div>
                {avatarError ? <p className="mt-2 text-sm text-red-600">{avatarError}</p> : null}
              </div>
              <div>
                <label htmlFor="display-name" className={labelClassName()}>
                  {t("account.info.display_name_label")}
                </label>
                <input
                  id="display-name"
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={fieldClassName()}
                />
                <p className="mt-1.5 text-xs text-[#8a9bb0]">
                  {t("account.info.display_name_helper")}
                </p>
              </div>
              <div>
                <label htmlFor="username" className={labelClassName()}>
                  {t("account.info.username_label")}
                </label>
                <input
                  id="username"
                  type="text"
                  maxLength={30}
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                  }
                  className={fieldClassName()}
                  autoComplete="username"
                  spellCheck={false}
                />
                <p className="mt-1.5 text-xs text-[#8a9bb0]">{t("account.info.username_helper")}</p>
                {username.trim() ? (
                  <p className="mt-1 text-xs text-[#3d5166]">
                    {t("account.info.username_preview")
                      .replace("{host}", siteHost)
                      .replace("{username}", sanitizeUsernameInput(username) || "yourname")}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="bio" className={labelClassName()}>
                  {t("account.info.bio_label")}
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  maxLength={BIO_MAX}
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                  className={`${fieldClassName()} resize-y`}
                />
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-[#8a9bb0]">{t("account.info.bio_helper")}</p>
                  <p className="text-xs text-[#8a9bb0]">
                    {t("account.info.bio_counter")
                      .replace("{count}", String(bio.length))
                      .replace("{max}", String(BIO_MAX))}
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClassName()}>{t("account.info.email_label")}</label>
                <p className={readOnlyClassName()}>{email}</p>
                <p className="mt-1.5 text-xs text-[#8a9bb0]">{t("account.info.email_change_note")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClassName()}>{t("account.info.member_since_label")}</label>
                  <p className={readOnlyClassName()}>{memberSinceLabel}</p>
                </div>
                <div>
                  <label className={labelClassName()}>{t("account.info.plan_label")}</label>
                  <p className={readOnlyClassName()}>
                    {tier === "pro" ? t("account.info.plan_pro") : t("account.info.plan_free")}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSavingInfo}
                className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
              >
                {isSavingInfo ? t("account.info.saving") : t("account.info.save")}
              </button>
              {infoMessage && <p className="text-sm text-[#009b70]">{infoMessage}</p>}
              {infoError && <p className="text-sm text-red-600">{infoError}</p>}
            </form>
          </section>

          <AboutMeForm initial={aboutMe} />

          <NotificationPreferencesForm initial={notificationPreferences} />

          <CommunityPreferencesForm initial={communityPreferences} />

          <section
            className="rounded-2xl border border-[#d4dce8] bg-white p-6"
            style={{ borderWidth: "0.5px" }}
          >
            <h2 className="text-lg font-medium text-[#0d1b2a]">
              {t("account.public_profile.heading")}
            </h2>
            <p className="mt-1 text-sm text-[#3d5166]">{t("account.public_profile.description")}</p>
            <form onSubmit={handleSavePrivacy} className="mt-5 space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setProfilePublic(checked)
                    if (!checked) {
                      setShowQuizScores(false)
                      setShowCountry(false)
                    }
                  }}
                  className="mt-1 h-4 w-4 rounded border-[#d4dce8] text-[#009b70] focus:ring-[#009b70]"
                />
                <span>
                  <span className="block text-sm font-medium text-[#0d1b2a]">
                    {t("account.public_profile.make_public")}
                  </span>
                  <span className="mt-1 block text-xs text-[#8a9bb0]">
                    {t("account.public_profile.make_public_helper")}
                  </span>
                </span>
              </label>
              <label className={`flex items-start gap-3 ${profilePublic ? "" : "opacity-50"}`}>
                <input
                  type="checkbox"
                  checked={showQuizScores}
                  disabled={!profilePublic}
                  onChange={(e) => setShowQuizScores(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#d4dce8] text-[#009b70] focus:ring-[#009b70] disabled:cursor-not-allowed"
                />
                <span>
                  <span className="block text-sm font-medium text-[#0d1b2a]">
                    {t("account.public_profile.show_quiz_scores")}
                  </span>
                  <span className="mt-1 block text-xs text-[#8a9bb0]">
                    {t("account.public_profile.show_quiz_scores_helper")}
                  </span>
                </span>
              </label>
              <label className={`flex items-start gap-3 ${profilePublic ? "" : "opacity-50"}`}>
                <input
                  type="checkbox"
                  checked={showCountry}
                  disabled={!profilePublic}
                  onChange={(e) => setShowCountry(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#d4dce8] text-[#009b70] focus:ring-[#009b70] disabled:cursor-not-allowed"
                />
                <span>
                  <span className="block text-sm font-medium text-[#0d1b2a]">
                    {t("account.public_profile.show_country")}
                  </span>
                  <span className="mt-1 block text-xs text-[#8a9bb0]">
                    {t("account.public_profile.show_country_helper")}
                  </span>
                </span>
              </label>
              <button
                type="submit"
                disabled={isSavingPrivacy}
                className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
              >
                {isSavingPrivacy
                  ? t("account.public_profile.saving")
                  : t("account.public_profile.save")}
              </button>
              {privacyMessage && <p className="text-sm text-[#009b70]">{privacyMessage}</p>}
              {privacyError && <p className="text-sm text-red-600">{privacyError}</p>}
            </form>
          </section>

          <section
            className="rounded-2xl border border-[#d4dce8] bg-white p-6"
            style={{ borderWidth: "0.5px" }}
          >
            {canChangePassword ? (
              <>
                <h2 className="text-lg font-medium text-[#0d1b2a]">{t("account.password.heading")}</h2>
                <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="current-password" className={labelClassName()}>
                      {t("account.password.current_label")}
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={fieldClassName()}
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className={labelClassName()}>
                      {t("account.password.new_label")}
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={fieldClassName()}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className={labelClassName()}>
                      {t("account.password.confirm_label")}
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={fieldClassName()}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="rounded-lg border border-[#d4dce8] bg-white px-5 py-2.5 text-sm font-medium text-[#0d1b2a] hover:border-[#009b70] disabled:opacity-60"
                  >
                    {isSavingPassword ? t("account.password.submitting") : t("account.password.submit")}
                  </button>
                  {passwordMessage && <p className="text-sm text-[#009b70]">{passwordMessage}</p>}
                  {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-medium text-[#0d1b2a]">
                  {t("account.password.oauth_only_heading")}
                </h2>
                <p className="mt-2 text-sm text-[#3d5166]">{t("account.password.oauth_only_body")}</p>
                {oauthSecurityUrl ? (
                  <a
                    href={oauthSecurityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-lg border border-[#d4dce8] bg-white px-5 py-2.5 text-sm font-medium text-[#0d1b2a] hover:border-[#009b70]"
                  >
                    {t("account.password.oauth_open_provider")}
                  </a>
                ) : null}
              </>
            )}
          </section>

          <section
            className="rounded-2xl border border-[#d4dce8] bg-white p-6"
            style={{ borderWidth: "0.5px" }}
          >
            <h2 className="text-lg font-medium text-[#0d1b2a]">{t("account.language.heading")}</h2>
            <p className="mt-1 text-sm text-[#3d5166]">{t("account.language.description")}</p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </section>

          <section
            className="rounded-2xl border border-[#f5c2c2] bg-white p-6"
            style={{ borderWidth: "0.5px" }}
          >
            <h2 className="text-lg font-medium text-[#9f1d1d]">{t("account.delete.heading")}</h2>
            <p className="mt-1 text-sm text-[#3d5166]">{t("account.delete.description")}</p>
            <button
              type="button"
              onClick={() => {
                setDeleteOpen(true)
                setDeleteError("")
              }}
              className="mt-4 rounded-lg border border-[#c43a3a] bg-white px-5 py-2.5 text-sm font-medium text-[#9f1d1d] hover:bg-[#fff5f5]"
            >
              {t("account.delete.button")}
            </button>
          </section>
        </div>
      </div>

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1b2a]/40 px-4">
          <div
            className="w-full max-w-md rounded-2xl border border-[#f5c2c2] bg-white p-6 shadow-xl"
            style={{ borderWidth: "0.5px" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <h3 id="delete-account-title" className="text-lg font-medium text-[#0d1b2a]">
              {t("account.delete.confirm_heading")}
            </h3>
            <p className="mt-2 text-sm text-[#3d5166]">{t("account.delete.confirm_body")}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={isDeleting}
                autoFocus
                className="rounded-lg border border-[#d4dce8] px-5 py-2.5 text-sm font-medium text-[#3d5166] hover:bg-[#f5f7fa] disabled:opacity-60"
              >
                {t("account.delete.cancel")}
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={isDeleting}
                className="rounded-lg bg-[#9f1d1d] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7f1515] disabled:opacity-60"
              >
                {isDeleting ? t("account.delete.deleting") : t("account.delete.confirm_button")}
              </button>
            </div>
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
          </div>
        </div>
      ) : null}
    </main>
  )
}
