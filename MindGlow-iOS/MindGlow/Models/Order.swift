import Foundation

struct Order: Identifiable {
    let id: String
    var userId: String
    var userName: String
    var userEmail: String
    var items: [OrderItem]
    var notes: String?
    var subtotal: Double
    var tax: Double
    var shipping: Double
    var discount: Double
    var total: Double
    var status: String
    var createdAt: Date?
    var trackingCarrier: String?
    var trackingNumber: String?
    var ownerNote: String?
}

struct OrderItem: Identifiable {
    let id: String
    var productId: String
    var title: String
    var price: Double
    var quantity: Int
}

struct CartItem: Identifiable {
    let id: String
    var title: String
    var price: Double
    var quantity: Int
}
