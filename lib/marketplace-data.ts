export type MarketplaceCategory =
  | "Water"
  | "Food"
  | "Shelter"
  | "Energy"
  | "Medical"
  | "Tools"
  | "Security"
  | "Communications"
  | "Garden & Harvest"
  | "Fire & Cooking"
  | "Air Quality"
  | "Sanitation & Hygiene"
  | "Lighting"
  | "Navigation"
  | "Transportation & Vehicle"
  | "Pet Preparedness"
  | "Children & Family"
  | "Documents & Finance"
  | "Clothing"
  | "Bartering & Currency"

/** Locale slug per category (`marketplace.categories.{slug}.name`). */
export const CATEGORY_SLUGS: Record<MarketplaceCategory, string> = {
  Water: "water",
  Food: "food",
  Shelter: "shelter",
  Energy: "energy",
  Medical: "medical",
  Tools: "tools",
  Security: "security",
  Communications: "communications",
  "Garden & Harvest": "garden-harvest",
  "Fire & Cooking": "fire-cooking",
  "Air Quality": "aloair",
  "Sanitation & Hygiene": "sanitation-hygiene",
  Lighting: "lighting",
  Navigation: "navigation",
  "Transportation & Vehicle": "transportation-vehicle",
  "Pet Preparedness": "pet-preparedness",
  "Children & Family": "children-family",
  "Documents & Finance": "documents-finance",
  Clothing: "clothing",
  "Bartering & Currency": "bartering-currency",
}

export function getCategorySlug(category: MarketplaceCategory): string {
  return CATEGORY_SLUGS[category]
}

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
  "Garden & Harvest",
  "Fire & Cooking",
]

/** Pro-only Amazon categories (10 categories — chips shown only to Pro members). */
export const MARKETPLACE_PRO_ONLY_CATEGORIES: MarketplaceCategory[] = [
  "Air Quality",
  "Sanitation & Hygiene",
  "Lighting",
  "Navigation",
  "Transportation & Vehicle",
  "Pet Preparedness",
  "Children & Family",
  "Documents & Finance",
  "Clothing",
  "Bartering & Currency",
]

export const MARKETPLACE_FREE_AMAZON_CATEGORIES: MarketplaceCategory[] = [
  ...MARKETPLACE_FILTER_CATEGORIES,
]

export function getMarketplaceFilterCategories(hasPro: boolean): MarketplaceCategory[] {
  return hasPro
    ? [...MARKETPLACE_FILTER_CATEGORIES, ...MARKETPLACE_PRO_ONLY_CATEGORIES]
    : MARKETPLACE_FILTER_CATEGORIES
}

const PRODUCTS_PER_CATEGORY = 36

