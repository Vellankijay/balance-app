// app/(tabs)/journey.tsx - COMPLETE FILE
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useStore } from '@/state/store';
import { useTheme } from '@/utils/themeContext';
import { getColors, Typography, Spacing, Radius, Shadows } from '@/utils/theme';

export default function JourneyScreen() {
  const { 
    currentMentalScore, 
    currentPhysicalScore, 
    currentStreak,
    setMentalScore,
    setPhysicalScore,
  } = useStore();

  const { mode } = useTheme();
  const themeColors = getColors(mode);

  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set());
  const [animatedProgress] = useState(new Animated.Value(0));

  const totalScore = Math.round((currentMentalScore + currentPhysicalScore) / 2);
  const level = Math.floor(totalScore / 10);
  const nextLevelScore = (level + 1) * 10;
  const progressToNextLevel = ((totalScore - level * 10) / 10) * 100;

  const achievements = [
    {
      id: 1,
      emoji: '🚀',
      title: 'First Step',
      description: 'Complete your first day tracking',
      unlocked: true,
      progress: 100,
      color: '#FFE5B4',
      reward: { type: 'mental', amount: 1 },
      tier: 'bronze',
    },
    {
      id: 2,
      emoji: '🔥',
      title: 'On Fire',
      description: 'Maintain a 7-day streak',
      unlocked: currentStreak >= 7,
      progress: Math.min((currentStreak / 7) * 100, 100),
      color: '#FFD5E5',
      reward: { type: 'physical', amount: 2 },
      tier: 'silver',
    },
    {
      id: 3,
      emoji: '🏆',
      title: 'Champion',
      description: 'Reach score of 80+',
      unlocked: totalScore >= 80,
      progress: Math.min((totalScore / 80) * 100, 100),
      color: '#FFF4D5',
      reward: { type: 'mental', amount: 3 },
      tier: 'gold',
    },
    {
      id: 4,
      emoji: '⚡',
      title: 'Balanced',
      description: 'Keep mental and physical balanced',
      unlocked: Math.abs(currentMentalScore - currentPhysicalScore) < 15,
      progress: 100 - Math.min(Math.abs(currentMentalScore - currentPhysicalScore), 15) * 6.67,
      color: '#D5F4FF',
      reward: { type: 'both', amount: 2 },
      tier: 'gold',
    },
    {
      id: 5,
      emoji: '💪',
      title: 'Physical Master',
      description: 'Physical score reaches 75+',
      unlocked: currentPhysicalScore >= 75,
      progress: Math.min((currentPhysicalScore / 75) * 100, 100),
      color: '#D5FFD5',
      reward: { type: 'physical', amount: 3 },
      tier: 'gold',
    },
    {
      id: 6,
      emoji: '🧠',
      title: 'Mind Master',
      description: 'Mental score reaches 75+',
      unlocked: currentMentalScore >= 75,
      progress: Math.min((currentMentalScore / 75) * 100, 100),
      color: '#E8D5FF',
      reward: { type: 'mental', amount: 3 },
      tier: 'gold',
    },
    {
      id: 7,
      emoji: '🌟',
      title: 'Rising Star',
      description: 'Reach level 5',
      unlocked: level >= 5,
      progress: Math.min((level / 5) * 100, 100),
      color: '#FFD5FF',
      reward: { type: 'both', amount: 1 },
      tier: 'silver',
    },
    {
      id: 8,
      emoji: '🎯',
      title: 'Precision',
      description: 'Complete 50 checkpoints',
      unlocked: false,
      progress: 45,
      color: '#D5E5FF',
      reward: { type: 'mental', amount: 2 },
      tier: 'silver',
    },
    {
      id: 9,
      emoji: '💎',
      title: 'Legendary',
      description: 'Reach level 10',
      unlocked: level >= 10,
      progress: Math.min((level / 10) * 100, 100),
      color: '#E5FFD5',
      reward: { type: 'both', amount: 5 },
      tier: 'platinum',
    },
    {
      id: 10,
      emoji: '🌈',
      title: 'Perfect Week',
      description: 'Achieve perfect score for 7 days',
      unlocked: false,
      progress: 30,
      color: '#FFE5D5',
      reward: { type: 'both', amount: 3 },
      tier: 'platinum',
    },
    {
      id: 11,
      emoji: '⭐',
      title: 'Consistency King',
      description: 'Maintain 30-day streak',
      unlocked: currentStreak >= 30,
      progress: Math.min((currentStreak / 30) * 100, 100),
      color: '#D5FFFF',
      reward: { type: 'both', amount: 4 },
      tier: 'platinum',
    },
    {
      id: 12,
      emoji: '🎪',
      title: 'Weekend Warrior',
      description: 'Complete weekend challenges',
      unlocked: false,
      progress: 60,
      color: '#FFD5FF',
      reward: { type: 'physical', amount: 2 },
      tier: 'silver',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handleClaimReward = (achievement: typeof achievements[0]) => {
    if (claimedRewards.has(achievement.id)) {
      Alert.alert('Already Claimed', 'You have already claimed this reward!');
      return;
    }

    if (!achievement.unlocked) {
      Alert.alert('Locked', 'You need to unlock this achievement first!');
      return;
    }

    const newClaimedRewards = new Set(claimedRewards);
    newClaimedRewards.add(achievement.id);
    setClaimedRewards(newClaimedRewards);

    let message = '';
    if (achievement.reward.type === 'mental') {
      setMentalScore(Math.min(currentMentalScore + achievement.reward.amount, 100));
      message = `+${achievement.reward.amount} Mental Points! 🧠`;
    } else if (achievement.reward.type === 'physical') {
      setPhysicalScore(Math.min(currentPhysicalScore + achievement.reward.amount, 100));
      message = `+${achievement.reward.amount} Physical Points! 💪`;
    } else {
      setMentalScore(Math.min(currentMentalScore + achievement.reward.amount, 100));
      setPhysicalScore(Math.min(currentPhysicalScore + achievement.reward.amount, 100));
      message = `+${achievement.reward.amount} Mental & Physical Points! ⚡`;
    }

    Alert.alert('🎉 Reward Claimed!', message);
  };

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progressToNextLevel,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressToNextLevel]);

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

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
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text.primary }]}>🎮 Your Journey</Text>
          <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>Level up your wellness</Text>
        </View>

        <View style={[styles.levelCard, Shadows.lg]}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LVL {level}</Text>
          </View>
          
          <View style={styles.levelContent}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Current Level</Text>
              <Text style={styles.levelNumber}>{level}</Text>
              <Text style={styles.levelMotto}>
                {level < 3 ? '🌱 Sprout' : level < 6 ? '🌿 Growing' : level < 9 ? '🌳 Flourishing' : '👑 Master'}
              </Text>
            </View>
            <View style={styles.levelVisualization}>
              <Text style={styles.levelEmoji}>⭐</Text>
            </View>
          </View>

          <View style={styles.levelProgress}>
            <View style={styles.levelProgressLabel}>
              <Text style={styles.levelProgressText}>Progress to Level {level + 1}</Text>
              <Text style={styles.levelProgressScore}>
                {totalScore} / {nextLevelScore}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  { width: progressWidth }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>{Math.round(progressToNextLevel)}%</Text>
          </View>

          <View style={styles.xpMilestones}>
            {[0, 25, 50, 75, 100].map((milestone) => (
              <View
                key={milestone}
                style={[
                  styles.milestone,
                  progressToNextLevel >= milestone && styles.milestoneActive,
                ]}
              >
                <Text style={styles.milestoneText}>{milestone}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.streakCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <View style={styles.streakTop}>
            <View>
              <Text style={[styles.streakLabel, { color: themeColors.text.secondary }]}>Current Streak</Text>
              <View style={styles.streakContent}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={[styles.streakNumber, { color: themeColors.text.primary }]}>{currentStreak}</Text>
              </View>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: '#FFE5B4' }]}>
              <Text style={styles.streakBadgeText}>
                {currentStreak >= 30 ? '🏅' : currentStreak >= 7 ? '⭐' : '✨'}
              </Text>
            </View>
          </View>
          <Text style={[styles.streakMessage, { color: themeColors.text.secondary }]}>
            {currentStreak >= 30
              ? '🎖️ Legendary consistency!'
              : currentStreak >= 7
              ? '⚡ Fantastic momentum!'
              : '💪 Great start!'}
          </Text>
        </View>

        <View style={[styles.statsCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <View style={styles.statRow}>
            <View style={[styles.statBox, { backgroundColor: '#E8D5FF' }]}>
              <Text style={styles.statEmoji}>🧠</Text>
              <Text style={[styles.statValue, { color: themeColors.text.tertiary }]}>{Math.round(currentMentalScore)}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Mental</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#D5F4FF' }]}>
              <Text style={styles.statEmoji}>💪</Text>
              <Text style={[styles.statValue, { color: themeColors.text.tertiary }]}>{Math.round(currentPhysicalScore)}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Physical</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#D5FFD5' }]}>
              <Text style={styles.statEmoji}>📊</Text>
              <Text style={[styles.statValue, { color: themeColors.text.tertiary }]}>{totalScore}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text.secondary }]}>Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <Text style={[styles.achievementsTitle, { color: themeColors.text.primary }]}>🏆 Achievements</Text>
            <View style={[styles.achievementStats, { backgroundColor: themeColors.primary.mental }]}>
              <Text style={styles.achievementsCount}>{unlockedCount}/{achievements.length}</Text>
            </View>
          </View>

          {achievements.some(a => a.tier === 'platinum') && (
            <View style={styles.tierSection}>
              <Text style={[styles.tierLabel, { color: themeColors.text.secondary }]}>💎 Platinum Tier</Text>
              <View style={styles.achievementsGrid}>
                {achievements.filter(a => a.tier === 'platinum').map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    expanded={expandedAchievement === achievement.id}
                    onPress={() =>
                      setExpandedAchievement(
                        expandedAchievement === achievement.id ? null : achievement.id
                      )
                    }
                    onClaim={() => handleClaimReward(achievement)}
                    isClaimed={claimedRewards.has(achievement.id)}
                    themeColors={themeColors}
                    mode={mode}
                  />
                ))}
              </View>
            </View>
          )}

          {achievements.some(a => a.tier === 'gold') && (
            <View style={styles.tierSection}>
              <Text style={[styles.tierLabel, { color: themeColors.text.secondary }]}>🥇 Gold Tier</Text>
              <View style={styles.achievementsGrid}>
                {achievements.filter(a => a.tier === 'gold').map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    expanded={expandedAchievement === achievement.id}
                    onPress={() =>
                      setExpandedAchievement(
                        expandedAchievement === achievement.id ? null : achievement.id
                      )
                    }
                    onClaim={() => handleClaimReward(achievement)}
                    isClaimed={claimedRewards.has(achievement.id)}
                    themeColors={themeColors}
                    mode={mode}
                  />
                ))}
              </View>
            </View>
          )}

          {achievements.some(a => a.tier === 'silver' || a.tier === 'bronze') && (
            <View style={styles.tierSection}>
              <Text style={[styles.tierLabel, { color: themeColors.text.secondary }]}>🥈 Silver & Bronze</Text>
              <View style={styles.achievementsGrid}>
                {achievements.filter(a => a.tier === 'silver' || a.tier === 'bronze').map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    expanded={expandedAchievement === achievement.id}
                    onPress={() =>
                      setExpandedAchievement(
                        expandedAchievement === achievement.id ? null : achievement.id
                      )
                    }
                    onClaim={() => handleClaimReward(achievement)}
                    isClaimed={claimedRewards.has(achievement.id)}
                    themeColors={themeColors}
                    mode={mode}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={[styles.milestonesCard, Shadows.md, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.milestonesTitle, { color: themeColors.text.primary }]}>🎯 Next Milestones</Text>

          <View style={[styles.milestoneItem, { borderBottomColor: themeColors.border }]}>
            <View style={[styles.milestoneIcon, { backgroundColor: '#FFE5B4' }]}>
              <Text style={styles.milestoneEmoji}>📈</Text>
            </View>
            <View style={styles.milestoneContent}>
              <Text style={[styles.milestoneHeading, { color: themeColors.text.primary }]}>Level {level + 1}</Text>
              <Text style={[styles.milestoneText, { color: themeColors.text.secondary }]}>{Math.max(0, nextLevelScore - totalScore)} XP needed</Text>
            </View>
          </View>

          <View style={[styles.milestoneItem, { borderBottomColor: themeColors.border }]}>
            <View style={[styles.milestoneIcon, { backgroundColor: '#FFD5E5' }]}>
              <Text style={styles.milestoneEmoji}>🔥</Text>
            </View>
            <View style={styles.milestoneContent}>
              <Text style={[styles.milestoneHeading, { color: themeColors.text.primary }]}>{Math.max(7, 10 + Math.ceil(currentStreak / 10) * 10)}-Day Streak</Text>
              <Text style={[styles.milestoneText, { color: themeColors.text.secondary }]}>{Math.max(0, Math.max(7, 10 + Math.ceil(currentStreak / 10) * 10) - currentStreak)} days to go</Text>
            </View>
          </View>

          <View style={styles.milestoneItem}>
            <View style={[styles.milestoneIcon, { backgroundColor: '#D5F4FF' }]}>
              <Text style={styles.milestoneEmoji}>👑</Text>
            </View>
            <View style={styles.milestoneContent}>
              <Text style={[styles.milestoneHeading, { color: themeColors.text.primary }]}>Unlock All Achievements</Text>
              <Text style={[styles.milestoneText, { color: themeColors.text.secondary }]}>{achievements.length - unlockedCount} remaining</Text>
            </View>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AchievementCard({ achievement, expanded, onPress, onClaim, isClaimed, themeColors, mode }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        !achievement.unlocked && styles.achievementCardLocked,
        Shadows.sm,
        { backgroundColor: themeColors.surface }
      ]}
      onPress={onPress}
    >
      <View style={[styles.achievementEmoji, { backgroundColor: achievement.color }]}>
        <Text style={styles.emoji}>{achievement.emoji}</Text>
        {isClaimed && <View style={styles.claimedBadge} />}
      </View>
      <Text style={[styles.achievementTitle, { color: themeColors.text.primary }]}>{achievement.title}</Text>

      {expanded && (
        <View style={[styles.achievementExpanded, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.achievementDescription, { color: themeColors.text.secondary }]}>
            {achievement.description}
          </Text>
          
          <View style={[styles.achievementProgressBar, { backgroundColor: themeColors.border }]}>
            <View
              style={[
                styles.achievementProgressFill,
                { width: `${achievement.progress}%`, backgroundColor: achievement.color },
              ]}
            />
          </View>
          <Text style={[styles.achievementProgressText, { color: themeColors.text.tertiary }]}>
            {Math.round(achievement.progress)}% complete
          </Text>

          {achievement.unlocked && (
            <View style={[styles.rewardBadge, { backgroundColor: mode === 'light' ? '#FFF4D5' : '#3A3A2E' }]}>
              <Text style={[styles.rewardText, { color: mode === 'light' ? '#F59E0B' : '#FCD34D' }]}>
                {achievement.reward.type === 'mental'
                  ? `+${achievement.reward.amount} 🧠`
                  : achievement.reward.type === 'physical'
                  ? `+${achievement.reward.amount} 💪`
                  : `+${achievement.reward.amount} ⚡`}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.claimButton,
              (!achievement.unlocked || isClaimed) && styles.claimButtonDisabled,
              { backgroundColor: (!achievement.unlocked || isClaimed) ? themeColors.border : themeColors.primary.mental }
            ]}
            onPress={onClaim}
            disabled={!achievement.unlocked || isClaimed}
          >
            <Text style={styles.claimButtonText}>
              {isClaimed ? '✓ Claimed' : 'Claim Reward'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: { marginBottom: Spacing.lg },
  title: { fontSize: Typography.sizes.h2, fontWeight: 'bold' },
  subtitle: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  levelCard: {
    backgroundColor: '#667EEA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  levelBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: Typography.sizes.small },
  levelContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  levelInfo: { flex: 1 },
  levelLabel: { fontSize: Typography.sizes.small, color: 'rgba(255, 255, 255, 0.8)' },
  levelNumber: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginTop: Spacing.xs },
  levelMotto: { fontSize: Typography.sizes.small, color: 'rgba(255, 255, 255, 0.9)', marginTop: Spacing.xs },
  levelVisualization: { alignItems: 'center', justifyContent: 'center' },
  levelEmoji: { fontSize: 60, opacity: 0.3 },
  levelProgress: { paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)' },
  levelProgressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  levelProgressText: { fontSize: Typography.sizes.small, color: 'rgba(255, 255, 255, 0.9)' },
  levelProgressScore: { fontSize: Typography.sizes.small, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  progressBar: { height: 12, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: Radius.full, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: Radius.full },
  progressPercentage: { color: 'rgba(255, 255, 255, 0.9)', marginTop: Spacing.xs, textAlign: 'right', fontWeight: 'bold' },
  xpMilestones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)' },
  milestone: { alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs, borderRadius: Radius.md, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  milestoneActive: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  milestoneText: { color: '#fff', fontSize: Typography.sizes.xs, fontWeight: '600' },
  streakCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  streakLabel: { fontSize: Typography.sizes.small },
  streakContent: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  streakEmoji: { fontSize: 40, marginRight: Spacing.sm },
  streakNumber: { fontSize: 36, fontWeight: 'bold' },
  streakBadge: { padding: Spacing.md, borderRadius: Radius.lg },
  streakBadgeText: { fontSize: 24 },
  streakMessage: { fontSize: Typography.sizes.small, marginTop: Spacing.md },
  statsCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  statBox: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center' },
  statEmoji: { fontSize: 32 },
  statValue: { fontSize: Typography.sizes.h2, fontWeight: 'bold', marginTop: Spacing.xs },
  statLabel: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  achievementsSection: { marginBottom: Spacing.lg },
  achievementsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  achievementsTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold' },
  achievementStats: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  achievementsCount: { fontSize: Typography.sizes.body, fontWeight: '600', color: '#fff' },
  tierSection: { marginBottom: Spacing.lg },
  tierLabel: { fontSize: Typography.sizes.body, fontWeight: '600', marginBottom: Spacing.md },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.md },
  achievementCard: { width: '31%', borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: Spacing.sm },
  achievementCardLocked: { opacity: 0.5 },
  achievementEmoji: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  emoji: { fontSize: 28 },
  claimedBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  achievementTitle: { fontSize: Typography.sizes.small, fontWeight: '600', textAlign: 'center' },
  achievementExpanded: { width: '100%', paddingTop: Spacing.md, borderTopWidth: 1, gap: Spacing.sm },
  achievementDescription: { fontSize: Typography.sizes.xs, textAlign: 'center' },
  achievementProgressBar: { height: 4, borderRadius: Radius.full, overflow: 'hidden' },
  achievementProgressFill: { height: '100%', borderRadius: Radius.full },
  achievementProgressText: { fontSize: Typography.sizes.xs, textAlign: 'center' },
  rewardBadge: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radius.full, marginVertical: Spacing.sm },
  rewardText: { fontSize: Typography.sizes.small, fontWeight: '600', textAlign: 'center' },
  claimButton: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, marginTop: Spacing.sm },
  claimButtonDisabled: {},
  claimButtonText: { color: '#fff', fontWeight: '600', fontSize: Typography.sizes.small, textAlign: 'center' },
  milestonesCard: { borderRadius: Radius.lg, padding: Spacing.lg },
  milestonesTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.lg },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  milestoneIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  milestoneEmoji: { fontSize: 22 },
  milestoneContent: { flex: 1 },
  milestoneHeading: { fontSize: Typography.sizes.body, fontWeight: '600' },
  milestoneText: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
});