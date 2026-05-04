export default function Library() {
  const guides = [
    { category: "Food growing", title: "Starting your first vegetable garden", description: "From soil preparation to first harvest. Everything a beginner needs to grow food successfully.", readTime: "12 min", free: true, emoji: "🌱" },
    { category: "Food growing", title: "Permaculture design principles", description: "How to design a self-sustaining food system that works with nature, not against it.", readTime: "20 min", free: false, emoji: "🌿" },
    { category: "Food growing", title: "Seed saving complete guide", description: "How to harvest, dry, store and replant seeds from your own crops year after year.", readTime: "15 min", free: false, emoji: "🫘" },
    { category: "Water", title: "Rainwater harvesting for beginners", description: "How to collect, store and filter rainwater for drinking, cooking and irrigation.", readTime: "10 min", free: true, emoji: "💧" },
    { category: "Water", title: "Building a gravity water filter", description: "Step-by-step guide to building a ceramic or sand filter for under €50.", readTime: "18 min", free: false, emoji: "🪣" },
    { category: "Energy", title: "Introduction to off-grid solar", description: "How solar panels, charge controllers, batteries and inverters work together.", readTime: "25 min", free: true, emoji: "☀️" },
    { category: "Energy", title: "Sizing your solar system", description: "Calculate exactly what size system you need based on your energy consumption.", readTime: "20 min", free: false, emoji: "⚡" },
    { category: "Food preservation", title: "Lacto-fermentation masterclass", description: "Preserve vegetables for months without refrigeration using only salt and water.", readTime: "22 min", free: true, emoji: "🫙" },
    { category: "Food preservation", title: "Dehydrating and drying food", description: "How to dehydrate vegetables, fruits and herbs for year-round storage.", readTime: "16 min", free: false, emoji: "🌶️" },
    { category: "Medical", title: "Emergency first aid essentials", description: "How to handle the most common emergencies when professional help is not available.", readTime: "30 min", free: true, emoji: "🩺" },
    { category: "Skills", title: "Basic carpentry for self-builders", description: "The fundamental skills needed to build raised beds, shelving and simple structures.", readTime: "35 min", free: false, emoji: "🔨" },
    { category: "Ancient wisdom", title: "Stoic philosophy and self-sufficiency", description: "What the ancient Stoics knew about living well with less — and why it matters today.", readTime: "14 min", free: true, emoji: "📜" },
  ]

  const categories = ["All", "Food growing", "Water", "Energy", "Food preservation", "Medical", "Skills", "Ancient wisdom"]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#009b70] uppercase mb-2">Library</p>
          <h1 className="text-3xl font-light text-[#0d1b2a] mb-3">Knowledge for a self-sufficient life</h1>
          <p className="text-[#3d5166] text-sm max-w-xl">Practical guides, ancient wisdom and skills for living on your own terms. Free guides for all. Full library for Guardian members and above.</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat} className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#d4dce8] text-[#3d5166] hover:border-[#009b70] hover:text-[#009b70] transition-colors">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((g, i) => (
            <div key={i} className="bg-white border border-[#d4dce8] rounded-xl p-5 hover:border-[#009b70] transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{g.emoji}</span>
                {g.free ? (
                  <span className="text-xs font-medium text-[#009b70] bg-[#e8f8f3] px-2 py-0.5 rounded-full">Free</span>
                ) : (
                  <span className="text-xs font-medium text-[#3d5166] bg-[#f5f7fa] px-2 py-0.5 rounded-full">🔒 Guardian+</span>
                )}
              </div>
              <p className="text-xs font-semibold tracking-wide text-[#8a9bb0] uppercase mb-1">{g.category}</p>
              <h3 className="text-sm font-medium text-[#0d1b2a] mb-2 leading-tight">{g.title}</h3>
              <p className="text-xs text-[#3d5166] leading-relaxed mb-3">{g.description}</p>
              <p className="text-xs text-[#8a9bb0]">{g.readTime} read</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
