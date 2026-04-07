# Lumina Assistant - Technical Blueprint

## 1. Feature Roadmap

### Phase 1: Foundation (Current)
- [x] Glassmorphic Bento-Box Dashboard
- [x] Basic Expense Tracking & Visualization
- [x] Task Management with Priorities
- [x] Real-time Reminders UI
- [x] Quick Memo System

### Phase 2: Intelligence & Integration
- [ ] **AI Spending Insights**: Gemini-powered analysis of spending patterns.
- [ ] **Voice Commands**: "Add $50 for dinner" via voice-to-text.
- [ ] **Calendar Sync**: Integration with Google/Outlook calendars.
- [ ] **Push Notifications**: Browser-based alerts for deadlines.

### Phase 3: Advanced Productivity
- [ ] **Meeting Summarizer**: AI transcription and action item extraction.
- [ ] **Recurring Bills Automation**: Predictive bill tracking.
- [ ] **Multi-Executive Support**: Switch between different profiles.

## 2. UI Architecture (Component Breakdown)

### Core Layout
- `App.tsx`: Main entry point, layout wrapper, and state management.
- `GlassCard.tsx`: Reusable glassmorphic container with motion effects.
- `BottomNav.tsx`: Floating navigation system.

### Dashboard Modules
- `ExpenseChart.tsx`: Recharts-based financial visualization.
- `TransactionsList.tsx`: Detailed view of recent spending.
- `TaskScheduler.tsx`: Priority-based to-do list with completion toggles.
- `ReminderSystem.tsx`: Categorized alerts (Bills, Meetings, Deadlines).
- `QuickMemo.tsx`: Auto-saving scratchpad for rapid notes.

### Design System
- **Typography**: Inter (Sans) for UI, JetBrains Mono for data.
- **Colors**: Deep Space (#050505) background, Indigo (#6366f1) primary accent.
- **Effects**: Backdrop-blur (20px+), white/10 borders, radial atmospheric gradients.
