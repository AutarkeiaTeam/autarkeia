export type AffiliateLinkSource = "email" | "web"

export type AffiliateLinkOptions = {
  source: AffiliateLinkSource
  campaign: string
}

export type AffiliateCatalogProduct = {
  seller_name: string
  base_url: string
  advertiser_id?: number
  is_store_card?: boolean
}

const DEFAULT_AMAZON_ASSOCIATES_TAG = "autarkeia-es"

/** Shared Amazon Associates tag for marketplace, quiz email, and other affiliate links. */
export function getAmazonAssociatesTag(): string {
  return process.env.AMAZON_ASSOCIATES_TAG?.trim() || DEFAULT_AMAZON_ASSOCIATES_TAG
}

function awinPublisherId(): string | undefined {
  return process.env.AWIN_PUBLISHER_ID?.trim() || undefined
}

function utmParams(options: AffiliateLinkOptions): Record<string, string> {
  return {
    utm_source: options.source,
    utm_medium: options.campaign,
    utm_campaign: "affiliate",
  }
}

function appendQueryParams(url: string, params: Record<string, string>): string {
  try {
    const parsed = new URL(url)
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, value)
    }
    return parsed.toString()
  } catch {
    return url
  }
}

function buildAmazonAffiliateUrl(
  baseUrl: string,
  options: AffiliateLinkOptions
): string {
  const tag = amazonAssociatesTag()
  try {
    const parsed = new URL(baseUrl)
    if (tag) parsed.searchParams.set("tag", tag)
    for (const [key, value] of Object.entries(utmParams(options))) {
      parsed.searchParams.set(key, value)
    }
    return parsed.toString()
  } catch {
    return appendQueryParams(baseUrl, { tag, ...utmParams(options) })
  }
}

function awinClickRef(options: AffiliateLinkOptions): string {
  return `${options.source}_${options.campaign}`
}

function buildAwinAffiliateUrl(
  product: AffiliateCatalogProduct,
  options: AffiliateLinkOptions
): string {
  if (product.is_store_card) return product.base_url

  const publisherId = awinPublisherId()
  const clickref = awinClickRef(options)
  const deepLink = product.base_url

  if (!publisherId) return deepLink

  try {
    const parsed = new URL(deepLink)
    if (parsed.hostname.includes("awin1.com")) {
      parsed.searchParams.set("clickref", clickref)
      return parsed.toString()
    }
  } catch {
    return deepLink
  }

  if (!product.advertiser_id) return deepLink

  const ued = encodeURIComponent(deepLink)
  return `https://www.awin1.com/cread.php?awinmid=${product.advertiser_id}&awinaffid=${publisherId}&ued=${ued}&clickref=${encodeURIComponent(clickref)}`
}

/** Build a tracked affiliate URL; falls back to the plain catalog URL when env vars are missing. */
export function buildAffiliateUrl(
  product: AffiliateCatalogProduct,
  options: AffiliateLinkOptions
): string {
  if (product.seller_name === "Amazon") {
    return buildAmazonAffiliateUrl(product.base_url, options)
  }

  return buildAwinAffiliateUrl(product, options)
}
