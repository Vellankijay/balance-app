import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useStore } from '@/state/store';
import { useTheme } from '@/utils/themeContext';
import { Colors, getColors, Typography, Spacing, Radius, Shadows } from '@/utils/theme';

export default function SettingsScreen() {
  const { privacyMode, notificationsEnabled, setPrivacyMode, setNotifications, clearAllData } = useStore();
  const { mode, setTheme } = useTheme();
  const themeColors = getColors(mode);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your progress. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export feature is coming soon! 📊');
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
          <Text style={[styles.title, { color: themeColors.text.primary }]}>⚙️ Settings</Text>
          <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>Manage your preferences</Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>🌓 Appearance</Text>

          <View style={[styles.toggleItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.toggleContent}>
              <View style={[styles.settingIcon, { backgroundColor: mode === 'dark' ? '#4A5568' : '#FFE5B4' }]}>
                <Text style={styles.iconText}>{mode === 'dark' ? '🌙' : '☀️'}</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>
                  {mode === 'dark' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: themeColors.border, true: themeColors.primary.mental }}
              thumbColor={mode === 'dark' ? themeColors.primary.mental : themeColors.border}
            />
          </View>

          <View style={[styles.themePreview, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.themePreviewTitle, { color: themeColors.text.primary }]}>
              Current Theme: {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
            </Text>
            <View style={styles.colorSwatch}>
              <View style={[styles.swatchBox, { backgroundColor: themeColors.background }]}>
                <Text style={styles.swatchLabel}>Background</Text>
              </View>
              <View style={[styles.swatchBox, { backgroundColor: themeColors.primary.mental }]}>
                <Text style={[styles.swatchLabel, { color: '#fff' }]}>Mental</Text>
              </View>
              <View style={[styles.swatchBox, { backgroundColor: themeColors.primary.physical }]}>
                <Text style={[styles.swatchLabel, { color: '#fff' }]}>Physical</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>👤 Profile</Text>

          <View style={[styles.settingItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#D5F4FF' }]}>
                <Text style={styles.iconText}>🎨</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Display Name</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Wellness Tracker</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: themeColors.text.tertiary }]}>›</Text>
          </View>

          <View style={[styles.settingItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#E8D5FF' }]}>
                <Text style={styles.iconText}>🎯</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Weekly Goal</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Maintain 75+ average</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: themeColors.text.tertiary }]}>›</Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>🔔 Notifications</Text>

          <View style={[styles.toggleItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.toggleContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#FFE5B4' }]}>
                <Text style={styles.iconText}>📢</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Daily reminders and updates</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotifications}
              trackColor={{ false: themeColors.border, true: themeColors.primary.mental }}
              thumbColor={notificationsEnabled ? themeColors.primary.mental : themeColors.border}
            />
          </View>

          <View style={[styles.toggleItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.toggleContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#FFD5E5' }]}>
                <Text style={styles.iconText}>🏆</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Achievement Alerts</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Celebrate unlocked badges</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => Alert.alert('Coming Soon', 'Feature in development')}
              trackColor={{ false: themeColors.border, true: themeColors.primary.physical }}
              thumbColor={themeColors.primary.physical}
            />
          </View>

          <View style={[styles.toggleItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.toggleContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#D5FFD5' }]}>
                <Text style={styles.iconText}>🔥</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Streak Reminders</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Don't break your streak!</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => Alert.alert('Coming Soon', 'Feature in development')}
              trackColor={{ false: themeColors.border, true: themeColors.primary.physical }}
              thumbColor={themeColors.primary.physical}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>🔒 Privacy & Data</Text>

          <View style={[styles.toggleItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.toggleContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#D5E5FF' }]}>
                <Text style={styles.iconText}>🛡️</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Privacy Mode</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Hide scores from others</Text>
              </View>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: themeColors.border, true: themeColors.primary.mental }}
              thumbColor={privacyMode ? themeColors.primary.mental : themeColors.border}
            />
          </View>

          <View style={[styles.settingItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#FFF4D5' }]}>
                <Text style={styles.iconText}>📥</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: themeColors.text.primary }]}>Export Data</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Download your data as JSON</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleExportData}>
              <Text style={[styles.settingArrow, { color: themeColors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#FFD5D5' }]}>
                <Text style={styles.iconText}>🗑️</Text>
              </View>
              <View style={styles.settingTextContent}>
                <Text style={[styles.settingLabel, { color: '#F56565' }]}>Clear All Data</Text>
                <Text style={[styles.settingDescription, { color: themeColors.text.secondary }]}>Delete all your progress</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClearData}>
              <Text style={[styles.settingArrow, { color: '#F56565' }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>ℹ️ About</Text>

          <View style={[styles.infoCard, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Version</Text>
              <Text style={[styles.infoValue, { color: themeColors.text.primary }]}>1.0.0</Text>
            </View>
            <View style={[styles.infoRow, styles.infoBorder, { borderTopColor: themeColors.border }]}>
              <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Build</Text>
              <Text style={[styles.infoValue, { color: themeColors.text.primary }]}>2024.01</Text>
            </View>
          </View>

          <View style={[styles.descriptionCard, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.descriptionTitle, { color: themeColors.text.primary }]}>🌟 About Balance</Text>
            <Text style={[styles.descriptionText, { color: themeColors.text.secondary }]}>
              Balance is a personal wellness tracker designed to help you maintain equilibrium between your mental and physical health. Track, analyze, and celebrate your journey towards better wellness.
            </Text>
          </View>

          <View style={[
            styles.ethicsCard, 
            Shadows.sm, 
            { 
              backgroundColor: mode === 'light' ? '#E8F5E9' : '#1B3A2E',
              borderLeftColor: themeColors.primary.physical,
            }
          ]}>
            <Text style={[styles.ethicsTitle, { color: themeColors.text.primary }]}>💚 Our Commitment</Text>
            <View style={styles.ethicsItem}>
              <Text style={styles.ethicsEmoji}>🔐</Text>
              <Text style={[styles.ethicsText, { color: themeColors.text.secondary }]}>Your data stays on your device. We never share it.</Text>
            </View>
            <View style={styles.ethicsItem}>
              <Text style={styles.ethicsEmoji}>✨</Text>
              <Text style={[styles.ethicsText, { color: themeColors.text.secondary }]}>No ads, no tracking, no hidden fees.</Text>
            </View>
            <View style={styles.ethicsItem}>
              <Text style={styles.ethicsEmoji}>🤝</Text>
              <Text style={[styles.ethicsText, { color: themeColors.text.secondary }]}>Built with care for your privacy and wellbeing.</Text>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>📧 Support</Text>

          <View style={[styles.supportCard, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportIcon}>📱</Text>
              <View style={styles.supportContent}>
                <Text style={[styles.supportTitle, { color: themeColors.text.primary }]}>Contact Us</Text>
                <Text style={[styles.supportSubtitle, { color: themeColors.text.secondary }]}>Help and feedback</Text>
              </View>
              <Text style={[styles.supportArrow, { color: themeColors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.supportCard, Shadows.sm, { backgroundColor: themeColors.surface }]}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportIcon}>📖</Text>
              <View style={styles.supportContent}>
                <Text style={[styles.supportTitle, { color: themeColors.text.primary }]}>Privacy Policy</Text>
                <Text style={[styles.supportSubtitle, { color: themeColors.text.secondary }]}>Learn how we protect you</Text>
              </View>
              <Text style={[styles.supportArrow, { color: themeColors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.lg },
  title: { fontSize: Typography.sizes.h2, fontWeight: 'bold' },
  subtitle: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: Typography.sizes.h3, fontWeight: 'bold', marginBottom: Spacing.md },
  settingItem: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleItem: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 22 },
  settingTextContent: { flex: 1 },
  settingLabel: { fontSize: Typography.sizes.body, fontWeight: '600' },
  settingDescription: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  settingArrow: { fontSize: 20 },
  themePreview: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  themePreviewTitle: { fontSize: Typography.sizes.body, fontWeight: '600', marginBottom: Spacing.md },
  colorSwatch: { flexDirection: 'row', gap: Spacing.md },
  swatchBox: { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', justifyContent: 'center', minHeight: 80 },
  swatchLabel: { fontSize: Typography.sizes.xs, fontWeight: '600', color: '#000' },
  infoCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  infoBorder: { borderTopWidth: 1, paddingTop: Spacing.md },
  infoLabel: { fontSize: Typography.sizes.body },
  infoValue: { fontSize: Typography.sizes.body, fontWeight: '600' },
  descriptionCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  descriptionTitle: { fontSize: Typography.sizes.body, fontWeight: 'bold', marginBottom: Spacing.md },
  descriptionText: { fontSize: Typography.sizes.small, lineHeight: 20 },
  ethicsCard: { borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderLeftWidth: 4 },
  ethicsTitle: { fontSize: Typography.sizes.body, fontWeight: 'bold', marginBottom: Spacing.md },
  ethicsItem: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  ethicsEmoji: { fontSize: 18, marginTop: 2 },
  ethicsText: { fontSize: Typography.sizes.small, flex: 1 },
  supportCard: { borderRadius: Radius.lg, marginBottom: Spacing.md },
  supportButton: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  supportIcon: { fontSize: 28, width: 44, textAlign: 'center' },
  supportContent: { flex: 1 },
  supportTitle: { fontSize: Typography.sizes.body, fontWeight: '600' },
  supportSubtitle: { fontSize: Typography.sizes.small, marginTop: Spacing.xs },
  supportArrow: { fontSize: 20 },
});