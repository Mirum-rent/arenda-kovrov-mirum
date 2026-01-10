// ============================================
// MOBILE.JS - Мобильная оптимизация для калькулятора
// Версия: 7.0 (Оптимизация под новую логику)
// ============================================

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 mobile.js инициализирован');
        
        const isCalculatorPage = window.location.pathname.includes('calculator') || 
                               document.querySelector('.calculator-section');
        
        if (isCalculatorPage) {
            console.log('📊 Найдена страница калькулятора');
            setupCalculatorMobile();
        }
    });
    
    function setupCalculatorMobile() {
        console.log('📱 Настраиваем калькулятор для мобильных');
        
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
            document.querySelectorAll('.calculator-form select, .calculator-form input').forEach(el => {
                el.style.fontSize = '16px';
                el.style.padding = '15px';
                el.style.minHeight = '44px';
                el.style.borderRadius = '10px';
            });
            
            const monthInputs = document.querySelector('.month-inputs');
            if (monthInputs) {
                if (window.innerWidth <= 480) {
                    monthInputs.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    monthInputs.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
            
            document.querySelectorAll('.position-item').forEach(item => {
                item.style.padding = '15px';
                item.style.marginBottom = '15px';
                item.style.fontSize = '15px';
            });
            
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                if (table.offsetWidth > window.innerWidth) {
                    table.style.display = 'block';
                    table.style.overflowX = 'auto';
                    table.style.webkitOverflowScrolling = 'touch';
                }
            });
            
            document.querySelectorAll('.btn').forEach(btn => {
                btn.style.padding = '16px';
                btn.style.fontSize = '16px';
                btn.style.minHeight = '44px';
            });
        }
    }
    
    function improveCalculatorUX() {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
        });
        
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