"use client"

import { FormEvent, useState } from "react"
import { Globe } from "lucide-react"

const plans = [
  { icon: "🏠", title: "Housing & land", desc: "Natural building, earthen methods, timber structures, and straw bale homes." },
  { icon: "🌾", title: "Food systems", desc: "Communal growing, food forests, regenerative design, and permaculture principles." },
  { icon: "⚡", title: "Energy & water", desc: "Off-grid solar, wind, rainwater harvesting, and resilient water systems." },
  { icon: "🤝", title: "Governance", desc: "Transparent co-governance with member participation and democratic decisions." },
]

const models = [
  "Independent family plot — buy your land, build your home, full privacy",
  "Co-living group — friends or like-minded people sharing a larger property",
  "Community investor — pool capital with others, Autarkeia develops the site",
  "Infrastructure subscriber — buy land near our shared solar/food infrastructure, pay monthly fee for access",
  "Seasonal resident — spend weeks or months per year, no permanent commitment",
  "Global partner — help us build in your country or region",
]

export default function Communities() {
  const [locations, setLocations] = useState<string[]>([])
  const [draftLocation, setDraftLocation] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const addLocation = () => {
    if (locations.length >= 10 || !draftLocation.trim()) return
    setLocations((prev) => [...prev, draftLocation.trim()])
    setDraftLocation("")
  }

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, idx) => idx !== index))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0d1b2a] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight max-w-3xl">The future of self-sufficient living. Built together.</h1>
          <p className="mt-6 text-white/75 max-w-3xl leading-relaxed">
            Autarkeia is building a global network of self-sufficient communities — where people grow their own food, generate their own energy,
            build their own homes, and live free from dependence on fragile systems. We are in the planning phase and looking for people who share this vision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register-interest" className="rounded-lg bg-[#009b70] px-5 py-3 text-sm font-medium hover:bg-[#008060]">Register your interest</a>
            <a href="#vision" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-medium hover:bg-white/10">Learn about our vision</a>
          </div>
        </div>
      </section>

      <section id="vision" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">What we plan to build</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {plans.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#d4dce8] p-6 bg-[#f5f7fa]">
                <p className="text-2xl">{item.icon}</p>
                <h3 className="mt-3 text-lg font-medium text-[#0d1b2a]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#3d5166]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a]">A model for every vision</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {models.map((model) => (
              <div key={model} className="rounded-xl border border-[#d4dce8] bg-white p-5 text-sm text-[#3d5166]">{model}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a]">Where in the world?</h2>
          <p className="mt-4 text-[#3d5166] max-w-3xl">
            We are open to building anywhere there is enough interest and the right conditions. While we are initially exploring locations in
            southern Europe and beyond, we are genuinely global in our ambition. Tell us where you want to be.
          </p>
          <div className="mt-6 rounded-2xl border border-[#d4dce8] bg-[#0d1b2a] p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="h-6 w-6 text-[#009b70]" />
              <p className="font-medium">Global location map placeholder</p>
            </div>
            <p className="text-sm text-white/70">Community development is planned for regions across southern Europe and anywhere in the world where demand and conditions align.</p>
          </div>
        </div>
      </section>

      <section id="register-interest" className="py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">Register your interest</h2>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-lg border border-[#d4dce8] p-3" placeholder="Full name" required />
              <input type="email" className="rounded-lg border border-[#d4dce8] p-3" placeholder="Email address" required />
              <input className="rounded-lg border border-[#d4dce8] p-3" placeholder="Country of residence" required />
              <input className="rounded-lg border border-[#d4dce8] p-3" placeholder="City/region of residence" required />
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Age range</option><option>18-25</option><option>26-35</option><option>36-45</option><option>46-55</option><option>55+</option></select>
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Household type</option><option>single</option><option>couple</option><option>family with children</option><option>group of friends</option><option>other</option></select>
            </div>

            <div className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-4">
              <p className="font-medium text-[#0d1b2a]">Where would you like to live? (up to 10 locations)</p>
              <div className="flex gap-2">
                <input value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)} className="flex-1 rounded-lg border border-[#d4dce8] p-3" placeholder="Add location" />
                <button type="button" onClick={addLocation} className="rounded-lg bg-[#009b70] px-4 text-white">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {locations.filter((item) => item.trim()).map((item, idx) => (
                  <button type="button" key={`${item}-${idx}`} onClick={() => removeLocation(idx)} className="rounded-full bg-[#e8f8f3] px-3 py-1 text-sm text-[#0d1b2a]">
                    {item} ×
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Climate preference</option><option>Mediterranean</option><option>Temperate</option><option>Tropical</option><option>Cold</option><option>Any</option></select>
                <select className="rounded-lg border border-[#d4dce8] p-3" required><option>How far from a city?</option><option>Within 30min</option><option>30-60min</option><option>1-2 hours</option><option>Remote is fine</option></select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2"><p className="font-medium text-[#0d1b2a]">What type of community?</p>{["Independent family plot","Co-living with friends","Small village 10-30 people","Larger community 30-100 people","Flexible/open"].map((o)=><label key={o} className="flex gap-2 text-sm"><input type="checkbox" /> {o}</label>)}</fieldset>
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2"><p className="font-medium text-[#0d1b2a]">Type of home</p>{["Self-built natural home","Prefab eco home","Renovated existing building","Flexible"].map((o)=><label key={o} className="flex gap-2 text-sm"><input type="checkbox" /> {o}</label>)}</fieldset>
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Investment capacity</option><option>Under €50k</option><option>€50k-€150k</option><option>€150k-€500k</option><option>€500k-€1M</option><option>Over €1M</option><option>I want to rent not buy</option></select>
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Investor type</option><option>Individual/family</option><option>Group of friends</option><option>Small investor group</option><option>Institutional/fund</option><option>Not sure yet</option></select>
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2"><p className="font-medium text-[#0d1b2a]">Energy preference</p>{["Solar","Wind","Micro-hydro","Combined off-grid","Connected to grid as backup","Not sure"].map((o)=><label key={o} className="flex gap-2 text-sm"><input type="checkbox" /> {o}</label>)}</fieldset>
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>Food production interest</option><option>I want to grow all my own food</option><option>Most of my food</option><option>Some of my food</option><option>I prefer to buy from the community farm</option><option>Not important</option></select>
              <select className="rounded-lg border border-[#d4dce8] p-3" required><option>When are you thinking of making this move?</option><option>As soon as possible</option><option>1-2 years</option><option>3-5 years</option><option>5+ years</option><option>Just exploring</option></select>
              <textarea className="rounded-lg border border-[#d4dce8] p-3 sm:col-span-2" rows={4} placeholder="Additional notes" />
            </div>

            <button className="rounded-lg bg-[#009b70] px-6 py-3 text-white font-medium hover:bg-[#008060]">Register my interest →</button>
            {submitted && (
              <p className="rounded-lg border border-[#009b70]/40 bg-[#e8f8f3] p-4 text-sm text-[#0d1b2a]">
                Thank you. We have received your interest. We will be in touch as we develop communities in your preferred locations. This data helps us demonstrate demand to investors and partners.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
