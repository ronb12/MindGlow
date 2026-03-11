// MindGlow iOS App - 100% Swift
// A product of Bradley Virtual Solutions, LLC

import SwiftUI
import FirebaseCore

@main
struct MindGlowApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    
    init() {
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authViewModel)
        }
    }
}

struct RootView: View {
    @EnvironmentObject var auth: AuthViewModel
    
    var body: some View {
        Group {
            if auth.isLoading {
                LoadingView()
            } else if auth.isAuthenticated {
                MainTabView()
            } else {
                AuthContainerView()
            }
        }
        .animation(.easeInOut, value: auth.isAuthenticated)
    }
}

struct LoadingView: View {
    var body: some View {
        ZStack {
            Color(.systemBackground).ignoresSafeArea()
            VStack(spacing: 16) {
                ProgressView()
                    .scaleEffect(1.5)
                Text("Loading MindGlow...")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
    }
}
