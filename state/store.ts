// state/store.ts

import { create } from 'zustand';

export interface BalanceData {
  date: string;
  mentalScore: number;
  physicalScore: number;
  timestamp: number;
}

export interface AppState {
  // Scores
  currentMentalScore: number;
  currentPhysicalScore: number;
  
  // History
  dailyHistory: BalanceData[];
  
  // Streaks & Achievements
  currentStreak: number;
  achievements: string[];
  
  // User Preferences
  privacyMode: boolean;
  notificationsEnabled: boolean;

  isBadDayMode: boolean;
  toggleBadDayMode: () => void;
  
  // Actions
  setMentalScore: (score: number) => void;
  setPhysicalScore: (score: number) => void;
  addHistoryEntry: (entry: BalanceData) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockAchievement: (id: string) => void;
  setPrivacyMode: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentMentalScore: 78,
  currentPhysicalScore: 65,
  dailyHistory: [],
  currentStreak: 3,
  achievements: ['first_balance', 'week_streak_3'],
  privacyMode: false,
  notificationsEnabled: true,
  isBadDayMode: false,
  
  setMentalScore: (score) =>
    set({ currentMentalScore: Math.min(100, Math.max(0, score)) }),
  
  setPhysicalScore: (score) =>
    set({ currentPhysicalScore: Math.min(100, Math.max(0, score)) }),
  
  addHistoryEntry: (entry) =>
    set((state) => ({
      dailyHistory: [entry, ...state.dailyHistory].slice(0, 365),
    })),
  
  incrementStreak: () =>
    set((state) => ({ currentStreak: state.currentStreak + 1 })),
  
  resetStreak: () =>
    set({ currentStreak: 0 }),
  
  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.includes(id)
        ? state.achievements
        : [...state.achievements, id],
    })),
  
  setPrivacyMode: (enabled) =>
    set({ privacyMode: enabled }),
  
  setNotifications: (enabled) =>
    set({ notificationsEnabled: enabled }),

  toggleBadDayMode: () => set((state) => ({ isBadDayMode: !state.isBadDayMode })),
  
  clearAllData: () =>
    set({
      currentMentalScore: 0,
      currentPhysicalScore: 0,
      dailyHistory: [],
      currentStreak: 0,
      achievements: [],
    }),
}));

