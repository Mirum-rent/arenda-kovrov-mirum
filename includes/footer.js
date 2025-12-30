// === НАЧАЛО MAIN.JS ===
// Основные функции для сайта МИРУМ

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js загружен');
    
    // Инициализация выпадающего меню
    initDropdownMenu();
    
    // Плавная прокрутка для якорных ссылок
    initSmoothScroll();
    
    // Инициализация кнопки "Наверх"
    initScrollToTop();
    
    // Проверка текущей страницы для активного меню
    setActiveNavItem();
});

// Функция для инициализации выпадающего меню
function initDropdownMenu() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Клик по кнопке
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Закрываем другие открытые меню
                document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                    if (openMenu !== menu) {
                        openMenu.classList.remove('show');
                    }
                });
                
                // Переключаем текущее меню
                menu.classList.toggle('show');
            });
            
            // Клик вне меню закрывает его
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
            
            // Наведение для десктопов
            if (window.innerWidth > 768) {
                dropdown.addEventListener('mouseenter', function() {
                    menu.classList.add('show');
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    menu.classList.remove('show');
                });
            }
        }
    });
    
    console.log('✅ Выпадающее меню инициализировано');
}

// Функция для плавной прокрутки
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якоря на текущей странице и внешние ссылки
            if (href === '#' || href === '#!' || href.startsWith('http')) return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем выпадающее меню на мобильных
                if (window.innerWidth <= 768) {
                    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
            }
        });
    });
}

// Функция для кнопки "Наверх"
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Функция для установки активного пункта меню
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath === '/' && href === '/index.html') ||
            (currentPath === '/index.html' && href === '/')) {
            link.classList.add('active');
        }
    });
}

// Утилитная функция для проверки поддержки localStorage
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
        return false;
    }
}

// Утилитная функция для форматирования чисел
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

// Утилитная функция для определения устройства
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Экспорт функций для глобального использования
window.initDropdownMenu = initDropdownMenu;
window.initSmoothScroll = initSmoothScroll;
window.initScrollToTop = initScrollToTop;
window.setActiveNavItem = setActiveNavItem;
window.supportsLocalStorage = supportsLocalStorage;
window.formatNumber = formatNumber;
window.isMobileDevice = isMobileDevice;

console.log('✅ Все функции main.js экспортированы');
// === КОНЕЦ MAIN.JS ===