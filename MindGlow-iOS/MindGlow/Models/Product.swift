import Foundation

struct Product: Identifiable {
    let id: String
    var type: String // "product" or "service"
    var title: String
    var productDescription: String
    var price: Double
    var imageUrl: String?
    var category: String?
    var stock: Int?
    var active: Bool
    var createdAt: Date?
    
    var isService: Bool { type == "service" }
    var stockText: String {
        guard let s = stock else { return "Unlimited" }
        return "\(s)"
    }
}
