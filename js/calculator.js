// calculator.js - Логика работы калькулятора стоимости

console.log('🎯 ТЕСТ: calculator.js ЗАГРУЖЕН! Если видишь это сообщение - файл обновился');

// Глобальные переменные для хранения данных калькуляторов
let orderItems = [];        // Массив для хранения позиций стандартного калькулятора
let currentItem = null;     // Текущая позиция стандартного калькулятора

let tenderItems = [];       // Массив для хранения позиций тендерного калькулятора  
let currentTenderItem = null; // Текущая позиция тендерного калькулятора

console.log('🔍 [CALC-1] calculator.js начал выполнение');
console.log('🔍 [CALC-2] Переменные инициализированы');

// Проверяем доступность данных
console.log('🔍 [CALC-3] Проверка данных:');
console.log('  - priceData:', typeof priceData !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');
console.log('  - regionsOrder:', typeof regionsOrder !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');
console.log('  - months:', typeof months !== 'undefined' ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН');

if (typeof regionsOrder !== 'undefined') {
    console.log('🔍 [CALC-4] Регионы для выбора:', regionsOrder);
} else {
    console.error('❌ [CALC-4] regionsOrder не определен!');
}

// Инициализация калькулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 [CALC-5] DOM загружен, начинаю инициализацию');
    
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
});

// Глобальные переменные для хранения данных калькуляторов
let orderItems = [];        // Массив для хранения позиций стандартного калькулятора
let currentItem = null;     // Текущая позиция стандартного калькулятора

let tenderItems = [];       // Массив для хранения позиций тендерного калькулятора  
let currentTenderItem = null; // Текущая позиция тендерного калькулятора

// Инициализация калькулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Калькулятор инициализирован');
    
    // Инициализация полей ввода по месяцам для тендерного калькулятора
    initMonthInputs();
    
    // Инициализация выпадающих списков регионов
    initRegionSelects();
    
    // Настройка переключения между вкладками калькуляторов
    setupCalculatorTabs();
});

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

// === ФУНКЦИИ СТАНДАРТНОГО КАЛЬКУЛЯТОРА ===

// Обновление списка размеров ковров при выборе региона
function updateSizes() {
    const region = document.getElementById('region').value;
    const sizeSelect = document.getElementById('size');
    
    // Очищаем и блокируем список размеров
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    sizeSelect.disabled = !region;
    
    // Заполняем список доступными размерами для выбранного региона
    if (region && priceData[region]) {
        Object.keys(priceData[region]).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
    
    // Сбрасываем текущий элемент при изменении региона
    currentItem = null;
    calculate();
}

// Обновление списка периодичности замен при выборе размера
function updateFrequencies() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequencySelect = document.getElementById('frequency');
    
    // Очищаем и блокируем список периодичности
    frequencySelect.innerHTML = '<option value="">Выберите периодичность</option>';
    frequencySelect.disabled = !size;
    
    // Заполняем список доступными вариантами периодичности
    if (region && size && priceData[region] && priceData[region][size]) {
        Object.keys(priceData[region][size]).forEach(freq => {
            const option = document.createElement('option');
            option.value = freq;
            option.textContent = freq;
            frequencySelect.appendChild(option);
        });
    }
    
    calculate();
}

// Расчет стоимости для текущей позиции
function calculate() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    
    // Проверяем, что все необходимые данные заполнены
    if (!region || !size || !frequency || quantity <= 0) {
        currentItem = null;
        updateOrderTable();
        return;
    }
    
    // Получаем цену за одну замену
    const pricePerItem = priceData[region][size][frequency];
    
    // Рассчитываем количество замен в месяц в зависимости от периодичности
    let replacementsPerMonth;
    if (frequency.includes('1 раз в неделю')) replacementsPerMonth = 4;
    else if (frequency.includes('2 раза в неделю')) replacementsPerMonth = 8;
    else if (frequency.includes('3 раза в неделю')) replacementsPerMonth = 12;
    else if (frequency.includes('4 раза в неделю')) replacementsPerMonth = 16;
    else if (frequency.includes('5 раз в неделю')) replacementsPerMonth = 20;
    else if (frequency.includes('6 раз в неделю')) replacementsPerMonth = 24;
    else if (frequency.includes('7 раз в неделю')) replacementsPerMonth = 28;
    else if (frequency.includes('1 раз в две недели')) replacementsPerMonth = 2;
    else replacementsPerMonth = 0;
    
    // Рассчитываем общую стоимость за месяц
    const costForMonth = pricePerItem * replacementsPerMonth * quantity;
    
    // Сохраняем текущую позицию
    currentItem = {
        region,
        size,
        frequency,
        quantity,
        pricePerItem,
        costForMonth
    };
    
    updateOrderTable();
}

