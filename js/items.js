/**
 * items.js - Shukla Bakery Product Management Module
 * 
 * Manages product data with localStorage persistence.
 * Uses async/Promise-based structure so that switching to a backend API (fetch)
 * in Phase 2 requires no changes in UI consumer code.
 */

// Key used in localStorage for bakery menu items
const STORAGE_KEY_ITEMS = 'shukla_bakery_items';

// Default initial catalog if localStorage is empty
const DEFAULT_ITEMS = [
    {
        id: 'item-1',
        name: 'Artisan Butter Croissant',
        category: 'Pastries',
        price: 3.50,
        description: 'Golden, flaky multi-layered french croissant baked fresh with pure AOP butter.',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        featured: true
    },
    {
        id: 'item-2',
        name: 'Belgian Chocolate Truffle Cake',
        category: 'Cakes',
        price: 28.00,
        description: 'Rich dark chocolate sponge layered with silken 70% Belgian ganache and cocoa velvet finish.',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        featured: true
    },
    {
        id: 'item-3',
        name: 'Country Rustic Sourdough',
        category: 'Breads',
        price: 6.50,
        description: 'Naturally fermented for 36 hours with a crisp crackly crust and airy open crumb.',
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
        featured: true
    },
    {
        id: 'item-4',
        name: 'Choco Chunk Pecan Cookies',
        category: 'Cookies',
        price: 4.50,
        description: 'Soft-baked cookies stuffed with dark chocolate chunks and toasted Georgia pecans.',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
        featured: false
    },
    {
        id: 'item-5',
        name: 'Wild Blueberry Danish',
        category: 'Pastries',
        price: 4.25,
        description: 'Flaky puff pastry filled with vanilla custard cream and organic blueberry compote.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        featured: false
    },
    {
        id: 'item-6',
        name: 'French Raspberry Macarons (6 Pcs)',
        category: 'Cookies',
        price: 12.00,
        description: 'Delicate almond meringue shells filled with handcrafted fresh raspberry buttercream.',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80',
        featured: true
    },
    {
        id: 'item-7',
        name: 'Velvet Strawberry Layer Cake',
        category: 'Cakes',
        price: 32.00,
        description: 'Soft vanilla sponge filled with fresh field strawberries and whipped mascarpone cream.',
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80',
        featured: false
    },
    {
        id: 'item-8',
        name: 'Red Velvet Cream Cheese Cupcake',
        category: 'Pastries',
        price: 3.95,
        description: 'Classic crimson cocoa cake topped with a velvety smooth vanilla cream cheese swirl.',
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600&q=80',
        featured: false
    }
];

/**
 * Initialize default items in localStorage if not existing
 */
function initItemsStorage() {
    if (!localStorage.getItem(STORAGE_KEY_ITEMS)) {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(DEFAULT_ITEMS));
    }
}

/**
 * Retrieve all items from storage
 * @returns {Promise<Array>} List of product items
 */
async function getItems() {
    initItemsStorage();
    try {
        const data = localStorage.getItem(STORAGE_KEY_ITEMS);
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Error fetching items from localStorage:', error);
        return [];
    }
}

/**
 * Add a new item to the menu catalog
 * @param {Object} itemData - { name, category, price, description, image }
 * @returns {Promise<Object>} The newly created item
 */
async function addItem(itemData) {
    initItemsStorage();
    
    // Simple validation
    if (!itemData.name || !itemData.category || !itemData.price || !itemData.description) {
        throw new Error('All fields are required.');
    }
    
    const parsedPrice = parseFloat(itemData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new Error('Price must be a valid positive number.');
    }

    const items = await getItems();
    
    const newItem = {
        id: 'item-' + Date.now(),
        name: itemData.name.trim(),
        category: itemData.category,
        price: parsedPrice,
        description: itemData.description.trim(),
        image: itemData.image && itemData.image.trim() ? itemData.image.trim() : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date().toISOString(),
        customItem: true
    };

    items.unshift(newItem); // Add new item to the beginning
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    return newItem;
}

/**
 * Delete an item from the menu catalog by ID
 * @param {string} itemId 
 * @returns {Promise<boolean>} Success state
 */
async function deleteItem(itemId) {
    initItemsStorage();
    let items = await getItems();
    const originalLength = items.length;
    items = items.filter(item => item.id !== itemId);
    
    if (items.length === originalLength) {
        throw new Error('Item not found.');
    }

    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    return true;
}

/**
 * Reset store to default seed items
 */
async function resetDefaultItems() {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
}

// Export functions to global window object
window.BakeryItemsAPI = {
    getItems,
    addItem,
    deleteItem,
    resetDefaultItems
};
