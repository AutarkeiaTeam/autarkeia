import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Food Systems — Communities — Autarkeia",
  description:
    "Communal growing, food forests, regenerative design, and permaculture principles for resilient Autarkeia communities.",
}

export default function FoodSystemsPage() {
  return (
    <CommunityDetail
      eyebrow="Food Systems"
      title="A farm shared between households, not a job for one"
      tagline="Communal growing, food forests, regenerative design, and the slow work of building soil that feeds your grandchildren."
      intro="Food is where resilience either becomes real or stays theoretical. Autarkeia communities are designed around shared growing systems — perennial food forests, annual market gardens, livestock kept at the right scale — so that no single household has to be a full-time farmer, and no shock at the supermarket determines whether your family eats well."
      hero={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Food_forest_layout.jpg/1920px-Food_forest_layout.jpg",
        alt: "Food forest with layered planting",
        credit: "Photo: Wikimedia Commons",
      }}
      sections={[
        {
          heading: "Food forests and perennial layers",
          body: [
            "A mature food forest is several harvests stacked into one piece of land: a canopy of nut and fruit trees, an understorey of berries and leguminous shrubs, a herbaceous layer of perennial vegetables, a root layer, ground covers, and climbers. Once established it produces calories with a fraction of the annual labour of a vegetable garden.",
            "We design food forests using observation first: water flow, frost pockets, wind exposure, and sun arc. Then we plant in guilds — combinations of species that fix nitrogen, attract pollinators, repel pests, and produce food for humans simultaneously.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Forest_garden_-_geograph.org.uk_-_991108.jpg/1280px-Forest_garden_-_geograph.org.uk_-_991108.jpg",
              alt: "Established forest garden in the UK",
              caption: "Robert Hart-style forest garden after 20 years.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Permaculture_zones.jpg/1280px-Permaculture_zones.jpg",
              alt: "Permaculture zones diagram",
              caption: "Permaculture zoning — most-visited beds closest to the home.",
            },
          ],
        },
        {
          heading: "Market gardens and annual beds",
          body: [
            "Perennials carry the long game; annual market gardens carry the salad, tomatoes, and brassicas. We use small-scale intensive methods — Jean-Martin Fortier-style beds, broadforks, drip irrigation, and minimal tillage — to keep one or two paid growers feeding a community of fifty.",
            "Soil is the long-term asset. Cover crops, compost made from on-site biomass, animal integration, and avoiding synthetic chemistry build organic matter year after year. Soil tests are run annually and shared openly so residents see exactly what their land is doing.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Market_garden_-_geograph.org.uk_-_175019.jpg/1280px-Market_garden_-_geograph.org.uk_-_175019.jpg",
              alt: "Small-scale market garden with raised beds",
              caption: "30-inch raised beds, broadforks instead of tractors.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Compost_heap.jpg/1280px-Compost_heap.jpg",
              alt: "Compost heap with kitchen and garden waste",
              caption: "On-site compost closes the nutrient loop.",
            },
          ],
        },
        {
          heading: "Animals at the right scale",
          body: [
            "Animals enter the conversation deliberately, not by default. Hens for eggs and pest control, a few dairy goats or a small cow for milk, pigs to clear and till new ground, and bees for pollination and honey. Numbers are matched to land carrying capacity so manure is always an input, never a pollution problem.",
            "Animal welfare and human capacity are equal constraints. Communities decide together whether they want livestock at all, and rotate the caring roles so no single household is trapped in a 365-day commitment.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Free_range_chickens.jpg/1280px-Free_range_chickens.jpg",
              alt: "Free-range hens foraging in pasture",
              caption: "Hens following grazers in rotational systems.",
            },
          ],
        },
        {
          heading: "Storage, preservation, and the off-season",
          body: [
            "A community that grows brilliantly in August but starves in February has not built food security. Root cellars, fermentation rooms, dehydrators, freezers powered by surplus solar, and pressure-canning kitchens turn glut into pantry.",
            "We teach preservation as a regular workshop calendar through the harvest year so the skills live in many hands. Surpluses we cannot store are traded with neighbouring farms and homesteads.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Root_cellar_interior.jpg/1280px-Root_cellar_interior.jpg",
              alt: "Stocked root cellar with winter vegetables",
              caption: "Root cellars do the work of a freezer with no power.",
            },
          ],
        },
        {
          heading: "Getting started",
          body: [
            "Tell us what climate you want to grow in, what you already know, and how much of your food you would like to produce yourself versus buy from the community farm.",
            "Register your interest and we will sequence food-system pilots — communal orchards, a market garden cooperative, a shared dairy — wherever we have a serious cohort of households committed to the long view.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Permaculture_garden.jpg/1280px-Permaculture_garden.jpg",
              alt: "Diverse permaculture garden in full season",
              caption: "Plant for ten years out, eat from this season.",
            },
          ],
        },
      ]}
    />
  )
}
