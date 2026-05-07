import { BatteryCharging, Droplets, HeartPulse, Leaf, Radio, Wrench } from "lucide-react"

const bundles = [
  { name: "72-Hour Emergency Kit", items: "water + food + medical + light", original: "€234", price: "€189", savings: "€45", affiliate: "https://www.amazon.es/s?k=72+hour+emergency+kit&tag=autarkeia-es" },
  { name: "Home Energy Independence Starter", items: "solar panel + power station + MPPT controller", original: "€674", price: "€549", savings: "€125", affiliate: "https://www.amazon.es/s?k=home+energy+independence+starter+kit&tag=autarkeia-es" },
  { name: "Food Growing Starter", items: "raised bed + seeds + tools + soil meter", original: "€184", price: "€149", savings: "€35", affiliate: "https://www.amazon.es/s?k=food+growing+starter+kit&tag=autarkeia-es" },
  { name: "Complete Emergency Readiness", items: "water filter + 30-day food + first aid + communications", original: "€544", price: "€449", savings: "€95", affiliate: "https://www.amazon.es/s?k=complete+emergency+readiness+kit&tag=autarkeia-es" },
  { name: "Off-Grid Water System", items: "Berkey + rain barrel + storage containers + hand pump", original: "€470", price: "€390", savings: "€80", affiliate: "https://www.amazon.es/s?k=off+grid+water+system&tag=autarkeia-es" },
]

const products = [
  ["Water","Berkey Water Filter","Filters tap, well or collected water to drinking quality.","€320"],["Water","100L Water Storage Tank","Food-grade stackable storage for household resilience.","€45"],["Food","72-Hour Emergency Food Kit","Freeze-dried meals with long shelf life.","€85"],["Food","25kg Rice Bulk Storage","Long-term staple food storage bucket.","€32"],["Energy","Jackery Explorer 500","Portable power station for essentials.","€499"],["Energy","200W Solar Panel Kit","Starter panel kit for backup energy.","€180"],["Medical","Comprehensive First Aid Kit","Emergency baseline medical kit.","€49"],["Medical","30-Day Medication Organiser","Keeps critical medications organized.","€18"],["Communications","Baofeng UV-5R Radio","Reliable two-way communication.","€29"],["Communications","Solar Wind-Up Emergency Radio","Radio and USB charge without grid.","€39"],["Food Growing","Raised Bed Starter Kit","Simple first step for home food production.","€89"],["Food Growing","Seed Bank — 50 Varieties","Open-pollinated seeds for yearly planting.","€45"],["Tools & Shelter","Multi-Tool Survival Kit","Compact field tool set.","€65"],["Tools & Shelter","Hand Pump Water Filter","Portable filtration for outdoor sources.","€35"],["Energy","12V 100Ah LiFePO4 Battery","Long-cycle battery backbone.","€280"],["Food","Fermentation Crock Set","Preserve harvest without electricity.","€65"],
  ["Water","LifeStraw personal filter","Portable emergency water filtration.","€25"],["Water","Sawyer Squeeze filter","Compact high-capacity field filter.","€35"],["Water","5-gallon water containers (set of 4)","Long-duration storage for households.","€40"],["Water","WaterBOB bathtub emergency reservoir","Quick emergency bathtub storage.","€30"],["Water","Katadyn Pocket filter","Heavy-duty long-life water filter.","€280"],["Water","Rain barrel 200L","Rainwater collection for resilience.","€65"],["Water","Manual water pump","No-power transfer pump.","€45"],
  ["Food","1-month freeze dried food supply","Extended disruption food reserve.","€320"],["Food","Emergency calorie bars (3600 cal)","Compact high-calorie backup food.","€18"],["Food","Canned meat variety pack","Protein for long-term storage.","€55"],["Food","Honey bulk 5kg","Calorie-dense natural sweetener.","€45"],["Food","Salt bulk 5kg","Core preservation and nutrition input.","€8"],["Food","Dried lentils 10kg","Shelf-stable protein staple.","€22"],["Food","Oats bulk 5kg","Versatile long-term carbohydrate source.","€15"],["Food","Coconut oil bulk","Stable cooking fat reserve.","€35"],
  ["Energy","EcoFlow River 2 power station","Fast-charge portable backup power.","€299"],["Energy","Bluetti AC200P","High-capacity off-grid station.","€1,299"],["Energy","400W flexible solar panel","Expandable solar generation panel.","€180"],["Energy","MPPT solar charge controller","Efficient battery charging from solar.","€45"],["Energy","12V car battery inverter","Convert battery to usable AC output.","€35"],["Energy","Hand crank emergency generator","Manual backup electricity generation.","€89"],["Energy","4x AAA battery solar charger","Solar charger for small batteries.","€25"],["Energy","Candles bulk pack emergency","Simple non-electric light backup.","€18"],
  ["Medical","Israeli battle dressing bandage","Serious bleeding wound dressing.","€12"],["Medical","Tourniquets CAT (set of 2)","Critical hemorrhage control kit.","€35"],["Medical","Emergency mylar blankets pack","Heat retention in cold emergencies.","€15"],["Medical","N95 respirator masks (20 pack)","Airborne particulate protection.","€28"],["Medical","Iodine tablets water purification","Portable emergency water treatment.","€12"],["Medical","Activated charcoal capsules","General emergency kit supplement.","€18"],["Medical","Suture kit","Field wound closure tools.","€25"],["Medical","Blood pressure monitor","Home monitoring for health risks.","€45"],
  ["Food Growing","Composting bin","Turn waste into fertile soil.","€85"],["Food Growing","Hand trowel set","Core hand tools for planting.","€22"],["Food Growing","Heirloom tomato seed collection","Diverse tomato varieties for gardens.","€18"],["Food Growing","Grow lights LED panel","Indoor seedling and plant support.","€65"],["Food Growing","Drip irrigation kit","Water-efficient crop irrigation.","€45"],["Food Growing","Soil pH meter","Measure soil condition accurately.","€18"],["Food Growing","Greenhouse tunnel","Season extension for food crops.","€120"],
  ["Tools & Shelter","Paracord 100m","Multi-use cordage for shelter and repairs.","€18"],["Tools & Shelter","Emergency tarp 4x6m","Fast rain and wind protection.","€25"],["Tools & Shelter","Folding hand saw","Compact cutting tool.","€35"],["Tools & Shelter","Fixed blade survival knife","Durable field knife.","€65"],["Tools & Shelter","Fire starting kit (ferro rod, lighter, matches)","Reliable multiple fire-start options.","€22"],["Tools & Shelter","Duct tape multipack","Rapid repairs across scenarios.","€15"],["Tools & Shelter","Work gloves heavy duty","Hand protection for manual tasks.","€18"],["Tools & Shelter","Head torch 1000 lumen","Hands-free emergency lighting.","€35"],["Tools & Shelter","Walkie talkies set of 2","Short-range off-grid communication.","€45"],
  ["Communications","Garmin inReach Mini satellite communicator","Satellite messaging and SOS.","€349"],["Communications","Emergency whistle pack","Low-tech attention signal.","€8"],["Communications","Signal mirror","Daylight long-distance signaling.","€12"],
].map((p, i) => ({ id: i + 1, category: p[0], name: p[1], description: p[2], price: p[3], affiliate: `https://www.amazon.es/s?k=${encodeURIComponent(p[1] as string)}&tag=autarkeia-es` }))

