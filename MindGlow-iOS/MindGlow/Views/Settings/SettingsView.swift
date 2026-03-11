import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var notificationsEnabled = true
    @State private var dailyReminder = true
    @State private var meditationGoal = 20
    @State private var showSignOutAlert = false
    
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Account") {
                    HStack {
                        Text("Name")
                        Spacer()
                        Text(auth.user?.name ?? "—")
                            .foregroundColor(.secondary)
                    }
                    HStack {
                        Text("Email")
                        Spacer()
                        Text(auth.user?.email ?? "—")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section("Goals") {
                    Stepper("Meditation goal: \(meditationGoal) min/day", value: $meditationGoal, in: 5...60, step: 5)
                }
                
                Section("Notifications") {
                    Toggle("Notifications", isOn: $notificationsEnabled)
                    Toggle("Daily reminder", isOn: $dailyReminder)
                        .disabled(!notificationsEnabled)
                }
                
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text(AppConfig.version)
                            .foregroundColor(.secondary)
                    }
                    HStack {
                        Text("Made by")
                        Spacer()
                        Text(AppConfig.company)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.trailing)
                    }
                }
                
                Section {
                    Button(role: .destructive) {
                        showSignOutAlert = true
                    } label: {
                        Text("Sign out")
                            .frame(maxWidth: .infinity)
                    }
                }
            }
            .navigationTitle("Settings")
            .alert("Sign out?", isPresented: $showSignOutAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Sign out", role: .destructive) {
                    auth.signOut()
                }
            } message: {
                Text("You can sign back in anytime.")
            }
        }
    }
}
