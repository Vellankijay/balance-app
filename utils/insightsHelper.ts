// utils/insightsHelper.ts

export interface Insight {
    title: string;
    description: string;
    actionItems: string[];
    priority: 'high' | 'medium' | 'low';
    category: 'mental' | 'physical' | 'both';
  }
  
  export interface TrendData {
    label: string;
    mental: number;
    physical: number;
  }
  
  export interface TrendAnalysis {
    mentalTrend: number;
    physicalTrend: number;
    currentMental: number;
    currentPhysical: number;
    period: 'weekly' | 'monthly' | 'yearly';
    mentalStatus: 'improving' | 'declining' | 'stable';
    physicalStatus: 'improving' | 'declining' | 'stable';
  }
  
  /**
   * Analyze trend data and calculate change percentages
   * Weights recent data more heavily
   */
  export const analyzeTrendData = (
    data: TrendData[],
    period: 'weekly' | 'monthly' | 'yearly'
  ): TrendAnalysis => {
    const recent = data.slice(-3);
    const earlier = data.slice(0, Math.max(3, Math.floor(data.length / 2)));
  
    const recentMentalAvg = recent.reduce((sum, d) => sum + d.mental, 0) / recent.length;
    const earlierMentalAvg = earlier.reduce((sum, d) => sum + d.mental, 0) / earlier.length;
    const recentPhysicalAvg = recent.reduce((sum, d) => sum + d.physical, 0) / recent.length;
    const earlierPhysicalAvg = earlier.reduce((sum, d) => sum + d.physical, 0) / earlier.length;
  
    const mentalChange = ((recentMentalAvg - earlierMentalAvg) / earlierMentalAvg) * 100;
    const physicalChange = ((recentPhysicalAvg - earlierPhysicalAvg) / earlierPhysicalAvg) * 100;
  
    const getMentalStatus = (change: number): 'improving' | 'declining' | 'stable' => {
      if (change > 2) return 'improving';
      if (change < -2) return 'declining';
      return 'stable';
    };
  
    const getPhysicalStatus = (change: number): 'improving' | 'declining' | 'stable' => {
      if (change > 2) return 'improving';
      if (change < -2) return 'declining';
      return 'stable';
    };
  
    return {
      mentalTrend: mentalChange,
      physicalTrend: physicalChange,
      currentMental: Math.round(recentMentalAvg),
      currentPhysical: Math.round(recentPhysicalAvg),
      period,
      mentalStatus: getMentalStatus(mentalChange),
      physicalStatus: getPhysicalStatus(physicalChange),
    };
  };
  
  /**
   * Build the prompt for Claude API with contextual information
   */
  export const buildInsightsPrompt = (
    trend: TrendAnalysis,
    weeklyActivities: Record<string, number>
  ): string => {
    const activitySummary = Object.entries(weeklyActivities)
      .map(([activity, completed]) => `- ${activity}: Completed ${completed}/7 days`)
      .join('\n');
  
    return `You are a health and wellness coach. Analyze the following health trends and provide 3-4 specific, actionable insights to help the user improve their scores.
  
  Current Status:
  - Mental Score: ${trend.currentMental}/100 (${trend.mentalTrend > 0 ? '+' : ''}${trend.mentalTrend.toFixed(1)}% change - ${trend.mentalStatus})
  - Physical Score: ${trend.currentPhysical}/100 (${trend.physicalTrend > 0 ? '+' : ''}${trend.physicalTrend.toFixed(1)}% change - ${trend.physicalStatus})
  - Analysis Period: ${trend.period}
  
  Current Weekly Tasks/Activities:
  ${activitySummary}
  
  Please provide personalized recommendations in the following JSON format:
  [
    {
      "title": "Insight title",
      "description": "Brief explanation of why this matters",
      "actionItems": ["Specific action 1", "Specific action 2", "Specific action 3"],
      "priority": "high|medium|low",
      "category": "mental|physical|both"
    }
  ]
  
  Guidelines:
  1. Prioritize the area that needs the most improvement. Think of the past data's trend and answer accordingly to get out of humps.
  2. Build on current strengths and momentum
  3. Suggest incremental, realistic changes (not drastic overhauls)
  4. Make action items specific and measurable
  5. Consider the user's current commitment level based on activity completion
  
  Return ONLY valid JSON, no markdown or extra text.`;
  };
  
  /**
   * Call Claude API to generate AI insights
   */
  export const generateAIInsights = async (
    trend: TrendAnalysis,
    weeklyActivities: Record<string, number>,
    apiKey: string
  ): Promise<Insight[]> => {
    const prompt = buildInsightsPrompt(trend, weeklyActivities);
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid API response format');
      }
  
      // Parse the JSON response
      const jsonText = data.content[0].text.trim();
      const insights: Insight[] = JSON.parse(jsonText);
  
      // Validate insights structure
      if (!Array.isArray(insights) || insights.length === 0) {
        throw new Error('Invalid insights format');
      }
  
      return insights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      throw error;
    }
  };
  
  /**
   * Fallback insights if API fails
   */
  export const getDefaultInsights = (trend: TrendAnalysis): Insight[] => {
    const insights: Insight[] = [];
  
    // Mental health insight
    if (trend.mentalStatus === 'declining') {
      insights.push({
        title: 'Boost Your Mental Wellbeing',
        description: 'Your mental health is declining. Time to prioritize mental wellness.',
        actionItems: [
          'Add 10 minutes of daily meditation or breathing exercises',
          'Schedule regular social activities (at least 2x per week)',
          'Try journaling for 5 minutes before bed',
        ],
        priority: 'high',
        category: 'mental',
      });
    } else if (trend.mentalStatus === 'stable') {
      insights.push({
        title: 'Maintain Mental Health Momentum',
        description: 'Your mental score is steady. Let\'s push it to the next level.',
        actionItems: [
          'Increase meditation time by 5 minutes',
          'Add a new mindfulness practice (yoga, tai chi, etc)',
          'Schedule one new social activity this week',
        ],
        priority: 'medium',
        category: 'mental',
      });
    } else {
      insights.push({
        title: 'Your Mental Health is Thriving',
        description: 'Great progress! Keep up the momentum with your current routine.',
        actionItems: [
          'Continue your current meditation practice',
          'Share your wellness journey with a friend',
          'Try a new stress-relief activity you\'ve been curious about',
        ],
        priority: 'low',
        category: 'mental',
      });
    }
  
    // Physical health insight
    if (trend.physicalStatus === 'declining') {
      insights.push({
        title: 'Revitalize Your Physical Health',
        description: 'Your physical fitness is declining. Time for action!',
        actionItems: [
          'Start with 15-20 minute walks, 5 days per week',
          'Add 2-3 days of strength training (bodyweight exercises)',
          'Increase your daily step count by 2,000 steps',
        ],
        priority: 'high',
        category: 'physical',
      });
    } else if (trend.physicalStatus === 'stable') {
      insights.push({
        title: 'Level Up Your Physical Routine',
        description: 'Your physical score is consistent. Time to challenge yourself.',
        actionItems: [
          'Increase workout intensity or duration by 10%',
          'Try a new physical activity (sports, dancing, hiking)',
          'Add flexibility work (yoga or stretching) 2x per week',
        ],
        priority: 'medium',
        category: 'physical',
      });
    } else {
      insights.push({
        title: 'Excellent Physical Progress',
        description: 'Your fitness is improving! Maintain this trajectory.',
        actionItems: [
          'Set a new fitness milestone (5K run, strength goal)',
          'Introduce a new sport or activity you enjoy',
          'Help someone else start their fitness journey',
        ],
        priority: 'low',
        category: 'physical',
      });
    }
  
    // Combined insight
    if (Math.abs(trend.mentalTrend - trend.physicalTrend) < 3) {
      insights.push({
        title: 'Balanced Wellness Growth',
        description: 'Your mental and physical health are aligned. Continue this holistic approach.',
        actionItems: [
          'Combine activities: outdoor yoga, hiking with friends',
          'Track both metrics together to maintain balance',
          'Celebrate this integrated improvement',
        ],
        priority: 'medium',
        category: 'both',
      });
    }
  
    return insights;
  };
  
  /**
   * Format trend data for display
   */
  export const formatTrendDisplay = (trend: TrendAnalysis): string => {
    const mentalArrow = trend.mentalTrend > 0 ? '↑' : trend.mentalTrend < 0 ? '↓' : '→';
    const physicalArrow = trend.physicalTrend > 0 ? '↑' : trend.physicalTrend < 0 ? '↓' : '→';
  
    return `Mental: ${mentalArrow} ${Math.abs(trend.mentalTrend).toFixed(1)}% | Physical: ${physicalArrow} ${Math.abs(trend.physicalTrend).toFixed(1)}%`;
  };
  
  /**
   * Mock weekly activities for development
   */
  export const getMockWeeklyActivities = (): Record<string, number> => {
    return {
      'Morning exercise': 4,
      'Meditation': 3,
      'Healthy meals': 5,
      'Adequate sleep': 6,
      'Social time': 2,
      'Focused work': 5,
    };
  };
  
  /**
   * Validate insight data structure
   */
  export const validateInsight = (insight: any): insight is Insight => {
    return (
      typeof insight === 'object' &&
      insight !== null &&
      typeof insight.title === 'string' &&
      typeof insight.description === 'string' &&
      Array.isArray(insight.actionItems) &&
      insight.actionItems.every((item: any) => typeof item === 'string') &&
      ['high', 'medium', 'low'].includes(insight.priority) &&
      ['mental', 'physical', 'both'].includes(insight.category)
    );
  };
  
  /**
   * Calculate confidence score for insights (0-100)
   */
  export const calculateConfidenceScore = (
    dataPoints: number,
    trendStability: number
  ): number => {
    // More data points = higher confidence
    const dataConfidence = Math.min((dataPoints / 30) * 100, 100);
    // Less volatile = higher confidence
    const stabilityConfidence = Math.max(100 - trendStability * 10, 20);
    
    return Math.round((dataConfidence + stabilityConfidence) / 2);
  };