# Life OS v1.0 - Specification Document

## 1. Project Overview

**Project Name:** Life OS v1.0  
**Type:** Personal Performance Dashboard / Habit Tracker  
**Core Functionality:** A comprehensive system to track daily habits, measure KPIs, and build discipline through visual feedback and streak tracking.  
**Target Users:** Individuals seeking a data-driven approach to personal development and habit formation.

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Header:** App title, current date, streak counter, settings icon
- **Navigation Sidebar:** Vertical tabs for switching between modules (Dashboard, Agua, Gym, Azúcar, Rutinas, Analytics)
- **Main Content Area:** Dynamic content based on selected module
- **Footer:** Minimal, shows version info

**Grid/Layout:**
- Sidebar: Fixed left, 80px width on desktop, bottom nav on mobile
- Main content: Fluid, max-width 1200px centered
- Cards: CSS Grid with responsive columns (1 col mobile, 2 cols tablet, 3 cols desktop)

**Responsive Breakpoints:**
- Mobile: < 640px (bottom navigation, single column)
- Tablet: 640px - 1024px (sidebar collapsed, 2 columns)
- Desktop: > 1024px (full sidebar, multi-column)

### Visual Design

**Color Palette:**
```css
--bg-primary: #0a0a0f;        /* Deep black background */
--bg-secondary: #12121a;      /* Card backgrounds */
--bg-tertiary: #1a1a24;      /* Elevated elements */
--accent-green: #00ff88;      /* Success / completed */
--accent-red: #ff4757;        /* Failed / danger */
--accent-blue: #00d4ff;       /* Water / primary action */
--accent-purple: #a855f7;     /* Gym / intensity */
--accent-yellow: #ffc107;     /* Streak / warning */
--accent-orange: #ff6b35;     /* Sugar / attention */
--text-primary: #ffffff;      /* Main text */
--text-secondary: #8b8b9a;    /* Muted text */
--text-tertiary: #4a4a5a;     /* Disabled text */
--border-color: #2a2a3a;      /* Subtle borders */
```

**Typography:**
- Headings: "Outfit" (Google Fonts) - Bold, weights 600-800
- Body: "DM Sans" (Google Fonts) - Regular, weights 400-500
- Monospace (stats): "JetBrains Mono"
- H1: 2.5rem / 40px
- H2: 1.75rem / 28px
- H3: 1.25rem / 20px
- Body: 1rem / 16px
- Small: 0.875rem / 14px

**Spacing System:**
- Base unit: 4px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, 2XL: 48px

**Visual Effects:**
- Cards: `box-shadow: 0 4px 24px rgba(0, 255, 136, 0.05)`
- Hover states: Scale 1.02, increased shadow glow
- Glassmorphism on modals: `backdrop-filter: blur(12px)`
- Progress bars: Animated gradient shimmer
- Success animation: Confetti burst on completing all daily habits
- Page transitions: Fade + slide (150ms ease-out)

### Components

**Navigation Tabs:**
- Icon + label, 48px height
- Active: accent-green left border, subtle bg highlight
- Hover: bg-tertiary transition

**Habit Cards:**
- Rounded corners (12px)
- Icon (32px), title, current value, progress bar
- Status indicator: green dot (completed) / red dot (failed) / gray (pending)

**Buttons:**
- Primary: bg-accent-green, text-black, bold
- Secondary: border-accent-green, text-accent-green
- Danger: bg-accent-red
- Sizes: SM (32px), MD (40px), LG (48px)

**Progress Bars:**
- Height: 8px, rounded-full
- Animated fill with gradient
- Percentage label above

