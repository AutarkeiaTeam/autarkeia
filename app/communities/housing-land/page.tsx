import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Housing & Land — Communities — Autarkeia",
  description:
    "Natural building, land, zoning, and community-led housing for resilient Autarkeia communities.",
}

const HERO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=5000&q=85"

export default function HousingLandPage() {
  return (
    <CommunityDetail
      eyebrow="Housing & Land"
      title="Shelter you can steward — land you can plan for generations"
      tagline="Natural building, thoughtful land, and neighbourhoods where homes age gracefully because the boring parts were done well."
      intro="Housing and land are the foundation of any serious self-sufficient community. They shape how much energy you need, how safe you feel in storms, how close you are to water and food, and whether maintenance stays in local hands or drifts into anonymous supply chains. Autarkeia treats shelter as long-lived infrastructure — not a disposable product — and land as a shared asset whose carrying capacity must be read honestly before anyone signs a deed."
      hero={{
        src: HERO,
        alt: "Modern rural home with large windows and green landscape at dusk",
        credit: "Photo: Unsplash",
      }}
      sections={[
        {
          heading: "Introduction — what it is, why it matters",
          body: [
            "Housing and land work together: the building is what you touch every day, but the parcel is what sets your limits for water, privacy, sun, noise, fire risk, and access for elders and children. In an intentional community, these choices are collective as well as personal — setbacks, shared walls, paths for machinery, and where the orchard ends and the private courtyard begins.",
            "Why it matters is simple: badly chosen land multiplies every other problem. Steep slopes complicate foundations; shade from a neighbour’s forest blocks winter sun; seasonal roads trap you when you most need to leave. Good land plus appropriate building systems turns resilience from a slogan into something you can feel when the power flickers and the house stays warm.",
            "Autarkeia’s approach is to sequence decisions slowly: understand climate and soil, sketch passive solar geometry, then choose materials that local craftspeople can maintain. The goal is homes that are beautiful, legible to inspectors where needed, and repairable without flying in a specialist every time a seal fails.",
          ],
        },
        {
          heading: "Natural building methods — earthen, timber, straw bale techniques",
          body: [
            "Natural building is a spectrum, not a purity contest. Earthen systems — cob, rammed earth, light straw-clay, and lime-stabilised plasters — offer thermal mass, humidity buffering, and acoustic calm when detailed with proper foundations and roof overhangs. Timber post-and-beam frames pair naturally with straw-bale infill for super-insulated walls that sequester carbon if kept dry.",
            "Technique matters as much as material: breathable wall assemblies, capillary breaks at the sill, and generous eaves beat heroic chemistry in the plaster every time. We favour teaching-led builds so future residents inherit muscle memory, not just a set of drawings.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85",
              alt: "Warm timber interior and roofline of a modern cabin-style home",
              caption: "Timber-first envelopes pair well with straw, cellulose, or wood-fibre insulation when moisture is managed.",
            },
          ],
        },
        {
          heading: "Land considerations — finding, zoning, permitting",
          body: [
            "Finding land starts with constraints, not dreams: water rights, road access, slope, soil percolation, wildfire exposure, and distance to medical care. A parcel that looks romantic in spring may be unreachable in ice, or legally impossible to subdivide for co-housing without years of paperwork.",
            "Zoning and permitting vary enormously by country and municipality. Some regions welcome agritourism and farm dwellings; others treat any non-family cluster as a commercial campground. Early conversations with planners — before purchase — save heartbreak. Autarkeia encourages cohorts to document precedents: eco-villages, farm clusters, and legal accessory dwellings that already exist in the jurisdiction.",
            "Carrying capacity is the quiet variable: how many households can share one well, one access road, one wastewater field without degrading the watershed? Answering that honestly is part of loving the land, not just occupying it.",
          ],
        },
        {
          heading: "Community examples — real-world projects",
          body: [
            "Across Europe and North America, co-housing villages, ecovillages, and farm clusters show that clustered housing can preserve wild corridors while concentrating shared infrastructure — workshops, guest space, root cellars, and laundry. Many projects sequence in phases: a common house first, then a handful of dwellings, then more as capital and trust accumulate.",
            "What separates durable examples from stalled ones is governance as much as architecture: written agreements about maintenance funds, guest policies, and how new members buy in. Autarkeia studies these patterns so our pilots inherit working templates instead of reinventing every mistake.",
          ],
          images: [
            {
              src: "https://images.pexels.com/photos/1084542/pexels-photo-1084542.jpeg?auto=compress&cs=tinysrgb&w=2400",
              alt: "Hands holding a generous harvest of fresh vegetables outdoors",
              caption: "From co-housing courtyards to farm clusters — density that still leaves room for soil and sky.",
            },
          ],
        },
        {
          heading: "Getting started — first steps",
          body: [
            "Start with a notebook, not a bulldozer: list your climate zone, household size, mobility needs, and how much privacy you require versus how much sharing energises you. Walk candidate parcels in bad weather. Talk to neighbours before you buy — they will be part of your early warning network whether you plan it or not.",
            "Next, assemble a small team: someone who reads contracts, someone who understands water, someone patient enough to run meetings. Sketch three rough site plans. Only then begin budgeting foundations and roofs — the two lines that protect everything else.",
            "When you are ready to join Autarkeia’s cohort, register your interest with regions and skills so we can match you to emerging pilots and workshops. We move at the speed of trust and ecology, not marketing calendars.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=85",
              alt: "Architectural blueprints and ruler on a desk",
              caption: "Measure twice: passive solar, access, and services before breaking ground.",
            },
          ],
        },
      ]}
    />
  )
}
