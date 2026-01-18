import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Typography, Spacing, Radius, Shadows } from '@/utils/theme';

/* =========================
   Types
========================= */

interface EnhancedScoreCardProps {
  label: string;
  score: number;
  color: string;
  emoji: string;
  subtitle?: string;
}

/* =========================
   Component
========================= */

export const EnhancedScoreCard: React.FC<EnhancedScoreCardProps> = ({
  label,
  score,
  color,
  emoji,
  subtitle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  const getScoreLevel = () => {
    if (score >= 80) return { level: 'Excellent', emoji: '🌟' };
    if (score >= 60) return { level: 'Good', emoji: '✨' };
    if (score >= 40) return { level: 'Fair', emoji: '🎯' };
    return { level: 'Needs Work', emoji: '💪' };
  };

  const scoreLevel = getScoreLevel();
  const l = label;
  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.85}>
      <View style={[styles.card, { backgroundColor: color }, Shadows.lg]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.label}>{label}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>{Math.round(score)}</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  { width: `${Math.min(score, 100)}%` },
                ]}
              />
            </View>
          </View>

          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Score Level */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelEmoji}>{scoreLevel.emoji}</Text>
          <Text style={styles.levelText}>{scoreLevel.level}</Text>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.expandedContent}>
            {/* How the score works */}
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>
                📊 How This Score Is Calculated
              </Text>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>
                  The score reflects consistency, completion quality, and
                  alignment with expected behaviors in this category.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>
                  Recent actions are weighted more heavily than older ones.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>
                  Incomplete or skipped actions reduce the score gradually,
                  not instantly.
                </Text>
              </View>
            </View>

            {/* How to improve */}
            {l == "Mental Balance" ? (
              <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>
                🚀 How to Improve This Score
              </Text>

               
                <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Attempt to reduce screentime on device.
                </Text>
              </View>
              

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Avoid breaking concentration by repeated phone-pickups.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Focus on increasing blocked time periods and mental rest.
                </Text>
              </View>
            </View>
            ):
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>
                🚀 How to Improve This Score
              </Text>

               
                <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Complete more physical activity over time.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Try to be active throughout the day.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailBullet}>→</Text>
                <Text style={styles.detailText}>
                  Focus on improving slowly rather than attempting big from day 1.
                </Text>
              </View>
            </View>
            }
            

            {/* ML hint */}
            <View style={styles.actionHint}>
              <Text style={styles.actionText}>
                Personalized improvement tips will appear here as trends are
                detected over time.
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {expanded ? '▼ Hide Details' : '▶ Learn How This Score Works'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  label: {
    fontSize: Typography.sizes.h3,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: Typography.sizes.small,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  scoreSection: {
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreBar: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  emoji: {
    fontSize: 40,
    opacity: 0.15,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  levelEmoji: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  levelText: {
    fontSize: Typography.sizes.small,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  detailSection: {
    marginBottom: Spacing.lg,
  },
  detailTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  detailBullet: {
    marginRight: Spacing.sm,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  detailText: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  actionHint: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  actionText: {
    fontSize: Typography.sizes.small,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
  },
});
