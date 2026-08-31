/**
 * items.js - Data & Storage Layer for Bakery Catalog Items
 * Manages item CRUD operations in localStorage (key: "bakeryItems")
 * Designed with Promise/async structure for easy backend (fetch API) migration.
 */

const STORAGE_KEY_ITEMS = 'bakeryItems';

// Initial default seed catalog if localStorage is empty
const DEFAULT_ITEMS = [
    {
        id: 'item-1',
        name: 'Classic Butter Croissant',
        category: 'Pastries',
        price: 180,
        discountPrice: 150,
        description: 'Flaky 27-layer French croissant baked with pure Normandy butter.',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-2',
        name: 'Belgian Chocolate Gateau',
        category: 'Cakes',
        price: 950,
        discountPrice: 850,
        description: 'Rich dark cocoa sponge layered with 70% dark ganache and velvet dust.',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-3',
        name: 'Artisan Sourdough Loaf',
        category: 'Breads',
        price: 240,
        discountPrice: null,
        description: '36-hour slow fermented wild yeast sourdough with a crisp crust.',
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-4',
        name: 'Raspberry Macarons (6 Pcs)',
        category: 'Cookies',
        price: 480,
        discountPrice: 420,
        description: 'Delicate almond meringue shells piped with fresh berry compote.',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-5',
        name: 'Wild Blueberry Danish',
        category: 'Pastries',
        price: 220,
        discountPrice: null,
        description: 'Flaky Viennoiserie filled with vanilla pastry cream and blueberries.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-6',
        name: 'Vanilla Velvet Cupcake',
        category: 'Cupcakes',
        price: 160,
        discountPrice: null,
        description: 'Soft vanilla sponge crowned with smooth Madagascar cream cheese swirl.',
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-7',
        name: 'Choco Chunk Pecan Cookie',
        category: 'Cookies',
        price: 190,
        discountPrice: null,
        description: 'Soft-baked brown butter cookie loaded with chocolate chunks and pecans.',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-8',
        name: 'Strawberry Shortcake',
        category: 'Cakes',
        price: 890,
        discountPrice: 790,
        description: 'Light vanilla chiffon filled with organic strawberries and mascarpone.',
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-9',
        name: 'Double Chocolate Muffin',
        category: 'Cupcakes',
        price: 170,
        discountPrice: null,
        description: 'Rich cocoa cake studded with melting dark chocolate morsels.',
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'item-10',
        name: 'Multi-Seed Country Loaf',
        category: 'Breads',
        price: 260,
        discountPrice: null,
        description: 'Hearty whole-grain sourdough crust packed with toasted flax and pumpkin seeds.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    }
];

function initItemsStorage() {
    if (!localStorage.getItem(STORAGE_KEY_ITEMS)) {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(DEFAULT_ITEMS));
    }
}

/**
 * Retrieve all items (merged default + added)
 */
async function getItems() {
    initItemsStorage();
    try {
        const data = localStorage.getItem(STORAGE_KEY_ITEMS);
        return JSON.parse(data) || [];
    } catch (e) {
        console.error('Error loading items from localStorage:', e);
        return [];
    }
}

/**
 * Add a new item to localStorage
 */
async function addItem(itemData) {
    initItemsStorage();

    const items = await getItems();

    const newItem = {
        id: 'item-' + Date.now(),
        name: itemData.name.trim(),
        category: itemData.category,
        price: parseFloat(itemData.price),
        discountPrice: itemData.discountPrice ? parseFloat(itemData.discountPrice) : null,
        description: itemData.description ? itemData.description.trim() : '',
        image: itemData.image && itemData.image.trim() 
            ? itemData.image.trim() 
            : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date().toISOString()
    };

    items.unshift(newItem); // Place new item at top
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    return newItem;
}

/**
 * Delete an item by ID from localStorage
 */
async function deleteItem(itemId) {
    initItemsStorage();
    let items = await getItems();
    const originalLength = items.length;
    items = items.filter(item => item.id !== itemId);

    if (items.length === originalLength) {
        throw new Error('Item not found');
    }

    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    return true;
}

/**
 * Reset store to default catalog
 */
async function resetDefaultItems() {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
}

window.BakeryItemsAPI = {
    getItems,
    addItem,
    deleteItem,
    resetDefaultItems
};
