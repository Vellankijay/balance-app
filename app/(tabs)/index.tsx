// ============================================
// FILE: app/(tabs)/index.tsx - COMPLETE
// Replace your entire index.tsx with this
// ============================================

import React, { useState } from 'react';
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
  TextInput,
  Alert,
} from 'react-native';
import { useStore } from '@/state/store';
import { useTheme } from '@/utils/themeContext';
import { getColors, Typography, Spacing, Radius, Shadows } from '@/utils/theme';
import { EnhancedScoreCard } from '@/components/EnhancedScoreCard';
import { ActionModal } from '@/components/ActionModal';
import { formatDate } from '@/utils/time';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface ActionItem {
  id: string;
  emoji: string;
  title: string;
  color: string;
  description: string;
  tasks: Task[];
  tips: string[];
}

const toTasks = (lines: string[]): Task[] =>
  lines.map((text, idx) => ({
    id: `${Date.now()}-${idx}`,
    text,
    completed: false,
  }));

const DEFAULT_ACTIONS: ActionItem[] = [
  {
    id: 'daily-goal',
    emoji: '🎯',
    title: 'Daily Goal',
    color: '#FFE5B4',
    description: "Set and track your daily wellness goals.",
    tasks: toTasks([
      'Physical activity goals (30+ minutes)',
      'Mental wellness practices (meditation, journaling)',
      'Sleep schedule consistency',
      'Nutrition and hydration targets',
    ]),
    tips: [
      'Start with one realistic goal per day',
      'Break larger goals into smaller tasks',
      'Track completion throughout the day',
      'Celebrate small wins',
    ],
  },
  {
    id: 'mindfulness',
    emoji: '📚',
    title: 'Mindfulness',
    color: '#E8D5FF',
    description: 'Practice mindfulness through meditation, breathing exercises, and mental clarity techniques.',
    tasks: toTasks([
      'Guided meditation sessions (5-20 minutes)',
      'Breathing exercises for calm',
      'Journaling for self-reflection',
      'Mindful movement and yoga',
    ]),
    tips: [
      'Start with just 5 minutes per day',
      'Find a quiet space',
      'Use guided apps or videos',
      'Practice at the same time daily',
    ],
  },
  {
    id: 'activity',
    emoji: '🏃',
    title: 'Activity',
    color: '#D5F4FF',
    description: 'Track your physical activity and movement throughout the day.',
    tasks: toTasks([
      'Cardio exercises',
      'Strength training',
      'Flexibility routines',
      'Daily movement and walking',
    ]),
    tips: [
      'Aim for 150 minutes per week',
      'Mix cardio with strength',
      'Choose activities you enjoy',
      'Build gradually',
    ],
  },
  {
    id: 'sleep',
    emoji: '😴',
    title: 'Sleep Track',
    color: '#D5FFD5',
    description: 'Monitor your sleep quality and duration.',
    tasks: toTasks([
      'Track sleep hours',
      'Sleep quality check',
      'Consistent bedtime',
      'Optimize sleep environment',
    ]),
    tips: [
      'Keep a consistent schedule',
      'Avoid screens before bed',
      'Cool, dark bedroom',
      'Limit caffeine',
    ],
  },
];

const BAD_DAY_ACTIONS: ActionItem[] = [
  {
    id: 'minimal-mindfulness',
    emoji: '🧘',
    title: 'Self-Care',
    color: '#E8D5FF',
    description: 'Simple self-care practices',
    tasks: toTasks(['Drink water', 'Take a break', 'Rest as needed']),
    tips: ['Be kind to yourself', 'Rest is productive', 'This will pass'],
  },
  {
    id: 'minimal-activity',
    emoji: '🚶',
    title: 'Movement',
    color: '#D5F4FF',
    description: 'Light movement only',
    tasks: toTasks(['Gentle walk (10 minutes)', 'Stretching']),
    tips: ['Go at your own pace', 'Slow and steady'],
  },
];

const COLOR_OPTIONS = [
  '#FFE5B4', '#E8D5FF', '#D5F4FF', '#D5FFD5',
  '#FFD5E5', '#FFF4D5', '#D5E5FF', '#E5FFD5',
];

