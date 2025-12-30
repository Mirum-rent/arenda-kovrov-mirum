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
                <span itemprop="name">Профессиональная мойка фасадов и витрин для магазинов, торговых центров, бизнес-центров по всей России</span>
            </span>
            <meta itemprop="position" content="3" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Восстановление (реставрация) полов: мрамор, гранит, брекчия, терраццо, паркет, линолеум, керамогранит, натуральный камень, полировка, шлифовка, кристаллизация</span>
            </span>
            <meta itemprop="position" content="4" />
        </span>
        <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="item">
                <span itemprop="name">Аутстаффинг персонала, ЧАЗ, снижение налоговой нагрузки для компаний, аренда персонала, аккредитованное агентство</span>
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
        <img src="https://raw.githubusercontent.com/Mirum-rent/arenda-kovrov-mirum/main/img/logo.png" 
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
    <div class="mobile-contact-buttons">
        <a href="https://t.me/+79770005127" class="btn btn-telegram">
            📱 Telegram
        </a>
        <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" 
           class="btn btn-primary">
            Мы на Авито
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

// Инициализация мобильного меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    // Открытие мобильного меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрытие мобильного меню
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Обработка выпадающих меню в мобильной версии
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            dropdown.classList.toggle('show');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
    
    // Закрытие мобильного меню при клике на ссылку
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-menu a:not(.mobile-dropdown-toggle)');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Управление куками
    const cookieNotice = document.getElementById('cookieNotice');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const rejectCookiesBtn = document.getElementById('rejectCookies');
    
    // Проверяем, было ли уже принято решение о куках
    if (!localStorage.getItem('cookiesAccepted')) {
        // Показываем уведомление через 2 секунды после загрузки страницы
        setTimeout(() => {
            if (cookieNotice) {
                cookieNotice.style.display = 'block';
            }
        }, 2000);
    }
    
    // Обработка принятия куков
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieNotice) {
                cookieNotice.style.display = 'none';
            }
        });
    }
    
    // Обработка отклонения куков
    if (rejectCookiesBtn) {
        rejectCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'false');
            if (cookieNotice) {
                cookieNotice.style.display = 'none';
            }
        });
    }
});