// components/ActionModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/utils/themeContext';
import { getColors, Typography, Spacing, Radius } from '@/utils/theme';

export const ActionModal: React.FC<any> = ({
  visible,
  action,
  onClose,
  onUpdateAction,
}) => {
  const { mode } = useTheme();
  const themeColors = getColors(mode);
  
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (taskId: string) => {
    onUpdateAction({
      ...action,
      tasks: action.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    });
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;

    onUpdateAction({
      ...action,
      tasks: [
        ...action.tasks,
        {
          id: `task-${Date.now()}`,
          text: newTaskText.trim(),
          completed: false,
        },
      ],
    });

    setNewTaskText('');
  };

  const deleteTask = (taskId: string) => {
    onUpdateAction({
      ...action,
      tasks: action.tasks.filter(t => t.id !== taskId),
    });
  };

  const editTask = (taskId: string, text: string) => {
    onUpdateAction({
      ...action,
      tasks: action.tasks.map(t =>
        t.id === taskId ? { ...t, text } : t
      ),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: action.color }]}>
            <Text style={styles.emoji}>{action.emoji}</Text>
            <Text style={styles.title}>{action.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Description */}
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>About</Text>
            <Text style={[styles.description, { color: themeColors.text.secondary }]}>
              {action.description}
            </Text>

            {/* Tasks */}
            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Tasks</Text>

            {action.tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskRow}
                onPress={() => toggleTask(task.id)}
                onLongPress={() =>
                  Alert.alert(
                    'Task',
                    task.text,
                    [
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteTask(task.id),
                      },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  )
                }
              >
                <Text style={styles.checkbox}>
                  {task.completed ? '☑️' : '⬜️'}
                </Text>

                <TextInput
                  value={task.text}
                  onChangeText={text => editTask(task.id, text)}
                  style={[
                    styles.taskText,
                    task.completed && styles.taskCompleted,
                    { color: themeColors.text.primary }
                  ]}
                  placeholderTextColor={themeColors.text.tertiary}
                />
              </TouchableOpacity>
            ))}

            {/* Add task */}
            <View style={styles.addTaskRow}>
              <TextInput
                placeholder="Add a new task..."
                value={newTaskText}
                onChangeText={setNewTaskText}
                style={[
                  styles.addInput,
                  {
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    borderColor: themeColors.border,
                  }
                ]}
                placeholderTextColor={themeColors.text.tertiary}
              />
              <TouchableOpacity onPress={addTask}>
                <Text style={styles.addButton}>➕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionSpacer} />

            {/* Tips */}
            {action.tips.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>💡 Tips</Text>
                {action.tips.map((tip, i) => (
                  <Text key={i} style={[styles.tip, { color: themeColors.text.secondary }]}>
                    • {tip}
                  </Text>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  emoji: { fontSize: 32 },
  title: {
    flex: 1,
    fontSize: Typography.sizes.h2,
    fontWeight: 'bold',
    color: '#FFF',
  },
  close: { fontSize: 24, color: '#FFF' },

  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  description: {
    marginBottom: Spacing.lg,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checkbox: { fontSize: 20, marginRight: Spacing.md },
  taskText: {
    flex: 1,
    fontSize: Typography.sizes.body,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
  },

  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  addButton: {
    fontSize: 24,
    marginLeft: Spacing.md,
  },

  tip: {
    fontSize: Typography.sizes.small,
    marginBottom: Spacing.sm,
  },
  actionSpacer: {
    height: Spacing.md * 1.5,
  },
});