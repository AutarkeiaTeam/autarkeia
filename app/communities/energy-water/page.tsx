import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Energy & Water — Communities — Autarkeia",
  description:
    "Solar, batteries, rainwater, purification, wind, and resilient utilities for Autarkeia communities.",
}

const HERO =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=5000&q=85"

export default function EnergyWaterPage() {
  return (
    <CommunityDetail
      eyebrow="Energy & Water"
      title="Power and water you can explain to a neighbour"
      tagline="Right-sized solar, honest water balances, and backup paths that work when the grid does not."
      intro="Energy and water are the utilities that most define daily freedom: whether you can pump after dark, whether guests can shower without guilt, whether a week of clouds becomes a crisis or a mild inconvenience. Autarkeia designs for the worst week of the year, not the best Instagram sunset — then trims capital costs only after safety margins are clear."
      hero={{
        src: HERO,
        alt: "Rows of solar photovoltaic panels in a field under blue sky",
        credit: "Photo: Unsplash",
      }}
      sections={[
        {
          heading: "Introduction — self-sufficiency in energy and water",
          body: [
            "Self-sufficiency here does not mean heroically off-grid on day one for everyone. It means understanding your loads honestly — heating, cooling, pumping, communications, medical devices — and building redundancy so a single component failure does not cascade into panic.",
            "Water deserves equal dignity: harvest, store, treat, and reuse where legal. Energy without water still collapses a site; water without energy may still be fine if gravity and hand pumps are part of the plan. Autarkeia sites are encouraged to sketch both on the same map so trade-offs are visible early.",
            "Finally, community scale helps: shared maintenance calendars, bulk purchasing of batteries and filters, and trained members who can swap a pump controller without waiting weeks for a van from the city.",
          ],
        },
        {
          heading: "Solar systems — panels, batteries, sizing",
          body: [
            "Solar photovoltaic panels are the workhorse for most temperate and tropical sites: modular, observable, and relatively maintainable. Sizing starts with a load audit in watt-hours per day by season, then adds inverter and charge-controller headroom for motor starts.",
            "Batteries are where chemistry and budget meet. Lithium iron phosphate (LFP) dominates new community installs for cycle life and safety culture, but lead-acid still has niches where temperature extremes or simple replacement paths matter. Whatever the chemistry, fire separation, venting where required, and a labelled shutdown procedure posted at the inverter are non-negotiable.",
            "Oversizing PV slightly relative to daily load helps cloudy weeks; a small backup generator or grid connection may remain the adult choice for medical baseload in some climates — honesty beats ideology.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2400&q=85",
              alt: "Technician inspecting rooftop solar panels against a bright sky",
              caption: "Rooftop PV keeps wire runs short; pair with monitoring so faults are obvious early.",
            },
          ],
        },
        {
          heading: "Water solutions — harvesting, storage, purification",
          body: [
            "Rainwater from metal or tile roofs, with first-flush diverters and coarse filtration, can cover irrigation and much non-potable demand. Potable paths add finer filtration, UV, and sometimes remineralisation depending on local chemistry and regulation.",
            "Storage is climate-specific: buried cisterns temper temperature in hot places; insulated tanks reduce freezing risk where winters bite. Always plan overflow routes that respect neighbours downhill — water conflicts destroy communities faster than inverter errors.",
            "Wells and springs need testing cadence and hand-pump redundancy where power-out scenarios are real. Greywater to mulch basins around fruit trees can close loops legally in many jurisdictions when soaps are chosen carefully.",
          ],
        },
        {
          heading: "Wind & other sources — alternatives",
          body: [
            "Small wind turbines reward consistent wind regimes — coastal ridges, open plains — and punish sheltered valleys with maintenance bills and neighbour noise complaints. Measure first with a temporary mast if budgets allow.",
            "Micro-hydro is the gold standard where legal head and flow exist year-round; it often outperforms solar on rainy weeks. Biogas from anaerobic digesters can process kitchen and limited manure streams where temperature and feedstock stability permit — more common at farm scale than apartment scale.",
            "Diesel backup is not a moral failure if sized rarely and maintained religiously; the goal is survivability, not purity. Autarkeia documents run hours and emissions so communities can phase alternatives in as capital allows.",
          ],
          images: [
            {
              src: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=2400",
              alt: "Raindrops on a window with soft outdoor light",
              caption: "Harvest starts with roof quality, first-flush diverters, and tanks sized to your dry-season curve.",
            },
          ],
        },
        {
          heading: "Getting started — assessment, systems, costs",
          body: [
            "Start with a week of logging: when lights run, when pumps run, when heat peaks. Pair that with rainfall data and, if relevant, grid outage history. Cheap clamp meters and bucket tests beat guessing.",
            "Sequence purchases so monitoring comes before expansion: know what you actually use after behaviour changes — LED retrofits, heat-pump hygiene, pump scheduling — before doubling battery banks.",
            "Register interest with Autarkeia to join regional cohorts comparing installers, tariffs, and grant programmes. Shared procurement often shaves soft costs more than any single household coupon code.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2400&q=85",
              alt: "Electrician working on wiring and electrical panel",
              caption: "Professional commissioning and clear shutdown labels save lives later.",
            },
          ],
        },
      ]}
    />
  )
}
