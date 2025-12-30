// calculator.js - ОБНОВЛЕННЫЙ калькулятор для МИРУМ (Telegram вместо WhatsApp)
console.log('🎯 calculator.js для МИРУМ ЗАГРУЖЕН!');

// Глобальные переменные
window.orderItems = [];
window.currentItem = null;
window.tenderItems = [];
window.currentTenderItem = null;

// Инициализация калькулятора
function initCalculator() {
    console.log('🔍 Инициализация калькулятора МИРУМ');
    
    // Проверяем, загружены ли цены
    if (typeof priceData === 'undefined') {
        console.error('❌ priceData не загружен!');
        setTimeout(initCalculator, 500); // Повторяем через 500мс
        return;
    }
    
    console.log('✅ priceData загружен, регионов:', Object.keys(priceData).length);
    
    // Инициализация выпадающих списков регионов
    initRegionSelects();
    
    // Инициализация полей ввода по месяцам для тендерного калькулятора
    initMonthInputs();
    
    // Настройка переключения между вкладками калькуляторов
    setupCalculatorTabs();
    
    console.log('✅ Калькулятор МИРУМ инициализирован');
}

// Настройка переключения между вкладками калькуляторов
function setupCalculatorTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все калькуляторы
            calculatorContents.forEach(content => content.classList.remove('active'));
            
            // Показываем выбранный калькулятор
            const tabId = this.getAttribute('data-tab');
            const targetCalculator = document.getElementById(`${tabId}-calculator`);
            if (targetCalculator) {
                targetCalculator.classList.add('active');
            }
        });
    });
}

// Инициализация выпадающих списков регионов - ИСПРАВЛЕННАЯ ВЕРСИЯ
function initRegionSelects() {
    console.log('🔍 Инициализация регионов из priceData');
    
    const regionSelects = document.querySelectorAll('select[id="region"], select[id="tenderRegion"]');
    
    regionSelects.forEach(select => {
        // Очищаем список опций (кроме первого)
        const firstOption = select.querySelector('option[value=""]') || 
                          select.options[0] || 
                          {value: '', textContent: 'Выберите регион'};
        
        select.innerHTML = '';
        select.appendChild(new Option(firstOption.textContent, firstOption.value));
        
        // Берем регионы из priceData
        if (typeof priceData !== 'undefined') {
            const regions = Object.keys(priceData).sort();
            
            console.log(`📋 Загружено регионов: ${regions.length}`);
            
            regions.forEach(region => {
                const option = new Option(region, region);
                select.appendChild(option);
            });
        } else {
            console.error('❌ priceData не определен');
        }
        
        // Добавляем обработчик изменения
        select.addEventListener('change', function() {
            if (this.id === 'region') {
                updateSizes();
            } else if (this.id === 'tenderRegion') {
                updateTenderSizes();
            }
        });
    });
}

// Инициализация полей ввода по месяцам для тендерного калькулятора
function initMonthInputs() {
    const container = document.getElementById('monthInputs');
    if (!container) return;
    
    container.innerHTML = '';
    
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    // Создаем поля ввода для каждого месяца
    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-input';
        monthDiv.innerHTML = `
            <label>${month}</label>
            <input type="number" min="0" placeholder="Ковров" class="month-carpets" data-month="${month}" onchange="calculateTender()">
            <input type="number" min="0" placeholder="Замен" class="month-replacements" data-month="${month}" onchange="calculateTender()">
            <div class="month-cost" data-month="${month}">0 ₽</div>
        `;
        container.appendChild(monthDiv);
    });
}

// Обновление списка размеров ковров при выборе региона
function updateSizes() {
    const region = document.getElementById('region')?.value;
    const sizeSelect = document.getElementById('size');
    
    if (!sizeSelect || !region) return;
    
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    sizeSelect.disabled = !region;
    
    if (region && priceData && priceData[region]) {
        const sizes = Object.keys(priceData[region]).sort();
        
        sizes.forEach(size => {
            const option = new Option(size, size);
            sizeSelect.appendChild(option);
        });
        
        sizeSelect.disabled = false;
    }
    
    // Сбрасываем зависимые поля
    const frequencySelect = document.getElementById('frequency');
    if (frequencySelect) {
        frequencySelect.innerHTML = '<option value="">Выберите периодичность</option>';
        frequencySelect.disabled = true;
    }
    
    currentItem = null;
    updateOrderTable();
}

