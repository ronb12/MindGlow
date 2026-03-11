import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(0)
            MeditationView()
                .tabItem { Label("Meditate", systemImage: "leaf.fill") }
                .tag(1)
            BreatheView()
                .tabItem { Label("Breathe", systemImage: "wind") }
                .tag(2)
            WellnessView()
                .tabItem { Label("Wellness", systemImage: "heart.fill") }
                .tag(3)
            JournalView()
                .tabItem { Label("Journal", systemImage: "book.fill") }
                .tag(4)
            CommunityView()
                .tabItem { Label("Community", systemImage: "person.3.fill") }
                .tag(5)
            LibraryView()
                .tabItem { Label("Library", systemImage: "books.vertical.fill") }
                .tag(6)
            StoreTabView()
                .tabItem { Label("Store", systemImage: "cart.fill") }
                .tag(7)
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
                .tag(8)
        }
        .tint(Color(red: 0.39, green: 0.4, blue: 0.95))
    }
}
