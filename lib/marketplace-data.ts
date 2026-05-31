export type MarketplaceCategory =
  | "Water"
  | "Food"
  | "Shelter"
  | "Energy"
  | "Medical"
  | "Tools"
  | "Clothing"
  | "Security"
  | "Communications"
  | "Navigation"
  | "Garden & Harvest"
  | "Air Quality"

export const GARDEN_HARVEST_SLUG = "garden-harvest"

/** Visible category chips for free members and visitors (10 categories). */
export const MARKETPLACE_FILTER_CATEGORIES: MarketplaceCategory[] = [
  "Water",
  "Food",
  "Shelter",
  "Energy",
  "Medical",
  "Tools",
  "Security",
  "Communications",
  "Clothing",
  "Garden & Harvest",
]

/** Pro-only Amazon category (AlorAir / dehumidifiers — not shown in free filter chips). */
export const MARKETPLACE_PRO_ONLY_CATEGORIES: MarketplaceCategory[] = ["Air Quality"]

export const MARKETPLACE_FREE_AMAZON_CATEGORIES: MarketplaceCategory[] = [
  ...MARKETPLACE_FILTER_CATEGORIES,
]

const PRODUCTS_PER_CATEGORY = 36

export type MarketplaceProduct = {
  id: number
  category: MarketplaceCategory
  seller: MarketplaceSeller
  name: string
  description: string
  price: string
  affiliate: string
}

export type MarketplaceSeller = "Amazon" | (string & {})

export const MARKETPLACE_SELLERS: MarketplaceSeller[] = ["Amazon"]

export function buildMarketplaceSellers(awinSellerNames: string[]): MarketplaceSeller[] {
  return ["Amazon", ...awinSellerNames]
}

export type MarketplaceBundle = {
  name: string
  items: string
  original: string
  price: string
  savings: string
  affiliate: string
}

const ADJ = [
  "Field",
  "Compact",
  "Pro",
  "Tactical",
  "Home",
  "Trail",
  "Resilience",
  "Rural",
  "Backup",
  "Modular",
]

