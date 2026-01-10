// === НАЧАЛО MAIN.JS ===
// Основные функции для сайта МИРУМ
// Версия: 4.0 (Минимальная)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js загружен');
    
    initSmoothScroll();
    setActiveNavItem();
    
    if (document.getElementById('russiaMap')) {
        initMap();
    }
});

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
        
        console.log('✅ Карта России загружена');
    } catch (error) {
        console.error('❌ Ошибка при загрузке карты:', error);
    }
}

window.initSmoothScroll = initSmoothScroll;
window.setActiveNavItem = setActiveNavItem;
window.initMap = initMap;

console.log('✅ Все функции main.js инициализированы');
// === КОНЕЦ MAIN.JS ===