// Store Feature Module – products, services, cart, and owner management

import { db } from '../firebase-init.js';
import { appState } from '../utils/state.js';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

export class StoreFeature {
    constructor() {
        this.products = [];
        this.orders = [];
        this.currentStoreFilter = 'all';
        this.currentOwnerTab = 'products';
    }

    initialize() {
        console.log('🛒 Store feature initializing...');
        this.refreshProducts();
        this.setupStorefront();
        this.setupCart();
        this.setupOwnerArea();
        this.setupModals();
        window.addEventListener('userLoggedIn', () => this.onUserChange());
        console.log('✅ Store feature initialized');
    }

    isOwner() {
        const user = appState.get('user');
        return user && user.role === 'owner';
    }

    onUserChange() {
        this.toggleOwnerArea();
        this.renderCartBar();
    }

    toggleOwnerArea() {
        const ownerArea = document.getElementById('store-owner-area');
        const storefront = document.getElementById('store-storefront');
        const cartBar = document.getElementById('store-cart-bar');
        if (!ownerArea || !storefront) return;
        if (this.isOwner()) {
            ownerArea.classList.remove('hidden');
            storefront.classList.remove('hidden');
            this.loadOrders();
        } else {
            ownerArea.classList.add('hidden');
        }
        if (!this.isOwner() && this.getCart().length > 0) {
            cartBar.classList.remove('hidden');
        } else if (this.getCart().length === 0) {
            cartBar.classList.add('hidden');
        }
    }

    getCart() {
        return appState.get('cart') || [];
    }

    setCart(cart) {
        appState.set('cart', cart);
        this.renderCartBar();
    }

    async refreshProducts() {
        try {
            const snap = await db.collection(PRODUCTS_COLLECTION).orderBy('createdAt', 'desc').get();
            this.products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.renderStoreGrid();
            if (this.isOwner()) this.renderOwnerProductList();
        } catch (e) {
            console.error('Store: failed to load products', e);
            this.products = [];
            this.renderStoreGrid();
            if (this.isOwner()) this.renderOwnerProductList();
        }
    }

