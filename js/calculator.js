// calculator.js - Логика работы калькулятора стоимости

console.log('🎯 calculator.js ЗАГРУЖЕН!');

// Глобальные переменные (если их нет в основном скрипте)
if (typeof orderItems === 'undefined') window.orderItems = [];
if (typeof currentItem === 'undefined') window.currentItem = null;
if (typeof tenderItems === 'undefined') window.tenderItems = [];
if (typeof currentTenderItem === 'undefined') window.currentTenderItem = null;

// Инициализация калькулятора
function initCalculator() {
    console.log('🔍 Инициализация калькулятора');
    
    // Инициализация выпадающих списков регионов
    initRegionSelects();
    
    // Инициализация полей ввода по месяцам для тендерного калькулятора
    initMonthInputs();
    
    // Настройка переключения между вкладками калькуляторов
    setupCalculatorTabs();
    
    console.log('✅ Калькулятор инициализирован');
}

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
    console.log('🔍 Инициализация регионов');
    
    const regionSelects = document.querySelectorAll('select[id="region"], select[id="tenderRegion"]');
    
    regionSelects.forEach(select => {
        // Очищаем список опций
        select.innerHTML = '<option value="">Выберите регион</option>';
        
        // Добавляем регионы в указанном порядке из prices.js
        regionsOrder.forEach(region => {
            if (priceData[region]) {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                select.appendChild(option);
            }
        });
    });
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

// Обновление списка размеров ковров при выборе региона
function updateSizes() {
    console.log('🔍 Обновление размеров');
    
    const region = document.getElementById('region').value;
    const sizeSelect = document.getElementById('size');
    
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
    
    // Сбрасываем зависимые поля
    document.getElementById('frequency').innerHTML = '<option value="">Выберите периодичность</option>';
    document.getElementById('frequency').disabled = true;
    
    currentItem = null;
    calculate();
}

// Обновление списка периодичности замен при выборе размера
function updateFrequencies() {
    console.log('🔍 Обновление периодичности');
    
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequencySelect = document.getElementById('frequency');
    
    frequencySelect.innerHTML = '<option value="">Выберите периодичность</option>';
    frequencySelect.disabled = !size;
    
    if (region && size && priceData[region] && priceData[region][size]) {
        Object.keys(priceData[region][size]).forEach(freq => {
            const option = document.createElement('option');
            option.value = freq;
            option.textContent = freq;
            frequencySelect.appendChild(option);
        });
    }
    
    currentItem = null;
    calculate();
}

// Расчет стоимости для текущей позиции
function calculate() {
    console.log('🔍 Расчет стоимости');
    
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    
    console.log('Данные:', {region, size, frequency, quantity});
    
    // Проверяем, что все необходимые данные заполнены
    if (!region || !size || !frequency || quantity <= 0) {
        console.log('❌ Не все данные заполнены');
        currentItem = null;
        updateOrderTable();
        return;
    }
    
    const pricePerItem = priceData[region][size][frequency];
    
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
    
    const costForMonth = pricePerItem * replacementsPerMonth * quantity;
    
    console.log('✅ Расчет:', {pricePerItem, replacementsPerMonth, costForMonth});
    
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
    console.log('🔍 Добавление позиции');
    
    if (!currentItem) {
        alert('Пожалуйста, сначала заполните все поля и рассчитайте стоимость');
        return;
    }
    
    orderItems.push({...currentItem});
    
    // Показываем уведомление о добавлении позиции
    document.getElementById('addedNotice').style.display = 'block';
    setTimeout(() => {
        document.getElementById('addedNotice').style.display = 'none';
    }, 5000);
    
    // Сбрасываем форму для нового ввода (кроме региона)
    document.getElementById('size').value = '';
    document.getElementById('frequency').innerHTML = '<option value="">Выберите периодичность</option>';
    document.getElementById('frequency').disabled = true;
    document.getElementById('quantity').value = '1';
    
    currentItem = null;
    calculate();
}

