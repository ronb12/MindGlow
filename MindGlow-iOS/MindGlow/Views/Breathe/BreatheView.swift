import SwiftUI

struct BreatheView: View {
    @State private var isActive = false
    @State private var phase: BreathePhase = .inhale
    @State private var cycleCount = 0
    @State private var scale: CGFloat = 0.6
    @State private var timer: Timer?
    
    private let accent = Color(red: 0.39, green: 0.4, blue: 0.95)
    private let inhaleSeconds = 4
    private let holdSeconds = 2
    private let exhaleSeconds = 4
    
    enum BreathePhase: String {
        case inhale = "Inhale"
        case hold = "Hold"
        case exhale = "Exhale"
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                if isActive {
                    breatheAnimation
                    Text(phase.rawValue)
                        .font(.title2.bold())
                        .foregroundColor(accent)
                    Text("Cycle \(cycleCount)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Button("Stop") {
                        stopBreathing()
                    }
                    .foregroundColor(.secondary)
                } else {
                    breatheIdle
                    Text("Tap to begin a calming breath exercise")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                    Button {
                        startBreathing()
                    } label: {
                        Text("Start breathing")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(accent)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                    .padding(.horizontal, 40)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                LinearGradient(
                    colors: [accent.opacity(0.08), Color(.systemGroupedBackground)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationTitle("Breathe")
        }
    }
    
    private var breatheIdle: some View {
        Circle()
            .fill(accent.opacity(0.3))
            .frame(width: 160, height: 160)
            .overlay(
                Image(systemName: "wind")
                    .font(.system(size: 48))
                    .foregroundColor(accent)
            )
    }
    
    private var breatheAnimation: some View {
        Circle()
            .fill(accent.opacity(0.25))
            .frame(width: 180, height: 180)
            .scaleEffect(scale)
            .animation(.easeInOut(duration: Double(phase == .inhale ? inhaleSeconds : (phase == .exhale ? exhaleSeconds : holdSeconds))), value: scale)
    }
    
    private func startBreathing() {
        isActive = true
        cycleCount = 0
        runPhase(.inhale)
    }
    
    private func runPhase(_ next: BreathePhase) {
        phase = next
        switch next {
        case .inhale:
            scale = 1.2
            scheduleNext(after: inhaleSeconds) { runPhase(.hold) }
        case .hold:
            scheduleNext(after: holdSeconds) { runPhase(.exhale) }
        case .exhale:
            scale = 0.6
            scheduleNext(after: exhaleSeconds) {
                cycleCount += 1
                runPhase(.inhale)
            }
        }
    }
    
    private func scheduleNext(after seconds: Int, action: @escaping () -> Void) {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: TimeInterval(seconds), repeats: false) { _ in
            action()
        }
        RunLoop.main.add(timer!, forMode: .common)
    }
    
    private func stopBreathing() {
        timer?.invalidate()
        timer = nil
        isActive = false
        scale = 0.6
    }
}