    setupStorefront() {
        this.toggleOwnerArea();
        const tabs = document.querySelectorAll('.store-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentStoreFilter = tab.dataset.storeTab;
                this.renderStoreGrid();
            });
        });
    }

    renderStoreGrid() {
        const grid = document.getElementById('store-grid');
        const empty = document.getElementById('store-empty');
        if (!grid) return;
        let list = this.products;
        if (this.currentStoreFilter === 'product') list = list.filter(p => p.type === 'product');
        else if (this.currentStoreFilter === 'service') list = list.filter(p => p.type === 'service');
        if (list.length === 0) {
            grid.classList.add('hidden');
            if (empty) {
                empty.classList.remove('hidden');
                empty.textContent = this.products.length === 0 ? 'No items available yet. Check back soon!' : 'No items in this category.';
            }
            return;
        }
        if (empty) empty.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = list.map(item => `
            <div class="store-card" data-id="${item.id}">
                <div class="store-card-image" style="${item.imageUrl ? `background-image:url(${item.imageUrl})` : ''}"></div>
                <div class="store-card-body">
                    <span class="store-card-type">${item.type === 'service' ? 'Service' : 'Product'}</span>
                    <h4>${this.escapeHtml(item.title)}</h4>
                    <p>${this.escapeHtml((item.description || '').slice(0, 80))}${(item.description || '').length > 80 ? '…' : ''}</p>
                    <div class="store-card-footer">
                        <span class="store-card-price">$${Number(item.price || 0).toFixed(2)}</span>
                        <button class="btn-primary store-add-cart" data-id="${item.id}">Add to cart</button>
                    </div>
                </div>
            </div>
        `).join('');
        grid.querySelectorAll('.store-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToCart(btn.dataset.id);
            });
        });
    }

    escapeHtml(s) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        const cart = [...this.getCart()];
        const existing = cart.find(i => i.id === productId);
        if (existing) existing.quantity += 1;
        else cart.push({ id: product.id, title: product.title, price: Number(product.price) || 0, quantity: 1 });
        this.setCart(cart);
        const bar = document.getElementById('store-cart-bar');
        if (bar) bar.classList.remove('hidden');
    }

    setupCart() {
        this.renderCartBar();
        const viewBtn = document.getElementById('store-cart-view');
        if (viewBtn) viewBtn.addEventListener('click', () => this.openCartModal());
        const checkoutBtn = document.getElementById('store-checkout-btn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.checkout());
    }

    renderCartBar() {
        const cart = this.getCart();
        const bar = document.getElementById('store-cart-bar');
        const countEl = document.getElementById('store-cart-count');
        if (countEl) countEl.textContent = cart.reduce((n, i) => n + i.quantity, 0);
        if (bar) {
            if (cart.length > 0 && !this.isOwner()) bar.classList.remove('hidden');
            else if (cart.length === 0) bar.classList.add('hidden');
        }
    }

    openCartModal() {
        const modal = document.getElementById('store-cart-modal');
        const itemsEl = document.getElementById('store-cart-items');
        const totalEl = document.getElementById('store-cart-total');
        if (!modal || !itemsEl) return;
        const cart = this.getCart();
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p>Your cart is empty.</p>';
            if (totalEl) totalEl.textContent = '0.00';
        } else {
            let total = 0;
            itemsEl.innerHTML = cart.map(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                return `
                    <div class="store-cart-row">
                        <span>${this.escapeHtml(item.title)} × ${item.quantity}</span>
                        <span>$${subtotal.toFixed(2)}</span>
                        <button type="button" class="store-cart-remove btn-secondary" data-id="${item.id}">Remove</button>
                    </div>
                `;
            }).join('');
            if (totalEl) totalEl.textContent = total.toFixed(2);
            itemsEl.querySelectorAll('.store-cart-remove').forEach(btn => {
                btn.addEventListener('click', () => this.removeFromCart(btn.dataset.id));
            });
        }
        modal.classList.remove('hidden');
    }

    removeFromCart(productId) {
        let cart = this.getCart().filter(i => i.id !== productId);
        this.setCart(cart);
        this.openCartModal();
        if (cart.length === 0) {
            document.getElementById('store-cart-modal').classList.add('hidden');
            const bar = document.getElementById('store-cart-bar');
            if (bar) bar.classList.add('hidden');
        }
    }

    async checkout() {
        const cart = this.getCart();
        const user = appState.get('user');
        if (!user || cart.length === 0) return;
        const items = cart.map(i => ({ productId: i.id, title: i.title, price: i.price, quantity: i.quantity }));
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        try {
            await db.collection(ORDERS_COLLECTION).add({
                userId: user.uid,
                userName: user.name || user.email,
                userEmail: user.email,
                items,
                total: Math.round(total * 100) / 100,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            this.setCart([]);
            document.getElementById('store-cart-modal').classList.add('hidden');
            document.getElementById('store-cart-bar').classList.add('hidden');
            alert('Order placed! The store owner will follow up with you.');
            if (this.isOwner()) this.loadOrders();
        } catch (e) {
            console.error('Checkout error', e);
            alert('Could not place order. Please try again.');
        }
    }

    setupOwnerArea() {
        const tabs = document.querySelectorAll('.store-owner-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentOwnerTab = tab.dataset.ownerTab;
                document.getElementById('store-owner-products').classList.toggle('hidden', this.currentOwnerTab !== 'products');
                document.getElementById('store-owner-orders').classList.toggle('hidden', this.currentOwnerTab !== 'orders');
                if (this.currentOwnerTab === 'orders') this.loadOrders();
            });
        });
        const addBtn = document.getElementById('store-add-item');
        if (addBtn) addBtn.addEventListener('click', () => this.openItemModal());
    }

    renderOwnerProductList() {
        const list = document.getElementById('store-owner-list');
        if (!list) return;
        list.innerHTML = this.products.map(item => `
            <div class="store-owner-item">
                <div class="store-owner-item-info">
                    <strong>${this.escapeHtml(item.title)}</strong>
                    <span class="store-owner-item-type">${item.type}</span>
                    <span class="store-owner-item-price">$${Number(item.price || 0).toFixed(2)}</span>
                </div>
                <div class="store-owner-item-actions">
                    <button type="button" class="btn-secondary store-edit-item" data-id="${item.id}">Edit</button>
                    <button type="button" class="btn-secondary store-delete-item" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');
        list.querySelectorAll('.store-edit-item').forEach(btn => {
            btn.addEventListener('click', () => this.openItemModal(btn.dataset.id));
        });
        list.querySelectorAll('.store-delete-item').forEach(btn => {
            btn.addEventListener('click', () => this.deleteItem(btn.dataset.id));
        });
    }

    async loadOrders() {
        try {
            const snap = await db.collection(ORDERS_COLLECTION).orderBy('createdAt', 'desc').limit(50).get();
            this.orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.renderOrdersList();
        } catch (e) {
            console.error('Store: failed to load orders', e);
            this.orders = [];
            this.renderOrdersList();
        }
    }

    renderOrdersList() {
        const list = document.getElementById('store-orders-list');
        if (!list) return;
        if (this.orders.length === 0) {
            list.innerHTML = '<p class="store-orders-empty">No orders yet.</p>';
            return;
        }
        list.innerHTML = this.orders.map(order => {
            const date = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : '—';
            const items = (order.items || []).map(i => `${i.title} × ${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`).join(', ');
            return `
                <div class="store-order-card">
                    <div class="store-order-header">
                        <strong>Order #${order.id.slice(-6)}</strong>
                        <span>${date}</span>
                        <span class="store-order-status">${order.status || 'pending'}</span>
                    </div>
                    <div class="store-order-body">
                        <p><strong>${this.escapeHtml(order.userName || '')}</strong> (${this.escapeHtml(order.userEmail || '')})</p>
                        <p>${this.escapeHtml(items)}</p>
                        <p><strong>Total: $${Number(order.total || 0).toFixed(2)}</strong></p>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupModals() {
        document.querySelectorAll('[data-close="store-item-modal"]').forEach(el => {
            el.addEventListener('click', () => document.getElementById('store-item-modal').classList.add('hidden'));
        });
        document.querySelectorAll('[data-close="store-cart-modal"]').forEach(el => {
            el.addEventListener('click', () => document.getElementById('store-cart-modal').classList.add('hidden'));
        });
        const form = document.getElementById('store-item-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }
        ['store-item-modal', 'store-cart-modal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.add('hidden');
                });
            }
        });
    }

    openItemModal(itemId) {
        const modal = document.getElementById('store-item-modal');
        const titleEl = document.getElementById('store-item-modal-title');
        const form = document.getElementById('store-item-form');
        if (!modal || !form) return;
        form.reset();
        document.getElementById('store-item-id').value = '';
        if (itemId) {
            const item = this.products.find(p => p.id === itemId);
            if (item) {
                titleEl.textContent = 'Edit product or service';
                document.getElementById('store-item-id').value = item.id;
                document.getElementById('store-item-type').value = item.type || 'product';
                document.getElementById('store-item-title').value = item.title || '';
                document.getElementById('store-item-description').value = item.description || '';
                document.getElementById('store-item-price').value = item.price ?? '';
                document.getElementById('store-item-image').value = item.imageUrl || '';
            }
        } else {
            titleEl.textContent = 'Add product or service';
        }
        modal.classList.remove('hidden');
    }

    async saveItem() {
        const id = document.getElementById('store-item-id').value.trim();
        const type = document.getElementById('store-item-type').value;
        const title = document.getElementById('store-item-title').value.trim();
        const description = document.getElementById('store-item-description').value.trim();
        const price = parseFloat(document.getElementById('store-item-price').value) || 0;
        const imageUrl = document.getElementById('store-item-image').value.trim() || null;
        const user = appState.get('user');
        if (!title) return;
        const data = { type, title, description, price, imageUrl, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (!id) {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            data.createdBy = user ? user.uid : null;
        }
        try {
            if (id) {
                await db.collection(PRODUCTS_COLLECTION).doc(id).set(data, { merge: true });
            } else {
                await db.collection(PRODUCTS_COLLECTION).add(data);
            }
            document.getElementById('store-item-modal').classList.add('hidden');
            await this.refreshProducts();
        } catch (e) {
            console.error('Save item error', e);
            alert('Failed to save. Check console.');
        }
    }

    async deleteItem(id) {
        if (!confirm('Delete this item?')) return;
        try {
            await db.collection(PRODUCTS_COLLECTION).doc(id).delete();
            await this.refreshProducts();
        } catch (e) {
            console.error('Delete error', e);
            alert('Failed to delete.');
        }
    }
}

export const store = new StoreFeature();
