// ============================================
// MOBILE.JS - Мобильная оптимизация для калькулятора
// Версия: 6.0 (Упрощенная версия)
// ============================================

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 mobile.js инициализирован');
        
        // Проверяем, находимся ли мы на странице калькулятора
        const isCalculatorPage = window.location.pathname.includes('calculator') || 
                               document.querySelector('.calculator-section');
        
        if (isCalculatorPage) {
            console.log('📊 Найдена страница калькулятора');
            setupCalculatorMobile();
        }
        
        console.log('✅ Мобильная оптимизация активирована');
    });
    
    // ============ НАСТРОЙКИ КАЛЬКУЛЯТОРА ДЛЯ МОБИЛЬНЫХ ============
    function setupCalculatorMobile() {
        console.log('📱 Настраиваем калькулятор для мобильных');
        
        // Адаптируем элементы калькулятора
        adaptCalculatorElements();
        
        // Улучшаем UX на мобильных
        improveCalculatorUX();
        
        // Предотвращаем зум iOS при фокусе
        preventIOSZoom();
        
        // Обработка изменений размера
        window.addEventListener('resize', function() {
            adaptCalculatorElements();
        });
    }
    
    function adaptCalculatorElements() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Увеличиваем размеры элементов формы для удобства касания
            document.querySelectorAll('.calculator-form select, .calculator-form input').forEach(el => {
                el.style.fontSize = '16px'; // Предотвращает зум в iOS
                el.style.padding = '15px';
                el.style.minHeight = '44px';
                el.style.borderRadius = '10px';
            });
            
            // Адаптируем сетку месяцев для тендера
            const monthInputs = document.querySelector('.month-inputs');
            if (monthInputs) {
                if (window.innerWidth <= 480) {
                    monthInputs.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    monthInputs.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
            
            // Адаптируем кнопки
            document.querySelectorAll('.calculator-content .btn').forEach(btn => {
                btn.style.padding = '16px';
                btn.style.fontSize = '16px';
                btn.style.minHeight = '44px';
                btn.style.borderRadius = '10px';
            });
            
            // Адаптируем позиции
            document.querySelectorAll('.position-item').forEach(item => {
                item.style.padding = '15px';
                item.style.marginBottom = '15px';
                item.style.fontSize = '15px';
            });
            
            // Адаптируем табы
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.style.padding = '15px';
                btn.style.fontSize = '15px';
                btn.style.minHeight = '44px';
            });
            
            // Адаптируем таблицу
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                if (table.offsetWidth > window.innerWidth) {
                    table.style.display = 'block';
                    table.style.overflowX = 'auto';
                    table.style.webkitOverflowScrolling = 'touch';
                }
            });
        }
    }
    
    function improveCalculatorUX() {
        // Улучшаем клавиатуру на мобильных
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
        });
        
        // Автоскролл к результатам при добавлении позиции
        const addPositionBtn = document.getElementById('addPositionBtn');
        if (addPositionBtn) {
            const originalClick = addPositionBtn.onclick;
            addPositionBtn.onclick = function(e) {
                if (originalClick) originalClick.call(this, e);
                
                setTimeout(() => {
                    if (window.innerWidth <= 768) {
                        const positionsList = document.getElementById('positionsList');
                        if (positionsList) {
                            positionsList.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }
                    }
                }, 300);
            };
        }
        
        // Автоскролл к результатам тендера
        const calculateTenderBtn = document.getElementById('calculateTenderBtn');
        if (calculateTenderBtn) {
            calculateTenderBtn.addEventListener('click', function() {
                setTimeout(() => {
                    if (window.innerWidth <= 768) {
                        const results = document.getElementById('tender-result');
                        if (results) {
                            results.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }
                    }
                }, 300);
            });
        }
    }
    
    function preventIOSZoom() {
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
        }
    }
    
})();