const PRODUCT_NAMES: Record<MarketplaceCategory, string[]> = {
  Water: [
    "Gravity filter kit",
    "Ceramic cartridge set",
    "Rain diverter",
    "First-flush device",
    "IBC tote adapter",
    "Hand pump",
    "UV pen",
    "TDS meter",
    "Hose reel",
    "Storage drum 220L",
    "Inline sediment filter",
    "Shower filter",
    "Water level alarm",
    "Desalination membrane",
    "Siphon kit",
    "Bulkhead fitting pack",
    "Water pasteurization indicator",
    "Collapsible jerrycan",
    "Foot pump faucet",
    "Bladder tank 100L",
  ],
  Food: [
    "Freeze-dried bucket",
    "Calorie bar crate",
    "Bulk oats sack",
    "Honey pail",
    "Salt block",
    "Pressure canner",
    "Dehydrator trays",
    "Mylar bag sealer",
    "Oxygen absorber pack",
    "Vacuum sealer",
    "Fermentation weights",
    "Sprouting jar kit",
    "Manual grain mill",
    "Jerky marinade mix",
    "Lentil bulk bag",
    "Coconut oil tub",
    "Ghee storage tin",
    "Root cellar thermometer",
    "Canning jar lifter",
    "Food-grade drum wrench",
  ],
  Shelter: [
    "Insulated tarp",
    "Reflective bubble insulation",
    "Emergency tent 4p",
    "Sleeping bag -15°C",
    "Bivvy sack pair",
    "Paracord 550 100m",
    "Ground sheet",
    "Tent seam sealer",
    "Storm peg set",
    "Ridge pole repair sleeve",
    "Window film insulation",
    "Door draft stopper",
    "Portable wood stove",
    "Chimney flashing kit",
    "Straw bale needles",
    "Cob plaster trowel",
    "Timber framing square",
    "Vapor barrier roll",
    "Vented soffit baffles",
    "Roofing underlayment",
  ],
  Energy: [
    "LiFePO4 100Ah",
    "MPPT 40A controller",
    "400W rigid panel",
    "Inverter 2000W pure sine",
    "DC fuse block",
    "Solar extension cables",
    "Wind turbine 400W",
    "Charge controller dump load",
    "Battery monitor shunt",
    "DC-DC charger 12-12",
    "Generator wheel kit",
    "Stabil fuel treatment",
    "LED lantern USB-C",
    "Hand crank radio light",
    "Candle lantern",
    "Power strip surge",
    "Extension cord 25m",
    "Work light tripod",
    "12V fuse assortment",
    "MC4 branch connectors",
  ],
  Medical: [
    "CAT tourniquet",
    "Israeli bandage",
    "Chest seal twin pack",
    "Burn gel dressings",
    "SAM splint roll",
    "Suture practice kit",
    "N95 respirator box",
    "Nitrile gloves case",
    "Iodine tablets",
    "Oral rehydration salts",
    "Finger pulse oximeter",
    "BP cuff manual",
    "Glucose test strips",
    "EpiPen trainer pair",
    "SAM splint finger",
    "Trauma shears",
    "Medical tape silk",
    "Saline wash bottles",
    "Cold pack instant",
    "First aid field manual",
  ],
  Tools: [
    "Folding saw",
    "Axes sharpening puck",
    "Bolt cutter 24in",
    "Socket set metric",
    "Torque wrench",
    "Multimeter clamp",
    "Wire stripper crimper",
    "Pry bar set",
    "Sledge 4lb",
    "Pick mattock",
    "Post hole digger",
    "Shovel trenching",
    "Rake steel",
    "Wheelbarrow pneumatic",
    "Chainsaw chain 18in",
    "File guide kit",
    "Oil can pump",
    "Greased bearings kit",
    "Rope hoist 400kg",
    "Workbench vise portable",
  ],
  Clothing: [
    "Merino base layer top",
    "Merino base layer bottom",
    "Insulated parka",
    "Rain shell jacket",
    "Rain pants",
    "Wool socks 6-pack",
    "Leather work gloves",
    "Winter balaclava",
    "Gaiters pair",
    "Boot waterproof spray",
    "Heated insoles USB",
    "Bandana multipack",
    "Sun hat wide brim",
    "UV arm sleeves",
    "Thermal liner gloves",
    "Down vest packable",
    "Hiking boots mid",
    "Steel toe boots",
    "Reflective vest",
    "Moisture-wicking tee",
  ],
  Security: [
    "Door reinforcement kit",
    "Window security film",
    "Padlock boron 60mm",
    "Hasp staple set",
    "Motion sensor flood",
    "Trail camera cellular",
    "Driveway alert chime",
    "Personal alarm 130dB",
    "Pepper spray trainer",
    "Mechanical safe 30L",
    "Fireproof document bag",
    "Security bar door",
    "Dummy camera twin",
    "Floodlight camera mount",
    "Perimeter tripwire kit",
    "Monocular 10x42",
    "Night vision monocular",
    "Fence tension wire",
    "Gate latch lockable",
    "Security stickers pack",
  ],
  Communications: [
    "GMRS handheld pair",
    "GMRS repeater antenna",
    "Coax cable 15m",
    "BNC adapter kit",
    "Satellite messenger",
    "Whistle storm",
    "Signal mirror glass",
    "Emergency strobe",
    "Power bank 20Ah",
    "Solar panel USB fold",
    "Mesh WiFi battery UPS",
    "Ethernet cable outdoor",
    "POE injector",
    "Crimp tool RJ45",
    "Baofeng programming cable",
    "Yagi antenna 2m",
    "Ground plane kit",
    "Morse code card",
    "Notebook waterproof",
    "Pencil mechanical field",
  ],
  Navigation: [
    "Topographic map regional",
    "Compass baseplate",
    "GPS handheld rugged",
    "Altimeter watch",
    "Pace beads",
    "Protractor map",
    "UTM grid tool",
    "Headlamp red mode",
    "Binoculars 8x42",
    "Rangefinder monocular",
    "Star chart laminated",
    "Celestial navigation book",
    "Offline maps SD card",
    "Vehicle atlas spiral",
    "Road flare LED",
    "Reflective trail tape",
    "GPS mount handlebar",
    "Lensatic compass",
    "Clinometer pocket",
    "Declination adjustment tool",
  ],
  "Garden & Harvest": [],
  "Air Quality": [
    "Dehumidifier compact",
    "Crawlspace fan kit",
    "Moisture meter",
    "HEPA filter replacement",
    "Air quality monitor",
    "Mould treatment spray",
    "Basement vent fan",
    "Humidity data logger",
    "Condensate pump",
    "Vapor barrier roll",
    "Radon test kit",
    "Inline duct fan",
    "Desiccant refill pack",
    "Drain hose kit",
    "Filter drier cartridge",
    "Wall-mounted hygrometer",
    "Whole-room purifier",
    "MERV filter pack",
    "Damp proof membrane",
    "Air scrubber rental",
  ],
}

