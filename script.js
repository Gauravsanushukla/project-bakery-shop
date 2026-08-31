/**
 * script.js - Shukla Bakery Shop (Step 2 Feature Implementation)
 * Handles: 2s Preloader, Dynamic Products Catalog Rendering, Admin Add Item Modal,
 * Custom Inline Delete Confirmation, Category Filter & Cart Drawer Integration.
 */

document.addEventListener('DOMContentLoaded', async () => {
    initPreloader();
    initThemeToggle();
    initMobileDrawer();
    initFilterTabs();
    initNavbarScroll();
    initScrollAnimations();
    
    // Load & Render items from localStorage / default catalog
    await loadAndRenderProducts();
    
    initAdminModal();
    initCartDrawer();
    updateCartBadge();
});

let currentCategory = 'all';

/**
 * 2-Second Intro Splash Screen Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 2000);
    }
}

/**
 * Theme Toggle Handler
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const STORAGE_KEY_THEME = 'shukla_bakery_theme';

    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem(STORAGE_KEY_THEME, newTheme);
        });
    }
}

function applyTheme(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeBtn) themeBtn.innerHTML = '☀️ Light';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.innerHTML = '🌙 Dark';
    }
}

/**
 * Fetch and Render Product Cards in Grid
 */
async function loadAndRenderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    try {
        const items = await window.BakeryItemsAPI.getItems();
        renderProductsGrid(items);
    } catch (err) {
        console.error('Failed to load items:', err);
        grid.innerHTML = `<p class="text-center" style="grid-column: 1/-1; color: var(--danger-red);">Failed to load menu items. Please refresh.</p>`;
    }
}

/**
 * Render Product Grid DOM with Category Filters and Delete Popovers
 */
function renderProductsGrid(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredItems = currentCategory === 'all' 
        ? items 
        : items.filter(item => item.category.toLowerCase() === currentCategory.toLowerCase());

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px 0;">
                <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 16px;">No bakes found in this category.</p>
                <button class="btn btn-outline btn-sm" onclick="resetItemsCatalog()">Reset Catalog</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map(item => {
        const hasDiscount = item.discountPrice && item.discountPrice < item.price;
        const displayPrice = hasDiscount ? item.discountPrice : item.price;

        return `
            <div class="product-card animate-fade animated" data-id="${item.id}" data-category="${item.category}">
                <div class="product-img-container">
                    <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'">
                    <span class="product-badge">${item.category}</span>
                    
                    ${hasDiscount ? `<span class="product-discount-badge">SAVE ₹${(item.price - item.discountPrice).toFixed(0)}</span>` : ''}

                    <!-- Delete Trigger Button -->
                    <button class="product-delete-btn" onclick="toggleDeleteConfirm('${item.id}', true)" title="Delete Item">
                        🗑️
                    </button>

                    <!-- Custom Inline Delete Confirmation Overlay (No Alert) -->
                    <div class="delete-confirm-overlay" id="deleteConfirm-${item.id}">
                        <p class="delete-confirm-title">Are you sure?</p>
                        <div class="delete-confirm-actions">
                            <button class="btn-confirm-yes" onclick="confirmDeleteItem('${item.id}')">Yes</button>
                            <button class="btn-confirm-no" onclick="toggleDeleteConfirm('${item.id}', false)">No</button>
                        </div>
                    </div>
                </div>

                <div class="product-info">
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-desc">${item.description || 'Handcrafted fresh daily with organic ingredients.'}</p>
                    <div class="product-footer">
                        <div class="price-box">
                            <span class="product-price">₹${displayPrice.toFixed(0)}</span>
                            ${hasDiscount ? `<span class="original-price">₹${item.price.toFixed(0)}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="handleAddToCart('${item.id}', this)">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Handle Add to Cart button click with tap state feedback
 */
async function handleAddToCart(itemId, btnEl) {
    const items = await window.BakeryItemsAPI.getItems();
    const product = items.find(i => i.id === itemId);
    if (product) {
        window.addToCart(product);

        // Visual feedback on button
        if (btnEl) {
            const origText = btnEl.innerHTML;
            btnEl.innerHTML = 'Added ✓';
            btnEl.classList.add('added-btn-state');
            setTimeout(() => {
                btnEl.innerHTML = origText;
                btnEl.classList.remove('added-btn-state');
            }, 1200);
        }

        showToast(`Added "${product.name}" to cart!`, 'success');
    }
}

/**
 * Custom Inline Delete Confirm Toggle
 */
function toggleDeleteConfirm(itemId, show) {
    const overlay = document.getElementById(`deleteConfirm-${itemId}`);
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

/**
 * Confirm and delete item from localStorage
 */
async function confirmDeleteItem(itemId) {
    try {
        await window.BakeryItemsAPI.deleteItem(itemId);
        showToast('Item deleted successfully from store.', 'info');
        await loadAndRenderProducts();
    } catch (err) {
        showToast(err.message || 'Failed to delete item.', 'danger');
    }
}

async function resetItemsCatalog() {
    await window.BakeryItemsAPI.resetDefaultItems();
    showToast('Catalog reset to default bakes.', 'success');
    await loadAndRenderProducts();
}

/**
 * Filter Pills Controller
 */
function initFilterTabs() {
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', async () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.getAttribute('data-category') || 'all';
            await loadAndRenderProducts();
        });
    });
}

