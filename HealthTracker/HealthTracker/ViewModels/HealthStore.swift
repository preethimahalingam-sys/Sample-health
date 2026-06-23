import Foundation
import Combine

class HealthStore: ObservableObject {
    @Published var entries: [HealthEntry] = []
    @Published var todayEntry: HealthEntry

    private let saveKey = "health_entries"

    init() {
        let today = Calendar.current.startOfDay(for: Date())
        todayEntry = HealthEntry(date: today, caffeineMg: 0, sleepHours: 0, steps: 0, workouts: [])
        load()
        ensureTodayEntry()
    }

    private func ensureTodayEntry() {
        let today = Calendar.current.startOfDay(for: Date())
        if let existing = entries.first(where: { Calendar.current.isDate($0.date, inSameDayAs: today) }) {
            todayEntry = existing
        } else {
            todayEntry = HealthEntry(date: today, caffeineMg: 0, sleepHours: 0, steps: 0, workouts: [])
        }
    }

    func saveToday() {
        let today = Calendar.current.startOfDay(for: Date())
        if let idx = entries.firstIndex(where: { Calendar.current.isDate($0.date, inSameDayAs: today) }) {
            entries[idx] = todayEntry
        } else {
            entries.insert(todayEntry, at: 0)
        }
        save()
    }

    func addWorkout(_ workout: WorkoutSession) {
        todayEntry.workouts.append(workout)
        saveToday()
    }

    func removeWorkout(at offsets: IndexSet) {
        todayEntry.workouts.remove(atOffsets: offsets)
        saveToday()
    }

    private func save() {
        if let data = try? JSONEncoder().encode(entries) {
            UserDefaults.standard.set(data, forKey: saveKey)
        }
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: saveKey),
              let saved = try? JSONDecoder().decode([HealthEntry].self, from: data) else { return }
        entries = saved
    }

    func weekSummary() -> [HealthEntry] {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        return (0..<7).compactMap { offset -> HealthEntry? in
            guard let date = cal.date(byAdding: .day, value: -offset, to: today) else { return nil }
            return entries.first(where: { cal.isDate($0.date, inSameDayAs: date) })
                ?? HealthEntry(date: date, caffeineMg: 0, sleepHours: 0, steps: 0, workouts: [])
        }.reversed()
    }
}
