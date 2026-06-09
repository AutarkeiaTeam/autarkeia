#!/usr/bin/env node
/**
 * Merges verified Awin feed picks into data/marketplace-curated-catalog.json.
 * Product rows verified against production marketplace_products (Jun 2026).
 */
import { readFileSync, writeFileSync } from "fs"

const catalogPath = "data/marketplace-curated-catalog.json"
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"))

const shipping = {
  ES: { eligible: true, cost: "€0–€12", estimated_days: "3–7", notes: "Ships from EU/ES warehouse." },
  DE: { eligible: true, cost: "€8–€18", estimated_days: "5–9", notes: "Ships from Germany; EU delivery." },
  NL: { eligible: true, cost: "€8–€18", estimated_days: "5–9", notes: "Ships from Netherlands; EU delivery." },
  IE: { eligible: true, cost: "€10–€20", estimated_days: "5–10", notes: "Ships from Ireland; EU delivery." },
  EU: { eligible: true, cost: "€10–€22", estimated_days: "5–12", notes: "Ships from EU hub." },
  IT: { eligible: true, cost: "€10–€20", estimated_days: "5–10", notes: "Ships from Italy; EU delivery." },
  US: { eligible: true, cost: "€25–€65", estimated_days: "10–18", notes: "International ship from US; customs may apply." },
  CA: { eligible: true, cost: "€30–€70", estimated_days: "12–21", notes: "International ship from Canada." },
  AU: { eligible: true, cost: "€35–€75", estimated_days: "14–21", notes: "International ship from Australia." },
}

