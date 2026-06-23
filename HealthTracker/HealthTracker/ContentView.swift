import SwiftUI

struct ContentView: View {
    @StateObject private var store = HealthStore()

    var body: some View {
        NavigationSplitView {
            List {
                NavigationLink(destination: TodayView().environmentObject(store)) {
                    Label("Today", systemImage: "sun.max.fill")
                }
                NavigationLink(destination: SummaryView().environmentObject(store)) {
                    Label("Summary", systemImage: "chart.pie.fill")
                }
                NavigationLink(destination: HistoryView().environmentObject(store)) {
                    Label("History", systemImage: "calendar")
                }
            }
            .listStyle(.sidebar)
            .navigationTitle("Health Tracker")
        } detail: {
            TodayView().environmentObject(store)
        }
    }
}
