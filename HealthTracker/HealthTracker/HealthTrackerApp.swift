import SwiftUI

@main
struct HealthTrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .windowStyle(.titleBar)
        .defaultSize(width: 900, height: 680)
        .commands {
            CommandGroup(replacing: .newItem) {}
        }
    }
}
