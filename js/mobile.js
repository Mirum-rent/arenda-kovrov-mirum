// ============================================
// MOBILE.JS - Мобильная оптимизация для МИРУМ
// Версия: 3.2 (18.02.2026) - ПОЛНАЯ, ИСПРАВЛЕННАЯ
// ============================================

(function() {
    'use strict';
    
    console.log('📱 mobile.js загружен, версия 3.2');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 Инициализация мобильных функций...');
        
        initMobileMenu();
        initTouchOptimization();
        initTableScroll();
        initCalculatorMobile();
        preventIOSZoom();
        handleOrientationChange();
    });
    
    // ============ МОБИЛЬНОЕ МЕНЮ ============
    function initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (!menuToggle || !mobileNav) {
            console.warn('📱 Элементы мобильного меню не найдены');
            return;
        }
        
        // Клонируем элементы для очистки старых обработчиков
        const newToggle = menuToggle.cloneNode(true);
        const newNav = mobileNav.cloneNode(true);
        
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        mobileNav.parentNode.replaceChild(newNav, mobileNav);
        
        const finalToggle = document.getElementById('mobileMenuToggle');
        const finalNav = document.getElementById('mobileNav');
        
        // Открытие/закрытие меню
        finalToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            finalNav.classList.toggle('active');
            
            if (finalNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('menu-open');
            } else {
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }
        });
        
        // Закрытие при клике на ссылку
        finalNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                finalToggle.classList.remove('active');
                finalNav.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (finalNav.classList.contains('active') && 
                !finalNav.contains(e.target) && 
                !finalToggle.contains(e.target)) {
                finalToggle.classList.remove('active');
                finalNav.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }
        });
        
        // Мобильные выпадающие списки
        finalNav.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            
            if (toggle) {
                const newToggle = toggle.cloneNode(true);
                toggle.parentNode.replaceChild(newToggle, toggle);
                
                newToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Закрываем другие открытые
                    finalNav.querySelectorAll('.mobile-dropdown').forEach(other => {
                        if (other !== dropdown && other.classList.contains('active')) {
                            other.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                });
            }
        });
    }
    
    // ============ ОПТИМИЗАЦИЯ ДЛЯ ТАЧ-УСТРОЙСТВ ============
    function initTouchOptimization() {
        // Увеличиваем зоны клика
        document.querySelectorAll('.btn, a, button, .faq-question, .gallery-item').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, { passive: true });
        });
        
        // Предотвращаем залипание при скролле
        document.addEventListener('touchmove', function() {
            // Ничего не делаем, просто разрешаем скролл
        }, { passive: true });
    }
    
    // ============ ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ТАБЛИЦ ============
    function initTableScroll() {
        const tables = document.querySelectorAll('.comparison-table, .size-table, .price-table');
        
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            wrapper.style.cssText = `
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                margin: 20px 0;
            `;
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }
    
    // ============ АДАПТАЦИЯ КАЛЬКУЛЯТОРА ============
    function initCalculatorMobile() {
        if (!document.querySelector('.calculator-section')) return;
        
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .calculator-grid {
                    grid-template-columns: 1fr !important;
                    gap: 20px !important;
                }
                
                .calculator-actions {
                    flex-direction: column !important;
                }
                
                .calculator-actions .btn {
                    width: 100% !important;
                    margin: 5px 0 !important;
                }
                
                .positions-list .position-item {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                }
                
                .positions-list .position-price {
                    margin-left: 0 !important;
                    margin-top: 10px !important;
                }
                
                .month-inputs {
                    grid-template-columns: 1fr !important;
                }
                
                .form-row {
                    grid-template-columns: 1fr !important;
                }
                
                .calculator-form select,
                .calculator-form input {
                    font-size: 16px !important;
                    min-height: 44px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============ ЗАЩИТА ОТ ЗУМА НА IOS ============
    function preventIOSZoom() {
        if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) return;
        
        // Предотвращаем зум при двойном тапе
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Увеличиваем шрифт в полях ввода
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.style.fontSize = '16px';
        });
    }
    
    // ============ ОБРАБОТКА ПОВОРОТА ЭКРАНА ============
    function handleOrientationChange() {
        let resizeTimer;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            
            // Закрываем меню при повороте на десктопную ширину
            if (window.innerWidth > 768) {
                const menuToggle = document.getElementById('mobileMenuToggle');
                const mobileNav = document.getElementById('mobileNav');
                
                if (menuToggle && mobileNav && mobileNav.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
            
            // Обновляем высоту vh для мобильных (проблема с адресной строкой)
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            resizeTimer = setTimeout(() => {
                console.log('📱 Изменение размера экрана:', window.innerWidth, 'x', window.innerHeight);
            }, 250);
        });
        
        // Устанавливаем начальное значение vh
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // ============ ДОБАВЛЯЕМ CSS-ПЕРЕМЕННЫЕ ============
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile-first стили */
        @media (max-width: 768px) {
            .container {
                padding-left: 15px !important;
                padding-right: 15px !important;
            }
            
            h1 { font-size: 1.8rem !important; }
            h2 { font-size: 1.5rem !important; }
            h3 { font-size: 1.3rem !important; }
            
            .section {
                padding: 40px 0 !important;
            }
            
            .grid-3, .grid-4 {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }
            
            /* Таблицы */
            .table-wrapper {
                margin: 15px -15px !important;
                width: calc(100% + 30px) !important;
                padding: 0 15px !important;
            }
            
            /* Галерея */
            .gallery-grid {
                grid-template-columns: 1fr !important;
            }
            
            .gallery-item {
                aspect-ratio: 16/9 !important;
            }
            
            /* FAQ */
            .faq-question {
                padding: 15px 40px 15px 15px !important;
                font-size: 1rem !important;
            }
            
            /* Кнопки */
            .btn {
                min-height: 44px !important;
                padding: 12px 20px !important;
            }
            
            /* Плавающие элементы */
            .telegram-float {
                bottom: 15px !important;
                right: 15px !important;
            }
            
            .telegram-link span {
                display: none !important;
            }
            
            .telegram-link {
                width: 56px !important;
                height: 56px !important;
                border-radius: 50% !important;
                padding: 0 !important;
                justify-content: center !important;
            }
            
            .telegram-link i {
                font-size: 1.8rem !important;
                margin: 0 !important;
            }
            
            .scroll-to-top {
                bottom: 80px !important;
                right: 15px !important;
                width: 44px !important;
                height: 44px !important;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
            
            h1 { font-size: 1.6rem !important; }
            h2 { font-size: 1.4rem !important; }
            h3 { font-size: 1.2rem !important; }
            
            .faq-question {
                padding: 12px 35px 12px 12px !important;
            }
        }
        
        /* Исправление для iOS */
        @supports (-webkit-touch-callout: none) {
            .main-header {
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                backdrop-filter: saturate(180%) blur(20px);
                background-color: rgba(255, 255, 255, 0.95);
            }
            
            .mobile-nav {
                -webkit-overflow-scrolling: touch;
            }
        }
    `;
    document.head.appendChild(style);
    
})();