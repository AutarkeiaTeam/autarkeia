export type QuizType = 'self-sufficiency' | 'emergency-readiness'

export interface QuizQuestion {
  id: string
  question: string
  type: 'single' | 'multi'
  options: {
    id: string
    label: string
    isNoneOption?: boolean
  }[]
}

export interface QuizAnswers {
  [questionId: string]: string | string[]
}

export interface QuizResult {
  overall_score: number
  category_scores: {
    [category: string]: number
  }
  score_label: string
  action_plan: {
    week: ActionItem[]
    month: ActionItem[]
    year: ActionItem[]
  }
  product_recommendations: ProductRecommendation[]
  pro_bundle_upsells?: ProBundleUpsell[]
}

export interface LinkedProductRecommendation {
  name: string
  why: string
  estimated_price: string
}

export interface ActionItem {
  title: string
  description: string
  estimated_cost: string
  priority: 'high' | 'medium' | 'low'
  linked_product?: LinkedProductRecommendation | null
  recommended_sku?: string | null
  catalog_product?: EmailCatalogProduct | null
}

export interface EmailCatalogProduct {
  sku: string
  name: string
  price: string
  image_url: string | null
  seller_name: string
  affiliate_url: string
}

export interface ProductRecommendation {
  category: string
  name: string
  why: string
  estimated_price: string
  recommended_sku?: string | null
  catalog_product?: EmailCatalogProduct | null
}

export interface ProBundleUpsell {
  id: string
  name: string
  items: string
  price: string
  href: string
}

export const selfSufficiencyQuestions: QuizQuestion[] = [
  {
    id: 'ss-q1',
    question: 'Where are you based?',
    type: 'single',
    options: [
      { id: 'urban-apt', label: 'Urban — city centre apartment' },
      { id: 'urban-house', label: 'Urban — house with garden' },
      { id: 'suburban', label: 'Suburban — house with land' },
      { id: 'rural', label: 'Rural — smallholding or farm' },
    ],
  },
  {
    id: 'ss-q2',
    question: 'How much of your own food do you currently grow or produce?',
    type: 'single',
    options: [
      { id: 'none', label: 'None — I buy everything' },
      { id: 'small', label: 'A small amount — herbs, a few vegetables' },
      { id: 'meaningful', label: 'A meaningful portion — seasonal vegetables, some fruit' },
      { id: 'significant', label: 'A significant portion — year-round food production' },
    ],
  },
  {
    id: 'ss-q3',
    question: 'What is your water situation?',
    type: 'single',
    options: [
      { id: 'mains', label: 'Entirely dependent on mains supply' },
      { id: 'stored', label: 'I have some stored water (a few days worth)' },
      { id: 'rainwater', label: 'Rainwater collection or a well' },
      { id: 'multiple', label: 'Multiple sources — collection, storage and filtration' },
    ],
  },
  {
    id: 'ss-q4',
    question: 'How do you power your home?',
    type: 'single',
    options: [
      { id: 'grid', label: 'Entirely on the grid — no backup' },
      { id: 'backup', label: 'Grid plus a small generator or power bank' },
      { id: 'partial', label: 'Some solar panels, partial off-grid capability' },
      { id: 'offgrid', label: 'Off-grid or near-off-grid — solar, battery, wind' },
    ],
  },
  {
    id: 'ss-q5',
    question: 'What is your housing situation?',
    type: 'single',
    options: [
      { id: 'renting', label: 'Renting — no control over the property' },
      { id: 'owning', label: 'Owning a standard home' },
      { id: 'modified', label: 'Own home with some self-built or modified elements' },
      { id: 'selfbuilt', label: 'Self-built, natural-build or fully maintained by me' },
    ],
  },
  {
    id: 'ss-q6',
    question: 'Which practical self-sufficiency skills do you have?',
    type: 'multi',
    options: [
      { id: 'gardening', label: 'Gardening / growing food' },
      { id: 'preserving', label: 'Preserving / fermenting food' },
      { id: 'plumbing', label: 'Basic plumbing or water systems' },
      { id: 'electrical', label: 'Electrical / solar systems' },
      { id: 'carpentry', label: 'Carpentry / construction' },
      { id: 'firstaid', label: 'First aid / medical' },
      { id: 'none', label: 'None of the above', isNoneOption: true },
    ],
  },
  {
    id: 'ss-q7',
    question: 'What is your primary self-sufficiency goal?',
    type: 'single',
    options: [
      { id: 'supermarkets', label: 'Reduce dependence on supermarkets' },
      { id: 'energy', label: 'Become more energy independent' },
      { id: 'disruptions', label: 'Be fully prepared for extended disruptions' },
      { id: 'rural', label: 'Eventually move to a self-sufficient rural property' },
    ],
  },
]

