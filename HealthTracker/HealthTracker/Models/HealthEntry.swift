import Foundation

struct WorkoutSession: Codable, Identifiable {
    var id = UUID()
    var type: WorkoutType
    var durationMinutes: Int
}

enum WorkoutType: String, Codable, CaseIterable {
    case running = "Running"
    case cycling = "Cycling"
    case swimming = "Swimming"
    case weightLifting = "Weight Lifting"
    case yoga = "Yoga"
    case hiit = "HIIT"
    case walking = "Walking"
    case other = "Other"

    var icon: String {
        switch self {
        case .running: return "figure.run"
        case .cycling: return "figure.outdoor.cycle"
        case .swimming: return "figure.pool.swim"
        case .weightLifting: return "dumbbell"
        case .yoga: return "figure.yoga"
        case .hiit: return "bolt.heart"
        case .walking: return "figure.walk"
        case .other: return "sportscourt"
        }
    }
}

struct HealthEntry: Codable, Identifiable {
    var id = UUID()
    var date: Date
    var caffeineMg: Int
    var sleepHours: Double
    var steps: Int
    var workouts: [WorkoutSession]

    var totalWorkoutMinutes: Int {
        workouts.reduce(0) { $0 + $1.durationMinutes }
    }
}
