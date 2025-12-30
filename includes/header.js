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
</nav>
<!-- [02] КОНЕЦ БЛОКА Хлебные крошки -->

<!-- [03] НАЧАЛО БЛОКА Шапка сайта -->
<header class="main-header">
    <div class="header-container container">
        <!-- Логотип -->
        <a href="/" class="logo">
            <img src="/img/logo.png" 
                 alt="МИРУМ - аренда ковров и восстановление полов" 
                 width="120" height="60">
        </a>
        
        <!-- Основная навигация -->
        <nav class="main-nav">
            <ul class="nav-menu">
                <li><a href="/" class="active">Главная</a></li>
                
                <!-- ВЫПАДАЮЩЕЕ МЕНЮ "УСЛУГИ" -->
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Услуги <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="/calculator.html">Аренда ковров (матсервис, ковросервис)</a></li>
                        <li><a href="/window-cleaning.html">Мойка витрин и фасадов</a></li>
                        <li><a href="/chistka_polov.html">Восстановление полов</a></li>
                        <li><a href="https://resursoria.ru/">Аутстаффинг персонала</a></li>
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
                    <i class="fab fa-telegram"></i> Telegram
                </a>
                <a href="mailto:matservice@yandex.ru" 
                   class="btn btn-primary">
                    <i class="fas fa-envelope"></i> На почту
                </a>
            </div>
        </nav>
        
        <!-- Кнопка меню для мобильных -->
        <button class="mobile-menu-toggle" aria-label="Открыть меню">
            <i class="fas fa-bars"></i>
        </button>
    </div>
</header>
<!-- [03] КОНЕЦ БЛОКА Шапка сайта -->

<!-- Мобильное меню -->
<div class="mobile-menu-overlay"></div>
<nav class="mobile-menu">
    <div class="mobile-menu-header">
        <img src="/img/logo.png" 
             alt="МИРУМ" width="80">
        <button class="mobile-menu-close" aria-label="Закрыть меню">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <ul class="mobile-nav-menu">
        <li><a href="/" class="active">Главная</a></li>
        <li class="mobile-dropdown">
            <a href="#" class="mobile-dropdown-toggle">Услуги <i class="fas fa-chevron-down"></i></a>
            <ul class="mobile-dropdown-menu">
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
    <div class="mobile-contact-buttons">
        <a href="https://t.me/+79770005127" class="btn btn-telegram">
            <i class="fab fa-telegram"></i> Telegram
        </a>
        <a href="mailto:matservice@yandex.ru" 
           class="btn btn-primary">
            <i class="fas fa-envelope"></i> На почту
        </a>
    </div>
</nav>

<!-- Кнопка плавающего Telegram -->
<div class="telegram-float">
    <a href="https://t.me/+79770005127" class="telegram-link" target="_blank">
        <i class="fab fa-telegram"></i>
        <span>Telegram</span>
    </a>
</div>

<!-- Кнопка "Наверх" -->
<div id="scrollToTop" class="scroll-to-top" aria-label="Вернуться наверх">
    <i class="fas fa-chevron-up"></i>
</div>

<!-- Уведомление о куках -->
<div class="cookie-notice" id="cookieNotice">
    <div class="container">
        <p>
            Мы используем файлы cookie для улучшения работы сайта. 
            <a href="/privacy-policy.html">Политика конфиденциальности</a>
        </p>
        <div class="cookie-buttons">
            <button class="cookie-btn cookie-accept" id="acceptCookies">Принять</button>
            <button class="cookie-btn cookie-reject" id="rejectCookies">Отклонить</button>
        </div>
    </div>
</div>
`);

// === КОНЕЦ HEADER.JS ===