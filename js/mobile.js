// ============================================
// MOBILE.JS - Мобильная оптимизация для МИРУМ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 mobile.js загружен');
    
    // 1. ИНИЦИАЛИЗАЦИЯ МОБИЛЬНОГО МЕНЮ
    initMobileMenu();
    
    // 2. СКРЫТИЕ ХЕДЕРА ПРИ СКРОЛЛЕ
    initHeaderHide();
    
    // 3. АДАПТАЦИЯ ЭЛЕМЕНТОВ ПОД МОБИЛЬНЫЕ
    adaptElementsForMobile();
    
    // 4. ПРОВЕРКА КОНТРАСТНОСТИ
    checkContrastIssues();
    
    // 5. ОСОБЫЕ НАСТРОЙКИ ДЛЯ КАЛЬКУЛЯТОРА
    if (window.location.pathname.includes('calculator.html')) {
        setupCalculatorMobile();
    }
    
    // 6. ОБРАБОТКА ИНТЕРАКТИВНОЙ КАРТЫ НА МОБИЛЬНЫХ
    fixMobileMap();
    
    // 7. ПРОГНОЗ ПОГОДЫ В МЕНЮ
    addWeatherToMenu();
});

// ============ 1. МОБИЛЬНОЕ МЕНЮ ============
function initMobileMenu() {
    // Создаем элементы мобильного меню
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    // Создаем кнопку меню-бургер
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.id = 'mobileMenuToggle';
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    // Находим контейнер хедера и добавляем кнопку
    const headerContainer = header.querySelector('.header-container');
    if (headerContainer) {
        headerContainer.appendChild(menuToggle);
    }
    
    // Создаем мобильное меню
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobileNav';
    
    // Структура меню из ТЗ
    const menuHTML = `
        <ul class="mobile-menu">
            <li><a href="/">Главная</a></li>
            
            <!-- Выпадающее меню "Услуги" -->
            <li class="mobile-dropdown">
                <a href="#" class="mobile-dropdown-toggle">Услуги</a>
                <ul class="mobile-dropdown-menu">
                    <li><a href="/arenda-kovrov.html">Аренда грязезащитных ковров</a></li>
                    <li><a href="/window-cleaning.html">Мойка витрин</a></li>
                    <li><a href="/chistka_polov.html">Восстановление полов</a></li>
                    <li><a href="https://resursoria.ru/" target="_blank">Аутстаффинг</a></li>
                </ul>
            </li>
            
            <li><a href="/calculator.html">Калькулятор</a></li>
            <li><a href="/FAQ.html">FAQ</a></li>
            <li><a href="/blog.html">Блог</a></li>
            <li><a href="/testimonials.html">Отзывы</a></li>
            <li><a href="/pogoda.html">Прогноз погоды</a></li>
            <li><a href="#contacts">Контакты</a></li>
        </ul>
    `;
    
    mobileNav.innerHTML = menuHTML;
    document.body.appendChild(mobileNav);
    
    // Обработчики событий для меню
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Блокируем скролл страницы при открытом меню
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || 
                this.classList.contains('mobile-dropdown-toggle')) {
                e.preventDefault();
                
                // Обработка выпадающего меню
                if (this.classList.contains('mobile-dropdown-toggle')) {
                    const dropdown = this.closest('.mobile-dropdown');
                    dropdown.classList.toggle('active');
                }
                return;
            }
            
            // Закрываем меню для обычных ссылок
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Плавная прокрутка для якорных ссылок
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 60;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при нажатии Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============ 2. СКРЫТИЕ ХЕДЕРА ПРИ СКРОЛЛЕ ============
function initHeaderHide() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    let isScrolling = false;
    
    // В калькуляторе всегда скрываем хедер
    if (window.location.pathname.includes('calculator.html')) {
        header.classList.add('hidden');
        return;
    }
    
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        isScrolling = true;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если открыто мобильное меню - не скрываем хедер
        const mobileMenu = document.getElementById('mobileNav');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            isScrolling = false;
            return;
        }
        
        // При скролле вниз скрываем, вверх - показываем
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Скролл вниз
            header.classList.add('hidden');
        } else {
            // Скролл вверх
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Дебаунс для производительности
        setTimeout(() => {
            isScrolling = false;
        }, 100);
    }, { passive: true });
}

// ============ 3. АДАПТАЦИЯ ЭЛЕМЕНТОВ ============
function adaptElementsForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Увеличиваем размеры кликабельных элементов
        document.querySelectorAll('button:not(.mobile-menu-toggle), a.btn, input[type="submit"]').forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
        
        // Увеличиваем отступы для удобства касания
        document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select').forEach(el => {
            if (el.offsetHeight < 44) {
                el.style.padding = '12px 15px';
            }
        });
        
        // Предотвращаем зум iOS при фокусе
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
        
        // Оптимизируем таблицы
        document.querySelectorAll('table').forEach(table => {
            if (table.offsetWidth > window.innerWidth) {
                table.style.display = 'block';
                table.style.overflowX = 'auto';
                table.style.webkitOverflowScrolling = 'touch';
            }
        });
    }
}

