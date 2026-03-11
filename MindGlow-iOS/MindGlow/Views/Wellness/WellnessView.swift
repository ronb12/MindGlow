import SwiftUI

struct WellnessView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var moodRating: Int = 0
    @State private var waterGlasses: Int = 0
    @State private var showMoodSheet = false
    @State private var showWaterSheet = false
    
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    private let goalWater = 8
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Your wellness at a glance")
                        .font(.title2.bold())
                    
                    wellnessScoreCard
                    moodCard
                    waterCard
                    quickTips
                }
                .padding()
            }
            .navigationTitle("Wellness")
            .background(Color(.systemGroupedBackground))
            .sheet(isPresented: $showMoodSheet) { moodSheet }
            .sheet(isPresented: $showWaterSheet) { waterSheet }
        }
    }
    
    private var wellnessScoreCard: some View {
        VStack(spacing: 8) {
            Text("Wellness score")
                .font(.headline)
            Text("\(auth.user?.wellnessScore ?? 0)")
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundColor(accent)
            Text("Based on mood, habits, and consistency")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
    
    private var moodCard: some View {
        Button {
            showMoodSheet = true
        } label: {
            HStack {
                Image(systemName: "face.smiling.fill")
                    .font(.title2)
                    .foregroundColor(accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text("How are you feeling?")
                        .font(.headline)
                    Text(moodRating > 0 ? "Rated \(moodRating)/5 today" : "Tap to log your mood")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.secondarySystemGroupedBackground))
            .cornerRadius(12)
        }
        .buttonStyle(.plain)
    }
    
    private var waterCard: some View {
        Button {
            showWaterSheet = true
        } label: {
            HStack {
                Image(systemName: "drop.fill")
                    .font(.title2)
                    .foregroundColor(accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Water intake")
                        .font(.headline)
                    Text("\(waterGlasses) / \(goalWater) glasses today")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.secondarySystemGroupedBackground))
            .cornerRadius(12)
        }
        .buttonStyle(.plain)
    }
    
    private var quickTips: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tips")
                .font(.headline)
            VStack(alignment: .leading, spacing: 8) {
                TipRow(icon: "leaf.fill", text: "Meditate daily to build your streak")
                TipRow(icon: "drop.fill", text: "Stay hydrated for better focus")
                TipRow(icon: "moon.stars.fill", text: "Consistent sleep supports wellness")
            }
        }
    }
    
    private var moodSheet: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Rate your mood (1–5)")
                    .font(.headline)
                HStack(spacing: 12) {
                    ForEach(1...5, id: \.self) { n in
                        Button {
                            moodRating = n
                        } label: {
                            Image(systemName: n <= moodRating ? "star.fill" : "star")
                                .font(.title)
                                .foregroundColor(n <= moodRating ? .yellow : .gray)
                        }
                    }
                }
                Spacer()
            }
            .padding()
            .navigationTitle("Log mood")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { showMoodSheet = false }
                }
            }
        }
    }
    
    private var waterSheet: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Stepper("Glasses today: \(waterGlasses)", value: $waterGlasses, in: 0...20)
                    .padding()
                Text("Goal: \(goalWater) glasses")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Spacer()
            }
            .padding()
            .navigationTitle("Water intake")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { showWaterSheet = false }
                }
            }
        }
    }
}

struct TipRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
            Text(text)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(10)
    }
}
