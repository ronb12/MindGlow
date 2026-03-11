import Foundation
import SwiftUI
import FirebaseAuth

@MainActor
final class StoreViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var cart: [CartItem] = []
    @Published var myOrders: [Order] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var taxPercent: Double = 0
    @Published var shipping: Double = 0
    
    private let storeService = StoreService.shared
    
    var cartCount: Int { cart.reduce(0) { $0 + $1.quantity } }
    var subtotal: Double { cart.reduce(0) { $0 + $1.price * Double($1.quantity) } }
    var tax: Double { (subtotal * taxPercent / 100) }
    var total: Double { subtotal + tax + shipping }
    
    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }
        do {
            products = try await storeService.fetchProducts()
            let settings = try await storeService.fetchStoreSettings()
            taxPercent = settings.taxPercent
            shipping = settings.shipping
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func loadMyOrders(userId: String) async {
        do {
            myOrders = try await storeService.fetchMyOrders(userId: userId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func addToCart(product: Product, quantity: Int = 1) {
        if let idx = cart.firstIndex(where: { $0.id == product.id }) {
            cart[idx].quantity += quantity
        } else {
            cart.append(CartItem(id: product.id, title: product.title, price: product.price, quantity: quantity))
        }
    }
    
    func removeFromCart(item: CartItem) {
        cart.removeAll { $0.id == item.id }
    }
    
    func updateCartQuantity(item: CartItem, quantity: Int) {
        guard let idx = cart.firstIndex(where: { $0.id == item.id }) else { return }
        if quantity <= 0 {
            cart.remove(at: idx)
        } else {
            cart[idx].quantity = quantity
        }
    }
    
    func checkout(userId: String, userName: String, userEmail: String, notes: String) async -> Bool {
        guard !cart.isEmpty else { return false }
        isLoading = true
        defer { isLoading = false }
        do {
            _ = try await storeService.placeOrder(
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                items: cart,
                notes: notes,
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                discount: 0,
                total: total
            )
            cart.removeAll()
            if let uid = Auth.auth().currentUser?.uid {
                await loadMyOrders(userId: uid)
            }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
