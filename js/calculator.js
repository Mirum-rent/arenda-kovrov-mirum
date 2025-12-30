// Основные функции калькулятора
let currentOrder = [];
let currentTenderOrder = [];

function initializeCalculator() {
    // Инициализация регионов
    const regionSelect = document.getElementById('region');
    const tenderRegionSelect = document.getElementById('tenderRegion');
    
    if (regionSelect && window.regionsOrder) {
        window.regionsOrder.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }
    
    if (tenderRegionSelect && window.regionsOrder) {
        window.regionsOrder.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            tenderRegionSelect.appendChild(option);
        });
    }
    
    // Инициализация месяцев для тендерного калькулятора
    if (window.months) {
        const monthInputs = document.getElementById('monthInputs');
        if (monthInputs) {
            monthInputs.innerHTML = '';
            window.months.forEach((month, index) => {
                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label for="month${index}">${month} (количество замен)</label>
                    <input type="number" id="month${index}" min="0" max="31" value="0" 
                           onchange="updateTenderMonth(${index})">
                `;
                monthInputs.appendChild(div);
            });
        }
    }
}

function updateSizes() {
    const region = document.getElementById('region').value;
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    // Очищаем и заполняем размеры
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    
    if (window.priceData && window.priceData[region]) {
        const sizes = Object.keys(window.priceData[region]);
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
        sizeSelect.disabled = false;
    } else {
        sizeSelect.innerHTML = '<option value="">Размеры не доступны для этого региона</option>';
        sizeSelect.disabled = true;
    }
    
    frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
    frequencySelect.disabled = true;
}

function updateFrequencies() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequencySelect = document.getElementById('frequency');
    
    if (!region || !size) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    // Очищаем и заполняем частоты замены
    frequencySelect.innerHTML = '<option value="">Выберите частоту замены</option>';
    
    if (window.priceData && window.priceData[region] && window.priceData[region][size]) {
        const frequencies = Object.keys(window.priceData[region][size]);
        frequencies.forEach(freq => {
            const option = document.createElement('option');
            option.value = freq;
            option.textContent = freq;
            frequencySelect.appendChild(option);
        });
        frequencySelect.disabled = false;
    }
}

function calculate() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    // Получаем цену за одну замену
    const pricePerChange = window.getPrice(region, size, frequency);
    if (pricePerChange === '-') {
        alert('Цена не найдена для выбранных параметров');
        return;
    }
    
    // Рассчитываем стоимость за 4 недели
    const changesPerMonth = getChangesPerMonth(frequency);
    const monthlyCost = pricePerChange * changesPerMonth * quantity;
    
    // Показываем результаты
    document.getElementById('standard-result').style.display = 'block';
    document.getElementById('discountNotice').style.display = 'block';
    
    // Прокручиваем к результатам
    setTimeout(() => {
        document.getElementById('standard-result').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
}

function getChangesPerMonth(frequency) {
    const frequencyMap = {
        '1 раз в две недели': 2,
        '1 раз в неделю': 4,
        '2 раза в неделю': 8,
        '3 раза в неделю': 12,
        '4 раза в неделю': 16,
        '5 раз в неделю': 20,
        '6 раз в неделю': 24,
        '7 раз в неделю': 28
    };
    return frequencyMap[frequency] || 4;
}

function addPosition() {
    // Получаем данные
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля перед добавлением позиции');
        return;
    }
    
    const pricePerChange = window.getPrice(region, size, frequency);
    if (pricePerChange === '-') {
        alert('Не удалось получить цену. Проверьте параметры.');
        return;
    }
    
    // Добавляем позицию в заказ
    const position = {
        region,
        size,
        frequency,
        quantity,
        pricePerChange,
        monthlyCost: pricePerChange * getChangesPerMonth(frequency) * quantity
    };
    
    currentOrder.push(position);
    updateOrderTable();
    
    // Показываем уведомление
    const notice = document.getElementById('addedNotice');
    notice.style.display = 'block';
    notice.style.background = '#d4edda';
    notice.style.color = '#155724';
    notice.style.padding = '10px';
    notice.style.borderRadius = '5px';
    notice.style.margin = '10px 0';
    
    setTimeout(() => {
        notice.style.display = 'none';
    }, 3000);
}

function updateOrderTable() {
    const tableBody = document.getElementById('orderBody');
    const totalElement = document.getElementById('total');
    
    if (!tableBody || !totalElement) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    let total = 0;
    
    // Заполняем таблицу
    currentOrder.forEach((position, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${position.size}</td>
            <td>${position.quantity}</td>
            <td>${position.frequency}</td>
            <td>${position.pricePerChange} ₽</td>
            <td>${position.monthlyCost} ₽</td>
        `;
        
        tableBody.appendChild(row);
        total += position.monthlyCost;
    });
    
    // Обновляем итог
    totalElement.textContent = `Общая стоимость за 4 недели: ${total} ₽`;
    
    // Показываем форму для скидки при большой сумме
    const discountSection = document.getElementById('discountSection');
    if (total > 10000 && discountSection) {
        discountSection.style.display = 'block';
    }
}

function sendToTelegram() {
    if (currentOrder.length === 0) {
        alert('Добавьте хотя бы одну позицию в заказ');
        return;
    }
    
    // Формируем сообщение для Telegram
    let message = `📋 ЗАПРОС НА РАСЧЕТ АРЕНДЫ КОВРОВ\n\n`;
    
    currentOrder.forEach((position, index) => {
        message += `Позиция ${index + 1}:\n`;
        message += `📍 Регион: ${position.region}\n`;
        message += `📏 Размер: ${position.size}\n`;
        message += `🔄 Замена: ${position.frequency}\n`;
        message += `📦 Количество: ${position.quantity} шт.\n`;
        message += `💰 Цена за замену: ${position.pricePerChange} ₽\n`;
        message += `💵 Стоимость за 4 недели: ${position.monthlyCost} ₽\n\n`;
    });
    
    // Общая сумма
    const total = currentOrder.reduce((sum, pos) => sum + pos.monthlyCost, 0);
    message += `📊 ОБЩАЯ СТОИМОСТЬ: ${total} ₽\n\n`;
    message += `Для подтверждения заказа напишите нам!`;
    
    // Кодируем сообщение
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
    
    // Открываем Telegram
    window.open(telegramUrl, '_blank');
}

// Функции для тендерного калькулятора
function updateTenderSizes() {
    const region = document.getElementById('tenderRegion').value;
    const sizeSelect = document.getElementById('tenderSize');
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        return;
    }
    
    sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
    
    if (window.priceData && window.priceData[region]) {
        const sizes = Object.keys(window.priceData[region]);
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
        sizeSelect.disabled = false;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    
    // Обработчики для вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.calculator-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок
            tabBtns.forEach(b => b.classList.remove('active'));
            // Скрываем все контенты
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Активируем текущую вкладку
            this.classList.add('active');
            document.getElementById(`${tabId}-calculator`).classList.add('active');
        });
    });
});