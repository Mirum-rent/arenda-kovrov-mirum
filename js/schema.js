// ============================================
// SCHEMA.JS - Полная микроразметка Schema.org
// Версия: 6.0 (05.01.2026)
// ============================================

(function() {
    'use strict';
    
    console.log('🔍 Загружаем микроразметку Schema.org');
    
    // ============ ОСНОВНЫЕ ДАННЫЕ КОМПАНИИ ============
    const COMPANY_DATA = {
        name: "МИРУМ",
        alternateName: ["Матсервис", "Ковросервис"],
        description: "Профессиональные услуги чистоты и восстановления с 2009 года",
        foundingDate: "2009",
        url: "https://arenda-kovrov-mirum.ru/",
        logo: "https://arenda-kovrov-mirum.ru/img/logo.png",
        address: {
            streetAddress: "ул. Сущёвская, 27с2",
            addressLocality: "Москва",
            postalCode: "127055",
            addressCountry: "RU"
        },
        contactPoint: {
            telephone: "+79770005127",
            email: "matservice@yandex.ru",
            contactType: "customer service",
            areaServed: "RU",
            availableLanguage: ["Russian"]
        }
    };
    
    // ============ ДАННЫЕ УСЛУГ ============
    const SERVICES_DATA = {
        // Услуга 1: Аренда ковров
        "arenda-kovrov": {
            name: "Аренда грязезащитных ковров",
            description: "Аренда входных ковров для бизнеса с заменой и обслуживанием",
            offers: [
                {
                    name: "Ковер 85×60 см",
                    price: "180",
                    priceCurrency: "RUB",
                    unitText: "замена"
                },
                {
                    name: "Ковер 115×200 см",
                    price: "760",
                    priceCurrency: "RUB",
                    unitText: "замена"
                }
            ],
            areaServed: ["Москва", "Санкт-Петербург", "Уфа", "Казань", "Екатеринбург", "Новосибирск", "Краснодар", "Ростов-на-Дону"]
        },
        
        // Услуга 2: Мойка витрин
        "window-cleaning": {
            name: "Мойка витрин и фасадов",
            description: "Профессиональная мойка коммерческих витрин и фасадов",
            offers: [
                {
                    name: "Разовая мойка",
                    price: "500",
                    priceCurrency: "RUB",
                    unitText: "квадратный метр"
                },
                {
                    name: "Абонентское обслуживание",
                    price: "300",
                    priceCurrency: "RUB",
                    unitText: "квадратный метр в месяц"
                }
            ],
            areaServed: ["Москва", "Московская область", "Санкт-Петербург", "Ленинградская область"]
        },
        
        // Услуга 3: Восстановление полов
        "vosstanovlenie-polov": {
            name: "Восстановление полов",
            description: "Восстановление паркета, мрамора, гранита, линолеума",
            offers: [
                {
                    name: "Циклевка паркета",
                    price: "720",
                    priceCurrency: "RUB",
                    unitText: "квадратный метр"
                },
                {
                    name: "Шлифовка мрамора",
                    price: "350",
                    priceCurrency: "RUB",
                    unitText: "квадратный метр"
                }
            ],
            areaServed: ["Москва", "Московская область"]
        },
        
        // Услуга 4: Аутстаффинг
        "outstaffing": {
            name: "Аутстаффинг клинингового персонала",
            description: "Оформление клинингового персонала в штат нашей компании",
            offers: [
                {
                    name: "Уборщик помещения",
                    price: "45000",
                    priceCurrency: "RUB",
                    unitText: "месяц"
                }
            ],
            areaServed: ["Российская Федерация"]
        }
    };
    
    // ============ ДАННЫЕ ОТЗЫВОВ ============
    const REVIEWS_DATA = [
        {
            author: "Сеть магазинов одежды",
            datePublished: "2024-11-15",
            reviewBody: "Работаем с МИРУМ с 2015 года. Отличный сервис, всегда вовремя меняют ковры. Все документы приходят вовремя.",
            ratingValue: "5",
            bestRating: "5"
        },
        {
            author: "Медицинский центр",
            datePublished: "2024-10-20",
            reviewBody: "Очень довольны сервисом по мойке витрин. Работают аккуратно, не мешают пациентам. Рекомендуем!",
            ratingValue: "5",
            bestRating: "5"
        },
        {
            author: "Торговый центр",
            datePublished: "2024-09-10",
            reviewBody: "Восстановили 5000 м² линолеума. Сэкономили около 70% по сравнению с заменой. Качество отличное.",
            ratingValue: "5",
            bestRating: "5"
        }
    ];
    
    // ============ ОСНОВНАЯ СХЕМА ============
    function generateMainSchema() {
        return {
            "@context": "https://schema.org",
            "@graph": [
                // 1. Организация
                {
                    "@type": "Organization",
                    "@id": COMPANY_DATA.url + "#organization",
                    "name": COMPANY_DATA.name,
                    "alternateName": COMPANY_DATA.alternateName,
                    "description": COMPANY_DATA.description,
                    "url": COMPANY_DATA.url,
                    "logo": COMPANY_DATA.logo,
                    "foundingDate": COMPANY_DATA.foundingDate,
                    "sameAs": [
                        "https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13"
                    ],
                    "address": {
                        "@type": "PostalAddress",
                        ...COMPANY_DATA.address
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        ...COMPANY_DATA.contactPoint
                    },
                    "areaServed": {
                        "@type": "Country",
                        "name": "Россия"
                    },
                    "serviceType": [
                        "Аренда грязезащитных ковров",
                        "Мойка витрин и фасадов",
                        "Восстановление полов",
                        "Аутстаффинг клинингового персонала"
                    ]
                },
                
                // 2. Веб-сайт
                {
                    "@type": "WebSite",
                    "@id": COMPANY_DATA.url + "#website",
                    "url": COMPANY_DATA.url,
                    "name": COMPANY_DATA.name,
                    "description": COMPANY_DATA.description,
                    "publisher": {
                        "@id": COMPANY_DATA.url + "#organization"
                    }
                },
                
                // 3. Сборный объект для всех услуг
                {
                    "@type": "ItemList",
                    "itemListElement": Object.keys(SERVICES_DATA).map((serviceKey, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Service",
                            "name": SERVICES_DATA[serviceKey].name,
                            "description": SERVICES_DATA[serviceKey].description,
                            "provider": {
                                "@id": COMPANY_DATA.url + "#organization"
                            },
                            "areaServed": SERVICES_DATA[serviceKey].areaServed.map(area => ({
                                "@type": "AdministrativeArea",
                                "name": area
                            })),
                            "offers": SERVICES_DATA[serviceKey].offers.map(offer => ({
                                "@type": "Offer",
                                "name": offer.name,
                                "price": offer.price,
                                "priceCurrency": offer.priceCurrency,
                                "priceSpecification": {
                                    "@type": "PriceSpecification",
                                    "price": offer.price,
                                    "priceCurrency": offer.priceCurrency,
                                    "unitText": offer.unitText
                                }
                            }))
                        }
                    }))
                },
                
                // 4. Отзывы
                {
                    "@type": "ItemList",
                    "itemListElement": REVIEWS_DATA.map((review, index) => ({
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
                                "bestRating": review.bestRating
                            },
                            "itemReviewed": {
                                "@id": COMPANY_DATA.url + "#organization"
                            }
                        }
                    }))
                },
                
                // 5. FAQ (скрытое, для ИИ)
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "Как часто нужно менять ковры?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Рекомендуемая частота замены: в офисах - 1 раз в неделю, в магазинах - 2 раза в неделю, в медицинских учреждениях - ежедневно."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Работаете ли вы по всей России?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Да, мы работаем во всех регионах России. Основные города: Москва, Санкт-Петербург, Екатеринбург, Новосибирск, Казань, Уфа, Краснодар, Ростов-на-Дону и другие."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Какие документы вы предоставляете?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Предоставляем полный пакет документов: договор, акты выполненных работ, счета-оферты. Работаем с НДС, подходим для крупных компаний."
                            }
                        }
                    ]
                }
            ]
        };
    }
    
    // ============ ФУНКЦИЯ ВСТАВКИ СХЕМЫ ============
    function insertSchema() {
        try {
            const schemaData = generateMainSchema();
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schemaData, null, 2);
            
            // Добавляем в head
            document.head.appendChild(script);
            
            console.log('✅ Микроразметка успешно добавлена');
            console.log('📊 Услуг:', Object.keys(SERVICES_DATA).length);
            console.log('⭐ Отзывов:', REVIEWS_DATA.length);
            
        } catch (error) {
            console.error('❌ Ошибка при добавлении микроразметки:', error);
        }
    }
    
    // ============ ФУНКЦИЯ ДЛЯ КОНКРЕТНОЙ УСЛУГИ ============
    function insertServiceSchema(serviceKey) {
        if (!SERVICES_DATA[serviceKey]) {
            console.warn(`Услуга "${serviceKey}" не найдена`);
            return;
        }
        
        const service = SERVICES_DATA[serviceKey];
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            "provider": {
                "@type": "Organization",
                "name": COMPANY_DATA.name,
                "url": COMPANY_DATA.url
            },
            "areaServed": service.areaServed.map(area => ({
                "@type": "AdministrativeArea",
                "name": area
            })),
            "offers": service.offers.map(offer => ({
                "@type": "Offer",
                "name": offer.name,
                "price": offer.price,
                "priceCurrency": offer.priceCurrency,
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": offer.price,
                    "priceCurrency": offer.priceCurrency,
                    "unitText": offer.unitText
                }
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(serviceSchema, null, 2);
        document.head.appendChild(script);
        
        console.log(`✅ Микроразметка для услуги "${service.name}" добавлена`);
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', function() {
        // Определяем текущую страницу
        const path = window.location.pathname;
        
        if (path.includes('arenda-kovrov')) {
            insertServiceSchema('arenda-kovrov');
        } else if (path.includes('window-cleaning')) {
            insertServiceSchema('window-cleaning');
        } else if (path.includes('vosstanovlenie-polov') || path.includes('chistka_polov')) {
            insertServiceSchema('vosstanovlenie-polov');
        } else if (path.includes('outstaffing')) {
            insertServiceSchema('outstaffing');
        } else if (path === '/' || path.includes('index')) {
            // Главная страница - полная микроразметка
            insertSchema();
        }
        
        // Для всех страниц добавляем базовую микроразметку организации
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": COMPANY_DATA.name,
            "url": COMPANY_DATA.url,
            "logo": COMPANY_DATA.logo
        };
        
        const baseScript = document.createElement('script');
        baseScript.type = 'application/ld+json';
        baseScript.textContent = JSON.stringify(baseSchema);
        document.head.appendChild(baseScript);
    });
    
    // ============ ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ============
    window.SchemaManager = {
        insertSchema,
        insertServiceSchema,
        getCompanyData: () => COMPANY_DATA,
        getServicesData: () => SERVICES_DATA,
        getReviewsData: () => REVIEWS_DATA
    };
    
})();
// ============ КОНЕЦ SCHEMA.JS ============