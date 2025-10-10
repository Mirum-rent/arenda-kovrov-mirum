// calculator.js - Логика работы калькулятора стоимости

console.log('🎯 ТЕСТ: calculator.js ЗАГРУЖЕН! Если видишь это сообщение - файл обновился');

console.log('🔍 [CALC-1] calculator.js начал выполнение');
console.log('🔍 [CALC-2] Проверка данных:');
console.log('  - priceData:', typeof priceData !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');
console.log('  - regionsOrder:', typeof regionsOrder !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');
console.log('  - months:', typeof months !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');

if (typeof regionsOrder !== 'undefined') {
    console.log('🔍 [CALC-4] Регионы для выбора:', regionsOrder);
} else {
    console.error('❌ [CALC-4] regionsOrder не определен!');
}

// Инициализация калькулятора
console.log('🔍 [CALC-5] Начинаю инициализацию калькулятора');

// Проверяем, есть ли элементы на странице
const regionSelects = document.querySelectorAll('select[id="region"], select[id="tenderRegion"]');
console.log('🔍 [CALC-6] Найдено select элементов:', regionSelects.length);

regionSelects.forEach((select, index) => {
    console.log(`🔍 [CALC-7] Select ${index + 1}:`, select.id, 'options:', select.children.length);
});

// Инициализация полей ввода по месяцам для тендерного калькулятора
initMonthInputs();

// Инициализация выпадающих списков регионов
initRegionSelects();

// Настройка переключения между вкладками калькуляторов
setupCalculatorTabs();

console.log('✅ [CALC-8] Калькулятор инициализирован');

// Настройка переключения между вкладками калькуляторов
function setupCalculatorTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = '#ddd';
                b.style.color = '#333';
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            this.style.backgroundColor = '#3498db';
            this.style.color = 'white';
            
            // Скрываем все калькуляторы
            calculatorContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Показываем выбранный калькулятор
            const tabId = this.getAttribute('data-tab');
            const targetCalculator = document.getElementById(`${tabId}-calculator`);
            if (targetCalculator) {
                targetCalculator.style.display = 'block';
            }
        });
    });
}

// Инициализация выпадающих списков регионов
function initRegionSelects() {
    console.log('🔍 [CALC-9] Функция initRegionSelects вызвана');
    
    const regionSelects = document.querySelectorAll('select[id="region"], select[id="tenderRegion"]');
    console.log('🔍 [CALC-10] Найдено select элементов:', regionSelects.length);
    
    if (regionSelects.length === 0) {
        console.error('❌ [CALC-11] Не найдены элементы select для регионов!');
        console.log('🔍 Проверяем, что есть на странице:');
        const allSelects = document.querySelectorAll('select');
        console.log('Все select элементы на странице:', allSelects);
        return;
    }
    
    regionSelects.forEach((select, index) => {
        console.log(`🔍 [CALC-12] Обрабатываю select ${index + 1}:`, select.id);
        console.log('  - Текущее состояние:', select.innerHTML);
        
        // Очищаем список опций
        select.innerHTML = '<option value="">Выберите регион</option>';
        
        console.log('🔍 [CALC-13] Добавляю регионы из regionsOrder:', regionsOrder);
        
        let addedCount = 0;
        // Добавляем регионы в указанном порядке из prices.js
        regionsOrder.forEach(region => {
            if (priceData[region]) {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                select.appendChild(option);
                addedCount++;
                console.log(`  ✅ Добавлен регион: ${region}`);
            }
        });
        
        console.log(`🔍 [CALC-14] Select ${select.id} готов, добавлено: ${addedCount} регионов`);
        console.log('  - Итоговое состояние:', select.innerHTML);
    });
    
    console.log('✅ [CALC-15] Все select элементы обработаны');
}

// Инициализация полей ввода по месяцам для тендерного калькулятора
function initMonthInputs() {
    const container = document.getElementById('monthInputs');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Создаем поля ввода для каждого месяца
    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-input';
        monthDiv.innerHTML = `
            <label>${month}</label>
            <input type="number" min="0" placeholder="Ковры" class="month-carpets" data-month="${month}" onchange="calculateTender()">
            <input type="number" min="0" placeholder="Замены" class="month-replacements" data-month="${month}" onchange="calculateTender()">
            <div class="month-cost" data-month="${month}">0 ₽</div>
        `;
        container.appendChild(monthDiv);
    });
}

// ... остальные функции калькулятора оставьте как были