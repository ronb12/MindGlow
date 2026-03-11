import Foundation
import SwiftUI
import FirebaseAuth

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = true
    @Published var user: MindGlowUser?
    @Published var errorMessage: String?
    
    private var authHandle: AuthStateDidChangeListenerHandle?
    
    init() {
        authHandle = AuthService.shared.authStateListener { [weak self] firebaseUser in
            Task { @MainActor in
                await self?.handleAuthChange(firebaseUser)
            }
        }
    }
    
    deinit {
        if let h = authHandle {
            Auth.auth().removeStateDidChangeListener(h)
        }
    }
    
    private func handleAuthChange(_ firebaseUser: FirebaseAuth.User?) async {
        guard let uid = firebaseUser?.uid else {
            isAuthenticated = false
            user = nil
            isLoading = false
            return
        }
        do {
            user = try await AuthService.shared.fetchMindGlowUser(uid: uid)
            if user == nil {
                try AuthService.shared.createOrUpdateUserDoc(
                    uid: uid,
                    name: firebaseUser?.displayName,
                    email: firebaseUser?.email
                )
                user = try await AuthService.shared.fetchMindGlowUser(uid: uid)
            }
            isAuthenticated = true
        } catch {
            user = MindGlowUser(
                id: uid,
                name: firebaseUser?.displayName,
                email: firebaseUser?.email,
                role: AppConfig.ownerEmails.contains(firebaseUser?.email ?? "") ? "owner" : "user"
            )
            isAuthenticated = true
        }
        isLoading = false
    }
    
    func signIn(email: String, password: String) async {
        errorMessage = nil
        do {
            try await AuthService.shared.signIn(email: email, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func signUp(name: String, email: String, password: String) async {
        errorMessage = nil
        do {
            try await AuthService.shared.signUp(name: name, email: email, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func signOut() {
        try? AuthService.shared.signOut()
        user = nil
        isAuthenticated = false
    }
    
    func resetPassword(email: String) async {
        errorMessage = nil
        do {
            try await AuthService.shared.resetPassword(email: email)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
