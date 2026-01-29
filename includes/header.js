// ============================================
// HEADER.JS - Верхняя часть всех страниц МИРУМ
// Версия: 9.1 (29.01.2026) - С ИСПРАВЛЕННЫМ БАННЕРОМ
// ============================================
(function() {
    'use strict';
    
    console.log('🔄 Загружаем хедер v9.1...');
    
    // Получаем текущую страницу для определения canonical
    const currentPage = window.location.pathname;
    let canonicalUrl = 'https://arenda-kovrov-mirum.ru/';
    
    if (currentPage.includes('outstaffing.html')) {
        canonicalUrl = 'https://arenda-kovrov-mirum.ru/outstaffing.html';
    } else if (currentPage.includes('arenda-kovrov.html')) {
        canonicalUrl = 'https://arenda-kovrov-mirum.ru/arenda-kovrov.html';
    } else if (currentPage.includes('calculator.html')) {
        canonicalUrl = 'https://arenda-kovrov-mirum.ru/calculator.html';
    } else if (currentPage.includes('window-cleaning.html')) {
        canonicalUrl = 'https://arenda-kovrov-mirum.ru/window-cleaning.html';
    } else if (currentPage.includes('vosstanovlenie-polov.html') || currentPage.includes('chistka_polov.html')) {
        canonicalUrl = 'https://arenda-kovrov-mirum.ru/vosstanovlenie-polov.html';
    }
    
    // Определяем активный пункт меню
    let activePage = '';
    if (currentPage === '/' || currentPage.includes('index')) {
        activePage = 'Главная';
    } else if (currentPage.includes('arenda-kovrov')) {
        activePage = 'Аренда ковров';
    } else if (currentPage.includes('calculator')) {
        activePage = 'Калькулятор';
    }
    
    const headerHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <!-- ============ НАЧАЛО META ТЕГОВ ============ -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    
    <!-- ============ SEO МЕТАДАННЫЕ ============ -->
    <title>МИРУМ - Аренда грязезащитных ковров и услуги чистоты по всей России с 2009</title>
    <meta name="description" content="✅ Аренда грязезащитных ковров, мойка фасадов, восстановление полов. Работаем по всей России с 2009 года. Быстрый переход на Telegram и почту.">
    
    <!-- Каноническая ссылка -->
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow" />
    
    <!-- Ключевые слова -->
    <meta name="keywords" content="аренда грязезащитных ковров, мойка фасадов, восстановление полов, шлифовка мрамора, полировка гранита, аренда персонала, аутстаффинг, грязезащита, входные ковры">
    
    <!-- Гео-метатеги -->
    <meta name="geo.region" content="RU">
    <meta name="geo.placename" content="Russia">
    <meta name="geo.position" content="55.755826;37.6173">
    <meta name="ICBM" content="55.755826, 37.6173">
    
    <!-- Open Graph для социальных сетей -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="МИРУМ - Аренда ковров и восстановление полов по всей России">
    <meta property="og:description" content="Профессиональные услуги с 2009 года. Аренда ковров, мойка фасадов, восстановление полов, аутстаффинг персонала.">
    <meta property="og:url" content="https://arenda-kovrov-mirum.ru/">
    <meta property="og:image" content="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png">
    <meta property="og:site_name" content="МИРУМ">
    
    <!-- ============ ФАВИКОНЫ И PWA ============ -->
    <link rel="icon" type="image/x-icon" href="/img/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#16a085">
    
    <!-- ============ СТИЛИ С ВЕРСИОНИРОВАНИЕМ ============ -->
    <link rel="stylesheet" href="/css/style.css?v=9.1">
    <link rel="stylesheet" href="/css/mobile.css?v=9.1" media="(max-width: 768px)">
    <link rel="stylesheet" href="/css/calculator.css" media="screen">
    
    <!-- ============ ВНЕШНИЕ БИБЛИОТЕКИ ============ -->
    <!-- Font Awesome для иконок -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Leaflet.js для карты (отложенная загрузка) -->
    <link rel="preload" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" as="style">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossorigin="" media="print" onload="this.media='all'">
    
    <!-- ============ ПРЕЗОНТАЦИЯ ДЛЯ ИИ ============ -->
    <!-- Для ИИ: МИРУМ - профессиональные услуги чистоты с 2009 года -->
    <!-- Основные услуги: аренда ковров, мойка витрин, восстановление полов, аутстаффинг -->
    <!-- География: 40+ городов России, работаем по всей стране -->
    <!-- Контакты: Telegram +7 (977) 000-51-27, Email: matservice@yandex.ru -->
    <!-- ============ КОНЕЦ META ТЕГОВ ============ -->
</head>
<body>

    <!-- ============ НАЧАЛО БАННЕРА О ТЕЛЕФОНЕ ============ -->
    <!-- === БАННЕР НАЧАЛО === -->
    <div class="phone-disclaimer" id="phoneDisclaimer">
        <div class="container">
            <div class="disclaimer-content">
                <span class="disclaimer-icon">📱</span>
                <span class="disclaimer-text">
                    <strong>Внимание:</strong> В связи с переходом на новое оборудование могут возникать трудности с телефонной связью. 
                    Мы всегда оперативно отвечаем в 
                    <a href="https://t.me/+79770005127" class="disclaimer-link">Telegram</a> и на 
                    <a href="mailto:matservice@yandex.ru" class="disclaimer-link">Email</a>.
                </span>
                <button class="disclaimer-close" id="disclaimerClose" aria-label="Закрыть уведомление">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
    <!-- === БАННЕР КОНЕЦ === -->
    <!-- ============ КОНЕЦ БАННЕРА О ТЕЛЕФОНЕ ============ -->

    <!-- ============ НАЧАЛО ХЛЕБНЫХ КРОШЕК ============ -->
    <nav class="breadcrumbs container" aria-label="Хлебные крошки">
        <div itemscope itemtype="https://schema.org/BreadcrumbList">
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a href="https://arenda-kovrov-mirum.ru/" itemprop="item">
                    <span itemprop="name">Главная - Аренда грязезащитных ковров в Москве, Санкт-Петербурге, по всей России</span>
                </a>
                <meta itemprop="position" content="1" />
            </span>
            ${activePage ? `→ <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <span itemprop="item">
                    <span itemprop="name">${activePage}</span>
                </span>
                <meta itemprop="position" content="2" />
            </span>` : ''}
        </div>
    </nav>
    <!-- ============ КОНЕЦ ХЛЕБНЫХ КРОШЕК ============ -->

    <!-- ============ НАЧАЛО ШАПКИ САЙТА ============ -->
    <header class="main-header" id="mainHeader">
        <div class="header-container container">
            <!-- Логотип -->
            <a href="/" class="logo">
                <img src="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png" 
                     alt="МИРУМ - аренда ковров и восстановление полов" 
                     width="150" height="50" loading="eager">
            </a>
            
            <!-- Десктопная навигация -->
            <nav class="desktop-nav" aria-label="Основная навигация">
                <ul class="nav-links">
                    <li><a href="/" class="${currentPage === '/' || currentPage.includes('index') ? 'active' : ''}">Главная</a></li>
                    
                    <!-- Выпадающее меню "Услуги" -->
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">Услуги</a>
                        <ul class="dropdown-menu">
                            <li><a href="/arenda-kovrov.html" class="${currentPage.includes('arenda-kovrov') ? 'active' : ''}">Аренда грязезащитных ковров</a></li>
                            <li><a href="/window-cleaning.html" class="${currentPage.includes('window-cleaning') ? 'active' : ''}">Мойка витрин и фасадов</a></li>
                            <li><a href="/vosstanovlenie-polov.html" class="${currentPage.includes('vosstanovlenie-polov') || currentPage.includes('chistka_polov') ? 'active' : ''}">Восстановление полов</a></li>
                            <li><a href="/outstaffing.html" class="${currentPage.includes('outstaffing') ? 'active' : ''}">Аутстаффинг персонала</a></li>
                        </ul>
                    </li>
                    
                    <li><a href="#advantages" class="${currentPage.includes('#advantages') ? 'active' : ''}">Преимущества</a></li>
                    <li><a href="#how-to-start" class="${currentPage.includes('#how-to-start') ? 'active' : ''}">Как начать</a></li>
                    <li><a href="/calculator.html" class="${currentPage.includes('calculator') ? 'active' : ''}">Калькулятор</a></li>
                    <li><a href="#testimonials" class="${currentPage.includes('#testimonials') ? 'active' : ''}">Отзывы</a></li>
                    <li><a href="#faq" class="${currentPage.includes('#faq') ? 'active' : ''}">FAQ</a></li>
                    <li><a href="/blog.html" class="${currentPage.includes('blog') ? 'active' : ''}">Блог</a></li>
                    <li><a href="#contacts" class="${currentPage.includes('#contacts') ? 'active' : ''}">Контакты</a></li>
                </ul>
            </nav>
            
            <!-- Кнопки связи в хедере -->
            <div class="header-contacts">
                <a href="https://t.me/+79770005127" class="btn-telegram header-btn" data-consent-required aria-label="Написать в Telegram">
                    <i class="fab fa-telegram"></i> Telegram
                </a>
                <a href="mailto:matservice@yandex.ru" class="btn btn-primary header-btn" aria-label="Написать на Email">
                    <i class="fas fa-envelope"></i> Email
                </a>
                <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" 
                   class="btn btn-avito header-btn" 
                   target="_blank"
                   rel="noopener"
                   aria-label="Мы на Авито">
                    <i class="fas fa-store"></i> Мы на Авито
                </a>
            </div>
            
            <!-- Мобильное меню-бургер -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Открыть меню" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        
        <!-- Мобильное меню -->
        <nav class="mobile-nav" id="mobileNav" aria-label="Мобильная навигация">
            <ul class="mobile-menu">
                <li><a href="/" class="${currentPage === '/' || currentPage.includes('index') ? 'active' : ''}">Главная</a></li>
                
                <!-- Выпадающее меню "Услуги" для мобильных -->
                <li class="mobile-dropdown">
                    <a href="#" class="mobile-dropdown-toggle">Услуги</a>
                    <ul class="mobile-dropdown-menu">
                        <li><a href="/arenda-kovrov.html" class="${currentPage.includes('arenda-kovrov') ? 'active' : ''}">Аренда грязезащитных ковров</a></li>
                        <li><a href="/window-cleaning.html" class="${currentPage.includes('window-cleaning') ? 'active' : ''}">Мойка витрин и фасадов</a></li>
                        <li><a href="/vosstanovlenie-polov.html" class="${currentPage.includes('vosstanovlenie-polov') || currentPage.includes('chistka_polov') ? 'active' : ''}">Восстановление полов</a></li>
                        <li><a href="/outstaffing.html" class="${currentPage.includes('outstaffing') ? 'active' : ''}">Аутстаффинг персонала</a></li>
                    </ul>
                </li>
                
                <li><a href="#advantages" class="${currentPage.includes('#advantages') ? 'active' : ''}">Преимущества</a></li>
                <li><a href="#how-to-start" class="${currentPage.includes('#how-to-start') ? 'active' : ''}">Как начать</a></li>
                <li><a href="/calculator.html" class="${currentPage.includes('calculator') ? 'active' : ''}">Калькулятор</a></li>
                <li><a href="#testimonials" class="${currentPage.includes('#testimonials') ? 'active' : ''}">Отзывы</a></li>
                <li><a href="#faq" class="${currentPage.includes('#faq') ? 'active' : ''}">FAQ</a></li>
                <li><a href="/blog.html" class="${currentPage.includes('blog') ? 'active' : ''}">Блог</a></li>
                <li><a href="#contacts" class="${currentPage.includes('#contacts') ? 'active' : ''}">Контакты</a></li>
                <li><a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" 
                       target="_blank"
                       rel="noopener"
                       class="${currentPage.includes('avito') ? 'active' : ''}">Мы на Авито</a></li>
            </ul>
            
            <!-- Контакты в мобильном меню -->
            <div class="mobile-contacts">
                <a href="https://t.me/+79770005127" class="btn-telegram" data-consent-required>
                    <i class="fab fa-telegram"></i> Написать в Telegram
                </a>
                <a href="mailto:matservice@yandex.ru" class="btn btn-primary">
                    <i class="fas fa-envelope"></i> Отправить Email
                </a>
                <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" 
                   class="btn btn-avito"
                   target="_blank"
                   rel="noopener">
                    <i class="fas fa-store"></i> Мы на Авито
                </a>
            </div>
        </nav>
    </header>
    <!-- ============ КОНЕЦ ШАПКИ САЙТА ============ -->

    <!-- ============ НАЧАЛО ОСНОВНОГО КОНТЕНТА ============ -->
    <main>

<script>
    // Скрипт для работы с баннером о телефоне
    // === БАННЕР НАЧАЛО (скрипт) ===
    document.addEventListener('DOMContentLoaded', function() {
        const disclaimer = document.getElementById('phoneDisclaimer');
        const closeBtn = document.getElementById('disclaimerClose');
        
        // Всегда показываем баннер
        if (disclaimer) {
            disclaimer.style.display = 'block';
            disclaimer.classList.add('visible');
        }
        
        // Обработчик закрытия баннера
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                if (disclaimer) {
                    disclaimer.classList.remove('visible');
                    setTimeout(() => {
                        disclaimer.style.display = 'none';
                        // НЕ сохраняем в localStorage - показываем всегда при загрузке
                    }, 300);
                }
            });
        }
    });
    // === БАННЕР КОНЕЦ (скрипт) ===
</script>
`;

    // Вставляем хедер
    document.open();
    document.write(headerHTML);
    document.close();
    
    console.log('✅ Хедер v9.1 успешно загружен');
    
})();