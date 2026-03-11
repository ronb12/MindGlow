// Store Feature Module – products, services, cart, and owner management

import { db } from '../firebase-init.js';
import { appState } from '../utils/state.js';
import { STORE_SAMPLE_ITEMS } from '../data/store-seed.js';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const STORE_SETTINGS_COLLECTION = 'storeSettings';
const COUPONS_COLLECTION = 'coupons';
const CUSTOMERS_COLLECTION = 'customers';

export class StoreFeature {
    constructor() {
        this.products = [];
        this.orders = [];
        this.coupons = [];
        this.customers = [];
        this.storeSettings = { taxPercent: 0, shipping: 0 };
        this.currentStoreFilter = 'all';
        this.currentStoreSort = 'newest';
        this.currentStoreSearch = '';
        this.currentStoreCategory = '';
        this.currentOwnerTab = 'products';
        this.appliedPromo = null;
        this.previewMode = false;
    }

    initialize() {
        console.log('🛒 Store feature initializing...');
        this.loadStoreSettings();
        this.loadCoupons();
        this.refreshProducts();
        this.setupStorefront();
        this.setupCart();
        this.setupOwnerArea();
        this.setupDetailModal();
        this.setupModals();
        this.checkStripeReturn();
        window.addEventListener('userLoggedIn', () => this.onUserChange());
        console.log('✅ Store feature initialized');
    }

    checkStripeReturn() {
        const hash = window.location.hash || '';
        if (!hash.includes('store')) return;
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const checkout = params.get('checkout');
        if (checkout === 'success') {
            const orderId = params.get('order_id');
            if (orderId) {
                setTimeout(() => alert('Thank you for your order! Your payment was successful.'), 300);
                this.renderMyOrders();
            }
            try { window.history.replaceState(null, '', window.location.pathname + '#store'); } catch (_) {}
        } else if (checkout === 'cancelled') {
            setTimeout(() => alert('Checkout was cancelled. Your cart has been preserved.'), 300);
            try { window.history.replaceState(null, '', window.location.pathname + '#store'); } catch (_) {}
        }
    }

    async loadStoreSettings() {
        try {
            const doc = await db.collection(STORE_SETTINGS_COLLECTION).doc('default').get();
            if (doc.exists) this.storeSettings = { ...this.storeSettings, ...doc.data() };
        } catch (e) { console.warn('Store settings load failed', e); }
    }

    async loadCoupons() {
        try {
            const snap = await db.collection(COUPONS_COLLECTION).get();
            this.coupons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.warn('Coupons load failed', e); }
    }

    isOwner() {
        const user = appState.get('user');
        return user && user.role === 'owner';
    }

    onUserChange() {
        this.toggleOwnerArea();
        this.renderCartBar();
        this.renderMyOrders();
    }

    toggleOwnerArea() {
        const ownerArea = document.getElementById('store-owner-area');
        const storefront = document.getElementById('store-storefront');
        const cartBar = document.getElementById('store-cart-bar');
        const previewBar = document.getElementById('store-preview-bar');
        if (!ownerArea || !storefront) return;
        if (this.isOwner()) {
            if (this.previewMode) {
                ownerArea.classList.add('hidden');
                if (previewBar) previewBar.classList.remove('hidden');
            } else {
                ownerArea.classList.remove('hidden');
                if (previewBar) previewBar.classList.add('hidden');
            }
            storefront.classList.remove('hidden');
            if (!this.previewMode) this.loadOrders();
        } else {
            ownerArea.classList.add('hidden');
            if (previewBar) previewBar.classList.add('hidden');
        }
        if ((!this.isOwner() || this.previewMode) && this.getCart().length > 0) {
            if (cartBar) cartBar.classList.remove('hidden');
        } else if (this.getCart().length === 0) {
            if (cartBar) cartBar.classList.add('hidden');
        }
    }

    enterPreviewMode() {
        if (!this.isOwner()) return;
        this.previewMode = true;
        this.toggleOwnerArea();
    }

