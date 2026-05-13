import Link from "next/link"

export const metadata = {
  title: "Forums — Autarkeia",
  description:
    "External communities on Reddit, Substack, Facebook Groups, and Discord for emergency readiness and self-sufficiency — plus Autarkeia Forums.",
}

type ExternalForum = { name: string; href: string; platform: string }

const externalForums: ExternalForum[] = [
  { name: "r/preppers", href: "https://www.reddit.com/r/preppers/", platform: "Reddit" },
  { name: "r/TwoXPreppers", href: "https://www.reddit.com/r/TwoXPreppers/", platform: "Reddit" },
  { name: "r/bugout", href: "https://www.reddit.com/r/bugout/", platform: "Reddit" },
  { name: "r/Bushcraft", href: "https://www.reddit.com/r/Bushcraft/", platform: "Reddit" },
  { name: "r/Survival", href: "https://www.reddit.com/r/Survival/", platform: "Reddit" },
  { name: "r/homestead", href: "https://www.reddit.com/r/homestead/", platform: "Reddit" },
  { name: "r/Homesteading", href: "https://www.reddit.com/r/Homesteading/", platform: "Reddit" },
  { name: "r/OffGrid", href: "https://www.reddit.com/r/OffGrid/", platform: "Reddit" },
  { name: "r/OffGridLiving", href: "https://www.reddit.com/r/OffGridLiving/", platform: "Reddit" },
  { name: "r/solar", href: "https://www.reddit.com/r/solar/", platform: "Reddit" },
  { name: "r/SelfSufficiency", href: "https://www.reddit.com/r/SelfSufficiency/", platform: "Reddit" },
  { name: "r/permaculture", href: "https://www.reddit.com/r/permaculture/", platform: "Reddit" },
  { name: "r/PermacultureCommunity", href: "https://www.reddit.com/r/PermacultureCommunity/", platform: "Reddit" },
  { name: "r/gardening", href: "https://www.reddit.com/r/gardening/", platform: "Reddit" },
  { name: "r/WaterSecurity", href: "https://www.reddit.com/r/WaterSecurity/", platform: "Reddit" },
  { name: "r/WaterTreatment", href: "https://www.reddit.com/r/WaterTreatment/", platform: "Reddit" },
  { name: "r/overlanding", href: "https://www.reddit.com/r/overlanding/", platform: "Reddit" },
  { name: "r/vandwellers", href: "https://www.reddit.com/r/vandwellers/", platform: "Reddit" },
  { name: "r/TinyHouses", href: "https://www.reddit.com/r/TinyHouses/", platform: "Reddit" },
  { name: "r/selfreliance", href: "https://www.reddit.com/r/selfreliance/", platform: "Reddit" },
  { name: "r/Frugal", href: "https://www.reddit.com/r/Frugal/", platform: "Reddit" },
  { name: "r/CollapseSupport", href: "https://www.reddit.com/r/CollapseSupport/", platform: "Reddit" },
  { name: "r/Resilience", href: "https://www.reddit.com/r/Resilience/", platform: "Reddit" },
  { name: "r/hydro", href: "https://www.reddit.com/r/hydro/", platform: "Reddit" },
  { name: "r/WaterWellDrilling", href: "https://www.reddit.com/r/WaterWellDrilling/", platform: "Reddit" },
  { name: "r/StormComing", href: "https://www.reddit.com/r/StormComing/", platform: "Reddit" },
  { name: "r/FirstAid", href: "https://www.reddit.com/r/FirstAid/", platform: "Reddit" },
  { name: "r/EMS", href: "https://www.reddit.com/r/EMS/", platform: "Reddit" },
  { name: "r/amateurradio", href: "https://www.reddit.com/r/amateurradio/", platform: "Reddit" },
  { name: "r/gmrs", href: "https://www.reddit.com/r/gmrs/", platform: "Reddit" },
  { name: "r/Baofeng", href: "https://www.reddit.com/r/Baofeng/", platform: "Reddit" },
  { name: "r/homedefense", href: "https://www.reddit.com/r/homedefense/", platform: "Reddit" },
  { name: "r/WorkOnline", href: "https://www.reddit.com/r/WorkOnline/", platform: "Reddit" },
  { name: "r/FinancialIndependence", href: "https://www.reddit.com/r/financialindependence/", platform: "Reddit" },
  { name: "r/EuropeFIRE", href: "https://www.reddit.com/r/EuropeFIRE/", platform: "Reddit" },
  { name: "r/IntentionalCommunity", href: "https://www.reddit.com/r/IntentionalCommunity/", platform: "Reddit" },
  { name: "r/ecovillage", href: "https://www.reddit.com/r/ecovillage/", platform: "Reddit" },
  { name: "r/Agroforestry", href: "https://www.reddit.com/r/Agroforestry/", platform: "Reddit" },
  { name: "r/RenewableEnergy", href: "https://www.reddit.com/r/RenewableEnergy/", platform: "Reddit" },
  { name: "r/ClimateAdaptation", href: "https://www.reddit.com/r/ClimateAdaptation/", platform: "Reddit" },
  { name: "r/ZeroWaste", href: "https://www.reddit.com/r/ZeroWaste/", platform: "Reddit" },
  { name: "r/canning", href: "https://www.reddit.com/r/canning/", platform: "Reddit" },
  { name: "r/fermentation", href: "https://www.reddit.com/r/fermentation/", platform: "Reddit" },
  { name: "r/mycology", href: "https://www.reddit.com/r/mycology/", platform: "Reddit" },
  { name: "r/foraging", href: "https://www.reddit.com/r/foraging/", platform: "Reddit" },
  { name: "r/woodworking", href: "https://www.reddit.com/r/woodworking/", platform: "Reddit" },
  { name: "r/Tools", href: "https://www.reddit.com/r/Tools/", platform: "Reddit" },
  { name: "r/MechanicAdvice", href: "https://www.reddit.com/r/MechanicAdvice/", platform: "Reddit" },
  { name: "r/preppersales", href: "https://www.reddit.com/r/preppersales/", platform: "Reddit" },
  { name: "r/collapse", href: "https://www.reddit.com/r/collapse/", platform: "Reddit" },
  { name: "The Prepared (notes)", href: "https://substack.com/search?q=preparedness", platform: "Substack" },
  { name: "Resilience writers on Substack", href: "https://substack.com/search?q=resilience", platform: "Substack" },
  { name: "Homestead & permaculture newsletters", href: "https://substack.com/search?q=homestead", platform: "Substack" },
  { name: "Off-grid & solar deep dives", href: "https://substack.com/search?q=off%20grid%20solar", platform: "Substack" },
  { name: "Self-sufficiency essays", href: "https://substack.com/search?q=self-sufficiency", platform: "Substack" },
  { name: "Facebook: prepper groups directory", href: "https://www.facebook.com/search/groups/?q=preppers", platform: "Facebook Groups" },
  { name: "Facebook: homesteading groups", href: "https://www.facebook.com/search/groups/?q=homesteading", platform: "Facebook Groups" },
  { name: "Facebook: off-grid living groups", href: "https://www.facebook.com/search/groups/?q=off%20grid", platform: "Facebook Groups" },
  { name: "Facebook: permaculture groups", href: "https://www.facebook.com/search/groups/?q=permaculture", platform: "Facebook Groups" },
  { name: "Facebook: amateur radio groups", href: "https://www.facebook.com/search/groups/?q=ham%20radio", platform: "Facebook Groups" },
  { name: "Facebook: bushcraft skills", href: "https://www.facebook.com/search/groups/?q=bushcraft", platform: "Facebook Groups" },
  { name: "Disboard: prepping tag", href: "https://disboard.org/servers/tag/prepping", platform: "Discord" },
  { name: "Disboard: homestead tag", href: "https://disboard.org/servers/tag/homestead", platform: "Discord" },
  { name: "Disboard: permaculture tag", href: "https://disboard.org/servers/tag/permaculture", platform: "Discord" },
  { name: "Disboard: survival tag", href: "https://disboard.org/servers/tag/survival", platform: "Discord" },
  { name: "Disboard: self-sufficiency tag", href: "https://disboard.org/servers/tag/self-sufficiency", platform: "Discord" },
  { name: "Disboard: off-grid tag", href: "https://disboard.org/servers/tag/off-grid", platform: "Discord" },
  { name: "Disboard: solar tag", href: "https://disboard.org/servers/tag/solar", platform: "Discord" },
  { name: "Disboard: bushcraft tag", href: "https://disboard.org/servers/tag/bushcraft", platform: "Discord" },
  { name: "Disboard: farming tag", href: "https://disboard.org/servers/tag/farming", platform: "Discord" },
]

