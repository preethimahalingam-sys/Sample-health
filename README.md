# Health Tracker — macOS App

A native macOS app built with SwiftUI to track your daily health metrics.

## Features

| Metric | Details |
|---|---|
| **Caffeine** | Log mg consumed with quick-add buttons (+80, +150, +200 mg) |
| **Sleep** | Slider input in 0.5h increments, 0–12 hours |
| **Steps** | Stepper + quick-add (+1k, +2.5k, +5k steps) |
| **Workout** | Log multiple sessions per day with type and duration |

### Screens

- **Today** — Log all four metrics for the current day, add/remove workout sessions
- **Summary** — Visual cards with progress bars, status labels, and an overall health score (0–100)
- **History** — 7-day bar chart (switch between metrics) + daily overview list

### Data Persistence

All data is saved to `UserDefaults` automatically on every change. Each day's entry is stored independently.

## Requirements

- macOS 14.0+
- Xcode 15+
- Swift 5.9+

## Opening the Project

```bash
open HealthTracker/HealthTracker.xcodeproj
```

Then press **⌘R** to build and run.

## Project Structure

```
HealthTracker/
├── HealthTracker.xcodeproj/
└── HealthTracker/
    ├── HealthTrackerApp.swift       # App entry point
    ├── ContentView.swift            # NavigationSplitView shell
    ├── Models/
    │   └── HealthEntry.swift        # Data models (HealthEntry, WorkoutSession, WorkoutType)
    ├── ViewModels/
    │   └── HealthStore.swift        # ObservableObject, persistence, week summary
    └── Views/
        ├── TodayView.swift          # Daily logging UI
        ├── SummaryView.swift        # Health score & status cards
        └── HistoryView.swift        # 7-day chart & list
```
