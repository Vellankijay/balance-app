// utils/constants.ts

export const APP_VERSION = '0.1.0';
export const APP_NAME = 'Balance';

// Scoring constraints
export const SCORE_BOUNDS = {
  MIN: 0,
  MAX: 100,
};

export const MENTAL_SCORE_WEIGHTS = {
  lateNightUsage: 0.3,
  fragmentation: 20,
  totalMinutesExcess: 0.05,
  defaultScore: 100,
};

export const PHYSICAL_SCORE_WEIGHTS = {
  sedentaryPenalty: 0.5,
  breakFrequency: 10,
  activityBonus: 15,
  defaultScore: 100,
};

// Achievement IDs
export const ACHIEVEMENT_IDS = {
  FIRST_BALANCE: 'first_balance',
  WEEK_STREAK_3: 'week_streak_3',
  PERFECT_WEEK: 'perfect_week',
  MENTAL_MASTER: 'mental_master',
  PHYSICAL_PRO: 'physical_pro',
  BALANCED_SOUL: 'balanced_soul',
};

// Storage keys
export const STORAGE_KEYS = {
  DAILY_METRICS: 'daily_metrics',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'settings',
  USER_PREFERENCES: 'user_preferences',
};

// API & ML Model paths
export const MODEL_PATHS = {
  ADAPTIVE_WEIGHTS: 'models/adaptive.json',
  USER_BASELINE: 'models/baseline.json',
};