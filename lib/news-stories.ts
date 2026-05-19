export type NewsStory = {
  slug: string
  category: string
  urgency: string
  emoji: string
  title: string
  summary: string
  why: string
  time: string
  /**
   * Hero image URL (Wikimedia Commons or Unsplash), typically 960px wide.
   */
  image: string
  body: string
  /**
   * Primary news sources for the story, in order. Each entry is a direct
   * link to a specific article on the publisher's own domain (no homepages
   * or search results). The Wikipedia article for the underlying topic is
   * kept as the last entry as a secondary, evergreen reference.
   */
  sources: { label: string; url: string }[]
}

export const newsStories: NewsStory[] = [
  {
    slug: "iran-strait-hormuz-risk",
    category: "Middle East",
    urgency: "Critical",
    emoji: "🛰️",
    title: "Iran tensions raise Strait of Hormuz disruption risk",
    summary:
      "Naval maneuvers and retaliation threats have increased in the Gulf. Energy markets are pricing in a potential supply shock over coming weeks.",
    why: "Fuel and transport costs can jump quickly, then cascade into food and logistics prices.",
    time: "2h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Strait_of_Hormuz_and_Musandam_Peninsula_%28MODIS_2018-12-10%29.jpg/960px-Strait_of_Hormuz_and_Musandam_Peninsula_%28MODIS_2018-12-10%29.jpg",
    body: `Shipping through the Strait of Hormuz remains a choke point for global oil and LNG flows. When rhetoric escalates between regional powers, insurance premiums and charter rates often move before any physical disruption occurs. For households focused on resilience, the lesson is not prediction but preparation: maintain fuel buffers where safe and legal, review evacuation and communication plans if you live near critical infrastructure, and diversify food sourcing to reduce exposure to sudden freight-driven inflation.`,
    sources: [
      {
        label: "BBC News — Iran seizes tanker in Strait of Hormuz",
        url: "https://www.bbc.co.uk/news/articles/cze6zxjw3g3o",
      },
      {
        label: "BBC News — What is the Strait of Hormuz and why does it matter?",
        url: "https://www.bbc.com/news/articles/c78n6p09pzno",
      },
      { label: "Strait of Hormuz — Wikipedia", url: "https://en.wikipedia.org/wiki/Strait_of_Hormuz" },
    ],
  },
  {
    slug: "ukraine-front-logistics-strikes",
    category: "Conflict",
    urgency: "High",
    emoji: "🛡️",
    title: "Ukraine front remains volatile as long-range strikes continue",
    summary:
      "Both sides report intensified strikes on logistics and energy infrastructure. Civilian infrastructure remains exposed in several regions.",
    why: "Prolonged conflict pressures European energy, grain trade and strategic stockpiles.",
    time: "5h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2022_Russian_invasion_of_Ukraine.svg/960px-2022_Russian_invasion_of_Ukraine.svg.png",
    body: `Sustained conflict in Ukraine continues to stress global grain corridors and regional energy networks. Even distant economies feel second-order effects through fertilizer costs, wheat derivatives, and power interconnectors. Preparedness at the household level means deeper pantry rotation, attention to backup heat and cooking, and awareness of how local grids depend on imported fuels or interconnected markets.`,
    sources: [
      {
        label: "BBC News — Surge in Ukrainian oil refinery attacks sparks Russian fuel shortages",
        url: "https://www.bbc.com/news/articles/czx020k4056o",
      },
      {
        label: "Russo-Ukrainian war — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Russo-Ukrainian_war_(2022%E2%80%93present)",
      },
    ],
  },
  {
    slug: "taiwan-strait-shipping-risk",
    category: "Asia Security",
    urgency: "High",
    emoji: "🌏",
    title: "Taiwan Strait patrol surge deepens China-Taiwan tensions",
    summary:
      "Military activity and strategic signaling increased around shipping corridors. Electronics and shipping firms are adjusting risk models.",
    why: "Any disruption threatens semiconductors and equipment needed for modern infrastructure.",
    time: "7h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cityscape_of_Kaohsiung%2C_Taiwan_202303.jpg/960px-Cityscape_of_Kaohsiung%2C_Taiwan_202303.jpg",
    body: `Semiconductor supply chains concentrate advanced fabrication in a small number of geographies. Strait tensions remind planners that redundancy—in spare parts, repair skills, and non-digital workflows—matters as much as cloud uptime. Document critical dependencies for water, power, and communications hardware you rely on, and identify manual fallbacks where feasible.`,
    sources: [
      {
        label: "BBC News — China military holds live-fire drill in Taiwan Strait",
        url: "https://www.bbc.co.uk/news/articles/c24q5pg8m07o",
      },
      { label: "Taiwan Strait — Wikipedia", url: "https://en.wikipedia.org/wiki/Taiwan_Strait" },
    ],
  },
  {
    slug: "us-debt-fiscal-stress",
    category: "Economy",
    urgency: "High",
    emoji: "🏦",
    title: "US debt stress revives fiscal and market instability concerns",
    summary:
      "Debate over debt trajectory and refinancing pressure is intensifying. Bond market volatility is feeding risk-off behavior globally.",
    why: "Debt-driven shocks can tighten credit and reduce household resilience options.",
    time: "9h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Photos_NewYork1_032.jpg/960px-Photos_NewYork1_032.jpg",
    body: `Fiscal cycles interact with monetary policy in ways that affect employment, housing, and access to credit. For resilience planning, focus on liquidity without speculation, reduce fragile debt where possible, and build skills and networks that preserve optionality during downturns. Tangible readiness—medical, water, food—buffers non-financial shocks that often coincide with financial stress.`,
    sources: [
      {
        label: "Bloomberg — Bond market warns Trump, Congress on dangers of swelling deficit",
        url: "https://www.bloomberg.com/news/articles/2025-05-21/treasury-yields-climb-auguring-5-rate-for-20-year-bond-auction",
      },
      {
        label: "Bloomberg — Bond investors detect trouble in US debt stripped of AAA rating",
        url: "https://www.bloomberg.com/news/articles/2025-05-19/bond-investors-detect-trouble-in-us-debt-stripped-of-aaa-rating",
      },
      {
        label: "U.S. national debt — Wikipedia",
        url: "https://en.wikipedia.org/wiki/National_debt_of_the_United_States",
      },
    ],
  },
  {
    slug: "europe-energy-winter-grid",
    category: "Energy",
    urgency: "High",
    emoji: "⚡",
    title: "European energy security enters another uncertain winter cycle",
    summary:
      "Storage progress is uneven while grid stress tests highlight local weaknesses. Industrial demand and weather risk remain key variables.",
    why: "Backup power and heating contingency can protect households from short disruptions.",
    time: "12h ago",
    image:
      "https://images.unsplash.com/photo-1769107439527-57e8682ff19a?w=960&q=80",
    body: `Weather-normalized storage and interconnect capacity vary widely across regions. Households should validate heating contingencies, insulate thermal envelopes where possible, and test backup power safely. Community-level load sharing and demand flexibility become force multipliers when grids approach limits.`,
    sources: [
      {
        label: "IEA — World Energy Outlook 2025",
        url: "https://www.iea.org/reports/world-energy-outlook-2025",
      },
      {
        label: "Reuters via Yahoo — Global energy investment set to hit record $3.3 trillion in 2025, IEA says",
        url: "https://ca.finance.yahoo.com/news/global-energy-investment-set-hit-040201558.html",
      },
      {
        label: "2021–2023 energy crisis — Wikipedia",
        url: "https://en.wikipedia.org/wiki/2021-2023_energy_crisis",
      },
    ],
  },
  {
    slug: "global-food-prices-shipping",
    category: "Food",
    urgency: "High",
    emoji: "🌾",
    title: "Global food prices rebound on weather and shipping disruptions",
    summary:
      "Grain and edible oil pricing moved upward after climate events and freight delays. Import-dependent countries face renewed pressure.",
    why: "Food inflation is easier to absorb with pantry depth and local production habits.",
    time: "14h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Africa_Food_Security_18_%2810665134354%29.jpg/960px-Africa_Food_Security_18_%2810665134354%29.jpg",
    body: `Agricultural markets integrate climate volatility, currency moves, and freight bottlenecks. Rotating staples, preserving harvests, and learning low-energy preservation methods reduce exposure. Even small-scale home production changes price sensitivity at the margin while improving dietary diversity.`,
    sources: [
      {
        label: "FAO — Food Price Index declines in November for third consecutive month",
        url: "https://www.fao.org/newsroom/detail/fao-food-price-index-declines-in-november-for-third-consecutive-month/en",
      },
      {
        label: "FAO — Food Price Index declines in October; world cereal stocks set to reach record high",
        url: "https://www.fao.org/newsroom/detail/fao-food-price-index-declines-in-october--world-cereal-stocks-set-to-reach-record-high/en",
      },
      { label: "Food security — Wikipedia", url: "https://en.wikipedia.org/wiki/Food_security" },
    ],
  },
  {
    slug: "mediterranean-migration-routes",
    category: "Migration",
    urgency: "Medium",
    emoji: "🧭",
    title: "Migration pressure increases across Mediterranean routes",
    summary:
      "Displacement from conflict and climate shocks continues to rise. Reception systems in multiple countries report sustained capacity strain.",
    why: "Large migration waves can reshape local services and social stability dynamics.",
    time: "18h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Map_of_the_European_Migrant_Crisis_2015.png/960px-Map_of_the_European_Migrant_Crisis_2015.png",
    body: `Migration dynamics intersect with housing, water, and public health capacity. Communities that plan for inclusive infrastructure and clear governance tend to adapt more smoothly. Individuals can contribute through mutual aid networks, language support, and pressure on policymakers for transparent resource allocation.`,
    sources: [
      {
        label: "IOM — IOM and UNHCR appeal for region-wide action over Mediterranean tragedies",
        url: "https://iom.int/news/iom-unhcr-appeal-region-wide-action-eu-countries-over-mediterranean-tragedies",
      },
      {
        label: "IOM DTM — Europe mixed migration flows quarterly overview (Oct–Dec 2025)",
        url: "https://dtm.iom.int/datasets/europe-mixed-migration-flows-europe-quarterly-overview-october-december-2025",
      },
      {
        label: "European migrant crisis — Wikipedia",
        url: "https://en.wikipedia.org/wiki/2015_European_migrant_crisis",
      },
    ],
  },
  {
    slug: "extreme-weather-multi-region",
    category: "Climate",
    urgency: "High",
    emoji: "🌪️",
    title: "Extreme climate events hit multiple regions in same week",
    summary:
      "Floods, heatwaves and wildfire alerts occurred across different continents. Emergency services report repeated deployment stress.",
    why: "Localized disruptions are now frequent enough to justify household redundancy planning.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/A_tornado_near_Anadarko%2C_Oklahoma%2C_on_May_3%2C_1999.jpg/960px-A_tornado_near_Anadarko%2C_Oklahoma%2C_on_May_3%2C_1999.jpg",
    body: `Concurrent extremes strain mutual aid and insurance systems. Redundancy in water storage, air filtration for smoke, and heat illness prevention are increasingly baseline preparedness. Neighborhood-level coordination—cooling centers, well-sharing agreements, and tree planting—extends individual buffers.`,
    sources: [
      {
        label: "WMO — 2025 confirmed as one of warmest years on record",
        url: "https://wmo.int/news/media-centre/wmo-confirms-2025-was-one-of-warmest-years-record",
      },
      {
        label: "WMO — 2025 set to be second or third warmest year on record",
        url: "https://wmo.int/news/media-centre/2025-set-be-second-or-third-warmest-year-record-continuing-exceptionally-high-warming-trend",
      },
      { label: "Extreme weather — Wikipedia", url: "https://en.wikipedia.org/wiki/Extreme_weather" },
    ],
  },
  {
    slug: "supply-chain-rerouting-delays",
    category: "Supply Chain",
    urgency: "High",
    emoji: "🚢",
    title: "Supply chain rerouting extends delivery times for key goods",
    summary:
      "Shipping delays and route changes continue in key maritime corridors. Lead times for equipment and components remain unstable.",
    why: "Critical supplies are safer when purchased before disruption windows widen.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/MAERSK_MC_KINNEY_M%C3%96LLER_%26_MARSEILLE_MAERSK_%2848694054418%29.jpg/960px-MAERSK_MC_KINNEY_M%C3%96LLER_%26_MARSEILLE_MAERSK_%2848694054418%29.jpg",
    body: `Just-in-time systems optimize cost under stability assumptions. Resilience favors strategic inventories of repair parts, medical consumables, and water treatment consumables with known shelf lives. Map single points of failure in your own logistics—last-mile transport, cold chain, and prescription continuity.`,
    sources: [
      {
        label: "Reuters — Maersk completes first Red Sea voyage in nearly two years",
        url: "https://www.reuters.com/world/middle-east/maersk-completes-first-red-sea-voyage-nearly-two-years-2025-12-19/",
      },
      {
        label: "Global supply chain crisis — Wikipedia",
        url: "https://en.wikipedia.org/wiki/2021%E2%80%932023_global_supply_chain_crisis",
      },
    ],
  },
  {
    slug: "china-slowdown-industrial",
    category: "China Economy",
    urgency: "Medium",
    emoji: "🏭",
    title: "China slowdown concerns grow amid weak demand indicators",
    summary:
      "Industrial output and property stress remain central concerns. Slower growth is affecting export and commodity expectations.",
    why: "Global slowdown can alter job markets and reduce supply predictability.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Pudong_Shanghai_November_2017_panorama.jpg/960px-Pudong_Shanghai_November_2017_panorama.jpg",
    body: `Shifts in Chinese industrial demand ripple through metals, shipping, and manufacturing employment worldwide. Households should stress-test income assumptions and maintain retraining agility. Diversifying suppliers for durable goods and prepping for longer lead times reduces operational surprise.`,
    sources: [
      {
        label: "CNBC — China retail sales sharply miss estimates in November, deepening consumption worries",
        url: "https://www.cnbc.com/2025/12/15/chinas-november-retail-sales-industrial-production-fixed-asset-investment.html",
      },
      { label: "Economy of China — Wikipedia", url: "https://en.wikipedia.org/wiki/Economy_of_China" },
    ],
  },
  {
    slug: "india-pakistan-border-alerts",
    category: "South Asia",
    urgency: "Medium",
    emoji: "🛰️",
    title: "India-Pakistan tensions prompt renewed border alerts",
    summary:
      "Security rhetoric and military posturing have intensified in recent days. Diplomatic channels remain active but fragile.",
    why: "Regional escalations can influence global commodities and geopolitical risk premiums.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/India-Pakistan_Border_at_Night.jpg/960px-India-Pakistan_Border_at_Night.jpg",
    body: `South Asian security flare-ups can affect energy and food markets through sentiment and localized disruptions. Observers should separate signal from noise via primary sources, while maintaining personal readiness unrelated to speculation—communications plans, medical kits, and go-bags remain evergreen.`,
    sources: [
      {
        label: "BBC News — Pakistan claims 'credible intelligence' India is planning an imminent military strike",
        url: "https://www.bbc.com/news/articles/c75dgz5pq2no",
      },
      {
        label: "India–Pakistan border — Wikipedia",
        url: "https://en.wikipedia.org/wiki/India%E2%80%93Pakistan_border",
      },
    ],
  },
  {
    slug: "ai-infrastructure-centralization-risk",
    category: "Technology",
    urgency: "High",
    emoji: "🤖",
    title: "AI infrastructure vulnerabilities become priority risk topic",
    summary:
      "Security researchers warn about over-centralized AI and cloud dependencies. Outages and cyber incidents expose interconnected weak points.",
    why: "When digital systems fail, offline tools and low-tech options become essential.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Utah_Data_Center_Panorama_%28cropped%29.jpg/960px-Utah_Data_Center_Panorama_%28cropped%29.jpg",
    body: `Centralized AI stacks concentrate failure domains. Practice offline workflows: paper maps, radio nets, and printed medical references. Segment networks at home, maintain offline backups of critical documents, and rehearse degraded-mode days without assuming cloud availability.`,
    sources: [
      {
        label: "WIRED — The AI Data Center Boom Is Warping the US Economy",
        url: "https://www.wired.com/story/data-center-ai-boom-us-economy-jobs/",
      },
      {
        label: "Silicon Valley — What to know about the Amazon cloud outage that exposed the internet's vulnerable backbone",
        url: "https://www.siliconvalley.com/2025/10/21/what-to-know-about-the-amazon-cloud-outage-that-exposed-the-internets-vulnerable-backbone/",
      },
      { label: "Data center — Wikipedia", url: "https://en.wikipedia.org/wiki/Data_center" },
    ],
  },
  {
    slug: "pandemic-preparedness-audits",
    category: "Health",
    urgency: "Medium",
    emoji: "🧪",
    title: "Pandemic preparedness audits reveal uneven readiness levels",
    summary:
      "Recent assessments show major variation in stockpiles and response speed. Public health systems are improving, but gaps remain.",
    why: "Personal medical readiness reduces dependence on strained services during spikes.",
    time: "2d ago",
    image:
      "https://images.unsplash.com/photo-1574353789332-24f54431557d?w=960&q=80",
    body: `Audits highlight workforce burnout and supply chain fragility for basics like gloves and antivirals. Households should maintain rational medical caches with expiration discipline, coordinate with clinicians for chronic conditions, and support local public health funding rather than panic buying.`,
    sources: [
      {
        label: "WHO — Amended International Health Regulations enter into force",
        url: "https://www.who.int/news/item/19-09-2025-amended-international-health-regulations-enter-into-force",
      },
      {
        label: "WHO — World Health Assembly adopts historic Pandemic Agreement",
        url: "https://www.who.int/news/item/20-05-2025-world-health-assembly-adopts-historic-pandemic-agreement-to-make-the-world-more-equitable-and-safer-from-future-pandemics",
      },
      {
        label: "Pandemic prevention — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pandemic_prevention",
      },
    ],
  },
  {
    slug: "water-scarcity-drought-alerts",
    category: "Water",
    urgency: "High",
    emoji: "💧",
    title: "Water scarcity alerts expand across drought-prone regions",
    summary:
      "Reservoir and aquifer levels are dropping in multiple countries. Authorities are introducing restrictions earlier in the season.",
    why: "Water storage, filtration and conservation become core household resilience priorities.",
    time: "3d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Lac_de_l%27Entonnoir_-_img_49473.jpg/960px-Lac_de_l%27Entonnoir_-_img_49473.jpg",
    body: `Drought cycles demand both demand reduction and supply diversification. Rainwater harvesting, greywater reuse where legal, and low-flow fixtures compound savings. Monitor local watershed governance and advocate for transparent allocation during scarcity events.`,
    sources: [
      {
        label: "Bloomberg — Spain's storms refill reservoirs, easing nation's worst drought",
        url: "https://www.bloomberg.com/news/articles/2025-03-25/spain-s-storms-refill-reservoirs-easing-nation-s-worst-drought",
      },
      {
        label: "Euronews — Heavy rainfall fills empty reservoirs in Spain, bringing drought relief and floods",
        url: "https://www.euronews.com/2025/03/26/heavy-rainfall-fills-empty-reservoirs-in-spain-bringing-drought-relief-and-floods",
      },
      { label: "Water scarcity — Wikipedia", url: "https://en.wikipedia.org/wiki/Water_scarcity" },
    ],
  },
  {
    slug: "crypto-volatility-systemic-debate",
    category: "Finance",
    urgency: "Medium",
    emoji: "₿",
    title: "Crypto volatility rekindles systemic risk debate",
    summary:
      "Large swings and liquidity concerns renewed calls for tighter oversight. Traditional-finance linkages are being monitored closely.",
    why: "Volatile financial cycles highlight value of practical, non-digital preparedness assets.",
    time: "3d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/960px-Bitcoin.svg.png",
    body: `Speculative assets can distract from tangible readiness. Maintain a balanced view: liquidity for obligations, insurance for tail risks, and skills that generate value regardless of token prices. Physical health, shelter, and water access dominate welfare during crises.`,
    sources: [
      {
        label: "Bloomberg Law — Highest crypto volatility since FTX crash shows market fragility",
        url: "https://www.bloomberglaw.com/crypto/highest-crypto-volatility-since-ftx-crash-shows-market-fragility",
      },
      {
        label: "Fortune — Spot Bitcoin ETFs experience record outflow, bleeding over $1 billion in one day",
        url: "https://fortune.com/crypto/2025/02/27/spot-bitcoin-etfs-experience-record-outflow-bleeding-1-billion-one-day",
      },
      {
        label: "ECB — Just another crypto boom? Mind the blind spots",
        url: "https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202505_01~62255f2625.en.html",
      },
      { label: "Cryptocurrency — Wikipedia", url: "https://en.wikipedia.org/wiki/Cryptocurrency" },
    ],
  },
  {
    slug: "heat-dome-urban-resilience",
    category: "Climate",
    urgency: "High",
    emoji: "🌡️",
    title: "Heat-dome forecasts push cities to expand cooling-center networks",
    summary:
      "Cities are activating cooling centers ahead of schedule and pre-positioning water as forecasters track multi-day temperature ridges across mid-latitudes.",
    why: "Heat is now the deadliest weather hazard for many regions; passive cooling and hydration plans save lives.",
    time: "3h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Heat_Wave.jpg/960px-Heat_Wave.jpg",
    body: `Multi-day heat events compound through the night when buildings cannot release stored heat. Combined with humidity, urban heat-island effects, and aging electrical infrastructure, rolling outages can coincide with peak demand for air conditioning. Households should identify the coolest room in the home, prepare cross-ventilation strategies that do not depend on grid power, and check on elderly neighbors twice daily during advisories. Community resilience is sharpened by mapping shaded routes between homes, transit, and cooling centers, and by stocking oral rehydration salts that remain effective even when potable water is rationed.`,
    sources: [
      {
        label: "CNN — A potent heat dome is sending temperatures into the triple digits",
        url: "https://www.cnn.com/2025/06/21/weather/heat-dome-climate",
      },
      {
        label: "The Times — Heatwave: Paris parks open overnight as cool refuges",
        url: "https://www.thetimes.com/world/europe/article/heatwave-extreme-weather-temperatures-h6fg77kpx",
      },
      { label: "Heat wave — Wikipedia", url: "https://en.wikipedia.org/wiki/Heat_wave" },
    ],
  },
  {
    slug: "wildfire-smoke-air-quality",
    category: "Climate",
    urgency: "High",
    emoji: "🔥",
    title: "Wildfire smoke plumes degrade air quality across continental scales",
    summary:
      "Forest fires in boreal and Mediterranean regions are sending smoke thousands of kilometers downwind, triggering air-quality alerts in cities far from any active fire.",
    why: "Indoor air filtration and a portable purifier become baseline household tools during fire season.",
    time: "5h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg/960px-Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg",
    body: `Particulate matter smaller than 2.5 microns penetrates deep into the lungs and bloodstream, with no safe long-term threshold. Even households far from active fires need a plan: replace HVAC filters with MERV-13 or higher when local AQI worsens, build a low-cost box-fan filter for one sealed room, and limit outdoor exertion during plumes. Schools, gyms, and outdoor workers are most exposed and need policy backstops. Tracking regional smoke-model forecasts helps families decide when to keep children indoors versus when conditions allow normal outdoor activity.`,
    sources: [
      {
        label: "Bloomberg — NYC air quality drops as Canada fire smoke swirls south",
        url: "https://www.bloomberg.com/news/articles/2025-08-04/nyc-air-quality-drops-as-smoke-from-canadian-fires-swirls-south",
      },
      {
        label: "NBC New York — Canadian wildfire smoke triggers NYC air quality alert",
        url: "https://www.nbcnewyork.com/weather/weather-stories/canadian-wildfire-smoke-triggers-nyc-air-quality-alert/6359321/",
      },
      { label: "Wildfire — Wikipedia", url: "https://en.wikipedia.org/wiki/Wildfire" },
    ],
  },
  {
    slug: "atlantic-hurricane-season-outlook",
    category: "Climate",
    urgency: "High",
    emoji: "🌀",
    title: "Atlantic hurricane outlook signals another above-average season",
    summary:
      "Warm sea-surface temperatures and ENSO-neutral conditions led forecasters to issue an above-normal Atlantic hurricane outlook, raising preparedness expectations.",
    why: "Storm-surge planning, generator readiness, and document backup checks should be completed before peak season.",
    time: "8h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Katrina_2005-08-28_1700Z.jpg/960px-Katrina_2005-08-28_1700Z.jpg",
    body: `Above-average outlooks do not predict specific landfalls but raise the baseline probability of major storms reaching populated coasts. Households in hurricane-prone regions should reverify evacuation routes with multiple destinations, harden roofs and openings within budget, and confirm insurance riders for wind and flood. Inland flooding from tropical-storm remnants frequently kills more people than coastal surge; even residents hundreds of miles inland should know their flood zone and keep a 96-hour kit on standby.`,
    sources: [
      {
        label: "NOAA — NOAA predicts above-normal 2025 Atlantic hurricane season",
        url: "https://www.noaa.gov/news-release/noaa-predicts-above-normal-2025-atlantic-hurricane-season",
      },
      {
        label: "NOAA — Prediction remains on track for above-normal Atlantic hurricane season",
        url: "https://www.noaa.gov/news-release/prediction-remains-on-track-for-above-normal-atlantic-hurricane-season",
      },
      {
        label: "Atlantic hurricane season — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Atlantic_hurricane_season",
      },
    ],
  },
  {
    slug: "earthquake-preparedness-zones",
    category: "Hazards",
    urgency: "Medium",
    emoji: "🌍",
    title: "Earthquake-zone audits highlight gaps in school retrofits",
    summary:
      "Recent assessments in seismic regions report uneven retrofitting progress, especially for older school buildings, hospitals, and elevated highways built before modern codes.",
    why: "Household earthquake kits and shelter-in-place drills protect families when public infrastructure response is delayed.",
    time: "10h ago",
    image:
      "https://images.unsplash.com/photo-1761251947432-0ad734f43697?w=960&q=80",
    body: `A magnitude-6.5 quake in a developed region can sever water, gas, and communications for days. Drop-cover-hold drills become muscle memory only with repetition. Fasten bookshelves and water heaters, store closed-toe shoes and a flashlight at every bed, and keep at least two weeks of water for each person. Recovery hinges on neighborhood capacity: knowing who has gas shutoff tools, who is medically vulnerable, and who has skilled first-aid training matters as much as personal stockpiles.`,
    sources: [
      {
        label: "California Hospital Association — Hospital Seismic Safety Primer (2025)",
        url: "https://calhospital.org/wp-content/uploads/2025/01/Seismic-Primer.pdf",
      },
      {
        label: "City of Sendai — Seismic Retrofitting of Buildings",
        url: "https://sendai-resilience.jp/en/efforts/government/development/earthquake_resistance.html",
      },
      {
        label: "Earthquake preparedness — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Earthquake_preparedness",
      },
    ],
  },
  {
    slug: "permaculture-community-projects",
    category: "Food Systems",
    urgency: "Medium",
    emoji: "🌱",
    title: "Permaculture pilots scale across community land projects",
    summary:
      "Permaculture designers report rising demand for whole-site retrofits focused on water-harvesting earthworks, perennial polycultures, and soil regeneration.",
    why: "Local food production reduces exposure to import shocks while building soil health and community ties.",
    time: "12h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Permaculture_garden.JPG/960px-Permaculture_garden.JPG",
    body: `Permaculture moves the conversation from inputs to systems: the same property can grow staples, biomass, and habitat once water is slowed and stored on contour. Swales, ponds, and key-line subsoiling reconfigure how rainfall behaves before it leaves the site. Successful pilots pair design with maintenance training so volunteer teams can sustain plantings through dry years. The economic case follows the agronomic one: reduced irrigation needs and stacked yields per acre lower input costs over time.`,
    sources: [
      {
        label: "permEzone — December 2024 newsletter on pilot programs and post-pilot expansion",
        url: "https://www.permezone.org/newsletters/december-2024",
      },
      {
        label: "Pollination Project — Regenerate Nakivale Refugee Settlement in Uganda",
        url: "https://thepollinationproject.org/cultivating-resilience-in-nakivale-refugee-settlement/",
      },
      { label: "Permaculture — Wikipedia", url: "https://en.wikipedia.org/wiki/Permaculture" },
    ],
  },
  {
    slug: "rainwater-harvesting-momentum",
    category: "Water",
    urgency: "Medium",
    emoji: "🌧️",
    title: "Cities relax rainwater-harvesting rules amid drought pressure",
    summary:
      "Several municipalities have updated codes to encourage rooftop rainwater capture after multi-year drought trimmed reservoir reserves and utilities raised rates.",
    why: "Even small cisterns offset outdoor demand, protect plants during restrictions, and reduce stormwater runoff.",
    time: "15h ago",
    image:
      "https://images.unsplash.com/photo-1759062761071-29fd6a608b21?w=960&q=80",
    body: `A 1,000-square-foot roof captures roughly 600 gallons per inch of rain. Once permitting and first-flush diverters are handled, a basic system pays for itself in landscape water within a few seasons. Larger pressurized systems with treatment can serve flushing and laundry, lowering bills further. The harder problems are winter freeze protection and shading stored water to prevent algal growth. Homeowners associations increasingly approve cisterns once they understand the runoff and flood co-benefits.`,
    sources: [
      {
        label: "Hays Free Press — Rainwater harvesting is viable option amid low groundwater levels",
        url: "https://www.haysfreepress.com/article/26333,rainwater-harvesting-is-viable-option-amid-low-groundwater-levels-in-hays-county-central-texas",
      },
      {
        label: "City of Richardson, TX — Rainwater Harvesting program",
        url: "https://www.cor.net/government/greencor/citizen-partnership/rainwater-harvesting",
      },
      {
        label: "Rainwater harvesting — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Rainwater_harvesting",
      },
    ],
  },
  {
    slug: "seed-saving-banks-momentum",
    category: "Food Systems",
    urgency: "Medium",
    emoji: "🌾",
    title: "Seed-saving networks expand backups as climate stresses crops",
    summary:
      "Regional seed libraries report record requests as gardeners and farmers seek locally adapted varieties able to handle heat, drought, and disease pressure.",
    why: "Open-pollinated, locally adapted seeds give independence from commercial seed cycles and shipping disruptions.",
    time: "18h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Svalbard_Global_Seed_Vault_%2823273281972%29.jpg/960px-Svalbard_Global_Seed_Vault_%2823273281972%29.jpg",
    body: `Heirloom and landrace varieties carry genetic diversity that commercial hybrids often lack. Growing them out and saving seed builds local resilience and reduces dependence on a few global suppliers. The Svalbard Global Seed Vault provides one layer of backup, but the working repository is the network of growers who keep varieties alive each season. Beginners can start with self-pollinating crops like beans, tomatoes, and lettuce before tackling cross-pollinated families that require isolation.`,
    sources: [
      {
        label: "Svalbard Global Seed Vault — Celebration meets urgency at latest opening (Oct 2025)",
        url: "https://www.seedvault.no/2025/10/22/celebration-meets-urgency-at-latest-seed-vault-opening-in-svalbard/",
      },
      {
        label: "Svalbard Global Seed Vault — Sudan makes first deposit amid civil war",
        url: "https://www.seedvault.no/2025/03/05/sudan-making-its-first-deposit-amid-the-countrys-ongoing-civil-war/",
      },
      {
        label: "Svalbard Global Seed Vault — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Svalbard_Global_Seed_Vault",
      },
    ],
  },
  {
    slug: "off-grid-solar-adoption",
    category: "Energy",
    urgency: "Medium",
    emoji: "☀️",
    title: "Off-grid solar adoption rises as grid disruptions multiply",
    summary:
      "Installers report sustained growth in fully off-grid and grid-tied-with-battery systems, particularly in regions with public-safety power shutoffs and storm-driven outages.",
    why: "A modest solar-plus-battery system keeps refrigeration, communications, and lighting running through long outages.",
    time: "20h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Our_Hut_-_Flickr_-_brewbooks_b.jpg/960px-Our_Hut_-_Flickr_-_brewbooks_b.jpg",
    body: `The economics of off-grid solar shifted once lithium-iron-phosphate batteries matured and inverter costs fell. A typical 5-kilowatt array paired with a 10-kilowatt-hour battery can support critical loads through multiple cloudy days. The catch remains skilled installation and code compliance: bonding, grounding, and rapid-shutdown standards exist for good reason. Households should size for the loads they actually need during an outage rather than full-house autonomy, which costs disproportionately more.`,
    sources: [
      {
        label: "LAist — Rooftop solar and battery storage keep retirees powered through outages",
        url: "https://laist.com/brief/news/climate-environment/rooftop-solar-battery-storage-retirees-power-outages",
      },
      {
        label: "pv magazine USA — 100,000 residential batteries tested as one distributed power plant",
        url: "https://pv-magazine-usa.com/2025/08/06/100000-residential-batteries-in-california-tested-as-one-distributed-power-plant",
      },
      { label: "Off-the-grid — Wikipedia", url: "https://en.wikipedia.org/wiki/Off-the-grid" },
    ],
  },
  {
    slug: "ham-radio-emergency-comms",
    category: "Communications",
    urgency: "Medium",
    emoji: "📻",
    title: "Amateur-radio licenses surge after multi-day cellular outages",
    summary:
      "Volunteer licensing bodies report record exam registrations following high-profile outages where cellular and internet service failed for entire metropolitan regions.",
    why: "Radio nets keep neighborhoods coordinated when phones and internet are down for hours or days.",
    time: "23h ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Camporee.JPG/960px-Camporee.JPG",
    body: `Amateur radio remains the most resilient civilian communications mode. A handheld VHF/UHF transceiver costs less than a fancy meal and, with a license, can reach repeaters tens of miles away. Local clubs run weekly nets that double as social hubs and informal training. For neighborhood preparedness, agreeing on a frequency, time, and call sequence in advance turns radio from gear into a working communications plan. Many regions also have Auxiliary Communications Service programs that integrate volunteers with formal emergency management.`,
    sources: [
      {
        label: "ARRL — Growth in new amateur radio licensees ahead of last year's",
        url: "https://www.arrl.org/news/growth-in-new-amateur-radio-licensees-ahead-of-last-year-s",
      },
      {
        label: "ARRL — Resilience through amateur radio for National Preparedness Month 2025",
        url: "https://www.arrl.org/news/resilience-through-amateur-radio-for-national-preparedness-month-2025",
      },
      {
        label: "Amateur radio emergency comms — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Amateur_radio_emergency_communications",
      },
    ],
  },
  {
    slug: "community-land-trusts",
    category: "Housing",
    urgency: "Medium",
    emoji: "🏘️",
    title: "Community land trusts gain traction in housing-affordability fights",
    summary:
      "More municipalities are seeding community land trusts to keep homes permanently affordable, treating land as a long-term community asset distinct from the buildings on it.",
    why: "Permanent affordability stabilizes communities against speculation cycles that price out long-term residents.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Memphis_Tennessee-2014.jpg/960px-Memphis_Tennessee-2014.jpg",
    body: `A community land trust holds title to land and leases it to homeowners or cooperatives under long-term agreements that cap resale prices. Buyers gain stability without speculative upside on the land, while subsequent buyers benefit from the same affordability. Hundreds of trusts now exist across North America and Europe, ranging from small cooperatives to citywide programs. Stable land tenure also enables longer-horizon investments in food, energy, and shared infrastructure that speculative ownership tends to discourage.`,
    sources: [
      {
        label: "Northwest Public Broadcasting — Walla Walla's first community land trust gets big boost",
        url: "https://www.nwpb.org/nw-news/2025-01-29/walla-wallas-first-community-land-trust-gets-big-boost",
      },
      {
        label: "Urban Milwaukee — Community Land Trust celebrates new 'forever affordable' homes",
        url: "https://urbanmilwaukee.com/2025/07/14/community-land-trust-celebrates-new-forever-affordable-homes/",
      },
      {
        label: "Community land trust — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Community_land_trust",
      },
    ],
  },
  {
    slug: "battery-storage-grid",
    category: "Energy",
    urgency: "Medium",
    emoji: "🔋",
    title: "Grid-scale battery storage doubles capacity year over year",
    summary:
      "Utility-scale battery installations are growing rapidly in regions integrating solar and wind, helping smooth evening demand and provide fast-acting grid services.",
    why: "More storage means fewer rolling blackouts and a smoother transition away from fossil-fueled peaker plants.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Overhead_View_of_Tehachapi_Energy_Storage_Project%2C_Tehachapi%2C_CA.png/960px-Overhead_View_of_Tehachapi_Energy_Storage_Project%2C_Tehachapi%2C_CA.png",
    body: `Two- and four-hour batteries now do work that peaker gas plants used to handle, with faster response and lower marginal cost. Grid operators are learning to dispatch storage for frequency regulation, ramp support, and post-outage black start. Longer-duration storage—iron-air, pumped hydro, thermal—will be needed for multi-day cloudy or low-wind periods. Household batteries follow a similar trajectory: paired stationary battery walls now provide several days of backup for essential loads in homes with rooftop solar.`,
    sources: [
      {
        label: "BloombergNEF — Global energy storage growth upheld by new markets",
        url: "https://about.bnef.com/insights/clean-energy/global-energy-storage-growth-upheld-by-new-markets/",
      },
      {
        label: "SEIA — U.S. installs 58 GWh of new energy storage in 2025",
        url: "https://seia.org/news/united-states-installs-58-gwh-of-new-energy-storage-in-2025/",
      },
      {
        label: "EIA — Solar, battery storage to lead new U.S. generating capacity additions in 2025",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=64586",
      },
      { label: "Grid energy storage — Wikipedia", url: "https://en.wikipedia.org/wiki/Grid_energy_storage" },
    ],
  },
  {
    slug: "heat-pump-deployment",
    category: "Energy",
    urgency: "Medium",
    emoji: "♨️",
    title: "Heat-pump deployment accelerates as fossil-fuel heating costs rise",
    summary:
      "Sales of cold-climate heat pumps are growing rapidly across northern markets, with rebates and air-quality concerns reinforcing the economic case to electrify heating.",
    why: "Heat pumps cut heating bills, reduce indoor air pollution, and improve summer cooling comfort.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Heat_pump_unit.webp/960px-Heat_pump_unit.webp.png",
    body: `Modern cold-climate heat pumps maintain useful output well below freezing, making them viable replacements for fossil heating across most of the temperate world. Pairing them with envelope improvements—insulation, air sealing, and right-sized ducts—amplifies savings. Upfront cost remains the biggest barrier; utility rebates, tax credits, and on-bill financing are closing that gap unevenly. Skilled installer capacity is now the limiting factor in many markets and warrants training-program investment.`,
    sources: [
      {
        label: "IEA — Is a turnaround in sight for heat pump markets?",
        url: "https://www.iea.org/commentaries/is-a-turnaround-in-sight-for-heat-pump-markets",
      },
      {
        label: "European Heat Pump Association — Heat pump sales up 9% in 2025 so far",
        url: "https://ehpa.org/news-and-resources/market-data/heat-pump-sales-up-9-in-2025-so-far/",
      },
      { label: "Heat pump — Wikipedia", url: "https://en.wikipedia.org/wiki/Heat_pump" },
    ],
  },
  {
    slug: "food-forest-pilots",
    category: "Food Systems",
    urgency: "Medium",
    emoji: "🌳",
    title: "Food-forest pilots take root in public parks and school grounds",
    summary:
      "Municipalities are partnering with agroforestry groups to plant edible understory layers in parks, schoolyards, and right-of-way strips that were previously turf.",
    why: "Public food forests provide free seasonal food, climate cooling, and community engagement with growing food.",
    time: "1d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Faidherbia_albida.JPG/960px-Faidherbia_albida.JPG",
    body: `Food forests stack productive species in vertical and temporal layers: tall nut trees over fruit trees, with shrubs, perennial vegetables, and groundcovers below. Once established, they require less water and labor per calorie than annual gardens. The harder challenges are governance and harvest etiquette, not horticulture: who prunes, who harvests, and how conflicts over hot spots get resolved. Successful pilots assign clear stewardship and run regular open-harvest days that build community familiarity.`,
    sources: [
      {
        label: "City of Seattle — Beacon Food Forest",
        url: "https://www.seattle.gov/neighborhoods/p-patch-gardening/garden-list/beacon-food-forest",
      },
      {
        label: "The Conservation Fund — Urban Food Forest at Browns Mill (Atlanta)",
        url: "https://www.conservationfund.org/our-impact/projects/urban-food-forest-at-browns-mill/",
      },
      { label: "Agroforestry — Wikipedia", url: "https://en.wikipedia.org/wiki/Agroforestry" },
    ],
  },
  {
    slug: "local-food-systems",
    category: "Food Systems",
    urgency: "Medium",
    emoji: "🥕",
    title: "Local food sales rebound as households hedge against price shocks",
    summary:
      "Farmers' markets and CSA memberships are growing again after a post-pandemic dip, with households citing price stability and known provenance as primary motivations.",
    why: "Local supply chains stay running when long-haul logistics stumble, and dollars circulate regionally.",
    time: "2d ago",
    image:
      "https://images.unsplash.com/photo-1749229964730-a5438ec7ae73?w=960&q=80",
    body: `Direct-to-eater channels cushion both farmer income and household spending against commodity-market volatility. Building habits around seasonal eating reduces dependence on long supply chains for fresh produce. Preserving—canning, freezing, dehydrating, lacto-fermenting—turns peak-season abundance into shelf-stable storage. Beyond resilience, local sourcing creates feedback loops that improve farming practices: customers and growers see each other regularly and adjust quickly.`,
    sources: [
      {
        label: "USDA Economic Research Service — Strong growth in direct sales from farms and ranches",
        url: "https://www.ers.usda.gov/data-products/chart-gallery/gallery/chart-detail/?chartId=108821",
      },
      {
        label: "USDA Agricultural Marketing Service — Community Supported Agriculture: New Models for Changing Markets",
        url: "https://www.ams.usda.gov/publications/content/community-supported-agriculture-new-models-changing-markets",
      },
      { label: "Local food — Wikipedia", url: "https://en.wikipedia.org/wiki/Local_food" },
    ],
  },
  {
    slug: "composting-toilet-pilots",
    category: "Sanitation",
    urgency: "Medium",
    emoji: "🚽",
    title: "Composting-toilet pilots expand in drought- and septic-stressed regions",
    summary:
      "Counties facing groundwater contamination and water scarcity are funding composting-toilet pilots as alternatives to failed septic systems and water-flushed sewers.",
    why: "Composting toilets eliminate flush water demand and return safe humus to soil instead of polluting waterways.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Compost_toilet.jpg/960px-Compost_toilet.jpg",
    body: `Properly managed composting toilets are odorless, hygienic, and especially suited to remote, off-grid, or freeze-prone sites. The science is settled: aerobic decomposition above the right temperatures destroys pathogens reliably. Regulatory acceptance lags innovation in many regions, which is why pilots matter. Cities can also use these systems for temporary infrastructure during disasters, festivals, and refugee shelters when standard sewerage is overwhelmed.`,
    sources: [
      {
        label: "Washington State Dept. of Health — Water-Conserving On-Site Wastewater Treatment Systems Standards",
        url: "https://doh.wa.gov/Portals/1/Documents/Pubs/337-016.pdf",
      },
      {
        label: "U.S. EPA — Composting Toilets technology fact sheet",
        url: "https://19january2017snapshot.epa.gov/sites/production/files/2015-06/documents/comp.pdf",
      },
      {
        label: "Composting toilet — Wikipedia",
        url: "https://en.wikipedia.org/wiki/Composting_toilet",
      },
    ],
  },
  {
    slug: "mutual-aid-networks",
    category: "Community",
    urgency: "Medium",
    emoji: "🤝",
    title: "Mutual-aid networks formalize disaster-response playbooks",
    summary:
      "Mutual-aid groups that emerged during pandemics and floods are publishing structured playbooks and partnering with local emergency management and faith communities.",
    why: "Neighborhood networks deliver help in the hours before formal response arrives, when speed saves lives.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/FEMA_-_40527_-_A_Red_Cross_volunteer_delivers_food_and_supplies_to_a_shelter_in_North_Dakota.jpg/960px-FEMA_-_40527_-_A_Red_Cross_volunteer_delivers_food_and_supplies_to_a_shelter_in_North_Dakota.jpg",
    body: `The most important resource in a disaster is a neighbor who knows where you keep your emergency kit and how to reach you. Mutual-aid networks turn that intuition into structured, repeatable practice: shared maps of vulnerable residents, tool libraries, and rotating check-in rosters. Formalization helps with funding and coordination but should not erase the bottom-up culture that makes these networks fast and flexible. New groups can start small with a single block and grow outward.`,
    sources: [
      {
        label: "MR Online — COVID-19 advocates distributing masks to protect Californians from wildfire smoke",
        url: "https://mronline.org/2025/01/15/covid-19-advocates-are-distributing-masks-to-protect-californians-from-wildfire-smoke/",
      },
      {
        label: "Fire Poppy Project — Mutual aid and resources for Altadena & Pasadena renters affected by the Eaton Fires",
        url: "https://firepoppyproject.org/",
      },
      { label: "Mutual aid — Wikipedia", url: "https://en.wikipedia.org/wiki/Mutual_aid" },
    ],
  },
  {
    slug: "groundwater-overdraft",
    category: "Water",
    urgency: "High",
    emoji: "🚰",
    title: "Groundwater overdraft hits new records in major agricultural basins",
    summary:
      "Satellite observations and well-level monitoring show accelerated aquifer decline in several agricultural basins, with subsidence and well failures rising in parallel.",
    why: "Aquifer collapse can be irreversible; conservation and recharge investments must happen before, not after.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Faryab-_village_dug_well.JPG/960px-Faryab-_village_dug_well.JPG",
    body: `When aquifer pressure drops below historical lows, fine sediment layers compact and lose their storage capacity permanently. Land subsidence damages roads, pipes, and canals. Resilience strategies include managed aquifer recharge during wet years, drip irrigation, soil-moisture monitoring, and shifting to less thirsty crops. For households on well water, knowing your aquifer, your well depth, and your pump's drawdown protects against unwelcome surprises during prolonged dry spells.`,
    sources: [
      {
        label: "CalMatters — Even in wet years, why are California's wells still dry?",
        url: "https://calmatters.org/environment/water/2025/02/california-groundwater-depleted-slow-recharge/",
      },
      {
        label: "California Dept. of Water Resources — Subsidence and groundwater over-pumping could limit future water deliveries",
        url: "https://water.ca.gov/News/Blog/2025/May-25/Study-Finds-That-Subsidence-Groundwater-Over-Pumping-Could-Limit-Future-Water-Deliveries",
      },
      { label: "Groundwater — Wikipedia", url: "https://en.wikipedia.org/wiki/Groundwater" },
    ],
  },
  {
    slug: "wind-microgrid-resilience",
    category: "Energy",
    urgency: "Medium",
    emoji: "🌬️",
    title: "Wildfire-zone microgrid pilots wrap solar, wind, and batteries",
    summary:
      "Utilities and communities in fire-prone regions are deploying islandable microgrids that combine solar, small wind, batteries, and standby generators to power critical loads during shutoffs.",
    why: "Microgrids keep hospitals, water pumps, and gas stations operational when transmission lines are de-energized.",
    time: "2d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wind_power_plants_in_Xinjiang%2C_China.jpg/960px-Wind_power_plants_in_Xinjiang%2C_China.jpg",
    body: `When transmission lines must be de-energized for fire safety, the cascading effects on water, sewage, fuel, and refrigeration are large. Microgrids that can island serve critical loads regardless of upstream grid status. The cleanest designs blend behind-the-meter solar with local batteries and a generator for long outages. Governance matters: clear protocols on who gets priority when capacity is constrained prevent disputes during real emergencies.`,
    sources: [
      {
        label: "Utility Dive — Microgrids keep the lights on for wildfire-prone California facilities",
        url: "https://www.utilitydive.com/news/microgrids-wildfire-prone-California-facilities-Schneider-Starkey-energy-resilience/750806/",
      },
      { label: "Microgrid — Wikipedia", url: "https://en.wikipedia.org/wiki/Microgrid" },
    ],
  },
  {
    slug: "flood-resilience-infrastructure",
    category: "Hazards",
    urgency: "Medium",
    emoji: "🌊",
    title: "Floodplain restoration funded as engineered defenses near limits",
    summary:
      "Governments are increasing funding for natural floodplain restoration—wetlands, setback levees, and reconnected meanders—as engineered defenses age and overtop more often.",
    why: "Soft infrastructure handles intense rainfall while improving wildlife habitat and groundwater recharge at the same time.",
    time: "3d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Humber_Weir.JPG/960px-Humber_Weir.JPG",
    body: `Concrete and rip-rap have limits. Reconnecting rivers with their floodplains absorbs surges, refills aquifers, and trims downstream peaks. Combined with smart flood-zone planning—elevating critical facilities, restricting basement bedrooms—soft infrastructure is often cheaper than ever-taller levees over decadal time spans. Property owners can contribute through rain gardens, permeable surfaces, and accurate elevation certificates that improve insurance and emergency-response quality.`,
    sources: [
      {
        label: "U.S. Army Corps of Engineers — Yakima River floodplain reconnection and ecosystem restoration",
        url: "https://www.nws.usace.army.mil/Media/News-Releases/Article/3590807/yakima-river-ecosystem-restoration-project-to-reconnect-floodplain-and-restore/",
      },
      {
        label: "U.S. Army Corps of Engineers — Abington Environmental Infrastructure project (PA)",
        url: "https://www.nap.usace.army.mil/Media/News-Releases/Article/3927987/army-corps-awards-contract-for-abington-environmental-infrastructure-project/",
      },
      { label: "Flood management — Wikipedia", url: "https://en.wikipedia.org/wiki/Flood_management" },
    ],
  },
  {
    slug: "solar-cooker-clean-cooking",
    category: "Energy",
    urgency: "Medium",
    emoji: "🍲",
    title: "Solar cookers scale in drought zones where fuelwood is scarce",
    summary:
      "NGOs and rural cooperatives are distributing parabolic and box solar cookers in regions where deforestation, fuel prices, and indoor air pollution make traditional cooking unsustainable.",
    why: "Solar cookers cut fuel costs, reduce smoke exposure, and free up time previously spent gathering wood.",
    time: "3d ago",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Parabolic_Solar_Cooker.jpg/960px-Parabolic_Solar_Cooker.jpg",
    body: `A simple insulated box cooker reaches temperatures sufficient for stews, grains, and bread on sunny days. Parabolic models reach frying and searing temperatures. Combined with retained-heat hay boxes, solar cooking can handle most family meals without fuel. Adoption depends on cultural fit, training, and supply chains for spare parts, not technology alone. Reductions in indoor smoke yield large public-health gains, particularly for women and children who otherwise breathe combustion byproducts daily.`,
    sources: [
      {
        label: "Solar Cookers International — New clean cooking collaboration with the United Nations",
        url: "https://www.solarcookers.org/about/blog/new-clean-cooking-collaboration-with-united-nations",
      },
      {
        label: "Solar4Africa — June 8, 2025 Friends and Family Letter on Malawi distribution scale-up",
        url: "https://www.solar4africa.org/newsletters/june-8-2025-friends-and-family-letter",
      },
      { label: "Solar cooker — Wikipedia", url: "https://en.wikipedia.org/wiki/Solar_cooker" },
    ],
  },
]

export function getStoryBySlug(slug: string): NewsStory | undefined {
  return newsStories.find((s) => s.slug === slug)
}
