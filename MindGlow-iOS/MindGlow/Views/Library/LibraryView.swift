import SwiftUI

struct LibraryItem: Identifiable {
    let id: String
    let title: String
    let subtitle: String
    let type: String
    let duration: String?
    let icon: String
}

struct LibraryView: View {
    @State private var searchText = ""
    @State private var selectedCategory: String = "All"
    
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    private let categories = ["All", "Meditation", "Music", "Sleep", "Focus"]
    
    private var sampleItems: [LibraryItem] {
        [
            LibraryItem(id: "1", title: "Morning calm", subtitle: "Start your day mindfully", type: "Meditation", duration: "10 min", icon: "sunrise.fill"),
            LibraryItem(id: "2", title: "Anxiety relief", subtitle: "Guided breathing", type: "Meditation", duration: "15 min", icon: "leaf.fill"),
            LibraryItem(id: "3", title: "Deep sleep", subtitle: "Wind down for rest", type: "Sleep", duration: "20 min", icon: "moon.stars.fill"),
            LibraryItem(id: "4", title: "Focus flow", subtitle: "Concentration practice", type: "Focus", duration: "12 min", icon: "brain.head.profile"),
            LibraryItem(id: "5", title: "Nature sounds", subtitle: "Rain and forest", type: "Music", duration: nil, icon: "leaf.circle.fill"),
        ]
    }
    
    var filteredItems: [LibraryItem] {
        let byCategory = selectedCategory == "All"
            ? sampleItems
            : sampleItems.filter { $0.type == selectedCategory }
        if searchText.isEmpty { return byCategory }
        return byCategory.filter {
            $0.title.localizedCaseInsensitiveContains(searchText) ||
            $0.subtitle.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                categoryPicker
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 16) {
                        Text("Library")
                            .font(.title2.bold())
                            .padding(.horizontal)
                        ForEach(filteredItems) { item in
                            LibraryRowView(item: item)
                        }
                    }
                    .padding()
                }
            }
            .searchable(text: $searchText, prompt: "Search library")
            .navigationTitle("Library")
            .background(Color(.systemGroupedBackground))
        }
    }
    
    private var categoryPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(categories, id: \.self) { cat in
                    Button {
                        selectedCategory = cat
                    } label: {
                        Text(cat)
                            .font(.subheadline.weight(selectedCategory == cat ? .semibold : .regular))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(selectedCategory == cat ? accent : Color(.secondarySystemGroupedBackground))
                            .foregroundColor(selectedCategory == cat ? .white : .primary)
                            .cornerRadius(20)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 12)
        .background(Color(.systemGroupedBackground))
    }
}

struct LibraryRowView: View {
    let item: LibraryItem
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    
    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: item.icon)
                .font(.title2)
                .foregroundColor(accent)
                .frame(width: 44, height: 44)
                .background(accent.opacity(0.15))
                .cornerRadius(10)
            VStack(alignment: .leading, spacing: 2) {
                Text(item.title)
                    .font(.headline)
                Text(item.subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            if let dur = item.duration {
                Text(dur)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Image(systemName: "play.circle.fill")
                .foregroundColor(accent)
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
}
