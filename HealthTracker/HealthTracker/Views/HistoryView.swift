import SwiftUI
import Charts

struct HistoryView: View {
    @EnvironmentObject var store: HealthStore
    @State private var selectedMetric: HealthMetric = .sleep

    enum HealthMetric: String, CaseIterable {
        case caffeine = "Caffeine"
        case sleep = "Sleep"
        case steps = "Steps"
        case workout = "Workout"

        var icon: String {
            switch self {
            case .caffeine: return "cup.and.saucer.fill"
            case .sleep: return "moon.zzz.fill"
            case .steps: return "figure.walk"
            case .workout: return "bolt.heart.fill"
            }
        }

        var color: Color {
            switch self {
            case .caffeine: return .brown
            case .sleep: return .indigo
            case .steps: return .orange
            case .workout: return .red
            }
        }
    }

    var weekData: [HealthEntry] { store.weekSummary() }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("7-Day History")
                .font(.largeTitle.bold())
                .padding(.horizontal, 24)
                .padding(.top, 24)

            Picker("Metric", selection: $selectedMetric) {
                ForEach(HealthMetric.allCases, id: \.self) { m in
                    Label(m.rawValue, systemImage: m.icon).tag(m)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, 24)

            chartView
                .padding(.horizontal, 24)
                .frame(height: 220)

            Divider()

            weekListView
                .padding(.horizontal, 24)

            Spacer()
        }
    }

    @ViewBuilder
    private var chartView: some View {
        Chart(weekData) { entry in
            let label = shortDay(entry.date)
            switch selectedMetric {
            case .caffeine:
                BarMark(x: .value("Day", label), y: .value("mg", entry.caffeineMg))
                    .foregroundStyle(Color.brown.gradient)
            case .sleep:
                BarMark(x: .value("Day", label), y: .value("hrs", entry.sleepHours))
                    .foregroundStyle(Color.indigo.gradient)
            case .steps:
                BarMark(x: .value("Day", label), y: .value("steps", entry.steps))
                    .foregroundStyle(Color.orange.gradient)
            case .workout:
                BarMark(x: .value("Day", label), y: .value("min", entry.totalWorkoutMinutes))
                    .foregroundStyle(Color.red.gradient)
            }
        }
    }

    private var weekListView: some View {
        VStack(spacing: 0) {
            ForEach(weekData.reversed()) { entry in
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.date, style: .date)
                            .font(.subheadline.bold())
                        if Calendar.current.isDateInToday(entry.date) {
                            Text("Today")
                                .font(.caption2)
                                .foregroundStyle(.green)
                        }
                    }
                    .frame(width: 110, alignment: .leading)

                    Spacer()

                    statBadge(value: "\(entry.caffeineMg)mg", icon: "cup.and.saucer.fill", color: .brown)
                    statBadge(value: String(format: "%.1fh", entry.sleepHours), icon: "moon.zzz.fill", color: .indigo)
                    statBadge(value: "\(entry.steps/1000)k", icon: "figure.walk", color: .orange)
                    statBadge(value: "\(entry.totalWorkoutMinutes)m", icon: "bolt.heart.fill", color: .red)
                }
                .padding(.vertical, 10)
                .padding(.horizontal, 4)

                if entry.id != weekData.first?.id {
                    Divider()
                }
            }
        }
    }

    private func statBadge(value: String, icon: String, color: Color) -> some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption2)
                .foregroundStyle(color)
            Text(value)
                .font(.caption.monospacedDigit())
        }
        .frame(minWidth: 50)
    }

    private func shortDay(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "EEE"
        return fmt.string(from: date)
    }
}