// ============ 4. ПРОВЕРКА КОНТРАСТНОСТИ ============
function checkContrastIssues() {
    // Проблемные элементы, которые нужно исправить
    const problemElements = [];
    
    // 1. Проверяем основные элементы
    document.querySelectorAll('.hero p, .testimonials-preview p, .footer p, .footer a:not(.btn)').forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        // Простая проверка (можно доработать с библиотекой)
        if (bgColor.includes('rgba(0, 0, 0') || bgColor.includes('rgb(0, 0, 0')) {
            if (color.includes('rgba(100') || color.includes('rgb(100')) {
                el.classList.add('text-dark-on-dark');
                problemElements.push(el);
            }
        }
    });
    
    // 2. Исправляем хлебные крошки на мобильных
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs && window.innerWidth <= 768) {
        breadcrumbs.style.display = 'none'; // Скрываем на мобильных
    }
    
    if (problemElements.length > 0) {
        console.log('⚠️ Найдены проблемы с контрастностью:', problemElements.length);
    }
}

// ============ 5. НАСТРОЙКИ КАЛЬКУЛЯТОРА ============
function setupCalculatorMobile() {
    const header = document.querySelector('.main-header');
    if (header) {
        header.classList.add('hidden'); // Всегда скрываем в калькуляторе
    }
    
    // Адаптируем интерфейс калькулятора
    const calculator = document.querySelector('.calculator-section');
    if (calculator && window.innerWidth <= 768) {
        // Упрощаем форму калькулятора
        const forms = calculator.querySelectorAll('.calculator-form');
        forms.forEach(form => {
            form.style.gridTemplateColumns = '1fr';
            form.style.gap = '15px';
        });
        
        // Улучшаем таблицы
        const tables = calculator.querySelectorAll('.result-table');
        tables.forEach(table => {
            table.style.fontSize = '14px';
            table.style.display = 'block';
            table.style.overflowX = 'auto';
        });
        
        // Добавляем автоскролл к результатам
        const calculateBtn = calculator.querySelector('button[onclick="calculate()"]');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                setTimeout(() => {
                    const results = calculator.querySelector('.calculator-results');
                    if (results) {
                        results.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }, 300);
            });
        }
    }
}

// ============ 6. ИСПРАВЛЕНИЯ ДЛЯ КАРТЫ ============
function fixMobileMap() {
    // Убираем флаг Украины из карты
    const mapContainer = document.getElementById('russiaMap');
    if (mapContainer) {
        // Ждем загрузки карты
        setTimeout(() => {
            // Ищем элементы с украинской символикой
            const svgElements = mapContainer.querySelectorAll('svg');
            svgElements.forEach(svg => {
                const paths = svg.querySelectorAll('path');
                paths.forEach(path => {
                    const d = path.getAttribute('d') || '';
                    // Простая проверка (можно улучшить)
                    if (d.includes('Ukraine') || d.includes('UA')) {
                        path.style.display = 'none';
                    }
                });
                
                // Убираем текстовые элементы с украинскими названиями
                const textElements = svg.querySelectorAll('text');
                textElements.forEach(text => {
                    if (text.textContent.includes('Ukraine') || 
                        text.textContent.includes('Украина') ||
                        text.textContent.includes('Киев')) {
                        text.style.display = 'none';
                    }
                });
            });
            
            // Также проверяем тайлы карты
            const tiles = mapContainer.querySelectorAll('.leaflet-tile');
            tiles.forEach(tile => {
                if (tile.src.includes('ukraine') || tile.src.includes('UA')) {
                    tile.style.display = 'none';
                }
            });
        }, 2000);
    }
}

// ============ 7. ДОБАВЛЕНИЕ ПОГОДЫ В МЕНЮ ============
function addWeatherToMenu() {
    // Уже добавлено в initMobileMenu()
}

// ============ 8. АДАПТАЦИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ============
window.addEventListener('resize', function() {
    adaptElementsForMobile();
    
    // Переинициализация меню при переходе с мобильного на десктоп
    if (window.innerWidth > 768) {
        const mobileNav = document.getElementById('mobileNav');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileNav) mobileNav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============ 9. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';
    
    return 'unknown';
}

// Экспорт функций для использования в других скриптах
window.MobileUtils = {
    isMobile: isMobileDevice,
    getOS: getMobileOS,
    initMenu: initMobileMenu
};