// app/(tabs)/trends.tsx - SIMPLIFIED VERSION using helpers

import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useStore } from '@/state/store';
import { useTheme } from '@/utils/themeContext';
import { getColors, Typography, Spacing, Radius, Shadows } from '@/utils/theme';
import { LineChart } from 'react-native-chart-kit';
import {
  analyzeTrendData,
  generateAIInsights,
  getDefaultInsights,
  getMockWeeklyActivities,
  Insight,
  TrendData,
  TrendAnalysis,
} from '@/utils/insightsHelper';

const { width } = Dimensions.get('window');
const chartHeight = 200;

export default function TrendsScreen() {
  const { currentMentalScore, currentPhysicalScore } = useStore();
  const { mode } = useTheme();
  const themeColors = getColors(mode);

  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [aiInsights, setAiInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Weekly Mock Data
  const weeklyData = useMemo(() => [
    { label: 'Mon', mental: 72, physical: 60 },
    { label: 'Tue', mental: 75, physical: 62 },
    { label: 'Wed', mental: 78, physical: 65 },
    { label: 'Thu', mental: 76, physical: 63 },
    { label: 'Fri', mental: 80, physical: 68 },
    { label: 'Sat', mental: 82, physical: 70 },
    { label: 'Sun', mental: Math.round(currentMentalScore), physical: Math.round(currentPhysicalScore) },
  ], [currentMentalScore, currentPhysicalScore]);

  const generateMonthlyData = (): TrendData[] => {
    const data: TrendData[] = [];
    let lastMental = 78;
    let lastPhysical = 65;
    for (let i = 1; i <= 30; i++) {
      lastMental = Math.min(100, Math.max(50, lastMental + (Math.random() * 4 - 2)));
      lastPhysical = Math.min(100, Math.max(50, lastPhysical + (Math.random() * 4 - 2)));
      data.push({ label: `Day ${i}`, mental: Math.round(lastMental), physical: Math.round(lastPhysical) });
    }
    return data;
  };

  const generateYearlyData = (): TrendData[] => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data: TrendData[] = [];
    let lastMental = 78;
    let lastPhysical = 65;
    for (let i = 0; i < 12; i++) {
      lastMental = Math.min(100, Math.max(50, lastMental + (Math.random() * 6 - 3)));
      lastPhysical = Math.min(100, Math.max(50, lastPhysical + (Math.random() * 6 - 3)));
      data.push({ label: months[i], mental: Math.round(lastMental), physical: Math.round(lastPhysical) });
    }
    return data;
  };

  // Select Data Based on Period
  const chartData = useMemo(() => {
    if (selectedPeriod === 'weekly') return weeklyData;
    if (selectedPeriod === 'monthly') return generateMonthlyData();
    return generateYearlyData();
  }, [selectedPeriod, weeklyData]);

  // Analyze trends using helper
  const trendAnalysis = useMemo(() => {
    return analyzeTrendData(chartData, selectedPeriod);
  }, [chartData, selectedPeriod]);

  // Generate AI Insights
  const generateInsights = async () => {
    setLoadingInsights(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('Anthropic API key not configured');
      }

      const weeklyActivities = getMockWeeklyActivities();
      const insights = await generateAIInsights(trendAnalysis, weeklyActivities, apiKey);
      
      setAiInsights(insights);
      setShowInsightModal(true);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback to default insights
      const defaultInsights = getDefaultInsights(trendAnalysis);
      setAiInsights(defaultInsights);
      setShowInsightModal(true);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Prepare data for react-native-chart-kit
  const lineChartData = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        data: chartData.map(d => d.mental),
        color: () => themeColors.primary.mental,
        strokeWidth: 2,
      },
      {
        data: chartData.map(d => d.physical),
        color: () => themeColors.primary.physical,
        strokeWidth: 2,
      },
    ],
    legend: ['Mental', 'Physical'],
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar 
        barStyle={mode === 'light' ? 'dark-content' : 'light-content'} 
        backgroundColor={themeColors.background} 
      />
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text.primary }]}>📈 Trends & Analytics</Text>
          <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>Your progress over time</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['weekly', 'monthly', 'yearly'].map(period => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period as any)}
              style={[
                styles.periodButton,
                selectedPeriod === period && [styles.periodButtonActive, { backgroundColor: themeColors.primary.mental }],
                { borderColor: selectedPeriod === period ? themeColors.primary.mental : themeColors.border }
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                  selectedPeriod !== period && { color: themeColors.text.secondary }
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: themeColors.primary.mental }, Shadows.md]}>
            <Text style={styles.summaryLabel}>Mental</Text>
            <Text style={styles.summaryValue}>{trendAnalysis.currentMental}</Text>
            <Text style={styles.summaryChange}>
              {trendAnalysis.mentalTrend > 0 ? '↑' : '↓'} {Math.abs(trendAnalysis.mentalTrend).toFixed(1)}% from period start
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: themeColors.primary.physical }, Shadows.md]}>
            <Text style={styles.summaryLabel}>Physical</Text>
            <Text style={styles.summaryValue}>{trendAnalysis.currentPhysical}</Text>
            <Text style={styles.summaryChange}>
              {trendAnalysis.physicalTrend > 0 ? '↑' : '↓'} {Math.abs(trendAnalysis.physicalTrend).toFixed(1)}% from period start
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={[styles.chartCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.chartTitle, { color: themeColors.text.primary }]}>
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Breakdown
          </Text>

          <LineChart
            data={lineChartData}
            width={width - Spacing.lg * 2}
            height={chartHeight}
            chartConfig={{
              backgroundColor: themeColors.surface,
              backgroundGradientFrom: themeColors.surface,
              backgroundGradientTo: themeColors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => themeColors.text.secondary,
              propsForDots: { r: '4', strokeWidth: '1', stroke: '#fff' },
              propsForBackgroundLines: { strokeDasharray: '' },
            }}
            bezier
            style={{ borderRadius: Radius.lg }}
          />

          {/* AI Insights Button */}
          <TouchableOpacity
            style={[styles.insightButton, { backgroundColor: themeColors.primary.mental }]}
            onPress={generateInsights}
            disabled={loadingInsights}
          >
            {loadingInsights ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.insightButtonIcon}>✨</Text>
                <Text style={styles.insightButtonText}>Get AI Insights</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats & Insights */}
        <View style={[styles.statsCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.statsTitle, { color: themeColors.text.primary }]}>📊 Statistics</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Average Score</Text>
              <Text style={[styles.statNumber, { color: themeColors.text.primary }]}>73</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Best Day</Text>
              <Text style={[styles.statNumber, { color: themeColors.text.primary }]}>Saturday</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Consistency</Text>
              <Text style={[styles.statNumber, { color: themeColors.text.primary }]}>87%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.insightCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.insightTitle, { color: themeColors.text.primary }]}>💡 Key Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🚀</Text>
            <View style={styles.insightContent}>
              <Text style={[styles.insightHeading, { color: themeColors.text.primary }]}>Strong Progress</Text>
              <Text style={[styles.insightText, { color: themeColors.text.secondary }]}>You're trending up! Keep your current routine.</Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>⚖️</Text>
            <View style={styles.insightContent}>
              <Text style={[styles.insightHeading, { color: themeColors.text.primary }]}>Balanced Week</Text>
              <Text style={[styles.insightText, { color: themeColors.text.secondary }]}>Mental and physical scores are aligned well.</Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>📅</Text>
            <View style={styles.insightContent}>
              <Text style={[styles.insightHeading, { color: themeColors.text.primary }]}>Weekend Peak</Text>
              <Text style={[styles.insightText, { color: themeColors.text.secondary }]}>Your scores peak on weekends. Maintain weekday habits!</Text>
            </View>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* AI Insights Modal */}
      <Modal
        visible={showInsightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInsightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, Shadows.lg, { backgroundColor: themeColors.surface }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text.primary }]}>✨ AI-Powered Recommendations</Text>
              <TouchableOpacity onPress={() => setShowInsightModal(false)}>
                <Text style={[styles.modalCloseButton, { color: themeColors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Insights List */}
            <FlatList
              data={aiInsights}
              scrollEnabled={true}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <InsightCard insight={item} themeColors={themeColors} />
              )}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColors.primary.mental }]}
              onPress={() => setShowInsightModal(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Insight Card Component
const InsightCard = ({ insight, themeColors }: { insight: Insight; themeColors: any }) => {
  const categoryColors: Record<string, string> = {
    mental: themeColors.primary.mental,
    physical: themeColors.primary.physical,
    both: '#FFD93D',
  };

  const priorityColors: Record<string, string> = {
    high: '#FF6B6B',
    medium: '#FFA500',
    low: '#4CAF50',
  };

  return (
    <View style={[styles.insightCardModal, { backgroundColor: themeColors.background, borderLeftColor: themeColors.primary.mental }]}>
      <View style={styles.insightHeaderModal}>
        <Text style={[styles.insightTitleModal, { color: themeColors.text.primary }]}>{insight.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: priorityColors[insight.priority] },
          ]}
        >
          <Text style={styles.priorityText}>{insight.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={[styles.insightDescriptionModal, { color: themeColors.text.secondary }]}>{insight.description}</Text>

      <View style={styles.actionItemsContainer}>
        <Text style={[styles.actionItemsTitle, { color: themeColors.text.primary }]}>Action Items:</Text>
        {insight.actionItems.map((action, idx) => (
          <View key={idx} style={styles.actionItem}>
            <Text style={[styles.actionItemBullet, { color: themeColors.primary.mental }]}>•</Text>
            <Text style={[styles.actionItemText, { color: themeColors.text.secondary }]}>{action}</Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.categoryTag,
          { backgroundColor: categoryColors[insight.category] },
        ]}
      >
        <Text style={styles.categoryTagText}>{insight.category.toUpperCase()}</Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.lg },
  title: { fontSize: Typography.sizes.h2, fontWeight: 'bold' },
  subtitle: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  periodSelector: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  periodButton: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, borderWidth: 2 },
  periodButtonActive: {},
  periodButtonText: { fontSize: Typography.sizes.small, fontWeight: '600', textAlign: 'center' },
  periodButtonTextActive: { color: '#FFFFFF' },
  summaryRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  summaryCard: { flex: 1, borderRadius: Radius.lg, padding: Spacing.lg, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { fontSize: Typography.sizes.small, color: 'rgba(255,255,255,0.8)' },
  summaryValue: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginVertical: Spacing.xs },
  summaryChange: { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.9)' },
  chartCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  chartTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.lg },
  insightButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: '#7C83FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  insightButtonText: { fontSize: Typography.sizes.body, fontWeight: '600', color: '#FFFFFF' },
  insightButtonIcon: { fontSize: 18 },
  statsCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  statsTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.lg },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: Typography.sizes.small },
  statNumber: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginTop: Spacing.xs },
  insightCard: { borderRadius: Radius.lg, padding: Spacing.lg },
  insightTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.lg },
  insightItem: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  insightEmoji: { fontSize: 24, width: 30 },
  insightContent: { flex: 1 },
  insightHeading: { fontSize: Typography.sizes.body, fontWeight: '600' },
  insightText: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold' },
  modalCloseButton: { fontSize: 24, fontWeight: 'bold' },
  insightCardModal: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
  },
  insightHeaderModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  insightTitleModal: { fontSize: Typography.sizes.h3, fontWeight: '700', flex: 1 },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    marginLeft: Spacing.sm,
  },
  priorityText: { fontSize: Typography.sizes.xs, fontWeight: 'bold', color: '#FFFFFF' },
  insightDescriptionModal: { fontSize: Typography.sizes.small, marginBottom: Spacing.md },
  actionItemsContainer: { marginBottom: Spacing.md },
  actionItemsTitle: { fontSize: Typography.sizes.small, fontWeight: '600', marginBottom: Spacing.sm },
  actionItem: { flexDirection: 'row', marginBottom: Spacing.sm, alignItems: 'flex-start' },
  actionItemBullet: { fontSize: Typography.sizes.body, marginRight: Spacing.sm, fontWeight: 'bold' },
  actionItemText: { fontSize: Typography.sizes.small, flex: 1 },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  categoryTagText: { fontSize: Typography.sizes.xs, fontWeight: 'bold', color: '#FFFFFF' },
  closeButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  closeButtonText: { fontSize: Typography.sizes.body, fontWeight: 'bold', color: '#FFFFFF' },
});