export default function ForumsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Forums & communities</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#3d5166]">
          Curated external spaces for emergency readiness, self-sufficiency, off-grid living, and mutual aid — plus a
          path to start threads on Autarkeia Forums.
        </p>

        <section className="mt-10 rounded-2xl border-2 border-[#009b70]/30 bg-[#f5f7fa] p-6">
          <h2 className="text-lg font-medium text-[#0d1b2a]">Autarkeia Forums</h2>
          <p className="mt-2 text-sm text-[#3d5166]">
            Start a discussion on Autarkeia Forums after you sign in — share your region, projects, and lessons learned.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-flex rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
          >
            Create discussion
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-light text-[#0d1b2a]">External forums & groups ({externalForums.length})</h2>
          <p className="mt-2 text-sm text-[#8a9bb0]">
            Autarkeia does not operate these spaces — review each community&apos;s rules and privacy expectations.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {externalForums.map((f) => (
              <li key={`${f.platform}-${f.name}-${f.href}`}>
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-xl border border-[#d4dce8] bg-white p-4 transition-colors hover:border-[#009b70]"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">{f.platform}</span>
                  <span className="mt-1 text-sm font-medium text-[#0d1b2a]">{f.name}</span>
                  <span className="mt-1 truncate text-xs text-[#8a9bb0]">{f.href}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
