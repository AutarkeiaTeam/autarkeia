import Link from "next/link"

export const metadata = {
  title: "Energy & Water — Communities — Autarkeia",
  description: "Off-grid solar, wind, rainwater harvesting, and resilient water systems for Autarkeia communities.",
}

export default function EnergyWaterPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/communities" className="text-sm text-[#009b70] hover:underline">
          ← Communities
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Energy & water</h1>
        <p className="mt-4 text-sm text-[#009b70] font-medium">Dual backbone systems for autonomy</p>

        <div className="mt-10 space-y-6 text-[#3d5166] leading-relaxed">
          <p>
            Energy and water are the twin circulatory systems of a settlement. When either fails, kitchens stall,
            hygiene suffers, communications degrade, and medical risk rises quickly. Autarkeia pilots plan for layered
            redundancy: solar as the daytime workhorse, batteries sized for critical overnight loads, occasional wind
            where resource maps justify towers and neighbors accept sound envelopes, and modest backup generators only
            where fire codes or clinical needs require them—not as a lazy default for poor efficiency.
          </p>
          <p>
            Off-grid solar succeeds when demand-side discipline matches inverter capacity. We encourage shared laundry
            schedules, timed water heating, and EV charging policies that respect grid-forming limits on small sites.
            Training residents to read state-of-charge, interpret weather windows, and perform safe disconnects turns
            hardware into culture. Microgrids between clusters of homes can share inverters and maintenance contracts,
            lowering per-doorstep costs if governance is crisp about liability and billing.
          </p>
          <p>
            Rainwater harvesting augments—not magically replaces—hydrology common sense. First-flush diverters,
            screened inlets, and opaque storage reduce contamination vectors; calmed inlets reduce tank scour. We pair
            roofs with vegetated swales that recharge aquifers where regulations allow, reducing downstream flood peaks.
            Greywater segregation and plant-based polishing can stretch irrigation budgets if soaps are chosen
            carefully and paths exclude human contact with aerosols.
          </p>
          <p>
            Resilient water systems include hand pumps on shallow wells where hydrogeology supports it, ceramic filters
            at point-of-use, and bulk storage sized to bridge dry weeks transparently published to the community.
            Testing cadence, chain-of-custody for samples, and clear boil-water advisories are part of the social
            contract—not optional paperwork. Firefighting drafts, livestock troughs, and wildlife drinkers are mapped so
            drought triage does not surprise anyone mid-crisis.
          </p>
          <p>
            Maintenance culture is what separates a brochure off-grid site from one that actually keeps the lights on
            for a decade. We plan documented service intervals for inverters, battery cell balancing, panel washing,
            and water tank disinfection, with logs that any trained resident can open and read. A small parts cache
            for fuses, MC4 connectors, filter cartridges, pumps, and pressure tanks shortens the path from a fault to
            a fix from weeks to hours. Pairing trainees with experienced operators builds a bench of people who can
            respond at 2 a.m. on a holiday without phoning a contractor in another time zone.
          </p>

          <p>
            Heat and cold add another layer. Solar thermal panels, wood gasification stoves, masonry heaters with
            high-mass cores, and well-insulated thermal envelopes can move a settlement from electric-heated dependence
            toward systems that work even when the inverter is off for service. In hot climates, deep shade structures,
            evaporative cooling on dry days, and night-flush ventilation reduce air-conditioning load enough that
            modest electrical capacity covers genuine emergencies. Cold-climate sites budget for fuel wood from
            sustainably managed coppice plots, with rotation schedules that keep the same hectares producing for
            generations rather than mining a stand and walking away.
          </p>

          <p>
            If you have experience with MPPT tuning, wind siting, or municipal water negotiations, we want that signal
            in our registry. Energy-water integration is where engineering meets neighborliness; we are building both
            the spreadsheets and the meeting formats to keep them honest.
          </p>
        </div>
      </div>
    </main>
  )
}
