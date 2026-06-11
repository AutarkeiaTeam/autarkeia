const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_BUCKET = "avatars"
export const AVATAR_FILENAME = "avatar.webp"

export type AvatarFileError = "size" | "format"

export function validateAvatarFile(file: File): AvatarFileError | null {
  if (!ACCEPTED_TYPES.has(file.type)) return "format"
  if (file.size > AVATAR_MAX_BYTES) return "size"
  return null
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("image_load_failed"))
    }
    img.src = url
  })
}

function fitWithin(width: number, height: number, maxDim: number) {
  if (width <= maxDim && height <= maxDim) {
    return { width, height }
  }
  const scale = maxDim / Math.max(width, height)
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

export async function resizeAvatarToWebp(
  file: File,
  maxDim = 400,
  quality = 0.85
): Promise<Blob> {
  const img = await loadImage(file)
  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, maxDim)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas_unavailable")
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode_failed"))),
      "image/webp",
      quality
    )
  })
}

export function avatarStoragePath(userId: string): string {
  return `${userId}/${AVATAR_FILENAME}`
}

/** Strip any query string (e.g. prior ?v= cache bust) from a stored avatar URL. */
export function avatarUrlBase(publicUrl: string): string {
  return publicUrl.split("?")[0] ?? publicUrl
}

/** Append ?v=timestamp so browsers and Supabase CDN fetch the latest upload. */
export function avatarUrlWithCacheBust(publicUrl: string, version = Date.now()): string {
  return `${avatarUrlBase(publicUrl)}?v=${version}`
}

export const AVATAR_IMAGE_PRELOAD_TIMEOUT_MS = 5000

/** Warm browser cache before swapping avatar src to avoid initials fallback flash. */
export function preloadAvatarImageUrl(
  url: string,
  timeoutMs = AVATAR_IMAGE_PRELOAD_TIMEOUT_MS
): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      resolve()
    }

    const timer = window.setTimeout(done, timeoutMs)
    const img = new Image()

    const onReady = () => {
      if (typeof img.decode === "function") {
        void img.decode().then(done).catch(done)
      } else {
        done()
      }
    }

    img.onload = onReady
    img.onerror = done
    img.src = url

    if (img.complete && img.naturalWidth > 0) {
      onReady()
    }
  })
}
