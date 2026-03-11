import SwiftUI

struct CommunityView: View {
    @State private var searchText = ""
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Connect with others")
                        .font(.title2.bold())
                    
                    featuredCard
                    recentActivity
                    groupsPreview
                }
                .padding()
            }
            .searchable(text: $searchText, prompt: "Search posts or people")
            .navigationTitle("Community")
            .background(Color(.systemGroupedBackground))
        }
    }
    
    private var featuredCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.3.fill")
                    .font(.title2)
                    .foregroundColor(accent)
                Text("MindGlow community")
                    .font(.headline)
            }
            Text("Share your journey, get support, and celebrate wins with others on the path to wellness.")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
    
    private var recentActivity: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent activity")
                .font(.headline)
            VStack(spacing: 8) {
                ActivityRow(
                    icon: "leaf.fill",
                    title: "Weekly meditation challenge",
                    subtitle: "Join 120 others this week"
                )
                ActivityRow(
                    icon: "heart.fill",
                    title: "Gratitude thread",
                    subtitle: "Share one thing you're grateful for"
                )
                ActivityRow(
                    icon: "book.fill",
                    title: "Journaling tips",
                    subtitle: "Discussion and prompts"
                )
            }
        }
    }
    
    private var groupsPreview: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Groups")
                .font(.headline)
            HStack(spacing: 12) {
                GroupChip(title: "Beginners", icon: "sparkles")
                GroupChip(title: "Daily practice", icon: "flame.fill")
                GroupChip(title: "Sleep & rest", icon: "moon.stars.fill")
            }
        }
    }
}

struct ActivityRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline.bold())
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(10)
    }
}

struct GroupChip: View {
    let title: String
    let icon: String
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption)
            Text(title)
                .font(.caption)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(red: 0.39, green: 0.4, blue: 0.95).opacity(0.15))
        .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
        .cornerRadius(20)
    }
}
