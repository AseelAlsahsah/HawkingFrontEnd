const ar = {
    common: {
        loading: 'جاري التحميل...',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        confirm: 'تأكيد',
        inStock: 'متوفر',
        outOfStock: 'غير متوفر',
    },

    navbar: {
        logo: 'هاوكينغ',
        home: 'الرئيسية',
        collections: 'المجموعات',
        about: 'من نحن',
        contact: 'تواصل معنا',
        searchPlaceholder: 'ابحث عن المنتجات...',
        noItems: 'لا توجد منتجات',
        cart: 'السلة',
        language: 'اللغة',
    },

    home: {
        heroTagline: 'مجوهرات راقية لكل مناسبة',
        heroTitle: 'اكتشف أناقة خالدة',
        heroDescription:
            'خواتم وقلائد وأساور مختارة بعناية للاحتفال بأجمل لحظات حياتك.',
        heroCta: 'استكشف الآن',

        qualityTitle: 'جودة معتمدة',
        qualityDescription:
            'يتم فحص كل قطعة واعتمادها لضمان أعلى معايير الجودة.',

        customTitle: 'تصاميم مخصصة',
        customDescription:
            'تعاون مع مصممينا لابتكار مجوهرات فريدة تعبر عن قصتك.',

        reservationTitle: 'حجز آمن',
        reservationDescription:
            'احجز المنتجات مباشرة من الموقع واستلمها من المتجر.',
    },

    about: {
        title: 'قصتنا',
        intro1:
            'هاوكينغ متجر مجوهرات إلكتروني مميز يقدم مجموعة رائعة من المجوهرات الذهبية. تتميز قطعنا بدقة التصميم والاهتمام بأدق التفاصيل، مع تصاميم أنيقة تعكس الفخامة والرقي.',
        intro2:
            'في هاوكينغ، نفخر بالتزامنا بتقديم مجوهرات عالية الجودة، حيث تعكس كل قطعة حرفية استثنائية وجمالاً خالداً. يعمل فريقنا على توفير تجربة تسوق سلسة تضمن لكل عميل العثور على القطعة المثالية التي يعتز بها مدى الحياة.',
        craftsmanshipTitle: 'الحرفية',
        craftsmanshipDesc:
            'يتم تصميم كل قطعة بعناية وتشطيبها بدقة لإبراز الجمال الطبيعي للذهب.',
        qualityTitle: 'الجودة',
        qualityDesc:
            'نختار أفضل الخامات لضمان المتانة والراحة ولمعان يدوم طويلاً.',
        experienceTitle: 'التجربة',
        experienceDesc:
            'من التصفح وحتى إتمام الشراء، نحرص على جعل رحلتك مع المجوهرات سهلة وممتعة.',
    },

    contact: {
        heroTitle: 'تواصل معنا',
        heroDescription:
            'نحن هنا لمساعدتك في الطلبات، التصاميم الخاصة، والإجابة عن جميع استفساراتك حول مجموعاتنا.',
        addressTitle: 'العنوان',
        addressLine1: 'جبل الحسين،',
        addressLine2: 'مجمع شنانة التجاري،',
        addressLine3: 'مجوهرات هاوكينغ',
        contactTitle: 'التواصل',
        phoneLabel: 'الهاتف وواتساب',
        hoursTitle: 'ساعات العمل',
        weekdays: 'السبت – الخميس',
        weekdaysHours: '11:00 صباحاً – 10:00 مساءً',
        friday: 'الجمعة',
        fridayHours: '4:30 مساءً – 10:30 مساءً',
    },

    collections: {
        allProducts: 'جميع المنتجات',
        noProducts: 'لا توجد منتجات.',
        productsCount: '{{count}} منتج',
    },

    item: {
        notFound: 'المنتج غير موجود',
        browseCollections: 'تصفح المجموعات',
        addedToCart: 'تمت إضافة {{count}} {{name}} إلى السلة',
        addToCartWithPrice: 'أضف إلى السلة • ${{price}}',

        goldBreakdown: 'تفاصيل الذهب',
        goldPrice: 'سعر الذهب',
        weight: 'الوزن',
        karat: 'العيار',

        factoryAndDiscount: 'المصنعية والخصم',
        factoryPrice: 'سعر المصنعية لكل (غ)',
        discount: 'الخصم',
        factoryTotal: 'إجمالي المصنعية',

        productInformation: 'معلومات المنتج',
        code: 'الرمز',
        quantity: 'الكمية',
    },

    cart: {
        title: 'السلة',
        empty: 'سلة التسوق فارغة',
        startShopping: 'ابدأ التسوق',
        code: 'الرمز',
        remove: 'إزالة',
        summary: 'ملخص الطلب',
        itemsCount: '{{count}} عنصر',
        continueShopping: 'متابعة التسوق',
        proceed: 'احجز الآن',
        clear: 'حذف {{count}} عناصر',
    },

    reservation: {
        title: 'إتمام الحجز',
        subtitle: 'يرجى إدخال بياناتك، وسنتواصل معك لاستلام الطلب.',
        summary: 'ملخص الطلب',
        fullName: 'الاسم الكامل',
        fullNamePlaceholder: 'أدخل اسمك الكامل',
        phone: 'رقم الهاتف',
        phonePlaceholder: '+962 7XX XXX XXXX',
        creating: 'جاري إنشاء الحجز...',
        reserveWithPrice: 'احجز الطلب • ${{price}}',
        backToCart: '← الرجوع إلى السلة',
        success: 'تم الحجز بنجاح!',
        fixErrors: 'يرجى تصحيح الأخطاء أعلاه',
        networkError: 'خطأ في الشبكة، يرجى المحاولة مرة أخرى.',
    },

    // ------------------------------------------- ADMIN PORTAL -----------------------------------------


};

export default ar;
