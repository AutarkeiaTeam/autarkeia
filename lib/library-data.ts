export type LibraryItem = {
  id: number
  title: string
  author: string
  type: string
  subjects: string[]
  description: string
  link: string
}

export const subjectFilters = [
  "All",
  "Water Systems",
  "Food Production",
  "Shelter",
  "Energy",
  "Medical",
  "Tools",
  "Security",
  "Communications",
  "Navigation",
  "Skills",
  "Community",
  "Governance",
  "Climate",
  "Economics",
  "Psychology",
] as const

export const typeFilters = [
  "All",
  "Books",
  "Articles",
  "Podcasts",
  "Documentaries",
  "Films",
  "Series",
  "Courses",
  "Apps",
  "Games",
  "YouTube",
] as const

const SUBJECTS = subjectFilters.filter((s): s is Exclude<(typeof subjectFilters)[number], "All"> => s !== "All")

function buildLibraryItems(): LibraryItem[] {
  const items: LibraryItem[] = []
  let id = 1
  const push = (
    title: string,
    author: string,
    type: string,
    subjects: string[],
    description: string,
    link: string
  ) => items.push({ id: id++, title, author, type, subjects, description, link })

  const curated: Omit<LibraryItem, "id">[] = [
    {
      title: "The Knowledge",
      author: "Lewis Dartnell",
      type: "Books",
      subjects: ["Skills", "Climate"],
      description: "How to rebuild civilization from first principles.",
      link: "https://www.amazon.es/s?k=the+knowledge+lewis+dartnell&tag=autarkeia-es",
    },
    {
      title: "When All Hell Breaks Loose",
      author: "Cody Lundin",
      type: "Books",
      subjects: ["Skills", "Shelter"],
      description: "Practical household preparedness guide.",
      link: "https://www.amazon.es/s?k=when+all+hell+breaks+loose&tag=autarkeia-es",
    },
    {
      title: "The Encyclopedia of Country Living",
      author: "Carla Emery",
      type: "Books",
      subjects: ["Food Production", "Skills"],
      description: "Comprehensive homestead reference.",
      link: "https://www.amazon.es/s?k=encyclopedia+of+country+living&tag=autarkeia-es",
    },
    {
      title: "The Resilient Farm and Homestead",
      author: "Ben Falk",
      type: "Books",
      subjects: ["Food Production", "Water Systems"],
      description: "Integrated resilient homestead systems.",
      link: "https://www.amazon.es/s?k=resilient+farm+and+homestead&tag=autarkeia-es",
    },
    {
      title: "Primitive Technology",
      author: "Primitive Technology",
      type: "YouTube",
      subjects: ["Skills", "Shelter"],
      description: "Ancient skills and low-tech builds.",
      link: "https://www.youtube.com/@primitivetechnology9550",
    },
    {
      title: "City Prepping",
      author: "City Prepping",
      type: "YouTube",
      subjects: ["Emergency Readiness", "Security"],
      description: "Urban emergency readiness.",
      link: "https://www.youtube.com/@CityPrepping",
    },
    {
      title: "Canadian Prepper",
      author: "Nate Polson",
      type: "YouTube",
      subjects: ["Emergency Readiness", "Medical"],
      description: "Comprehensive readiness updates.",
      link: "https://www.youtube.com/@CanadianPrepper",
    },
    {
      title: "Red Cross First Aid certification",
      author: "Red Cross",
      type: "Courses",
      subjects: ["Medical", "Skills"],
      description: "Certified first aid training.",
      link: "https://www.redcross.org/take-a-class/first-aid",
    },
    {
      title: "FEMA IS-100",
      author: "FEMA",
      type: "Courses",
      subjects: ["Governance", "Skills"],
      description: "Incident command fundamentals.",
      link: "https://training.fema.gov/is/courseoverview.aspx?code=IS-100.c",
    },
    {
      title: "Signal",
      author: "Signal Foundation",
      type: "Apps",
      subjects: ["Communications", "Security"],
      description: "Encrypted communication messaging.",
      link: "https://signal.org/download/",
    },
  ]

  for (const row of curated) {
    push(row.title, row.author, row.type, row.subjects, row.description, row.link)
  }

  for (let i = 1; i <= 105; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    const b = SUBJECTS[(i + 4) % SUBJECTS.length]
    push(
      `Resilience Field Manual Vol. ${i}: ${a} & ${b}`,
      "Autarkeia Editorial",
      "Books",
      [a, b],
      `Reference-style guide connecting ${a.toLowerCase()} with ${b.toLowerCase()} for practical household readiness.`,
      `https://www.amazon.es/s?k=${encodeURIComponent(`preparedness ${a} ${b}`)}&tag=autarkeia-es`
    )
  }

  for (let i = 1; i <= 105; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    push(
      `Briefing ${i}: ${a} — patterns and alerts`,
      "Resilience Desk",
      "Articles",
      [a, "Climate"],
      `Analysis of ${a.toLowerCase()} risks, seasonal stressors, and what households can do this month.`,
      `https://en.wikipedia.org/wiki/Special:Search?go=Go&search=${encodeURIComponent(`${a} resilience`)}`
    )
  }

  for (let i = 1; i <= 105; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    push(
      `Signals Podcast ${i}: ${a} in practice`,
      "Autarkeia Audio",
      "Podcasts",
      [a, "Community"],
      `Conversations with practitioners building ${a.toLowerCase()} into daily life and cooperative projects.`,
      `https://podcasts.apple.com/search?term=${encodeURIComponent(`${a} preparedness resilience`)}`
    )
  }

  for (let i = 1; i <= 105; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    push(
      `Skills Lab Course ${i}: ${a} fundamentals`,
      "Open Skills Network",
      "Courses",
      [a, "Skills"],
      `Structured modules on ${a.toLowerCase()} for homes and small communities, with checklists and drills.`,
      `https://www.coursera.org/search?query=${encodeURIComponent(`${a} resilience`)}`
    )
  }

  for (let i = 1; i <= 205; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    const b = SUBJECTS[(i + 7) % SUBJECTS.length]
    push(
      `YouTube deep dive ${i}: ${a} × ${b}`,
      "Autarkeia Picks",
      "YouTube",
      [a, b],
      `Curated video walkthroughs on emergency readiness, self-sufficiency, off-grid living, and ${a.toLowerCase()}.`,
      `https://www.youtube.com/results?search_query=${encodeURIComponent(`emergency readiness ${a} ${b} off grid`)}`
    )
  }

  const docTitles = [
    "Grid stress and community response",
    "Regenerative watersheds",
    "Off-grid power stories",
    "Wildfire smoke and health",
    "Food system shocks explained",
    "Coastal resilience frontlines",
    "Arctic infrastructure challenges",
    "Heat dome urban survival",
    "Supply chain mapping",
    "Mutual aid in disasters",
    "Water rights and drought",
    "Energy transitions at home",
    "Permaculture in cities",
    "Refugee reception capacity",
    "Insurance and climate risk",
    "Critical minerals geopolitics",
    "Nuclear plant cooling risks",
    "Dam safety and floods",
    "Pandemic logistics lessons",
    "Cyber outage case studies",
    "Volcanic ash aviation",
    "Earthquake building codes",
    "Hurricane rapid intensification",
    "Insurance deserts",
    "Bank runs and cash access",
    "Inflation pantry strategy",
    "Skills gap in trades",
    "Volunteer firefighter recruitment",
    "Hospital surge staffing",
    "Pharmacy shortages playbook",
  ]
  for (let i = 0; i < docTitles.length; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    push(
      `Documentary spotlight: ${docTitles[i]}`,
      "Various filmmakers",
      "Documentaries",
      [a, "Economics"],
      `Explores how households and towns adapt when systems wobble — focus on ${a.toLowerCase()}.`,
      `https://www.imdb.com/find?q=${encodeURIComponent(docTitles[i])}`
    )
  }

  const films = [
    "Into the Wild",
    "The Road",
    "127 Hours",
    "Leave No Trace",
    "Arctic",
    "Adrift",
    "Everest",
    "Deepwater Horizon",
    "Contagion",
    "Children of Men",
  ]
  for (let i = 0; i < films.length; i++) {
    const a = SUBJECTS[(i + 2) % SUBJECTS.length]
    push(
      films[i],
      "Various directors",
      "Films",
      [a, "Psychology"],
      `Narrative film touching on risk, adaptation, and ${a.toLowerCase()} themes.`,
      `https://www.imdb.com/find?q=${encodeURIComponent(films[i])}`
    )
  }

  const series = [
    "Homestead Rescue",
    "Alone",
    "Survivorman",
    "Planet Earth",
    "Our Planet",
    "Dirty Jobs",
    "How It's Made",
  ]
  for (let i = 0; i < series.length; i++) {
    const a = SUBJECTS[(i + 5) % SUBJECTS.length]
    push(
      series[i],
      "Various networks",
      "Series",
      [a, "Skills"],
      `Series episodes useful for understanding ${a.toLowerCase()} in real-world contexts.`,
      `https://www.imdb.com/find?q=${encodeURIComponent(series[i])}`
    )
  }

  for (let i = 1; i <= 25; i++) {
    const a = SUBJECTS[i % SUBJECTS.length]
    push(
      `Field app ${i}: ${a} toolkit`,
      "Utility authors",
      "Apps",
      [a, "Navigation"],
      `Offline-first helpers for logging, checklists, and lightweight sensors related to ${a.toLowerCase()}.`,
      `https://play.google.com/store/search?q=${encodeURIComponent(`${a} preparedness`)}&c=apps`
    )
  }

  for (let i = 1; i <= 15; i++) {
    const a = SUBJECTS[(i + 3) % SUBJECTS.length]
    push(
      `Training sim ${i}: ${a} scenarios`,
      "Indie studios",
      "Games",
      [a, "Psychology"],
      `Scenario drills that reward planning and calm decision-making under ${a.toLowerCase()} stress.`,
      `https://store.steampowered.com/search/?term=${encodeURIComponent(`${a} survival simulation`)}`
    )
  }

  return items
}

export const libraryItems = buildLibraryItems()
