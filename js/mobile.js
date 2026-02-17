// ============================================
// MOBILE.JS - ПОЛНАЯ мобильная оптимизация для МИРУМ
// Версия: 3.0 (17.02.2026) - Объединенная версия (меню + калькулятор)
// ============================================

(function() {
    'use strict';
    
    console.log('📱 Загружаем mobile.js v3.0...');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 DOM загружен, инициализация...');
        
        // Инициализация мобильного меню (общая для всех страниц)
        initMobileMenu();
        
        // Проверка на страницу калькулятора
        const isCalculatorPage = window.location.pathname.includes('calculator') || 
                                document.querySelector('.calculator-section') ||
                                document.querySelector('.calculator-form');
        
        if (isCalculatorPage) {
            console.log('📊 Обнаружена страница калькулятора');
            initCalculatorMobile();
        }
        
        // Общая оптимизация для всех мобильных устройств
        initMobileOptimizations();
    });
    
    // ============ ОСНОВНАЯ ФУНКЦИЯ МОБИЛЬНОГО МЕНЮ ============
    function initMobileMenu() {
        console.log('📱 Инициализация мобильного меню...');
        
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        
        // Проверяем наличие элементов меню
        if (!menuToggle || !mobileNav) {
            console.warn('📱 Элементы мобильного меню не найдены');
            return;
        }
        
        console.log('✅ Мобильное меню найдено');
        
        // Обработчик клика по бургеру
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Блокируем прокрутку body когда меню открыто
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('📱 Меню открыто');
            } else {
                document.body.style.overflow = '';
                console.log('📱 Меню закрыто');
            }
        });
        
        // Закрытие меню при клике на ссылку
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его (на затемненную область)
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Обработка мобильных выпадающих списков
        mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Закрываем другие открытые дропдауны
                    mobileDropdowns.forEach(other => {
                        if (other !== dropdown && other.classList.contains('active')) {
                            other.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                    console.log('📱 Дропдаун: ' + (dropdown.classList.contains('active') ? 'открыт' : 'закрыт'));
                });
            }
        });
    }
    
    // ============ ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА (из вашего файла) ============
    function initCalculatorMobile() {
        console.log('📊 Настраиваем калькулятор для мобильных');
        
        adaptCalculatorElements();
        improveCalculatorUX();
        preventIOSZoom();
        
        window.addEventListener('resize', function() {
            adaptCalculatorElements();
        });
    }
    
    function adaptCalculatorElements() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Адаптация форм
            document.querySelectorAll('.calculator-form select, .calculator-form input, .form-group select, .form-group input').forEach(el => {
                el.style.fontSize = '16px';
                el.style.padding = '15px';
                el.style.minHeight = '48px';
                el.style.borderRadius = '8px';
                el.style.border = '1px solid #ddd';
            });
            
            // Адаптация сетки месяцев для тендера
            const monthInputs = document.querySelector('.month-inputs');
            if (monthInputs) {
                if (window.innerWidth <= 480) {
                    monthInputs.style.display = 'grid';
                    monthInputs.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    monthInputs.style.display = 'grid';
                    monthInputs.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
                monthInputs.style.gap = '10px';
            }
            
            // Адаптация позиций в корзине
            document.querySelectorAll('.position-item').forEach(item => {
                item.style.padding = '15px';
                item.style.marginBottom = '15px';
                item.style.fontSize = '15px';
                item.style.flexDirection = 'column';
            });
            
            // Адаптация таблиц
            const tables = document.querySelectorAll('.comparison-table, table');
            tables.forEach(table => {
                if (table.offsetWidth > window.innerWidth - 40) {
                    table.style.display = 'block';
                    table.style.overflowX = 'auto';
                    table.style.webkitOverflowScrolling = 'touch';
                    table.style.whiteSpace = 'nowrap';
                }
            });
            
            // Адаптация кнопок
            document.querySelectorAll('.btn, .calculator-actions button, .results-actions button').forEach(btn => {
                btn.style.padding = '16px 20px';
                btn.style.fontSize = '16px';
                btn.style.minHeight = '48px';
                btn.style.width = '100%';
                btn.style.marginBottom = '10px';
            });
            
            // Адаптация блоков с результатами
            const totalResult = document.getElementById('totalResult');
            if (totalResult) {
                totalResult.style.padding = '15px';
                totalResult.style.margin = '15px 0';
            }
            
            // Делаем кнопки удаления побольше
            document.querySelectorAll('.remove-position-btn').forEach(btn => {
                btn.style.width = '44px';
                btn.style.height = '44px';
                btn.style.fontSize = '18px';
            });
        } else {
            // Возвращаем стили для десктопа
            document.querySelectorAll('.btn, .calculator-actions button, .results-actions button').forEach(btn => {
                btn.style.width = '';
                btn.style.marginBottom = '';
            });
        }
    }
    
    function improveCalculatorUX() {
        // Улучшение ввода чисел
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
            
            // Предотвращаем появление ползунков на мобильных
            input.style.MozAppearance = 'textfield';
        });
        
        // Автоматическая прокрутка к результатам после расчета тендера
        const calculateTenderBtn = document.getElementById('calculateTenderBtn');
        if (calculateTenderBtn) {
            calculateTenderBtn.addEventListener('click', function() {
                setTimeout(() => {
                    if (window.innerWidth <= 768) {
                        const results = document.getElementById('tender-result');
                        if (results && results.style.display !== 'none') {
                            results.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                    }
                }, 300);
            });
        }
        
        // Автоматическая прокрутка после добавления позиции
        const addPositionBtn = document.getElementById('addPositionBtn');
        if (addPositionBtn) {
            addPositionBtn.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const form = document.querySelector('.calculator-form');
                    if (form) {
                        setTimeout(() => {
                            form.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }, 100);
                    }
                }
            });
        }
    }
    
    function preventIOSZoom() {
        // Защита от зума на iOS при фокусе на полях ввода
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.addEventListener('touchstart', function(event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            }, { passive: false });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Увеличиваем размер шрифта в полях ввода, чтобы iOS не зумил
            document.querySelectorAll('input, select, textarea').forEach(el => {
                el.style.fontSize = '16px';
            });
        }
    }
    
    // ============ ОБЩАЯ ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ ============
    function initMobileOptimizations() {
        console.log('📱 Применяем общую мобильную оптимизацию...');
        
        // Оптимизация загрузки изображений
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback для старых браузеров
            images.forEach(img => img.classList.add('loaded'));
        }
        
        // Обработка поворота экрана
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                console.log('📱 Изменение размера экрана: ' + window.innerWidth + 'px');
                
                // Если ширина больше 768px, закрываем мобильное меню
                if (window.innerWidth > 768) {
                    const menuToggle = document.getElementById('mobileMenuToggle');
                    const mobileNav = document.getElementById('mobileNav');
                    
                    if (menuToggle && mobileNav && mobileNav.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        mobileNav.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
                
                // Переадаптируем калькулятор
                adaptCalculatorElements();
            }, 250);
        });
        
        // Улучшение touch-событий
        document.querySelectorAll('.btn, a, button, .mobile-menu-toggle').forEach(el => {
            el.addEventListener('touchstart', function() {
                // Добавляем небольшой эффект нажатия
                this.style.opacity = '0.8';
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, { passive: true });
        });
        
        console.log('✅ Мобильная оптимизация завершена');
    }
    
})();