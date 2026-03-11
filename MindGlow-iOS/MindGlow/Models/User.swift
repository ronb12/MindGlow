import Foundation

struct MindGlowUser: Identifiable {
    let id: String
    var name: String?
    var email: String?
    var role: String // "user" or "owner"
    var streak: Int
    var totalMinutes: Int
    var wellnessScore: Int
    var meditationGoal: Int
    var waterIntake: Int
    var lastUpdated: Date?
    
    var isOwner: Bool { role == "owner" }
    
    init(id: String, name: String? = nil, email: String? = nil, role: String = "user",
         streak: Int = 0, totalMinutes: Int = 0, wellnessScore: Int = 0,
         meditationGoal: Int = 20, waterIntake: Int = 0, lastUpdated: Date? = nil) {
        self.id = id
        self.name = name
        self.email = email
        self.role = role
        self.streak = streak
        self.totalMinutes = totalMinutes
        self.wellnessScore = wellnessScore
        self.meditationGoal = meditationGoal
        self.waterIntake = waterIntake
        self.lastUpdated = lastUpdated
    }
}
