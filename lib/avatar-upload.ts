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
