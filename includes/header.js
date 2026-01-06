// ============================================
// HEADER.JS - Верхняя часть всех страниц МИРУМ
// Версия: 6.0 (05.01.2026)
// ============================================

(function() {
    'use strict';
    
    // Функция для вставки хедера
    function insertHeader() {
        document.write(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>Аренда грязезащитных ковров и восстановление полов | МИРУМ с 2009</title>
    <meta name="description" content="✅ Аренда грязезащитных ковров, мойка фасадов, восстановление полов. Работаем по всей России с 2009 года. Быстрый переход на Telegram и почту.">
    
    <!-- SEO метатеги -->
    // В начало файла header.js добавить:
const currentPage = window.location.pathname;

// Затем динамически генерировать canonical:
let canonicalUrl = 'https://arenda-kovrov-mirum.ru/';

if (currentPage.includes('outstaffing.html')) {
    canonicalUrl = 'https://arenda-kovrov-mirum.ru/outstaffing.html';
} else if (currentPage.includes('arenda-kovrov.html')) {
    canonicalUrl = 'https://arenda-kovrov-mirum.ru/arenda-kovrov.html';
}
// и так далее для всех страниц

// В шаблон вставить:
<link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow" />
    
    <!-- Ключевые слова -->
    <meta name="keywords" content="аренда грязезащитных ковров, мойка фасадов, восстановление полов, шлифовка мрамора, полировка гранита, аренда персонала, аутстаффинг, грязезащита, входные ковры">
    
    <!-- Гео-метатеги -->
    <meta name="geo.region" content="RU">
    <meta name="geo.placename" content="Russia">
    <meta name="geo.position" content="55.755826;37.6173">
    <meta name="ICBM" content="55.755826, 37.6173">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="МИРУМ - Аренда ковров и восстановление полов по всей России">
    <meta property="og:description" content="Профессиональные услуги с 2009 года. Аренда ковров, мойка фасадов, восстановление полов, аутстаффинг персонала.">
    <meta property="og:url" content="https://arenda-kovrov-mirum.ru/">
    <meta property="og:image" content="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png">
    
    <!-- Фавиконки -->
    <link rel="icon" type="image/x-icon" href="/img/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/img/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#16a085">
    
    <!-- Подключаем обновленные стили -->
    <link rel="stylesheet" href="/css/style.css">
    
    <!-- Мобильные стили -->
    <link rel="stylesheet" href="/css/mobile.css" media="(max-width: 768px)">
    
    <!-- Font Awesome для иконок -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Leaflet.js для интерактивной карты -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
            crossorigin=""></script>
</head>
<body>

<!-- Хлебные крошки (SEO) -->
<nav class="breadcrumbs container" aria-label="Хлебные крошки">
    <div itemscope itemtype="https://schema.org/BreadcrumbList">
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="https://arenda-kovrov-mirum.ru/" itemprop="item">
                <span itemprop="name">Главная - Аренда грязезащитных ковров в Москве, Санкт-Петербурге, по всей России</span>
            </a>
            <meta itemprop="position" content="1" />
        </span>
    </div>
    
    <!-- Скрытый контент для ИИ с ключевыми словами -->
    <div style="display: none;" itemscope itemtype="https://schema.org/BreadcrumbList">
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Аренда ковров в Москве, СПб, Новосибирске, Екатеринбурге, Казани, Уфе, Краснодаре, Ростове-на-Дону, Сургуте, Тюмени</span>
            </span>
            <meta itemprop="position" content="2" />
        </span>
    </div>
</nav>

<!-- Шапка сайта -->
<header class="main-header" id="mainHeader">
    <div class="header-container container">
        <a href="/" class="logo">
            <img src="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png" 
                 alt="МИРУМ - аренда ковров и восстановление полов" 
                 width="150" height="50">
        </a>
        
        <!-- Десктопная навигация -->
        <nav class="desktop-nav">
            <ul class="nav-links">
                <li><a href="/" class="active">Главная</a></li>
                
                <!-- Выпадающее меню "Услуги" -->
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Услуги</a>
                    <ul class="dropdown-menu">
                        <li><a href="/arenda-kovrov.html">Аренда грязезащитных ковров</a></li>
                        <li><a href="/window-cleaning.html">Мойка витрин и фасадов</a></li>
                        <li><a href="/vosstanovlenie-polov.html">Восстановление полов</a></li>
                        <li><a href="/outstaffing.html">Аутстаффинг персонала</a></li>
                    </ul>
                </li>
                
                <li><a href="#advantages">Преимущества</a></li>
                <li><a href="#how-to-start">Как начать</a></li>
                <li><a href="/calculator.html">Калькулятор</a></li>
                <li><a href="#testimonials">Отзывы</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="/blog.html">Блог</a></li>
                <li><a href="#contacts">Контакты</a></li>
            </ul>
        </nav>
        
        <!-- Кнопки связи -->
        <div class="header-contacts">
            <a href="https://t.me/+79770005127" class="btn-telegram" data-consent-required>
                <i class="fab fa-telegram"></i> Telegram
            </a>
            <a href="mailto:matservice@yandex.ru" class="btn btn-primary">
                <i class="fas fa-envelope"></i> Email
            </a>
        </div>
        
        <!-- Мобильное меню-бургер -->
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Открыть меню">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
    
    <!-- Мобильное меню -->
    <nav class="mobile-nav" id="mobileNav">
        <ul class="mobile-menu">
            <li><a href="/">Главная</a></li>
            
            <!-- Выпадающее меню "Услуги" -->
            <li class="mobile-dropdown">
                <a href="#" class="mobile-dropdown-toggle">Услуги</a>
                <ul class="mobile-dropdown-menu">
                    <li><a href="/arenda-kovrov.html">Аренда грязезащитных ковров</a></li>
                    <li><a href="/window-cleaning.html">Мойка витрин и фасадов</a></li>
                    <li><a href="/vosstanovlenie-polov.html">Восстановление полов</a></li>
                    <li><a href="/outstaffing.html">Аутстаффинг персонала</a></li>
                </ul>
            </li>
            
            <li><a href="#advantages">Преимущества</a></li>
            <li><a href="#how-to-start">Как начать</a></li>
            <li><a href="/calculator.html">Калькулятор</a></li>
            <li><a href="#testimonials">Отзывы</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="/blog.html">Блог</a></li>
            <li><a href="#contacts">Контакты</a></li>
        </ul>
        
        <!-- Контакты в мобильном меню -->
        <div class="mobile-contacts">
            <a href="https://t.me/+79770005127" class="btn-telegram" data-consent-required>
                <i class="fab fa-telegram"></i> Написать в Telegram
            </a>
            <a href="mailto:matservice@yandex.ru" class="btn btn-primary">
                <i class="fas fa-envelope"></i> Отправить Email
            </a>
        </div>
    </nav>
</header>

<main>
        `);
    }
    
    // Вызываем функцию при загрузке
    insertHeader();
    
})();