// === НАЧАЛО MAIN.JS ===
// Основные функции для сайта МИРУМ
// Версия: 3.0 (Упрощенная версия)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js загружен');
    
    // Плавная прокрутка
    initSmoothScroll();
    
    // Проверка текущей страницы для активного меню
    setActiveNavItem();
    
    // Инициализация карты (если она есть на странице)
    if (document.getElementById('russiaMap')) {
        initMap();
    }
});

// ============================================
// ОСНОВНЫЕ ФУНКЦИИ САЙТА
// ============================================

// Функция для плавной прокрутки
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('http')) return;
            
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

// Функция для инициализации карты
function initMap() {
    if (typeof L === 'undefined') {
        console.log('⚠️ Leaflet.js не загружен');
        return;
    }
    
    try {
        const map = L.map('russiaMap').setView([55.7558, 37.6176], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 12,
            minZoom: 3
        }).addTo(map);
        
        const regions = [
            { name: "Москва", lat: 55.7558, lng: 37.6176, color: "green" },
            { name: "Санкт-Петербург", lat: 59.9343, lng: 30.3351, color: "green" },
            { name: "Нижний Новгород", lat: 56.2965, lng: 43.9361, color: "green" },
            { name: "Казань", lat: 55.8304, lng: 49.0661, color: "green" },
            { name: "Уфа", lat: 54.7388, lng: 55.9721, color: "green" },
            { name: "Екатеринбург", lat: 56.8389, lng: 60.6057, color: "green" },
            { name: "Челябинск", lat: 55.1644, lng: 61.4368, color: "green" },
            { name: "Новосибирск", lat: 55.0302, lng: 82.9204, color: "green" },
            { name: "Красноярск", lat: 56.0153, lng: 92.8932, color: "green" },
            { name: "Сургут", lat: 61.2541, lng: 73.3962, color: "green" },
            { name: "Тюмень", lat: 57.1613, lng: 65.525, color: "green" },
            { name: "Пермь", lat: 58.0105, lng: 56.2502, color: "green" },
            { name: "Астрахань", lat: 46.3479, lng: 48.0336, color: "green" },
            { name: "Ростов-на-Дону", lat: 47.2225, lng: 39.7188, color: "green" },
            { name: "Краснодар", lat: 45.0355, lng: 38.9753, color: "green" },
        ];
        
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
        
        window.russiaMap = map;
        
        console.log('✅ Карта России загружена');
    } catch (error) {
        console.error('❌ Ошибка при загрузке карты:', error);
    }
}

// Экспорт функций
window.initSmoothScroll = initSmoothScroll;
window.setActiveNavItem = setActiveNavItem;
window.initMap = initMap;

console.log('✅ Все функции main.js инициализированы');
// === КОНЕЦ MAIN.JS ===