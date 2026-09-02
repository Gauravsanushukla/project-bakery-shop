/* ==========================================================================
   SHUKLA BAKERY SHOP - UI CONTROLLER MODULE
   Main UI event listeners, theme toggler, preloader, product loader, modals.
   ========================================================================== */

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initThemeToggle();
    initMobileDrawer();
    initFilterTabs();
    initAdminModal();
    initCartDrawer();
    initScrollAnimations();
    loadAndRenderProducts();
});

/**
 * 2-Second Intro Splash Preloader
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
 * Theme Toggle Handler (Supports Header and Drawer Theme Buttons)
 */
function initThemeToggle() {
    const STORAGE_KEY_THEME = 'shukla_bakery_theme';
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    applyTheme(savedTheme);

    const themeButtons = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #drawerThemeBtn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem(STORAGE_KEY_THEME, newTheme);
        });
    });
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const themeButtons = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #drawerThemeBtn');
    themeButtons.forEach(btn => {
        if (btn.id === 'drawerThemeBtn') {
            btn.innerHTML = isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode';
        } else {
            btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
        }
    });
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

                    <!-- Custom Inline Delete Confirmation Overlay -->
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
    const openBtns = document.querySelectorAll('.add-item-btn, #openAdminModalBtn, #drawerAddItemBtn');
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

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeMobileDrawer();
            openModal();
        });
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

            // 4. Discount Price Validation
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

            // Save via localStorage API
            try {
                const newItem = await window.BakeryItemsAPI.addItem({
                    name: nameInput.value.trim(),
                    category: categoryInput.value,
                    price: parsedPrice,
                    discountPrice: parsedDiscount,
                    description: descInput.value.trim() || 'Handcrafted fresh daily.',
                    image: imageInput.value.trim() || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
                });

                showToast(`"${newItem.name}" added to menu successfully!`, 'success');
                closeModal();
                await loadAndRenderProducts();
            } catch (err) {
                showToast(err.message || 'Failed to save item.', 'danger');
            }
        });
    }
}

function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
}

function clearFormErrors() {
    const errorEls = document.querySelectorAll('.form-error');
    errorEls.forEach(el => el.textContent = '');
}

/**
 * Mobile Drawer Menu Controller
 */
function initMobileDrawer() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('mobileDrawer');
    const navLinks = document.querySelectorAll('.mobile-drawer-links .nav-link');

    if (!hamburgerBtn || !drawer) return;

    hamburgerBtn.addEventListener('click', openMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });
}

function openMobileDrawer() {
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('mobileDrawer');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (drawer) drawer.classList.add('open');
}

function closeMobileDrawer() {
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('mobileDrawer');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (drawer) drawer.classList.remove('open');
}

/**
 * Scroll Animations Controller
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // Navbar Scroll shadow behavior
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Handle Contact Form submission to 96sumitshukla@gmail.com
 */
function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    const name = nameInput ? nameInput.value.trim() : 'Customer';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    const subject = encodeURIComponent(`New Inquiry from ${name} via Shukla Bakery Website`);
    const body = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);

    showToast(`Thank you ${name}! Opening mail to 96sumitshukla@gmail.com...`, 'success');

    setTimeout(() => {
        window.location.href = `mailto:96sumitshukla@gmail.com?subject=${subject}&body=${body}`;
        form.reset();
    }, 800);
}

/**
 * Handle VIP Bake Club Newsletter Join to 96sumitshukla@gmail.com
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('.newsletter-input');
    const userEmail = emailInput ? emailInput.value.trim() : '';

    if (!userEmail) return;

    const subject = encodeURIComponent(`New VIP Bake Club Member Joined!`);
    const body = encodeURIComponent(`Hello Shukla Bakery!\n\nA new customer joined the VIP Bake Club:\nMember Email: ${userEmail}`);

    showToast(`Welcome to VIP Bake Club! Notifying 96sumitshukla@gmail.com...`, 'success');

    setTimeout(() => {
        window.location.href = `mailto:96sumitshukla@gmail.com?subject=${subject}&body=${body}`;
        if (emailInput) emailInput.value = '';
    }, 800);
}

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
