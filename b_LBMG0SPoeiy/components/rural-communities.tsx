import { MapPin, Users, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

const communities = [
  {
    name: "Terra Nova Collective",
    location: "Alentejo, Portugal",
    members: 23,
    focus: "Permaculture & Regenerative Agriculture",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop",
  },
  {
    name: "Alpine Resilience Network",
    location: "Tyrol, Austria",
    members: 47,
    focus: "Off-Grid Living & Energy Independence",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  },
  {
    name: "Rewilding Community",
    location: "Scottish Highlands, UK",
    members: 31,
    focus: "Wilderness Skills & Land Stewardship",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop",
  },
]

export function RuralCommunities() {
  return (
    <section className="bg-gradient-to-b from-[#f5f7fa] to-[#e8ebe5] py-20" id="rural-communities">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
              Find Your <span className="text-[#009b70]">Community</span>
            </h2>
            <p className="mt-4 text-lg font-light text-[#3d5166] leading-relaxed">
              Connect with intentional communities, eco-villages, and rural properties worldwide. 
              Whether you&apos;re looking to join an established group or find like-minded neighbors, 
              we help you build the support network that makes self-sufficiency sustainable.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-light text-[#3d5166]">
                <MapPin className="h-5 w-5 text-[#009b70]" />
                <span>2,400+ locations globally</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-light text-[#3d5166]">
                <Users className="h-5 w-5 text-[#009b70]" />
                <span>18,000+ active members</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-light text-[#3d5166]">
                <Leaf className="h-5 w-5 text-[#009b70]" />
                <span>Sustainability verified</span>
              </div>
            </div>
            <Button className="mt-8 bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg">
              Explore communities
            </Button>
          </div>

          <div className="space-y-4">
            {communities.map((community, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl bg-white p-4 border border-[#d4dce8]/50"
                style={{ borderWidth: '0.5px' }}
              >
                <img
                  src={community.image}
                  alt={community.name}
                  className="h-20 w-28 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-normal text-[#0d1b2a] truncate">{community.name}</h3>
                  <p className="text-sm font-light text-[#3d5166] flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {community.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-light text-[#8a9bb0]">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {community.members} members
                    </span>
                    <span className="text-[#009b70] font-normal">{community.focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
