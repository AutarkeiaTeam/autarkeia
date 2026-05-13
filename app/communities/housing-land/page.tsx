import Link from "next/link"

export const metadata = {
  title: "Housing & Land — Communities — Autarkeia",
  description:
    "Natural building, earthen methods, timber structures, and straw bale homes for resilient Autarkeia communities.",
}

export default function HousingLandPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/communities" className="text-sm text-[#009b70] hover:underline">
          ← Communities
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Housing & land</h1>
        <p className="mt-4 text-sm text-[#009b70] font-medium">Natural building for long-term resilience</p>

        <div className="mt-10 space-y-6 text-[#3d5166] leading-relaxed">
          <p>
            Shelter is the layer of resilience people feel most intimately: walls that breathe in summer, mass that
            tempers winter swings, roofs that shed storms without demanding constant repair. In Autarkeia communities we
            treat housing as infrastructure you can steward with local materials and skills—not a disposable consumer
            product shipped across oceans whenever a seal fails. That orientation pushes us toward natural building
            systems that age gracefully, admit incremental maintenance, and keep embodied energy honest.
          </p>
          <p>
            Earthen methods—cob, rammed earth, light straw-clay, and stabilized earth plasters—offer acoustic calm,
            humidity moderation, and fire resistance when detailed correctly. They pair well with passive solar
            geometry: south glazing in cool climates, deep roof overhangs, thermal mass placed where sun can charge it
            by day and release warmth at night. The craft is social as much as technical: mixes are tested in
            community work parties, details are taught hand-to-hand, and mistakes become curriculum instead of warranty
            battles.
          </p>
          <p>
            Timber structures anchor many temperate designs: post-and-beam frames that can be raised with modest
            cranes or block-and-tackle rigs, infilled with straw bales for super-insulated walls. Straw bale excels at
            R-value per inch and sequesters carbon in walls if kept dry through generous foundations, wide roof eaves,
            and breathable finishes. We emphasize redundancy against moisture: vented rain screens, capillary breaks, and
            monitoring points so residents can read their buildings like gardeners read soil.
          </p>
          <p>
            Land planning ties housing to water, access, sun, and noise. Clustering homes can preserve wild corridors,
            reduce road asphalt, and concentrate shared infrastructure like root cellars, workshops, and guest space. At
            the same time, we respect the desire for privacy: courtyards, hedgerows, and staggered setbacks help
            neighbors coexist without surveillance creep. Governance around building codes, material sourcing, and
            long-term maintenance funds is discussed openly so expectations match climate reality.
          </p>
          <p>
            Skill transfer is part of the housing program, not a side project. We sequence early builds around
            workshops where future residents can learn lime plastering, sharpening, framing layout, and roofing
            sequence under experienced supervisors. Local trades—stonemasons, carpenters, plasterers—are invited as
            paid teachers, so knowledge stays in the region instead of evaporating with consultants. Documentation
            living on each site (binders, photos, sensor logs) lets new residents and their adult children pick up
            maintenance without reinventing context, while a small reserve fund for re-roofing, re-plastering, and
            chimney sweeps keeps small jobs from becoming emergencies.
          </p>

          <p>
            Foundations and roofs deserve disproportionate attention because they protect every other layer. We favor
            rubble-trench foundations with proper drainage where soils allow, insulated raft slabs in cold climates,
            and limecrete or hempcrete subfloors that breathe with earthen walls above. Roofs combine generous
            overhangs, ventilated cold roofs, and either metal standing seam, clay tile, or wood shingle depending on
            climate and local supply. Where wildfire is a real risk, we specify Class A roof assemblies, ember-screened
            vents, and defensible space planted with low-flammability natives. None of this is exotic; it is what
            building inspectors call "doing the boring parts well so the interesting parts last."
          </p>

          <p>
            Whether you dream of a compact earthen cottage or a timber barn shared between two households, the through
            line is durability without dependence on fragile supply chains. We invite you to register interest on the
            main Communities page, note your climate and skills, and help us sequence pilots where local materials and
            teacher networks can support serious builds—not vanity cabins, but homes that can shelter generations.
          </p>
        </div>
      </div>
    </main>
  )
}
