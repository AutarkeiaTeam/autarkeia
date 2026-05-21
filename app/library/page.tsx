import { LibraryView } from "@/components/library/library-view"
import { getProAccess } from "@/lib/subscription"

export default async function LibraryPage() {
  const hasPro = await getProAccess()
  return <LibraryView hasPro={hasPro} />
}
