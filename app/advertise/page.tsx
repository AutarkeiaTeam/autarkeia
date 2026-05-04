export default function Advertise() {
  const placements = [
    { name: "Leaderboard banner", location: "Top of Marketplace page", price: "€300/month", specs: "728x90px or responsive", best: "Gear brands, seed suppliers, solar companies" },
    { name: "Sidebar banner", location: "World News Watch sidebar", price: "€150/month", specs: "300x250px", best: "Books, courses, preparedness tools" },
    { name: "Sponsored story", location: "World News Watch feed", price: "€500/month", specs: "Native article format with your brand", best: "Companies with a relevant story to tell" },
    { name: "Sponsored product", location: "Marketplace featured slot", price: "€200/month", specs: "Featured card at top of category", best: "Product brands seeking direct sales" },
    { name: "Newsletter sponsor", location: "Weekly World News Watch briefing", price: "€250/month", specs: "Logo + 50-word message to subscribers", best: "Any brand relevant to self-sufficiency" },
    { name: "Community partner", location: "Rural Communities page", price: "€400/month", specs: "Logo + description + link", best: "Land agents, natural builders, off-grid specialists" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#009b70] uppercase mb-2">Advertise</p>
          <h1 className="text-3xl font-light text-[#0d1b2a] mb-3">Reach people who are<br />serious about self-sufficiency.</h1>
          <p className="text-[#3d5166] text-sm max-w-xl leading-relaxed">Autarkeia attracts a highly engaged, intentional audience — people actively investing in their independence. No generic ads. Only brands that genuinely serve our community.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { num: "12K+", label: "Monthly visitors" },
            { num: "68%", label: "Return visitor rate" },
            { num: "4.2 min", label: "Average session time" },
          ].map((s, i) => (
            <div key={i} className="bg-[#f5f7fa] rounded-xl p-5 text-center">
              <p className="text-2xl font-light text-[#009b70] mb-1">{s.num}</p>
              <p className="text-xs text-[#3d5166]">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-light text-[#0d1b2a] mb-4">Advertising placements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {placements.map((p, i) => (
            <div key={i} className="border border-[#d4dce8] rounded-xl p-5 hover:border-[#009b70] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-[#0d1b2a]">{p.name}</h3>
                <span className="text-sm font-semibold text-[#009b70]">{p.price}</span>
              </div>
              <p className="text-xs text-[#8a9bb0] mb-1">{p.location}</p>
              <p className="text-xs text-[#3d5166] mb-2">{p.specs}</p>
              <p className="text-xs text-[#3d5166]"><span className="font-medium">Best for:</span> {p.best}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0d1b2a] rounded-2xl p-8">
          <h2 className="text-xl font-light text-white mb-2">Get in touch</h2>
          <p className="text-[#8a9bb0] text-sm mb-6">We review all advertising partners manually. We only work with brands that genuinely serve the self-sufficiency and preparedness space.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#009b70]" placeholder="Your name" />
            <input className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#009b70]" placeholder="Company name" />
            <input className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#009b70]" placeholder="Email address" />
            <input className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#009b70]" placeholder="Website" />
          </div>
          <textarea className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#009b70] mb-4 h-24 resize-none" placeholder="Tell us about your brand and what placement interests you" />
          <button className="text-sm font-medium text-white bg-[#009b70] px-6 py-2.5 rounded-lg hover:bg-[#007a58] transition-colors">Send enquiry →</button>
        </div>
      </div>
    </div>
  )
}
