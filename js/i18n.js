/**
 * i18n.js - Shukla Bakery Internationalization (English / Hindi) Module
 */

const translations = {
    en: {
        // Nav Links
        nav_home: "Home",
        nav_about: "About Us",
        nav_menu: "Menu",
        nav_gallery: "Gallery",
        nav_reviews: "Reviews",
        nav_contact: "Contact",
        nav_add_item: "Add New Item",

        // Hero Section
        hero_badge: "✨ Handcrafted with Organic Ingredients",
        hero_title_1: "Crafted with Love, ",
        hero_title_2: "Baked Fresh",
        hero_title_3: " Daily",
        hero_desc: "Indulge in artisanal sourdough breads, buttery melt-in-your-mouth pastries, and decadent bespoke cakes crafted by master bakers every morning.",
        btn_explore_menu: "Explore Menu",
        btn_our_story: "Our Story",
        hero_floating_title: "100% Oven Fresh",
        hero_floating_sub: "Baked daily at 6:00 AM",

        // About Us
        about_tag: "Since 2011",
        about_title: "A Tradition of Flavor, Passion & Artistry",
        about_text_1: "Founded by the Shukla family, our bakery began with a simple wooden oven and a passion for slow-fermented, stone-ground breads. Today, we continue to honor traditional European baking methods combined with modern culinary finesse.",
        about_text_2: "We source only unbleached stone-ground flours, pure French butter, and locally sourced organic fruits to ensure every bite delivers an unforgettable experience.",
        stat_years: "Years Experience",
        stat_customers: "Happy Foodies",
        stat_bakes: "Daily Fresh Bakes",

        // Menu Section
        menu_tag: "Oven Fresh Treats",
        menu_title: "Explore Our Bakery Menu",
        menu_sub: "From crispy sourdough loaves to delicate macarons, discover our daily selection of handcrafted delights.",
        cat_all: "All Items",
        cat_cakes: "Cakes",
        cat_pastries: "Pastries",
        cat_breads: "Breads",
        cat_cookies: "Cookies",
        btn_add_to_cart: "Add to Cart",

        // Admin Modal
        modal_title: "➕ Add New Bakery Item",
        label_item_name: "Item Name *",
        placeholder_item_name: "e.g. Vanilla Bean Tart",
        label_category: "Category *",
        select_category: "-- Select Category --",
        label_price: "Price ($) *",
        label_desc: "Description *",
        placeholder_desc: "Short description of ingredients, flavor notes, and texture...",
        label_img: "Image URL (Optional)",
        btn_save_item: "Save to Menu",

        // Cart Drawer
        cart_title: "🛒 Your Cart",
        cart_empty_title: "Your cart is empty",
        cart_empty_desc: "Looks like you haven't added any fresh baked treats yet.",
        cart_total_label: "Total Amount:",
        btn_checkout: "Proceed to Checkout",

        // Gallery
        gallery_tag: "Visual Feast",
        gallery_title: "Bakery Moments & Creations",
        gallery_sub: "Take a glimpse inside our bakery kitchen and our finest artisanal creations.",

        // Testimonials
        testimonials_tag: "Loved By Community",
        testimonials_title: "What Our Customers Say",
        testimonials_sub: "Hear from our loyal patrons who start their morning with Shukla Bakery.",

        // Contact Section
        contact_info_title: "Visit Our Bakery",
        contact_address_label: "Our Address",
        contact_hours_label: "Opening Hours",
        contact_phone_label: "Contact Us",
        contact_form_title: "Send Us a Message",
        label_your_name: "Your Name",
        label_email: "Email Address",
        label_subject: "Subject",
        label_message: "Message",
        btn_send_message: "Send Message",

        // Footer
        footer_brand_text: "Handcrafting memories, traditional sourdoughs, and decadent treats daily since 2011.",
        footer_links_title: "Quick Links",
        footer_categories_title: "Categories",
        footer_newsletter_title: "Stay Fresh",
        footer_newsletter_desc: "Subscribe for weekend bake updates & special discounts.",
        btn_join: "Join"
    },
    hi: {
        // Nav Links
        nav_home: "होम",
        nav_about: "हमारे बारे में",
        nav_menu: "मेन्यू",
        nav_gallery: "गैलरी",
        nav_reviews: "समीक्षाएं",
        nav_contact: "संपर्क",
        nav_add_item: "नया आइटम जोड़ें",

        // Hero Section
        hero_badge: "✨ आर्गेनिक सामग्रियों से हस्तनिर्मित",
        hero_title_1: "प्यार से निर्मित, ",
        hero_title_2: "रोज़ ताज़ा बेक्ड",
        hero_title_3: " व्यंजन",
        hero_desc: "प्रतिदिन सुबह हमारे मास्टर बेकर्स द्वारा तैयार किए गए कारीगरी वाले ब्रेड, मक्खनदार पेस्ट्री और स्वादिष्ट केक्स का आनंद लें।",
        btn_explore_menu: "मेन्यू देखें",
        btn_our_story: "हमारी कहानी",
        hero_floating_title: "100% ओवन ताज़ा",
        hero_floating_sub: "प्रतिदिन सुबह 6:00 बजे निर्मित",

        // About Us
        about_tag: "2011 से आपकी सेवा में",
        about_title: "स्वाद, जुनून और कला की एक पुरानी परंपरा",
        about_text_1: "शुक्ला परिवार द्वारा स्थापित, हमारी बेकरी की शुरुआत एक लकड़ी के ओवन और पारंपरिक ब्रेड पकाने के जुनून से हुई थी। आज भी हम पारंपरिक तरीकों का पालन करते हैं।",
        about_text_2: "हम केवल शुद्ध आटा, उत्तम बटर और जैविक फलों का उपयोग करते हैं ताकि हर बाइट में आपको बेमिसाल स्वाद मिले।",
        stat_years: "वर्षों का अनुभव",
        stat_customers: "खुश ग्राहक",
        stat_bakes: "दैनिक ताज़ा बेक्स",

        // Menu Section
        menu_tag: "ताज़ा बेक्ड व्यंजन",
        menu_title: "हमारी बेकरी का मेन्यू देखें",
        menu_sub: "कुरकुरी सॉरडॉग ब्रेड से लेकर नाजुक मैकरॉन्स तक, हमारी दैनिक हस्तनिर्मित पसंद खोजें।",
        cat_all: "सभी आइटम",
        cat_cakes: "केक्स",
        cat_pastries: "पेस्ट्रीज",
        cat_breads: "ब्रेड्स",
        cat_cookies: "कुकीज",
        btn_add_to_cart: "कार्ट में जोड़ें",

        // Admin Modal
        modal_title: "➕ नया बेकरी आइटम जोड़ें",
        label_item_name: "आइटम का नाम *",
        placeholder_item_name: "उदा. वैनिला बीन टार्ट",
        label_category: "श्रेणी *",
        select_category: "-- श्रेणी चुनें --",
        label_price: "कीमत ($) *",
        label_desc: "विवरण *",
        placeholder_desc: "सामग्री, स्वाद और बनावट का संक्षिप्त विवरण...",
        label_img: "इमेज यूआरएल (वैकल्पिक)",
        btn_save_item: "मेन्यू में सहेजें",

        // Cart Drawer
        cart_title: "🛒 आपकी कार्ट",
        cart_empty_title: "आपकी कार्ट खाली है",
        cart_empty_desc: "लगता है आपने अभी तक कोई ताज़ा व्यंजन नहीं जोड़ा है।",
        cart_total_label: "कुल राशि:",
        btn_checkout: "चेकआउट करें",

        // Gallery
        gallery_tag: "दृश्यात्मक अनुभव",
        gallery_title: "बेकरी के बेहतरीन पल और रचनाएं",
        gallery_sub: "हमारी बेकरी रसोई और बेहतरीन कारीगरी की झलक देखें।",

        // Testimonials
        testimonials_tag: "समुदाय द्वारा पसंदीदा",
        testimonials_title: "हमारे ग्राहक क्या कहते हैं",
        testimonials_sub: "हमारे वफादार ग्राहकों के अनुभव सुनें जो शुक्ला बेकरी के साथ अपनी सुबह की शुरुआत करते हैं।",

        // Contact Section
        contact_info_title: "हमारी बेकरी में आएं",
        contact_address_label: "हमारा पता",
        contact_hours_label: "खुलने का समय",
        contact_phone_label: "संपर्क करें",
        contact_form_title: "हमें संदेश भेजें",
        label_your_name: "आपका नाम",
        label_email: "ईमेल पता",
        label_subject: "विषय",
        label_message: "संदेश",
        btn_send_message: "संदेश भेजें",

        // Footer
        footer_brand_text: "2011 से प्रतिदिन पारंपरिक ब्रेड और स्वादिष्ट व्यंजनों का निर्माण।",
        footer_links_title: "त्वरित लिंक्स",
        footer_categories_title: "श्रेणियां",
        footer_newsletter_title: "अपडेट रहें",
        footer_newsletter_desc: "वीकेंड बेक अपडेट और विशेष छूट प्राप्त करने के लिए सदस्यता लें।",
        btn_join: "जॉइन करें"
    }
};

const STORAGE_KEY_LANG = 'shukla_bakery_lang';

function getLanguage() {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'en';
}

function setLanguage(lang) {
    if (translations[lang]) {
        localStorage.setItem(STORAGE_KEY_LANG, lang);
        applyLanguage(lang);
    }
}

function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    // Update Language Toggle Button UI
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.innerHTML = lang === 'en' ? '🌐 English' : '🌐 हिंदी';
    }

    document.documentElement.lang = lang;
}

window.BakeryI18n = {
    getLanguage,
    setLanguage,
    applyLanguage,
    translations
};
