import type { Stage } from '../data/types';

export interface StageConfig {
  key: Stage;
  label: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  description: string;
}

export const JOURNEY: { key: Stage; label: string }[] = [
  { key: 'Discover', label: 'Discover' },
  { key: 'Validating', label: 'Validate' },
  { key: 'Building', label: 'Build' },
  { key: 'Launch', label: 'Launch' },
];

export function stageConfig(stage: Stage): StageConfig {
  switch (stage) {
    case 'No Team':
      return {
        key: stage, label: 'Discover',
        ctaPrimary: 'Complete Discover',
        ctaSecondary: 'Explore Recommended Members',
        description: 'Understand yourself, then find complementary teammates.',
      };
    case 'Discover':
      return {
        key: stage, label: 'Discover',
        ctaPrimary: 'Find Your Team',
        ctaSecondary: 'Explore Recommended Members',
        description: 'Your profile is ready — start reviewing teammate matches.',
      };
    case 'Team Formed':
      return {
        key: stage, label: 'Validate',
        ctaPrimary: 'Validate Your Business',
        ctaSecondary: 'Review Team Composition',
        description: 'Confirm your team can work effectively together.',
      };
    case 'Validating':
      return {
        key: stage, label: 'Validate',
        ctaPrimary: 'Start Building',
        ctaSecondary: 'View Validation Results',
        description: 'Validation looks strong — move into execution.',
      };
    case 'Building':
      return {
        key: stage, label: 'Build',
        ctaPrimary: 'Continue Progress',
        ctaSecondary: 'Open Next Task',
        description: 'You are executing. Keep the momentum on your MVP.',
      };
    case 'Launch':
      return {
        key: stage, label: 'Launch',
        ctaPrimary: 'Track Growth',
        description: 'You have launched. Focus on traction and retention.',
      };
    default:
      return {
        key: stage, label: 'Discover',
        ctaPrimary: 'Complete Discover',
        description: 'Begin your journey.',
      };
  }
}

export function journeyProgress(stage: Stage): number {
  const idx = JOURNEY.findIndex((j) => j.key === stage);
  return idx < 0 ? 25 : ((idx + 1) / JOURNEY.length) * 100;
}