function amazonSearchUrl(query: string): string {
  return `https://www.amazon.es/s?k=${encodeURIComponent(query)}&tag=autarkeia-es`
}

const GARDEN_HARVEST_PRODUCTS: { name: string; query: string }[] = [
  { name: "Heirloom vegetable seed vault (survival pack)", query: "heirloom vegetable seed vault survival pack" },
  { name: "Survival seed kit non-GMO", query: "survival seed kit non GMO" },
  { name: "Culinary herb seed collection", query: "culinary herb seed collection" },
  { name: "Sprouting seed mix (alfalfa, broccoli, radish)", query: "sprouting seed mix alfalfa broccoli radish" },
  { name: "Microgreens seed variety pack", query: "microgreens seed variety pack" },
  { name: "Seed starting tray with humidity dome", query: "seed starting tray humidity dome" },
  { name: "Seedling heat mat with thermostat", query: "seedling heat mat thermostat" },
  { name: "Full-spectrum LED grow light", query: "full spectrum LED grow light" },
  { name: "Coco coir starter pucks", query: "coco coir starter pucks" },
  { name: "Raised garden bed (cedar or galvanized)", query: "raised garden bed cedar galvanized" },
  { name: "Self-watering planter", query: "self watering planter" },
  { name: "Garden tool set (trowel, fork, pruner)", query: "garden tool set trowel fork pruner" },
  { name: "Dual-chamber compost tumbler", query: "dual chamber compost tumbler" },
  { name: "Bypass pruning shears", query: "bypass pruning shears" },
  { name: "Galvanized watering can", query: "galvanized watering can" },
  { name: "Expandable garden hose", query: "expandable garden hose" },
  { name: "Soil pH and moisture meter", query: "soil pH moisture meter" },
  { name: "Leather garden gloves", query: "leather garden gloves" },
  { name: "Vertical garden tower / stackable planter", query: "vertical garden tower stackable planter" },
  { name: "Pop-up mini greenhouse", query: "pop up mini greenhouse" },
  { name: "Drip irrigation kit", query: "drip irrigation kit garden" },
  { name: "Hydroponics starter kit", query: "hydroponics starter kit" },
  { name: "Countertop hydroponic herb garden", query: "countertop hydroponic herb garden" },
  { name: "Wide-mouth sprouting jar kit with lids", query: "wide mouth sprouting jar kit lids" },
  { name: "Mushroom growing kit (oyster or lion's mane)", query: "mushroom growing kit oyster lions mane" },
  { name: "Electric food dehydrator (stackable trays)", query: "electric food dehydrator stackable trays" },
  { name: "Pressure canner (All American or Presto style)", query: "pressure canner All American Presto" },
  { name: "Water bath canner with rack", query: "water bath canner with rack" },
  { name: "Wide-mouth mason jars (case of 12)", query: "wide mouth mason jars case 12" },
  { name: "Canning lids and bands (bulk)", query: "canning lids bands bulk" },
  { name: "Canning utensil set (jar lifter, funnel, magnetic lid lifter)", query: "canning utensil set jar lifter funnel" },
  { name: "Vacuum sealer with bag rolls", query: "vacuum sealer bag rolls" },
  { name: "Fermentation crock with weights", query: "fermentation crock with weights" },
  { name: "Fermentation airlock lids for mason jars", query: "fermentation airlock lids mason jars" },
  { name: "Root vegetable mesh storage bags", query: "root vegetable mesh storage bags" },
  { name: "Freeze dryer (Harvest Right small)", query: "Harvest Right freeze dryer small" },
]