    exitPreviewMode() {
        this.previewMode = false;
        this.toggleOwnerArea();
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
            if (this.isOwner()) {
                this.renderOwnerProductList();
                if (this.currentOwnerTab === 'inventory') this.renderInventory();
            }
        } catch (e) {
            console.error('Store: failed to load products', e);
            this.products = [];
            this.renderStoreGrid();
            if (this.isOwner()) {
                this.renderOwnerProductList();
                if (this.currentOwnerTab === 'inventory') this.renderInventory();
            }
        }
    }

    setupStorefront() {
        this.toggleOwnerArea();
        const searchEl = document.getElementById('store-search');
        if (searchEl) searchEl.addEventListener('input', () => {
            this.currentStoreSearch = searchEl.value.trim().toLowerCase();
            this.renderStoreGrid();
        });
        const sortEl = document.getElementById('store-sort');
        if (sortEl) sortEl.addEventListener('change', () => {
            this.currentStoreSort = sortEl.value;
            this.renderStoreGrid();
        });
        const categoryEl = document.getElementById('store-category');
        if (categoryEl) categoryEl.addEventListener('change', () => {
            this.currentStoreCategory = (categoryEl.value || '').trim();
            this.renderStoreGrid();
        });
        const tabs = document.querySelectorAll('.store-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentStoreFilter = tab.dataset.storeTab;
                this.renderStoreGrid();
            });
        });
        this.renderMyOrders();
    }

    getVisibleProducts() {
        let list = this.products.filter(p => p.active !== false);
        if (this.currentStoreFilter === 'product') list = list.filter(p => p.type === 'product');
        else if (this.currentStoreFilter === 'service') list = list.filter(p => p.type === 'service');
        if (this.currentStoreCategory) list = list.filter(p => (p.category || '').toLowerCase() === this.currentStoreCategory.toLowerCase());
        if (this.currentStoreSearch) {
            const q = this.currentStoreSearch;
            list = list.filter(p => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
        }
        if (this.currentStoreSort === 'price-asc') list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        else if (this.currentStoreSort === 'price-desc') list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        else if (this.currentStoreSort === 'name') list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        else list = [...list].sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        return list;
    }

    renderStoreGrid() {
        const grid = document.getElementById('store-grid');
        const empty = document.getElementById('store-empty');
        const categorySelect = document.getElementById('store-category');
        if (!grid) return;
        const categories = [...new Set(this.products.filter(p => p.active !== false && (p.category || '').trim()).map(p => (p.category || '').trim()))].filter(Boolean).sort();
        if (categorySelect) {
            const current = categorySelect.value;
            categorySelect.innerHTML = '<option value="">All categories</option>' + categories.map(c => `<option value="${this.escapeHtml(c)}">${this.escapeHtml(c)}</option>`).join('');
            categorySelect.value = current || '';
        }
        let list = this.getVisibleProducts();
        if (list.length === 0) {
            grid.classList.add('hidden');
            if (empty) {
                empty.classList.remove('hidden');
                empty.textContent = this.products.length === 0 ? 'No items available yet. Check back soon!' : 'No matching items.';
            }
            return;
        }
        if (empty) empty.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = list.map(item => {
            const outOfStock = item.stock != null && Number(item.stock) <= 0;
            return `
            <div class="store-card" data-id="${item.id}">
                <div class="store-card-image" style="${item.imageUrl ? `background-image:url(${item.imageUrl})` : ''}"></div>
                <div class="store-card-body">
                    <span class="store-card-type">${item.type === 'service' ? 'Service' : 'Product'}${item.category ? ` · ${this.escapeHtml(item.category)}` : ''}</span>
                    <h4>${this.escapeHtml(item.title)}</h4>
                    <p>${this.escapeHtml((item.description || '').slice(0, 80))}${(item.description || '').length > 80 ? '…' : ''}</p>
                    <div class="store-card-footer">
                        <span class="store-card-price">$${Number(item.price || 0).toFixed(2)}</span>
                        <div class="store-card-actions">
                            <button type="button" class="btn-secondary store-view-detail" data-id="${item.id}">Details</button>
                            ${outOfStock ? '<span class="store-out-of-stock">Out of stock</span>' : `
                            <div class="store-qty-add">
                                <input type="number" class="store-qty-input" data-id="${item.id}" min="1" value="1" ${item.stock != null ? `max="${item.stock}"` : ''}>
                                <button type="button" class="btn-primary store-add-cart" data-id="${item.id}">Add</button>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        grid.querySelectorAll('.store-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.store-card');
                const qtyInput = card.querySelector('.store-qty-input');
                const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
                this.addToCart(btn.dataset.id, qty);
            });
        });
        grid.querySelectorAll('.store-view-detail').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.openDetailModal(btn.dataset.id); });
        });
        grid.querySelectorAll('.store-card').forEach(card => {
            card.addEventListener('click', (e) => { if (e.target.closest('button') || e.target.closest('input')) return; this.openDetailModal(card.dataset.id); });
        });
    }

    escapeHtml(s) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        if (product.stock != null && Number(product.stock) < quantity) return;
        const cart = [...this.getCart()];
        const existing = cart.find(i => i.id === productId);
        const addQty = Math.max(1, quantity || 1);
        if (existing) existing.quantity += addQty;
        else cart.push({ id: product.id, title: product.title, price: Number(product.price) || 0, quantity: addQty });
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
        const applyPromoBtn = document.getElementById('store-cart-apply-promo');
        const promoInput = document.getElementById('store-cart-promo');
        if (applyPromoBtn && promoInput) applyPromoBtn.addEventListener('click', () => this.applyPromo(promoInput.value.trim()));
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
        if (!modal || !itemsEl) return;
        const cart = this.getCart();
        const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const taxPercent = Number(this.storeSettings.taxPercent) || 0;
        const shipping = Number(this.storeSettings.shipping) || 0;
        let discount = 0;
        if (this.appliedPromo) {
            if (this.appliedPromo.type === 'percent') discount = subtotal * (Number(this.appliedPromo.value) || 0) / 100;
            else discount = Number(this.appliedPromo.value) || 0;
            discount = Math.min(discount, subtotal);
        }
        const tax = ((subtotal - discount) * taxPercent / 100);
        const total = Math.max(0, (subtotal - discount + tax + shipping));

        if (cart.length === 0) {
            itemsEl.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            itemsEl.innerHTML = cart.map(item => {
                const rowTotal = item.price * item.quantity;
                return `
                    <div class="store-cart-row">
                        <span>${this.escapeHtml(item.title)} × ${item.quantity}</span>
                        <span>$${rowTotal.toFixed(2)}</span>
                        <button type="button" class="store-cart-remove btn-secondary" data-id="${item.id}">Remove</button>
                    </div>
                `;
            }).join('');
            itemsEl.querySelectorAll('.store-cart-remove').forEach(btn => {
                btn.addEventListener('click', () => this.removeFromCart(btn.dataset.id));
            });
        }

        document.getElementById('store-cart-subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('store-cart-total').textContent = total.toFixed(2);
        const taxRow = document.getElementById('store-cart-tax-row');
        const taxVal = document.getElementById('store-cart-tax');
        if (taxRow && taxVal) { taxRow.classList.toggle('hidden', !taxPercent); taxVal.textContent = tax.toFixed(2); }
        const shipRow = document.getElementById('store-cart-shipping-row');
        const shipVal = document.getElementById('store-cart-shipping');
        if (shipRow && shipVal) { shipRow.classList.toggle('hidden', !shipping); shipVal.textContent = shipping.toFixed(2); }
        const discRow = document.getElementById('store-cart-discount-row');
        const discVal = document.getElementById('store-cart-discount');
        if (discRow && discVal) { discRow.classList.toggle('hidden', !this.appliedPromo); discVal.textContent = discount.toFixed(2); }

        const msgEl = document.getElementById('store-cart-promo-message');
        if (msgEl) msgEl.classList.add('hidden');
        modal.classList.remove('hidden');
    }

    applyPromo(code) {
        if (!code) return;
        const coupon = this.coupons.find(c => (c.code || '').toLowerCase() === code.toLowerCase() && (c.active !== false));
        const msgEl = document.getElementById('store-cart-promo-message');
        if (!msgEl) return;
        if (!coupon) {
            this.appliedPromo = null;
            msgEl.textContent = 'Invalid or inactive promo code.';
            msgEl.classList.remove('hidden');
            this.openCartModal();
            return;
        }
        this.appliedPromo = { type: coupon.type || 'fixed', value: coupon.value || 0 };
        msgEl.textContent = 'Promo applied!';
        msgEl.classList.remove('hidden');
        this.openCartModal();
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

    setupDetailModal() {
        document.querySelectorAll('[data-close="store-detail-modal"]').forEach(el => {
            el.addEventListener('click', () => document.getElementById('store-detail-modal').classList.add('hidden'));
        });
        const modal = document.getElementById('store-detail-modal');
        if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
        const addBtn = document.getElementById('store-detail-add-cart');
        if (addBtn) addBtn.addEventListener('click', () => {
            const id = addBtn.dataset.productId;
            const qty = parseInt(document.getElementById('store-detail-qty')?.value, 10) || 1;
            if (id) this.addToCart(id, qty);
            document.getElementById('store-detail-modal').classList.add('hidden');
        });
    }

    openDetailModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        const outOfStock = product.stock != null && Number(product.stock) <= 0;
        const body = document.getElementById('store-detail-body');
        const addBtn = document.getElementById('store-detail-add-cart');
        if (!body) return;
        body.innerHTML = `
            <div class="store-detail-image" style="${product.imageUrl ? `background-image:url(${product.imageUrl})` : ''}"></div>
            <h3>${this.escapeHtml(product.title)}</h3>
            <p class="store-detail-type">${product.type === 'service' ? 'Service' : 'Product'}${product.category ? ` · ${this.escapeHtml(product.category)}` : ''}</p>
            <p class="store-detail-desc">${this.escapeHtml(product.description || '')}</p>
            <p class="store-detail-price">$${Number(product.price || 0).toFixed(2)}</p>
            ${outOfStock ? '<p class="store-out-of-stock">Out of stock</p>' : ''}
        `;
        if (addBtn) {
            addBtn.dataset.productId = product.id;
            addBtn.style.display = outOfStock ? 'none' : '';
        }
        const qtyEl = document.getElementById('store-detail-qty');
        if (qtyEl) {
            qtyEl.value = 1;
            qtyEl.max = product.stock != null ? product.stock : '';
            qtyEl.style.display = outOfStock ? 'none' : '';
        }
        document.getElementById('store-detail-modal').classList.remove('hidden');
    }

    async checkout() {
        const cart = this.getCart();
        const user = appState.get('user');
        if (!user || cart.length === 0) return;
        const notes = (document.getElementById('store-cart-notes') && document.getElementById('store-cart-notes').value) || '';
        const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        let discount = 0;
        if (this.appliedPromo) {
            if (this.appliedPromo.type === 'percent') discount = subtotal * (Number(this.appliedPromo.value) || 0) / 100;
            else discount = Number(this.appliedPromo.value) || 0;
            discount = Math.min(discount, subtotal);
        }
        const taxPercent = Number(this.storeSettings.taxPercent) || 0;
        const shipping = Number(this.storeSettings.shipping) || 0;
        const tax = (subtotal - discount) * taxPercent / 100;
        const total = Math.round((subtotal - discount + tax + shipping) * 100) / 100;
        const items = cart.map(i => ({ productId: i.id, title: i.title, price: i.price, quantity: i.quantity }));

        try {
            const createStripeCheckoutSession = typeof firebase !== 'undefined' && firebase.functions && firebase.functions().httpsCallable('createStripeCheckoutSession');
            if (createStripeCheckoutSession) {
                const orderRef = await db.collection(ORDERS_COLLECTION).add({
                    userId: user.uid,
                    userName: user.name || user.email,
                    userEmail: user.email,
                    items,
                    notes,
                    subtotal,
                    tax,
                    shipping,
                    discount,
                    total,
                    status: 'pending_payment',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                const orderId = orderRef.id;
                const origin = window.location.origin || 'https://mindglow-wellness.web.app';
                try {
                    const { data } = await createStripeCheckoutSession({ orderId, origin });
                    if (data && data.url) {
                        this.setCart([]);
                        this.appliedPromo = null;
                        if (document.getElementById('store-cart-promo')) document.getElementById('store-cart-promo').value = '';
                        document.getElementById('store-cart-modal').classList.add('hidden');
                        document.getElementById('store-cart-bar').classList.add('hidden');
                        window.location.href = data.url;
                        return;
                    }
                } catch (stripeErr) {
                    await orderRef.update({ status: 'pending' });
                    for (const item of cart) {
                        const p = this.products.find(x => x.id === item.id);
                        if (p && p.stock != null) {
                            await db.collection(PRODUCTS_COLLECTION).doc(p.id).update({
                                stock: firebase.firestore.FieldValue.increment(-item.quantity),
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        }
                    }
                    this.setCart([]);
                    this.appliedPromo = null;
                    if (document.getElementById('store-cart-promo')) document.getElementById('store-cart-promo').value = '';
                    document.getElementById('store-cart-modal').classList.add('hidden');
                    document.getElementById('store-cart-bar').classList.add('hidden');
                    await this.refreshProducts();
                    alert('Order placed! The store owner will follow up with you.');
                    if (this.isOwner()) this.loadOrders();
                    this.renderMyOrders();
                    return;
                }
                await orderRef.update({ status: 'pending' });
                for (const item of cart) {
                    const p = this.products.find(x => x.id === item.id);
                    if (p && p.stock != null) {
                        await db.collection(PRODUCTS_COLLECTION).doc(p.id).update({
                            stock: firebase.firestore.FieldValue.increment(-item.quantity),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                }
                this.setCart([]);
                this.appliedPromo = null;
                if (document.getElementById('store-cart-promo')) document.getElementById('store-cart-promo').value = '';
                document.getElementById('store-cart-modal').classList.add('hidden');
                document.getElementById('store-cart-bar').classList.add('hidden');
                await this.refreshProducts();
                alert('Order placed! The store owner will follow up with you.');
                if (this.isOwner()) this.loadOrders();
                this.renderMyOrders();
                return;
            }

            await db.collection(ORDERS_COLLECTION).add({
                userId: user.uid,
                userName: user.name || user.email,
                userEmail: user.email,
                items,
                notes,
                subtotal,
                tax,
                shipping,
                discount,
                total,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            for (const item of cart) {
                const p = this.products.find(x => x.id === item.id);
                if (p && p.stock != null) {
                    await db.collection(PRODUCTS_COLLECTION).doc(p.id).update({
                        stock: firebase.firestore.FieldValue.increment(-item.quantity),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            this.setCart([]);
            this.appliedPromo = null;
            if (document.getElementById('store-cart-promo')) document.getElementById('store-cart-promo').value = '';
            document.getElementById('store-cart-modal').classList.add('hidden');
            document.getElementById('store-cart-bar').classList.add('hidden');
            await this.refreshProducts();
            alert('Order placed! The store owner will follow up with you.');
            if (this.isOwner()) this.loadOrders();
            this.renderMyOrders();
        } catch (e) {
            console.error('Checkout error', e);
            if (e.code === 'functions/unauthenticated' || e.code === 'unauthenticated') {
                alert('Please sign in to checkout.');
                return;
            }
            alert('Could not start checkout. Please try again.');
        }
    }

    setupOwnerArea() {
        const tabs = document.querySelectorAll('.store-owner-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentOwnerTab = tab.dataset.ownerTab;
                document.getElementById('store-owner-products')?.classList.toggle('hidden', this.currentOwnerTab !== 'products');
                document.getElementById('store-owner-orders')?.classList.toggle('hidden', this.currentOwnerTab !== 'orders');
                document.getElementById('store-owner-inventory')?.classList.toggle('hidden', this.currentOwnerTab !== 'inventory');
                document.getElementById('store-owner-customers')?.classList.toggle('hidden', this.currentOwnerTab !== 'customers');
                document.getElementById('store-owner-reports')?.classList.toggle('hidden', this.currentOwnerTab !== 'reports');
                document.getElementById('store-owner-settings')?.classList.toggle('hidden', this.currentOwnerTab !== 'settings');
                if (this.currentOwnerTab === 'orders') this.loadOrders();
                if (this.currentOwnerTab === 'inventory') this.renderInventory();
                if (this.currentOwnerTab === 'customers') this.loadCustomers().then(() => this.loadOrders()).then(() => this.renderCustomers());
                if (this.currentOwnerTab === 'reports') this.loadOrders().then(() => this.renderReports());
                if (this.currentOwnerTab === 'settings') this.loadStoreSettingsIntoForm();
            });
        });
        const addBtn = document.getElementById('store-add-item');
        if (addBtn) addBtn.addEventListener('click', () => this.openItemModal());
        const seedBtn = document.getElementById('store-seed-samples');
        if (seedBtn) seedBtn.addEventListener('click', () => this.seedSampleItems());
        const imageUrlInput = document.getElementById('store-item-image');
        if (imageUrlInput) imageUrlInput.addEventListener('input', () => this.previewItemImageUrl());
        const costInput = document.getElementById('store-item-cost');
        const profitInput = document.getElementById('store-item-profit');
        [costInput, profitInput].filter(Boolean).forEach(input => {
            input.addEventListener('input', () => this.updatePriceFromCostAndProfit());
        });
        document.getElementById('store-owner-settings')?.classList.toggle('hidden', this.currentOwnerTab !== 'settings');
        const settingsSave = document.getElementById('store-setting-save');
        if (settingsSave) settingsSave.addEventListener('click', () => this.saveStoreSettings());
        const addPromoBtn = document.getElementById('store-promo-add-btn');
        if (addPromoBtn) addPromoBtn.addEventListener('click', () => this.addPromoCode());
        const previewBtn = document.getElementById('store-preview-btn');
        if (previewBtn) previewBtn.addEventListener('click', () => this.enterPreviewMode());
        const exitPreviewBtn = document.getElementById('store-preview-exit');
        if (exitPreviewBtn) exitPreviewBtn.addEventListener('click', () => this.exitPreviewMode());
        const reportsPeriod = document.getElementById('store-reports-period');
        if (reportsPeriod) reportsPeriod.addEventListener('change', () => this.renderReports());
        const inventorySearch = document.getElementById('store-inventory-search');
        if (inventorySearch) inventorySearch.addEventListener('input', () => this.renderInventory());
        const inventoryAdd = document.getElementById('store-inventory-add');
        if (inventoryAdd) inventoryAdd.addEventListener('click', () => this.openItemModal());
        const customersSearch = document.getElementById('store-customers-search');
        if (customersSearch) customersSearch.addEventListener('input', () => this.renderCustomers());
        const customerAddBtn = document.getElementById('store-customer-add');
        if (customerAddBtn) customerAddBtn.addEventListener('click', () => this.openCustomerModal());
    }

    renderInventory() {
        const q = (document.getElementById('store-inventory-search')?.value || '').trim().toLowerCase();
        let list = this.products || [];
        if (q) list = list.filter(p => (p.title || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
        const tbody = document.getElementById('store-inventory-tbody');
        const empty = document.getElementById('store-inventory-empty');
        const tableWrap = document.querySelector('#store-inventory-table')?.closest('.store-admin-table-wrap');
        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.classList.remove('hidden');
            if (tableWrap) tableWrap.classList.add('hidden');
            return;
        }
        if (empty) empty.classList.add('hidden');
        if (tableWrap) tableWrap.classList.remove('hidden');
        const lowStockThreshold = 5;
        tbody.innerHTML = list.map(p => {
            const stock = p.stock != null ? Number(p.stock) : null;
            const stockText = stock === null ? '—' : stock;
            const lowStock = stock !== null && stock <= lowStockThreshold;
            const status = p.active === false ? 'Hidden' : 'Visible';
            return `
                <tr>
                    <td><strong>${this.escapeHtml(p.title || '')}</strong></td>
                    <td>${p.type === 'service' ? 'Service' : 'Product'}</td>
                    <td>${this.escapeHtml(p.category || '—')}</td>
                    <td><span class="store-status-badge store-status-${status.toLowerCase()}">${status}</span></td>
                    <td>${stock === null ? 'Unlimited' : `<span class="${lowStock ? 'store-stock-low' : ''}">${stockText}</span>`}</td>
                    <td>$${Number(p.price || 0).toFixed(2)}</td>
                    <td><button type="button" class="btn-secondary store-admin-btn" data-edit-id="${p.id}">Edit</button></td>
                </tr>
            `;
        }).join('');
        tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', () => this.openItemModal(btn.dataset.editId));
        });
    }

    getCustomersFromOrders() {
        const orders = this.orders || [];
        const map = {};
        orders.forEach(o => {
            const uid = o.userId;
            if (!uid) return;
            if (!map[uid]) {
                const lastDate = o.createdAt?.toDate?.();
                map[uid] = {
                    userId: uid,
                    name: o.userName || '—',
                    email: o.userEmail || '—',
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrder: lastDate
                };
            }
            map[uid].orderCount += 1;
            map[uid].totalSpent += Number(o.total) || 0;
            const d = o.createdAt?.toDate?.();
            if (d && (!map[uid].lastOrder || d > map[uid].lastOrder)) map[uid].lastOrder = d;
        });
        return Object.values(map).sort((a, b) => new Date(b.lastOrder || 0).getTime() - new Date(a.lastOrder || 0).getTime());
    }

    async loadCustomers() {
        try {
            const snap = await db.collection(CUSTOMERS_COLLECTION).get();
            this.customers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('Store: failed to load customers', e);
            this.customers = [];
        }
    }

    buildMergedCustomerList() {
        const orderMap = {};
        (this.orders || []).forEach(o => {
            const uid = o.userId;
            const email = (o.userEmail || '').trim().toLowerCase();
            if (!uid && !email) return;
            const key = email || uid;
            if (!orderMap[key]) {
                const lastDate = o.createdAt?.toDate?.();
                orderMap[key] = {
                    userId: uid,
                    email: o.userEmail || '',
                    name: o.userName || '—',
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrder: lastDate,
                    customerId: null,
                    phone: '',
                    notes: '',
                    emailSecondary: '',
                    addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: ''
                };
            }
            orderMap[key].orderCount += 1;
            orderMap[key].totalSpent += Number(o.total) || 0;
            const d = o.createdAt?.toDate?.();
            if (d && (!orderMap[key].lastOrder || d > orderMap[key].lastOrder)) orderMap[key].lastOrder = d;
        });
        (this.customers || []).forEach(c => {
            const email = (c.email || '').trim().toLowerCase();
            const key = email || c.id;
            if (orderMap[key]) {
                orderMap[key].name = c.name ?? orderMap[key].name;
                orderMap[key].customerId = c.id;
                orderMap[key].phone = c.phone ?? '';
                orderMap[key].notes = c.notes ?? '';
                orderMap[key].emailSecondary = c.emailSecondary ?? '';
                orderMap[key].addressLine1 = c.addressLine1 ?? ''; orderMap[key].addressLine2 = c.addressLine2 ?? '';
                orderMap[key].city = c.city ?? ''; orderMap[key].state = c.state ?? ''; orderMap[key].postalCode = c.postalCode ?? ''; orderMap[key].country = c.country ?? '';
            } else {
                orderMap[key] = {
                    userId: c.userId || null,
                    email: c.email || '',
                    name: c.name || '—',
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrder: null,
                    customerId: c.id,
                    phone: c.phone ?? '',
                    notes: c.notes ?? '',
                    emailSecondary: c.emailSecondary ?? '',
                    addressLine1: c.addressLine1 ?? '', addressLine2: c.addressLine2 ?? '',
                    city: c.city ?? '', state: c.state ?? '', postalCode: c.postalCode ?? '', country: c.country ?? ''
                };
            }
        });
        return Object.values(orderMap).sort((a, b) =>
            new Date(b.lastOrder || 0).getTime() - new Date(a.lastOrder || 0).getTime()
        );
    }

    renderCustomers() {
        const list = this.buildMergedCustomerList();
        const q = (document.getElementById('store-customers-search')?.value || '').trim().toLowerCase();
        let filtered = list;
        if (q) filtered = list.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.emailSecondary || '').toLowerCase().includes(q) ||
            (c.phone || '').toLowerCase().includes(q)
        );
        const tbody = document.getElementById('store-customers-tbody');
        const empty = document.getElementById('store-customers-empty');
        const tableWrap = document.querySelector('#store-customers-table')?.closest('.store-admin-table-wrap');
        if (!tbody) return;
        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.classList.remove('hidden');
            if (tableWrap) tableWrap.classList.add('hidden');
            return;
        }
        if (empty) empty.classList.add('hidden');
        if (tableWrap) tableWrap.classList.remove('hidden');
        this.mergedCustomersList = filtered;
        tbody.innerHTML = filtered.map((c, idx) => {
            const last = c.lastOrder ? (c.lastOrder instanceof Date ? c.lastOrder : new Date(c.lastOrder)).toLocaleDateString() : '—';
            return `
                <tr>
                    <td><strong>${this.escapeHtml(c.name)}</strong></td>
                    <td>${this.escapeHtml(c.email)}</td>
                    <td>${this.escapeHtml(c.phone || '—')}</td>
                    <td>${c.orderCount}</td>
                    <td>$${Number(c.totalSpent).toFixed(2)}</td>
                    <td>${last}</td>
                    <td><button type="button" class="btn-secondary store-admin-btn store-customer-edit" data-customer-index="${idx}">Edit</button></td>
                </tr>
            `;
        }).join('');
        tbody.querySelectorAll('.store-customer-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.customerIndex, 10);
                const c = this.mergedCustomersList && this.mergedCustomersList[idx];
                if (c) this.openCustomerModal({ customerId: c.customerId || null, name: c.name || '', email: c.email || '', emailSecondary: c.emailSecondary || '', phone: c.phone || '', notes: c.notes || '', addressLine1: c.addressLine1 || '', addressLine2: c.addressLine2 || '', city: c.city || '', state: c.state || '', postalCode: c.postalCode || '', country: c.country || '' });
            });
        });
    }

    openCustomerModal(record = null) {
        const modal = document.getElementById('store-customer-modal');
        const titleEl = document.getElementById('store-customer-modal-title');
        const form = document.getElementById('store-customer-form');
        if (!modal || !form) return;
        form.reset();
        document.getElementById('store-customer-id').value = '';
        if (record) {
            titleEl.textContent = 'Edit customer';
            document.getElementById('store-customer-id').value = record.customerId || '';
            document.getElementById('store-customer-name').value = record.name || '';
            document.getElementById('store-customer-email').value = record.email || '';
            document.getElementById('store-customer-email-secondary').value = record.emailSecondary || '';
            document.getElementById('store-customer-phone').value = record.phone || '';
            document.getElementById('store-customer-notes').value = record.notes || '';
            document.getElementById('store-customer-address1').value = record.addressLine1 || '';
            document.getElementById('store-customer-address2').value = record.addressLine2 || '';
            document.getElementById('store-customer-city').value = record.city || '';
            document.getElementById('store-customer-state').value = record.state || '';
            document.getElementById('store-customer-postal').value = record.postalCode || '';
            document.getElementById('store-customer-country').value = record.country || '';
        } else {
            titleEl.textContent = 'Add customer';
            document.getElementById('store-customer-country').value = 'United States';
        }
        modal.classList.remove('hidden');
    }

    async saveCustomerModal(e) {
        e.preventDefault();
        const id = document.getElementById('store-customer-id')?.value?.trim() || null;
        const name = document.getElementById('store-customer-name')?.value?.trim();
        const email = document.getElementById('store-customer-email')?.value?.trim();
        const emailSecondary = document.getElementById('store-customer-email-secondary')?.value?.trim() || '';
        const phone = document.getElementById('store-customer-phone')?.value?.trim() || '';
        const notes = document.getElementById('store-customer-notes')?.value?.trim() || '';
        const addressLine1 = document.getElementById('store-customer-address1')?.value?.trim() || '';
        const addressLine2 = document.getElementById('store-customer-address2')?.value?.trim() || '';
        const city = document.getElementById('store-customer-city')?.value?.trim() || '';
        const state = document.getElementById('store-customer-state')?.value?.trim() || '';
        const postalCode = document.getElementById('store-customer-postal')?.value?.trim() || '';
        const country = document.getElementById('store-customer-country')?.value?.trim() || '';
        if (!name || !email) return;
        try {
            const data = { name, email, emailSecondary, phone, notes, addressLine1, addressLine2, city, state, postalCode, country, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
            if (id) {
                await db.collection(CUSTOMERS_COLLECTION).doc(id).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await db.collection(CUSTOMERS_COLLECTION).add(data);
            }
            document.getElementById('store-customer-modal').classList.add('hidden');
            await this.loadCustomers();
            this.renderCustomers();
        } catch (err) {
            console.error(err);
            alert('Could not save customer. Try again.');
        }
    }

    getOrdersForReport() {
        const period = document.getElementById('store-reports-period')?.value || 'all';
        let orders = this.orders || [];
        if (period !== 'all') {
            const now = new Date();
            let start;
            if (period === 'month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
            } else {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start = new Date(now.getFullYear(), now.getMonth(), diff);
                start.setHours(0, 0, 0, 0);
            }
            orders = orders.filter(o => {
                const t = o.createdAt?.toDate?.() || o.createdAt;
                const d = t instanceof Date ? t : (t ? new Date(t) : null);
                return d && d >= start;
            });
        }
        return orders;
    }

    renderReports() {
        const orders = this.getOrdersForReport();
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const orderCount = orders.length;
        const avgOrder = orderCount ? totalRevenue / orderCount : 0;

        const cardsEl = document.getElementById('store-reports-cards');
        if (cardsEl) {
            cardsEl.innerHTML = `
                <div class="store-report-card">
                    <i class="fas fa-dollar-sign"></i>
                    <span class="store-report-value">$${totalRevenue.toFixed(2)}</span>
                    <span class="store-report-label">Total revenue</span>
                </div>
                <div class="store-report-card">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="store-report-value">${orderCount}</span>
                    <span class="store-report-label">Orders</span>
                </div>
                <div class="store-report-card">
                    <i class="fas fa-receipt"></i>
                    <span class="store-report-value">$${avgOrder.toFixed(2)}</span>
                    <span class="store-report-label">Avg. order value</span>
                </div>
            `;
        }

        const statusCounts = {};
        orders.forEach(o => {
            const s = o.status || 'pending';
            statusCounts[s] = (statusCounts[s] || 0) + 1;
        });
        const statusEl = document.getElementById('store-reports-status');
        if (statusEl) {
            const statuses = ['pending', 'paid', 'confirmed', 'fulfilled', 'shipped'];
            statusEl.innerHTML = statuses.map(s => `
                <div class="store-report-status-row">
                    <span>${s}</span>
                    <strong>${statusCounts[s] || 0}</strong>
                </div>
            `).join('');
        }

        const itemMap = {};
        orders.forEach(o => {
            (o.items || []).forEach(i => {
                const key = i.productId || i.title || 'Unknown';
                if (!itemMap[key]) itemMap[key] = { title: i.title || key, qty: 0, revenue: 0 };
                itemMap[key].qty += i.quantity || 0;
                itemMap[key].revenue += (i.price || 0) * (i.quantity || 0);
            });
        });
        const topItems = Object.entries(itemMap)
            .sort((a, b) => b[1].qty - a[1].qty)
            .slice(0, 10);
        const topEl = document.getElementById('store-reports-top-items');
        if (topEl) {
            if (topItems.length === 0) {
                topEl.innerHTML = '<p class="store-orders-empty">No order data in this period.</p>';
            } else {
                topEl.innerHTML = `
                    <table class="store-reports-table">
                        <thead><tr><th>Item</th><th>Qty sold</th><th>Revenue</th></tr></thead>
                        <tbody>
                            ${topItems.map(([_, d]) => `
                                <tr>
                                    <td>${this.escapeHtml(d.title)}</td>
                                    <td>${d.qty}</td>
                                    <td>$${d.revenue.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    async loadStoreSettingsIntoForm() {
        await this.loadStoreSettings();
        await this.loadCoupons();
        const taxEl = document.getElementById('store-setting-tax');
        const shipEl = document.getElementById('store-setting-shipping');
        if (taxEl) taxEl.value = this.storeSettings.taxPercent ?? '';
        if (shipEl) shipEl.value = this.storeSettings.shipping ?? '';
        this.renderPromoList();
    }

    renderPromoList() {
        const list = document.getElementById('store-promo-list');
        if (!list) return;
        if (this.coupons.length === 0) {
            list.innerHTML = '<p class="store-orders-empty">No promo codes yet.</p>';
            return;
        }
        list.innerHTML = this.coupons.map(c => `
            <div class="store-promo-item">
                <strong>${this.escapeHtml(c.code || '')}</strong> — ${c.type === 'percent' ? c.value + '% off' : '$' + c.value + ' off'}
                <span class="store-promo-active">${c.active === false ? ' (inactive)' : ''}</span>
                <button type="button" class="btn-secondary store-promo-toggle" data-id="${c.id}" data-active="${c.active !== false}">${c.active === false ? 'Activate' : 'Deactivate'}</button>
            </div>
        `).join('');
        list.querySelectorAll('.store-promo-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.togglePromo(btn.dataset.id, btn.dataset.active !== 'true'));
        });
    }

    async addPromoCode() {
        const code = (document.getElementById('store-promo-code')?.value || '').trim().toUpperCase();
        const type = document.getElementById('store-promo-type')?.value || 'percent';
        const value = parseFloat(document.getElementById('store-promo-value')?.value) || 0;
        if (!code) { alert('Enter a code.'); return; }
        try {
            await db.collection(COUPONS_COLLECTION).add({ code, type, value, active: true });
            await this.loadCoupons();
            this.renderPromoList();
            document.getElementById('store-promo-code').value = '';
            document.getElementById('store-promo-value').value = '';
        } catch (e) {
            console.error(e);
            alert('Failed to add promo.');
        }
    }

    async togglePromo(id, setActive) {
        try {
            await db.collection(COUPONS_COLLECTION).doc(id).update({ active: setActive });
            await this.loadCoupons();
            this.renderPromoList();
        } catch (e) { console.error(e); }
    }

    async saveStoreSettings() {
        const tax = parseFloat(document.getElementById('store-setting-tax')?.value) || 0;
        const shipping = parseFloat(document.getElementById('store-setting-shipping')?.value) || 0;
        try {
            await db.collection(STORE_SETTINGS_COLLECTION).doc('default').set({ taxPercent: tax, shipping }, { merge: true });
            this.storeSettings = { taxPercent: tax, shipping };
            alert('Settings saved.');
        } catch (e) {
            console.error(e);
            alert('Failed to save settings.');
        }
    }

    updatePriceFromCostAndProfit() {
        const costInput = document.getElementById('store-item-cost');
        const profitInput = document.getElementById('store-item-profit');
        const priceInput = document.getElementById('store-item-price');
        if (!costInput || !profitInput || !priceInput) return;
        const cost = parseFloat(costInput.value);
        const profit = parseFloat(profitInput.value);
        if (!Number.isNaN(cost) && !Number.isNaN(profit) && cost >= 0 && profit >= 0) {
            priceInput.value = (cost + profit).toFixed(2);
        }
    }

    async seedSampleItems() {
        const user = appState.get('user');
        if (!this.isOwner() || !user) return;
        const btn = document.getElementById('store-seed-samples');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Adding…';
        }
        try {
            for (const item of STORE_SAMPLE_ITEMS) {
                await db.collection(PRODUCTS_COLLECTION).add({
                    type: item.type,
                    title: item.title,
                    description: item.description || '',
                    price: item.price,
                    imageUrl: null,
                    active: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: user.uid
                });
            }
            await this.refreshProducts();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-seedling"></i> Load sample items';
            }
        } catch (e) {
            console.error('Seed sample items failed', e);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-seedling"></i> Load sample items';
            }
            alert('Failed to add sample items. Check console.');
        }
    }

    renderOwnerProductList() {
        const list = document.getElementById('store-owner-list');
        if (!list) return;
        list.innerHTML = this.products.map(item => {
            const cost = item.cost != null ? Number(item.cost) : null;
            const profit = item.profit != null ? Number(item.profit) : null;
            const profitLabel = profit != null ? ` · Profit $${profit.toFixed(2)}` : (cost != null && item.price != null ? ` · Profit $${(Number(item.price) - cost).toFixed(2)}` : '');
            const hidden = item.active === false ? ' · Hidden' : '';
            const stockLabel = item.stock != null ? ` · Stock ${item.stock}` : '';
            return `
            <div class="store-owner-item">
                <div class="store-owner-item-info">
                    <strong>${this.escapeHtml(item.title)}</strong>
                    <span class="store-owner-item-type">${item.type}</span>
                    ${item.category ? `<span class="store-owner-item-cat">${this.escapeHtml(item.category)}</span>` : ''}
                    <span class="store-owner-item-price">$${Number(item.price || 0).toFixed(2)}</span>${profitLabel ? `<span class="store-owner-item-profit">${profitLabel}</span>` : ''}${stockLabel}${hidden}
                </div>
                <div class="store-owner-item-actions">
                    <button type="button" class="btn-secondary store-edit-item" data-id="${item.id}">Edit</button>
                    <button type="button" class="btn-secondary store-delete-item" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `;
        }).join('');
        list.querySelectorAll('.store-edit-item').forEach(btn => {
            btn.addEventListener('click', () => this.openItemModal(btn.dataset.id));
        });
        list.querySelectorAll('.store-delete-item').forEach(btn => {
            btn.addEventListener('click', () => this.deleteItem(btn.dataset.id));
        });
    }

    async loadOrders() {
        try {
            const snap = await db.collection(ORDERS_COLLECTION).orderBy('createdAt', 'desc').limit(100).get();
            this.orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.renderOrdersList();
            if (this.currentOwnerTab === 'customers') this.renderCustomers();
            const pending = this.orders.filter(o => (o.status || 'pending') === 'pending').length;
            const badge = document.getElementById('store-orders-badge');
            const countEl = document.getElementById('store-orders-pending-count');
            if (badge) {
                badge.textContent = pending > 0 ? pending : '';
                badge.classList.toggle('hidden', !pending);
            }
            if (countEl) countEl.textContent = pending > 0 ? `${pending} pending` : '';
        } catch (e) {
            console.error('Store: failed to load orders', e);
            this.orders = [];
            this.renderOrdersList();
            if (this.currentOwnerTab === 'customers') this.renderCustomers();
        }
    }

    renderOrdersList() {
        const list = document.getElementById('store-orders-list');
        if (!list) return;
        if (this.orders.length === 0) {
            list.innerHTML = '<p class="store-orders-empty">No orders yet.</p>';
            return;
        }
        const statuses = ['pending', 'paid', 'confirmed', 'fulfilled', 'shipped'];
        list.innerHTML = this.orders.map(order => {
            const date = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : '—';
            const items = (order.items || []).map(i => `${i.title} × ${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`).join(', ');
            const status = order.status || 'pending';
            return `
                <div class="store-order-card" data-order-id="${order.id}">
                    <div class="store-order-header">
                        <strong>Order #${order.id.slice(-6)}</strong>
                        <span>${date}</span>
                        <select class="store-order-status-select" data-order-id="${order.id}" aria-label="Order status">
                            ${statuses.map(s => `<option value="${s}" ${s === status ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </div>
                    <div class="store-order-body">
                        <p><strong>${this.escapeHtml(order.userName || '')}</strong> (${this.escapeHtml(order.userEmail || '')})</p>
                        <p>${this.escapeHtml(items)}</p>
                        ${order.notes ? `<p><em>Customer note: ${this.escapeHtml(order.notes)}</em></p>` : ''}
                        ${order.tax > 0 || order.shipping > 0 || order.discount > 0 ? `<p>Subtotal $${Number(order.subtotal || order.total || 0).toFixed(2)}${order.tax > 0 ? ` · Tax $${Number(order.tax).toFixed(2)}` : ''}${order.shipping > 0 ? ` · Shipping $${Number(order.shipping).toFixed(2)}` : ''}${order.discount > 0 ? ` · Discount -$${Number(order.discount).toFixed(2)}` : ''}</p>` : ''}
                        <p><strong>Total: $${Number(order.total || 0).toFixed(2)}</strong></p>
                        <label>Package tracking</label>
                        <div class="store-order-tracking-row">
                            <select class="store-order-tracking-carrier" data-order-id="${order.id}" aria-label="Carrier">
                                <option value="">Carrier</option>
                                <option value="USPS" ${(order.trackingCarrier || '') === 'USPS' ? 'selected' : ''}>USPS</option>
                                <option value="UPS" ${(order.trackingCarrier || '') === 'UPS' ? 'selected' : ''}>UPS</option>
                                <option value="FedEx" ${(order.trackingCarrier || '') === 'FedEx' ? 'selected' : ''}>FedEx</option>
                                <option value="DHL" ${(order.trackingCarrier || '') === 'DHL' ? 'selected' : ''}>DHL</option>
                                <option value="Other" ${(order.trackingCarrier || '') === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                            <input type="text" class="store-order-tracking-number" data-order-id="${order.id}" placeholder="Tracking number" value="${this.escapeHtml(order.trackingNumber || '')}">
                            <button type="button" class="btn-secondary store-order-tracking-save" data-order-id="${order.id}">Save</button>
                        </div>
                        ${order.trackingNumber && order.trackingCarrier ? `<p class="store-order-tracking-link-wrap"><a href="${this.getTrackingUrl(order.trackingCarrier, order.trackingNumber)}" target="_blank" rel="noopener" class="store-tracking-link"><i class="fas fa-box"></i> Track package</a></p>` : ''}
                        <label>Owner note:</label>
                        <textarea class="store-order-owner-note" data-order-id="${order.id}" rows="2" placeholder="Internal note">${this.escapeHtml(order.ownerNote || '')}</textarea>
                    </div>
                </div>
            `;
        }).join('');
        list.querySelectorAll('.store-order-status-select').forEach(sel => {
            sel.addEventListener('change', () => this.updateOrderStatus(sel.dataset.orderId, sel.value));
        });
        list.querySelectorAll('.store-order-owner-note').forEach(ta => {
            ta.addEventListener('blur', () => this.updateOrderOwnerNote(ta.dataset.orderId, ta.value));
        });
        list.querySelectorAll('.store-order-tracking-save').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                const card = btn.closest('.store-order-card');
                const carrier = card?.querySelector('.store-order-tracking-carrier')?.value?.trim() || '';
                const number = card?.querySelector('.store-order-tracking-number')?.value?.trim() || '';
                this.updateOrderTracking(orderId, carrier, number);
            });
        });
    }

    getTrackingUrl(carrier, trackingNumber) {
        const num = (trackingNumber || '').trim();
        if (!num) return '#';
        switch ((carrier || '').toUpperCase()) {
            case 'USPS': return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(num)}`;
            case 'UPS': return `https://www.ups.com/track?tracknum=${encodeURIComponent(num)}`;
            case 'FEDEX': return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(num)}`;
            case 'DHL': return `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(num)}`;
            default: return `https://www.google.com/search?q=track+${encodeURIComponent(num)}`;
        }
    }

    async updateOrderTracking(orderId, carrier, trackingNumber) {
        try {
            await db.collection(ORDERS_COLLECTION).doc(orderId).update({
                trackingCarrier: carrier || null,
                trackingNumber: (trackingNumber || '').trim() || null,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            const o = this.orders.find(x => x.id === orderId);
            if (o) {
                o.trackingCarrier = carrier || null;
                o.trackingNumber = (trackingNumber || '').trim() || null;
            }
            this.renderOrdersList();
        } catch (e) { console.error(e); }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const o = this.orders.find(x => x.id === orderId);
            const updates = { status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
            if (status === 'paid' && o && !o.stockDecremented && (o.status === 'pending_payment' || o.status === 'pending')) {
                const items = o.items || [];
                for (const item of items) {
                    const p = this.products.find(x => x.id === item.productId);
                    if (p && p.stock != null) {
                        await db.collection(PRODUCTS_COLLECTION).doc(p.id).update({
                            stock: firebase.firestore.FieldValue.increment(-(item.quantity || 0)),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                }
                updates.stockDecremented = true;
            }
            await db.collection(ORDERS_COLLECTION).doc(orderId).update(updates);
            if (o) {
                o.status = status;
                if (updates.stockDecremented) o.stockDecremented = true;
            }
            this.renderOrdersList();
            const pending = this.orders.filter(or => (or.status || 'pending') === 'pending').length;
            const badge = document.getElementById('store-orders-badge');
            if (badge) { badge.textContent = pending > 0 ? pending : ''; badge.classList.toggle('hidden', !pending); }
        } catch (e) { console.error(e); }
    }

    async updateOrderOwnerNote(orderId, note) {
        try {
            await db.collection(ORDERS_COLLECTION).doc(orderId).update({ ownerNote: note, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            const o = this.orders.find(x => x.id === orderId);
            if (o) o.ownerNote = note;
        } catch (e) { console.error(e); }
    }

    async loadMyOrders() {
        const user = appState.get('user');
        if (!user) return [];
        try {
            const snap = await db.collection(ORDERS_COLLECTION).where('userId', '==', user.uid).orderBy('createdAt', 'desc').limit(50).get();
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) { return []; }
    }

    async renderMyOrders() {
        const list = document.getElementById('store-my-orders-list');
        if (!list) return;
        const orders = await this.loadMyOrders();
        if (orders.length === 0) {
            list.innerHTML = '<p class="store-orders-empty">You have no orders yet.</p>';
            return;
        }
        list.innerHTML = orders.map(order => {
            const date = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : '—';
            const items = (order.items || []).map(i => `${i.title} × ${i.quantity}`).join(', ');
            const hasTracking = order.trackingNumber && order.trackingCarrier;
            const trackingBlock = hasTracking
                ? `<p class="store-my-order-tracking"><i class="fas fa-box"></i> ${this.escapeHtml(order.trackingCarrier)}: ${this.escapeHtml(order.trackingNumber)} — <a href="${this.getTrackingUrl(order.trackingCarrier, order.trackingNumber)}" target="_blank" rel="noopener" class="store-tracking-link">Track package</a></p>`
                : '';
            return `
                <div class="store-order-card store-my-order">
                    <div class="store-order-header">
                        <strong>Order #${order.id.slice(-6)}</strong>
                        <span>${date}</span>
                        <span class="store-order-status">${order.status || 'pending'}</span>
                    </div>
                    <div class="store-order-body">
                        <p>${this.escapeHtml(items)}</p>
                        <p><strong>Total: $${Number(order.total || 0).toFixed(2)}</strong></p>
                        ${trackingBlock}
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
        document.querySelectorAll('[data-close="store-customer-modal"]').forEach(el => {
            el.addEventListener('click', () => document.getElementById('store-customer-modal').classList.add('hidden'));
        });
        const form = document.getElementById('store-item-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }
        const customerForm = document.getElementById('store-customer-form');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => this.saveCustomerModal(e));
        }
        ['store-item-modal', 'store-cart-modal', 'store-detail-modal', 'store-customer-modal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.add('hidden');
                });
            }
        });
        document.querySelectorAll('[data-close="store-detail-modal"]').forEach(el => {
            el.addEventListener('click', () => document.getElementById('store-detail-modal').classList.add('hidden'));
        });
    }

    previewItemImageUrl() {
        const preview = document.getElementById('store-item-image-preview');
        const urlInput = document.getElementById('store-item-image');
        if (!preview || !urlInput) return;
        const url = (urlInput.value || '').trim();
        preview.innerHTML = '';
        if (!url) {
            preview.classList.add('hidden');
            return;
        }
        preview.classList.remove('hidden');
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';
        img.className = 'store-item-preview-img';
        img.onerror = () => { preview.classList.add('hidden'); preview.innerHTML = ''; };
        preview.appendChild(img);
    }

    openItemModal(itemId) {
        const modal = document.getElementById('store-item-modal');
        const titleEl = document.getElementById('store-item-modal-title');
        const form = document.getElementById('store-item-form');
        const preview = document.getElementById('store-item-image-preview');
        if (!modal || !form) return;
        form.reset();
        if (preview) {
            preview.innerHTML = '';
            preview.classList.add('hidden');
        }
        document.getElementById('store-item-id').value = '';
        const activeEl = document.getElementById('store-item-active');
        if (activeEl) activeEl.checked = true;
        const categoryList = document.getElementById('store-category-list');
        if (categoryList) {
            const cats = [...new Set(this.products.map(p => (p.category || '').trim()).filter(Boolean))];
            categoryList.innerHTML = cats.map(c => `<option value="${this.escapeHtml(c)}">`).join('');
        }
        if (itemId) {
            const item = this.products.find(p => p.id === itemId);
            if (item) {
                titleEl.textContent = 'Edit product or service';
                document.getElementById('store-item-id').value = item.id;
                document.getElementById('store-item-type').value = item.type || 'product';
                document.getElementById('store-item-category').value = item.category || '';
                document.getElementById('store-item-title').value = item.title || '';
                document.getElementById('store-item-description').value = item.description || '';
                document.getElementById('store-item-cost').value = item.cost != null ? item.cost : '';
                document.getElementById('store-item-profit').value = item.profit != null ? item.profit : '';
                document.getElementById('store-item-price').value = item.price ?? '';
                document.getElementById('store-item-stock').value = item.stock != null ? item.stock : '';
                if (activeEl) activeEl.checked = item.active !== false;
                document.getElementById('store-item-image').value = item.imageUrl || '';
            }
        } else {
            titleEl.textContent = 'Add product or service';
            document.getElementById('store-item-category').value = '';
            document.getElementById('store-item-stock').value = '';
        }
        this.previewItemImageUrl();
        modal.classList.remove('hidden');
    }

    async saveItem() {
        const id = document.getElementById('store-item-id').value.trim();
        const type = document.getElementById('store-item-type').value;
        const title = document.getElementById('store-item-title').value.trim();
        const description = document.getElementById('store-item-description').value.trim();
        const costVal = document.getElementById('store-item-cost').value.trim();
        const profitVal = document.getElementById('store-item-profit').value.trim();
        const price = parseFloat(document.getElementById('store-item-price').value) || 0;
        const imageUrl = (document.getElementById('store-item-image').value || '').trim() || null;
        const user = appState.get('user');
        if (!title) return;

        const cost = costVal === '' ? null : parseFloat(costVal);
        const profit = profitVal === '' ? null : parseFloat(profitVal);
        const category = (document.getElementById('store-item-category')?.value || '').trim() || null;
        const stockVal = document.getElementById('store-item-stock')?.value;
        const stock = stockVal === '' || stockVal === undefined ? null : parseInt(stockVal, 10);
        const active = document.getElementById('store-item-active')?.checked !== false;
        const data = {
            type, title, description, price, imageUrl, active,
            ...(category && { category }),
            ...(stock != null && !Number.isNaN(stock) && stock >= 0 && { stock }),
            ...(cost != null && !Number.isNaN(cost) && { cost }),
            ...(profit != null && !Number.isNaN(profit) && { profit }),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
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
