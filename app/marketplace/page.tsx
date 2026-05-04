export default function Marketplace() {
  const products = [
    { id: 1, category: "Water", name: "Berkey Water Filter", description: "Filters tap, well or collected water to drinking quality. Gravity-fed, no electricity needed.", price: "€320", image: "💧", affiliate: "https://www.amazon.es/s?k=berkey+water+filter&tag=autarkeia-es" },
    { id: 2, category: "Water", name: "100L Water Storage Tank", description: "Food-grade stackable water storage. Essential baseline for any household.", price: "€45", image: "🪣", affiliate: "https://www.amazon.es/s?k=deposito+agua+potable+100l&tag=autarkeia-es" },
    { id: 3, category: "Food", name: "72-Hour Emergency Food Kit", description: "Freeze-dried meals, 5-year shelf life. No cooking required.", price: "€85", image: "🥫", affiliate: "https://www.amazon.es/s?k=emergency+food+kit&tag=autarkeia-es" },
    { id: 4, category: "Food", name: "25kg Rice Bulk Storage", description: "Long-term food staple. Sealed bucket, 10+ year shelf life when stored correctly.", price: "€32", image: "🌾", affiliate: "https://www.amazon.es/s?k=arroz+granel+25kg&tag=autarkeia-es" },
    { id: 5, category: "Energy", name: "Jackery Explorer 500", description: "500Wh portable solar generator. Runs lights, phones, small appliances for days.", price: "€499", image: "⚡", affiliate: "https://www.amazon.es/s?k=jackery+explorer+500&tag=autarkeia-es" },
    { id: 6, category: "Energy", name: "200W Solar Panel Kit", description: "Monocrystalline panel with mounting hardware. Start your off-grid energy system.", price: "€180", image: "☀️", affiliate: "https://www.amazon.es/s?k=panel+solar+200w&tag=autarkeia-es" },
    { id: 7, category: "Medical", name: "Comprehensive First Aid Kit", description: "Covers burns, trauma and fractures. BS 8599-1 compliant. Essential baseline.", price: "€49", image: "🩺", affiliate: "https://www.amazon.es/s?k=botiquin+primeros+auxilios+completo&tag=autarkeia-es" },
    { id: 8, category: "Medical", name: "30-Day Medication Organiser", description: "Keep critical medications organised and accessible in any emergency.", price: "€18", image: "💊", affiliate: "https://www.amazon.es/s?k=pastillero+mensual&tag=autarkeia-es" },
    { id: 9, category: "Communications", name: "Baofeng UV-5R Radio", description: "Two-way radio. Works when mobile networks are down. Range up to 5km.", price: "€29", image: "📻", affiliate: "https://www.amazon.es/s?k=baofeng+uv-5r&tag=autarkeia-es" },
    { id: 10, category: "Communications", name: "Solar Wind-Up Emergency Radio", description: "No batteries needed. AM/FM/weather alerts. USB charge port.", price: "€39", image: "🔦", affiliate: "https://www.amazon.es/s?k=radio+solar+emergencia&tag=autarkeia-es" },
    { id: 11, category: "Food Growing", name: "Raised Bed Starter Kit", description: "120x60cm cedar raised bed. Best first step for food production.", price: "€89", image: "🌱", affiliate: "https://www.amazon.es/s?k=huerto+urbano+madera&tag=autarkeia-es" },
    { id: 12, category: "Food Growing", name: "Seed Bank — 50 Varieties", description: "Non-hybrid, open-pollinated seeds. Save seeds year after year indefinitely.", price: "€45", image: "🫘", affiliate: "https://www.amazon.es/s?k=semillas+hortalizas+variadas&tag=autarkeia-es" },
    { id: 13, category: "Tools", name: "Multi-Tool Survival Kit", description: "Leatherman-style multi-tool. Pliers, knife, saw, screwdrivers. Lifetime tool.", price: "€65", image: "🔧", affiliate: "https://www.amazon.es/s?k=navaja+multiusos&tag=autarkeia-es" },
    { id: 14, category: "Tools", name: "Hand Pump Water Filter", description: "Sawyer squeeze filter. Filters 100,000 gallons. Essential for outdoor water sources.", price: "€35", image: "🏕️", affiliate: "https://www.amazon.es/s?k=filtro+agua+portatil+sawyer&tag=autarkeia-es" },
    { id: 15, category: "Energy", name: "12V 100Ah LiFePO4 Battery", description: "Lithium iron phosphate. 3000+ cycle life. The backbone of any off-grid system.", price: "€280", image: "🔋", affiliate: "https://www.amazon.es/s?k=bateria+litio+100ah+12v&tag=autarkeia-es" },
    { id: 16, category: "Food", name: "Fermentation Crock Set", description: "Preserve harvests. Kimchi, sauerkraut, pickles — no electricity needed.", price: "€65", image: "🫙", affiliate: "https://www.amazon.es/s?k=crock+fermentacion&tag=autarkeia-es" },
  ]

  const categories = ["All", "Water", "Food", "Energy", "Medical", "Communications", "Food Growing", "Tools"]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#009b70] uppercase mb-2">Marketplace</p>
          <h1 className="text-3xl font-light text-[#0d1b2a] mb-3">Curated gear for self-sufficient living</h1>
          <p className="text-[#3d5166] text-sm max-w-xl">Every product vetted for quality and relevance. We earn a small affiliate commission when you buy — at no extra cost to you — which funds the platform.</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat} className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#d4dce8] text-[#3d5166] hover:border-[#009b70] hover:text-[#009b70] transition-colors">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-[#d4dce8] rounded-xl p-4 hover:border-[#009b70] transition-colors">
              <div className="w-full h-24 bg-[#f5f7fa] rounded-lg flex items-center justify-center text-4xl mb-3">{p.image}</div>
              <p className="text-xs font-semibold tracking-wide text-[#8a9bb0] uppercase mb-1">{p.category}</p>
              <h3 className="text-sm font-medium text-[#0d1b2a] mb-2 leading-tight">{p.name}</h3>
              <p className="text-xs text-[#3d5166] leading-relaxed mb-3">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[#0d1b2a]">{p.price}</span>
                <a href={p.affiliate} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white bg-[#009b70] px-3 py-1.5 rounded-lg hover:bg-[#007a58] transition-colors">Buy →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
