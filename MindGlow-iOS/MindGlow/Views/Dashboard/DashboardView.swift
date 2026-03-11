import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var auth: AuthViewModel
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Welcome back, \(auth.user?.name ?? "there")")
                        .font(.title2.bold())
                    
                    // Daily quote
                    QuoteCard()
                    
                    // Stats
                    if let u = auth.user {
                        HStack(spacing: 16) {
                            StatCard(title: "Streak", value: "\(u.streak)", unit: "days")
                            StatCard(title: "Minutes", value: "\(u.totalMinutes)", unit: "meditation")
                            StatCard(title: "Wellness", value: "\(u.wellnessScore)", unit: "score")
                        }
                    }
                    
                    // Quick actions
                    Text("Quick actions")
                        .font(.headline)
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        QuickActionButton(title: "5 min meditate", icon: "leaf.fill") {}
                        QuickActionButton(title: "Breathe", icon: "wind") {}
                        QuickActionButton(title: "Mood check", icon: "face.smiling") {}
                        QuickActionButton(title: "Log water", icon: "drop.fill") {}
                    }
                    
                    // Today's progress
                    Text("Today's progress")
                        .font(.headline)
                    VStack(spacing: 8) {
                        ProgressRow(title: "Meditation", current: 0, goal: auth.user?.meditationGoal ?? 20, unit: "min")
                        ProgressRow(title: "Water", current: auth.user?.waterIntake ?? 0, goal: 8, unit: "glasses")
                    }
                }
                .padding()
            }
            .navigationTitle("MindGlow")
            .background(Color(.systemGroupedBackground))
        }
    }
}

struct QuoteCard: View {
    private let quote = "The present moment is the only moment available to us, and it is the door to all moments."
    private let author = "Thich Nhat Hanh"
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(quote)
                .font(.body.italic())
            Text("— \(author)")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(red: 0.39, green: 0.4, blue: 0.95).opacity(0.15))
        .cornerRadius(12)
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let unit: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2.bold())
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                Text(title)
                    .font(.caption)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.secondarySystemGroupedBackground))
            .cornerRadius(12)
        }
        .buttonStyle(.plain)
    }
}

struct ProgressRow: View {
    let title: String
    let current: Int
    let goal: Int
    let unit: String
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Text("\(current) / \(goal) \(unit)")
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(8)
    }
}
