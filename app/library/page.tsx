"use client"

import { useMemo, useState } from "react"

const typeFilters = ["All", "Books", "Documentaries", "Films", "Series", "Courses", "Apps", "Games", "YouTube"]
const subjectFilters = ["All", "Emergency Readiness", "Self-Sufficiency", "Food Growing", "Water", "Energy", "Medical", "Skills", "Mental Resilience", "History & Collapse", "Philosophy"]

const items = [
  ["The Knowledge","Lewis Dartnell","Books",["History & Collapse","Skills"],"How to rebuild civilization from first principles.","https://www.amazon.es/s?k=the+knowledge+lewis+dartnell&tag=autarkeia-es"],
  ["One Second After","William Forstchen","Books",["Emergency Readiness","History & Collapse"],"Fictional EMP collapse and societal disruption.","https://www.amazon.es/s?k=one+second+after&tag=autarkeia-es"],
  ["Patriots","James Wesley Rawles","Books",["Emergency Readiness"],"Survival fiction focused on preparedness planning.","https://www.amazon.es/s?k=patriots+james+wesley+rawles&tag=autarkeia-es"],
  ["Deep Survival","Laurence Gonzales","Books",["Mental Resilience"],"Behavioral patterns of survival and decision-making.","https://www.amazon.es/s?k=deep+survival+laurence+gonzales&tag=autarkeia-es"],
  ["When All Hell Breaks Loose","Cody Lundin","Books",["Emergency Readiness"],"Practical household preparedness guide.","https://www.amazon.es/s?k=when+all+hell+breaks+loose&tag=autarkeia-es"],
  ["Bushcraft 101","Dave Canterbury","Books",["Skills"],"Core wilderness and fieldcraft techniques.","https://www.amazon.es/s?k=bushcraft+101&tag=autarkeia-es"],
  ["The Prepper's Blueprint","Tess Pennington","Books",["Emergency Readiness"],"Step-by-step plan for resilient households.","https://www.amazon.es/s?k=the+prepper+blueprint&tag=autarkeia-es"],
  ["How to Survive the End of the World as We Know It","James Wesley Rawles","Books",["Emergency Readiness"],"Preparedness planning and logistics.","https://www.amazon.es/s?k=how+to+survive+the+end+of+the+world+as+we+know+it&tag=autarkeia-es"],
  ["The Long Emergency","James Howard Kunstler","Books",["History & Collapse","Energy"],"Peak oil and systemic fragility analysis.","https://www.amazon.es/s?k=the+long+emergency&tag=autarkeia-es"],
  ["Collapse","Jared Diamond","Books",["History & Collapse"],"Why civilizations fail and adapt.","https://www.amazon.es/s?k=collapse+jared+diamond&tag=autarkeia-es"],
  ["The Road","Cormac McCarthy","Books",["History & Collapse"],"Post-collapse survival fiction.","https://www.amazon.es/s?k=the+road+cormac+mccarthy&tag=autarkeia-es"],
  ["Dies the Fire","S.M. Stirling","Books",["History & Collapse"],"Grid-down world survival fiction.","https://www.amazon.es/s?k=dies+the+fire&tag=autarkeia-es"],
  ["Meditations","Marcus Aurelius","Books",["Philosophy","Mental Resilience"],"Stoic mindset for uncertainty and hardship.","https://www.amazon.es/s?k=meditations+marcus+aurelius&tag=autarkeia-es"],
  ["Walden","Henry David Thoreau","Books",["Philosophy","Self-Sufficiency"],"Foundational text on simple, independent living.","https://www.amazon.es/s?k=walden+thoreau&tag=autarkeia-es"],
  ["The Encyclopedia of Country Living","Carla Emery","Books",["Self-Sufficiency","Skills"],"Comprehensive homestead reference.","https://www.amazon.es/s?k=encyclopedia+of+country+living&tag=autarkeia-es"],
  ["Root Cellaring","Mike and Nancy Bubel","Books",["Food Growing"],"Food storage without electricity.","https://www.amazon.es/s?k=root+cellaring&tag=autarkeia-es"],
  ["Seed to Seed","Suzanne Ashworth","Books",["Food Growing"],"Seed saving methods by crop.","https://www.amazon.es/s?k=seed+to+seed+suzanne+ashworth&tag=autarkeia-es"],
  ["Possum Living","Dolly Freed","Books",["Self-Sufficiency","Philosophy"],"Low-cost independent living mindset.","https://www.amazon.es/s?k=possum+living&tag=autarkeia-es"],
  ["The Resilient Farm and Homestead","Ben Falk","Books",["Food Growing","Water"],"Integrated resilient homestead systems.","https://www.amazon.es/s?k=resilient+farm+and+homestead&tag=autarkeia-es"],
  ["The Art of Natural Building","Joseph Kennedy","Books",["Skills","Self-Sufficiency"],"Natural homebuilding techniques.","https://www.amazon.es/s?k=the+art+of+natural+building&tag=autarkeia-es"],
  ["Into the Wild","Sean Penn","Films",["Mental Resilience","Self-Sufficiency"],"Film exploring independence and risk.","https://www.imdb.com/title/tt0758758/"],
  ["The Road (2009)","John Hillcoat","Films",["History & Collapse"],"Post-apocalyptic survival film.","https://www.imdb.com/title/tt0898367/"],
  ["How Much Is Enough?","Various","Documentaries",["Philosophy"],"Documentary on consumption and purpose.","https://www.youtube.com/results?search_query=How+Much+Is+Enough+documentary"],
  ["Sustainable","Matt Wechsler","Documentaries",["Food Growing"],"Regenerative agriculture and food systems.","https://www.imdb.com/title/tt6333092/"],
  ["The Power of Community","Faith Morgan","Documentaries",["Energy","History & Collapse"],"Cuba's response to systemic shortages.","https://www.youtube.com/results?search_query=The+Power+of+Community+documentary"],
  ["Collapse (2009)","Chris Smith","Documentaries",["History & Collapse"],"Discussion of systemic vulnerabilities.","https://www.imdb.com/title/tt1503769/"],
  ["2012: Time for Change","Joao Amorim","Documentaries",["Philosophy"],"Exploration of alternative futures.","https://www.imdb.com/title/tt1613780/"],
  ["Living on One Dollar","Chris Temple","Documentaries",["Mental Resilience"],"Resource scarcity and adaptation.","https://www.imdb.com/title/tt3270538/"],
  ["The Biggest Little Farm","John Chester","Documentaries",["Food Growing"],"Regenerative farm development journey.","https://www.imdb.com/title/tt8969332/"],
  ["Kiss the Ground","Josh Tickell","Documentaries",["Food Growing"],"Soil regeneration and climate solutions.","https://www.imdb.com/title/tt8618654/"],
  ["Planet of the Humans","Jeff Gibbs","Documentaries",["Energy"],"Debate around energy transitions.","https://www.imdb.com/title/tt12192654/"],
  ["Tomorrow / Demain","Cyril Dion","Documentaries",["Self-Sufficiency"],"Community-led practical solutions.","https://www.imdb.com/title/tt4449576/"],
  ["The Minimalists","Matt D'Avella","Documentaries",["Philosophy"],"Intentional living and consumption.","https://www.imdb.com/title/tt3810760/"],
  ["Wild","Jean-Marc Vallée","Films",["Mental Resilience"],"Resilience and personal reconstruction.","https://www.imdb.com/title/tt2305051/"],
  ["127 Hours","Danny Boyle","Films",["Emergency Readiness"],"Extreme survival and decision-making.","https://www.imdb.com/title/tt1542344/"],
  ["Primitive Technology","Primitive Technology","YouTube",["Skills","Self-Sufficiency"],"Ancient skills and low-tech builds.","https://www.youtube.com/@primitivetechnology9550"],
  ["Survival Russia","Lars","YouTube",["Emergency Readiness"],"Cold-weather survival field practice.","https://www.youtube.com/@SurvivalRussia"],
  ["The Prepared","The Prepared","YouTube",["Emergency Readiness"],"Preparedness gear and planning.","https://www.youtube.com/results?search_query=The+Prepared+channel"],
  ["City Prepping","City Prepping","YouTube",["Emergency Readiness"],"Urban emergency readiness.","https://www.youtube.com/@CityPrepping"],
  ["Wranglerstar","Cody Crone","YouTube",["Self-Sufficiency","Skills"],"Homestead systems and tools.","https://www.youtube.com/@wranglerstar"],
  ["Justin Rhodes","Justin Rhodes","YouTube",["Food Growing","Self-Sufficiency"],"Permaculture homestead processes.","https://www.youtube.com/@JustinRhodesVlog"],
  ["Peak Prosperity","Chris Martenson","YouTube",["History & Collapse"],"Macro risk and preparedness analysis.","https://www.youtube.com/@PeakProsperity"],
  ["Yankee Prepper","Yankee Prepper","YouTube",["Emergency Readiness"],"Gear and practical skills.","https://www.youtube.com/results?search_query=Yankee+Prepper"],
  ["The Healthy Prepper","The Healthy Prepper","YouTube",["Medical","Emergency Readiness"],"Medical and family preparedness.","https://www.youtube.com/results?search_query=The+Healthy+Prepper"],
  ["Canadian Prepper","Nate Polson","YouTube",["Emergency Readiness"],"Comprehensive readiness updates.","https://www.youtube.com/@CanadianPrepper"],
  ["Homestead Rescue","Discovery","Series",["Self-Sufficiency"],"Rural systems troubleshooting.","https://www.imdb.com/title/tt6057348/"],
  ["Living Traditions Homestead","Kevin and Sarah","YouTube",["Self-Sufficiency"],"Off-grid family living.","https://www.youtube.com/@LivingTraditionsHomestead"],
  ["Kirsten Dirksen","Kirsten Dirksen","YouTube",["Self-Sufficiency"],"Alternative housing worldwide.","https://www.youtube.com/@kirstendirksen"],
  ["Paul Wheaton","Paul Wheaton","YouTube",["Food Growing"],"Permaculture education and projects.","https://www.youtube.com/results?search_query=Paul+Wheaton"],
  ["Geoff Lawton","Geoff Lawton","YouTube",["Food Growing"],"Permaculture design training.","https://www.youtube.com/@discoverpermaculture"],
  ["Off Grid with Doug and Stacy","Doug and Stacy","YouTube",["Self-Sufficiency"],"Off-grid household systems.","https://www.youtube.com/@OFFGRIDwithDOUGandSTACY"],
  ["Pure Living for Life","Pure Living for Life","YouTube",["Skills","Self-Sufficiency"],"Off-grid home build journey.","https://www.youtube.com/@PureLivingforLife"],
  ["Exploring Alternatives","Mat and Danielle","YouTube",["Self-Sufficiency"],"Tiny homes and off-grid stories.","https://www.youtube.com/@ExploringAlternatives"],
  ["Happen Films","Happen Films","YouTube",["Self-Sufficiency"],"Sustainability and resilient communities.","https://www.youtube.com/@happenfilms"],
  ["Awakening with Russell Brand","Russell Brand","YouTube",["Philosophy","Mental Resilience"],"Philosophy and resilience conversations.","https://www.youtube.com/results?search_query=Awakening+with+Russell+Brand"],
  ["Zello","Zello Inc.","Apps",["Emergency Readiness","Skills"],"Walkie-talkie style live voice communication.","https://apps.apple.com/app/zello/id508231856"],
  ["Offline Maps (Maps.me)","MAPS.ME","Apps",["Emergency Readiness"],"Offline navigation without internet.","https://apps.apple.com/app/maps-me-offline-map-nav/id510623322"],
  ["Red Cross First Aid","American Red Cross","Apps",["Medical"],"First aid instructions and guides.","https://apps.apple.com/app/first-aid/id529160691"],
  ["FEMA App","FEMA","Apps",["Emergency Readiness"],"US emergency alerts and resources.","https://www.fema.gov/about/news-multimedia/mobile-products"],
  ["Windy","Windy SE","Apps",["Energy","Emergency Readiness"],"Weather and wind forecasting.","https://apps.apple.com/app/windy-com-weather-radar/id997079492"],
  ["what3words","what3words Ltd","Apps",["Emergency Readiness"],"Precise location sharing in emergencies.","https://apps.apple.com/app/what3words-navigation-maps/id657878530"],
  ["Signal","Signal Foundation","Apps",["Emergency Readiness"],"Encrypted communication messaging.","https://signal.org/download/"],
  ["myAT&T","AT&T","Apps",["Emergency Readiness"],"Backup communications account access.","https://apps.apple.com/app/myat-t/id309172177"],
  ["iSatPhone guide app","Inmarsat","Apps",["Emergency Readiness"],"Satellite communications setup support.","https://www.inmarsat.com/"],
  ["Baofeng radio companion app","Various developers","Apps",["Emergency Readiness"],"Programming and field support for radios.","https://play.google.com/store/search?q=baofeng&c=apps"],
  ["Red Cross First Aid certification","Red Cross","Courses",["Medical"],"Certified first aid training.","https://www.redcross.org/take-a-class/first-aid"],
  ["FEMA IS-100","FEMA","Courses",["Emergency Readiness"],"Incident command fundamentals.","https://training.fema.gov/is/courseoverview.aspx?code=IS-100.c"],
  ["Resilience Skills","Coursera","Courses",["Mental Resilience"],"Structured resilience training.","https://www.coursera.org/search?query=resilience%20skills"],
  ["Survival skills courses","Udemy","Courses",["Skills","Emergency Readiness"],"Practical survival learning tracks.","https://www.udemy.com/courses/search/?q=survival+skills"],
  ["Permaculture Research Institute courses","PRI","Courses",["Food Growing"],"Online permaculture certification content.","https://www.permacultureeducationinstitute.org/"],
  ["Solar installation certification","Various","Courses",["Energy","Skills"],"Professional solar installation pathways.","https://www.coursera.org/search?query=solar%20installation"],
].map((item, i) => ({ id: i + 1, title: item[0], author: item[1], type: item[2], subjects: item[3] as string[], description: item[4], link: item[5] }))

