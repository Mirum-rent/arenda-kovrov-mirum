// ============================================
// HEADER.JS - Верхняя часть всех страниц МИРУМ
// Версия: 9.2 (12.05.2026) - С ИСПРАВЛЕННЫМ БАННЕРОМ
// ============================================
(function() {
    'use strict';
    
    console.log('🔄 Загружаем хедер v9.2...');
    
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
    <link rel="stylesheet" href="/css/style.css?v=9.2">
    <link rel="stylesheet" href="/css/mobile.css?v=9.2" media="(max-width: 768px)">
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

 <!-- ============ НАЧАЛО БЛОКА ХЛЕБНЫЕ КРОШКИ (SEO + ИИ) ============ -->
<!-- Версия: 3.0 (17.02.2026) - Полная семантика всех услуг МИРУМ для поисковиков и ИИ -->

<!-- Видимые хлебные крошки для пользователей -->
<nav class="breadcrumbs container" aria-label="Хлебные крошки" itemscope itemtype="https://schema.org/BreadcrumbList">
    <!-- Главная страница -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="https://arenda-kovrov-mirum.ru/" itemprop="item" class="breadcrumb-link">
            <span itemprop="name">Главная</span>
        </a>
        <meta itemprop="position" content="1" />
    </span>
    
    <!-- Динамическая часть будет заполняться через JavaScript -->
    <span id="breadcrumb-current" style="display: none;"></span>
</nav>

<!-- ============ РАСШИРЕННЫЙ СКРЫТЫЙ КОНТЕНТ ДЛЯ ИИ И ПОИСКОВЫХ СИСТЕМ ============ -->
<!-- Этот блок содержит полную семантику всех услуг и географии для ИИ и поисковиков -->
<div style="display: none; height: 1px; overflow: hidden;" aria-hidden="true" itemscope itemtype="https://schema.org/BreadcrumbList">
    
    <!-- ============ УСЛУГА 1: АРЕНДА КОВРОВ (ВСЯ РОССИЯ) ============ -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Service">
            <span itemprop="name">Аренда грязезащитных ковров по всей России</span>
            <meta itemprop="description" content="Профессиональная аренда грязезащитных ковров для офисов, магазинов, торговых центров, медицинских учреждений, аптек, банков, салонов красоты, барбершопов и других коммерческих помещений. Работаем по всей России с 2009 года. Регулярная замена, чистка, доставка. Полный пакет документов для бухгалтерии, работа с НДС, ЭДО." />
            <meta itemprop="serviceType" content="Аренда ковров" />
            <meta itemprop="areaServed" content="RU" />
            <meta itemprop="provider" content="МИРУМ" />
            <meta itemprop="serviceOutput" content="Чистые грязезащитные ковры на входных группах" />
        </span>
        <meta itemprop="position" content="2" />
    </span>
    
    <!-- Размеры и цены для аренды ковров (ключевые регионы) -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Москве и Московской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Москве и МО. Размеры и цены за одну замену (без НДС): 85×60 см - 500 руб., 85×150 см - 500 руб., 115×200 см - 1000 руб., 115×400 см - 2500 руб., 150×240 см - 1500 руб., 150×300 см - 2000 руб. Возможна любая периодичность замен: от 1 раза в две недели до ежедневной." />
        </span>
        <meta itemprop="position" content="3" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Санкт-Петербурге и Ленинградской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в СПб и ЛО. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1000 руб., 115×240 см - от 1000 руб., 115×400 см - от 1500 руб., 150×250 см - от 1500 руб., 150×300 см - от 1500 руб." />
        </span>
        <meta itemprop="position" content="4" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Екатеринбурге и Свердловской области</span>
            <meta itemprop="description" content="Аренда ковров в Екатеринбурге. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - от 1000 руб., 115×300 см - от 1500 руб., 150×240 см - от 1500 руб." />
        </span>
        <meta itemprop="position" content="5" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Новосибирске и Новосибирской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Новосибирске. Цены за замену: 85×150 см - от 500 руб., 115×200 см - от 1000 руб., 115×400 см - от 1500 руб., 150×250 см - от 1000 руб., 150×300 см - от 1000 руб." />
        </span>
        <meta itemprop="position" content="6" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Уфе и Республике Башкортостан</span>
            <meta itemprop="description" content="Аренда ковров в Уфе. Цены за замену: 85×150 см - от 500 руб., 115×200 см - от 500 руб., 115×300 см - от 1000 руб., 150×250 см - от 1000 руб., 115×400 см - от 1500 руб." />
        </span>
        <meta itemprop="position" content="7" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Казани и Республике Татарстан</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Казани. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - от 1000 руб., 115×300 см - от 1000 руб., 150×240 см - от 1000 руб." />
        </span>
        <meta itemprop="position" content="8" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Краснодаре и Краснодарском крае</span>
            <meta itemprop="description" content="Аренда ковров в Краснодаре. Цены за замену: 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 1500 руб., 150×600 см - от 2500 руб." />
        </span>
        <meta itemprop="position" content="9" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Ростове-на-Дону и Ростовской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Ростове-на-Дону. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - от 1000 руб., 150×250 см - от 1500 руб., 150×600 см - от 2500 руб." />
        </span>
        <meta itemprop="position" content="10" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Сургуте и ХМАО-Югре</span>
            <meta itemprop="description" content="Аренда ковров в Сургуте. Цены за замену: 85×150 см - от 1000 руб., 115×180 см - от 1000 руб., 115×200 см - от 1500 руб., 115×240 см - от 1500 руб., 115×400 см - от 2500 руб., 150×250 см - от 2000 руб., 150×300 см - от 2500 руб." />
        </span>
        <meta itemprop="position" content="11" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Тюмени и Тюменской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Тюмени. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - от 1000 руб., 115×300 см - от 1000 руб., 150×240 см - от 1000 руб." />
        </span>
        <meta itemprop="position" content="12" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Челябинске и Челябинской области</span>
            <meta itemprop="description" content="Аренда ковров в Челябинске. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - от 1000 руб., 115×300 см - от 1000 руб., 150×240 см - от 1000 руб." />
        </span>
        <meta itemprop="position" content="13" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Нижнем Новгороде и Нижегородской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Нижнем Новгороде. Цены за замену: 85×150 см - 1000 руб., 115×200 см - 1500 руб., 150×300 см - 2500 руб." />
        </span>
        <meta itemprop="position" content="14" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Самаре и Самарской области</span>
            <meta itemprop="description" content="Аренда ковров в Самаре. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 500 руб., 115×200 см - от 1000 руб., 115×300 см - от 1500 руб., 150×240 см - от 1500 руб." />
        </span>
        <meta itemprop="position" content="15" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Воронеже и Воронежской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Воронеже. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1000 руб., 150×300 см - от 2000 руб., 150×250 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="16" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Волгограде и Волгоградской области</span>
            <meta itemprop="description" content="Аренда ковров в Волгограде. Цены за замену: 85×60 см - от 500 руб., 85×150 см - 1000 руб., 115×180 см - от 1000 руб., 115×200 см - 1000 руб., 150×250 см - от 1500 руб., 150×600 см - от 3000 руб." />
        </span>
        <meta itemprop="position" content="17" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Перми и Пермском крае</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Перми. Цены за замену: 85×60 см - 500 руб., 85×150 см - от 500 руб., 115×180 см - 1000 руб., 115×300 см - от 1000 руб., 150×240 см - от 1000 руб." />
        </span>
        <meta itemprop="position" content="18" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Астрахани и Астраханской области</span>
            <meta itemprop="description" content="Аренда ковров в Астрахани. Цены за замену: 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="19" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Саратове и Саратовской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Саратове. Цены за замену: 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×240 см - от 2000 руб., 150×300 см - от 2500 руб." />
        </span>
        <meta itemprop="position" content="20" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Омске и Омской области</span>
            <meta itemprop="description" content="Аренда ковров в Омске. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 2000 руб., 150×300 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="21" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Красноярске и Красноярском крае</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Красноярске. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 2000 руб., 150×300 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="22" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров во Владивостоке и Приморском крае</span>
            <meta itemprop="description" content="Аренда ковров во Владивостоке. Цены за замену: 85×60 см - от 1000 руб., 85×150 см - от 1000 руб., 115×180 см - от 1500 руб., 115×240 см - от 1500 руб., 150×240 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="23" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Иркутске и Иркутской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Иркутске. Цены за замену: 85×60 см - 500 руб., 85×150 см - 1000 руб., 115×200 см - 1000 руб., 115×240 см - 1500 руб., 150×250 см - 1500 руб." />
        </span>
        <meta itemprop="position" content="24" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Улан-Удэ и Республике Бурятия</span>
            <meta itemprop="description" content="Аренда ковров в Улан-Удэ. Цены за замену: 85×60 см - 500 руб., 85×150 см - 1000 руб., 115×200 см - 1000 руб., 115×240 см - 1500 руб., 150×250 см - 1500 руб." />
        </span>
        <meta itemprop="position" content="25" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Кемерово и Кемеровской области</span>
            <meta itemprop="description" content="Аренда грязезащитных ковров в Кемерово. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 2000 руб., 150×300 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="26" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Цены на аренду ковров в Томске и Томской области</span>
            <meta itemprop="description" content="Аренда ковров в Томске. Цены за замену: 85×60 см - от 500 руб., 85×150 см - от 1000 руб., 115×200 см - от 1500 руб., 150×250 см - от 2000 руб., 150×300 см - от 2000 руб." />
        </span>
        <meta itemprop="position" content="27" />
    </span>
    
    <!-- ============ УСЛУГА 2: МОЙКА ВИТРИН И ФАСАДОВ (ВСЯ РОССИЯ, ТОЛЬКО КОММЕРЦИЯ) ============ -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Service">
            <span itemprop="name">Профессиональная мойка витрин и фасадов для коммерческих помещений по всей России</span>
            <meta itemprop="description" content="Профессиональная мойка фасадов, витрин, оконных конструкций для магазинов, аптек, банков, барбершопов, салонов красоты, офисов и других коммерческих помещений. Работаем внутри помещений и снаружи по всей России. Используем профессиональное оборудование и безопасные моющие средства. Работаем в удобное для бизнеса время, не мешая клиентопотоку." />
            <meta itemprop="serviceType" content="Мойка витрин и фасадов" />
            <meta itemprop="areaServed" content="RU" />
            <meta itemprop="provider" content="МИРУМ" />
            <meta itemprop="serviceOutput" content="Чистые витрины и фасады без разводов" />
        </span>
        <meta itemprop="position" content="28" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Мойка витрин в Москве и Московской области</span>
            <meta itemprop="description" content="Мойка витрин магазинов, аптек, банков, салонов красоты, барбершопов в Москве и МО. Цена от 500 руб. за м². Работаем снаружи и внутри помещений. Гибкий график, работа в нерабочее время магазинов." />
        </span>
        <meta itemprop="position" content="29" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Мойка фасадов в Санкт-Петербурге и Ленинградской области</span>
            <meta itemprop="description" content="Профессиональная мойка фасадов коммерческих зданий в СПб. Работаем с магазинами, аптеками, банками. Цены от 500 руб. за м². Используем альпинистское снаряжение для высотных работ." />
        </span>
        <meta itemprop="position" content="30" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Мойка витрин в Екатеринбурге, Новосибирске, Казани, Уфе, Краснодаре, Ростове-на-Дону</span>
            <meta itemprop="description" content="Профессиональная мойка витрин и фасадов в крупнейших городах России. Работаем с коммерческими объектами любой сложности. Цена от 500 руб. за м². Индивидуальный подход к каждому объекту." />
        </span>
        <meta itemprop="position" content="31" />
    </span>
    
    <!-- ============ УСЛУГА 3: ВОССТАНОВЛЕНИЕ ПОЛОВ (МОСКВА И МО) ============ -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Service">
            <span itemprop="name">Восстановление, реставрация, кристаллизация, шлифовка и полировка полов из натурального камня в Москве и Московской области</span>
            <meta itemprop="description" content="Профессиональное восстановление, реставрация, кристаллизация, шлифовка и полировка полов, столешниц, подоконников, лестниц, колонн из натурального камня: мрамор, гранит, терраццо, брекчия, травертин, оникс и другие виды камня. Работаем в Москве и Московской области (по согласованию). Восстанавливаем блеск и структуру камня, удаляем сколы и царапины, защищаем поверхность. Экономия до 70% от стоимости замены покрытия." />
            <meta itemprop="serviceType" content="Реставрация камня" />
            <meta itemprop="areaServed" content="Москва, Московская область" />
            <meta itemprop="provider" content="МИРУМ" />
            <meta itemprop="serviceOutput" content="Обновленная поверхность из натурального камня с защитным слоем" />
        </span>
        <meta itemprop="position" content="32" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Шлифовка и полировка мрамора в Москве</span>
            <meta itemprop="description" content="Профессиональная шлифовка и полировка мраморных полов в Москве. Восстанавливаем блеск, удаляем царапины и потертости. Цена от 110 руб. за м². Работаем с мрамором любой сложности." />
        </span>
        <meta itemprop="position" content="33" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Реставрация гранита в Москве и Московской области</span>
            <meta itemprop="description" content="Реставрация гранитных полов, столешниц, подоконников, лестниц в Москве и МО. Удаляем сколы, восстанавливаем структуру камня. Цена от 110 руб. за м². Гарантия до 2 лет." />
        </span>
        <meta itemprop="position" content="34" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Кристаллизация мрамора и терраццо в Москве</span>
            <meta itemprop="description" content="Кристаллизация мраморных полов и покрытий из терраццо. Придаем зеркальный блеск и защищаем поверхность. Цена от 110 руб. за м². Работаем в офисах, ТЦ, бизнес-центрах." />
        </span>
        <meta itemprop="position" content="35" />
    </span>
    
    <!-- ============ УСЛУГА 4: АУТСТАФФИНГ ПЕРСОНАЛА (ВСЯ РОССИЯ) ============ -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Service">
            <span itemprop="name">Аутстаффинг персонала по всей России</span>
            <meta itemprop="description" content="Профессиональный аутстаффинг (предоставление персонала, лизинг персонала, вывод персонала из штата) по всей России. Выводим сотрудников из штата клиента в штат нашей компании и предоставляем их в аренду. Это позволяет экономить на налогах, штрафах, оптимизировать кадровый учет. Берем на себя все вопросы от контролирующих органов (трудовая инспекция, налоговая, ФМС, миграционная служба). Оформляем иностранных сотрудников, граждан ЕАЭС, СНГ и России. Успешные кейсы до 10 000 сотрудников в одной компании. Любые объемы. Имеем все необходимые лицензии и аккредитации. Особенно актуально для начинающих компаний (экономия и правильное оформление) и для сетевых компаний (масштабирование без кадровых рисков)." />
            <meta itemprop="serviceType" content="Аутстаффинг" />
            <meta itemprop="areaServed" content="RU" />
            <meta itemprop="provider" content="МИРУМ" />
            <meta itemprop="serviceOutput" content="Оформленный персонал в штате нашей компании" />
        </span>
        <meta itemprop="position" content="36" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Аутстаффинг для начинающих компаний</span>
            <meta itemprop="description" content="Помогаем начинающим компаниям сэкономить на персонале и правильно все оформить, чтобы избежать проблем и штрафов. Выводим сотрудников в наш штат, берем на себя кадровый учет и отчетность." />
        </span>
        <meta itemprop="position" content="37" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Аутстаффинг для сетевых компаний</span>
            <meta itemprop="description" content="Оптимизируем кадровые процессы для сетевых компаний. Работаем с объемами до 10 000 сотрудников. Снижаем налоговую нагрузку, минимизируем риски, берем на себя взаимодействие с контролирующими органами." />
        </span>
        <meta itemprop="position" content="38" />
    </span>
    
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Thing">
            <span itemprop="name">Оформление иностранных сотрудников</span>
            <meta itemprop="description" content="Оформляем иностранных сотрудников (граждане ЕАЭС, СНГ, других стран) в штат нашей компании. Берем на себя все вопросы миграционного учета, патентов, разрешений на работу." />
        </span>
        <meta itemprop="position" content="39" />
    </span>
    
    <!-- ============ ОБЩАЯ ИНФОРМАЦИЯ О КОМПАНИИ ============ -->
    <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="item" itemscope itemtype="https://schema.org/Organization">
            <span itemprop="name">МИРУМ - профессиональные услуги чистоты с 2009 года</span>
            <meta itemprop="description" content="Компания МИРУМ (ранее Матсервис, Ковросервис) основана в 2009 году. Специализируемся на аренде грязезащитных ковров, мойке фасадов, восстановлении полов из натурального камня и аутстаффинге персонала. Работаем по всей России. Оператор обработки данных - ООО 'МИРУМ', ИНН 3019008619, ОГРН 1133019002599." />
            <meta itemprop="foundingDate" content="2009" />
            <meta itemprop="email" content="matservice@yandex.ru" />
            <meta itemprop="telephone" content="+79770005127" />
        </span>
        <meta itemprop="position" content="40" />
    </span>
</div>

<!-- Дополнительный скрытый контент с ключевыми словами для ИИ (для лучшего понимания) -->
<div style="display: none;" aria-hidden="true">
    <h3>Полный перечень услуг компании МИРУМ</h3>
    <ul>
        <li><strong>Аренда грязезащитных ковров</strong> - для офисов, магазинов, ТЦ, аптек, банков, медицинских учреждений, салонов красоты, барбершопов. Работаем по всей России. Размеры: 85×60, 85×150, 115×200, 115×400, 150×240, 150×300, 115×180, 115×240, 150×250, 60×90, 90×150, 120×180, 120×250, 115×300, 85×300, 150×600 см. Периодичность: от 1 раза в 2 недели до ежедневной.</li>
        <li><strong>Мойка витрин и фасадов</strong> - для коммерческих помещений (магазины, аптеки, банки, барбершопы, салоны красоты) по всей России. Работаем внутри и снаружи. Цена от 500 руб./м².</li>
        <li><strong>Восстановление полов из натурального камня</strong> - реставрация, кристаллизация, шлифовка, полировка мрамора, гранита, терраццо, брекчии, травертина, оникса. Работаем в Москве и Московской области. Цена от 110 руб./м². Экономия до 70% от замены.</li>
        <li><strong>Аутстаффинг персонала</strong> - вывод сотрудников из штата, предоставление персонала в аренду по всей России. Работаем с любыми объемами (кейсы до 10 000 сотрудников). Оформляем иностранных граждан. Все лицензии и аккредитации.</li>
    </ul>
    
    <h3>География работы (полный список)</h3>
    <p>Москва, Московская область, Санкт-Петербург, Ленинградская область, Екатеринбург, Свердловская область, Новосибирск, Новосибирская область, Уфа, Республика Башкортостан, Казань, Республика Татарстан, Краснодар, Краснодарский край, Ростов-на-Дону, Ростовская область, Сургут, ХМАО-Югра, Тюмень, Тюменская область, Челябинск, Челябинская область, Нижний Новгород, Нижегородская область, Самара, Самарская область, Воронеж, Воронежская область, Волгоград, Волгоградская область, Пермь, Пермский край, Астрахань, Астраханская область, Саратов, Саратовская область, Омск, Омская область, Красноярск, Красноярский край, Владивосток, Приморский край, Иркутск, Иркутская область, Улан-Удэ, Республика Бурятия, Кемерово, Кемеровская область, Томск, Томская область, Ярославль, Тула, Тверь, Брянск, Белгород, Калуга, Рязань, Липецк, Иваново, Кострома, Псков, Великий Новгород, Калининград, Мурманск, Архангельск, Петрозаводск, Сыктывкар, Вологда, Ставрополь, Грозный, Махачкала, Нальчик, Владикавказ, Черкесск, Магас, Йошкар-Ола, Саранск, Чебоксары, Киров, Оренбург, Курган, Ханты-Мансийск, Чита, Благовещенск, Хабаровск, Когалым, Лянтор, Пыть-Ях.</p>
</div>

<!-- Скрипт для динамических хлебных крошек -->
<script>
    (function() {
        // Функция для определения текущей страницы
        function getCurrentPageInfo() {
            const path = window.location.pathname;
            
            if (path === '/' || path.includes('index')) 
                return { name: 'Главная', position: 1 };
            
            if (path.includes('arenda-kovrov')) 
                return { name: 'Аренда грязезащитных ковров', position: 2 };
            
            if (path.includes('window-cleaning')) 
                return { name: 'Мойка витрин и фасадов', position: 2 };
            
            if (path.includes('vosstanovlenie-polov') || path.includes('chistka_polov')) 
                return { name: 'Восстановление полов из камня', position: 2 };
            
            if (path.includes('outstaffing')) 
                return { name: 'Аутстаффинг персонала', position: 2 };
            
            if (path.includes('calculator')) 
                return { name: 'Калькулятор стоимости аренды ковров', position: 2 };
            
            if (path.includes('blog')) 
                return { name: 'Блог компании', position: 2 };
            
            if (path.includes('testimonials')) 
                return { name: 'Отзывы клиентов', position: 2 };
            
            if (path.includes('faq')) 
                return { name: 'Вопросы и ответы', position: 2 };
            
            if (path.includes('privacy-policy')) 
                return { name: 'Политика конфиденциальности', position: 2 };
            
            return null;
        }
        
        const currentPage = getCurrentPageInfo();
        const breadcrumbCurrent = document.getElementById('breadcrumb-current');
        
        if (currentPage && breadcrumbCurrent) {
            // Создаем элемент для текущей страницы в хлебных крошках
            breadcrumbCurrent.style.display = 'inline';
            breadcrumbCurrent.innerHTML = `
                <span class="breadcrumb-separator">→</span>
                <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <span itemprop="item">
                        <span itemprop="name" class="current-page">${currentPage.name}</span>
                    </span>
                    <meta itemprop="position" content="${currentPage.position}" />
                </span>
            `;
        }
        
        console.log('🍞 Хлебные крошки инициализированы');
    })();
</script>
<!-- ============ КОНЕЦ БЛОКА ХЛЕБНЫЕ КРОШКИ ============ -->

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
                    // Добавляем класс closed для полного скрытия
                    disclaimer.classList.add('closed');
                    // Убираем класс visible
                    disclaimer.classList.remove('visible');
                    
                    // Корректируем отступы после закрытия баннера
                    document.body.style.paddingTop = '0';
                    
                    // Обновляем положение хедера
                    const header = document.getElementById('mainHeader');
                    if (header) {
                        header.style.top = '0';
                    }
                    
                    // Обновляем отступ основного контента
                    const main = document.querySelector('main');
                    if (main) {
                        main.style.marginTop = '64px'; // Только высота хедера
                    }
                    
                    // Для мобильных устройств
                    if (window.innerWidth <= 768) {
                        if (main) {
                            main.style.marginTop = '60px';
                        }
                    }
                    if (window.innerWidth <= 480) {
                        if (main) {
                            main.style.marginTop = '60px';
                        }
                    }
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
    
    console.log('✅ Хедер v9.2 успешно загружен');
    
})();