const categoryMeta = {
  Water: { icon: Droplets, bg: "bg-blue-50", color: "text-blue-600" },
  Food: { icon: Leaf, bg: "bg-amber-50", color: "text-amber-700" },
  Energy: { icon: BatteryCharging, bg: "bg-yellow-50", color: "text-yellow-700" },
  Medical: { icon: HeartPulse, bg: "bg-red-50", color: "text-red-600" },
  "Food Growing": { icon: Leaf, bg: "bg-emerald-50", color: "text-emerald-700" },
  "Tools & Shelter": { icon: Wrench, bg: "bg-slate-100", color: "text-slate-700" },
  Communications: { icon: Radio, bg: "bg-violet-50", color: "text-violet-700" },
} as const

export default function Marketplace() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Marketplace</h1>
        <p className="mt-3 text-sm text-[#3d5166] max-w-2xl">Preparedness and self-sufficiency gear curated for practical resilience. We may earn affiliate commissions at no additional cost to you.</p>

        <section className="mt-10">
          <h2 className="text-2xl font-light text-[#0d1b2a] mb-4">Bundles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {bundles.map((bundle) => (
              <article key={bundle.name} className="rounded-xl border-2 border-[#009b70]/25 bg-[#f5f7fa] p-5">
                <h3 className="font-medium text-[#0d1b2a]">{bundle.name}</h3>
                <p className="mt-1 text-sm text-[#3d5166]">{bundle.items}</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-sm text-[#8a9bb0] line-through">{bundle.original}</span>
                  <span className="text-xl font-semibold text-[#0d1b2a]">{bundle.price}</span>
                  <span className="text-sm font-medium text-[#009b70]">Save {bundle.savings}</span>
                </div>
                <a href={bundle.affiliate} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]">View bundle →</a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-light text-[#0d1b2a] mb-4">All products ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const meta = categoryMeta[p.category as keyof typeof categoryMeta]
              const Icon = meta.icon
              return (
                <article key={p.id} className="rounded-xl border border-[#d4dce8] p-4 hover:border-[#009b70] transition-colors">
                  <div className={`h-12 w-12 rounded-lg ${meta.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${meta.color}`} />
                  </div>
                  <p className="mt-3 text-xs font-semibold tracking-wide text-[#8a9bb0] uppercase">{p.category}</p>
                  <h3 className="mt-1 text-sm font-medium text-[#0d1b2a]">{p.name}</h3>
                  <p className="mt-2 text-xs text-[#3d5166]">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-[#0d1b2a]">{p.price}</span>
                    <a href={p.affiliate} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]">Buy →</a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
