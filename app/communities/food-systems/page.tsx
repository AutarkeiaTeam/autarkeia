import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Food Systems — Communities — Autarkeia",
  description:
    "Communal and household food production, regenerative agriculture, preservation, and storage for Autarkeia communities.",
}

const HERO =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=5000&q=85"

export default function FoodSystemsPage() {
  return (
    <CommunityDetail
      eyebrow="Food Systems"
      title="Food that fits your climate, labour, and appetite for sharing"
      tagline="From communal orchards to household kitchens — design systems so no single farm has to carry everyone alone."
      intro="Food is where self-sufficiency becomes daily practice. Autarkeia communities blend shared growing infrastructure with private plots so households can choose how much they grow, how much they preserve, and how much they buy from neighbours. The aim is redundancy: if one crop fails or one gardener burns out, tables still stay steady because systems overlap instead of collapsing into a single hero plot."
      hero={{
        src: HERO,
        alt: "Hands harvesting fresh vegetables from rich garden soil",
        credit: "Photo: Unsplash",
      }}
      sections={[
        {
          heading: "Introduction — communal vs individual growing",
          body: [
            "Communal growing shines for perennials, orchards, toolsheds, irrigation mains, and skills you only need occasionally — soil testing, tractor days, grafting workshops. Individual beds and greenhouses shine for dietary preferences, cultural crops, and the quiet therapy of tending your own row without a committee vote on every tomato.",
            "Most resilient communities mix both: a shared market garden and food forest for staples and learning, plus private courtyards for herbs, berries, and experiments. The balance shifts with member capacity: early phases lean communal to amortise costs; mature phases often add more private growing as confidence grows.",
            "The emotional dimension matters too. Some people recharge alone in a garden; others recharge in a harvest circle. Designing paths, gates, and schedules so both temperaments thrive is part of good food governance, not an afterthought.",
          ],
        },
        {
          heading: "Regenerative agriculture — permaculture, food forests",
          body: [
            "Regenerative agriculture is less a brand than a bundle of practices: minimise tillage where it makes sense, keep living roots in soil as much of the year as possible, integrate animals at appropriate scale, and design water flow before planting layout. Permaculture adds pattern literacy — zones, sectors, guilds — so energy and attention are spent closest to the kitchen first.",
            "Food forests stack canopy, understory, shrubs, herbs, roots, and climbers so one piece of land yields nuts, fruit, greens, and pollinator habitat with decreasing annual labour as the system matures. They are patient capital: five quiet years, then decades of caloric and medicinal diversity if water is honest.",
          ],
          images: [
            {
              src: "https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=2400",
              alt: "Rows of young crops in a cultivated field under open sky",
              caption: "Regenerative layouts start with water, soil organic matter, and perennial structure — then annuals fill the niches.",
            },
          ],
        },
        {
          heading: "Crop & livestock options — what grows in different climates",
          body: [
            "Mediterranean dry summers favour olives, grapes, figs, legumes, and drought-tempered perennials with mulched basins and greywater where legal. Temperate oceanic climates favour apples, pears, brassicas, and grass-fed ruminants if pasture is managed rotationally. Cold continental climates push you toward root cellars, greenhouse season extension, and hay for winter feed.",
            "Livestock is optional but powerful: poultry for eggs and pest cycles, small ruminants for milk and brush clearing, pigs for tillage on new ground — always matched to land carrying capacity and neighbour tolerance. Autarkeia encourages transparent manure plans and quiet rooster policies before anyone buys chicks as a group bonding exercise.",
            "Seed sovereignty is practical: save varieties that taste like home, swap with neighbours, and keep a printed catalogue of what actually yielded in your microclimate, not what Instagram promised.",
          ],
        },
        {
          heading: "Food preservation & storage — managing harvest",
          body: [
            "Abundance without storage is waste and pest pressure. Root cellars, fermentation, dehydration, freezing on surplus solar, and pressure canning each have climates where they shine. Communities benefit from a shared processing kitchen with good ventilation, stainless surfaces, and clear booking so glut weekends do not collide.",
            "Labelling, inventory rotation, and allergen discipline turn a pantry into infrastructure instead of archaeology. Teaching preservation as a seasonal rhythm — June berries, September tomatoes — spreads skills across households so no single person becomes the unofficial sauerkraut department forever.",
          ],
          images: [
            {
              src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=2400&q=85",
              alt: "Glass jars of preserved vegetables on a wooden shelf",
              caption: "Jars on shelves: harvest stretched across seasons without freezer dependence.",
            },
          ],
        },
        {
          heading: "Getting started — seeds, planning, tools",
          body: [
            "Begin with a three-year crop plan even if year one is modest: where perennials will live, where annuals will rotate, where compost will cure, where children can run through without crushing delicate seedlings. Order soil tests; map sun in winter solstice, not just summer.",
            "Tool libraries beat duplicate rototillers: one good broadfork, one good wheel hoe, shared irrigation parts. Buy once, maintain together, log repairs so the next steward knows which bearing squeaks.",
            "Register interest with Autarkeia to connect with others forming regional cohorts — we use aggregated demand to prioritise workshops, nursery partnerships, and cold-chain experiments where members already live.",
          ],
          images: [
            {
              src: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=2400",
              alt: "Farm field with irrigation equipment and crops in neat rows",
              caption: "Tools, irrigation, and compost piles are shared logistics — schedule them like any other commons.",
            },
          ],
        },
      ]}
    />
  )
}
