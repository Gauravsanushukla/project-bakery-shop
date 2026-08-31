/**
 * cart.js - Shukla Bakery Shopping Cart Management
 * 
 * Manages cart state in localStorage, calculates totals,
 * and handles cart drawer UI rendering.
 */

const STORAGE_KEY_CART = 'shukla_bakery_cart';

// Retrieve cart items from localStorage
function getCart() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_CART);
        return JSON.parse(data) || [];
    } catch (e) {
        console.error('Error reading cart from localStorage', e);
        return [];
    }
}

// Save cart items to localStorage
function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    updateCartBadge();
}

// Get total item count in cart
function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get total price of cart
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    saveCart(cart);
    renderCartUI();
    
    // Trigger badge pop animation
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.classList.remove('badge-pop');
        void badge.offsetWidth; // Trigger reflow
        badge.classList.add('badge-pop');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartUI();
}

// Update quantity for a specific item
function updateCartQuantity(productId, newQty) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }
        saveCart(cart);
        renderCartUI();
    }
}

// Clear all items from cart
function clearCart() {
    localStorage.removeItem(STORAGE_KEY_CART);
    updateCartBadge();
    renderCartUI();
}

// Update cart counter badge in navigation header
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Render cart drawer items and subtotal summary
function renderCartUI() {
    const cartItemsContainer = document.getElementById('cartDrawerItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartCountEl = document.getElementById('cartDrawerCount');

    if (!cartItemsContainer) return;

    const cart = getCart();
    const count = getCartCount();
    const total = getCartTotal();

    if (cartCountEl) {
        cartCountEl.textContent = `(${count} item${count === 1 ? '' : 's'})`;
    }

    if (cartSubtotalEl) {
        cartSubtotalEl.textContent = `$${total.toFixed(2)}`;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <div class="empty-icon">🥐</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any fresh baked treats yet.</p>
                <button class="btn btn-primary" onclick="closeCartDrawer(); scrollToMenu();">Explore Menu</button>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onError="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80'">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <div class="cart-item-subtotal">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Global helper to scrollToMenu
function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Global functions for inline onclick bindings
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
window.renderCartUI = renderCartUI;
window.scrollToMenu = scrollToMenu;
