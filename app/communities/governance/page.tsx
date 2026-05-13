import Link from "next/link"

export const metadata = {
  title: "Governance — Communities — Autarkeia",
  description: "Co-governance, member participation, and democratic decisions for Autarkeia communities.",
}

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/communities" className="text-sm text-[#009b70] hover:underline">
          ← Communities
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Governance</h1>
        <p className="mt-4 text-sm text-[#009b70] font-medium">Transparent rules for shared infrastructure</p>

        <div className="mt-10 space-y-6 text-[#3d5166] leading-relaxed">
          <p>
            Infrastructure lasts decades; moods last minutes. Governance is the interface that translates long-horizon
            stewardship into weekly decisions people can live with. Autarkeia communities experiment with hybrid
            models—democratic assemblies for values and capital priorities, delegated circles for operations like water
            quality and energy dispatch, and elected recallable roles for legal signatories—so expertise is honored
            without ossifying hierarchy.
          </p>
          <p>
            Co-governance begins before anyone moves dirt: constitutions or covenant-lite agreements spell out dispute
            resolution, exit pathways, and how new members earn voice. We favor documented consent logs for sensitive
            topics—animal policies, night noise, RF emissions from communications gear—so future neighbors inherit
            context, not rumors. Participation budgets acknowledge that not everyone can attend every meeting; async
            summaries, office hours with stewards, and randomized pairing for onboarding reduce clique formation.
          </p>
          <p>
            Democratic decisions work best with bounded agendas and transparent data. Tariff-like internal prices for
            peak power, water overage, or guest stays should be machine-readable where possible, recalibrated on
            schedules everyone knows, and debated in daylight rather than invented in crisis. Supermajorities protect
            minorities on irreversible moves—selling common land, encumbering debt—while simple majorities suffice for
            revocable experiments like a new compost layout.
          </p>
          <p>
            Member participation extends beyond votes into maintenance rosters, mentorship, and mutual aid drills. We
            plan tabletop exercises for outage weekends, cyber incidents, and medical surges so governance muscles are
            trained before adrenaline arrives. Conflict transformation resources—facilitators, ombuds roles, and
            cooling-off protocols—are budget lines, not afterthoughts.
          </p>
          <p>
            Money is a governance question disguised as a finance question. Membership shares, monthly dues for shared
            infrastructure, capital calls for replacements, and reserves for legal expenses must all be visible to
            members at any time, not surfaced only at annual meetings. We document operating budgets and long-range
            capital plans as living spreadsheets, run open books for at least the prior fiscal year, and require a
            named treasurer plus a rotating audit pair. Where possible, we use legal vehicles that keep land in
            community ownership across membership turnover—cooperatives, community land trusts, stewardship
            foundations—so individual exits do not destabilize the whole.
          </p>

          <p>
            Children, elders, and people with disabilities are governance constituencies as much as anyone else. We
            insist on accessibility audits for shared infrastructure, age-appropriate participation pathways for
            children, and explicit caregiving accommodations so that domestic labor does not become an invisible
            subsidy for those without it. New residents are onboarded over months, not days, with a mentor and a
            living document that explains how decisions were reached on every active topic. Exits are designed with
            the same care: clear buy-back formulas, mediation steps before legal escalation, and a culture that
            recognizes a departing member as someone who once carried the community, not as a defector. Relationships
            with neighboring landowners, municipalities, and emergency services are governance lines too, kept warm in
            calm seasons so they hold under pressure.
          </p>

          <p>
            If you care about procedural fairness, inclusive facilitation, or legal structures for commons-based land
            tenure, tell us in the Communities interest form. Governance is not bureaucracy for its own sake; it is the
            practice of keeping promises to future residents who are not yet in the room.
          </p>
        </div>
      </div>
    </main>
  )
}
