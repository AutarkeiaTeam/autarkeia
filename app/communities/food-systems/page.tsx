import Link from "next/link"

export const metadata = {
  title: "Food Systems — Communities — Autarkeia",
  description: "Communal growing, food forests, regenerative design, and permaculture for Autarkeia communities.",
}

export default function FoodSystemsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/communities" className="text-sm text-[#009b70] hover:underline">
          ← Communities
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Food systems</h1>
        <p className="mt-4 text-sm text-[#009b70] font-medium">From calorie security to joyful abundance</p>

        <div className="mt-10 space-y-6 text-[#3d5166] leading-relaxed">
          <p>
            A resilient community eats with its eyes on three clocks: daily meals, seasonal gluts, and multi-year
            rotations that build soil instead of mining it. Autarkeia sites aim for overlapping strategies—intensive
            kitchen gardens near homes, staple fields on contour, perennial polycultures in margins, and preserved
            reserves in root cellars and dry storage—so a wet spring or a dry July does not collapse the story into a
            single point of failure.
          </p>
          <p>
            Communal growing does not mean everyone must share identical diets; it means sharing tools, irrigation
            maintenance, seed libraries, and harvest labor when timing matters. Shared greenhouses extend seasons;
            shared processing days turn tomatoes into sauce and apples into cider without every household owning
            identical expensive equipment. Clear agreements about distribution—market sales, internal credits, or hybrid
            models—prevent resentment from festering quietly.
          </p>
          <p>
            Food forests stack canopy, understory, shrubs, herbs, and ground covers to mimic forest edge ecology while
            producing fruit, nuts, greens, fungi, and animal forage. They are patience investments: early years emphasize
            soil biology, water infiltration, and nurse plants; later years yield with diminishing labor as roots deepen
            and cycles close. Regenerative design tracks water as it moves across a site, captures it in swales and
            ponds where appropriate, and pairs plant communities that support pollinators and pest predators alike.
          </p>
          <p>
            Permaculture ethics—earth care, people care, fair share—translate here into transparent carrying capacity
            math, inclusive decision-making about animal integration, and honest discussion of protein sources. We
            connect training pathways for new growers with mentorship from experienced horticulturists, and we plan for
            contingencies: drought plans, crop insurance knowledge where relevant, and relationships with regional
            growers for gaps we choose not to fill on-site.
          </p>
          <p>
            Storage and preservation are not glamorous, but they decide whether a good growing year actually feeds a
            household through winter. Pilots include shared dehydrators, lacto-fermentation crocks, pressure canners,
            root cellars sized for community batches, and small cold rooms tuned for apples, roots, and cured meats.
            Training cycles cover safe canning, oxygen-absorber use, mylar storage of grains and beans, and rotational
            inventory so the oldest stock leaves the shelf first. Seed saving, scion exchanges, and regional cultivar
            trials thread through these workflows so genetics adapted to the site keep improving year after year.
          </p>

          <p>
            Animals enter the conversation deliberately rather than by default. Hens for eggs and kitchen-scrap
            recycling, bees for pollination and honey, ducks for slug pressure, and rotational ruminants for
            woody-pasture cycles all have clear roles—but each one carries water, fencing, predator, neighbor, and
            slaughter implications. We discuss those trade-offs honestly during planning, agree on welfare standards
            and capacity ceilings, and prefer integration that lowers external inputs rather than ornamentation that
            adds chores without resilience gains. Where the community decides not to keep certain animals, we build
            relationships with regional producers who share our standards so dairy, meat, and fiber still come from
            people we know by name.
          </p>

          <p>
            If you are excited by guild planting, seed sovereignty, or cooperative kitchens, register on the
            Communities page and tell us your climate zone and current skill level. Food systems succeed when logistics,
            culture, and ecology align; we are designing for that alignment from the first survey stake, not as an
            afterthought once foundations are poured.
          </p>
        </div>
      </div>
    </main>
  )
}
