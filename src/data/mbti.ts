import type { MBTIMeta } from './types';

export const MBTI_TYPES: Record<string, MBTIMeta> = {
  INTJ: { type: 'INTJ', title: 'Architect', description: 'Imaginative and strategic thinkers with a plan for everything.' },
  INTP: { type: 'INTP', title: 'Logician', description: 'Innovative inventors with an unquenchable thirst for knowledge.' },
  ENTJ: { type: 'ENTJ', title: 'Commander', description: 'Bold, imaginative and strong-willed leaders, always finding a better way.' },
  ENTP: { type: 'ENTP', title: 'Debater', description: 'Smart and curious thinkers who cannot resist an intellectual challenge.' },
  INFJ: { type: 'INFJ', title: 'Advocate', description: 'Creative and insightful, inspired and insightful, with quiet conviction.' },
  INFP: { type: 'INFP', title: 'Mediator', description: 'Poetic, kind and altruistic people, always eager to help a good cause.' },
  ENFJ: { type: 'ENFJ', title: 'Protagonist', description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.' },
  ENFP: { type: 'ENFP', title: 'Campaigner', description: 'Free-spirited, enthusiastic and creative, who find meaning in connections.' },
  ISTJ: { type: 'ISTJ', title: 'Logistician', description: 'Practical and fact-minded individuals, reliable and responsible.' },
  ISFJ: { type: 'ISFJ', title: 'Defender', description: 'Warm, humble and protective, always ready to defend their loved ones.' },
  ESTJ: { type: 'ESTJ', title: 'Executive', description: 'Excellent administrators, unsurpassed at managing things or people.' },
  ESFJ: { type: 'ESFJ', title: 'Consul', description: 'Extraordinarily caring, social and popular people, always eager to help.' },
  ISTP: { type: 'ISTP', title: 'Virtuoso', description: 'Bold and practical experimenters, masters of all kinds of tools.' },
  ISFP: { type: 'ISFP', title: 'Adventurer', description: 'Flexible and charming artists, always ready to explore new things.' },
  ESTP: { type: 'ESTP', title: 'Entrepreneur', description: 'Smart, energetic and perceptive people who truly enjoy living on the edge.' },
  ESFP: { type: 'ESFP', title: 'Entertainer', description: 'Spontaneous, energetic and enthusiastic, living in the moment.' },
};

export const MBTI_QUESTIONS: { id: number; question: string; a: string; b: string; aDim: string; bDim: string }[] = [
  { id: 1, question: 'At a party, you tend to…', a: 'Interact with many, including strangers', b: 'Talk deeply with a few close friends', aDim: 'E', bDim: 'I' },
  { id: 2, question: 'You prefer information that is…', a: 'Concrete and factual', b: 'Conceptual and theoretical', aDim: 'S', bDim: 'N' },
  { id: 3, question: 'When making decisions you rely more on…', a: 'Logic and consistency', b: 'Personal values and impact', aDim: 'T', bDim: 'F' },
  { id: 4, question: 'In your work you prefer to…', a: 'Plan and finish ahead of time', b: 'Adapt as you go', aDim: 'J', bDim: 'P' },
  { id: 5, question: 'You are more energized by…', a: 'Being around people', b: 'Spending time alone', aDim: 'E', bDim: 'I' },
  { id: 6, question: 'You trust…', a: 'What you can observe directly', b: 'Your intuition and patterns', aDim: 'S', bDim: 'N' },
  { id: 7, question: 'You find it easier to…', a: 'Critique and analyze', b: 'Appreciate and encourage', aDim: 'T', bDim: 'F' },
  { id: 8, question: 'You like situations that are…', a: 'Structured and settled', b: 'Open-ended and flexible', aDim: 'J', bDim: 'P' },
  { id: 9, question: 'In a group you usually…', a: 'Speak up readily', b: 'Listen more than you speak', aDim: 'E', bDim: 'I' },
  { id: 10, question: 'You are more interested in…', a: 'Details and specifics', b: 'The big picture', aDim: 'S', bDim: 'N' },
  { id: 11, question: 'You base judgments on…', a: 'Objective criteria', b: 'How people feel', aDim: 'T', bDim: 'F' },
  { id: 12, question: 'You prefer to…', a: 'Make decisions quickly', b: 'Keep options open', aDim: 'J', bDim: 'P' },
];

export const SKILL_OPTIONS = [
  'Programming', 'Marketing', 'Sales', 'Finance', 'Design', 'Engineering',
  'Operations', 'Product Management', 'Leadership', 'Research', 'Data Science',
  'Business Development', 'Legal', 'Customer Success',
];

export const INTEREST_OPTIONS = [
  'Technology', 'Finance', 'Healthcare', 'Automotive', 'Education', 'E-commerce',
  'AI', 'Sustainability', 'Entertainment', 'Logistics', 'Real Estate', 'Food & Beverage',
];

export const CAPABILITY_AREAS = [
  'Leadership', 'Product', 'Engineering', 'Design', 'Marketing',
  'Sales', 'Finance', 'Operations', 'Legal', 'Research',
];
