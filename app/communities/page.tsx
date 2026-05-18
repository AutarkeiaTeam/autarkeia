"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { MapPin, Minus, Plus } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

const livingOptions = [
  {
    title: "Individual or Family Home",
    desc: "Build your own self-sufficient home on your own land. Design and develop your property according to your vision.",
  },
  {
    title: "Co-living Community",
    desc: "Join a group of people building and sharing a house together. Co-own, share resources, and build community while maintaining individual autonomy.",
  },
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
  const { t } = useI18n()
  const [locations, setLocations] = useState<string[]>([])
  const [draftLocation, setDraftLocation] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)

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
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight max-w-3xl">{t("communities.title")}</h1>
          <p className="mt-6 text-white/75 max-w-3xl leading-relaxed">{t("communities.intro")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register-interest" className="rounded-lg bg-[#009b70] px-5 py-3 text-sm font-medium hover:bg-[#008060]">
              {t("communities.cta_register")}
            </a>
          </div>
        </div>
      </section>

      <section id="vision" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">Choose your path</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {livingOptions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-sm transition-colors hover:border-[#009b70]"
              >
                <h3 className="text-xl font-medium text-[#0d1b2a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3d5166]">{item.desc}</p>
                <a href="#register-interest" className="mt-6 inline-block text-sm font-medium text-[#009b70] hover:text-[#007a58]">
                  Explore this option →
                </a>
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
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#d4dce8] bg-[#0d1b2a] text-white">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Current Focus</p>
                <h3 className="mt-1 text-2xl font-light">Current Focus: Spain</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/70">
                  Community development is currently in progress across Spain. Expanding to other regions globally as demand and conditions align.
                </p>
              </div>
              <div className="flex rounded-lg border border-white/15 bg-white/5">
                <button
                  type="button"
                  onClick={() => setMapZoom((zoom) => Math.max(0.85, Number((zoom - 0.15).toFixed(2))))}
                  className="border-r border-white/15 p-2 text-white/80 hover:text-white"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom((zoom) => Math.min(1.35, Number((zoom + 0.15).toFixed(2))))}
                  className="p-2 text-white/80 hover:text-white"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative h-[420px] w-full bg-[#0b1724]">
              <svg
                viewBox="0 0 900 520"
                role="img"
                aria-label="Interactive map centered on Spain with community development marker"
                className="h-full w-full"
              >
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#12314a" />
                    <stop offset="100%" stopColor="#0b1724" />
                  </radialGradient>
                  <filter id="spainGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="900" height="520" fill="url(#mapGlow)" />
                <g transform={`translate(450 260) scale(${mapZoom}) translate(-450 -260)`}>
                  <path
                    d="M420 55 517 48 608 78 655 134 646 206 604 251 612 319 571 380 487 411 399 391 358 324 302 295 272 228 310 149Z"
                    fill="#24384d"
                    stroke="#3b5268"
                    strokeWidth="2"
                  />
                  <path
                    d="M250 78 322 62 375 101 357 169 292 177 230 143Z"
                    fill="#24384d"
                    stroke="#3b5268"
                    strokeWidth="2"
                  />
                  <path
                    d="M540 182 608 201 634 254 603 303 535 285 505 229Z"
                    fill="#24384d"
                    stroke="#3b5268"
                    strokeWidth="2"
                  />
                  <path
                    d="M130 355 241 331 337 360 405 432 386 495 219 500 109 453Z"
                    fill="#1f3446"
                    stroke="#334b60"
                    strokeWidth="2"
                  />
                  <path
                    d="M651 252 755 229 816 280 798 361 694 384 626 326Z"
                    fill="#1f3446"
                    stroke="#334b60"
                    strokeWidth="2"
                  />
                  <path
                    d="M340 221 409 203 466 227 478 278 438 316 370 308 321 270Z"
                    fill="#009b70"
                    filter="url(#spainGlow)"
                    stroke="#8ff0d4"
                    strokeWidth="3"
                  />
                  <path
                    d="M470 303 500 310 506 341 476 350 454 329Z"
                    fill="#007a58"
                    stroke="#8ff0d4"
                    strokeWidth="2"
                  />
                  <line x1="410" y1="244" x2="520" y2="158" stroke="#8ff0d4" strokeDasharray="4 5" strokeWidth="2" />
                  <circle cx="410" cy="244" r="7" fill="#e8f8f3" stroke="#009b70" strokeWidth="4" />
                  <foreignObject x="520" y="112" width="250" height="92">
                    <div className="rounded-xl border border-[#009b70]/40 bg-[#0d1b2a]/90 p-3 text-white shadow-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#009b70]" />
                        <div>
                          <p className="text-sm font-medium">Spain</p>
                          <p className="mt-1 text-xs text-white/70">Community Development in Progress</p>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="register-interest" className="scroll-mt-28 py-14 bg-[#f5f7fa]">
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
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2">
                <p className="font-medium text-[#0d1b2a]">What type of community?</p>
                {["Independent family plot", "Co-living with friends", "Small village 10-30 people", "Larger community 30-100 people", "Flexible/open"].map((o) => (
                  <label key={o} className="flex gap-2 text-sm">
                    <input type="checkbox" /> {o}
                  </label>
                ))}
              </fieldset>
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2">
                <p className="font-medium text-[#0d1b2a]">Type of home</p>
                {["Self-built natural home", "Prefab eco home", "Renovated existing building", "Flexible"].map((o) => (
                  <label key={o} className="flex gap-2 text-sm">
                    <input type="checkbox" /> {o}
                  </label>
                ))}
              </fieldset>
              <select className="rounded-lg border border-[#d4dce8] p-3 bg-white" required>
                <option>Investment capacity</option>
                <option>Under €50k</option>
                <option>€50k-€150k</option>
                <option>€150k-€500k</option>
                <option>€500k-€1M</option>
                <option>Over €1M</option>
                <option>I want to rent not buy</option>
              </select>
              <select className="rounded-lg border border-[#d4dce8] p-3 bg-white" required>
                <option>Investor type</option>
                <option>Individual/family</option>
                <option>Group of friends</option>
                <option>Small investor group</option>
                <option>Institutional/fund</option>
                <option>Not sure yet</option>
              </select>
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2">
                <p className="font-medium text-[#0d1b2a]">Energy preference</p>
                {["Solar", "Wind", "Micro-hydro", "Combined off-grid", "Connected to grid as backup", "Not sure"].map((o) => (
                  <label key={o} className="flex gap-2 text-sm">
                    <input type="checkbox" /> {o}
                  </label>
                ))}
              </fieldset>
              <fieldset className="rounded-xl border border-[#d4dce8] bg-white p-5 space-y-2">
                <p className="font-medium text-[#0d1b2a]">Food production interest</p>
                {[
                  "Grow all my own food",
                  "Most of my food",
                  "Some of my food",
                  "Buy from the community farm",
                  "Not important",
                ].map((o) => (
                  <label key={o} className="flex gap-2 text-sm">
                    <input type="checkbox" /> {o}
                  </label>
                ))}
              </fieldset>
              <select className="rounded-lg border border-[#d4dce8] p-3 bg-white sm:col-span-2" required>
                <option>When are you thinking of making this move?</option>
                <option>As soon as possible</option>
                <option>1-2 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
                <option>Just exploring</option>
              </select>
              <textarea className="rounded-lg border border-[#d4dce8] p-3 bg-white sm:col-span-2" rows={4} placeholder="Additional notes" />
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