export const emergencyReadinessQuestions: QuizQuestion[] = [
  {
    id: 'ep-q1',
    question: 'Where are you based?',
    type: 'single',
    options: [
      { id: 'city', label: 'Major city' },
      { id: 'town', label: 'Mid-size town' },
      { id: 'rural', label: 'Rural / countryside' },
      { id: 'coastal', label: 'Coastal or flood-prone area' },
    ],
  },
  {
    id: 'ep-q2',
    question: 'Who are you preparing for?',
    type: 'single',
    options: [
      { id: 'just-me', label: 'Just me' },
      { id: 'partner', label: 'Me and a partner' },
      { id: 'family', label: 'Family with children' },
      { id: 'extended', label: 'Extended family or group household' },
    ],
  },
  {
    id: 'ep-q3',
    question: 'How much water do you have stored right now?',
    type: 'single',
    options: [
      { id: 'none', label: 'None — I rely entirely on the tap' },
      { id: 'few', label: 'A few bottles — less than 24 hours' },
      { id: 'week', label: 'Enough for 3–7 days' },
      { id: 'weeks', label: '2+ weeks stored or I have a filtration system' },
    ],
  },
  {
    id: 'ep-q4',
    question: 'How long could your household eat without going to a shop?',
    type: 'single',
    options: [
      { id: 'less-3', label: 'Less than 3 days' },
      { id: '3-7', label: '3–7 days' },
      { id: '1-4-weeks', label: '1–4 weeks' },
      { id: 'month', label: 'More than a month' },
    ],
  },
  {
    id: 'ep-q5',
    question: 'How prepared are you medically?',
    type: 'single',
    options: [
      { id: 'none', label: 'No first aid kit or supplies' },
      { id: 'basic', label: 'Basic first aid kit only' },
      { id: 'full', label: 'Full kit plus 30-day medication supply' },
      { id: 'trained', label: 'Full kit, medications, and first aid trained' },
    ],
  },
  {
    id: 'ep-q6',
    question: 'What backup power and communications do you have?',
    type: 'multi',
    options: [
      { id: 'torches', label: 'Torches and spare batteries' },
      { id: 'powerbank', label: 'Power bank for phones' },
      { id: 'generator', label: 'Generator or solar power station' },
      { id: 'radio', label: 'Battery-powered or wind-up radio' },
      { id: 'walkie', label: 'Walkie-talkies or satellite communicator' },
      { id: 'plan', label: 'I have an emergency family contact plan' },
      { id: 'none', label: 'None of the above', isNoneOption: true },
    ],
  },
  {
    id: 'ep-q7',
    question: 'What is the disruption you are most worried about?',
    type: 'single',
    options: [
      { id: 'blackout', label: 'Extended power blackout (3+ days)' },
      { id: 'disaster', label: 'Natural disaster — flood, earthquake, wildfire' },
      { id: 'supply', label: 'Supply chain collapse or food shortage' },
      { id: 'civil', label: 'Civil unrest or breakdown of services' },
    ],
  },
]

export function getQuizConfig(type: QuizType) {
  if (type === 'self-sufficiency') {
    return {
      title: 'Self-Sufficiency Quiz',
      description: 'Discover how self-sufficient you really are',
      accentColor: '#009b70',
      questions: selfSufficiencyQuestions,
      categories: ['Food', 'Water', 'Energy', 'Shelter', 'Skills'],
    }
  }
  return {
    title: 'Emergency Readiness Quiz',
    description: 'Find out how ready you are for emergencies',
    accentColor: '#5c4a2a',
    questions: emergencyReadinessQuestions,
    categories: ['Water', 'Food', 'Medical', 'Power', 'Communication'],
  }
}
