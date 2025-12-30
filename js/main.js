// === НАЧАЛО MAIN.JS ===
// Основные функции для сайта МИРУМ
// ============================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА
// ============================================

// Улучшенная функция для инициализации калькулятора
function initCalculatorEnhanced() {
    const calculatorForm = document.querySelector('.calculator-form');
    if (!calculatorForm) return;
    
    // Добавляем класс для страницы калькулятора
    document.body.classList.add('calculator-page');
    
    // Кнопка показа/скрытия меню на мобильных
    const showMenuBtn = document.createElement('button');
    showMenuBtn.className = 'show-menu-btn';
    showMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    showMenuBtn.style.display = 'none';
    document.body.appendChild(showMenuBtn);
    
    // Обработка фокуса на полях ввода
    const formInputs = calculatorForm.querySelectorAll('select, input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            document.body.classList.add('calculator-active');
            if (window.innerWidth <= 768) {
                showMenuBtn.style.display = 'flex';
            }
        });
        
        input.addEventListener('blur', function() {
            // Не убираем активный режим сразу, только если не все поля пустые
            const hasValues = Array.from(formInputs).some(input => input.value.trim() !== '');
            if (!hasValues) {
                document.body.classList.remove('calculator-active');
                showMenuBtn.style.display = 'none';
            }
        });
    });
    
    // Обработка кнопки показа меню
    showMenuBtn.addEventListener('click', function() {
        document.body.classList.remove('calculator-active');
        this.style.display = 'none';
        // Прокрутка к верху
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Адаптация для мобильных при открытии результатов
    const viewOrderBtn = document.getElementById('viewOrderSection');
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                document.body.classList.add('calculator-active');
                showMenuBtn.style.display = 'flex';
            }
        });
    }
    
    // Обработка отправки формы в Telegram с полной информацией
    const sendButtons = document.querySelectorAll('.btn-telegram');
    sendButtons.forEach(btn => {
        if (btn.onclick) return; // Если уже есть обработчик
        
        btn.addEventListener('click', function() {
            sendOrderToTelegramEnhanced();
        });
    });
    
    console.log('✅ Калькулятор улучшен для мобильных устройств');
}

// Улучшенная функция отправки в Telegram
function sendOrderToTelegramEnhanced() {
    try {
        // Получаем данные из формы
        const region = document.getElementById('region')?.value;
        const size = document.getElementById('size')?.value;
        const frequency = document.getElementById('frequency')?.value;
        const quantity = document.getElementById('quantity')?.value;
        
        if (!region || !size || !frequency || !quantity) {
            alert('Пожалуйста, заполните все поля калькулятора');
            return;
        }
        
        // Получаем цены из localStorage или расчетов
        const orderPositions = getOrderPositions();
        let message = '🧮 Расчет аренды ковров МИРУМ:\n\n';
        
        if (orderPositions.length > 0) {
            orderPositions.forEach((pos, index) => {
                message += `${index + 1}. ${pos.size}, ${pos.quantity} шт.\n`;
                message += `   Частота: ${pos.frequency}\n`;
                message += `   Регион: ${pos.region}\n`;
                message += `   Цена за замену: ${pos.pricePerChange} ₽\n`;
                message += `   Стоимость в месяц: ${pos.monthlyCost} ₽\n\n`;
            });
            
            const total = orderPositions.reduce((sum, pos) => sum + pos.monthlyCost, 0);
            message += `💰 Общая стоимость в месяц: ${total} ₽\n`;
        } else {
            // Базовая информация из формы
            message += `📍 Регион: ${region}\n`;
            message += `📏 Размер ковра: ${size}\n`;
            message += `🔄 Частота замены: ${frequency}\n`;
            message += `📦 Количество: ${quantity} шт.\n\n`;
            message += `📊 Для точного расчета заполните калькулятор полностью.\n`;
        }
        
        message += `\n📞 Свяжитесь со мной для уточнения деталей.\n`;
        message += `⏰ Время запроса: ${new Date().toLocaleString('ru-RU')}\n`;
        message += `🌐 Страница: Калькулятор`;
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram.');
    }
}

// Обновляем инициализацию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Улучшенная инициализация калькулятора
    if (document.querySelector('.calculator-form')) {
        initCalculatorEnhanced();
    }
    
    // ... остальной код ...
});

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
    
    // Инициализация калькулятора (если он есть на странице)
    if (document.querySelector('.calculator-form')) {
        initCalculator();
    }
    
    // Инициализация карты (если она есть на странице)
    if (document.getElementById('russiaMap')) {
        initMap();
    }
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация формы обратной связи
    initContactForm();
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
    const navLinks = document.querySelectorAll('.nav-links a');
    
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