// Обновление таблицы заказа
function updateOrderTable() {
    console.log('🔍 Обновление таблицы');
    
    const tbody = document.getElementById('orderBody');
    tbody.innerHTML = '';
    
    let total = 0;
    
    // Добавляем текущий элемент, если он есть
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
    
    // Добавляем сохраненные элементы
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
    
    document.getElementById('total').textContent = `Общая стоимость: ${total.toLocaleString('ru-RU')} ₽`;
    
    // Показываем/скрываем блок скидки
    if (total > 20000) {
        document.getElementById('discountNotice').style.display = 'block';
        document.getElementById('discountSection').style.display = 'block';
    } else {
        document.getElementById('discountNotice').style.display = 'none';
        document.getElementById('discountSection').style.display = 'none';
    }
    
    // Показываем блок результатов
    document.getElementById('standard-result').style.display = 'block';
    
    console.log('✅ Таблица обновлена, общая стоимость:', total);
}

// Тендерный калькулятор
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
    const pricePerItem = prices[frequencies[0]];
    
    currentTenderItem = {
        region,
        size,
        pricePerItem
    };
    
    updateTenderTable();
}

function addTenderPosition() {
    if (!currentTenderItem) {
        alert('Пожалуйста, сначала выберите регион и размер');
        return;
    }
    
    tenderItems.push({...currentTenderItem});
    document.getElementById('tenderSize').value = '';
    document.getElementById('tenderSize').disabled = true;
    
    currentTenderItem = null;
    calculateTender();
}

function updateTenderTable() {
    const tbody = document.getElementById('tenderBody');
    tbody.innerHTML = '';
    
    let total = 0;
    
    if (currentTenderItem) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Все месяцы</td>
            <td>${currentTenderItem.size}</td>
            <td>1</td>
            <td>1 раз в две недели</td>
            <td>${currentTenderItem.pricePerItem} ₽</td>
        `;
        tbody.appendChild(row);
        total += currentTenderItem.pricePerItem * 2;
    }
    
    tenderItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Все месяцы</td>
            <td>${item.size}</td>
            <td>1</td>
            <td>1 раз в две недели</td>
            <td>${item.pricePerItem} ₽</td>
        `;
        tbody.appendChild(row);
        total += item.pricePerItem * 2;
    });
    
    // Расчет по месяцам
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
            
            input.querySelector('.month-cost').textContent = `${monthCost.toLocaleString('ru-RU')} ₽`;
            
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
    
    document.getElementById('tenderTotal').textContent = `Общая стоимость по контракту: ${total.toLocaleString('ru-RU')} ₽`;
    
    if (total > 50000) {
        document.getElementById('tenderDiscountNotice').style.display = 'block';
    } else {
        document.getElementById('tenderDiscountNotice').style.display = 'none';
    }
    
    document.getElementById('tender-result').style.display = 'block';
}

