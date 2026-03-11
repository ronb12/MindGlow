// MindGlow Configuration
// Firebase config comes from GoogleService-Info.plist (add via Xcode)

import Foundation

enum AppConfig {
    static let appName = "MindGlow"
    static let version = "1.0.0"
    static let company = "Bradley Virtual Solutions, LLC"
    
    static let ownerEmails = ["ronellbradley@gmail.com"]
    
    enum Defaults {
        static let meditationGoalMinutes = 20
        static let waterGoalGlasses = 8
        static let theme = "light"
        static let pomodoroMinutes = 25
    }
    
    enum Firestore {
        static let users = "users"
        static let products = "products"
        static let orders = "orders"
        static let storeSettings = "storeSettings"
        static let coupons = "coupons"
        static let customers = "customers"
    }
}