export default function Library() {
  const [type, setType] = useState("All")
  const [subject, setSubject] = useState("All")

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = type === "All" || item.type === type
      const subjectMatch = subject === "All" || item.subjects.includes(subject)
      return typeMatch && subjectMatch
    })
  }, [type, subject])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Global Resilience Library</h1>
        <p className="mt-3 text-sm text-[#3d5166] max-w-2xl">A comprehensive emergency readiness and self-sufficiency library with open access to every resource.</p>

        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap gap-2">{typeFilters.map((value) => <button key={value} onClick={() => setType(value)} className={`rounded-full border px-3 py-1.5 text-xs ${type === value ? "border-[#009b70] text-[#009b70]" : "border-[#d4dce8] text-[#3d5166]"}`}>{value}</button>)}</div>
          <div className="flex flex-wrap gap-2">{subjectFilters.map((value) => <button key={value} onClick={() => setSubject(value)} className={`rounded-full border px-3 py-1.5 text-xs ${subject === value ? "border-[#009b70] text-[#009b70]" : "border-[#d4dce8] text-[#3d5166]"}`}>{value}</button>)}</div>
        </div>

        <p className="mt-6 text-sm text-[#8a9bb0]">{filtered.length} resources</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#d4dce8] p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#f5f7fa] px-2.5 py-1 text-xs text-[#3d5166]">{item.type}</span>
                <div className="flex gap-1 flex-wrap justify-end">{item.subjects.map((tag) => <span key={tag} className="rounded-full bg-[#e8f8f3] px-2 py-0.5 text-[11px] text-[#0d1b2a]">{tag}</span>)}</div>
              </div>
              <h2 className="mt-3 text-lg font-medium text-[#0d1b2a]">{item.title}</h2>
              <p className="text-sm text-[#8a9bb0]">{item.author}</p>
              <p className="mt-2 text-sm text-[#3d5166]">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-[#009b70]">Open resource →</a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