// Функция для инициализации мобильного меню
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuToggle && mobileMenu) {
        // Открытие мобильного меню
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        });
        
        // Закрытие мобильного меню
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Закрытие при клике на ссылку
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// Функция для инициализации карты
function initMap() {
    // Проверяем, есть ли библиотека Leaflet
    if (typeof L === 'undefined') {
        console.log('⚠️ Leaflet.js не загружен');
        return;
    }
    
    try {
        // Создаем карту с центром в Москве
        const map = L.map('russiaMap').setView([55.7558, 37.6176], 4);
        
        // Добавляем слой OpenStreetMap БЕЗ украинских тайлов
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 12,
            minZoom: 3
        }).addTo(map);
        
        // Массив регионов России
        const regions = [
            // Центральный ФО
            { name: "Москва", lat: 55.7558, lng: 37.6176, color: "green", status: "active" },
            { name: "Санкт-Петербург", lat: 59.9343, lng: 30.3351, color: "green", status: "active" },
            { name: "Нижний Новгород", lat: 56.2965, lng: 43.9361, color: "green", status: "active" },
            { name: "Казань", lat: 55.8304, lng: 49.0661, color: "green", status: "active" },
            { name: "Уфа", lat: 54.7388, lng: 55.9721, color: "green", status: "active" },
            { name: "Екатеринбург", lat: 56.8389, lng: 60.6057, color: "green", status: "active" },
            { name: "Челябинск", lat: 55.1644, lng: 61.4368, color: "green", status: "active" },
            { name: "Новосибирск", lat: 55.0302, lng: 82.9204, color: "green", status: "active" },
            { name: "Красноярск", lat: 56.0153, lng: 92.8932, color: "green", status: "active" },
            { name: "Сургут", lat: 61.2541, lng: 73.3962, color: "green", status: "active" },
            { name: "Тюмень", lat: 57.1613, lng: 65.525, color: "green", status: "active" },
            { name: "Пермь", lat: 58.0105, lng: 56.2502, color: "green", status: "active" },
            { name: "Астрахань", lat: 46.3479, lng: 48.0336, color: "green", status: "active" },
            { name: "Ростов-на-Дону", lat: 47.2225, lng: 39.7188, color: "green", status: "active" },
            { name: "Краснодар", lat: 45.0355, lng: 38.9753, color: "green", status: "active" },
        ];
        
        // Добавляем маркеры
        regions.forEach(region => {
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: ${region.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16]
            });
            
            const marker = L.marker([region.lat, region.lng], { icon: icon }).addTo(map);
            
            const popupContent = `
                <div style="padding: 10px; max-width: 250px;">
                    <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${region.name}</h4>
                    <p style="margin: 0 0 5px 0;"><strong>Статус:</strong> ✅ Работаем</p>
                    <p style="margin: 0 0 5px 0; font-size: 0.9em; color: #666;">
                        • Аренда ковров<br>
                        • Мойка витрин<br>
                        • Восстановление полов
                    </p>
                    <a href="/calculator.html" style="color: #16a085; font-weight: 600; text-decoration: none;">
                        Рассчитать стоимость →
                    </a>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
        
        // Сохраняем карту в глобальной области видимости
        window.russiaMap = map;
        
        // Функции управления картой
        window.zoomToMoscow = function() {
            map.setView([55.7558, 37.6176], 10);
        };
        
        window.zoomToSpb = function() {
            map.setView([59.9343, 30.3351], 10);
        };
        
        window.zoomToAllRussia = function() {
            map.setView([55.7558, 37.6176], 4);
        };
        
        console.log('✅ Карта России загружена');
    } catch (error) {
        console.error('❌ Ошибка при загрузке карты:', error);
    }
}

// Функция для инициализации формы обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            const consent = document.getElementById('contactConsent').checked;
            
            // Проверяем согласие
            if (!consent) {
                alert('Пожалуйста, дайте согласие на обработку данных');
                return;
            }
            
            // Формируем сообщение для Telegram
            let telegramMessage = `📞 Новая заявка с сайта:\n`;
            telegramMessage += `👤 Имя: ${name}\n`;
            telegramMessage += `📧 Email: ${email}\n`;
            telegramMessage += `📞 Телефон: ${phone}\n`;
            
            if (message) {
                telegramMessage += `📝 Сообщение: ${message}\n`;
            }
            
            telegramMessage += `🌐 Страница: ${window.location.href}\n`;
            telegramMessage += `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
            
            // Кодируем сообщение для URL
            const encodedMessage = encodeURIComponent(telegramMessage);
            const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
            
            // Открываем Telegram
            window.open(telegramUrl, '_blank');
            
            // Сбрасываем форму
            contactForm.reset();
            
            // Показываем сообщение об успехе
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
        });
    }
}

// Функция для инициализации калькулятора
function initCalculator() {
    // Эта функция будет в отдельном файле calculator.js
    console.log('Калькулятор найден, инициализация в calculator.js');
}

// Утилитные функции
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
        return false;
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Экспорт функций для глобального использования
window.initDropdownMenu = initDropdownMenu;
window.initSmoothScroll = initSmoothScroll;
window.initScrollToTop = initScrollToTop;
window.setActiveNavItem = setActiveNavItem;
window.initMobileMenu = initMobileMenu;
window.initMap = initMap;
window.initContactForm = initContactForm;

console.log('✅ Все функции main.js инициализированы');
// === КОНЕЦ MAIN.JS ===