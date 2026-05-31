import type { Locale } from "@/lib/i18n-core"

const PLURAL_BLOCK_RE = /\{(\w+),\s*plural,\s*((?:\w+\s*\{[^{}]*\}\s*)+)\}/g
const PLURAL_BRANCH_RE = /(\w+)\s*\{([^{}]*)\}/g

function resolvePlurals(
  template: string,
  vars: Record<string, string | number>,
  locale: Locale
): string {
  return template.replace(PLURAL_BLOCK_RE, (_, varName: string, branchesStr: string) => {
    const count = Number(vars[varName] ?? 0)
    const branches: Record<string, string> = {}
    for (const match of branchesStr.matchAll(PLURAL_BRANCH_RE)) {
      branches[match[1]] = match[2]
    }
    const category = new Intl.PluralRules(locale).select(count)
    const branch = branches[category] ?? branches.other ?? ""
    return branch.replace(/#/g, String(count))
  })
}

/** Replace `{name}` placeholders and ICU `{count, plural, ...}` blocks in translated strings. */
export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
  locale: Locale = "en"
): string {
  const withPlurals = resolvePlurals(template, vars, locale)
  return withPlurals.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  )
}
