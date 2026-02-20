// === НАЧАЛО MAIN.JS ===
// Основные функции для сайта МИРУМ
// Версия: 9.0 (20.02.2026) - Полная функциональность
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ main.js загружен');
    
    initSmoothScroll();
    setActiveNavItem();
    initPhoneMask();
    initBackToTop();
    
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
        
        // Для мобильного меню
        if (href.includes(currentPath.replace('.html', '')) && currentPath !== '/') {
            link.classList.add('active');
        }
    });
}

function initPhoneMask() {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('7') || value.startsWith('8')) {
                value = '+7' + value.substring(1);
            } else if (!value.startsWith('+7') && value.length > 0) {
                value = '+7' + value;
            }
            
            if (value.length > 2) {
                value = value.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
            }
            
            e.target.value = value;
        });
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('scrollToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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
window.initPhoneMask = initPhoneMask;
window.initBackToTop = initBackToTop;

console.log('✅ Все функции main.js инициализированы');
// === КОНЕЦ MAIN.JS ===