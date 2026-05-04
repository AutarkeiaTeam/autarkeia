export default function Communities() {
  const features = [
    { emoji: "🏠", title: "Housing & land", desc: "Natural building techniques — earthen, timber, straw bale — with communal workshops to learn as you build.", badge: "In development" },
    { emoji: "🌱", title: "Food systems", desc: "Communal growing plots, food forests, permaculture design and seed libraries.", badge: "In development" },
    { emoji: "☀️", title: "Energy & water", desc: "Off-grid solar microgrids, rainwater harvesting and natural filtration.", badge: "In development" },
    { emoji: "👥", title: "Membership", desc: "Transparent co-governance. Platform users get priority access and discounted membership.", badge: "Waitlist open" },
  ]
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#5c4a2a] uppercase mb-2">Rural Communities</p>
          <h1 className="text-3xl font-light text-[#0d1b2a] mb-3">The real world version of self-sufficiency.</h1>
          <p className="text-[#3d5166] text-sm max-w-xl leading-relaxed">Autarkeia builds intentional rural communities where members grow food together, build their homes, generate clean energy, and live free from dependence on fragile systems.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((item, i) => (
            <div key={i} className="bg-[#f5efe4] border border-[#d4b896] rounded-xl p-6">
              <span className="text-3xl mb-4 block">{item.emoji}</span>
              <h3 className="text-base font-medium text-[#0d1b2a] mb-2">{item.title}</h3>
              <p className="text-sm text-[#8a7055] leading-relaxed mb-3">{item.desc}</p>
              <span className="text-xs font-semibold text-[#5c4a2a] bg-[#5c4a2a]/10 px-2 py-1 rounded">{item.badge}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#0d1b2a] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-light text-white mb-3">First communities launching in Spain and Portugal</h2>
          <p className="text-[#8a9bb0] text-sm mb-6 max-w-lg mx-auto">Register your interest to be notified first and get priority membership access.</p>
          <button className="text-sm font-medium text-white bg-[#5c4a2a] px-6 py-3 rounded-lg">Register interest</button>
        </div>
      </div>
    </div>
  )
}
