import Foundation
import FirebaseAuth
import FirebaseFirestore

final class AuthService {
    static let shared = AuthService()
    private let db = Firestore.firestore()
    
    private init() {}
    
    func signIn(email: String, password: String) async throws {
        try await Auth.auth().signIn(withEmail: email, password: password)
    }
    
    func signUp(name: String, email: String, password: String) async throws {
        let result = try await Auth.auth().createUser(withEmail: email, password: password)
        let changeRequest = result.user.createProfileChangeRequest()
        changeRequest.displayName = name
        try await changeRequest.commitChanges()
        try await createOrUpdateUserDoc(uid: result.user.uid, name: name, email: email)
    }
    
    func signOut() throws {
        try Auth.auth().signOut()
    }
    
    func resetPassword(email: String) async throws {
        try await Auth.auth().sendPasswordReset(withEmail: email)
    }
    
    func currentUser() -> FirebaseAuth.User? {
        Auth.auth().currentUser
    }
    
    func fetchMindGlowUser(uid: String) async throws -> MindGlowUser? {
        let doc = try await db.collection(AppConfig.Firestore.users).document(uid).getDocument()
        guard let data = doc.data() else { return nil }
        let role = AppConfig.ownerEmails.contains(data["email"] as? String ?? "") ? "owner" : (data["role"] as? String ?? "user")
        return MindGlowUser(
            id: uid,
            name: data["name"] as? String,
            email: data["email"] as? String,
            role: role,
            streak: data["streak"] as? Int ?? 0,
            totalMinutes: data["totalMinutes"] as? Int ?? 0,
            wellnessScore: data["wellnessScore"] as? Int ?? 0,
            meditationGoal: data["meditationGoal"] as? Int ?? 20,
            waterIntake: data["waterIntake"] as? Int ?? 0,
            lastUpdated: (data["lastUpdated"] as? Timestamp)?.dateValue()
        )
    }
    
    func createOrUpdateUserDoc(uid: String, name: String?, email: String?) throws {
        let role = AppConfig.ownerEmails.contains(email ?? "") ? "owner" : "user"
        db.collection(AppConfig.Firestore.users).document(uid).setData([
            "name": name ?? "",
            "email": email ?? "",
            "role": role,
            "streak": 0,
            "totalMinutes": 0,
            "wellnessScore": 0,
            "meditationGoal": AppConfig.Defaults.meditationGoalMinutes,
            "waterIntake": 0,
            "lastUpdated": FieldValue.serverTimestamp()
        ], merge: true)
    }
    
    func authStateListener(_ handler: @escaping (FirebaseAuth.User?) -> Void) -> AuthStateDidChangeListenerHandle {
        Auth.auth().addStateDidChangeListener { _, user in
            handler(user)
        }
    }
}
