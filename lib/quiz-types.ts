export interface QuizQuestion {
  id: string
  category: 'food' | 'water' | 'energy' | 'shelter' | 'resilience'
  question: string
  options: {
    value: number
    label: string
  }[]
}

export interface QuizAnswers {
  [questionId: string]: number
}

export interface CategoryScore {
  category: string
  score: number
  label: string
}

export interface QuizResult {
  overallScore: number
  categoryScores: CategoryScore[]
  summary: string
  recommendations: string[]
  strengths: string[]
  improvements: string[]
}

export const quizQuestions: QuizQuestion[] = [
  // Food category
  {
    id: 'food-1',
    category: 'food',
    question: 'How much of your food do you grow or produce yourself?',
    options: [
      { value: 0, label: 'None at all' },
      { value: 25, label: 'A few herbs or vegetables' },
      { value: 50, label: 'Some fruits and vegetables seasonally' },
      { value: 75, label: 'Significant portion of produce' },
      { value: 100, label: 'Most of my food needs' },
    ],
  },
  {
    id: 'food-2',
    category: 'food',
    question: 'How many days of food reserves do you have stored?',
    options: [
      { value: 0, label: 'Less than 3 days' },
      { value: 25, label: '3-7 days' },
      { value: 50, label: '1-2 weeks' },
      { value: 75, label: '1-3 months' },
      { value: 100, label: 'More than 3 months' },
    ],
  },
  {
    id: 'food-3',
    category: 'food',
    question: 'Can you preserve food (canning, drying, fermenting)?',
    options: [
      { value: 0, label: 'No skills in food preservation' },
      { value: 33, label: 'Basic knowledge but no practice' },
      { value: 66, label: 'Some experience with one method' },
      { value: 100, label: 'Skilled in multiple preservation methods' },
    ],
  },
  // Water category
  {
    id: 'water-1',
    category: 'water',
    question: 'What is your primary source of drinking water?',
    options: [
      { value: 0, label: 'Municipal water only' },
      { value: 33, label: 'Municipal with backup storage' },
      { value: 66, label: 'Well or rainwater collection' },
      { value: 100, label: 'Multiple independent sources' },
    ],
  },
  {
    id: 'water-2',
    category: 'water',
    question: 'Can you purify water without electricity?',
    options: [
      { value: 0, label: 'No ability to purify water' },
      { value: 33, label: 'Have basic filters' },
      { value: 66, label: 'Have filters and boiling capability' },
      { value: 100, label: 'Multiple purification methods available' },
    ],
  },
  {
    id: 'water-3',
    category: 'water',
    question: 'How many days of water storage do you have?',
    options: [
      { value: 0, label: 'No dedicated water storage' },
      { value: 25, label: '1-3 days' },
      { value: 50, label: '1-2 weeks' },
      { value: 75, label: '2-4 weeks' },
      { value: 100, label: 'More than a month' },
    ],
  },
  // Energy category
  {
    id: 'energy-1',
    category: 'energy',
    question: 'Do you have alternative energy sources?',
    options: [
      { value: 0, label: 'Fully dependent on grid' },
      { value: 25, label: 'Have portable generators' },
      { value: 50, label: 'Solar panels or wind power' },
      { value: 75, label: 'Renewable energy with battery storage' },
      { value: 100, label: 'Fully off-grid capable' },
    ],
  },
  {
    id: 'energy-2',
    category: 'energy',
    question: 'Can you heat your home without electricity/gas?',
    options: [
      { value: 0, label: 'No alternative heating' },
      { value: 33, label: 'Portable heaters with limited fuel' },
      { value: 66, label: 'Wood stove or fireplace' },
      { value: 100, label: 'Sustainable wood/biomass supply' },
    ],
  },
  {
    id: 'energy-3',
    category: 'energy',
    question: 'How would you cook without power?',
    options: [
      { value: 0, label: 'Cannot cook without power' },
      { value: 33, label: 'Camping stove with limited fuel' },
      { value: 66, label: 'Multiple backup cooking methods' },
      { value: 100, label: 'Sustainable cooking (wood, solar, etc.)' },
    ],
  },
  // Shelter category
  {
    id: 'shelter-1',
    category: 'shelter',
    question: 'How would you describe your housing situation?',
    options: [
      { value: 0, label: 'Renting in urban area' },
      { value: 33, label: 'Own home in urban/suburban area' },
      { value: 66, label: 'Own home with some land' },
      { value: 100, label: 'Own property with significant land' },
    ],
  },
  {
    id: 'shelter-2',
    category: 'shelter',
    question: 'Can you perform basic home repairs?',
    options: [
      { value: 0, label: 'No repair skills' },
      { value: 33, label: 'Very basic fixes only' },
      { value: 66, label: 'Competent with common repairs' },
      { value: 100, label: 'Can handle most repairs myself' },
    ],
  },
  {
    id: 'shelter-3',
    category: 'shelter',
    question: 'Do you have emergency shelter alternatives?',
    options: [
      { value: 0, label: 'No backup shelter plan' },
      { value: 33, label: 'Could stay with family/friends' },
      { value: 66, label: 'Have camping/survival gear' },
      { value: 100, label: 'Have secondary property or shelter' },
    ],
  },
  // Resilience category
  {
    id: 'resilience-1',
    category: 'resilience',
    question: 'How connected are you to your local community?',
    options: [
      { value: 0, label: 'Know almost no neighbors' },
      { value: 33, label: 'Know a few neighbors casually' },
      { value: 66, label: 'Active in local community' },
      { value: 100, label: 'Strong mutual aid network' },
    ],
  },
  {
    id: 'resilience-2',
    category: 'resilience',
    question: 'Do you have practical skills to barter or trade?',
    options: [
      { value: 0, label: 'No tradeable skills' },
      { value: 33, label: 'One useful skill' },
      { value: 66, label: 'Several practical skills' },
      { value: 100, label: 'Multiple in-demand skills' },
    ],
  },
  {
    id: 'resilience-3',
    category: 'resilience',
    question: 'How would you rate your first aid knowledge?',
    options: [
      { value: 0, label: 'No first aid training' },
      { value: 33, label: 'Basic first aid knowledge' },
      { value: 66, label: 'CPR and advanced first aid certified' },
      { value: 100, label: 'Medical professional or EMT trained' },
    ],
  },
]
