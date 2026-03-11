import SwiftUI

struct MeditationView: View {
    @EnvironmentObject var auth: AuthViewModel
    @State private var selectedDuration: Int = 5
    @State private var isMeditating = false
    @State private var remainingSeconds = 0
    @State private var timer: Timer?
    
    private let durations = [5, 10, 15, 20]
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Find your calm")
                        .font(.title2.bold())
                    
                    if isMeditating {
                        meditationTimerCard
                    } else {
                        durationPicker
                        startCard
                        suggestedSessions
                    }
                }
                .padding()
            }
            .navigationTitle("Meditate")
            .background(Color(.systemGroupedBackground))
        }
    }
    
    private var durationPicker: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Duration")
                .font(.headline)
            HStack(spacing: 12) {
                ForEach(durations, id: \.self) { min in
                    Button {
                        selectedDuration = min
                    } label: {
                        Text("\(min) min")
                            .font(.subheadline.weight(selectedDuration == min ? .semibold : .regular))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(selectedDuration == min ? accent : Color(.secondarySystemGroupedBackground))
                            .foregroundColor(selectedDuration == min ? .white : .primary)
                            .cornerRadius(10)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(12)
    }
    
    private var startCard: some View {
        Button {
            remainingSeconds = selectedDuration * 60
            isMeditating = true
            startTimer()
        } label: {
            HStack {
                Image(systemName: "play.circle.fill")
                    .font(.title)
                Text("Start \(selectedDuration)-minute session")
                    .font(.headline)
                Spacer()
            }
            .padding()
            .background(accent.opacity(0.2))
            .foregroundColor(accent)
            .cornerRadius(12)
        }
        .buttonStyle(.plain)
    }
    
    private var suggestedSessions: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Suggested")
                .font(.headline)
            VStack(spacing: 8) {
                SessionRow(title: "Morning clarity", duration: 10, icon: "sunrise.fill")
                SessionRow(title: "Stress relief", duration: 15, icon: "leaf.fill")
                SessionRow(title: "Sleep preparation", duration: 20, icon: "moon.stars.fill")
            }
        }
    }
    
    private var meditationTimerCard: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .stroke(Color(.systemGray5), lineWidth: 8)
                    .frame(width: 160, height: 160)
                Circle()
                    .trim(from: 0, to: CGFloat(remainingSeconds) / CGFloat(selectedDuration * 60))
                    .stroke(accent, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .frame(width: 160, height: 160)
                    .rotationEffect(.degrees(-90))
                Text(timeString(from: remainingSeconds))
                    .font(.system(size: 36, weight: .medium, design: .rounded))
            }
            Text("Breathe slowly and focus on the present.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Button("End session") {
                stopTimer()
                isMeditating = false
            }
            .font(.headline)
            .foregroundColor(.red)
        }
        .frame(maxWidth: .infinity)
        .padding(32)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
    
    private func timeString(from seconds: Int) -> String {
        let m = seconds / 60
        let s = seconds % 60
        return String(format: "%d:%02d", m, s)
    }
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            if remainingSeconds > 0 {
                remainingSeconds -= 1
            } else {
                stopTimer()
                isMeditating = false
            }
        }
        RunLoop.main.add(timer!, forMode: .common)
    }
    
    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
}

struct SessionRow: View {
    let title: String
    let duration: Int
    let icon: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(Color(red: 0.39, green: 0.4, blue: 0.95))
            Text(title)
                .font(.subheadline)
            Spacer()
            Text("\(duration) min")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(10)
    }
}
