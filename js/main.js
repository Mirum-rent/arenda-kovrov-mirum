// ============================================
// MAIN.JS - Основные функции для сайта МИРУМ
// Версия: 9.6 (18.02.2026) - ПОЛНАЯ, ОПТИМИЗИРОВАННАЯ
// ============================================

(function() {
    'use strict';
    
    console.log('✅ main.js загружен, версия 9.6');
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📦 Инициализация основных функций...');
        
        initSmoothScroll();
        initActiveMenu();
        initLazyLoading();
        initPhoneMask();
        initBackToTop();
        initExternalLinks();
        initYearUpdate();
    });
    
    // ============ ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ============
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Пропускаем ссылки на другие страницы
                if (href.includes('.html')) return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Учитываем высоту фиксированного хедера
                    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 20; // дополнительный отступ
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Обновляем URL без перезагрузки
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    // ============ АКТИВНЫЙ ПУНКТ МЕНЮ ============
    function initActiveMenu() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Убираем якоря из сравнения
            const cleanHref = href.split('#')[0];
            
            // Сравниваем пути
            if (cleanHref === currentPath || 
                (currentPath === '/' && cleanHref === '/index.html') ||
                (currentPath === '/index.html' && cleanHref === '/') ||
                (currentPath.includes(cleanHref) && cleanHref !== '/' && cleanHref !== '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ============ ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ============
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback для старых браузеров
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.classList.add('loaded');
            });
        }
    }
    
    // ============ МАСКА ДЛЯ ТЕЛЕФОНА ============
    function initPhoneMask() {
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                // Форматируем +7 (XXX) XXX-XX-XX
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
            
            // Добавляем маску при потере фокуса
            input.addEventListener('blur', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length === 11) {
                    // Валидный номер
                    input.style.borderColor = '#27ae60';
                } else if (value.length > 0) {
                    // Невалидный номер
                    input.style.borderColor = '#e74c3c';
                }
            });
            
            input.addEventListener('focus', function(e) {
                input.style.borderColor = '';
            });
        });
    }
    
    // ============ КНОПКА "НАВЕРХ" ============
    function initBackToTop() {
        const backToTopBtn = document.getElementById('scrollToTop');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // ============ ВНЕШНИЕ ССЫЛКИ ============
    function initExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
    
    // ============ ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ ============
    function initYearUpdate() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
        
        // Обновляем год в копирайте, если он есть как текст
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) {
            copyright.innerHTML = copyright.innerHTML.replace(/2009-202\d/, `2009-${currentYear}`);
        }
    }
    
    // ============ ОБЩИЕ УТИЛИТЫ ============
    window.MIRUM = {
        // Форматирование даты
        formatDate: function(date) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(date).toLocaleDateString('ru-RU', options);
        },
        
        // Форматирование цены
        formatPrice: function(price) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        },
        
        // Валидация email
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        // Валидация телефона
        validatePhone: function(phone) {
            const clean = phone.replace(/\D/g, '');
            return clean.length === 11 && (clean.startsWith('7') || clean.startsWith('8'));
        },
        
        // Показ уведомления
        showToast: function(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },
        
        // Копирование в буфер обмена
        copyToClipboard: function(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.showToast('Скопировано!', 'success');
                }
            } catch (err) {
                console.error('Ошибка копирования:', err);
                this.showToast('Ошибка копирования', 'error');
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };
    
    // Добавляем стили для toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
})();