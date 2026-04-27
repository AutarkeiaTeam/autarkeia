"use client"

const categories = [
  { name: "Food", score: 42 },
  { name: "Water", score: 80 },
  { name: "Energy", score: 68 },
  { name: "Shelter", score: 55 },
  { name: "Resilience", score: 30 },
]

function getScoreColor(score: number): string {
  if (score >= 70) return "#009b70" // green
  if (score >= 40) return "#f59e0b" // amber
  return "#ef4444" // red
}

export function ScoreCard() {
  const overallScore = 67

  return (
    <div 
      className="w-full max-w-sm rounded-2xl bg-white p-6" 
      style={{ 
        border: '0.5px solid #d4dce8',
        borderRadius: '16px'
      }}
    >
      <div className="text-center mb-6">
        <p className="text-sm font-normal text-[#3d5166] mb-2">Your Self-Sufficiency Score</p>
        
        {/* Circular Progress Ring */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#f5f7fa"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#009b70"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 352} 352`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-light text-[#0d1b2a]">{overallScore}%</span>
            <span className="text-xs font-light text-[#8a9bb0]">Overall</span>
          </div>
        </div>
      </div>

      {/* Category Bars */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-normal text-[#0d1b2a]">{category.name}</span>
              <span className="font-light text-[#8a9bb0]">{category.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#f5f7fa]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${category.score}%`,
                  backgroundColor: getScoreColor(category.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-center font-light text-[#8a9bb0]">
        Based on 47 factors across 5 categories
      </p>
    </div>
  )
}
