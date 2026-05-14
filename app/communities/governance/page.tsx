import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Governance — Communities — Autarkeia",
  description:
    "Transparent co-governance, member participation, and durable democratic decision-making for Autarkeia communities.",
}

export default function GovernancePage() {
  return (
    <CommunityDetail
      eyebrow="Governance"
      title="Decisions made by the people who live with the consequences"
      tagline="Transparent co-governance, sociocratic decision-making, clear conflict pathways, and rules durable enough to outlast their authors."
      intro="More intentional communities fail on governance than on infrastructure. Autarkeia communities are designed with explicit decision-making structures, transparent finances, written agreements, and conflict pathways so that disagreements become workable problems rather than slow-motion divorces."
      hero={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Community_meeting_circle.jpg/1920px-Community_meeting_circle.jpg",
        alt: "Community members sitting in a circle for a meeting",
        credit: "Photo: Wikimedia Commons",
      }}
      sections={[
        {
          heading: "Sociocracy as the default operating system",
          body: [
            "We use sociocratic / consent-based decision-making as the default. Decisions are made within small circles with clear domains; consent (no reasoned objection) is preferred over majority vote for ongoing decisions; one-off operational choices are delegated to those closest to the work.",
            "Sociocracy is not slow once people have practised it. Most operational decisions resolve in minutes; only genuine value-conflicts take real time, and that time is well spent.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sociocracy_circle.jpg/1280px-Sociocracy_circle.jpg",
              alt: "Sociocratic circle meeting in progress",
              caption: "Circles with clear domains, not endless plenaries.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Community_hands_raised.jpg/1280px-Community_hands_raised.jpg",
              alt: "Hands raised in a vote",
              caption: "Voting reserved for genuine binary choices.",
            },
          ],
        },
        {
          heading: "Written agreements and transparent finances",
          body: [
            "Verbal agreements drift; written ones can be argued with on the page. Each community maintains a living agreements document — covering membership, capital contributions, governance procedures, exit pathways, and conflict resolution — that any member can propose amendments to.",
            "Finances are open. Monthly statements, capital reserves, project budgets, and major contracts are visible to all members. Anonymity is reserved for personal data, not for community money.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Whiteboard_planning_session.jpg/1280px-Whiteboard_planning_session.jpg",
              alt: "Members planning around a whiteboard",
              caption: "Plans, budgets, and reserves on the wall.",
            },
          ],
        },
        {
          heading: "Conflict pathways and care",
          body: [
            "Conflict is not a failure mode; it is the normal cost of living closely with other people. We staff a small rotating mediation circle and pre-agree on a three-step pathway: direct conversation, mediation, and finally facilitated community circle.",
            "Children, elders, and people with disabilities have explicit standing in governance discussions that affect them — not just in family-only side meetings. Care work is named, counted, and rotated like any other shared task.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Mediation_session.jpg/1280px-Mediation_session.jpg",
              alt: "Mediation session between two people",
              caption: "A clear, pre-agreed conflict pathway.",
            },
          ],
        },
        {
          heading: "Neighbours, jurisdictions, and the outside world",
          body: [
            "Relationships with neighbouring landowners and local government are part of governance, not separate from it. We register properly, pay taxes properly, participate in local civic life, and over-communicate with neighbours about water use, road maintenance, and fire risk.",
            "Communities that try to be invisible become suspect; communities that show up at the planning office and the village festival are usually treated as a welcome addition.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Spanish_village_square.jpg/1280px-Spanish_village_square.jpg",
              alt: "Spanish village square with neighbours gathered",
              caption: "Show up at the festival; talk to the mayor.",
            },
          ],
        },
        {
          heading: "Getting started",
          body: [
            "Good governance is something you practise together long before you sign deeds. We run governance workshops with prospective communities so the habits — agreed agendas, minutes, written agreements, conflict pathways — exist before there is anything to fight about.",
            "Register your interest and tell us what governance experience you already bring; we are particularly interested in mediators, facilitators, finance-fluent residents, and people with prior intentional-community experience.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Cohousing_common_house.jpg/1280px-Cohousing_common_house.jpg",
              alt: "Cohousing common house with a shared meal",
              caption: "Shared meals carry more agreements than minutes ever do.",
            },
          ],
        },
      ]}
    />
  )
}