**Input Fields:**
- Dark bg (#1a1a24), border #2a2a3a
- Focus: border-accent-green glow

**Modals:**
- Centered, max-width 500px
- Dark overlay (rgba(0,0,0,0.8))
- Slide-up animation

---

## 3. Functionality Specification

### Module 1: Dashboard Principal

**Features:**
- Daily progress bar (percentage of completed habits)
- Habit status grid showing all tracked habits with color indicators
- Current streak counter (consecutive days with all habits completed)
- Motivational quote (rotates daily from curated list)
- Weekly completion chart (bar chart, last 7 days)
- Quick stats: Today's completion %, Best streak, Total days tracked

**User Interactions:**
- Click on habit card to navigate to that module
- Hover on streak to see detailed streak info

### Module 2: Tracker de Agua

**Features:**
- Configurable daily goal (default: 2500ml)
- Quick add buttons: +250ml, +500ml, +1L
- Custom amount input
- Visual progress bar with water wave animation
- Daily reset at midnight (automatic)
- Weekly history chart
- Streak for meeting daily goal

**Data Model:**
```typescript
WaterEntry {
  date: string;        // YYYY-MM-DD
  amount: number;      // ml consumed
  goal: number;       // daily goal in ml
}
```

### Module 3: Control de Gym

**Features:**
- Daily check-in (Did you go to gym today?)
- Workout type selector: Push, Pull, Legs, Upper, Lower, Full Body, Cardio
- Duration input (minutes)
- Intensity selector: 1-5 stars
- Notes field for workout details
- Weekly workout frequency chart
- Monthly calendar heatmap

**Data Model:**
```typescript
GymEntry {
  date: string;
  completed: boolean;
  workoutType: string;
  duration: number;
  intensity: number;
  notes: string;
}
```

### Module 4: Control de Azúcar

**Features:**
- Simple daily question: "¿Consumiste azúcar hoy?"
- Yes/No toggle with confirmation
- If "Yes": Shows sugar penalty warning, breaks streak
- Monthly calendar view with color-coded days
- Monthly statistics: Total days without sugar, longest streak
- Streak counter for sugar-free days

**Logic:**
- Answering "Yes" to sugar = resets sugar-free streak
- Answering "No" = increments sugar-free streak
- Can only answer once per day

### Module 5: Rutinas

**Features:**
- Morning routine checklist (customizable)
- Night routine checklist (customizable)
- Default items for morning: Despertar temprano, Ejercicio, Ducha fría, Desayuno saludable, Revisar objetivos
- Default items for night: Revisar día, Preparar mañana, Leer, Meditar, Dormir temprano
- Toggle time of day (Mañana / Noche)
- Add/remove custom items
- Completion percentage per routine
- Streak for completing routine

**Data Model:**
```typescript
RoutineItem {
  id: string;
  text: string;
  completed: boolean;
}

RoutineEntry {
  date: string;
  morning: RoutineItem[];
  night: RoutineItem[];
}
```

### Module 6: Analytics

**Features:**
- Weekly completion rate (pie/donut chart)
- Monthly overview calendar heatmap
- Streak statistics (current, best, average)
- Habit-specific breakdown charts
- Trends: Improving / Declining / Stable indicators
- Export data option (JSON)

**Charts (using Recharts):**
- Weekly bar chart: habits completed per day
- Monthly line chart: completion percentage over time
- Habit radar chart: performance by category

### Motivational Quotes

Default set:
1. "La disciplina es el puente entre tus metas y tus logros."
2. "Cada día es una oportunidad para ser mejor."
3. "El éxito es la suma de pequeños esfuerzos repetidos."
4. "No esperes motivación, sé la disciplina."
5. "Tu único límite eres tú mismo."
6. "Los hábitos construyen el carácter."
7. "El progreso no la perfección."
8. "La excelencia es un hábito."

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with accent colors applied consistently
- [ ] Smooth animations on all interactions
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Progress bars animate on value change
- [ ] Navigation highlights active module

### Functional Checkpoints
- [ ] Can track water intake and see progress
- [ ] Can log gym workouts with all details
- [ ] Can answer sugar question daily
- [ ] Can manage morning/night routines
- [ ] Analytics show accurate data
- [ ] Streaks calculate correctly
- [ ] Data persists after page refresh (localStorage)
- [ ] Daily reset works at midnight
- [ ] Motivational quotes rotate daily

### Performance
- [ ] Initial load < 3 seconds
- [ ] Smooth 60fps animations
- [ ] No console errors

---

## 5. Technical Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Charts:** Recharts
- **Persistence:** localStorage
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Outfit, DM Sans, JetBrains Mono)

---

## 6. Data Persistence

All data stored in localStorage with keys:
- `lifeos_habits`: Main habits data
- `lifeos_water`: Water tracking data
- `lifeos_gym`: Gym workout data
- `lifeos_sugar`: Sugar tracking data
- `lifeos_routines`: Custom routines
- `lifeos_settings`: User settings
- `lifeos_analytics`: Computed analytics
