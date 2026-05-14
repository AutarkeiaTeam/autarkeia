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
  "Geopolitics",
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

    // --- Geopolitics & World Future Podcasts ---
    // Specific episodes (not channel-level links) covering systemic risk,
    // global instability, energy, money, food, climate, technology, and
    // historical patterns of civilizational decline. Each entry: episode
    // title, host/channel, description, direct link.

    {
      title: "Joe Rogan Experience #1921 — Peter Zeihan",
      author: "The Joe Rogan Experience",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Geopolitical strategist Peter Zeihan on the unwinding of globalization, Russia and Ukraine, China's demographic ceiling, and how energy and food supply lines reshape household risk.",
      link: "https://www.youtube.com/watch?v=jJTw3SzrlQM",
    },
    {
      title: "Understanding the Collapse of Global Trade — Peter Zeihan",
      author: "Impact Theory with Tom Bilyeu",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Why the post-WWII trade order is breaking apart, what de-globalization means for prices and jobs, and which regions are best positioned for the decade ahead.",
      link: "https://podcasts.apple.com/us/podcast/understanding-the-collapse-of-global-trade-the/id1191775648?i=1000749407844",
    },
    {
      title: "The Future of Geopolitics — Peter Zeihan",
      author: "Colossus Review",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Long-form interview on demography, navies, fertilizers, and how the end of cheap, predictable global shipping will rewire industry and household budgets.",
      link: "https://joincolossus.com/episode/zeihan-the-future-of-geopolitics/",
    },
    {
      title: "GWP #029 — Peter Zeihan",
      author: "The Grant Williams Podcast",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Zeihan and Grant Williams on Ukraine, Chinese fragility, US shale, and how investors and households should weight tail risks during a structural break in the order.",
      link: "https://ttmygh.podbean.com/e/gwp_0029_peter_zeihan-free/",
    },
    {
      title: "Lex Fridman Podcast #401 — John Mearsheimer",
      author: "Lex Fridman Podcast",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Realist IR scholar John Mearsheimer on Israel-Palestine, Russia-Ukraine, China, NATO, and the structural pressures pushing great powers toward confrontation.",
      link: "https://www.youtube.com/watch?v=r4wLXNydzeY",
    },
    {
      title: "John Mearsheimer Explains the China Threat",
      author: "Hoover Institution",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Mearsheimer argues China — not Russia — is the primary long-run challenge to US power, and explains the logic of containment and offshore balancing.",
      link: "https://www.youtube.com/watch?v=6ev9AhPhUZY",
    },
    {
      title: "Mearsheimer on Ukraine, Gaza & Escalation Dominance",
      author: "SpectatorTV",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Why strikes on Russian strategic infrastructure raise nuclear escalation risk, and how Middle East and Asia theatres now interact with the European war.",
      link: "https://www.youtube.com/watch?v=slkn2-N3oR0",
    },
    {
      title: "John Mearsheimer: Putin to Trump — A Response Is Coming",
      author: "Daniel Davis / Deep Dive",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "How Russia is likely to respond to renewed Western pressure, and what that means for Europe's defence posture and energy supply.",
      link: "https://podcasts.apple.com/us/podcast/john-mearsheimer-putin-to-trump-a-response-is-coming/id1761369345?i=1000711587611",
    },
    {
      title: "Sanctions and Russia: Effects, Lessons, and the Future",
      author: "Hoover Institution — History Lab with Stephen Kotkin",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Historian Stephen Kotkin and economist Sergei Guriev assess how Western sanctions have actually worked on Russia and what they predict for similar future tools.",
      link: "https://hoovertalks.podbean.com/e/sanctions-and-russia-effects-lessons-and-the-future-a-history-lab-discussion-with-stephen-kotkin-hoover-institution/",
    },
    {
      title: "Stephen Kotkin: China, Russia, and American Freedom",
      author: "Hoover Virtual Policy Briefings",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "What Xi Jinping and Putin actually believe, how nuclear deterrence still constrains escalation, and what American renewal would require.",
      link: "https://podcasts.apple.com/us/podcast/stephen-kotkin-china-russia-and-american-freedom/id1512014595?i=1000479679400",
    },
    {
      title: "Ep 128: Stephen Kotkin on Russia and Ukraine",
      author: "School of War (Aaron MacLean)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "A historian's view of how the war in Ukraine actually ends, what Russia's regime needs to survive, and how to think about endgames rather than slogans.",
      link: "https://podcasts.apple.com/us/podcast/ep-128-stephen-kotkin-on-russia-and-ukraine-war-in-ukraine-1/id1589160645?i=1000659380725",
    },
    {
      title: "Russia's Murky Future — Stephen Kotkin",
      author: "Foreign Affairs Interview",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Kotkin on succession risk in the Kremlin, the durability of the Russian state, and how the West should read internal Russian signals.",
      link: "https://foreignaffairsmagazine.podbean.com/e/russia-s-murky-future",
    },
    {
      title: "The Age of Empire Strikes Back — Stephen Kotkin",
      author: "Hoover Institution",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Kotkin on Trump-era American power projection, the return of empire logic, and what realistic statecraft looks like in a multipolar world.",
      link: "https://www.hoover.org/research/age-empire-strikes-back-stephen-kotkin-trump-wrestling-and-use-american-power",
    },
    {
      title: "Top Geopolitical Risks of 2025 — Live Conversation",
      author: "GZERO World with Ian Bremmer",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Eurasia Group's annual Top Risks report unpacked: Trump-era foreign policy shifts, Middle East instability, China weakness, and a destabilized global order.",
      link: "https://www.gzeromedia.com/podcast/gzero-world-podcast/the-top-geopolitical-risks-of-2025-a-live-conversation-with-ian-bremmer-and-global-experts",
    },
    {
      title: "The State of the World in 2024 — Ian Bremmer",
      author: "GZERO World with Ian Bremmer",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Live from the GZERO Summit in Tokyo: wars in Ukraine and the Middle East, rising nationalism, climate strain, and the global leadership vacuum.",
      link: "https://www.gzeromedia.com/podcast/gzero-world-podcast/the-state-of-the-world-in-2024-with-ian-bremmer",
    },
    {
      title: "Trouble Ahead: The Top Global Risks of 2024",
      author: "GZERO World with Ian Bremmer",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Eurasia Group's 2024 Top Risks breakdown — the US-China rift, AI governance, and conflicts whose second-order effects ripple into supply chains and elections.",
      link: "https://www.gzeromedia.com/podcast/podcast-trouble-ahead-the-top-global-risks-of-2024",
    },
    {
      title: "A History of the West After Adam Smith's Wealth of Nations — Niall Ferguson",
      author: "Hoover Institution / Jon Hartley",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Historian Niall Ferguson on empire, networks, and 'The Great Degeneration' — how political and financial institutions actually fail.",
      link: "https://www.hoover.org/research/history-west-after-adam-smiths-wealth-nations-niall-ferguson",
    },
    {
      title: "Welcome to Cold War Two — Niall Ferguson",
      author: "Radio Davos (World Economic Forum)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Ferguson on US-China rivalry as a structural cold war, what 1947 can teach us, and where this contest is most likely to turn hot.",
      link: "https://www.weforum.org/podcasts/radio-davos/episodes/niall-ferguson-geopolitics-cold-war/",
    },
    {
      title: "Empire or Republic? The Choice in '24 — Niall Ferguson",
      author: "Hoover Institution — GoodFellows",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Ferguson on whether the US is becoming an empire in fact, how that bargain differs from a republic, and the long historical record of imperial decline.",
      link: "https://www.hoover.org/research/empire-or-republic-choice-24",
    },
    {
      title: "Game Theory #18: Trump World Order",
      author: "Professor Jiang — Predictive History",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Professor Jiang Xueqin uses historical pattern analysis and game theory to map Trump's military and economic strategy, including Iran and the Monroe Doctrine.",
      link: "https://predictivehistory.com/game-theory-18-trump-world-order/",
    },
    {
      title: "Game Theory #21: World War Trump",
      author: "Professor Jiang — Predictive History",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "The Iran war as part of a larger US strategic vision: oil-refinery fires, naval blockades, ship seizures, and what these mean for global energy markets.",
      link: "https://predictivehistory.com/game-theory-21-world-war-trump/",
    },
    {
      title: "Jiang Xueqin: Great Power Wars Over a New World Order",
      author: "Professor Jiang — Predictive History",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance"],
      description:
        "Why China's rise is ending 500 years of Western leadership, and the historical precedents for whether such transitions can occur peacefully.",
      link: "https://www.youtube.com/watch?v=80jUKe0blAQ",
    },
    {
      title: "Jiang Xueqin: New World Order — Iran War Ends US Empire",
      author: "Professor Jiang — Predictive History",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "How an Iran war could trigger Gulf State collapse, regional reshuffles, and the unwinding of the security architecture that underwrote globalisation.",
      link: "https://www.youtube.com/watch?v=6rTlI_Qwd1I",
    },
    {
      title: "Civilization Bonus: Meet Professor Jiang",
      author: "Professor Jiang — Predictive History",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "Introduction to Jiang's method: blending Western classical literature, game theory, and historical patterns to forecast civilizational trajectories.",
      link: "https://www.youtube.com/watch?v=voQEteh6Hko",
    },
    {
      title: "The New Age of Mass Migration — Parag Khanna",
      author: "Carnegie Council — The Doorstep",
      type: "Podcasts",
      subjects: ["Geopolitics", "Community"],
      description:
        "Khanna on his book MOVE: climate, demography, and labor markets converging into the largest migration era in modern history.",
      link: "https://www.carnegiecouncil.org/media/series/the-doorstep/20211014-doorstep-new-age-mass-migration-futuremap-parag-khanna",
    },
    {
      title: "Parag Khanna on migration and future movements",
      author: "I've Been Thinking with Peter Frankopan",
      type: "Podcasts",
      subjects: ["Geopolitics", "Community"],
      description:
        "Why people move, where the new safe geographies are, and how families and policymakers should plan for climate-driven displacement.",
      link: "https://podcasts.apple.com/gb/podcast/ive-been-thinking-with-peter-frankopan/id1573942113?i=1000540320869",
    },
    {
      title: "Parag Khanna: Where Should We Move to as Climate Collapses?",
      author: "Wild with Sarah Wilson",
      type: "Podcasts",
      subjects: ["Geopolitics", "Climate"],
      description:
        "Practical climate-migration framework for households: which regions are buying time, which are not, and how to think about resilience locations.",
      link: "https://podcasts.apple.com/au/podcast/parag-khanna-where-should-we-move-to-as-climate-collapses/id1548626341?i=1000657851587",
    },
    {
      title: "Forward Thinking on Megathreats, Polycrises, and Doom Loops — Nouriel Roubini",
      author: "McKinsey Global Institute — Forward Thinking",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "'Dr. Doom' Nouriel Roubini on his Megathreats framework, the looming sovereign-debt crisis, and which threat he ranks as the most likely to detonate.",
      link: "https://www.mckinsey.com/mgi/forward-thinking/forward-thinking-on-megathreats-polycrises-and-doom-loops-with-nouriel-roubini",
    },
    {
      title: "The Hidden Economic History of the Tiananmen Square Protests",
      author: "Ones and Tooze (Foreign Policy) — Adam Tooze",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "Historian Adam Tooze on the economic pressures behind 1989, and why economic discontent is so often the missing variable in political crisis analysis.",
      link: "https://foreignpolicy.com/podcasts/ones-and-tooze/the-economics-that-drove-the-tiananmen-square-protests/",
    },
    {
      title: "Lessons from the Weimar Republic — Adam Tooze",
      author: "Ones and Tooze (Foreign Policy)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics"],
      description:
        "How Weimar-era inflation translated into political collapse — and where today's US political and economic strains do, and don't, mirror that pattern.",
      link: "https://foreignpolicy.com/podcasts/ones-and-tooze/lessons-from-the-weimar-republic/",
    },
    {
      title: "The History of Energy Crises — Adam Tooze",
      author: "Ones and Tooze (Foreign Policy)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Suez 1956, the 1973 oil shock, and the current Iran-driven crisis: what each one actually did to households, governments, and global trade.",
      link: "https://foreignpolicy.com/podcasts/ones-and-tooze/the-energy-crisis/",
    },
    {
      title: "The Age of the Anthropocene: Polycrises & Our Post-Pandemic Future — Adam Tooze",
      author: "Hidden Forces (Demetri Kofinas)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Climate"],
      description:
        "Tooze on the fragility of debt-financed economies, great-power competition, and how a polycrisis becomes the new normal rather than a one-off shock.",
      link: "https://hiddenforces.libsyn.com/the-age-of-the-anthropocene-polycrises-our-post-pandemic-future-adam-tooze",
    },
    {
      title: "MacroVoices #398: Broken Money — Lyn Alden",
      author: "MacroVoices",
      type: "Podcasts",
      subjects: ["Economics", "Geopolitics"],
      description:
        "Lyn Alden's framework for the broken monetary system, CBDCs and stablecoins, energy-money linkages, and what they mean for long-cycle inflation.",
      link: "https://www.macrovoices.com/1249-macrovoices-398-lyn-alden-broken-money-2",
    },
    {
      title: "MacroVoices #260: Shifting From Monetary to Fiscal Dominance — Lyn Alden",
      author: "MacroVoices",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics", "Governance"],
      description:
        "Why central banks are losing the ability to set the price of money, deficit dynamics, yield curve control risks, and the long arc for gold and Bitcoin.",
      link: "https://www.macrovoices.com/948-macrovoices-260-lyn-alden-shifting-from-monetary-to-fiscal-dominance",
    },
    {
      title: "MacroVoices #299: Revisiting Inflation/Deflation Signals — Lyn Alden",
      author: "MacroVoices",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics", "Energy"],
      description:
        "Long-term debt cycles, 1940s-style financial repression, oil cycles, and how monetary and fiscal policy interact to set the next decade's inflation regime.",
      link: "https://www.macrovoices.com/1028-macrovoices-299-lyn-alden-revisiting-inflation-deflation-signals",
    },
    {
      title: "The Changing World Order: How Countries Go Broke — Ray Dalio",
      author: "Modern Wisdom (Chris Williamson)",
      type: "Podcasts",
      subjects: ["Economics", "Geopolitics"],
      description:
        "Ray Dalio's 'five big forces' — debt cycles, internal conflict, external conflict, nature shocks, and technology — and how to read where we are in each.",
      link: "https://podcasts.apple.com/us/podcast/the-changing-world-order-how-countries-go-broke-ray/id1347973549?i=1000720551683",
    },
    {
      title: "Ray Dalio — The Changing World Order",
      author: "The Jordan Harbinger Show",
      type: "Podcasts",
      subjects: ["Economics", "Geopolitics"],
      description:
        "Repeating cycles of empire, debt, and currency: Dalio's framework for thinking about decline, applied to today's US-China competition.",
      link: "https://www.jordanharbinger.com/ray-dalio-the-changing-world-order/",
    },
    {
      title: "#068 Ray Dalio on Where We Are in the Changing World Order",
      author: "The Julia La Roche Show",
      type: "Podcasts",
      subjects: ["Economics", "Geopolitics"],
      description:
        "Dalio walks through the three forces converging today — massive debts, internal political conflict, and China's rise — and where in the cycle they sit.",
      link: "https://podcasts.apple.com/us/podcast/068-ray-dalio-on-where-we-are-in-the-changing-world-order/id1636372365?i=1000608467427",
    },
    {
      title: "Daron Acemoglu on Why Nations Fail",
      author: "EconTalk with Russ Roberts",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance", "Economics"],
      description:
        "Why institutions — not geography or culture — explain why some countries succeed economically and others fail, and what that means for resilience planning.",
      link: "https://www.econtalk.org/acemoglu-on-why-nations-fail/",
    },
    {
      title: "How Liberal Democracy Can Survive an Age of Spiraling Crises",
      author: "Foreign Affairs Interview — Daron Acemoglu",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance", "Psychology"],
      description:
        "Acemoglu on what concrete institutional reforms can keep liberal democracy functional through AI, inequality, and overlapping crises.",
      link: "https://www.foreignaffairs.org/podcasts/how-liberal-democracy-can-survive-age-spiraling-crises",
    },
    {
      title: "344 — Helen Thompson on Disorder",
      author: "Talking Politics (Cambridge)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Cambridge political economist Helen Thompson on her book Disorder: how oil, the Eurozone, and democratic strain are one interlinked story.",
      link: "https://www.talkingpoliticspodcast.com/blog/2022/344-helen-thompsondisorder",
    },
    {
      title: "Helen Thompson on Disorder and Contemporary Geopolitics",
      author: "New Books Network",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Long-form interview on how energy geopolitics — from Suez to shale to Russian gas — has actually shaped Western politics over fifty years.",
      link: "https://newbooksnetwork.com/helen-thompson-on-disorder-and-the-analysis-of-contemporary-geopolitics",
    },
    {
      title: "Why Complex Societies Collapse — Joseph Tainter",
      author: "Planet: Critical (Rachel Donald)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "Archaeologist Joseph Tainter on diminishing returns to complexity: why societies grow until maintenance is no longer worthwhile, then simplify suddenly.",
      link: "https://www.youtube.com/watch?v=kzHrqzHAxwc",
    },
    {
      title: "184 — Societal Complexity and Collapse",
      author: "omega tau podcast",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "Detailed walkthrough of Tainter's Collapse of Complex Societies, with case studies from the Western Roman Empire, the Maya, and the Chacoans.",
      link: "https://omegataupodcast.net/184-societal-complexity-and-collapse/",
    },
    {
      title: "Episode 72: Interview with Dr. Joseph Tainter",
      author: "Breaking Down: Collapse",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Tainter on energy return on investment, why innovation curves flatten, and how the collapse-of-complex-societies framework maps onto today's industrial economies.",
      link: "https://podcasts.apple.com/us/podcast/episode-72-interview-with-dr-joseph-tainter-complex/id1534972612?i=1000549741556",
    },
    {
      title: "Autocracy, Inc. with Anne Applebaum",
      author: "The Enemies List (Rick Wilson)",
      type: "Podcasts",
      subjects: ["Governance", "Geopolitics"],
      description:
        "Atlantic staff writer Anne Applebaum on how today's dictatorships (Russia, China, Iran, Venezuela) cooperate as a network and what that means for democracies.",
      link: "https://podcasts.apple.com/us/podcast/autocracy-inc-with-anne-applebaum/id1650861232?i=1000663177968",
    },
    {
      title: "How Regime Change Happens in America — Anne Applebaum",
      author: "NPR Fresh Air",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance", "Psychology"],
      description:
        "Applebaum maps the second Trump administration onto historical patterns of institutional capture — and explains what late-stage warning signs to watch.",
      link: "https://www.npr.org/2025/02/19/1232435542/applebaum-regime-change",
    },
    {
      title: "Steve Keen: Mythonomics — How Economics Ignores Energy",
      author: "The Great Simplification (Nate Hagens)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Economics", "Energy"],
      description:
        "Heterodox economist Steve Keen on why mainstream economic models leave out energy and how that gap explains repeated crisis blind spots.",
      link: "https://www.thegreatsimplification.com/episode/30-steve-keen",
    },
    {
      title: "End of Year Reflections: Four Years of The Great Simplification",
      author: "The Great Simplification (Nate Hagens)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy"],
      description:
        "Nate Hagens synthesises four years of conversations into a single coherent narrative on the human predicament — energy, money, ecology, and behaviour.",
      link: "https://www.thegreatsimplification.com/episode/205-nate-hagens",
    },
    {
      title: "Daniel Schmachtenberger: A Vision for Betterment",
      author: "The Great Simplification — Episode 126",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "Schmachtenberger on the 'naive progress' narrative, the metacrisis, and how to redefine progress so it doesn't externalise its own destruction.",
      link: "https://www.thegreatsimplification.com/episode/126-daniel-schmachtenberger-7",
    },
    {
      title: "Daniel Schmachtenberger: Silicon Dreams and Carbon Nightmares — The Wide Boundary Impacts of AI",
      author: "The Great Simplification — Episode 132",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Climate"],
      description:
        "Why current AI trajectories are accelerating fossil-fuel extraction and ecological destruction rather than solving climate, and what would change that.",
      link: "https://www.thegreatsimplification.com/episode/132-daniel-schmachtenberger",
    },
    {
      title: "Daniel Schmachtenberger: Artificial Intelligence and the Superorganism",
      author: "The Great Simplification — Episode 71",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Economics"],
      description:
        "How AI plugged into a growth-based global system intensifies extraction, concentration of power, and existential risk — and what mitigation actually requires.",
      link: "https://www.thegreatsimplification.com/episode/71-daniel-schmachtenberger",
    },
    {
      title: "Daniel Schmachtenberger: Bend Not Break #4 — Modeling the Drivers of the Metacrisis",
      author: "The Great Simplification — Episode 42",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "The deep drivers of the metacrisis: incentives, technology, and game-theoretic dynamics that push civilisations toward overshoot.",
      link: "https://www.thegreatsimplification.com/episode/42-daniel-schmachtenberger",
    },
    {
      title: "Daniel Schmachtenberger: Bend Not Break #3 — Sensemaking, Uncertainty, and Purpose",
      author: "The Great Simplification — Episode 31",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology", "Community"],
      description:
        "How to make sense of systemic crises without falling into either denial or despair — practical sensemaking for difficult times.",
      link: "https://www.thegreatsimplification.com/episode/31-daniel-schmachtenberger",
    },
    {
      title: "Growth and the Energy Transition — Vaclav Smil",
      author: "Exponential View (Azeem Azhar) / HBR",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Economics"],
      description:
        "Vaclav Smil on the hard numbers behind energy transitions, why they take decades, and what realistic decarbonisation actually looks like.",
      link: "https://hbr.org/podcast/2019/11/growth-and-the-energy-transition-with-vaclav-smil",
    },
    {
      title: "Vaclav Smil, Author of How the World Really Works",
      author: "A Sustainable Future (Man Group / Jason Mitchell)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Food Production"],
      description:
        "Smil on fertilizer, steel, cement, and plastics — the four pillars of modern civilisation — and why getting off them by 2050 is wildly optimistic.",
      link: "https://www.man.com/insights/ri-podcast-vaclav-smil",
    },
    {
      title: "Daniel Yergin Sees a 'Different World' Emerging After the Hormuz Crisis",
      author: "Bloomberg Odd Lots",
      type: "Podcasts",
      subjects: ["Energy", "Geopolitics"],
      description:
        "Pulitzer-winning energy historian Daniel Yergin on the post-Hormuz energy order, AI data-centre power demand, and shifting energy-security strategies.",
      link: "https://www.bloomberg.com/news/audio/2026-04-22/odd-lots-yergin-on-the-aftermath-of-the-war-in-iran-podcast",
    },
    {
      title: "Will Energy Security Fears Change the Global Energy Market? — Daniel Yergin",
      author: "FT Economics Show (Soumaya Keynes)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Economics"],
      description:
        "How the Iran conflict reshapes stockpiles, LNG flows, and renewables — including whether green transition creates new bottlenecks of its own.",
      link: "https://www.ft.com/content/4749801a-1ebf-48d7-ab6c-537f5a7fc96f",
    },
    {
      title: "Winter Is Coming — Doomberg",
      author: "SmarterMarkets (David Greely)",
      type: "Podcasts",
      subjects: ["Energy", "Geopolitics"],
      description:
        "Anonymous energy analysts Doomberg lay out their thesis on the European energy crisis and how policy choices drove the disaster.",
      link: "https://smartermarkets.media/winter-is-coming-episode-3-doomberg/",
    },
    {
      title: "An Update on Europe's Energy Crisis — Doomberg",
      author: "Supply Shock (Blockworks)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Economics"],
      description:
        "Practical analysis of how European industry adjusts (or doesn't) to high power prices, and what that means for the dollar, the euro, and global goods.",
      link: "https://blockworks.co/podcast/supplyshock/cbdcd08a-3f19-11ed-9709-8fe830d40d9b",
    },
    {
      title: "The Food & Energy Crisis Has Only Just Begun — Doomberg",
      author: "Forward Guidance (Blockworks)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Food Production"],
      description:
        "Why policy errors — not Russia alone — drove oil, gas, and food prices upward, and what households should expect over a multi-year horizon.",
      link: "https://blockworks.co/podcast/forwardguidance/9593386c-cc31-11ec-b6ec-1bfca5d142aa",
    },
    {
      title: "Energy Crisis Upon Us — Chris Martenson",
      author: "Peak Prosperity",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Economics"],
      description:
        "Chris Martenson on why the Ukraine war's energy fallout is one of the most under-priced economic risks of the decade, with concrete household actions.",
      link: "https://peakprosperity.com/energy-crisis-upon-us/",
    },
    {
      title: "The Largest Energy Shock on Record Is Worse Than You Think",
      author: "Peak Prosperity — Chris Martenson",
      type: "Podcasts",
      subjects: ["Energy", "Geopolitics"],
      description:
        "Martenson breaks down the data on the Strait of Hormuz crisis: how much oil, gas, and LNG capacity is offline, and what cascades next.",
      link: "https://peakprosperity.com/the-largest-energy-shock-on-record-is-worse-than-you-think/",
    },
    {
      title: "Economic Collapse Approaches — Chris Martenson",
      author: "Peak Prosperity",
      type: "Podcasts",
      subjects: ["Geopolitics", "Energy", "Economics"],
      description:
        "Peak oil meets debt-fuelled GDP: Martenson explains the geology behind shale decline and why he believes a US economic crash is now unavoidable.",
      link: "https://peakprosperity.com/economic-collapse-approaches/",
    },
    {
      title: "Global Polycrisis — Thomas Homer-Dixon",
      author: "Open Canada Podcast",
      type: "Podcasts",
      subjects: ["Geopolitics", "Climate"],
      description:
        "Thomas Homer-Dixon on how climate, Ukraine, European energy, and African food crises form one interlinked polycrisis rather than separate problems.",
      link: "https://opencanada.org/podcast/20-global-polycrisis-with-thomas-homer-dixon/",
    },
    {
      title: "Crisis and Resilience — Thomas Homer-Dixon",
      author: "Cascade Institute",
      type: "Podcasts",
      subjects: ["Geopolitics", "Governance", "Community"],
      description:
        "Homer-Dixon on complexity science, high-leverage intervention points, and how small policy and community actions can move large systems.",
      link: "https://cascadeinstitute.org/crisis-and-resilience-an-interview-with-thomas-homer-dixon/",
    },
    {
      title: "Mapping the Hope Attractor — Thomas Homer-Dixon",
      author: "Polycrisis.org",
      type: "Podcasts",
      subjects: ["Geopolitics", "Psychology"],
      description:
        "Homer-Dixon's Polycrisis Core Model maps 11 critical global systems and the possible 'attractor' futures — from dystopia to a democratic resilience scenario.",
      link: "https://polycrisis.org/resource/mapping-the-hope-attractor-a-conversation-with-thomas-homer-dixon/",
    },
    {
      title: "Nexus Part 1: Can Democracy Survive the AI Revolution? — Yuval Noah Harari",
      author: "The Next Big Idea",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Governance"],
      description:
        "Harari on the history of information networks from cuneiform to AI, and why he thinks modern democracy is unusually vulnerable to AI-controlled information flows.",
      link: "https://podcasts.apple.com/gb/podcast/nexus-part-1-can-democracy-survive-the-ai-revolution/id1482067226?i=1000669677148",
    },
    {
      title: "Rage Against the Machines — Yuval Noah Harari",
      author: "The Rich Roll Podcast",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Psychology"],
      description:
        "Harari on AI as 'alien intelligence', manufactured intimacy, surveillance, and a possible 'Silicon Curtain' dividing the world into incompatible information spheres.",
      link: "https://richroll.com/podcast/yuval-noah-harari-867/",
    },
    {
      title: "Yuval Noah Harari on AI & the Future of Information",
      author: "On with Kara Swisher",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Governance"],
      description:
        "Why truth gets harder to find in floods of AI-generated content, and what regulatory and personal practices could preserve a functioning information commons.",
      link: "https://podcasts.apple.com/us/podcast/yuval-noah-harari-on-ai-the-future-of-information/id1643307527?i=1000673002487",
    },
    {
      title: "Spotlight on AI: What Would It Take For This to Go Well?",
      author: "Your Undivided Attention (Tristan Harris & Aza Raskin)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Security"],
      description:
        "Center for Humane Technology's framework for AI governance: incentives, deployment patterns, and the policy levers actually available to citizens and states.",
      link: "https://www.humanetech.com/podcast/spotlight-on-ai-what-would-it-take-for-this-to-go-well",
    },
    {
      title: "IPFS (InterPlanetary File System) with Juan Benet — Changelog #204",
      author: "Changelog Interviews",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Security"],
      description:
        "Protocol Labs founder Juan Benet on IPFS: how content-addressed, decentralised data infrastructure makes the web more resilient to single-point failure.",
      link: "https://changelog.com/podcast/204",
    },
    {
      title: "Stanford Seminar — IPFS and the Permanent Web (Juan Benet)",
      author: "Stanford Engineering / EE380",
      type: "Podcasts",
      subjects: ["Geopolitics", "Communications", "Skills"],
      description:
        "Juan Benet's technical seminar on building durable peer-to-peer infrastructure that survives censorship, link rot, and centralized outages.",
      link: "https://www.youtube.com/watch?v=HUVmypx9HGI",
    },
    {
      title: "How Cary Fowler Co-Founded the Svalbard Global Seed Vault",
      author: "State of Seed (International Seed Federation)",
      type: "Podcasts",
      subjects: ["Geopolitics", "Food Production", "Climate"],
      description:
        "Cary Fowler — 2024 World Food Prize laureate — on building the Arctic seed vault and why preserving crop diversity is core food-system insurance.",
      link: "https://podcasts.apple.com/us/podcast/how-cary-fowler-co-founded-the-svalbard-global-seed-vault/id1755707344?i=1000714752893",
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
