// === НАЧАЛО HEADER.JS ===
// Общая шапка сайта для всех страниц
// Обновляется в одном месте — меняется везде

document.write(`
<!-- [02] НАЧАЛО БЛОКА Хлебные крошки (SEO + ИИ) -->
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
                <span itemprop="name">Аренда ковров (матсервис, ковросервис) в Москве, СПб, Новосибирске, Екатеринбурге, Казани, Уфе, Краснодаре, Ростове-на-Дону, Сургуте, Тюмени, Нижнем Новгороде</span>
            </span>
            <meta itemprop="position" content="2" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Профессиональная мойка фасадов и витрин для магазинов, торговых центров, бизнес-центров</span>
            </span>
            <meta itemprop="position" content="3" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Восстановление (реставрация) полов: мрамор, гранит, паркет, линолеум, керамогранит, натуральный камень, полировка, шливока, кристаллизация</span>
            </span>
            <meta itemprop="position" content="4" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Аутстаффинг персонала, ЧАЗ, снижение налоговой нагрузки для компаний, аренда персонала</span>
            </span>
            <meta itemprop="position" content="5" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">МИРУМ - профессиональные услуги клининга с 2009 года. Работаем по всей России, 40+ городов</span>
            </span>
            <meta itemprop="position" content="6" />
        </span>
    </div>
</nav>
<!-- [02] КОНЕЦ БЛОКА Хлебные крошки -->

<!-- [03] НАЧАЛО БЛОКА Шапка сайта -->
<header class="main-header">
    <div class="header-container container">
        <a href="/" class="logo">
            <img src="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png" 
                 alt="МИРУМ - аренда ковров и восстановление полов" 
                 width="120" height="120">
        </a>
        <nav class="main-nav">
            <ul class="nav-menu">
                <li><a href="/" class="active">Главная</a></li>
                
                <!-- ВЫПАДАЮЩЕЕ МЕНЮ "УСЛУГИ" -->
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Услуги ▼</a>
                    <ul class="dropdown-menu">
                        <li><a href="/index.html#services">Все услуги</a></li>
                        <li><a href="/calculator.html">Аренда ковров</a></li>
                        <li><a href="/window-cleaning.html">Мойка витрин</a></li>
                        <li><a href="/chistka_polov.html">Восстановление полов</a></li>
                        <li><a href="https://resursoria.ru/">Аутстаффинг</a></li>
                    </ul>
                </li>
                
                <li><a href="/index.html#advantages">Преимущества</a></li>
                <li><a href="/index.html#how-to-start">Как начать</a></li>
                <li><a href="/index.html#gallery">Фотогалерея</a></li>
                <li><a href="/index.html#testimonials">Отзывы</a></li>
                <li><a href="/index.html#faq">FAQ</a></li>
                <li><a href="/blog.html">Блог</a></li>
                <li><a href="/calculator.html">Калькулятор</a></li>
                <li><a href="/pogoda.html">Погода</a></li>
                <li><a href="/index.html#contacts">Контакты</a></li>
            </ul>
            
            <!-- Кнопки связи -->
            <div class="contact-buttons">
                <a href="https://t.me/+79770005127" class="btn btn-telegram">
                    📱 Telegram
                </a>
                <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" 
                   class="btn btn-primary">
                    Мы на Авито
                </a>
            </div>
        </nav>
    </div>
</header>
<!-- [03] КОНЕЦ БЛОКА Шапка сайта -->
`);
// === КОНЕЦ HEADER.JS ===