/**
 * Admin Modal Form Validation & Submission
 */
function initAdminModal() {
    const modalOverlay = document.getElementById('adminModal');
    const openBtn = document.getElementById('openAdminModalBtn');
    const openDrawerBtn = document.getElementById('drawerAddItemBtn');
    const closeBtn = document.getElementById('closeAdminModalBtn');
    const form = document.getElementById('addItemForm');

    if (!modalOverlay) return;

    const openModal = () => {
        modalOverlay.classList.add('active');
        clearFormErrors();
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        clearFormErrors();
        if (form) form.reset();
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (openDrawerBtn) openDrawerBtn.addEventListener('click', () => {
        closeMobileDrawer();
        openModal();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Form Submission with Inline Errors
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormErrors();

            const nameInput = document.getElementById('itemName');
            const categoryInput = document.getElementById('itemCategory');
            const priceInput = document.getElementById('itemPrice');
            const discountInput = document.getElementById('itemDiscountPrice');
            const descInput = document.getElementById('itemDescription');
            const imageInput = document.getElementById('itemImage');

            let isValid = true;

            // 1. Name Validation
            if (!nameInput.value.trim()) {
                showFieldError('itemNameError', 'Item name is required.');
                isValid = false;
            }

            // 2. Category Validation
            if (!categoryInput.value) {
                showFieldError('itemCategoryError', 'Please select a category.');
                isValid = false;
            }

            // 3. Price Validation
            const parsedPrice = parseFloat(priceInput.value);
            if (!priceInput.value.trim() || isNaN(parsedPrice) || parsedPrice <= 0) {
                showFieldError('itemPriceError', 'Price is required and must be greater than 0.');
                isValid = false;
            }

            // 4. Discount Price Validation (Optional, must be < Price if provided)
            let parsedDiscount = null;
            if (discountInput.value.trim()) {
                parsedDiscount = parseFloat(discountInput.value);
                if (isNaN(parsedDiscount) || parsedDiscount <= 0) {
                    showFieldError('itemDiscountError', 'Discount price must be a positive number.');
                    isValid = false;
                } else if (!isNaN(parsedPrice) && parsedDiscount >= parsedPrice) {
                    showFieldError('itemDiscountError', 'Discount price must be less than regular price.');
                    isValid = false;
                }
            }

            if (!isValid) return;

            const newItemData = {
                name: nameInput.value.trim(),
                category: categoryInput.value,
                price: parsedPrice,
                discountPrice: parsedDiscount,
                description: descInput.value.trim(),
                image: imageInput.value.trim()
            };

            try {
                const added = await window.BakeryItemsAPI.addItem(newItemData);
                showToast(`"${added.name}" added to menu catalog!`, 'success');
                closeModal();
                await loadAndRenderProducts();

                const menuEl = document.getElementById('menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                showToast(err.message || 'Failed to add item.', 'danger');
            }
        });
    }
}

function showFieldError(errorId, text) {
    const el = document.getElementById(errorId);
    if (el) {
        el.textContent = text;
        el.classList.add('visible');
    }
}

function clearFormErrors() {
    const errorEls = document.querySelectorAll('.form-error');
    errorEls.forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
}

/**
 * Shopping Cart Drawer Controls
 */
function initCartDrawer() {
    const drawerOverlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    const openBtn = document.getElementById('openCartBtn');
    const closeBtn = document.getElementById('closeCartDrawerBtn');

    if (!drawerOverlay || !drawer) return;

    window.openCartDrawer = () => {
        drawerOverlay.classList.add('active');
        drawer.classList.add('open');
        window.renderCartUI();
    };

    window.closeCartDrawer = () => {
        drawerOverlay.classList.remove('active');
        drawer.classList.remove('open');
    };

    if (openBtn) openBtn.addEventListener('click', window.openCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', window.closeCartDrawer);

    drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) window.closeCartDrawer();
    });
}

/**
 * Mobile Navigation Drawer
 */
function initMobileDrawer() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.mobile-drawer-links .nav-link');

    if (!hamburgerBtn || !mobileDrawer || !drawerOverlay) return;

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
    };

    window.closeMobileDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
    };

    hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', window.closeMobileDrawer);
    drawerOverlay.addEventListener('click', window.closeMobileDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', window.closeMobileDrawer);
    });
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));
}

/**
 * Lightweight Toast Notification System
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

window.handleAddToCart = handleAddToCart;
window.toggleDeleteConfirm = toggleDeleteConfirm;
window.confirmDeleteItem = confirmDeleteItem;
window.resetItemsCatalog = resetItemsCatalog;
window.showToast = showToast;
