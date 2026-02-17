// ============================================
// SCHEMA.JS - Микроразметка Schema.org для МИРУМ
// Версия: 9.6 (18.02.2026) - ПОЛНАЯ, ДЛЯ ВСЕХ СТРАНИЦ
// ============================================

(function() {
    'use strict';
    
    console.log('🔍 schema.js загружен, версия 9.6');
    
    // ============ ДАННЫЕ КОМПАНИИ ============
    const COMPANY = {
        name: "МИРУМ",
        alternateName: ["Матсервис", "Ковросервис"],
        description: "Профессиональные услуги чистоты и восстановления с 2009 года",
        foundingDate: "2009",
        url: "https://arenda-kovrov-mirum.ru/",
        logo: "https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png",
        address: {
            streetAddress: "ул. Сущёвская, 27с2",
            addressLocality: "Москва",
            postalCode: "127055",
            addressCountry: "RU"
        },
        contactPoint: {
            telephone: "+7-977-000-51-27",
            email: "matservice@yandex.ru",
            contactType: "customer service",
            areaServed: "RU",
            availableLanguage: ["Russian"]
        },
        sameAs: [
            "https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13",
            "https://t.me/+79770005127"
        ]
    };
    
    // ============ ДАННЫЕ УСЛУГ ============
    const SERVICES = {
        "kovry": {
            name: "Аренда грязезащитных ковров",
            description: "Профессиональная аренда входных ковров для офисов, магазинов, медицинских учреждений. Регулярная замена, чистка, доставка.",
            url: "https://arenda-kovrov-mirum.ru/arenda-kovrov.html",
            areaServed: ["Москва", "Санкт-Петербург", "Екатеринбург", "Казань", "Новосибирск", "Уфа"],
            offers: [
                { name: "Ковер 85×60 см", price: "180", unit: "замена" },
                { name: "Ковер 85×150 см", price: "420", unit: "замена" },
                { name: "Ковер 115×200 см", price: "760", unit: "замена" }
            ]
        },
        "vitrini": {
            name: "Мойка витрин и фасадов",
            description: "Профессиональная мойка коммерческих витрин, фасадов, вывесок для юридических лиц. Работаем по всей России.",
            url: "https://arenda-kovrov-mirum.ru/window-cleaning.html",
            areaServed: ["Москва", "Санкт-Петербург", "Краснодар", "Сочи", "Ростов-на-Дону"],
            offers: [
                { name: "Разовая мойка", price: "500", unit: "м²" },
                { name: "Абонентское обслуживание", price: "300", unit: "м² в месяц" }
            ]
        },
        "poly": {
            name: "Восстановление полов",
            description: "Шлифовка, полировка, восстановление паркета, мрамора, гранита, линолеума. Экономия до 70% от замены.",
            url: "https://arenda-kovrov-mirum.ru/vosstanovlenie-polov.html",
            areaServed: ["Москва", "Московская область"],
            offers: [
                { name: "Циклевка паркета", price: "720", unit: "м²" },
                { name: "Шлифовка мрамора", price: "350", unit: "м²" },
                { name: "Полировка гранита", price: "1050", unit: "м²" }
            ]
        },
        "outstaff": {
            name: "Аутстаффинг персонала",
            description: "Вывод сотрудников за штат, снижение налоговой нагрузки до 40%, легализация иностранных граждан.",
            url: "https://arenda-kovrov-mirum.ru/outstaffing.html",
            areaServed: ["Российская Федерация"],
            offers: [
                { name: "Аутстаффинг для 1 сотрудника", price: "74000", unit: "месяц" },
                { name: "Аутстаффинг для компании", price: "1550000", unit: "месяц" }
            ]
        }
    };
    
    // ============ ОТЗЫВЫ ============
    const REVIEWS = [
        {
            author: "ООО «ДИАНА»",
            reviewBody: "Обратились в компанию МИРУМ за услугой по аренде входных ковриков и были приятно удивлены скорости реагирования на запрос.",
            ratingValue: "5",
            datePublished: "2025-11-15"
        },
        {
            author: "Программа «Триумф XXI века»",
            reviewBody: "Коллектив программы «Триумф XXI века» благодарит сотрудников за усердие и высокое качество оказанных услуг.",
            ratingValue: "5",
            datePublished: "2025-10-20"
        },
        {
            author: "ООО «Посуда-Центр сервис»",
            reviewBody: "ООО «МИРУМ» на протяжении нескольких лет показал себя с лучшей стороны в решении самых разнообразных задач.",
            ratingValue: "5",
            datePublished: "2025-09-05"
        }
    ];
    
    // ============ FAQ ВОПРОСЫ ============
    const FAQ = [
        {
            question: "Почему аренда выгоднее покупки?",
            answer: "Аренда позволяет сэкономить до 40% бюджета, не беспокоиться о стирке и хранении, гибко менять количество ковров."
        },
        {
            question: "Как часто нужно менять ковры?",
            answer: "Для офисов рекомендуем 1-2 раза в неделю, для магазинов - 2-3 раза, для медицинских учреждений - ежедневно."
        },
        {
            question: "Работаете ли вы по всей России?",
            answer: "Да, мы работаем во всех регионах России: Москва, СПб, Екатеринбург, Новосибирск, Казань, Уфа и другие города."
        },
        {
            question: "Какие документы вы предоставляете?",
            answer: "Договор, акты, счета-фактуры, УПД. Работаем с ЭДО. Все документы для бухгалтерии."
        }
    ];
    
    // ============ ГЕНЕРАЦИЯ СХЕМЫ ============
    function generateMainSchema() {
        return {
            "@context": "https://schema.org",
            "@graph": [
                // Организация
                {
                    "@type": "Organization",
                    "@id": COMPANY.url + "#organization",
                    "name": COMPANY.name,
                    "alternateName": COMPANY.alternateName,
                    "description": COMPANY.description,
                    "url": COMPANY.url,
                    "logo": COMPANY.logo,
                    "foundingDate": COMPANY.foundingDate,
                    "sameAs": COMPANY.sameAs,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": COMPANY.address.streetAddress,
                        "addressLocality": COMPANY.address.addressLocality,
                        "postalCode": COMPANY.address.postalCode,
                        "addressCountry": COMPANY.address.addressCountry
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": COMPANY.contactPoint.telephone,
                        "email": COMPANY.contactPoint.email,
                        "contactType": COMPANY.contactPoint.contactType,
                        "areaServed": COMPANY.contactPoint.areaServed,
                        "availableLanguage": COMPANY.contactPoint.availableLanguage
                    }
                },
                
                // Веб-сайт
                {
                    "@type": "WebSite",
                    "@id": COMPANY.url + "#website",
                    "url": COMPANY.url,
                    "name": COMPANY.name,
                    "description": COMPANY.description,
                    "publisher": { "@id": COMPANY.url + "#organization" }
                },
                
                // Услуги (ItemList)
                {
                    "@type": "ItemList",
                    "itemListElement": Object.keys(SERVICES).map((key, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Service",
                            "name": SERVICES[key].name,
                            "description": SERVICES[key].description,
                            "url": SERVICES[key].url,
                            "provider": { "@id": COMPANY.url + "#organization" },
                            "areaServed": SERVICES[key].areaServed.map(area => ({
                                "@type": "AdministrativeArea",
                                "name": area
                            })),
                            "offers": SERVICES[key].offers.map(offer => ({
                                "@type": "Offer",
                                "name": offer.name,
                                "price": offer.price,
                                "priceCurrency": "RUB",
                                "priceSpecification": {
                                    "@type": "PriceSpecification",
                                    "price": offer.price,
                                    "priceCurrency": "RUB",
                                    "unitText": offer.unit
                                }
                            }))
                        }
                    }))
                },
                
                // Отзывы
                {
                    "@type": "ItemList",
                    "itemListElement": REVIEWS.map((review, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Review",
                            "author": {
                                "@type": "Organization",
                                "name": review.author
                            },
                            "datePublished": review.datePublished,
                            "reviewBody": review.reviewBody,
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": review.ratingValue,
                                "bestRating": "5"
                            },
                            "itemReviewed": { "@id": COMPANY.url + "#organization" }
                        }
                    }))
                },
                
                // FAQ
                {
                    "@type": "FAQPage",
                    "mainEntity": FAQ.map(item => ({
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.answer
                        }
                    }))
                }
            ]
        };
    }
    
    // ============ ГЕНЕРАЦИЯ СХЕМЫ ДЛЯ КОНКРЕТНОЙ УСЛУГИ ============
    function generateServiceSchema(serviceKey) {
        if (!SERVICES[serviceKey]) return null;
        
        const service = SERVICES[serviceKey];
        
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            "url": service.url,
            "provider": {
                "@type": "Organization",
                "name": COMPANY.name,
                "url": COMPANY.url,
                "logo": COMPANY.logo
            },
            "areaServed": service.areaServed.map(area => ({
                "@type": "AdministrativeArea",
                "name": area
            })),
            "offers": service.offers.map(offer => ({
                "@type": "Offer",
                "name": offer.name,
                "price": offer.price,
                "priceCurrency": "RUB",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": offer.price,
                    "priceCurrency": "RUB",
                    "unitText": offer.unit
                }
            }))
        };
    }
    
    // ============ ВСТАВКА СХЕМЫ ============
    function insertSchema(schema) {
        try {
            // Удаляем старую схему, если есть
            const oldScript = document.querySelector('script[type="application/ld+json"][data-mirum-schema]');
            if (oldScript) oldScript.remove();
            
            // Создаем новую
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-mirum-schema', 'true');
            script.textContent = JSON.stringify(schema, null, 2);
            
            document.head.appendChild(script);
            console.log('✅ Микроразметка добавлена');
            
        } catch (error) {
            console.error('❌ Ошибка при добавлении микроразметки:', error);
        }
    }
    
    // ============ ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СТРАНИЦЫ ============
    function getCurrentPage() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index')) return 'main';
        if (path.includes('arenda-kovrov')) return 'kovry';
        if (path.includes('window-cleaning')) return 'vitrini';
        if (path.includes('vosstanovlenie-polov') || path.includes('chistka_polov')) return 'poly';
        if (path.includes('outstaffing')) return 'outstaff';
        if (path.includes('calculator')) return 'calculator';
        if (path.includes('FAQ')) return 'faq';
        if (path.includes('blog')) return 'blog';
        if (path.includes('testimonials')) return 'testimonials';
        if (path.includes('gallery')) return 'gallery';
        if (path.includes('privacy-policy')) return 'privacy';
        
        return 'other';
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', function() {
        const page = getCurrentPage();
        console.log(`📄 Текущая страница: ${page}`);
        
        let schema;
        
        switch(page) {
            case 'main':
                schema = generateMainSchema();
                break;
                
            case 'kovry':
            case 'vitrini':
            case 'poly':
            case 'outstaff':
                schema = generateServiceSchema(page);
                break;
                
            case 'faq':
                schema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": FAQ.map(item => ({
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.answer
                        }
                    }))
                };
                break;
                
            case 'testimonials':
                schema = {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": REVIEWS.map((review, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Review",
                            "author": { "@type": "Organization", "name": review.author },
                            "reviewBody": review.reviewBody,
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": review.ratingValue,
                                "bestRating": "5"
                            }
                        }
                    }))
                };
                break;
                
            default:
                // Для остальных страниц - только базовая информация об организации
                schema = {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": COMPANY.name,
                    "url": COMPANY.url,
                    "logo": COMPANY.logo,
                    "description": COMPANY.description,
                    "foundingDate": COMPANY.foundingDate,
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": COMPANY.contactPoint.telephone,
                        "email": COMPANY.contactPoint.email,
                        "contactType": COMPANY.contactPoint.contactType
                    }
                };
        }
        
        insertSchema(schema);
    });
    
    // ============ ЭКСПОРТ ============
    window.SchemaManager = {
        getCompany: () => COMPANY,
        getServices: () => SERVICES,
        getReviews: () => REVIEWS,
        getFAQ: () => FAQ,
        generateMainSchema,
        generateServiceSchema
    };
    
})();