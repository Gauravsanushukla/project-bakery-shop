/**
 * script.js - Main UI Interaction & Event Controllers for Shukla Bakery
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 0. Preloader Splash Animation
    initPreloader();

    // 1. Initialize Theme & Language
    initThemeToggle();
    initLangToggle();

    // 2. Initial State & Render
    await loadAndRenderProducts();
    updateCartBadge();
    initScrollAnimations();
    initNavbarScroll();
    initMobileNav();
    initFilterTabs();
    initAdminModal();
    initCartDrawer();
    initContactForm();
    initNewsletterForm();
});

/**
 * Preloader Intro Animation (2 seconds)
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 2000);
    }
}

// Current category filter state
let currentCategory = 'all';

/**
 * Theme Toggle Handler (Light / Dark Mode)
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
            showToast(newTheme === 'dark' ? '🌙 Dark Mode Enabled' : '☀️ Light Mode Enabled', 'info');
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
 * Language Toggle Handler (English / Hindi)
 */
function initLangToggle() {
    const langBtn = document.getElementById('langToggleBtn');
    const currentLang = window.BakeryI18n.getLanguage();
    window.BakeryI18n.applyLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', async () => {
            const activeLang = window.BakeryI18n.getLanguage();
            const newLang = activeLang === 'en' ? 'hi' : 'en';
            window.BakeryI18n.setLanguage(newLang);
            
            showToast(newLang === 'hi' ? '🌐 भाषा: हिंदी' : '🌐 Language: English', 'info');
            
            // Re-render products so action buttons use updated translation
            await loadAndRenderProducts();
        });
    }
}

/**
 * Load product items and render into the DOM menu grid
 */
async function loadAndRenderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    try {
        const items = await window.BakeryItemsAPI.getItems();
        renderProductsGrid(items);
    } catch (err) {
        console.error('Failed to load items:', err);
        grid.innerHTML = `<p class="text-center" style="grid-column: 1/-1; color: var(--danger-red);">Failed to load menu items. Please try refreshing.</p>`;
    }
}

/**
 * Render product card HTML dynamically based on current filter
 */
function renderProductsGrid(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredItems = currentCategory === 'all' 
        ? items 
        : items.filter(item => item.category.toLowerCase() === currentCategory.toLowerCase());

    const currentLang = window.BakeryI18n.getLanguage();
    const btnText = window.BakeryI18n.translations[currentLang].btn_add_to_cart || 'Add to Cart';

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 0;">
                <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 12px;">No items found in this category.</p>
                <button class="btn btn-outline btn-sm" onclick="resetItemsCatalog()">Reset Default Catalog</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map(item => `
        <div class="product-card animate-on-scroll animated" data-id="${item.id}" data-category="${item.category}">
            <div class="product-img-wrapper">
                <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'">
                <span class="product-category-badge">${item.category}</span>
                <button class="product-delete-btn" onclick="handleDeleteItem('${item.id}', '${escapeQuotes(item.name)}')" title="Delete Item from Catalog">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-title">${item.name}</h3>
                <p class="product-description">${item.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${item.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="handleAddToCart('${item.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"></path></svg>
                        ${btnText}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Handle Add to Cart button click
 */
async function handleAddToCart(itemId) {
    const items = await window.BakeryItemsAPI.getItems();
    const product = items.find(i => i.id === itemId);
    if (product) {
        window.addToCart(product);
        showToast(`Added "${product.name}" to your cart!`, 'success');
    }
}

/**
 * Handle Delete Item from menu catalog
 */
async function handleDeleteItem(itemId, itemName) {
    if (confirm(`Are you sure you want to delete "${itemName}" from the menu catalog?`)) {
        try {
            await window.BakeryItemsAPI.deleteItem(itemId);
            showToast(`Deleted "${itemName}" from catalog`, 'danger');
            await loadAndRenderProducts();
        } catch (err) {
            showToast(err.message || 'Failed to delete item', 'danger');
        }
    }
}

/**
 * Reset default items catalog helper
 */
async function resetItemsCatalog() {
    await window.BakeryItemsAPI.resetDefaultItems();
    showToast('Menu catalog reset to default items', 'success');
    await loadAndRenderProducts();
}

/**
 * Filter tabs setup
 */
function initFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.filter || 'all';
            await loadAndRenderProducts();
        });
    });
}

/**
 * Admin Modal controller
 */
function initAdminModal() {
    const modalOverlay = document.getElementById('adminModal');
    const openBtn = document.getElementById('openAdminModalBtn');
    const closeBtn = document.getElementById('closeAdminModalBtn');
    const form = document.getElementById('addItemForm');

    if (!modalOverlay) return;

    const openModal = () => modalOverlay.classList.add('active');
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        clearFormErrors();
        if (form) form.reset();
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Form Submission & Validation
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormErrors();

            const nameInput = document.getElementById('itemName');
            const categoryInput = document.getElementById('itemCategory');
            const priceInput = document.getElementById('itemPrice');
            const descInput = document.getElementById('itemDescription');
            const imageInput = document.getElementById('itemImage');

            let isValid = true;

            if (!nameInput.value.trim()) {
                showFieldError('itemNameError', 'Item name is required.');
                isValid = false;
            }

            if (!categoryInput.value) {
                showFieldError('itemCategoryError', 'Please select a category.');
                isValid = false;
            }

            const parsedPrice = parseFloat(priceInput.value);
            if (!priceInput.value.trim() || isNaN(parsedPrice) || parsedPrice <= 0) {
                showFieldError('itemPriceError', 'Please enter a valid positive price.');
                isValid = false;
            }

            if (!descInput.value.trim()) {
                showFieldError('itemDescError', 'Description is required.');
                isValid = false;
            }

            if (!isValid) return;

            const newItemData = {
                name: nameInput.value.trim(),
                category: categoryInput.value,
                price: parsedPrice,
                description: descInput.value.trim(),
                image: imageInput.value.trim()
            };

            try {
                const addedItem = await window.BakeryItemsAPI.addItem(newItemData);
                showToast(`"${addedItem.name}" added to menu catalog!`, 'success');
                closeModal();
                await loadAndRenderProducts();

                // Scroll to menu section to see added item
                const menuSection = document.getElementById('menu');
                if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                showToast(err.message || 'Failed to add item', 'danger');
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
 * Shopping Cart Drawer overlay & controls
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
 * Header sticky scroll behavior
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * Scroll Animations via IntersectionObserver
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/**
 * Contact Form Simulation
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your message has been sent. We will respond shortly.', 'success');
            form.reset();
        });
    }
}

/**
 * Newsletter Form Simulation
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Subscribed! Check your email for fresh deals.', 'success');
            form.reset();
        });
    }
}

/**
 * Toast Notification System
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

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.handleAddToCart = handleAddToCart;
window.handleDeleteItem = handleDeleteItem;
window.resetItemsCatalog = resetItemsCatalog;
window.showToast = showToast;