// Добавление позиции в заказ
function addPosition() {
    if (!currentItem) {
        alert('Пожалуйста, сначала заполните все поля и рассчитайте стоимость');
        return;
    }
    
    // Добавляем копию текущей позиции в массив заказа
    orderItems.push({...currentItem});
    
    // Показываем уведомление о добавлении позиции
    const notice = document.getElementById('addedNotice');
    notice.style.display = 'block';
    setTimeout(() => {
        notice.style.display = 'none';
    }, 5000);
    
    // Сбрасываем форму для ввода новой позиции (кроме региона)
    document.getElementById('size').value = '';
    document.getElementById('frequency').innerHTML = '<option value="">Выберите периодичность</option>';
    document.getElementById('frequency').disabled = true;
    document.getElementById('quantity').value = '1';
    
    currentItem = null;
    calculate();
}

// Обновление таблицы заказа
function updateOrderTable() {
    const tbody = document.getElementById('orderBody');
    tbody.innerHTML = '';
    
    let total = 0;
    
    // Добавляем текущий элемент, если он есть (еще не добавлен в заказ)
    if (currentItem) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${currentItem.size}</td>
            <td>${currentItem.quantity}</td>
            <td>${currentItem.frequency}</td>
            <td>${currentItem.pricePerItem} ₽</td>
            <td>${currentItem.costForMonth.toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
        total += currentItem.costForMonth;
    }
    
    // Добавляем сохраненные элементы из заказа
    orderItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${item.frequency}</td>
            <td>${item.pricePerItem} ₽</td>
            <td>${item.costForMonth.toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
        total += item.costForMonth;
    });
    
    // Обновляем общую стоимость
    document.getElementById('total').textContent = `Общая стоимость: ${total.toLocaleString('ru-RU')} ₽`;
    
    // Показываем блок скидки, если общая стоимость больше 20,000 рублей
    if (total > 20000) {
        document.getElementById('discountNotice').style.display = 'block';
        document.getElementById('discountSection').style.display = 'block';
    } else {
        document.getElementById('discountNotice').style.display = 'none';
        document.getElementById('discountSection').style.display = 'none';
    }
    
    // Показываем блок результатов
    document.getElementById('standard-result').style.display = 'block';
}

// === ФУНКЦИИ ТЕНДЕРНОГО КАЛЬКУЛЯТОРА ===

