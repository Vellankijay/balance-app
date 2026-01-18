# Balance 🌟

> Your Personal Wellness Companion: Measure the harmony between mental and physical health.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React Native](https://img.shields.io/badge/Built%20with-React%20Native-61dafb?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 🎯 Overview

**Balance** is an intelligent wellness application that understands something most fitness and health trackers miss: **true wellness is about harmony, not perfection**.

Instead of obsessing over individual metrics—10,000 steps, 8 hours of sleep, zero social media—Balance sees the complete picture. It measures how well your *mental* and *physical* health work together, adapts to your reality, celebrates real progress, and meets you with compassion on difficult days.

Built in 24 hours with React Native and Expo, designed with the philosophy that wellness tools should never make you feel worse.

---

## ✨ Features

### 🧮 **Intelligent Dual Scoring System**
- **Mental Score (0-100)**: Computed from sleep quality, focus habits, screen time management, app usage balance, and task completion
- **Physical Score (0-100)**: Computed from daily steps, structured exercise, active minutes, heart health metrics, and physical task completion
- **Dynamic Weighting**: Algorithm intelligently adapts based on available data, ensuring meaningful feedback whether you have rich historical data or just started

### 🎮 **Gamification & Achievement System**
- **12 Diverse Achievements** organized across 4 tiers (Bronze → Silver → Gold → Platinum)
- **Progress Tracking**: Visual progress bars showing exactly how close you are to unlocking each achievement
- **Tangible Rewards**: Unlock achievements to earn bonus points directly improving your scores
- **Positive Feedback Loop**: Complete tasks → unlock achievements → earn points → higher scores → stay motivated

### 💔 **Bad Day Mode**
- Activate with a single tap when you're struggling
- Interface simplifies to self-care focused tasks only
- Streak counter freezes (doesn't count against you)
- Data is tagged separately (excluded from analytics)
- A compassionate reminder that wellness isn't linear

### 🌙 **Complete Dark Mode Support**
- Elegant light mode with soft warm beige background (#F0EFE7)
- Beautiful dark mode with navy-gray background (#1A1F2E)
- Instant theme switching across entire app
- Carefully designed color palettes for accessibility

### 📊 **Analytics & Trends Dashboard**
- Toggle between Weekly, Monthly, and Yearly views
- Interactive charts showing mental vs physical trends
- AI-powered insights (with graceful fallback to rule-based recommendations)
- Real-time statistics (average scores, best performing days, consistency metrics)

### 📋 **Task Management**
- Create, edit, and track mental and physical wellness tasks
- Mark tasks complete to instantly boost your scores
- Customize tasks to match your wellness goals
- Task completion is the strongest indicator of intentional wellness effort

---

## 🤔 The Problem

Modern wellness is fragmented:
- You hit your step goal while spending 8 hours on social media
- You exercise daily but can't sleep due to late-night phone usage
- Wellness apps punish bad days with streak resets, making you feel worse
- Individual metrics mean nothing without context
- Success is defined as perfection, leaving no room for being human

---

## 💡 The Solution

Balance solves this by:

1. **Understanding Context** - Your score sees the whole you, not isolated metrics
2. **Adapting to Reality** - Algorithm weights factors based on available data, ensuring fairness at every stage
3. **Celebrating Progress** - 80% task completion is rewarded, not penalized; achievements acknowledge effort
4. **Showing Compassion** - Bad Day Mode recognizes that wellness isn't linear and bad days don't disqualify you
5. **Providing Actionable Insights** - Trends and AI-powered recommendations show you what's working and what to adjust

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- A modern web browser (for web version)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/balance-app.git
   cd balance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables (optional)**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
   
   *Note: The app works without this. AI insights will use fallback recommendations instead.*

4. **Start the development server**
   ```bash
   npx expo start --clear
   ```

5. **Run on web**
   - Press `w` in the terminal, or
   - Navigate to `http://localhost:19006` in your browser

### First Run

The app automatically generates realistic dummy data, so you can start exploring immediately:
- Health metrics (steps, heart rate, sleep quality)
- Usage patterns (screen time, app distribution)
- Pre-populated achievements

No manual data entry required!

---

## 📱 Usage

### Home / Balance Screen
View your current mental and physical wellness scores. Tap Quick Actions to complete your daily wellness tasks. Track your streak and activate Bad Day Mode if needed.

### Journey / Achievements Screen
Explore 12 achievements organized by difficulty tier. Expand any achievement to see progress bars and unlocking conditions. Claim rewards when achievements unlock to boost your scores.

### Trends / Analytics Screen
View interactive charts of your mental vs physical trends over time. Toggle between weekly, monthly, and yearly views. Get AI-powered personalized insights based on your data patterns.

### Settings Screen
Toggle dark mode on/off with instant app-wide effect. Manage notifications, privacy settings, and account preferences. View app information and commit to wellness.

### Bad Day Mode
Tap the "Bad Day" button on the home screen when you're struggling:
- Interface simplifies with only self-care focused tasks
- Your streak freezes (not counting against you)
- Data is tagged separately (won't affect analytics)
- Tap "I'm OK" to exit

---

## 🧠 How It Works

### The Scoring Pipeline

1. **Data Collection**: App receives health metrics, usage data, and task completions
2. **Availability Detection**: System determines what data types are available
3. **Dynamic Weight Assignment**: Weights adjust based on available data
4. **Component Calculation**: Each factor is independently scored (0-100)
5. **Weighted Combination**: Components combined using dynamic weights
6. **Comparison & Insight**: Scores compared against history to identify trends
7. **UI Display**: Results shown with breakdowns and recommendations

### Scoring Formula

**With Task Data:**
$$\text{Mental Score} = 0.25 \cdot S_{\text{sleep}} + 0.20 \cdot S_{\text{focus}} + 0.12 \cdot S_{\text{screen}} + 0.10 \cdot S_{\text{apps}} + 0.33 \cdot S_{\text{tasks}}$$

**Without Task Data:**
$$\text{Mental Score} = 0.32 \cdot S_{\text{sleep}} + 0.28 \cdot S_{\text{focus}} + 0.20 \cdot S_{\text{screen}} + 0.20 \cdot S_{\text{apps}}$$

Similar dynamic weighting applies to Physical Score.

### Achievement Tiers

- **Bronze/Silver** (Easy): Getting started, building consistency
- **Gold** (Intermediate): Building real habits, reaching milestones  
- **Platinum** (Expert): Mastery, consistency over time

Each tier requires progressively more commitment, creating natural progression.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     React Native / Expo Web         │
├─────────────────────────────────────┤
│    Navigation (Expo Router)         │
├─────────────────────────────────────┤
│   UI Layer (Components, Screens)    │
├─────────────────────────────────────┤
│   State Management (Zustand)        │
├─────────────────────────────────────┤
│   Scoring Engine & Calculations     │
├─────────────────────────────────────┤
│   Data Layer (Raw Metrics)          │
│   - Health Data                     │
│   - Usage Data                      │
│   - Task Data                       │
│   - AI Insights (Optional)          │
└─────────────────────────────────────┘
```

### Key Components

- **scoreCalculator.ts**: Wellness score computation with dynamic weighting
- **themeContext.tsx**: Global theme state (light/dark mode)
- **theme.ts**: Design tokens and color palettes
- **store.ts**: Zustand store for user data and app state
- **ActionModal.tsx**: Task management interface
- **EnhancedScoreCard.tsx**: Score display component

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native with Expo 54.0.0 |
| **Navigation** | Expo Router (file-based routing) |
| **State** | Zustand |
| **Language** | TypeScript 5.3.0 |
| **Charts** | react-native-chart-kit |
| **AI** | Anthropic Claude API (optional) |
| **Styling** | React Native StyleSheet + theme tokens |

### Why These Choices?

- **React Native**: Write once, run on web and mobile
- **Expo**: Zero-configuration setup, instant development
- **Zustand**: Lightweight state management without boilerplate
- **TypeScript**: Type safety across the entire codebase
- **Anthropic API**: Advanced AI insights with graceful fallback

---

## ⚙️ Configuration

### Environment Variables

```env
# Optional: For AI-powered insights
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

### Theme Customization

Edit color palettes in `utils/theme.ts`:
```typescript
export const Colors = {
  light: {
    background: '#F0EFE7',
    // ... customize as needed
  },
  dark: {
    background: '#1A1F2E',
    // ... customize as needed
  },
};
```

### Scoring Parameters

Adjust wellness thresholds in `utils/scoreCalculator.ts`:
```typescript
const optimalScreenTime = 180; // 3 hours
const optimalSteps = 10000; // steps per day
const optimalExercise = 45; // minutes per day
```

---

## 📂 Project Structure

```
balance-app/
├── app/
│   ├── _layout.tsx          # Root layout with ThemeProvider
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation
│       ├── index.tsx        # Home / Balance screen
│       ├── journey.tsx      # Achievements screen
│       ├── trends.tsx       # Analytics screen
│       └── settings.tsx     # Settings & theme
├── components/
│   ├── ActionModal.tsx      # Task management modal
│   └── EnhancedScoreCard.tsx # Score display
├── utils/
│   ├── scoreCalculator.ts   # Scoring engine
│   ├── themeContext.tsx     # Theme state
│   ├── theme.ts            # Design tokens
│   └── insightsHelper.ts    # AI insights
├── state/
│   └── store.ts            # Zustand store
├── .env.example            # Environment variable template
├── .gitignore             # Git ignore rules
├── app.json               # Expo config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

---

## 🧪 Testing

The app includes dummy data generation for testing:

```typescript
import { 
  generateDummyHealthData,
  generateDummyUsageData,
  generateDummyTaskData,
  calculateWellnessScores 
} from '@/utils/scoreCalculator';

const health = generateDummyHealthData();
const usage = generateDummyUsageData();
const tasks = generateDummyTaskData();
const scores = calculateWellnessScores(health, usage, tasks);
```

This allows testing without real data setup.

---

## 🔮 Future Roadmap

- **Mobile Compilation**: Deploy to iOS/Android with native health permissions
- **Real Data Integration**: Connect to Apple Health, Google Fit, Wearables
- **Social Features**: Share achievements, friend challenges, leaderboards
- **Advanced Analytics**: Predictive trends, personalized wellness plans
- **Habit Tracking**: Visual streak calendars, habit formation support
- **Custom Achievements**: Allow users to create personalized achievement goals
- **Data Export**: Download wellness data as CSV/PDF reports
- **Wearable Integration**: Direct smartwatch synchronization
- **Push Notifications**: Reminders for tasks and streak maintenance
- **Community**: Community wellness challenges and support

---

## 📊 Scoring Algorithm Details

### Mental Score Components

- **Sleep Quality (25-32%)**: Hours slept + subjective quality rating
- **Focus (20-28%)**: Phone pickups, screen stability, focus sessions
- **Screen Time (12-20%)**: Total daily usage (optimal: 2-3 hours)
- **App Balance (10-20%)**: Distribution across categories (less social, more productive)
- **Task Completion (0-33%)**: Percentage of mental wellness tasks completed

### Physical Score Components

- **Steps (20-28%)**: Daily step count (optimal: 10,000)
- **Exercise (20-26%)**: Structured workout minutes (optimal: 30-60 min)
- **Activity (18-24%)**: Active movement minutes (optimal: 60+ min)
- **Heart Health (15-22%)**: Resting HR + HRV score
- **Task Completion (0-27%)**: Percentage of physical wellness tasks completed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

Have questions or found a bug? Please open an issue on GitHub.

For feature requests or general feedback, feel free to start a discussion.

---

## 🙏 Acknowledgments

Built with inspiration from conversations with friends struggling with wellness and burnout. Special thanks to everyone who believes that technology should make us feel better, not worse.

---

## 📸 Screenshots

### Home Screen
View your current mental and physical wellness scores with actionable quick tasks.

### Achievements
12 progressive achievements with tangible rewards and progress tracking.

### Dark Mode
Beautiful dark theme for comfortable viewing in any lighting.

### Bad Day Mode
Compassionate interface for difficult days with simplified, self-care focused options.

### Analytics
Interactive charts showing trends with AI-powered personalized insights.

---

## 🚀 Quick Commands

```bash
# Start development server
npm start

# Run on web
npx expo start --clear
# Then press 'w'

# TypeScript type checking
npx tsc --noEmit

# Format code
npm run format

# Lint code
npm run lint
```

---

**Built with ❤️ in 24 hours. Designed with compassion.**

*Because wellness is a journey, not a destination.*
