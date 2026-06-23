import SwiftUI

struct TodayView: View {
    @EnvironmentObject var store: HealthStore
    @State private var showAddWorkout = false
    @State private var newWorkoutType: WorkoutType = .running
    @State private var newWorkoutDuration: String = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                headerSection
                metricsGrid
                workoutsSection
            }
            .padding(24)
        }
        .sheet(isPresented: $showAddWorkout) {
            addWorkoutSheet
        }
    }

    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Today's Health")
                    .font(.largeTitle.bold())
                Text(Date(), style: .date)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Button(action: { store.saveToday() }) {
                Label("Save", systemImage: "checkmark.circle.fill")
                    .font(.headline)
            }
            .buttonStyle(.borderedProminent)
            .tint(.green)
        }
    }

    private var metricsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            MetricCard(
                icon: "cup.and.saucer.fill",
                title: "Caffeine",
                color: .brown,
                content: {
                    AnyView(VStack(spacing: 8) {
                        Text("\(store.todayEntry.caffeineMg) mg")
                            .font(.title2.bold())
                        Stepper("", value: $store.todayEntry.caffeineMg, in: 0...2000, step: 25)
                            .labelsHidden()
                        HStack(spacing: 8) {
                            ForEach([80, 150, 200], id: \.self) { amount in
                                Button("+\(amount)") {
                                    store.todayEntry.caffeineMg += amount
                                }
                                .buttonStyle(.bordered)
                                .font(.caption)
                            }
                        }
                    })
                }
            )

            MetricCard(
                icon: "moon.zzz.fill",
                title: "Sleep",
                color: .indigo,
                content: {
                    AnyView(VStack(spacing: 8) {
                        Text(String(format: "%.1f hrs", store.todayEntry.sleepHours))
                            .font(.title2.bold())
                        Slider(value: $store.todayEntry.sleepHours, in: 0...12, step: 0.5)
                            .tint(.indigo)
                        HStack {
                            Text("0h")
                            Spacer()
                            Text("12h")
                        }
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    })
                }
            )

            MetricCard(
                icon: "figure.walk",
                title: "Steps",
                color: .orange,
                content: {
                    AnyView(VStack(spacing: 8) {
                        Text("\(store.todayEntry.steps.formatted())")
                            .font(.title2.bold())
                        Stepper("", value: $store.todayEntry.steps, in: 0...100000, step: 500)
                            .labelsHidden()
                        HStack(spacing: 8) {
                            ForEach([1000, 2500, 5000], id: \.self) { count in
                                Button("+\(count/1000)k") {
                                    store.todayEntry.steps += count
                                }
                                .buttonStyle(.bordered)
                                .font(.caption)
                            }
                        }
                    })
                }
            )

            MetricCard(
                icon: "bolt.heart.fill",
                title: "Workouts",
                color: .red,
                content: {
                    AnyView(VStack(spacing: 8) {
                        Text("\(store.todayEntry.totalWorkoutMinutes) min")
                            .font(.title2.bold())
                        Text("\(store.todayEntry.workouts.count) session\(store.todayEntry.workouts.count == 1 ? "" : "s")")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Button(action: { showAddWorkout = true }) {
                            Label("Add Workout", systemImage: "plus")
                                .font(.caption)
                        }
                        .buttonStyle(.bordered)
                    })
                }
            )
        }
    }

    private var workoutsSection: some View {
        Group {
            if !store.todayEntry.workouts.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Workout Sessions")
                        .font(.headline)
                    ForEach(store.todayEntry.workouts) { workout in
                        HStack {
                            Image(systemName: workout.type.icon)
                                .foregroundStyle(.red)
                                .frame(width: 24)
                            Text(workout.type.rawValue)
                            Spacer()
                            Text("\(workout.durationMinutes) min")
                                .foregroundStyle(.secondary)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .onDelete { offsets in
                        store.removeWorkout(at: offsets)
                    }
                }
            }
        }
    }

    private var addWorkoutSheet: some View {
        VStack(spacing: 20) {
            Text("Add Workout")
                .font(.title2.bold())

            Picker("Type", selection: $newWorkoutType) {
                ForEach(WorkoutType.allCases, id: \.self) { type in
                    Label(type.rawValue, systemImage: type.icon).tag(type)
                }
            }
            .pickerStyle(.menu)
            .frame(maxWidth: .infinity)

            HStack {
                Text("Duration (minutes):")
                TextField("e.g. 30", text: $newWorkoutDuration)
                    .textFieldStyle(.roundedBorder)
                    .frame(width: 80)
            }

            HStack(spacing: 12) {
                Button("Cancel") {
                    showAddWorkout = false
                    newWorkoutDuration = ""
                }
                .buttonStyle(.bordered)

                Button("Add") {
                    if let mins = Int(newWorkoutDuration), mins > 0 {
                        store.addWorkout(WorkoutSession(type: newWorkoutType, durationMinutes: mins))
                        showAddWorkout = false
                        newWorkoutDuration = ""
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(Int(newWorkoutDuration) == nil)
            }
        }
        .padding(32)
        .frame(width: 360)
    }
}

struct MetricCard<Content: View>: View {
    let icon: String
    let title: String
    let color: Color
    let content: () -> AnyView

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundStyle(color)
                    .font(.title3)
                Text(title)
                    .font(.headline)
                    .foregroundStyle(color)
            }
            content()
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .strokeBorder(color.opacity(0.3), lineWidth: 1)
        )
    }
}
