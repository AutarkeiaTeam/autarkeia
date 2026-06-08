import { NewThreadForm } from "@/app/forums/new/new-thread-form"
import { isAuthenticated } from "@/lib/auth-server"

export default async function NewThreadPage() {
  const authed = await isAuthenticated()
  return <NewThreadForm authed={authed} />
}
