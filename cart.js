/**
 * cart.js - Shopping Cart State & Drawer UI Module
 * Manages cart storage in localStorage (key: "bakeryCart")
 */

const STORAGE_KEY_CART = 'bakeryCart';

function getCart() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_CART);
        return JSON.parse(data) || [];
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    const priceToUse = product.discountPrice ? product.discountPrice : product.price;

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: priceToUse,
            originalPrice: product.discountPrice ? product.price : null,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    saveCart(cart);
    renderCartUI();
}

function updateCartQuantity(itemId, delta) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === itemId);

    if (index > -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCartUI();
    }
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    renderCartUI();
}

function clearCart() {
    localStorage.removeItem(STORAGE_KEY_CART);
    updateCartBadge();
    renderCartUI();
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Update Navbar & Floating Cart Badges
 */
function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartCount();

    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'flex';
            badge.classList.add('badge-pop');
            setTimeout(() => badge.classList.remove('badge-pop'), 300);
        } else {
            badge.style.display = 'flex';
        }
    });
}

/**
 * Render Cart Drawer UI
 */
function renderCartUI() {
    const container = document.getElementById('cartDrawerItems');
    const totalEl = document.getElementById('cartSubtotal');
    const countHeaderEl = document.getElementById('cartDrawerCount');

    if (!container) return;

    const cart = getCart();
    const count = getCartCount();
    const total = getCartTotal();

    if (countHeaderEl) countHeaderEl.textContent = `(${count} items)`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(0)}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 10px;">
                <div style="font-size: 3rem; margin-bottom: 12px;">🛒</div>
                <h4 style="font-family: var(--font-heading); color: var(--primary-brown-dark); margin-bottom: 6px;">Your Cart is Empty</h4>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 18px;">Treat yourself to some fresh baked treats!</p>
                <button class="btn btn-secondary btn-sm" onclick="closeCartDrawer()">Explore Menu</button>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">₹${item.price.toFixed(0)} ${item.originalPrice ? `<span style="text-decoration:line-through; font-size:0.75rem; color:var(--text-muted);">₹${item.originalPrice}</span>` : ''}</div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="cart-qty-val">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove Item">&times;</button>
        </div>
    `).join('');
}

window.getCart = getCart;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.updateCartBadge = updateCartBadge;
window.renderCartUI = renderCartUI;
