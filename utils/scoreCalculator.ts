function determineDataAvailability(
    healthData: RawHealthData | null,
    usageData: RawUsageData | null,
    taskData: TaskData | null
  ): DataAvailability {
    return {
      hasHealthData: healthData !== null,
      hasUsageData: usageData !== null,
      hasTaskData: taskData !== null && (taskData.mentalTasks.total > 0 || taskData.physicalTasks.total > 0),
    };
  }
  
  function getMentalWeights(availability: DataAvailability): {
    sleepWeight: number;
    focusWeight: number;
    screenTimeWeight: number;
    appBalanceWeight: number;
    taskCompletionWeight: number;
  } {
    if (availability.hasTaskData) {
      // With task data: tasks are prioritized as they show intentional effort
      return {
        sleepWeight: 0.25,
        focusWeight: 0.20,
        screenTimeWeight: 0.12,
        appBalanceWeight: 0.10,
        taskCompletionWeight: 0.33, // Major indicator of growth
      };
    } else {
      // Without task data: increase importance of behavioral metrics
      return {
        sleepWeight: 0.32,
        focusWeight: 0.28,
        screenTimeWeight: 0.20, // Increased importance
        appBalanceWeight: 0.20, // Increased importance
        taskCompletionWeight: 0,
      };
    }
  }
  
  function getPhysicalWeights(availability: DataAvailability): {
    stepsWeight: number;
    exerciseWeight: number;
    activityWeight: number;
    heartHealthWeight: number;
    taskCompletionWeight: number;
  } {
    if (availability.hasTaskData) {
      // With task data: tasks show intentional training
      return {
        stepsWeight: 0.20,
        exerciseWeight: 0.20,
        activityWeight: 0.18,
        heartHealthWeight: 0.15,
        taskCompletionWeight: 0.27, // Significant weight
      };
    } else {
      // Without task data: rely more on passive health metrics
      return {
        stepsWeight: 0.28,
        exerciseWeight: 0.26,
        activityWeight: 0.24,
        heartHealthWeight: 0.22,
        taskCompletionWeight: 0,
      };
    }
  }
  
  export function calculateMentalScore(
    healthData: RawHealthData | null,
    usageData: RawUsageData | null,
    taskData: TaskData | null
  ): { score: number; breakdown: MentalFactorBreakdown } {
    // Use dummy data if not provided
    const health = healthData || generateDummyHealthData();
    const usage = usageData || generateDummyUsageData();
    const tasks = taskData || { mentalTasks: { total: 0, completed: 0 }, physicalTasks: { total: 0, completed: 0 } };
    
    const availability = determineDataAvailability(healthData, usageData, taskData);
    const weights = getMentalWeights(availability);
    
    const screenTimeScore = calculateScreenTimeScore(usage);
    const focusScore = calculateFocusScore(usage);
    const sleepScore = calculateSleepScore(health);
    const appBalanceScore = calculateAppBalanceScore(usage);
    const mentalTaskCompletionScore = calculateMentalTaskCompletionScore(tasks);
    
    // Apply dynamic weights
    const mentalScore =
      sleepScore * weights.sleepWeight +
      focusScore * weights.focusWeight +
      screenTimeScore * weights.screenTimeWeight +
      appBalanceScore * weights.appBalanceWeight +
      mentalTaskCompletionScore * weights.taskCompletionWeight;
    
    return {
      score: Math.round(mentalScore),
      breakdown: {
        screenTimeScore: Math.round(screenTimeScore),
        focusScore: Math.round(focusScore),
        sleepScore: Math.round(sleepScore),
        appBalanceScore: Math.round(appBalanceScore),
        mentalTaskCompletionScore: Math.round(mentalTaskCompletionScore),
      },
    };
  }// ============================================
  // DATA AVAILABILITY & DYNAMIC WEIGHTING
  // ============================================
  
  export interface DataAvailability {
    hasTaskData: boolean;
    hasHealthData: boolean;
    hasUsageData: boolean;
  }// utils/scoreCalculator.ts
  
  // ============================================
  // DATA TYPES
  // ============================================
  
  export interface RawHealthData {
    steps: number; // daily step count
    activeMinutes: number; // minutes of active movement
    exerciseMinutes: number; // structured exercise
    heartRateAverage: number; // bpm
    heartRateVariability: number; // HRV score (0-100)
    sleepHours: number; // hours slept
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent'; // subjective
    caloriesBurned: number; // estimated daily burn
  }
  
  export interface RawUsageData {
    screenTimeMinutes: number; // total screen time
    phonePickups: number; // number of times phone unlocked
    appUsageByCategory: {
      social: number; // minutes on social media
      work: number; // minutes on productivity apps
      gaming: number; // minutes on games
      health: number; // minutes on health/fitness apps
      entertainment: number; // minutes on entertainment
      other: number; // other apps
    };
    screenFlickerCount: number; // rapid screen on/off cycles
    nightScreenTime: number; // screen time between 10pm-6am
    focusSessionsCompleted: number; // number of focus sessions
  }
  
  export interface TaskData {
    mentalTasks: {
      total: number; // total mental tasks for the period
      completed: number; // completed mental tasks
    };
    physicalTasks: {
      total: number; // total physical tasks for the period
      completed: number; // completed physical tasks
    };
  }
  
  export interface WellnessScores {
    mental: number; // 0-100
    physical: number; // 0-100
    overall: number; // 0-100
    breakdown: {
      mentalFactors: MentalFactorBreakdown;
      physicalFactors: PhysicalFactorBreakdown;
    };
  }
  
  export interface MentalFactorBreakdown {
    screenTimeScore: number;
    focusScore: number;
    sleepScore: number;
    appBalanceScore: number;
    mentalTaskCompletionScore: number;
  }
  
  export interface PhysicalFactorBreakdown {
    activityScore: number;
    exerciseScore: number;
    stepScore: number;
    heartHealthScore: number;
    physicalTaskCompletionScore: number;
  }
  
  // ============================================
  // DUMMY DATA GENERATOR
  // ============================================
  
  export function generateDummyHealthData(): RawHealthData {
    return {
      steps: Math.floor(Math.random() * 15000) + 2000, // 2k-17k steps
      activeMinutes: Math.floor(Math.random() * 120) + 20, // 20-140 min
      exerciseMinutes: Math.floor(Math.random() * 90) + 10, // 10-100 min
      heartRateAverage: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
      heartRateVariability: Math.floor(Math.random() * 40) + 40, // 40-80 HRV
      sleepHours: Math.random() * 4 + 4, // 4-8 hours
      sleepQuality: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)] as any,
      caloriesBurned: Math.floor(Math.random() * 1500) + 1500, // 1.5k-3k calories
    };
  }
  
  export function generateDummyUsageData(): RawUsageData {
    const totalScreenTime = Math.floor(Math.random() * 300) + 60; // 1-5 hours
    
    return {
      screenTimeMinutes: totalScreenTime,
      phonePickups: Math.floor(Math.random() * 150) + 30, // 30-180 pickups
      appUsageByCategory: {
        social: Math.floor(totalScreenTime * (Math.random() * 0.5 + 0.1)), // 10-60%
        work: Math.floor(totalScreenTime * (Math.random() * 0.3 + 0.1)), // 10-40%
        gaming: Math.floor(totalScreenTime * (Math.random() * 0.3)), // 0-30%
        health: Math.floor(totalScreenTime * (Math.random() * 0.2 + 0.05)), // 5-25%
        entertainment: Math.floor(totalScreenTime * (Math.random() * 0.3)), // 0-30%
        other: 0, // will be calculated
      },
      screenFlickerCount: Math.floor(Math.random() * 50), // 0-50 flickers
      nightScreenTime: Math.floor(Math.random() * 120), // 0-120 min late night
      focusSessionsCompleted: Math.floor(Math.random() * 6), // 0-6 sessions
    };
  }
  
  export function generateDummyTaskData(): TaskData {
    const mentalTotal = Math.floor(Math.random() * 8) + 3; // 3-11 mental tasks
    const physicalTotal = Math.floor(Math.random() * 8) + 3; // 3-11 physical tasks
    
    return {
      mentalTasks: {
        total: mentalTotal,
        completed: Math.floor(mentalTotal * (Math.random() * 0.8 + 0.2)), // 20-100% completion
      },
      physicalTasks: {
        total: physicalTotal,
        completed: Math.floor(physicalTotal * (Math.random() * 0.8 + 0.2)), // 20-100% completion
      },
    };
  }
  
  // ============================================
  // MENTAL SCORE CALCULATOR
  // ============================================
  
  function calculateScreenTimeScore(data: RawUsageData): number {
    // Less screen time = higher score
    // Target: 2-3 hours per day
    const optimalScreenTime = 180; // 3 hours
    const maxScreenTime = 480; // 8 hours
    
    if (data.screenTimeMinutes <= optimalScreenTime) {
      return Math.min(100, (optimalScreenTime / data.screenTimeMinutes) * 80);
    }
    
    // Penalize excess screen time
    const excess = data.screenTimeMinutes - optimalScreenTime;
    const penalty = (excess / (maxScreenTime - optimalScreenTime)) * 80;
    return Math.max(10, 80 - penalty);
  }
  
  function calculateFocusScore(data: RawUsageData): number {
    // Measures focus ability: low pickups, few flickers, high focus sessions
    const optimalPickups = 50;
    const maxPickups = 200;
    
    // Pickup score (fewer pickups = better)
    const pickupScore = Math.max(10, 100 - ((data.phonePickups / maxPickups) * 80));
    
    // Flicker score (fewer flickers = better)
    const flickerScore = Math.max(10, 100 - (data.screenFlickerCount * 2)); // 2 points per flicker
    
    // Focus session score
    const focusSessionScore = Math.min(100, data.focusSessionsCompleted * 15); // 15 points per session
    
    // Weight: pickups 40%, flickers 30%, focus sessions 30%
    return (pickupScore * 0.4 + flickerScore * 0.3 + focusSessionScore * 0.3);
  }
  
  function calculateSleepScore(data: RawHealthData): number {
    // Optimal sleep: 7-9 hours
    const optimalHours = 8;
    const minHours = 6;
    const maxHours = 10;
    
    let score = 0;
    
    // Hours score
    if (data.sleepHours >= optimalHours) {
      score += Math.min(60, (data.sleepHours / optimalHours) * 60);
    } else if (data.sleepHours >= minHours) {
      score += (data.sleepHours / optimalHours) * 60;
    } else {
      score += (data.sleepHours / minHours) * 30;
    }
    
    // Quality score
    const qualityScores = {
      poor: 10,
      fair: 30,
      good: 20,
      excellent: 40,
    };
    score += qualityScores[data.sleepQuality];
    
    return Math.min(100, score);
  }
  
  function calculateAppBalanceScore(data: RawUsageData): number {
    // Healthy app distribution: less social, more work/health
    const totalAppTime = Object.values(data.appUsageByCategory).reduce((a, b) => a + b, 0);
    
    if (totalAppTime === 0) return 50; // Neutral if no app data
    
    const socialRatio = data.appUsageByCategory.social / totalAppTime;
    const healthRatio = data.appUsageByCategory.health / totalAppTime;
    const workRatio = data.appUsageByCategory.work / totalAppTime;
    
    // Penalize excessive social media (>40% is bad)
    const socialScore = Math.max(0, 100 - (socialRatio * 250));
    
    // Reward health and work apps
    const productiveScore = (healthRatio + workRatio) * 100;
    
    // Weight: social 50%, productive 50%
    return (socialScore * 0.5 + productiveScore * 0.5);
  }
  
  function calculateMentalTaskCompletionScore(taskData: TaskData): number {
    // Mental task completion rate contributes to motivation and growth
    if (taskData.mentalTasks.total === 0) return 50; // Neutral if no tasks
    
    const completionRate = taskData.mentalTasks.completed / taskData.mentalTasks.total;
    
    // Convert completion rate (0-1) to score (0-100)
    // With a bonus for exceeding expectations
    const baseScore = completionRate * 80;
    const bonus = completionRate >= 0.8 ? 20 : 0; // 20 point bonus for 80%+ completion
    
    return Math.min(100, baseScore + bonus);
  }
  
  export function calculateMentalScore(
    healthData: RawHealthData,
    usageData: RawUsageData,
    taskData: TaskData
  ): { score: number; breakdown: MentalFactorBreakdown } {
    const screenTimeScore = calculateScreenTimeScore(usageData);
    const focusScore = calculateFocusScore(usageData);
    const sleepScore = calculateSleepScore(healthData);
    const appBalanceScore = calculateAppBalanceScore(usageData);
    const mentalTaskCompletionScore = calculateMentalTaskCompletionScore(taskData);
    
    // Weights: sleep 30%, focus 25%, screen time 15%, app balance 12%, task completion 18%
    const mentalScore =
      sleepScore * 0.3 +
      focusScore * 0.25 +
      screenTimeScore * 0.15 +
      appBalanceScore * 0.12 +
      mentalTaskCompletionScore * 0.18;
    
    return {
      score: Math.round(mentalScore),
      breakdown: {
        screenTimeScore: Math.round(screenTimeScore),
        focusScore: Math.round(focusScore),
        sleepScore: Math.round(sleepScore),
        appBalanceScore: Math.round(appBalanceScore),
        mentalTaskCompletionScore: Math.round(mentalTaskCompletionScore),
      },
    };
  }
  
  // ============================================
  // PHYSICAL SCORE CALCULATOR
  // ============================================
  
  function calculateActivityScore(data: RawHealthData): number {
    // Optimal active minutes: 60+ minutes per day
    const optimalActiveMinutes = 60;
    const maxActiveMinutes = 180;
    
    if (data.activeMinutes >= optimalActiveMinutes) {
      return Math.min(100, (data.activeMinutes / maxActiveMinutes) * 100 + 20);
    }
    
    return (data.activeMinutes / optimalActiveMinutes) * 70;
  }
  
  function calculateExerciseScore(data: RawHealthData): number {
    // Optimal exercise: 30-60 minutes per day
    const optimalExercise = 45;
    const minExercise = 20;
    
    if (data.exerciseMinutes >= optimalExercise) {
      return Math.min(100, (data.exerciseMinutes / optimalExercise) * 80 + 20);
    }
    
    if (data.exerciseMinutes >= minExercise) {
      return (data.exerciseMinutes / optimalExercise) * 80;
    }
    
    return (data.exerciseMinutes / minExercise) * 40;
  }
  
  function calculateStepScore(data: RawHealthData): number {
    // Optimal steps: 10,000 per day
    const optimalSteps = 10000;
    const minSteps = 5000;
    const maxSteps = 20000;
    
    if (data.steps >= optimalSteps) {
      return Math.min(100, (data.steps / maxSteps) * 100 + 20);
    }
    
    if (data.steps >= minSteps) {
      return (data.steps / optimalSteps) * 80;
    }
    
    return (data.steps / minSteps) * 40;
  }
  
  function calculateHeartHealthScore(data: RawHealthData): number {
    // Combines resting heart rate and heart rate variability
    // Lower RHR is better (60-80 is ideal)
    // Higher HRV is better (indicates good recovery)
    
    let rhrScore = 0;
    if (data.heartRateAverage <= 70) {
      rhrScore = 100;
    } else if (data.heartRateAverage <= 85) {
      rhrScore = 100 - ((data.heartRateAverage - 70) * 2.67);
    } else {
      rhrScore = Math.max(20, 100 - ((data.heartRateAverage - 85) * 5));
    }
    
    // HRV is already 0-100
    const hrvScore = data.heartRateVariability;
    
    // Weight: RHR 60%, HRV 40%
    return rhrScore * 0.6 + hrvScore * 0.4;
  }
  
  function calculatePhysicalTaskCompletionScore(taskData: TaskData): number {
    // Physical task completion rate shows commitment to physical wellness
    if (taskData.physicalTasks.total === 0) return 50; // Neutral if no tasks
    
    const completionRate = taskData.physicalTasks.completed / taskData.physicalTasks.total;
    
    // Convert completion rate (0-1) to score (0-100)
    // With a bonus for exceeding expectations
    const baseScore = completionRate * 80;
    const bonus = completionRate >= 0.8 ? 20 : 0; // 20 point bonus for 80%+ completion
    
    return Math.min(100, baseScore + bonus);
  }
  
  export function calculatePhysicalScore(
    healthData: RawHealthData | null,
    taskData: TaskData | null
  ): { score: number; breakdown: PhysicalFactorBreakdown } {
    // Use dummy data if not provided
    const health = healthData || generateDummyHealthData();
    const tasks = taskData || { mentalTasks: { total: 0, completed: 0 }, physicalTasks: { total: 0, completed: 0 } };
    
    const availability = determineDataAvailability(healthData, null, taskData);
    const weights = getPhysicalWeights(availability);
    
    const activityScore = calculateActivityScore(health);
    const exerciseScore = calculateExerciseScore(health);
    const stepScore = calculateStepScore(health);
    const heartHealthScore = calculateHeartHealthScore(health);
    const physicalTaskCompletionScore = calculatePhysicalTaskCompletionScore(tasks);
    
    // Apply dynamic weights
    const physicalScore =
      stepScore * weights.stepsWeight +
      exerciseScore * weights.exerciseWeight +
      activityScore * weights.activityWeight +
      heartHealthScore * weights.heartHealthWeight +
      physicalTaskCompletionScore * weights.taskCompletionWeight;
    
    return {
      score: Math.round(physicalScore),
      breakdown: {
        activityScore: Math.round(activityScore),
        exerciseScore: Math.round(exerciseScore),
        stepScore: Math.round(stepScore),
        heartHealthScore: Math.round(heartHealthScore),
        physicalTaskCompletionScore: Math.round(physicalTaskCompletionScore),
      },
    };
  }
  
  // ============================================
  // MAIN CALCULATION FUNCTION
  // ============================================
  
  export function calculateWellnessScores(
    healthData: RawHealthData | null,
    usageData: RawUsageData | null,
    taskData: TaskData | null
  ): WellnessScores {
    const mental = calculateMentalScore(healthData, usageData, taskData);
    const physical = calculatePhysicalScore(healthData, taskData);
    
    const overall = Math.round((mental.score + physical.score) / 2);
    
    return {
      mental: mental.score,
      physical: physical.score,
      overall: overall,
      breakdown: {
        mentalFactors: mental.breakdown,
        physicalFactors: physical.breakdown,
      },
    };
  }
  
  // ============================================
  // EXAMPLE USAGE - DYNAMIC WEIGHTING
  // ============================================
  
  /*
  import {
    generateDummyHealthData,
    generateDummyUsageData,
    generateDummyTaskData,
    calculateWellnessScores,
  } from '@/utils/scoreCalculator';
  
  // SCENARIO 1: With all data available
  console.log("=== WITH FULL DATA (Health + Usage + Tasks) ===");
  const fullScores = calculateWellnessScores(
    generateDummyHealthData(),
    generateDummyUsageData(),
    generateDummyTaskData()
  );
  console.log('Mental Score:', fullScores.mental); // Task completion heavily weighted
  console.log('Physical Score:', fullScores.physical); // Task completion heavily weighted
  console.log('Breakdown:', fullScores.breakdown);
  
  // SCENARIO 2: Only health and usage data (no tasks)
  console.log("\n=== WITHOUT TASK DATA (Health + Usage only) ===");
  const noTaskScores = calculateWellnessScores(
    generateDummyHealthData(),
    generateDummyUsageData(),
    null // No task data
  );
  console.log('Mental Score:', noTaskScores.mental); // Screen time and focus weighted more
  console.log('Physical Score:', noTaskScores.physical); // Passive health metrics weighted more
  console.log('Breakdown:', noTaskScores.breakdown);
  
  // SCENARIO 3: Only usage data (no health or tasks)
  console.log("\n=== WITHOUT HEALTH OR TASKS (Usage only) ===");
  const minimalScores = calculateWellnessScores(
    null, // No health data
    generateDummyUsageData(),
    null // No task data
  );
  console.log('Mental Score:', minimalScores.mental); // Heavy reliance on screen time
  console.log('Physical Score:', minimalScores.physical); // Will use defaults
  
  // DYNAMIC WEIGHTING EXAMPLE:
  // With Tasks:
  //   Mental: Sleep 25%, Focus 20%, Screen 12%, App Balance 10%, Tasks 33%
  //   Physical: Steps 20%, Exercise 20%, Activity 18%, Heart 15%, Tasks 27%
  //
  // Without Tasks:
  //   Mental: Sleep 32%, Focus 28%, Screen 20%, App Balance 20%, Tasks 0%
  //   Physical: Steps 28%, Exercise 26%, Activity 24%, Heart 22%, Tasks 0%
  //
  // This ensures screen time and app usage are properly weighted
  // when task completion data is unavailable!
  */