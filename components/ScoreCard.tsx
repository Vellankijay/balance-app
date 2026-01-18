// components/ScoreCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/utils/theme';

interface ScoreCardProps {
  label: string;
  score: number;
  gradientColors: string[];
  icon?: React.ReactNode;
  subtitle?: string;
}

const CircularProgress = ({ score, gradientColors }: { score: number; gradientColors: string[] }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.scoreDisplay}>
        <Text style={styles.scoreText}>{Math.round(score)}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${score}%`,
              backgroundColor: gradientColors[0]
            }
          ]} 
        />
      </View>
    </View>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({
  label,
  score,
  gradientColors,
  subtitle,
}) => {
  return (
    <View style={[styles.card, Shadows.md]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>{label}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <CircularProgress score={score} gradientColors={gradientColors} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {score > 75 ? '✨ Great balance' : score > 50 ? '🎯 Keep it up' : '💪 Room to improve'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.h3,
    fontFamily: 'System',
    fontWeight: '600',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.sizes.small,
    fontFamily: 'System',
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  scoreDisplay: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scoreText: {
    fontSize: Typography.sizes.h1,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    fontSize: Typography.sizes.small,
    fontFamily: 'System',
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
});