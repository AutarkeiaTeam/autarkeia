import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Governance — Communities — Autarkeia",
  description:
    "Decision-making, conflict resolution, commons, and practical governance for Autarkeia communities.",
}

const HERO =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=5000&q=85"

export default function GovernancePage() {
  return (
    <CommunityDetail
      eyebrow="Governance"
      title="Rules you can read — decisions you can trace"
      tagline="Transparent agreements, humane conflict paths, and stewardship of shared resources without burnout."
      intro="Governance is the operating system of intentional community. Beautiful land and clever solar arrays do not survive ambiguous money, silent resentments, or meetings that never end. Autarkeia treats governance as craft: written agreements, clear domains of authority, predictable conflict pathways, and finances open enough that trust compounds instead of eroding."
      hero={{
        src: HERO,
        alt: "Group of people talking together outdoors in a circle",
        credit: "Photo: Unsplash",
      }}
      sections={[
        {
          heading: "Introduction — why governance matters in communities",
          body: [
            "Communities fail in predictable ways: unclear membership pathways, surprise assessments, invisible power cliques, and conflict processes that assume everyone is equally articulate under stress. Good governance does not remove disagreement; it makes disagreement survivable.",
            "It also protects minorities within the group: renters versus owners, elders versus young parents, introverts versus people who love twelve-hour meetings. Autarkeia encourages explicit standing policies for anyone affected by a decision — not just those who showed up loudest on Tuesday night.",
            "Finally, governance interfaces with the outside world: taxes, insurance, land titles, child safeguarding, and neighbour relations. A community that treats civic obligations seriously usually gets better planning outcomes than one that tries to hide.",
          ],
        },
        {
          heading: "Decision-making models — consensus, voting, rotating roles",
          body: [
            "Consensus — understood as “no principled objection” rather than “everyone gets their favourite outcome” — works well for values-heavy decisions when facilitation is skilled and domains are small. Majority voting works well for binary operational choices where delay costs more than imperfect outcomes.",
            "Many mature communities blend sociocratic circles with delegated authority: the water circle maintains cisterns without plenary approval for every gasket; the finance circle publishes monthly statements; the membership circle runs orientation with a checklist. Rotating roles prevents knowledge hoarding and builds empathy for thankless jobs.",
            "Whatever model you pick, document it in plain language, review it annually, and train newcomers in the first month — not after their first conflict.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=85",
              alt: "Team members collaborating around a laptop in a bright office",
              caption: "Clear roles and rotating facilitation keep decisions from collapsing into personality contests.",
            },
          ],
        },
        {
          heading: "Conflict resolution — mediation, community agreements",
          body: [
            "Conflict is normal; unmanaged conflict is toxic. A simple three-step ladder helps: direct conversation first, facilitated mediation second, and a small elected council third — with timelines so issues do not drift for seasons.",
            "Written community agreements should cover guests, pets, noise, vehicles, common-house bookings, and how capital repairs get funded. Silence on a topic does not mean harmony; it means you have not discovered the edge case yet.",
            "Professional mediators are worth budgeting for high-stakes disputes involving children, money, or safety. The community’s reputation with neighbours often hinges on how calmly those weeks are handled.",
          ],
        },
        {
          heading: "Resource sharing — commons management",
          body: [
            "Commons — tools, vehicles, guest rooms, woodlots, irrigation — need budgets, calendars, and maintenance logs as boring as any small business. Without them, tragedy-of-the-commons dynamics appear even among well-meaning people.",
            "Pricing internal use fairly (hourly tractor rates, guest-room cleaning deposits) prevents resentment. Surplus from internal fees can feed a capital reserve for the next roof on the common house.",
            "Digital tools help, but paper backups win when the internet fails — ironically, the week you most need the tractor log is often the week the router dies.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2400&q=85",
              alt: "Two colleagues smiling while reviewing paperwork together",
              caption: "Commons stay healthy when bookings, fees, and repair logs are as transparent as the welcome binder.",
            },
          ],
        },
        {
          heading: "Getting started — forming groups, tools, training",
          body: [
            "Start with a founding circle of five to eight people willing to meet weekly for months. Pick a lightweight stack: shared calendar, shared document archive, and a single decision log. Resist buying land before you have practiced disagreeing on small things.",
            "Train early: facilitation workshops, nonviolent communication basics, and plain-language financial literacy. Invite alumni from nearby intentional communities for dinners — they carry more practical wisdom than most consultants.",
            "When you register interest with Autarkeia, mention facilitation experience, legal skills, and languages spoken; we use that to match emerging cohorts to mentors and template agreements appropriate to your region.",
          ],
          images: [
            {
              src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=2400",
              alt: "People seated at a conference table with laptops and notebooks",
              caption: "Train early: facilitation, finance, and conflict skills before land debt concentrates the stress.",
            },
          ],
        },
      ]}
    />
  )
}