// Функции отправки в WhatsApp
function sendToWhatsApp() {
    if (orderItems.length === 0 && !currentItem) {
        alert('Добавьте хотя бы одну позицию в заказ');
        return;
    }
    
    // Получаем выбранный регион из формы
    const region = document.getElementById('region').value;
    
    let message = 'Запрос по калькулятору аренды ковров:\n\n';
    
    // Добавляем информацию о регионе
    if (region) {
        message += `📌 Регион: ${region}\n\n`;
    }
    
    if (currentItem || orderItems.length > 0) {
        message += 'Текущий заказ:\n';
        
        // Добавляем текущий элемент
        if (currentItem) {
            message += `• Размер: ${currentItem.size}, Кол-во: ${currentItem.quantity} шт., Замена: ${currentItem.frequency}, Стоимость: ${currentItem.costForMonth} ₽/мес\n`;
        }
        
        // Добавляем сохраненные элементы
        orderItems.forEach(item => {
            message += `• Размер: ${item.size}, Кол-во: ${item.quantity} шт., Замена: ${item.frequency}, Стоимость: ${item.costForMonth} ₽/мес\n`;
        });
        
        const totalElement = document.getElementById('total');
        message += `\n${totalElement.textContent}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79770005127?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function sendTenderToWhatsApp() {
    const name = document.getElementById('tenderName').value;
    const phone = document.getElementById('tenderPhone').value;
    const consent = document.getElementById('tenderConsent').checked;
    
    if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    // Получаем выбранный регион для тендера
    const region = document.getElementById('tenderRegion').value;
    
    let message = `Запрос по тендеру:\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n`;
    
    // Добавляем информацию о регионе
    if (region) {
        message += `📍 Регион: ${region}\n`;
    }
    
    message += '\n📋 Детали тендера:\n';
    
    if (currentTenderItem) {
        message += `• Размер: ${currentTenderItem.size}, Цена: ${currentTenderItem.pricePerItem} ₽ за замену\n`;
    }
    
    tenderItems.forEach(item => {
        message += `• Размер: ${item.size}, Цена: ${item.pricePerItem} ₽ за замену\n`;
    });
    
    message += '\n🗓️ По месяцам:\n';
    
    const monthInputs = document.querySelectorAll('.month-input');
    monthInputs.forEach(input => {
        const month = input.querySelector('.month-carpets').getAttribute('data-month');
        const carpets = input.querySelector('.month-carpets').value || 0;
        const replacements = input.querySelector('.month-replacements').value || 0;
        
        if (carpets > 0 || replacements > 0) {
            message += `• ${month}: ${carpets} ковров, ${replacements} замен\n`;
        }
    });
    
    const totalElement = document.getElementById('tenderTotal');
    message += `\n${totalElement.textContent}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79770005127?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function requestDiscount() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('discountPhone').value;
    const consent = document.getElementById('consent').checked;
    
    if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    // Получаем выбранный регион
    const region = document.getElementById('region').value;
    
    let message = `Запрос на скидку:\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n`;
    
    // Добавляем информацию о регионе
    if (region) {
        message += `📍 Регион: ${region}\n`;
    }
    
    message += '\n📋 Текущий заказ:\n';
    
    if (currentItem) {
        message += `• Размер: ${currentItem.size}, Кол-во: ${currentItem.quantity} шт., Замена: ${currentItem.frequency}, Стоимость: ${currentItem.costForMonth} ₽/мес\n`;
    }
    
    orderItems.forEach(item => {
        message += `• Размер: ${item.size}, Кол-во: ${item.quantity} шт., Замена: ${item.frequency}, Стоимость: ${item.costForMonth} ₽/мес\n`;
    });
    
    const totalElement = document.getElementById('total');
    message += `\n${totalElement.textContent}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79770005127?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function showContractForm() {
    document.getElementById('contractForm').style.display = 'block';
}

function sendContractDetails() {
    const contactPerson = document.getElementById('contact-person').value;
    const phone = document.getElementById('contractPhone').value;
    const consent = document.getElementById('contractConsent').checked;
    
    if (!contactPerson || !phone || !consent) {
        alert('Пожалуйста, заполните обязательные поля (имя и телефон) и дайте согласие на обработку данных');
        return;
    }
    
    // Получаем выбранный регион
    const region = document.getElementById('region').value;
    
    let message = `📄 Реквизиты для договора:\n\n`;
    message += `👤 Контактное лицо: ${contactPerson}\n`;
    message += `📞 Телефон: ${phone}\n`;
    
    // Добавляем информацию о регионе
    if (region) {
        message += `📍 Регион аренды: ${region}\n`;
    }
    
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const requisites = document.getElementById('requisites').value;
    
    if (company) message += `🏢 Название организации: ${company}\n`;
    if (email) message += `📧 Email: ${email}\n`;
    if (requisites) message += `📋 Реквизиты компании:\n${requisites}\n`;
    
    // Добавляем информацию о заказе, если есть
    if (currentItem || orderItems.length > 0) {
        message += `\n📋 Заказ:\n`;
        
        if (currentItem) {
            message += `• Размер: ${currentItem.size}, Кол-во: ${currentItem.quantity} шт., Замена: ${currentItem.frequency}\n`;
        }
        
        orderItems.forEach(item => {
            message += `• Размер: ${item.size}, Кол-во: ${item.quantity} шт., Замена: ${item.frequency}\n`;
        });
        
        const totalElement = document.getElementById('total');
        message += `\n${totalElement.textContent}\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/79770005127?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function openPrivacyModal() {
    alert('Модальное окно политики конфиденциальности');
}

// Автоматическая инициализация при загрузке
setTimeout(initCalculator, 100);