export const marketplaceBundles: MarketplaceBundle[] = [
  {
    name: "72-Hour Emergency Kit",
    items: "water + food + medical + light + comms",
    original: "€234",
    price: "€189",
    savings: "€45",
    affiliate: amazonSearchUrl("72 hour emergency kit"),
  },
  {
    name: "Home Energy Independence Starter",
    items: "solar panel + power station + MPPT controller",
    original: "€674",
    price: "€549",
    savings: "€125",
    affiliate: amazonSearchUrl("home solar starter kit portable power station"),
  },
  {
    name: "Food Resilience Starter",
    items: "raised bed + seeds + tools + soil meter",
    original: "€184",
    price: "€149",
    savings: "€35",
    affiliate: amazonSearchUrl("food growing starter kit raised bed"),
  },
  {
    name: "Complete Emergency Readiness",
    items: "water filter + 30-day food + first aid + communications",
    original: "€544",
    price: "€449",
    savings: "€95",
    affiliate: amazonSearchUrl("complete emergency readiness kit"),
  },
  {
    name: "Off-Grid Water System",
    items: "gravity filter + rain barrel + storage + hand pump",
    original: "€470",
    price: "€390",
    savings: "€80",
    affiliate: amazonSearchUrl("off grid water system rain collection"),
  },
  {
    name: "Shelter & Cold Weather",
    items: "4p tent + sleeping bags + tarps + stove",
    original: "€612",
    price: "€499",
    savings: "€113",
    affiliate: amazonSearchUrl("winter emergency shelter tent sleeping bag"),
  },
  {
    name: "Medical Trauma Core",
    items: "tourniquets + chest seals + bandages + airway kit",
    original: "€298",
    price: "€239",
    savings: "€59",
    affiliate: amazonSearchUrl("trauma first aid kit tourniquet"),
  },
  {
    name: "Communications Redundancy",
    items: "GMRS radios + solar charger + crank radio",
    original: "€356",
    price: "€289",
    savings: "€67",
    affiliate: amazonSearchUrl("emergency radio gmrs handheld"),
  },
  {
    name: "Security Perimeter Pack",
    items: "motion lights + trail camera + door reinforcement",
    original: "€412",
    price: "€339",
    savings: "€73",
    affiliate: amazonSearchUrl("home security motion sensor camera"),
  },
  {
    name: "Navigation & Evacuation",
    items: "topo maps + compass + rugged GPS + road atlas",
    original: "€428",
    price: "€349",
    savings: "€79",
    affiliate: amazonSearchUrl("gps handheld topo map compass"),
  },
  {
    name: "Tools & Field Repair",
    items: "multitool + saw + sockets + multimeter + cordage",
    original: "€318",
    price: "€259",
    savings: "€59",
    affiliate: amazonSearchUrl("survival tool kit multimeter saw"),
  },
  {
    name: "Clothing Layering System",
    items: "merino base + rain shell + insulated jacket + boots",
    original: "€524",
    price: "€429",
    savings: "€95",
    affiliate: amazonSearchUrl("outdoor layering merino rain jacket"),
  },
  {
    name: "Water Purification Pro",
    items: "ceramic filter + UV pen + test strips + storage",
    original: "€389",
    price: "€319",
    savings: "€70",
    affiliate: amazonSearchUrl("water purification ceramic filter uv"),
  },
  {
    name: "Long-Term Food Storage",
    items: "buckets + mylar + O2 absorbers + sealer",
    original: "€276",
    price: "€219",
    savings: "€57",
    affiliate: amazonSearchUrl("long term food storage mylar buckets"),
  },
  {
    name: "Backup Power Week",
    items: "LiFePO4 + inverter + solar folding + cables",
    original: "€1,120",
    price: "€949",
    savings: "€171",
    affiliate: amazonSearchUrl("lifepo4 battery solar inverter kit"),
  },
  {
    name: "Homestead Food Preservation",
    items: "pressure canner + dehydrator + jars + labels",
    original: "€398",
    price: "€329",
    savings: "€69",
    affiliate: amazonSearchUrl("pressure canner dehydrator preserving"),
  },
  {
    name: "Natural Building Starter",
    items: "straw needles + plaster hawk + levels + moisture meter",
    original: "€244",
    price: "€199",
    savings: "€45",
    affiliate: amazonSearchUrl("natural building tools plaster straw bale"),
  },
  {
    name: "Rainwater Harvest Complete",
    items: "gutters kit + first flush + IBC fittings + pump",
    original: "€512",
    price: "€419",
    savings: "€93",
    affiliate: amazonSearchUrl("rainwater harvesting kit first flush"),
  },
  {
    name: "Wind + Solar Hybrid Mini",
    items: "400W turbine + MPPT hybrid + dump load + battery",
    original: "€1,340",
    price: "€1,099",
    savings: "€241",
    affiliate: amazonSearchUrl("small wind turbine solar hybrid mppt"),
  },
  {
    name: "Family Hygiene & Sanitation",
    items: "portable toilet + waste bags + wash station + soap",
    original: "€198",
    price: "€159",
    savings: "€39",
    affiliate: amazonSearchUrl("camping portable toilet wash station"),
  },
  {
    name: "Cyber-Outage Analog Kit",
    items: "maps + cash envelope + radio + paper logs + candles",
    original: "€167",
    price: "€135",
    savings: "€32",
    affiliate: amazonSearchUrl("emergency radio maps analog preparedness"),
  },
  {
    name: "Vehicle Get-Home Bag",
    items: "tools + water + food + blanket + light + charger",
    original: "€286",
    price: "€235",
    savings: "€51",
    affiliate: amazonSearchUrl("vehicle emergency kit get home bag"),
  },
]

