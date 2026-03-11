import SwiftUI

struct JournalEntry: Identifiable {
    let id: String
    var title: String
    var content: String
    var createdAt: Date
}

struct JournalView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var entries: [JournalEntry] = []
    @State private var showNewEntry = false
    @State private var selectedEntry: JournalEntry?
    
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    
    var body: some View {
        NavigationStack {
            Group {
                if entries.isEmpty {
                    emptyState
                } else {
                    List {
                        ForEach(entries.sorted { $0.createdAt > $1.createdAt }) { entry in
                            Button {
                                selectedEntry = entry
                            } label: {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(entry.title.isEmpty ? "Untitled" : entry.title)
                                        .font(.headline)
                                    Text(entry.content)
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                        .lineLimit(2)
                                    Text(entry.createdAt.formatted(date: .abbreviated, time: .shortened))
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                                .padding(.vertical, 4)
                            }
                        }
                        .onDelete(perform: deleteEntries)
                    }
                }
            }
            .navigationTitle("Journal")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showNewEntry = true
                    } label: {
                        Image(systemName: "square.and.pencil")
                    }
                }
            }
            .sheet(isPresented: $showNewEntry) {
                NewJournalEntryView { title, content in
                    let entry = JournalEntry(
                        id: UUID().uuidString,
                        title: title,
                        content: content,
                        createdAt: Date()
                    )
                    entries.append(entry)
                    showNewEntry = false
                }
            }
            .sheet(item: $selectedEntry) { entry in
                JournalEntryDetailView(entry: entry) {
                    selectedEntry = nil
                }
            }
        }
    }
    
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "book.closed.fill")
                .font(.system(size: 56))
                .foregroundColor(accent.opacity(0.6))
            Text("No entries yet")
                .font(.title2.bold())
            Text("Start writing to reflect on your day and track your thoughts.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Button {
                showNewEntry = true
            } label: {
                Text("New entry")
                    .font(.headline)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(accent)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private func deleteEntries(at offsets: IndexSet) {
        entries.remove(atOffsets: offsets)
    }
}

struct NewJournalEntryView: View {
    @State private var title = ""
    @State private var content = ""
    let onSave: (String, String) -> Void
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            Form {
                TextField("Title", text: $title)
                TextField("What's on your mind?", text: $content, axis: .vertical)
                    .lineLimit(5...15)
            }
            .navigationTitle("New entry")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        onSave(title, content)
                    }
                    .disabled(content.isEmpty)
                }
            }
        }
    }
}

struct JournalEntryDetailView: View {
    let entry: JournalEntry
    let onDismiss: () -> Void
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(entry.createdAt.formatted(date: .long, time: .shortened))
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(entry.title.isEmpty ? "Untitled" : entry.title)
                        .font(.title2.bold())
                    Text(entry.content)
                        .font(.body)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            .navigationTitle("Entry")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        onDismiss()
                        dismiss()
                    }
                }
            }
        }
    }
}

extension JournalEntry: Hashable {
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
    static func == (lhs: JournalEntry, rhs: JournalEntry) -> Bool { lhs.id == rhs.id }
}