const EXPLICIT_PRODUCT_CATEGORIES = new Set<MarketplaceCategory>([
  "Garden & Harvest",
  "Fire & Cooking",
])

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
  "Garden & Harvest": [],
  "Fire & Cooking": [],
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
  "Sanitation & Hygiene": [
    "Portable camping toilet",
    "Toilet seat bucket liner",
    "Biodegradable waste bags",
    "Wet wipes bulk pack",
    "Hand sanitizer gallon",
    "Bar soap multipack",
    "Menstrual cup kit",
    "Dental travel kit",
    "Camp shower bag solar",
    "Collapsible wash basin",
    "Portable laundry wash bag",
    "Toilet paper bulk roll",
    "Bio gel waste treat",
    "Privacy shelter tent",
    "Foot pump sink camp",
    "Portable bidet bottle",
    "Hygiene first aid kit",
    "Nail clippers set",
    "SPF 50 sunscreen",
    "Insect repellent lotion",
  ],
  Lighting: [
    "LED flashlight tactical",
    "Headlamp rechargeable",
    "Camping lantern LED",
    "Solar garden light",
    "Glow sticks 12 hour",
    "Beeswax candles pack",
    "USB rechargeable light",
    "Motion sensor light solar",
    "Strobe signal light",
    "Penlight medical",
    "Clip book reading light",
    "Solar string lights",
    "Emergency backup bulb",
    "Hat clip light",
    "Bike light set",
    "Under-cabinet LED strip",
    "COB work light",
    "Glass candle lantern",
    "Military light sticks",
    "D-cell battery lantern",
  ],
  Navigation: [
    "Topographic map regional",
    "Compass baseplate",
    "GPS handheld rugged",
    "Altimeter watch",
    "Pace beads",
    "Map protractor",
    "UTM grid tool",
    "Map case waterproof",
    "Vehicle road atlas",
    "Lensatic compass",
    "Celestial navigation book",
    "Offline maps SD card",
    "Reflective trail tape",
    "GPS handlebar mount",
    "Clinometer pocket",
    "Declination adjustment tool",
    "Signal mirror glass",
    "Star chart laminated",
    "Rangefinder monocular",
    "Binoculars 8x42",
  ],
  "Transportation & Vehicle": [
    "Car emergency kit",
    "Jumper cables heavy duty",
    "Tire repair kit",
    "Jerry can fuel 20L",
    "Recovery tow strap",
    "Kinetic tow rope",
    "Vehicle tool kit",
    "Roof cargo bag",
    "Window breaker cutter",
    "12V air compressor",
    "Portable tyre inflator",
    "Lithium jump starter",
    "Ice scraper set",
    "Folding shovel car",
    "Reflective triangle kit",
    "Dash cam hardwired",
    "Dual USB car charger",
    "Engine antifreeze coolant",
    "Oil funnel kit",
    "Battery terminal cleaner",
  ],
  "Pet Preparedness": [
    "Pet go bag backpack",
    "Pet food storage airtight",
    "Pet first aid kit",
    "Soft-sided pet carrier",
    "Heavy duty retractable leash",
    "Pet travel water bottle",
    "Engraved pet ID tag",
    "Vaccination record wallet",
    "Dog booties set",
    "Portable cat litter box",
    "Pet calming anxiety vest",
    "Pet life jacket",
    "Portable pet playpen",
    "Pet heating pad",
    "Pet waste scooper",
    "Travel pet grooming kit",
    "Treat pouch training",
    "Collapsible pet bowl",
    "Pet tick remover tool",
    "Pet emergency info card",
  ],
  "Children & Family": [
    "Infant formula powder",
    "Diapers bulk pack",
    "Ergonomic baby carrier",
    "Kid hiking backpack",
    "Infant first aid kit",
    "Sensitive baby wipes",
    "Child safety harness",
    "Organic baby food pouches",
    "Multi-use nursing cover",
    "Pacifier sterilizer case",
    "Child ear defenders",
    "Kids rain poncho",
    "Family camp board games",
    "All-terrain stroller",
    "Battery baby monitor",
    "Nursery night light",
    "Child ID bracelet",
    "Kids hydration pack",
    "Thermal baby blanket",
    "Portable travel crib",
  ],
  "Documents & Finance": [
    "Fireproof document bag",
    "Waterproof document pouch",
    "Faraday laptop bag",
    "Small fire safe",
    "Cash organizer envelope",
    "Portable document scanner",
    "ID copy laminator kit",
    "Encrypted USB drive",
    "RFID passport holder",
    "Checkbook register",
    "Emergency contact cards",
    "Document binder organizer",
    "Manual portable shredder",
    "Notary stamp seal kit",
    "Archive storage box",
    "Portable label maker",
    "Ledger and pen set",
    "Property deed holder",
    "Backup encrypted hard drive",
    "Home inventory logbook",
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
  "Bartering & Currency": [
    "Silver round storage tube",
    "Gold bar storage capsule",
    "Fireproof cash organizer",
    "Coin tube assortment",
    "Precious metals digital scale",
    "Barter goods variety kit",
    "Pre-1965 silver coin roll",
    "Copper bullion bar",
    "Trade silver dime tube",
    "Emergency cash stash box",
    "Coin collector album",
    "Silver eagle capsule",
    "Gold tester acid kit",
    "Stainless money clip",
    "Currency band straps",
    "Safe deposit document bag",
    "Green coffee beans bulk",
    "Salt bulk storage bucket",
    "Soap bar bulk pack",
    "Manual hand crank grinder",
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

const FIRE_COOKING_PRODUCTS: { name: string; query: string }[] = [
  { name: "Portable camp stove single burner", query: "portable camp stove single burner" },
  { name: "Rocket stove biomass", query: "rocket stove biomass camping" },
  { name: "Butane camp stove", query: "butane camp stove" },
  { name: "Propane camp stove 2-burner", query: "propane camp stove 2 burner" },
  { name: "Alcohol spirit stove", query: "alcohol spirit camping stove" },
  { name: "Wood burning camping stove", query: "wood burning camping stove" },
  { name: "Butane fuel canister 4-pack", query: "butane fuel canister 4 pack camping" },
  { name: "Propane fuel cylinder camping", query: "propane fuel cylinder camping" },
  { name: "Kiln-dried firewood bundle", query: "kiln dried firewood bundle" },
  { name: "Ferro rod fire starter", query: "ferro rod fire starter" },
  { name: "Magnesium fire starter block", query: "magnesium fire starter block" },
  { name: "Waterproof match case", query: "waterproof match case survival" },
  { name: "Stormproof matches tube", query: "stormproof matches tube" },
  { name: "Windproof lighter refillable", query: "windproof lighter refillable" },
  { name: "Tinder fire starter cubes", query: "tinder fire starter cubes" },
  { name: "Collapsible fire pit", query: "collapsible fire pit camping" },
  { name: "Cast iron skillet 10 inch", query: "cast iron skillet 10 inch" },
  { name: "Cast iron dutch oven", query: "cast iron dutch oven camping" },
  { name: "Camping pot set nested", query: "camping pot set nested" },
  { name: "Camping kettle stainless", query: "camping kettle stainless" },
  { name: "Mess kit stainless 2-person", query: "mess kit stainless 2 person camping" },
  { name: "Camping utensil set spork", query: "camping utensil set spork" },
  { name: "Pot gripper handle camp", query: "pot gripper handle camping" },
  { name: "Windscreen stove foldable", query: "windscreen stove foldable camping" },
  { name: "Pot stand alcohol stove", query: "pot stand alcohol stove" },
  { name: "Biofuel tab stove fuel", query: "biofuel tab stove fuel" },
  { name: "Charcoal chimney starter", query: "charcoal chimney starter" },
  { name: "Grill grate campfire", query: "grill grate campfire" },
  { name: "Coffee percolator camp", query: "coffee percolator camping" },
  { name: "Tea kettle whistling camp", query: "whistling tea kettle camping" },
  { name: "Insulated camp mug", query: "insulated camp mug" },
  { name: "Plate bowl set camping", query: "plate bowl set camping" },
  { name: "Mini cutting board camp", query: "mini cutting board camping" },
  { name: "Camp spice kit", query: "camp spice kit" },
  { name: "Heat resistant fire gloves", query: "heat resistant fire gloves" },
  { name: "Cast iron griddle plate", query: "cast iron griddle plate camping" },
]

const EXPLICIT_PRODUCT_LISTS: Partial<
  Record<MarketplaceCategory, { name: string; query: string }[]>
> = {
  "Garden & Harvest": GARDEN_HARVEST_PRODUCTS,
  "Fire & Cooking": FIRE_COOKING_PRODUCTS,
}

const EXPLICIT_PRODUCT_DESCRIPTIONS: Partial<Record<MarketplaceCategory, string>> = {
  "Garden & Harvest":
    "Grow your own food and preserve the harvest — practical gear from seed to jar.",
  "Fire & Cooking":
    "Cook, boil water, and stay warm — stoves, fuel, and fire starters.",
}

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

function buildExplicitCategoryProducts(
  cat: MarketplaceCategory,
  startId: number
): MarketplaceProduct[] {
  const items = EXPLICIT_PRODUCT_LISTS[cat] ?? []
  const description =
    EXPLICIT_PRODUCT_DESCRIPTIONS[cat] ??
    `Practical ${cat.toLowerCase()} item for household resilience.`
  return items.map((item, i) => {
    const euros = 12 + ((i * 7 + cat.length * 3) % 340)
    return {
      id: startId + i,
      category: cat,
      seller: "Amazon",
      name: item.name,
      description,
      price: `€${euros}`,
      affiliate: amazonSearchUrl(item.query),
    }
  })
}

function buildProducts(): MarketplaceProduct[] {
  const out: MarketplaceProduct[] = []
  let id = 1

  for (const cat of MARKETPLACE_FREE_AMAZON_CATEGORIES) {
    if (EXPLICIT_PRODUCT_CATEGORIES.has(cat)) {
      const products = buildExplicitCategoryProducts(cat, id)
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
