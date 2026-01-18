// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/utils/themeContext';
import { getColors, Typography, Spacing } from '@/utils/theme';

export default function TabsLayout() {
  const { mode } = useTheme();
  const themeColors = getColors(mode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: themeColors.primary.mental,
        tabBarInactiveTintColor: themeColors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Balance',
          tabBarLabel: 'Balance',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trends',
          tabBarLabel: 'Trends',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📈</Text>,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarLabel: 'Journey',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚡</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}