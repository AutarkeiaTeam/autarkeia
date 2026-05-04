export default function Forums() {
  const topics = [
    { category: "Food growing", title: "Best vegetables to grow in southern Spain", replies: 24, views: 412, time: "2h ago", emoji: "🌱" },
    { category: "Energy", title: "Off-grid solar setup for a 3-bedroom house", replies: 38, views: 891, time: "4h ago", emoji: "☀️" },
    { category: "Water", title: "Rainwater collection — is it legal in Spain?", replies: 15, views: 234, time: "Yesterday", emoji: "💧" },
    { category: "Emergency preparedness", title: "72-hour kit — what I learned from actually testing mine", replies: 52, views: 1203, time: "Yesterday", emoji: "🎒" },
    { category: "Food preservation", title: "Lacto-fermentation failures — help!", replies: 19, views: 345, time: "2 days ago", emoji: "🫙" },
    { category: "Rural communities", title: "Anyone looking at Extremadura for a community project?", replies: 31, views: 678, time: "3 days ago", emoji: "🏡" },
    { category: "World events", title: "How are you preparing for potential energy disruptions this winter?", replies: 67, views: 1456, time: "3 days ago", emoji: "🌍" },
    { category: "Skills", title: "Recommended first aid courses in Spain", replies: 12, views: 198, time: "1 week ago", emoji: "🩺" },
  ]
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#009b70] uppercase mb-2">Forums</p>
            <h1 className="text-3xl font-light text-[#0d1b2a] mb-2">Community discussions</h1>
            <p className="text-[#3d5166] text-sm">Connect with people building self-sufficient lives.</p>
          </div>
          <button className="text-sm font-medium text-white bg-[#009b70] px-4 py-2 rounded-lg">New post +</button>
        </div>
        <div className="border border-[#d4dce8] rounded-xl overflow-hidden">
          {topics.map((t, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#f5f7fa] cursor-pointer transition-colors ${i < topics.length - 1 ? 'border-b border-[#d4dce8]' : ''}`}>
              <span className="text-2xl flex-shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#009b70] uppercase tracking-wide mb-0.5">{t.category}</p>
                <h3 className="text-sm font-medium text-[#0d1b2a] truncate">{t.title}</h3>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0 text-xs text-[#8a9bb0]">
                <span>{t.replies} replies</span>
                <span>{t.views} views</span>
                <span>{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