// Обновление списка периодичности замен при выборе размера
function updateFrequencies() {
    const region = document.getElementById('region')?.value;
    const size = document.getElementById('size')?.value;
    const frequencySelect = document.getElementById('frequency');
    
    if (!frequencySelect || !region || !size) return;
    
    frequencySelect.innerHTML = '<option value="">Выберите периодичность</option>';
    frequencySelect.disabled = !size;
    
    if (region && size && priceData && priceData[region] && priceData[region][size]) {
        const frequencies = Object.keys(priceData[region][size]).sort();
        
        frequencies.forEach(freq => {
            const option = new Option(freq, freq);
            frequencySelect.appendChild(option);
        });
        
        frequencySelect.disabled = false;
    }
    
    currentItem = null;
    updateOrderTable();
}

// Расчет стоимости для текущей позиции
function calculate() {
    const region = document.getElementById('region')?.value;
    const size = document.getElementById('size')?.value;
    const frequency = document.getElementById('frequency')?.value;
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
    
    // Проверяем, что все необходимые данные заполнены
    if (!region || !size || !frequency || quantity <= 0) {
        currentItem = null;
        updateOrderTable();
        return;
    }
    
    // Проверяем, есть ли данные о ценах
    if (!priceData || !priceData[region] || !priceData[region][size] || !priceData[region][size][frequency]) {
        console.error('❌ Нет данных о ценах для:', {region, size, frequency});
        currentItem = null;
        updateOrderTable();
        return;
    }
    
    const pricePerItem = priceData[region][size][frequency];
    
    // Определяем количество замен в месяц
    let replacementsPerMonth;
    if (frequency.includes('1 раз в две недели')) replacementsPerMonth = 2;
    else if (frequency.includes('1 раз в неделю')) replacementsPerMonth = 4;
    else if (frequency.includes('2 раза в неделю')) replacementsPerMonth = 8;
    else if (frequency.includes('3 раза в неделю')) replacementsPerMonth = 12;
    else if (frequency.includes('4 раза в неделю')) replacementsPerMonth = 16;
    else if (frequency.includes('5 раз в неделю')) replacementsPerMonth = 20;
    else if (frequency.includes('6 раз в неделю')) replacementsPerMonth = 24;
    else if (frequency.includes('7 раз в неделю')) replacementsPerMonth = 28;
    else replacementsPerMonth = 0;
    
    const costForMonth = pricePerItem * replacementsPerMonth * quantity;
    
    currentItem = {
        region,
        size,
        frequency,
        quantity,
        pricePerItem,
        replacementsPerMonth,
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
    
    orderItems.push({...currentItem});
    
    // Показываем уведомление о добавлении позиции
    const notice = document.getElementById('addedNotice');
    if (notice) {
        notice.style.display = 'block';
        setTimeout(() => {
            notice.style.display = 'none';
        }, 5000);
    }
    
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
    const tbody = document.getElementById('orderBody');
    const standardResult = document.getElementById('standard-result');
    
    if (!tbody || !standardResult) return;
    
    tbody.innerHTML = '';
    
    let total = 0;
    
    // Добавляем текущий элемент, если он есть
    if (currentItem) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${currentItem.size}</td>
            <td>${currentItem.quantity}</td>
            <td>${currentItem.frequency}</td>
            <td>${currentItem.pricePerItem.toLocaleString('ru-RU')} ₽</td>
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
            <td>${item.pricePerItem.toLocaleString('ru-RU')} ₽</td>
            <td>${item.costForMonth.toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
        total += item.costForMonth;
    });
    
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `Общая стоимость: ${total.toLocaleString('ru-RU')} ₽`;
    }
    
    // Показываем/скрываем блок скидки
    const discountNotice = document.getElementById('discountNotice');
    const discountSection = document.getElementById('discountSection');
    
    if (discountNotice && discountSection) {
        if (total > 20000) {
            discountNotice.style.display = 'block';
            discountSection.style.display = 'block';
        } else {
            discountNotice.style.display = 'none';
            discountSection.style.display = 'none';
        }
    }
    
    // Показываем блок результатов
    standardResult.style.display = 'block';
}

// Тендерный калькулятор
function updateTenderSizes() {
    const region = document.getElementById('tenderRegion')?.value;
    const sizeSelect = document.getElementById('tenderSize');
    
    if (!sizeSelect || !region) return;
    
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    sizeSelect.disabled = !region;
    
    if (region && priceData && priceData[region]) {
        const sizes = Object.keys(priceData[region]).sort();
        
        sizes.forEach(size => {
            const option = new Option(size, size);
            sizeSelect.appendChild(option);
        });
        
        sizeSelect.disabled = false;
    }
    
    currentTenderItem = null;
    calculateTender();
}

