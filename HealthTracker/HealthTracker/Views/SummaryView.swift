import SwiftUI

struct SummaryView: View {
    @EnvironmentObject var store: HealthStore

    private var today: HealthEntry { store.todayEntry }

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Daily Summary")
                    .font(.largeTitle.bold())
                    .frame(maxWidth: .infinity, alignment: .leading)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                    SummaryCard(
                        title: "Caffeine",
                        value: "\(today.caffeineMg)",
                        unit: "mg",
                        icon: "cup.and.saucer.fill",
                        color: .brown,
                        status: caffeineStatus,
                        statusColor: caffeineStatusColor,
                        progress: Double(today.caffeineMg) / 400.0
                    )
                    SummaryCard(
                        title: "Sleep",
                        value: String(format: "%.1f", today.sleepHours),
                        unit: "hours",
                        icon: "moon.zzz.fill",
                        color: .indigo,
                        status: sleepStatus,
                        statusColor: sleepStatusColor,
                        progress: today.sleepHours / 8.0
                    )
                    SummaryCard(
                        title: "Steps",
                        value: today.steps.formatted(),
                        unit: "steps",
                        icon: "figure.walk",
                        color: .orange,
                        status: stepsStatus,
                        statusColor: stepsStatusColor,
                        progress: Double(today.steps) / 10000.0
                    )
                    SummaryCard(
                        title: "Workout",
                        value: "\(today.totalWorkoutMinutes)",
                        unit: "minutes",
                        icon: "bolt.heart.fill",
                        color: .red,
                        status: workoutStatus,
                        statusColor: workoutStatusColor,
                        progress: Double(today.totalWorkoutMinutes) / 30.0
                    )
                }

                healthScoreCard
            }
            .padding(24)
        }
    }

    private var healthScoreCard: some View {
        let score = healthScore
        return VStack(spacing: 12) {
            Text("Overall Health Score")
                .font(.headline)
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 16)
                    .frame(width: 120, height: 120)
                Circle()
                    .trim(from: 0, to: score / 100)
                    .stroke(scoreColor(score), style: StrokeStyle(lineWidth: 16, lineCap: .round))
                    .frame(width: 120, height: 120)
                    .rotationEffect(.degrees(-90))
                VStack {
                    Text("\(Int(score))")
                        .font(.system(size: 32, weight: .bold, design: .rounded))
                    Text("/ 100")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            Text(scoreLabel(score))
                .font(.subheadline)
                .foregroundStyle(scoreColor(score))
                .bold()

            Text("Based on today's caffeine, sleep, steps, and workout data")
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
    }

    private var healthScore: Double {
        var score = 0.0
        // Sleep: 0–8h ideal
        score += min(today.sleepHours / 8.0, 1.0) * 30
        // Steps: 0–10k ideal
        score += min(Double(today.steps) / 10000.0, 1.0) * 30
        // Workout: 0–30min ideal
        score += min(Double(today.totalWorkoutMinutes) / 30.0, 1.0) * 25
        // Caffeine: over 400mg penalizes
        let caffeineScore = today.caffeineMg <= 400 ? (1.0 - Double(today.caffeineMg) / 800.0) : 0
        score += max(caffeineScore, 0) * 15
        return score
    }

    private func scoreColor(_ score: Double) -> Color {
        if score >= 75 { return .green }
        if score >= 50 { return .yellow }
        return .red
    }

    private func scoreLabel(_ score: Double) -> String {
        if score >= 80 { return "Excellent" }
        if score >= 60 { return "Good" }
        if score >= 40 { return "Fair" }
        return "Needs Work"
    }

    private var caffeineStatus: String {
        if today.caffeineMg == 0 { return "None logged" }
        if today.caffeineMg <= 200 { return "Low" }
        if today.caffeineMg <= 400 { return "Moderate" }
        return "High — consider reducing"
    }
    private var caffeineStatusColor: Color { today.caffeineMg > 400 ? .red : .green }

    private var sleepStatus: String {
        if today.sleepHours < 6 { return "Too little" }
        if today.sleepHours <= 9 { return "Great" }
        return "A lot — check consistency"
    }
    private var sleepStatusColor: Color { today.sleepHours < 6 || today.sleepHours > 9 ? .orange : .green }

    private var stepsStatus: String {
        if today.steps < 3000 { return "Very low" }
        if today.steps < 7500 { return "Getting there" }
        if today.steps < 10000 { return "Almost there!" }
        return "Goal reached!"
    }
    private var stepsStatusColor: Color { today.steps >= 10000 ? .green : (today.steps < 3000 ? .red : .orange) }

    private var workoutStatus: String {
        if today.workouts.isEmpty { return "No workout logged" }
        if today.totalWorkoutMinutes < 20 { return "Light activity" }
        if today.totalWorkoutMinutes < 45 { return "Good effort" }
        return "Excellent!"
    }
    private var workoutStatusColor: Color { today.workouts.isEmpty ? .red : (today.totalWorkoutMinutes >= 30 ? .green : .orange) }
}

struct SummaryCard: View {
    let title: String
    let value: String
    let unit: String
    let icon: String
    let color: Color
    let status: String
    let statusColor: Color
    let progress: Double

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .foregroundStyle(color)
                Text(title)
                    .font(.headline)
                    .foregroundStyle(color)
                Spacer()
            }
            HStack(alignment: .lastTextBaseline, spacing: 4) {
                Text(value)
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                Text(unit)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            ProgressView(value: min(progress, 1.0))
                .tint(color)
            Text(status)
                .font(.caption)
                .foregroundStyle(statusColor)
                .bold()
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
        .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(color.opacity(0.3), lineWidth: 1))
    }
}