// Обновление списка размеров для тендерного калькулятора
function updateTenderSizes() {
    const region = document.getElementById('tenderRegion').value;
    const sizeSelect = document.getElementById('tenderSize');
    
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    sizeSelect.disabled = !region;
    
    if (region && priceData[region]) {
        Object.keys(priceData[region]).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
    
    currentTenderItem = null;
    calculateTender();
}

// Расчет стоимости для тендерного калькулятора
function calculateTender() {
    const region = document.getElementById('tenderRegion').value;
    const size = document.getElementById('tenderSize').value;
    
    if (!region || !size) {
        currentTenderItem = null;
        updateTenderTable();
        return;
    }
    
    const prices = priceData[region][size];
    const frequencies = Object.keys(prices);
    
    // Для тендерного калькулятора используем минимальную цену (1 раз в две недели)
    const pricePerItem = prices[frequencies[0]];
    
    currentTenderItem = {
        region,
        size,
        pricePerItem
    };
    
    updateTenderTable();
}

// Добавление позиции в тендерный калькулятор
function addTenderPosition() {
    if (!currentTenderItem) {
        alert('Пожалуйста, сначала выберите регион и размер');
        return;
    }
    
    tenderItems.push({...currentTenderItem});
    
    // Сбрасываем форму для нового ввода
    document.getElementById('tenderSize').value = '';
    document.getElementById('tenderSize').disabled = true;
    
    currentTenderItem = null;
    calculateTender();
}

// Обновление таблицы тендерного калькулятора
function updateTenderTable() {
    const tbody = document.getElementById('tenderBody');
    tbody.innerHTML = '';
    
    let total = 0;
    
    // Добавляем текущий элемент, если он есть
    if (currentTenderItem) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${months.join(', ')}</td>
            <td>${currentTenderItem.size}</td>
            <td>0</td>
            <td>0</td>
            <td>0 ₽</td>
        `;
        tbody.appendChild(row);
    }
    
    // Добавляем сохраненные элементы
    tenderItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${months.join(', ')}</td>
            <td>${item.size}</td>
            <td>0</td>
            <td>0</td>
            <td>0 ₽</td>
        `;
        tbody.appendChild(row);
    });
    
    // Рассчитываем общую стоимость по месяцам
    const monthInputs = document.querySelectorAll('.month-input');
    monthInputs.forEach(input => {
        const month = input.querySelector('.month-carpets').getAttribute('data-month');
        const carpets = parseInt(input.querySelector('.month-carpets').value) || 0;
        const replacements = parseInt(input.querySelector('.month-replacements').value) || 0;
        
        if (carpets > 0 && replacements > 0) {
            const pricePerItem = currentTenderItem ? currentTenderItem.pricePerItem : 
                              tenderItems.length > 0 ? tenderItems[0].pricePerItem : 0;
            
            const monthCost = carpets * replacements * pricePerItem;
            total += monthCost;
            
            // Обновляем отображение стоимости для месяца
            input.querySelector('.month-cost').textContent = `${monthCost.toLocaleString('ru-RU')} ₽`;
            
            // Добавляем строку в таблицу
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month}</td>
                <td>${currentTenderItem ? currentTenderItem.size : tenderItems[0].size}</td>
                <td>${carpets}</td>
                <td>${replacements}</td>
                <td>${monthCost.toLocaleString('ru-RU')} ₽</td>
            `;
            tbody.appendChild(row);
        } else {
            input.querySelector('.month-cost').textContent = '0 ₽';
        }
    });
    
    // Обновляем общую стоимость
    document.getElementById('tenderTotal').textContent = `Общая стоимость по контракту: ${total.toLocaleString('ru-RU')} ₽`;
    
    // Показываем блок скидки, если общая стоимость больше 50,000 рублей
    if (total > 50000) {
        document.getElementById('tenderDiscountNotice').style.display = 'block';
    } else {
        document.getElementById('tenderDiscountNotice').style.display = 'none';
    }
    
    // Показываем блок результатов
    document.getElementById('tender-result').style.display = 'block';
}

// === ФУНКЦИИ ОТПРАВКИ ДАННЫХ ===

// Отправка заказа в WhatsApp
function sendToWhatsApp() {
    if (orderItems.length === 0 && !currentItem) {
        alert('Добавьте хотя бы одну позицию в заказ');
        return;
    }
    
    let message = 'Здравствуйте! Я хочу рассчитать стоимость аренды ковров:\n\n';
    
    // Добавляем информацию о позициях
    if (currentItem) {
        message += `Размер: ${currentItem.size}\n`;
        message += `Количество: ${currentItem.quantity}\n`;
        message += `Периодичность замены: ${currentItem.frequency}\n`;
        message += `Стоимость за 4 недели: ${currentItem.costForMonth.toLocaleString('ru-RU')} ₽\n\n`;
    }
    
    orderItems.forEach((item, index) => {
        message += `Позиция ${index + 1}:\n`;
        message += `Размер: ${item.size}\n`;
        message += `Количество: ${item.quantity}\n`;
        message += `Периодичность замены: ${item.frequency}\n`;
        message += `Стоимость за 4 недели: ${item.costForMonth.toLocaleString('ru-RU')} ₽\n\n`;
    });
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79999999999?text=${encodedMessage}`; // Замените на реальный номер
    
    window.open(whatsappUrl, '_blank');
}

// Отправка тендерного расчета в WhatsApp
function sendTenderToWhatsApp() {
    if (tenderItems.length === 0 && !currentTenderItem) {
        alert('Добавьте хотя бы одну позицию в тендерный расчет');
        return;
    }
    
    let message = 'Здравствуйте! Запрос на тендерный расчет аренды ковров:\n\n';
    
    // Добавляем информацию о позициях
    if (currentTenderItem) {
        message += `Размер: ${currentTenderItem.size}\n`;
        message += `Регион: ${currentTenderItem.region}\n\n`;
    }
    
    tenderItems.forEach((item, index) => {
        message += `Позиция ${index + 1}:\n`;
        message += `Размер: ${item.size}\n`;
        message += `Регион: ${item.region}\n\n`;
    });
    
    // Добавляем данные по месяцам
    message += 'Данные по месяцам:\n';
    const monthInputs = document.querySelectorAll('.month-input');
    monthInputs.forEach(input => {
        const month = input.querySelector('.month-carpets').getAttribute('data-month');
        const carpets = parseInt(input.querySelector('.month-carpets').value) || 0;
        const replacements = parseInt(input.querySelector('.month-replacements').value) || 0;
        
        if (carpets > 0 && replacements > 0) {
            message += `${month}: ${carpets} ковров, ${replacements} замен\n`;
        }
    });
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79999999999?text=${encodedMessage}`; // Замените на реальный номер
    
    window.open(whatsappUrl, '_blank');
}

// Запрос скидки
function requestDiscount() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('discountPhone').value;
    const consent = document.getElementById('consent').checked;
    
    if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    let message = 'Запрос на скидку:\n\n';
    message += `Имя: ${name}\n`;
    message += `Телефон: ${phone}\n\n`;
    message += 'Состав заказа:\n';
    
    // Добавляем информацию о заказе
    if (currentItem) {
        message += `Размер: ${currentItem.size}, Количество: ${currentItem.quantity}, Замена: ${currentItem.frequency}\n`;
    }
    
    orderItems.forEach(item => {
        message += `Размер: ${item.size}, Количество: ${item.quantity}, Замена: ${item.frequency}\n`;
    });
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79999999999?text=${encodedMessage}`; // Замените на реальный номер
    
    window.open(whatsappUrl, '_blank');
}

// Показать форму для реквизитов договора
function showContractForm() {
    document.getElementById('contractForm').style.display = 'block';
}

// Отправка реквизитов для договора
function sendContractDetails() {
    const company = document.getElementById('company').value;
    const contactPerson = document.getElementById('contact-person').value;
    const phone = document.getElementById('contractPhone').value;
    const email = document.getElementById('email').value;
    const requisites = document.getElementById('requisites').value;
    const consent = document.getElementById('contractConsent').checked;
    
    if (!contactPerson || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    let message = 'Реквизиты для договора:\n\n';
    message += `Организация: ${company || 'Не указано'}\n`;
    message += `Контактное лицо: ${contactPerson}\n`;
    message += `Телефон: ${phone}\n`;
    message += `Email: ${email || 'Не указано'}\n\n`;
    message += `Реквизиты: ${requisites || 'Не указано'}\n\n`;
    message += 'Состав заказа:\n';
    
    // Добавляем информацию о заказе
    if (currentItem) {
        message += `Размер: ${currentItem.size}, Количество: ${currentItem.quantity}, Замена: ${currentItem.frequency}\n`;
    }
    
    orderItems.forEach(item => {
        message += `Размер: ${item.size}, Количество: ${item.quantity}, Замена: ${item.frequency}\n`;
    });
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79770005127?text=${encodedMessage}`; // Замените на реальный номер
    
    window.open(whatsappUrl, '_blank');
}

// Открытие модального окна с политикой конфиденциальности
function openPrivacyModal() {
    alert('Здесь должно открываться модальное окно с политикой конфиденциальности. В реальном проекте добавьте соответствующую разметку и стили.');
}