function calculateTender() {
    const region = document.getElementById('tenderRegion')?.value;
    const size = document.getElementById('tenderSize')?.value;
    
    if (!region || !size) {
        currentTenderItem = null;
        updateTenderTable();
        return;
    }
    
    // Берем первую доступную частоту для расчета
    if (!priceData || !priceData[region] || !priceData[region][size]) {
        currentTenderItem = null;
        updateTenderTable();
        return;
    }
    
    const frequencies = Object.keys(priceData[region][size]);
    const firstFrequency = frequencies[0] || '1 раз в две недели';
    const pricePerItem = priceData[region][size][firstFrequency] || 0;
    
    currentTenderItem = {
        region,
        size,
        pricePerItem,
        frequency: firstFrequency
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
    
    currentTenderItem = null;
    calculateTender();
}

function updateTenderTable() {
    const tbody = document.getElementById('tenderBody');
    const tenderResult = document.getElementById('tender-result');
    
    if (!tbody || !tenderResult) return;
    
    tbody.innerHTML = '';
    
    let total = 0;
    
    // Добавляем текущий элемент
    if (currentTenderItem) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Базовый</td>
            <td>${currentTenderItem.size}</td>
            <td>1</td>
            <td>${currentTenderItem.frequency}</td>
            <td>${currentTenderItem.pricePerItem.toLocaleString('ru-RU')} ₽ за замену</td>
        `;
        tbody.appendChild(row);
    }
    
    // Добавляем сохраненные элементы
    tenderItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Базовый</td>
            <td>${item.size}</td>
            <td>1</td>
            <td>${item.frequency}</td>
            <td>${item.pricePerItem.toLocaleString('ru-RU')} ₽ за замену</td>
        `;
        tbody.appendChild(row);
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
                <td>${replacements} замен</td>
                <td>${monthCost.toLocaleString('ru-RU')} ₽</td>
            `;
            tbody.appendChild(row);
        } else {
            input.querySelector('.month-cost').textContent = '0 ₽';
        }
    });
    
    const tenderTotal = document.getElementById('tenderTotal');
    if (tenderTotal) {
        tenderTotal.textContent = `Общая стоимость: ${total.toLocaleString('ru-RU')} ₽`;
    }
    
    const tenderDiscountNotice = document.getElementById('tenderDiscountNotice');
    if (tenderDiscountNotice) {
        tenderDiscountNotice.style.display = total > 50000 ? 'block' : 'none';
    }
    
    tenderResult.style.display = 'block';
}

// Функции отправки в Telegram (вместо WhatsApp)
function sendToTelegram() {
    if (orderItems.length === 0 && !currentItem) {
        alert('Добавьте хотя бы одну позицию в заказ');
        return;
    }
    
    const region = document.getElementById('region')?.value;
    
    let message = '📋 Запрос по калькулятору аренды ковров МИРУМ:\n\n';
    
    if (region) {
        message += `📍 Регион: ${region}\n\n`;
    }
    
    message += '🛒 Текущий заказ:\n';
    
    if (currentItem) {
        message += `• ${currentItem.size}, ${currentItem.quantity} шт., ${currentItem.frequency}, ${currentItem.costForMonth} ₽/мес\n`;
    }
    
    orderItems.forEach(item => {
        message += `• ${item.size}, ${item.quantity} шт., ${item.frequency}, ${item.costForMonth} ₽/мес\n`;
    });
    
    const totalElement = document.getElementById('total');
    if (totalElement) {
        message += `\n💰 ${totalElement.textContent}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
}

function sendTenderToTelegram() {
    const name = document.getElementById('tenderName')?.value;
    const phone = document.getElementById('tenderPhone')?.value;
    const consent = document.getElementById('tenderConsent')?.checked;
    
    if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    const region = document.getElementById('tenderRegion')?.value;
    
    let message = `📋 Запрос по тендеру МИРУМ:\n`;
    message += `👤 Имя: ${name}\n`;
    message += `📞 Телефон: ${phone}\n`;
    
    if (region) {
        message += `📍 Регион: ${region}\n`;
    }
    
    message += '\n🛒 Детали тендера:\n';
    
    if (currentTenderItem) {
        message += `• ${currentTenderItem.size}, ${currentTenderItem.pricePerItem} ₽ за замену\n`;
    }
    
    tenderItems.forEach(item => {
        message += `• ${item.size}, ${item.pricePerItem} ₽ за замену\n`;
    });
    
    message += '\n🗓️ По месяцам:\n';
    
    document.querySelectorAll('.month-input').forEach(input => {
        const month = input.querySelector('.month-carpets').getAttribute('data-month');
        const carpets = input.querySelector('.month-carpets').value || 0;
        const replacements = input.querySelector('.month-replacements').value || 0;
        
        if (carpets > 0 || replacements > 0) {
            message += `• ${month}: ${carpets} ковров, ${replacements} замен\n`;
        }
    });
    
    const totalElement = document.getElementById('tenderTotal');
    if (totalElement) {
        message += `\n💰 ${totalElement.textContent}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
}

function requestDiscount() {
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('discountPhone')?.value;
    const consent = document.getElementById('consent')?.checked;
    
    if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните все обязательные поля и дайте согласие на обработку данных');
        return;
    }
    
    const region = document.getElementById('region')?.value;
    
    let message = `💰 Запрос на скидку МИРУМ:\n`;
    message += `👤 Имя: ${name}\n`;
    message += `📞 Телефон: ${phone}\n`;
    
    if (region) {
        message += `📍 Регион: ${region}\n`;
    }
    
    message += '\n🛒 Текущий заказ:\n';
    
    if (currentItem) {
        message += `• ${currentItem.size}, ${currentItem.quantity} шт., ${currentItem.frequency}, ${currentItem.costForMonth} ₽/мес\n`;
    }
    
    orderItems.forEach(item => {
        message += `• ${item.size}, ${item.quantity} шт., ${item.frequency}, ${item.costForMonth} ₽/мес\n`;
    });
    
    const totalElement = document.getElementById('total');
    if (totalElement) {
        message += `\n💰 ${totalElement.textContent}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
}

function showContractForm() {
    const contractForm = document.getElementById('contractForm');
    if (contractForm) {
        contractForm.style.display = 'block';
    }
}

function sendContractDetails() {
    const contactPerson = document.getElementById('contact-person')?.value;
    const phone = document.getElementById('contractPhone')?.value;
    const consent = document.getElementById('contractConsent')?.checked;
    
    if (!contactPerson || !phone || !consent) {
        alert('Пожалуйста, заполните обязательные поля (имя и телефон) и дайте согласие на обработку данных');
        return;
    }
    
    const region = document.getElementById('region')?.value;
    
    let message = `📄 Реквизиты для договора МИРУМ:\n\n`;
    message += `👤 Контактное лицо: ${contactPerson}\n`;
    message += `📞 Телефон: ${phone}\n`;
    
    if (region) {
        message += `📍 Регион аренды: ${region}\n`;
    }
    
    const company = document.getElementById('company')?.value;
    const email = document.getElementById('email')?.value;
    const requisites = document.getElementById('requisites')?.value;
    
    if (company) message += `🏢 Организация: ${company}\n`;
    if (email) message += `📧 Email: ${email}\n`;
    if (requisites) message += `📋 Реквизиты:\n${requisites}\n`;
    
    if (currentItem || orderItems.length > 0) {
        message += `\n🛒 Заказ:\n`;
        
        if (currentItem) {
            message += `• ${currentItem.size}, ${currentItem.quantity} шт., ${currentItem.frequency}\n`;
        }
        
        orderItems.forEach(item => {
            message += `• ${item.size}, ${item.quantity} шт., ${item.frequency}\n`;
        });
        
        const totalElement = document.getElementById('total');
        if (totalElement) {
            message += `\n💰 ${totalElement.textContent}\n`;
        }
    }
    
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки priceData
    const checkPriceData = setInterval(() => {
        if (typeof priceData !== 'undefined') {
            clearInterval(checkPriceData);
            initCalculator();
        }
    }, 100);
    
    // Максимальное время ожидания - 5 секунд
    setTimeout(() => {
        if (typeof priceData === 'undefined') {
            console.error('❌ priceData не загрузился за 5 секунд');
            // Пытаемся инициализировать с ошибкой
            try {
                initCalculator();
            } catch (e) {
                console.error('Ошибка инициализации калькулятора:', e);
            }
        }
    }, 5000);
});