export default function HomeScreen() {
  const { 
    currentMentalScore, 
    currentPhysicalScore, 
    currentStreak,
    isBadDayMode,
    toggleBadDayMode,
  } = useStore();

  const { mode } = useTheme();
  const themeColors = getColors(mode);

  const [time, setTime] = useState(new Date());
  const [actions, setActions] = useState<ActionItem[]>(DEFAULT_ACTIONS);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formEmoji, setFormEmoji] = useState('🎯');
  const [formTitle, setFormTitle] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formTasks, setFormTasks] = useState('');
  const [formTips, setFormTips] = useState('');

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateAction = (updatedAction: ActionItem) => {
    setActions(prev =>
      prev.map(a => (a.id === updatedAction.id ? updatedAction : a))
    );
    setSelectedAction(updatedAction);
  };

  const openAddModal = () => {
    setEditingAction(null);
    setFormEmoji('🎯');
    setFormTitle('');
    setFormColor(COLOR_OPTIONS[0]);
    setFormDescription('');
    setFormTasks('');
    setFormTips('');
    setEditModalVisible(true);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getTimeBasedGreeting();

  const openEditModal = (action: ActionItem) => {
    setEditingAction(action);
    setFormEmoji(action.emoji);
    setFormTitle(action.title);
    setFormColor(action.color);
    setFormDescription(action.description);
    setFormTasks(action.tasks.map(t => t.text).join('\n'));
    setFormTips(action.tips.join('\n'));
    setEditModalVisible(true);
  };

  const handleSaveAction = () => {
    if (!formTitle.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const updatedAction: ActionItem = {
      id: editingAction?.id || `action-${Date.now()}`,
      emoji: formEmoji,
      title: formTitle.trim(),
      color: formColor,
      description: formDescription.trim() || 'No description provided',
      tasks: toTasks(
        formTasks.split('\n').map(t => t.trim()).filter(Boolean)
      ),
      tips: formTips.split('\n').map(t => t.trim()).filter(Boolean),
    };

    setActions(prev =>
      editingAction
        ? prev.map(a => (a.id === editingAction.id ? updatedAction : a))
        : [...prev, updatedAction]
    );

    setEditModalVisible(false);
  };

  const handleDeleteAction = (id: string) => {
    Alert.alert('Delete Action', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setActions(prev => prev.filter(a => a.id !== id));
          setSelectedAction(null);
        },
      },
    ]);
  };

  const totalScore = Math.round((currentMentalScore + currentPhysicalScore) / 2);
  const displayActions = isBadDayMode ? BAD_DAY_ACTIONS : actions;

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
          <View>
            <Text style={[styles.greeting, { color: themeColors.text.primary }]}>
              {greeting}, Jay
            </Text>
            <Text style={[styles.date, { color: themeColors.text.secondary }]}>
              {formatDate(time)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.badDayButton,
              isBadDayMode && styles.badDayButtonActive,
              Shadows.md,
              { backgroundColor: isBadDayMode ? '#4A5568' : themeColors.surface }
            ]}
            onPress={() => toggleBadDayMode()}
          >
            <Text style={[styles.badDayButtonText, { color: isBadDayMode ? '#fff' : themeColors.text.primary }]}>
              {isBadDayMode ? '💙 I\'m OK' : '💔 Bad Day'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.streakContainer, { opacity: isBadDayMode ? 0.6 : 1 }]}>
          <View style={[styles.streakBadge, Shadows.md, { backgroundColor: themeColors.surface }]}>
            <Text style={{ color: themeColors.text.primary }}>🔥 {currentStreak}</Text>
          </View>
          {isBadDayMode && (
            <Text style={[styles.streakNote, { color: themeColors.text.secondary }]}>
              Streak frozen for today
            </Text>
          )}
        </View>

        {isBadDayMode ? (
          <View>
            <Text style={[styles.badDayTitle, { color: themeColors.text.primary }]}>
              Remember: You're doing your best 💙
            </Text>

            <View style={[styles.minimizedScoresSection, { backgroundColor: mode === 'light' ? '#f5f5f5' : '#374151' }]}>
              <View style={styles.minimizedScoreCard}>
                <Text style={[styles.minimizedScoreLabel, { color: themeColors.text.secondary }]}>Mental</Text>
                <Text style={[styles.minimizedScoreValue, { color: themeColors.primary.mental }]}>
                  {currentMentalScore}
                </Text>
              </View>
              <View style={styles.minimizedScoreDivider} />
              <View style={styles.minimizedScoreCard}>
                <Text style={[styles.minimizedScoreLabel, { color: themeColors.text.secondary }]}>Physical</Text>
                <Text style={[styles.minimizedScoreValue, { color: themeColors.primary.physical }]}>
                  {currentPhysicalScore}
                </Text>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={[styles.actionsTitle, { color: themeColors.text.primary }]}>Light Check-ins</Text>
              <View style={styles.actionsGrid}>
                {displayActions.map(action => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.actionCard, { backgroundColor: action.color }]}
                    onPress={() => setSelectedAction(action)}
                  >
                    <Text style={styles.actionEmoji}>{action.emoji}</Text>
                    <Text style={styles.actionLabel}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.scoresSection}>
              <EnhancedScoreCard
                label="Mental Balance"
                score={currentMentalScore}
                color={themeColors.primary.mental}
                emoji="🧠"
              />
              <EnhancedScoreCard
                label="Physical Balance"
                score={currentPhysicalScore}
                color={themeColors.primary.physical}
                emoji="💪"
              />
            </View>

            <View style={styles.actionsSection}>
              <View style={styles.actionsHeader}>
                <Text style={[styles.actionsTitle, { color: themeColors.text.primary }]}>Quick Actions</Text>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: themeColors.primary.mental }]}
                  onPress={() => setIsEditMode(!isEditMode)}
                >
                  <Text style={styles.editButtonText}>
                    {isEditMode ? '✓ Done' : '✏️ Edit'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionsGrid}>
                {displayActions.map(action => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.actionCard, { backgroundColor: action.color }]}
                    onPress={() => !isEditMode && setSelectedAction(action)}
                    onLongPress={() => isEditMode && openEditModal(action)}
                  >
                    {isEditMode && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAction(action.id)}
                      >
                        <Text style={styles.deleteButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.actionEmoji}>{action.emoji}</Text>
                    <Text style={styles.actionLabel}>{action.title}</Text>
                  </TouchableOpacity>
                ))}

                {isEditMode && (
                  <TouchableOpacity
                    style={[styles.actionCard, styles.addActionCard]}
                    onPress={openAddModal}
                  >
                    <Text style={styles.addActionEmoji}>➕</Text>
                    <Text style={[styles.addActionLabel, { color: themeColors.primary.mental }]}>Add New</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={[styles.overallCard, Shadows.lg, { backgroundColor: themeColors.primary.mental }]}>
              <Text style={styles.overallLabel}>Overall Balance</Text>
              <Text style={styles.overallScore}>{totalScore}</Text>
            </View>
          </>
        )}
      </ScrollView>

      {selectedAction && (
        <ActionModal
          visible
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          onUpdateAction={handleUpdateAction}
        />
      )}

      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.surface }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { color: themeColors.text.primary }]}>
                {editingAction ? 'Edit Action' : 'Add Action'}
              </Text>

              <TextInput
                style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text.primary, borderColor: themeColors.border }]}
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="Title"
                placeholderTextColor={themeColors.text.tertiary}
              />

              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: themeColors.background, color: themeColors.text.primary, borderColor: themeColors.border }]}
                value={formTasks}
                onChangeText={setFormTasks}
                placeholder="Tasks (one per line)"
                placeholderTextColor={themeColors.text.tertiary}
                multiline
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: themeColors.primary.mental }]}
                onPress={handleSaveAction}
              >
                <Text style={styles.saveButtonText}>
                  {editingAction ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: Typography.sizes.h2, fontWeight: 'bold' },
  date: { marginTop: 4 },
  badDayButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#E8EAF0',
  },
  badDayButtonActive: {
    borderColor: '#667EEA',
  },
  badDayButtonText: { fontWeight: '600', fontSize: 12 },
  streakContainer: { marginVertical: Spacing.lg },
  streakBadge: { padding: Spacing.sm, borderRadius: Radius.full, alignSelf: 'flex-start' },
  streakNote: { fontSize: 12, marginTop: Spacing.xs },
  badDayTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  minimizedScoresSection: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  minimizedScoreCard: { flex: 1, alignItems: 'center' },
  minimizedScoreLabel: { fontSize: Typography.sizes.small, marginBottom: Spacing.xs },
  minimizedScoreValue: { fontSize: Typography.sizes.h1, fontWeight: 'bold' },
  minimizedScoreDivider: { width: 1, backgroundColor: '#718096', marginHorizontal: Spacing.md },
  scoresSection: { gap: Spacing.md, marginVertical: Spacing.lg },
  actionsSection: { marginBottom: Spacing.lg },
  actionsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  actionsTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold' },
  editButton: { padding: Spacing.sm, borderRadius: Radius.md },
  editButtonText: { color: '#fff', fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: { fontSize: 32, marginBottom: Spacing.xs },
  actionLabel: { fontWeight: '600', textAlign: 'center' },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 4,
  },
  deleteButtonText: { color: '#fff' },
  addActionCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'transparent',
  },
  addActionEmoji: { fontSize: 32 },
  addActionLabel: { fontWeight: '600' },
  overallCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  overallLabel: { color: '#fff' },
  overallScore: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: Spacing.lg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  modalTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.md },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  textArea: { minHeight: 100 },
  saveButton: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});