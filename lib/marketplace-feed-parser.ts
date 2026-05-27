import { gunzipSync } from "zlib"

/** Parse a single CSV line respecting quoted fields. */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields.map((f) => f.trim())
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length === 0) return []

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    if (values.length === 1 && values[0] === "") continue
    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? ""
    })
    rows.push(row)
  }

  return rows
}

export function decompressFeedBody(buffer: ArrayBuffer): string {
  const bytes = Buffer.from(buffer)
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    return gunzipSync(bytes).toString("utf8")
  }
  return bytes.toString("utf8")
}

export function pickField(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (value?.trim()) return value.trim()
  }
  return ""
}

export function parsePrice(raw: string): number | null {
  if (!raw) return null
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".")
  const num = parseFloat(cleaned)
  return Number.isFinite(num) ? num : null
}

export function parseInStock(raw: string): boolean {
  const v = raw.trim().toLowerCase()
  if (!v) return true
  if (["0", "no", "false", "out of stock", "out_of_stock"].includes(v)) return false
  return true
}

export type AwinFeedListEntry = {
  advertiserId: number
  advertiserName: string
  feedId: number
  lastImported: string
  downloadUrl: string
}

export function parseFeedListCsv(csvText: string): Map<number, AwinFeedListEntry> {
  const rows = parseCsv(csvText)
  const map = new Map<number, AwinFeedListEntry>()

  for (const row of rows) {
    const advertiserId = Number(
      pickField(row, "advertiser_id", "advertiserid") ||
        row["advertiser id"] ||
        ""
    )
    const downloadUrl = pickField(row, "url")
    if (!advertiserId || !downloadUrl) continue

    const feedId = Number(pickField(row, "feed_id", "feedid") || "0")
    map.set(advertiserId, {
      advertiserId,
      advertiserName: pickField(row, "advertiser_name", "advertisername"),
      feedId,
      lastImported: pickField(row, "last_imported", "lastimported"),
      downloadUrl,
    })
  }

  return map
}
