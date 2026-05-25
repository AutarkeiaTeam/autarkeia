import { z } from "zod"

export const CONTACT_MESSAGE_MAX_LENGTH = 2000

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(320),
  subject: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(CONTACT_MESSAGE_MAX_LENGTH, `Message must be at most ${CONTACT_MESSAGE_MAX_LENGTH} characters`),
})

export type ContactMessageInput = z.infer<typeof contactMessageSchema>

export function contactMessageToRow(data: ContactMessageInput, userId: string | null) {
  const subject = data.subject?.trim()
  return {
    user_id: userId,
    name: data.name,
    email: data.email.toLowerCase(),
    subject: subject ? subject : null,
    message: data.message,
  }
}
