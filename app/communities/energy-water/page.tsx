import { CommunityDetail } from "@/components/community-detail"

export const metadata = {
  title: "Energy & Water — Communities — Autarkeia",
  description:
    "Off-grid solar, wind, rainwater harvesting, and resilient water systems for Autarkeia communities.",
}

export default function EnergyWaterPage() {
  return (
    <CommunityDetail
      eyebrow="Energy & Water"
      title="Your own grid. Your own water. Designed for the worst week of the year."
      tagline="Off-grid solar, wind where it makes sense, rainwater harvest, greywater reuse, and the storage that makes them dependable."
      intro="Energy and water are where independence stops being slogans and starts being kilowatt-hours and litres. Autarkeia communities are designed to produce both on-site, with enough storage and redundancy that the failure modes are mild — a quiet appliance off for an evening — rather than catastrophic."
      hero={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Solar_panel_array_in_a_field.jpg/1920px-Solar_panel_array_in_a_field.jpg",
        alt: "Ground-mounted solar array in open field",
        credit: "Photo: Wikimedia Commons",
      }}
      sections={[
        {
          heading: "Solar first, sized for January",
          body: [
            "We design solar arrays for the worst month of the year, not the best. That means oversizing PV capacity, planning for snow and shading, and using lithium iron phosphate batteries sized to ride through three to five low-sun days without grid backup.",
            "Where the local grid is reasonably reliable, we keep a one-way grid-tie connection that turns surplus into export credit. Where the grid is fragile or expensive, fully off-grid designs make sense — but only with honest energy budgeting up front.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Solar_panels_on_rooftop.jpg/1280px-Solar_panels_on_rooftop.jpg",
              alt: "Rooftop solar PV array",
              caption: "Rooftop PV — the workhorse of community energy.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/LiFePO4_battery_pack.jpg/1280px-LiFePO4_battery_pack.jpg",
              alt: "Lithium iron phosphate battery pack",
              caption: "LFP batteries — long cycle life, safer chemistry.",
            },
          ],
        },
        {
          heading: "Wind, micro-hydro, and the right tool for the site",
          body: [
            "Wind turbines pay back beautifully on exposed ridges and coastal plots with consistent average wind speeds; they pay back terribly in sheltered valleys. We measure before we buy.",
            "Micro-hydro is the most reliable renewable source where a perennial stream with usable head exists on or near the property — but the legal complexity around water rights varies enormously by jurisdiction and must be navigated before any concrete is poured.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Small_wind_turbine.jpg/1280px-Small_wind_turbine.jpg",
              alt: "Small residential wind turbine",
              caption: "Small wind — only where the resource is real.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Micro_hydro_turbine.jpg/1280px-Micro_hydro_turbine.jpg",
              alt: "Micro-hydro turbine on a stream",
              caption: "Micro-hydro: small head, steady output.",
            },
          ],
        },
        {
          heading: "Rainwater harvest and resilient storage",
          body: [
            "Rainwater harvested off roofs is the single highest-leverage water intervention available to most households. Generous catchment, first-flush diverters, large insulated cisterns, and gravity-fed distribution turn a few intense storms into months of irrigation and washing water.",
            "Potable water is treated separately: ceramic and UV filtration, with bench-scale chlorination available for emergencies. Springs and wells are tested annually; results are posted openly so residents can compare year to year.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rainwater_harvesting_tank.jpg/1280px-Rainwater_harvesting_tank.jpg",
              alt: "Large rainwater harvesting tank next to a house",
              caption: "Cisterns scaled to roof area and local rainfall.",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Hand_pump_water_well.jpg/1280px-Hand_pump_water_well.jpg",
              alt: "Hand pump above a well",
              caption: "A hand pump on every well — power-out backup.",
            },
          ],
        },
        {
          heading: "Heat, cooling, and greywater",
          body: [
            "Heat and cold add another layer. Solar thermal panels and well-insulated tanks cover most domestic hot water. Wood stoves with efficient masonry mass act as backup and a winter focal point in cold-climate homes. Passive cooling — high thermal mass, cross-ventilation, deep eaves — does most of the summer work without compressors.",
            "Greywater from showers and sinks is filtered and routed to fruit trees and ornamental plantings, closing one of the household&apos;s biggest waste streams.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Solar_water_heater.jpg/1280px-Solar_water_heater.jpg",
              alt: "Roof-mounted solar water heater",
              caption: "Solar thermal — most domestic hot water for free.",
            },
          ],
        },
        {
          heading: "Getting started",
          body: [
            "We sequence energy and water pilots wherever we have a serious cohort of households. Tell us your site, your climate, and whether you want to be off-grid by design or grid-tied with serious backup.",
            "Register your interest and we will share early designs, equipment sourcing, and the local installer networks we trust.",
          ],
          images: [
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Greywater_recycling_garden.jpg/1280px-Greywater_recycling_garden.jpg",
              alt: "Greywater garden with fruit trees",
              caption: "Greywater feeds the orchard, not the drain.",
            },
          ],
        },
      ]}
    />
  )
}
