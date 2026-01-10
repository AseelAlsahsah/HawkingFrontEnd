const en = {
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        deleting: 'Deleting...',
        confirm: 'Confirm',
        inStock: 'In stock',
        outOfStock: 'Out of stock',
        edit: 'Edit',
        deactivate: 'Deactivate',
        backToDashboard: 'Dashboard',
        viewDetails: 'View Details',
        active: 'Active',
        inactive: 'Inactive',
        actions: 'Actions',
        close: 'Close',
        searching: 'Searching...',
    },

    navbar: {
        logo: 'Hawking',
        home: 'Home',
        collections: 'Collections',
        about: 'About',
        contact: 'Get in Touch',
        searchPlaceholder: 'Search items...',
        noItems: 'No items found',
        cart: 'Cart',
        language: 'Language',
    },

    home: {
        heroTagline: 'Exquisite Jewelry For Every Occasion',
        heroTitle: 'Discover Timeless Elegance',
        heroDescription:
            'Handpicked rings, necklaces, and bracelets crafted to celebrate life’s most precious moments.',
        heroCta: 'Explore Now',

        qualityTitle: 'Certified Quality',
        qualityDescription:
            'Every piece is inspected and certified to ensure the highest standards.',

        customTitle: 'Custom Designs',
        customDescription:
            'Work with our designers to create unique jewelry that tells your story.',

        reservationTitle: 'Secure Reservations',
        reservationDescription:
            'Reserve items directly from the website and pick them up in store.',
    },

    about: {
        title: 'Our Story',
        intro1:
            'Hawking is a premier online jewelry shop offering a stunning collection of gold jewelry. Our pieces are meticulously crafted with attention to detail, featuring exquisite designs that exude elegance and style.',
        intro2:
            'At Hawking, we take pride in our commitment to providing high-quality jewelry, each piece showcasing exceptional craftsmanship and timeless beauty. Our team is dedicated to offering a seamless shopping experience, ensuring that every customer finds the perfect piece to cherish for a lifetime.',
        craftsmanshipTitle: 'Craftsmanship',
        craftsmanshipDesc:
            'Each piece is thoughtfully designed and carefully finished to highlight the natural beauty of gold.',
        qualityTitle: 'Quality',
        qualityDesc:
            'We source premium materials to ensure durability, comfort, and a lasting shine.',
        experienceTitle: 'Experience',
        experienceDesc:
            'From browsing to checkout, we focus on making your jewelry journey smooth and enjoyable.',
    },

    contact: {
        heroTitle: 'Get In Touch',
        heroDescription:
            'We are here to help with orders, custom designs, and any questions about our collections.',
        addressTitle: 'Address',
        addressLine1: 'Jabal Al-Hussein,',
        addressLine2: 'Shannaneh Commercial Complex,',
        addressLine3: 'Hawking Jewelry',
        contactTitle: 'Contact',
        phoneLabel: 'Phone and WhatsApp',
        hoursTitle: 'Opening Hours',
        weekdays: 'Sat – Thu',
        weekdaysHours: '11:00 am – 10:00 pm',
        friday: 'Friday',
        fridayHours: '4:30 pm – 10:30 pm',
    },

    collections: {
        allProducts: 'All Products',
        noProducts: 'No products found.',
        productsCount: '{{count}} product',
        productsCount_plural: '{{count}} products',
    },

    item: {
        notFound: 'Item not found',
        browseCollections: 'Browse Collections',
        addedToCart: 'Added {{count}} {{name}} to cart!',
        addToCartWithPrice: 'Add to Cart • ${{price}}',

        goldBreakdown: 'Gold Breakdown',
        goldPrice: 'Gold Price',
        weight: 'Weight',
        karat: 'Karat',

        factoryAndDiscount: 'Factory & Discount',
        factoryPrice: 'Factory Price Per (g)',
        discount: 'Discount',
        factoryTotal: 'Factory Total',

        productInformation: 'Product Information',
        code: 'Code',
        quantity: 'Quantity',
    },

    cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty',
        startShopping: 'Start Shopping',
        code: 'Code',
        remove: 'Remove',
        summary: 'Order Summary',
        itemsCount: '{{count}} item',
        itemsCount_plural: '{{count}} items',
        continueShopping: 'Continue Shopping',
        proceed: 'Proceed to Reservation',
        clear: 'Clear {{count}} items',
    },

    reservation: {
        title: 'Complete Reservation',
        subtitle: "Fill in your details. We'll contact you for pickup.",
        summary: 'Order Summary',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        phone: 'Phone Number',
        phonePlaceholder: '+962 7XX XXX XXXX',
        creating: 'Creating Reservation...',
        reserveWithPrice: 'Reserve Order ${{price}}',
        backToCart: '← Back to Cart',
        success: 'Reservation created successfully!',
        fixErrors: 'Please fix the errors above',
        networkError: 'Network error. Please try again.',
    },

    // ------------------------------------------- ADMIN PORTAL -----------------------------------------
    admin: {
        loginTitle: 'Admin Login',
        loginSubtitle: 'Sign in to manage the system',
        registerTitle: 'Create Admin',
        registerSubtitle: 'Set up a new administrator account',
        username: 'Username',
        usernamePlaceholder: 'Enter your username',
        usernameMin: 'Minimum 3 characters',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        passwordMin: 'Minimum 6 characters',
        signIn: 'Sign in',
        signingIn: 'Signing in…',
        createAdmin: 'Create admin',
        creating: 'Creating…',
        loading: 'Loading…',
        invalidCredentials: 'Invalid credentials',
        loginFailed: 'Login failed. Please try again.',
        registerSuccess: 'Admin created successfully',
        registerFailed: 'Registration failed. Please try again.',
        goToRegister: 'Create new admin account →',
        backToLogin: '← Back to sign in',

        dashboard: {
            title: 'Admin Dashboard',
            welcome: 'Welcome,',
            logout: 'Log out',

            management: 'Management',
            managementSubtitle: 'Access and manage system resources',
            manage: 'Manage',

            actions: {
                items: 'Items',
                karats: 'Karats',
                categories: 'Categories',
                goldPrices: 'Gold Prices',
                reservations: 'Reservations',
                discounts: 'Discounts',
            },

            confirmLogout: 'Confirm logout',
            confirmLogoutText: 'Are you sure you want to log out?',
        },

        items: {
            title: 'Items Management',
            subtitle: 'Manage your jewelry inventory',

            searchByName: 'Item Name',
            searchByNamePlaceholder: 'Search by Item Name',
            searchByCode: 'Item Code',
            searchByCodePlaceholder: 'Search by Item Code',
            filterCategory: 'Filter Category',
            allCategories: 'All Categories',

            loadingTitle: 'Loading items...',
            loadingSubtitle: 'Fetching your jewelry inventory',

            noItems: 'No items found',
            noItemsHint: 'Try adjusting your filters or add new items',

            addNew: 'Add New Item',
            addFirst: 'Add First Item',

            showingResults: 'Showing possible results',
            clearSearch: 'Clear Search',

            table: {
                code: 'Code',
                item: 'Item',
                category: 'Category',
                karat: 'Karat',
                weight: 'Weight',
                stock: 'Stock',
                price: 'Price',
                discount: 'Discount',
                status: 'Status',
                actions: 'Actions',
                reserved: '{{count}} reserved',
            },

            status: {
                active: 'Active',
                inactive: 'Inactive',
            },

            actions: {
                deleteSuccess: '"{{code}}" deleted successfully.',
                deleteFailed: 'Failed to delete item',
                confirmTitle: 'Delete Item ({{code}})?',
                confirmText:
                    'This action CANNOT be undone. It will be permanently removed from your system.',
                confirmDelete: 'Delete',
                cancel: 'Cancel',
            },

            modal: {
                newTitle: 'New Item',
                editTitle: 'Edit {{name}}',

                validation: {
                    codeRequired: 'Item code is required',
                    nameRequired: 'Item name is required',
                    arabicNameRequired: 'Arabic item name is required',
                    categoryRequired: 'Please select a category',
                    karatRequired: 'Please select a karat',
                    imageRequired: 'Image URL is required',
                    weightRequired: 'Weight is required',
                    factoryPriceRequired: 'Factory price is required',
                    stockRequired: 'Stock count is required',
                    invalidId: 'Invalid item ID. Please try again.',
                    saveFailed: 'Failed to save item',
                },

                fields: {
                    code: 'Item Code',
                    category: 'Category',
                    name: 'Item Name',
                    arabicName: 'Item Name (Arabic)',
                    karat: 'Karat',
                    weight: 'Weight (grams)',
                    factoryPrice: 'Factory Price ($/gram)',
                    stock: 'Stock Count',
                    reserved: 'Reserved Count',
                    imageUrl: 'Image URL',
                    description: 'Description',
                    arabicDescription: 'Description (Arabic)',
                    status: 'Status',
                },

                placeholders: {
                    code: 'Item Code',
                    name: 'Item Name',
                    arabicName: 'اسم القطعة',
                    category: 'Select Category',
                    karat: 'Select Karat',
                    weight: 'Item Weight (g)',
                    factoryPrice: 'Item Factory price per (g)',
                    stock: 'In Stock Count',
                    reserved: 'Reserved Items Count',
                    imageUrl: 'https://drive.google.com/...',
                    description: 'Optional: Add item description...',
                    arabicDescription: 'اختياري: الوصف بالعربية...',
                },

                status: {
                    active: 'Active',
                    inactive: 'Inactive',
                },

                actions: {
                    create: 'Create Item',
                    update: 'Update Item',
                    cancel: 'Cancel',
                    saving: 'Saving…',
                },

                hint: {
                    drive: 'Use Google Drive URLs',
                },
            },
        },

        karats: {
            title: 'Karat Management',
            subtitle: 'Manage gold karat types',

            loadingTitle: 'Loading Karats...',
            loadingSubtitle: 'Fetching gold karat types',

            addNew: 'Add New Karat',
            addFirst: 'Add First Karat',

            emptyTitle: 'No karats found',
            emptySubtitle: 'Add karat types like 18K, 21K, 24K to manage your gold inventory',

            table: {
                name: 'Name',
                displayName: 'Display Name',
                actions: 'Actions',
            },

            newTitle: 'New Karat',
            editTitle: 'Edit Karat',

            form: {
                name: 'Karat Name',
                displayName: 'Display Name',
                namePlaceholder: 'e.g. 18',
                displayNamePlaceholder: 'e.g. 18K',
                requiredError: 'Please fill all required fields',
            },

            create: 'Create Karat',
            update: 'Update Karat',

            createdSuccess: '"{{name}}" created successfully',
            updatedSuccess: '"{{name}}" updated successfully',

            actions: {
                deleteSuccess: '"{{name}}" deleted successfully.',
                deleteFailed: 'Failed to delete karat',
                confirmTitle: 'Delete Karat ({{name}})?',
                confirmText:
                    'This action CANNOT be undone. It will be permanently removed from your system.',
                confirmDelete: 'Delete',
                cancel: 'Cancel',
            },
        },

        categories: {
            title: 'Category Management',
            subtitle: 'Manage product categories.',
            loadingTitle: 'Loading Categories...',
            loadingSubtitle: 'Fetching product categories',

            emptyTitle: 'No categories found',
            emptySubtitle:
                'Add categories like Rings, Necklaces, Bracelets to organize your gold inventory',
            addFirst: 'Add First Category',

            addNew: 'Add New Category',
            editTitle: 'Edit Category',
            newTitle: 'New Category',

            fields: {
                name: 'Category Name',
                arabicName: 'Category Name (Arabic)',
                description: 'Description',
                arabicDescription: 'Description (Arabic)',
            },

            table: {
                name: 'Name',
                description: 'Description',
                actions: 'Actions',
            },

            actions: {
                edit: 'Edit Category',
                delete: 'Delete Category',

                deleteSuccess: '"{{name}}" deleted successfully.',
                deleteFailed: 'Failed to delete category',

                confirmTitle: 'Delete Category ({{name}})?',
                confirmText:
                    'This action CANNOT be undone. It will be permanently removed from your system.',
                confirmDelete: 'Delete',
                cancel: 'Cancel',
            },

            form: {
                requiredError: 'Please fill all required fields',
                createSuccess: '"{{name}}" created successfully',
                updateSuccess: '"{{name}}" updated successfully',
                saving: 'Saving...',
                create: 'Create Category',
                update: 'Update Category',
            },
        },

        goldPrices: {
            title: 'Gold Price Management',
            subtitle: 'Manage daily gold prices per karat',

            loadingTitle: 'Loading Gold Prices...',
            loadingSubtitle: 'Fetching daily gold prices',

            emptyTitle: 'No gold prices found',
            emptySubtitle:
                'Add gold prices for different karats and dates to get started',
            addFirst: 'Add First Price',

            addNew: 'Add New Price',
            editTitle: 'Edit Gold Price',
            newTitle: 'New Gold Price',

            table: {
                karat: 'Karat',
                price: 'Price / Gram',
                date: 'Date',
                status: 'Status',
                actions: 'Actions',
            },

            status: {
                active: 'Active',
                inactive: 'Inactive',
            },

            form: {
                karat: 'Karat',
                selectKarat: 'Select Karat',
                price: 'Price per Gram ($)',
                pricePlaceholder: 'price per (g)',
                date: 'Effective Date',
                status: 'Status',

                requiredError: 'Please fill all fields',
                invalidPrice: 'Please enter a valid price',

                saving: 'Saving...',
                create: 'Create Price',
                update: 'Update Price',
            },

            actions: {
                edit: 'Edit Price',
                delete: 'Delete Price',

                deleteSuccess: 'Gold price deleted successfully!',
                deleteFailed: 'Failed to delete gold price',

                confirmTitle:
                    'This will permanently remove the price for {{karat}} on {{date}}.',
                confirmText:
                    'This action CANNOT be undone. It will be permanently removed from your system.',
                deleting: 'Deleting...',
                cancel: 'Cancel',
                confirmDelete: 'Delete Price',
            },
        },

        reservations: {
            title: 'Reservations Management',
            subtitle: 'Manage customer reservations and update status',
            loading: 'Loading reservations...',
            allTitle: 'All Reservations ({{count}})',

            table: {
                customer: 'Customer',
                date: 'Reservation Date',
                items: 'Items Count',
                phone: 'Phone',
                total: 'Total',
                status: 'Status',
                actions: 'Actions',
            },

            itemsCount: '{{count}} items',
            total: 'Total ({{count}} items)',

            status: {
                confirmed: 'Confirmed',
                cancelled: 'Cancelled',
                closed: 'Closed',
            },

            details: {
                title: 'Reservation Details',
                quantity: 'x{{count}}',
            },
        },

        discounts: {
            title: 'Discounts Management',
            subtitle: 'Manage discounts and their assigned items',

            loading: 'Loading discounts…',

            addNew: 'Add New Discount',
            all: 'All Discounts ({{count}})',

            percentage: 'Percentage',
            startDate: 'Start Date',
            endDate: 'End Date',
            itemsCount: 'Items Count',

            viewItems: 'View Items',
            addItems: 'Add Items',
            removeItems: 'Remove Items',

            errors: {
                invalidPercentage: 'Percentage must be a positive number',
            },

            items: {
                title: '{{percentage}}% Discount Items',
                empty: 'No items assigned',
            },

            selector: {
                addTitle: 'Add Items to Discount',
                removeTitle: 'Remove Items from Discount',
                search: 'Search by item code…',
                selected: 'Selected items',
                alreadyAdded: 'Already added',
                addCount: 'Add {{count}} item(s)',
                removeCount: 'Remove {{count}} item(s)',
                noResults: 'No items found.',
            },

            form: {
                newTitle: 'New Discount',
                editTitle: 'Edit Discount',
                percentage: 'Discount Percentage %',
                percentagePlaceholder: 'Discount %',
                startDate: 'Start Date',
                endDate: 'End Date',
                status: 'Discount Status',
                activeHelp: 'Discount is active and can be applied',
                inactiveHelp: 'Discount is inactive and will not apply',
            },

            delete: {
                title: 'Delete Discount',
                message: 'Are you sure you want to delete {{percentage}}% discount?',
            },
        },
    },
};

export default en;