function buildRotatingCategoryProducts(
  cat: MarketplaceCategory,
  startId: number
): MarketplaceProduct[] {
  const names = PRODUCT_NAMES[cat]
  const out: MarketplaceProduct[] = []
  for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
    const base = names[i % names.length]
    const tier = ADJ[i % ADJ.length]
    const name = `${tier} ${base}`
    const description = `Practical ${cat.toLowerCase()} item for household resilience — ${base.toLowerCase()} variant ${Math.floor(i / names.length) + 1}.`
    const euros = 12 + ((i * 7 + cat.length * 3) % 340)
    out.push({
      id: startId + i,
      category: cat,
      seller: "Amazon",
      name,
      description,
      price: `€${euros}`,
      affiliate: amazonSearchUrl(name),
    })
  }
  return out
}

function buildGardenHarvestProducts(startId: number): MarketplaceProduct[] {
  return GARDEN_HARVEST_PRODUCTS.map((item, i) => {
    const euros = 12 + ((i * 7 + 17 * 3) % 340)
    return {
      id: startId + i,
      category: "Garden & Harvest" as const,
      seller: "Amazon" as const,
      name: item.name,
      description:
        "Grow your own food and preserve the harvest — practical gear from seed to jar.",
      price: `€${euros}`,
      affiliate: amazonSearchUrl(item.query),
    }
  })
}

function buildProducts(): MarketplaceProduct[] {
  const out: MarketplaceProduct[] = []
  let id = 1

  for (const cat of MARKETPLACE_FREE_AMAZON_CATEGORIES) {
    if (cat === "Garden & Harvest") {
      const products = buildGardenHarvestProducts(id)
      out.push(...products)
      id += products.length
    } else {
      const products = buildRotatingCategoryProducts(cat, id)
      out.push(...products)
      id += products.length
    }
  }

  for (const cat of MARKETPLACE_PRO_ONLY_CATEGORIES) {
    const products = buildRotatingCategoryProducts(cat, id)
    out.push(...products)
    id += products.length
  }

  return out
}

export const marketplaceProducts: MarketplaceProduct[] = buildProducts()

export function getAmazonProductsForAccess(hasPro: boolean): MarketplaceProduct[] {
  if (hasPro) return marketplaceProducts
  return marketplaceProducts.filter(
    (p) => !MARKETPLACE_PRO_ONLY_CATEGORIES.includes(p.category)
  )
}

export function getAmazonProductCount(hasPro: boolean): number {
  return getAmazonProductsForAccess(hasPro).length
}
