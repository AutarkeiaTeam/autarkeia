import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Housing & Land — Communities — Autarkeia",
  description:
    "Natural building, earthen methods, timber structures, and straw bale homes for resilient Autarkeia communities.",
}

export default function HousingLandPage() {
  return (
    <CommunityDetail
      eyebrow="Housing & Land"
      title="Homes that age gracefully, on land that feeds them"
      tagline="Natural building, earthen methods, timber frames, and straw bale — designed to be maintained by the people who live in them."
      intro="Shelter is the layer of resilience people feel most intimately: walls that breathe in summer, mass that tempers winter swings, roofs that shed storms without demanding constant repair. In Autarkeia communities we treat housing as infrastructure you can steward with local materials and skills — not a disposable consumer product shipped across oceans whenever a seal fails."
      hero={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Cob_house_in_Tarifa%2C_Spain.jpg/1920px-Cob_house_in_Tarifa%2C_Spain.jpg",
        alt: "Cob house in Tarifa, southern Spain",
        credit: "Photo: Wikimedia Commons",
      }}
      sections={[
        {
          heading: "Earthen and natural-fibre walls",
          body: [
            "Cob, rammed earth, light straw-clay, and stabilised earth plasters give us acoustic calm, humidity moderation, and real fire resistance when detailed correctly. They pair well with passive solar geometry: south glazing in cool climates, deep roof overhangs, thermal mass placed where sun can charge it by day and release warmth at night.",
            "The craft is social as much as technical. Mixes are tested in community work parties, details are taught hand-to-hand, and mistakes become curriculum instead of warranty battles. We sequence early builds around workshops where future residents can learn lime plastering, sharpening, framing layout, and roofing under experienced supervisors.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Rammed_earth_wall_DSC04055.jpg/1280px-Rammed_earth_wall_DSC04055.jpg",
              alt: "Rammed earth wall with visible layers",
              caption: "Rammed earth — thermal mass and breathability in one wall.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Strawbale_wall_under_construction.jpg/1280px-Strawbale_wall_under_construction.jpg",
              alt: "Straw bale wall under construction",
              caption: "Straw bale infill in a post-and-beam frame.",
            },
          ],
        },
        {
          heading: "Timber frames and clustered plots",
          body: [
            "Timber structures anchor many temperate designs: post-and-beam frames that can be raised with modest cranes or block-and-tackle rigs, infilled with straw bales for super-insulated walls. Straw bale excels at R-value per inch and sequesters carbon in walls if kept dry through generous foundations, wide roof eaves, and breathable finishes.",
            "Clustering homes preserves wild corridors, reduces road asphalt, and concentrates shared infrastructure like root cellars, workshops, and guest space. At the same time we respect privacy: courtyards, hedgerows, and staggered setbacks help neighbours coexist without surveillance creep.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Timber_frame_house_-_geograph.org.uk_-_1396117.jpg/1280px-Timber_frame_house_-_geograph.org.uk_-_1396117.jpg",
              alt: "Timber-frame house under construction",
              caption: "Post-and-beam frame ready for infill walls.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ecovillage_at_Ithaca_houses.jpg/1280px-Ecovillage_at_Ithaca_houses.jpg",
              alt: "Clustered eco-village houses with shared green spaces",
              caption: "Clustered plots preserve wild corridors and shared infrastructure.",
            },
          ],
        },
        {
          heading: "Foundations, roofs, and the boring parts done well",
          body: [
            "Foundations and roofs deserve disproportionate attention because they protect every other layer. We favour rubble-trench foundations with proper drainage where soils allow, insulated raft slabs in cold climates, and limecrete or hempcrete subfloors that breathe with earthen walls above.",
            "Roofs combine generous overhangs, ventilated cold roofs, and either metal standing seam, clay tile, or wood shingle depending on climate and local supply. Where wildfire is a real risk we specify Class A roof assemblies, ember-screened vents, and defensible space planted with low-flammability natives.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Clay_tile_roof_-_Salzburg.jpg/1280px-Clay_tile_roof_-_Salzburg.jpg",
              alt: "Clay tile roof on a stone farmhouse",
              caption: "Clay tile and generous eaves — built to be re-tiled, not replaced.",
            },
          ],
        },
        {
          heading: "Skills, documentation, and reserve funds",
          body: [
            "Skill transfer is part of the housing programme, not a side project. Local stonemasons, carpenters and plasterers are invited as paid teachers so knowledge stays in the region instead of evaporating with consultants.",
            "Documentation living on each site — binders, photos, sensor logs — lets new residents and their adult children pick up maintenance without reinventing context. A small reserve fund for re-roofing, re-plastering, and chimney sweeps keeps small jobs from becoming emergencies.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Lime_plastering_-_geograph.org.uk_-_1396092.jpg/1280px-Lime_plastering_-_geograph.org.uk_-_1396092.jpg",
              alt: "Lime plastering workshop",
              caption: "Workshop-led skill transfer at every build.",
            },
          ],
        },
        {
          heading: "Getting started",
          body: [
            "Whether you dream of a compact earthen cottage or a timber barn shared between two households, the through-line is durability without dependence on fragile supply chains.",
            "Register your interest, tell us your climate and what skills you already have, and help us sequence pilots where local materials and teacher networks can support serious builds — not vanity cabins, but homes that can shelter generations.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Earthship_-_Taos%2C_NM.jpg/1280px-Earthship_-_Taos%2C_NM.jpg",
              alt: "Earthship-style natural home in Taos, New Mexico",
              caption: "Built for a generation, not a sales cycle.",
            },
          ],
        },
      ]}
    />
  )
}