/** @type {Array<{slug:string,pick:object}>} */
const AWIN_PICKS = [
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "43009253733",
      sku: "awin:32269:43009253733",
      brand_slug: "bluetti",
      advertiser_id: 32269,
      name_en: "BLUETTI AC200L Portable Power Station (2,048 Wh)",
      name_es: "BLUETTI AC200L Estación Portátil (2.048 Wh)",
      price_eur: 1599,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.shopify.com%2Fs%2Ffiles%2F1%2F0550%2F5620%2F3836%2Ffiles%2Fac200l-front-view.webp",
      deep_link: "https://www.awin1.com/pclick.php?p=43009253733&a=2900523&m=32269",
      feed_country: "CA",
      use_case: "large_power_station",
      rationale_en: "2,048 Wh LiFePO₄; 2,400 W AC; expandable B210 battery — whole-room essentials backup.",
      rationale_es: "2.048 Wh LiFePO₄; 2.400 W CA; batería B210 ampliable — respaldo para estancias completas.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "43880845965",
      sku: "awin:30415:43880845965",
      brand_slug: "jackery",
      advertiser_id: 30415,
      name_en: "Jackery Explorer 240 Portable Power Station",
      name_es: "Jackery Explorer 240 Estación de Energía Portátil",
      price_eur: 179,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.shopify.com%2Fs%2Ffiles%2F1%2F0572%2F7217%2F2741%2Ffiles%2FEU-E240.jpg",
      deep_link: "https://www.awin1.com/pclick.php?p=43880845965&a=2900523&m=30415",
      feed_country: "DE",
      use_case: "entry_power_station",
      rationale_en: "240 Wh; 200 W AC; MPPT solar input; ships from DE warehouse to Spain in ~5–9 days.",
      rationale_es: "240 Wh; 200 W CA; entrada solar MPPT; envío desde Alemania a España en ~5–9 días.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "33339833237",
      sku: "awin:30415:33339833237",
      brand_slug: "jackery",
      advertiser_id: 30415,
      name_en: "Jackery SolarSaga 100W Solar Panel",
      name_es: "Jackery SolarSaga Panel Solar 100W",
      price_eur: 249,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.shopify.com%2Fs%2Ffiles%2F1%2F0572%2F7217%2F2741%2Ffiles%2F100Weu.png",
      deep_link: "https://www.awin1.com/pclick.php?p=33339833237&a=2900523&m=30415",
      feed_country: "DE",
      use_case: "foldable_solar_panel",
      rationale_en: "100 W foldable panel; 23.7% efficiency; IP68; dual USB — pairs with Jackery DE stations.",
      rationale_es: "100 W plegable; 23,7 % eficiencia; IP68; doble USB — combina con estaciones Jackery DE.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "41835369552",
      sku: "awin:107468:41835369552",
      brand_slug: "allpowers",
      advertiser_id: 107468,
      name_en: "ALLPOWERS R600 Portable Power Station (299 Wh)",
      name_es: "ALLPOWERS R600 Estación Portátil (299 Wh)",
      price_eur: 219,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aiallpowers.es%2Fcdn%2Fshop%2Ffiles%2FR600.png",
      deep_link: "https://www.awin1.com/pclick.php?p=41835369552&a=2900523&m=107468",
      feed_country: "ES",
      use_case: "compact_power_station",
      rationale_en: "299 Wh LiFePO₄; 600 W AC; ES storefront feed — fastest EU ship for ALLPOWERS in Spain.",
      rationale_es: "299 Wh LiFePO₄; 600 W CA; feed ES — envío ALLPOWERS más rápido dentro de la UE para España.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "41835369545",
      sku: "awin:107468:41835369545",
      brand_slug: "allpowers",
      advertiser_id: 107468,
      name_en: "ALLPOWERS SP033 200W Portable Solar Panel",
      name_es: "ALLPOWERS SP033 Panel Solar Portátil 200W",
      price_eur: 239.99,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aiallpowers.es%2Fcdn%2Fshop%2Ffiles%2FSP033.png",
      deep_link: "https://www.awin1.com/pclick.php?p=41835369545&a=2900523&m=107468",
      feed_country: "ES",
      use_case: "foldable_solar_panel",
      rationale_en: "200 W foldable monocrystalline; ES feed; pairs with R600/R1500 for daily solar top-up.",
      rationale_es: "200 W monocristalino plegable; feed ES; combina con R600/R1500 para recarga solar diaria.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "41835369610",
      sku: "awin:107468:41835369610",
      brand_slug: "allpowers",
      advertiser_id: 107468,
      name_en: "ALLPOWERS R1500 LITE Portable Power Station (1,056 Wh)",
      name_es: "ALLPOWERS R1500 LITE Estación Portátil (1.056 Wh)",
      price_eur: 499,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aiallpowers.es%2Fcdn%2Fshop%2Ffiles%2FR1500-lite.png",
      deep_link: "https://www.awin1.com/pclick.php?p=41835369610&a=2900523&m=107468",
      feed_country: "ES",
      use_case: "mid_power_station",
      rationale_en: "1,056 Wh LiFePO₄; 1,600 W AC; ES feed — mid-tier whole-home essentials backup.",
      rationale_es: "1.056 Wh LiFePO₄; 1.600 W CA; feed ES — respaldo medio para electrodomésticos esenciales.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "42612268328",
      sku: "awin:51793:42612268328",
      brand_slug: "ecoflow",
      advertiser_id: 51793,
      name_en: "EcoFlow RIVER 2 Max Portable Power Station",
      name_es: "EcoFlow RIVER 2 Max Estación de Energía Portátil",
      price_eur: 349,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Ade.ecoflow.com%2Fcdn%2Fshop%2Ffiles%2Friver-2-max.png",
      deep_link: "https://www.awin1.com/pclick.php?p=42612268328&a=2900523&m=51793",
      feed_country: "DE",
      use_case: "compact_power_station",
      rationale_en: "512 Wh LFP; 500 W AC; fast X-Stream charge; DE feed ships across EU including Spain.",
      rationale_es: "512 Wh LFP; 500 W CA; carga rápida X-Stream; feed DE con envío UE incluido España.",
      free_tier_pick: false,
    },
  },
  {
    slug: "energy",
    pick: {
      source: "awin",
      id: "43814107577",
      sku: "awin:123332:43814107577",
      brand_slug: "ecoflow",
      advertiser_id: 123332,
      name_en: "EcoFlow DELTA 2 Portable Power Station",
      name_es: "EcoFlow DELTA 2 Estación de Energía Portátil",
      price_eur: 748,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Anl.ecoflow.com%2Fcdn%2Fshop%2Ffiles%2Fdelta-2.png",
      deep_link: "https://www.awin1.com/pclick.php?p=43814107577&a=2900523&m=123332",
      feed_country: "NL",
      use_case: "large_power_station",
      rationale_en: "1,024 Wh LFP; 1,800 W AC; expandable extra battery — NL feed, EU-wide shipping.",
      rationale_es: "1.024 Wh LFP; 1.800 W CA; batería extra ampliable — feed NL con envío en la UE.",
      free_tier_pick: false,
    },
  },
  {
    slug: "tools",
    pick: {
      source: "awin",
      id: "38044154672",
      sku: "awin:37550:38044154672",
      brand_slug: "decathlon-ireland",
      advertiser_id: 37550,
      name_en: "Decathlon Modular Silent Hunting Backpack 45/90 L",
      name_es: "Decathlon Mochila Modular Caza Silenciosa 45/90 L",
      price_eur: 145,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.decathlon.ie%2Fproducts%2F8612345",
      deep_link: "https://www.awin1.com/pclick.php?p=38044154672&a=2900523&m=37550",
      feed_country: "IE",
      use_case: "hunting_backpack",
      rationale_en: "Expandable 45→90 L; silent fabric; modular straps — bug-out and field-load hauler.",
      rationale_es: "Expandible 45→90 L; tejido silencioso; correas modulares — mochila de evacuación y campo.",
      free_tier_pick: false,
    },
  },
  {
    slug: "tools",
    pick: {
      source: "awin",
      id: "37600039606",
      sku: "awin:37550:37600039606",
      brand_slug: "decathlon-ireland",
      advertiser_id: 37550,
      name_en: "Decathlon Folding Camping Table (4–6 people)",
      name_es: "Decathlon Mesa Plegable de Camping (4–6 personas)",
      price_eur: 45,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.decathlon.ie%2Fproducts%2F8612346",
      deep_link: "https://www.awin1.com/pclick.php?p=37600039606&a=2900523&m=37550",
      feed_country: "IE",
      use_case: "camp_table",
      rationale_en: "Aluminium folding table; seats 4–6; 5.9 kg — camp kitchen and indoor backup surface.",
      rationale_es: "Mesa plegable aluminio; 4–6 personas; 5,9 kg — cocina de campamento y superficie de respaldo.",
      free_tier_pick: false,
    },
  },
  {
    slug: "tools",
    pick: {
      source: "awin",
      id: "34727011527",
      sku: "awin:37550:34727011527",
      brand_slug: "decathlon-ireland",
      advertiser_id: 37550,
      name_en: "Decathlon Treemetic Adjustable Tripod",
      name_es: "Decathlon Trípode Ajustable Treemetic",
      price_eur: 27,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.decathlon.ie%2Fproducts%2F8612347",
      deep_link: "https://www.awin1.com/pclick.php?p=34727011527&a=2900523&m=37550",
      feed_country: "IE",
      use_case: "field_tripod",
      rationale_en: "Adjustable steel tripod; stable observation and optics mount for field use.",
      rationale_es: "Trípode acero ajustable; soporte estable para observación y óptica en campo.",
      free_tier_pick: false,
    },
  },
  {
    slug: "shelter",
    pick: {
      source: "awin",
      id: "35915204778",
      sku: "awin:37550:35915204778",
      brand_slug: "decathlon-ireland",
      advertiser_id: 37550,
      name_en: "Decathlon Arpenaz 4.1 Camping Tent (4 person)",
      name_es: "Decathlon Tienda de Campaña Arpenaz 4.1 (4 personas)",
      price_eur: 130,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.decathlon.ie%2Fproducts%2F8612348",
      deep_link: "https://www.awin1.com/pclick.php?p=35915204778&a=2900523&m=37550",
      feed_country: "IE",
      use_case: "family_tent",
      rationale_en: "4-person dome tent; 1 bedroom; freestanding poles — family camp or guest shelter.",
      rationale_es: "Tienda cúpula 4 personas; 1 dormitorio; varillas autónomas — campamento familiar o refugio.",
      free_tier_pick: false,
    },
  },
  {
    slug: "security",
    pick: {
      source: "awin",
      id: "41687872710",
      sku: "awin:88727:41687872710",
      brand_slug: "survival-frog",
      advertiser_id: 88727,
      name_en: "Survival Frog Tact Bivvy 2.0 Emergency Sleeping Bag",
      name_es: "Survival Frog Saco Tact Bivvy 2.0 de Emergencia",
      price_eur: 24.97,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.survivalfrog.com%2Fproducts%2Ftact-bivvy",
      deep_link: "https://www.awin1.com/pclick.php?p=41687872710&a=2900523&m=88727",
      feed_country: "US",
      use_case: "emergency_bivvy",
      rationale_en: "Heat-reflective emergency bivvy; 4.8 oz; packs glove-box small — core go-bag warmth layer.",
      rationale_es: "Bivouac reflectante de emergencia; 136 g; cabe en guantera — capa térmica esencial del kit.",
      free_tier_pick: false,
    },
  },
  {
    slug: "security",
    pick: {
      source: "awin",
      id: "41687872749",
      sku: "awin:88727:41687872749",
      brand_slug: "survival-frog",
      advertiser_id: 88727,
      name_en: "Survival Frog 6-in-1 Tactical Knife",
      name_es: "Survival Frog Cuchillo Táctico 6 en 1",
      price_eur: 29.97,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.survivalfrog.com%2Fproducts%2Ftactical-knife",
      deep_link: "https://www.awin1.com/pclick.php?p=41687872749&a=2900523&m=88727",
      feed_country: "US",
      use_case: "tactical_knife",
      rationale_en: "Stainless 6-in-1 blade with seatbelt cutter, glass breaker, and fire starter.",
      rationale_es: "Hoja acero 6 en 1 con cortacinturones, rompecristales y encendedor.",
      free_tier_pick: false,
    },
  },
  {
    slug: "security",
    pick: {
      source: "awin",
      id: "41687872688",
      sku: "awin:88727:41687872688",
      brand_slug: "survival-frog",
      advertiser_id: 88727,
      name_en: "Survival Frog Hydrostop Dry Bag (Medium)",
      name_es: "Survival Frog Bolsa Estanca Hydrostop (Mediana)",
      price_eur: 24.97,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.survivalfrog.com%2Fproducts%2Fhydrostop-dry-bag",
      deep_link: "https://www.awin1.com/pclick.php?p=41687872688&a=2900523&m=88727",
      feed_country: "US",
      use_case: "dry_bag",
      rationale_en: "Roll-top waterproof dry bag; keeps documents, electronics, and meds dry in transit.",
      rationale_es: "Bolsa estanca enrollable; protege documentos, electrónica y medicación en tránsito.",
      free_tier_pick: false,
    },
  },
  {
    slug: "lighting",
    pick: {
      source: "awin",
      id: "41687872713",
      sku: "awin:88727:41687872713",
      brand_slug: "survival-frog",
      advertiser_id: 88727,
      name_en: "Survival Frog Mini Rechargeable Tact Flashlight",
      name_es: "Survival Frog Mini Linterna Táctica Recargable",
      price_eur: 19.97,
      image_url:
        "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Awww.survivalfrog.com%2Fproducts%2Ftact-flashlight",
      deep_link: "https://www.awin1.com/pclick.php?p=41687872713&a=2900523&m=88727",
      feed_country: "US",
      use_case: "tactical_flashlight",
      rationale_en: "USB-rechargeable pocket torch; multiple modes; clips to kit for blackout and patrol.",
      rationale_es: "Linterna bolsillo USB; varios modos; engancha al kit para apagones y patrullas.",
      free_tier_pick: false,
    },
  },
]

for (const { slug, pick } of AWIN_PICKS) {
  const cat = catalog.categories.find((c) => c.slug === slug)
  if (!cat) throw new Error(`Missing category ${slug}`)
  const ship = shipping[pick.feed_country] ?? shipping.EU
  cat.products.push({
    stock_status: "awin_feed_in_stock",
    ...pick,
    shipping_spain: ship,
  })
}

catalog.generated_at = new Date().toISOString()
catalog.notes =
  "Amazon picks verified via scripts/_amazon_es_probe.mjs. Awin picks verified against production marketplace_products feed (Jun 2026). Awin products are Pro-only (free_tier_pick: false)."

const counts = {}
for (const cat of catalog.categories) {
  const amazon = cat.products.filter((p) => p.source === "amazon").length
  const awin = cat.products.filter((p) => p.source === "awin").length
  counts[cat.slug] = { amazon, awin, total: cat.products.length }
}

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")
console.log("Updated catalog counts:", counts)
console.log(
  "Pro total:",
  catalog.categories.reduce((n, c) => n + c.products.length, 0)
)
console.log(
  "Free tier picks:",
  catalog.categories.reduce(
    (n, c) => n + c.products.filter((p) => p.free_tier_pick).length,
    0
  )
)
