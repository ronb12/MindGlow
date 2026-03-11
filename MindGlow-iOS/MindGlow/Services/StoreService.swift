import Foundation
import FirebaseFirestore
import FirebaseAuth

final class StoreService {
    static let shared = StoreService()
    private let db = Firestore.firestore()
    
    private init() {}
    
    func fetchProducts() async throws -> [Product] {
        let snapshot = try await db.collection(AppConfig.Firestore.products)
            .order(by: "createdAt", descending: true)
            .getDocuments()
        return snapshot.documents.compactMap { doc in
            let d = doc.data()
            guard (d["active"] as? Bool) ?? true else { return nil }
            return Product(
                id: doc.documentID,
                type: d["type"] as? String ?? "product",
                title: d["title"] as? String ?? "",
                productDescription: d["description"] as? String ?? "",
                price: (d["price"] as? NSNumber)?.doubleValue ?? 0,
                imageUrl: d["imageUrl"] as? String,
                category: d["category"] as? String,
                stock: d["stock"] as? Int,
                active: d["active"] as? Bool ?? true,
                createdAt: (d["createdAt"] as? Timestamp)?.dateValue()
            )
        }
    }
    
    func placeOrder(userId: String, userName: String, userEmail: String, items: [CartItem],
                    notes: String, subtotal: Double, tax: Double, shipping: Double, discount: Double, total: Double) async throws -> String {
        let orderItems = items.map { item in
            [
                "productId": item.id,
                "title": item.title,
                "price": item.price,
                "quantity": item.quantity
            ] as [String: Any]
        }
        let ref = try await db.collection(AppConfig.Firestore.orders).addDocument(data: [
            "userId": userId,
            "userName": userName,
            "userEmail": userEmail,
            "items": orderItems,
            "notes": notes,
            "subtotal": subtotal,
            "tax": tax,
            "shipping": shipping,
            "discount": discount,
            "total": total,
            "status": "pending",
            "createdAt": FieldValue.serverTimestamp()
        ])
        return ref.documentID
    }
    
    func fetchMyOrders(userId: String) async throws -> [Order] {
        let snapshot = try await db.collection(AppConfig.Firestore.orders)
            .whereField("userId", isEqualTo: userId)
            .order(by: "createdAt", descending: true)
            .limit(to: 50)
            .getDocuments()
        return snapshot.documents.compactMap { doc in
            parseOrder(id: doc.documentID, data: doc.data())
        }
    }
    
    func fetchStoreSettings() async throws -> (taxPercent: Double, shipping: Double) {
        let doc = try await db.collection(AppConfig.Firestore.storeSettings).document("default").getDocument()
        let d = doc.data() ?? [:]
        let tax = (d["taxPercent"] as? NSNumber)?.doubleValue ?? 0
        let shipping = (d["shipping"] as? NSNumber)?.doubleValue ?? 0
        return (tax, shipping)
    }
    
    private func parseOrder(id: String, data: [String: Any]) -> Order? {
        guard let userId = data["userId"] as? String else { return nil }
        let itemsData = data["items"] as? [[String: Any]] ?? []
        let orderItems = itemsData.enumerated().map { i, d in
            OrderItem(
                id: "\(id)-\(i)",
                productId: d["productId"] as? String ?? "",
                title: d["title"] as? String ?? "",
                price: (d["price"] as? NSNumber)?.doubleValue ?? 0,
                quantity: d["quantity"] as? Int ?? 0
            )
        }
        return Order(
            id: id,
            userId: userId,
            userName: data["userName"] as? String ?? "",
            userEmail: data["userEmail"] as? String ?? "",
            items: orderItems,
            notes: data["notes"] as? String,
            subtotal: (data["subtotal"] as? NSNumber)?.doubleValue ?? 0,
            tax: (data["tax"] as? NSNumber)?.doubleValue ?? 0,
            shipping: (data["shipping"] as? NSNumber)?.doubleValue ?? 0,
            discount: (data["discount"] as? NSNumber)?.doubleValue ?? 0,
            total: (data["total"] as? NSNumber)?.doubleValue ?? 0,
            status: data["status"] as? String ?? "pending",
            createdAt: (data["createdAt"] as? Timestamp)?.dateValue(),
            trackingCarrier: data["trackingCarrier"] as? String,
            trackingNumber: data["trackingNumber"] as? String,
            ownerNote: data["ownerNote"] as? String
        )
    }
}
