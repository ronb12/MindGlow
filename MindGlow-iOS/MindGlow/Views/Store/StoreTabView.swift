import SwiftUI

struct StoreTabView: View {
    @EnvironmentObject var auth: AuthViewModel
    @StateObject private var store = StoreViewModel()
    @State private var showCart = false
    @State private var showOrders = false
    @State private var orderNotes = ""
    @State private var checkoutSuccess = false
    
    var body: some View {
        NavigationStack {
            Group {
                if auth.user?.isOwner == true {
                    StoreOwnerView(store: store)
                } else {
                    ProductListView(store: store, showCart: $showCart)
                }
            }
            .navigationTitle("Store")
            .toolbar {
                if !(auth.user?.isOwner == true) {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            showCart = true
                        } label: {
                            Image(systemName: "cart.fill")
                            if store.cartCount > 0 {
                                Text("\(store.cartCount)")
                                    .font(.caption2)
                                    .padding(4)
                                    .background(Color.red)
                                    .clipShape(Circle())
                                    .offset(x: 8, y: -8)
                            }
                        }
                    }
                    ToolbarItem(placement: .topBarLeading) {
                        Button("My orders") {
                            showOrders = true
                        }
                    }
                }
            }
            .task { await store.loadProducts() }
            .sheet(isPresented: $showCart) {
                CartView(store: store, orderNotes: $orderNotes, checkoutSuccess: $checkoutSuccess) {
                    guard let u = auth.user else { return }
                    let ok = await store.checkout(userId: u.id, userName: u.name ?? "", userEmail: u.email ?? "", notes: orderNotes)
                    checkoutSuccess = ok
                }
                .onDisappear { if checkoutSuccess { showCart = false } }
            }
            .sheet(isPresented: $showOrders) {
                MyOrdersView(store: store, userId: auth.user?.id ?? "")
                    .task { await store.loadMyOrders(userId: auth.user?.id ?? "") }
            }
        }
    }
}

struct ProductListView: View {
    @ObservedObject var store: StoreViewModel
    @Binding var showCart: Bool
    @State private var searchText = ""
    @State private var selectedProduct: Product?
    
    var filteredProducts: [Product] {
        if searchText.isEmpty { return store.products }
        return store.products.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        Group {
            if store.isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    ForEach(filteredProducts) { product in
                        ProductRowView(product: product) {
                            store.addToCart(product: product)
                        }
                        .onTapGesture { selectedProduct = product }
                    }
                }
                .searchable(text: $searchText, prompt: "Search products")
            }
        }
        .sheet(item: $selectedProduct) { p in
            ProductDetailView(product: p) { qty in
                store.addToCart(product: p, quantity: qty)
                selectedProduct = nil
            }
        }
    }
}

struct ProductRowView: View {
    let product: Product
    let onAdd: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(product.title)
                    .font(.headline)
                Text(product.type == "service" ? "Service" : "Product")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text("$\(product.price, specifier: "%.2f")")
                    .font(.subheadline.bold())
            }
            Spacer()
            Button("Add", action: onAdd)
                .buttonStyle(.borderedProminent)
                .tint(Color(red: 0.39, green: 0.4, blue: 0.95))
        }
        .padding(.vertical, 4)
    }
}

struct ProductDetailView: View {
    let product: Product
    let onAdd: (Int) -> Void
    @State private var quantity = 1
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text(product.productDescription)
                    .font(.body)
                Stepper("Quantity: \(quantity)", value: $quantity, in: 1...99)
                Button("Add to cart") {
                    onAdd(quantity)
                    dismiss()
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(red: 0.39, green: 0.4, blue: 0.95))
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .padding()
            .navigationTitle(product.title)
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct CartView: View {
    @ObservedObject var store: StoreViewModel
    @Binding var orderNotes: String
    @Binding var checkoutSuccess: Bool
    let onCheckout: () async -> Void
    @Environment(\.dismiss) var dismiss
    @State private var isCheckingOut = false
    
    var body: some View {
        NavigationStack {
            List {
                Section("Items") {
                    ForEach(store.cart) { item in
                        HStack {
                            Text(item.title)
                            Spacer()
                            Text("×\(item.quantity)")
                            Text("$\(item.price * Double(item.quantity), specifier: "%.2f")")
                        }
                    }
                }
                Section("Notes") {
                    TextField("Order notes", text: $orderNotes, axis: .vertical)
                        .lineLimit(3...6)
                }
                Section("Total") {
                    Text("Subtotal: $\(store.subtotal, specifier: "%.2f")")
                    Text("Tax: $\(store.tax, specifier: "%.2f")")
                    Text("Shipping: $\(store.shipping, specifier: "%.2f")")
                    Text("Total: $\(store.total, specifier: "%.2f")")
                        .font(.headline)
                }
            }
            .navigationTitle("Cart")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Place order") {
                        Task {
                            isCheckingOut = true
                            await onCheckout()
                            isCheckingOut = false
                        }
                    }
                    .disabled(store.cart.isEmpty || isCheckingOut)
                }
            }
            .overlay {
                if checkoutSuccess {
                    Text("Order placed!")
                        .padding()
                        .background(.green)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
        }
    }
}

struct MyOrdersView: View {
    @ObservedObject var store: StoreViewModel
    let userId: String
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            List(store.myOrders) { order in
                VStack(alignment: .leading, spacing: 4) {
                    Text("Order #\(String(order.id.suffix(6)))")
                        .font(.headline)
                    Text(order.createdAt?.formatted() ?? "")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("$\(order.total, specifier: "%.2f") · \(order.status)")
                        .font(.subheadline)
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("My orders")
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
    }
}

struct StoreOwnerView: View {
    @ObservedObject var store: StoreViewModel
    
    var body: some View {
        Text("Owner area: manage products, orders, and settings from the web app or add native admin screens here.")
            .padding()
            .font(.subheadline)
            .foregroundColor(.secondary)
    }
}
