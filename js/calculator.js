// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 15.0 (20.02.2026) - Убраны резервные данные
// ============================================

// ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
let positions = [];
let includeVAT = false; // По умолчанию НДС ВЫКЛЮЧЕН
const VAT_RATE = 0.22; // 22% НДС
let shouldAutoAdd = true; // Флаг для автоматического добавления

// ============ ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора...');
    
    const calculatorSection = document.querySelector('.calculator-section');
    if (!calculatorSection) {
        console.log('⚠️ Калькулятор не найден на этой странице');
        return;
    }
    
    initInterface();
    setupEventHandlers();
    setupAddPositionButton();
    checkPriceData();
    
    console.log('✅ Калькулятор успешно инициализирован');
}

// ============ ПРОВЕРКА И ЗАГРУЗКА ДАННЫХ О ЦЕНАХ ============
function checkPriceData() {
    console.log('🔍 Проверка данных о ценах...');
    
    if (typeof window.priceData !== 'undefined' && Object.keys(window.priceData).length > 0) {
        console.log('✅ База цен загружена из window.priceData');
        console.log('📊 Регионов:', Object.keys(window.priceData).length);
        populateRegions();
    } else if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        console.log('✅ PriceUtils загружен');
        populateRegions();
    } else {
        console.error('❌ База цен не загружена! Проверьте подключение prices.js');
    }
}

// ============ ЗАПОЛНЕНИЕ РЕГИОНОВ ============
function populateRegions() {
    console.log('🗺️ Заполняем регионы...');
    
    const regionSelect = document.getElementById('region');
    const tenderRegionSelect = document.getElementById('tender-region');
    
    let regions = [];
    
    if (typeof window.priceData !== 'undefined' && Object.keys(window.priceData).length > 0) {
        regions = Object.keys(window.priceData);
        console.log(`✅ Найдено ${regions.length} регионов в window.priceData`);
    } else if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        regions = window.PriceUtils.getRegions();
        console.log(`✅ Найдено ${regions.length} регионов в PriceUtils`);
    }
    
    if (regions.length === 0) {
        console.error('❌ Регионы не найдены!');
        return;
    }
    
    // Используем правильную сортировку из regionsOrder если доступно
    if (typeof window.regionsOrder !== 'undefined' && window.regionsOrder.length > 0) {
        const orderedRegions = [];
        window.regionsOrder.forEach(region => {
            if (regions.includes(region)) {
                orderedRegions.push(region);
            }
        });
        regions = orderedRegions;
    } else {
        regions.sort(); // Обычная сортировка как запасной вариант
    }
    
    if (regionSelect) {
        regionSelect.innerHTML = '<option value="">Выберите регион</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
        console.log(`✅ Заполнен селект регионов: ${regions.length} регионов`);
    }
    
    if (tenderRegionSelect) {
        tenderRegionSelect.innerHTML = '<option value="">Выберите регион</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            tenderRegionSelect.appendChild(option);
        });
    }
    
    if (tenderRegionSelect) {
        tenderRegionSelect.addEventListener('change', function() {
            handleTenderRegionChange(this.value);
        });
    }
}

// [ВСЕ ОСТАЛЬНЫЕ ФУНКЦИИ ИЗ ВАШЕГО calculator.js ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ]
// ... (handleRegionChange, handleSizeChange, calculateCostPer4Weeks, и т.д.)
// Просто удалены все функции getFallbackRegions, getFallbackSizes, getFallbackFrequencies и populateRegionsFallback

// ============ АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, проверяем калькулятор...');
    
    const hasCalculator = document.querySelector('.calculator-section') || 
                         document.querySelector('.calculator-form') || 
                         document.getElementById('region');
    
    if (hasCalculator) {
        console.log('🔍 Калькулятор обнаружен, запускаем...');
        initCalculator();
    }
});

// Экспорт для глобального доступа
window.Calculator = {
    init: initCalculator,
    removePosition: function(index) { /* ... */ },
    calculateTender: function() { /* ... */ },
    sendToTelegram: function() { /* ... */ },
    sendTenderToTelegram: function() { /* ... */ },
    sendToEmail: function() { /* ... */ }
};