// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 7.0 (07.01.2026) - САМОСТОЯТЕЛЬНЫЙ ФАЙЛ
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let currentCalculation = null;

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора...');
    
    // Проверяем, что мы на странице калькулятора
    if (!document.querySelector('.calculator-section')) {
        console.log('⚠️ Калькулятор не найден на этой странице');
        return;
    }
    
    // Проверяем загрузку цен
    if (typeof window.priceData === 'undefined') {
        console.error('❌ База цен не загружена!');
        setTimeout(initCalculator, 100);
        return;
    }
    
    console.log('✅ База цен загружена:', Object.keys(window.priceData).length, 'регионов');
    
    // Инициализация элементов интерфейса
    initInterface();
    
    // Заполняем регионы
    populateRegions();
    
    // Назначаем обработчики событий
    setupEventHandlers();
    
    console.log('✅ Калькулятор успешно инициализирован');
}

// ============ НАЧАЛО ИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА ============
function initInterface() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    
    // Проверяем наличие необходимых элементов
    if (!regionSelect || !sizeSelect || !frequencySelect || !calculateBtn) {
        console.error('❌ Не найдены необходимые элементы калькулятора');
        return;
    }
    
    // Устанавливаем начальные состояния
    regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
    sizeSelect.disabled = true;
    frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
    frequencySelect.disabled = true;
    
    // Скрываем результаты
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// ============ НАЧАЛО ЗАПОЛНЕНИЯ РЕГИОНОВ ============
function populateRegions() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    // Используем порядок из PriceUtils или создаем свой
    let regions = [];
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        regions = window.PriceUtils.getRegions();
    } else {
        // Резервный вариант: получаем регионы из priceData
        regions = Object.keys(window.priceData).sort();
    }
    
    // Добавляем регионы в выпадающий список
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
    
    console.log(`✅ Загружено ${regions.length} регионов`);
}

// ============ НАЧАЛО НАСТРОЙКИ ОБРАБОТЧИКОВ СОБЫТИЙ ============
function setupEventHandlers() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const calculateBtn = document.getElementById('calculateBtn');
    const sendToTelegramBtn = document.getElementById('sendToTelegram');
    const sendToEmailBtn = document.getElementById('sendToEmail');
    
    // Обработчик выбора региона
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            handleRegionChange(this.value);
        });
    }
    
    // Обработчик выбора размера
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            handleSizeChange(regionSelect.value, this.value);
        });
    }
    
    // Обработчик кнопки расчета
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performCalculation();
        });
    }
    
    // Обработчик отправки в Telegram
    if (sendToTelegramBtn) {
        sendToTelegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendToTelegram();
        });
    }
    
    // Обработчик отправки на Email
    if (sendToEmailBtn) {
        sendToEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendToEmail();
        });
    }
    
    // Обработчик изменения количества
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            // Если уже был расчет, пересчитываем
            if (currentCalculation) {
                performCalculation();
            }
        });
    }
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РЕГИОНА ============
function handleRegionChange(region) {
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    // Получаем доступные размеры для региона
    let sizes = [];
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getSizesForRegion === 'function') {
        sizes = window.PriceUtils.getSizesForRegion(region);
    } else {
        // Резервный вариант
        if (window.priceData[region]) {
            sizes = Object.keys(window.priceData[region]).sort();
        }
    }
    
    // Заполняем список размеров
    sizeSelect.innerHTML = '<option value="">Выберите размер ковра</option>';
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    sizeSelect.disabled = false;
    
    // Сбрасываем частоту
    frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
    frequencySelect.disabled = true;
    
    // Скрываем результаты
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РАЗМЕРА ============
function handleSizeChange(region, size) {
    const frequencySelect = document.getElementById('frequency');
    
    if (!region || !size) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    // Получаем доступные частоты для размера
    let frequencies = [];
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getFrequenciesForSize === 'function') {
        frequencies = window.PriceUtils.getFrequenciesForSize(region, size);
    } else {
        // Резервный вариант
        if (window.priceData[region] && window.priceData[region][size]) {
            frequencies = Object.keys(window.priceData[region][size]).sort();
        }
    }
    
    // Заполняем список частот
    frequencySelect.innerHTML = '<option value="">Выберите периодичность замены</option>';
    frequencies.forEach(frequency => {
        const option = document.createElement('option');
        option.value = frequency;
        option.textContent = frequency;
        frequencySelect.appendChild(option);
    });
    
    frequencySelect.disabled = false;
    
    // Скрываем результаты
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// ============ НАЧАЛО ВЫПОЛНЕНИЯ РАСЧЕТА ============
function performCalculation() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    // Проверяем заполнение полей
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля калькулятора');
        return;
    }
    
    // Проверяем количество
    if (quantity < 1 || quantity > 100) {
        alert('Пожалуйста, укажите количество от 1 до 100');
        document.getElementById('quantity').value = Math.min(Math.max(quantity, 1), 100);
        return;
    }
    
    console.log(`🧮 Расчет: ${region}, ${size}, ${frequency}, ${quantity} шт.`);
    
    // Выполняем расчет
    const calculation = calculatePrice(region, size, frequency, quantity);
    
    // Сохраняем расчет
    currentCalculation = calculation;
    
    // Отображаем результаты
    displayResults(calculation);
    
    // Прокручиваем к результатам на мобильных
    if (window.innerWidth <= 768) {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            setTimeout(() => {
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
}

// ============ НАЧАЛО РАСЧЕТА ЦЕНЫ ============
function calculatePrice(region, size, frequency, quantity) {
    let pricePerReplacement = 0;
    let monthlyCost = 0;
    
    // Используем PriceUtils если доступен
    if (typeof window.PriceUtils !== 'undefined') {
        pricePerReplacement = window.PriceUtils.getPrice(region, size, frequency);
        
        if (typeof window.PriceUtils.calculateMonthlyCost === 'function') {
            monthlyCost = window.PriceUtils.calculateMonthlyCost(region, size, frequency, quantity);
        } else {
            // Резервный расчет
            monthlyCost = calculateMonthlyCostManual(pricePerReplacement, frequency, quantity);
        }
    } else {
        // Резервный вариант
        if (window.priceData[region] && 
            window.priceData[region][size] && 
            window.priceData[region][size][frequency]) {
            pricePerReplacement = window.priceData[region][size][frequency];
        }
        
        monthlyCost = calculateMonthlyCostManual(pricePerReplacement, frequency, quantity);
    }
    
    // Форматируем цены
    const formattedPrice = formatPrice(pricePerReplacement);
    const formattedMonthly = formatPrice(monthlyCost);
    const formattedTotal = formatPrice(monthlyCost * quantity);
    
    return {
        region,
        size,
        frequency,
        quantity,
        pricePerReplacement,
        monthlyCost,
        formattedPrice,
        formattedMonthly,
        formattedTotal,
        timestamp: new Date().toISOString()
    };
}

// ============ НАЧАЛО РУЧНОГО РАСЧЕТА МЕСЯЧНОЙ СТОИМОСТИ ============
function calculateMonthlyCostManual(pricePerReplacement, frequency, quantity) {
    let replacements = 4; // По умолчанию 1 раз в неделю
    
    if (frequency.includes('1 раз в две недели')) replacements = 2;
    else if (frequency.includes('1 раз в неделю')) replacements = 4;
    else if (frequency.includes('2 раза в неделю')) replacements = 8;
    else if (frequency.includes('3 раза в неделю')) replacements = 12;
    else if (frequency.includes('4 раза в неделю')) replacements = 16;
    else if (frequency.includes('5 раз в неделю')) replacements = 20;
    else if (frequency.includes('6 раз в неделю')) replacements = 24;
    else if (frequency.includes('7 раз в неделю')) replacements = 28;
    
    return pricePerReplacement * replacements * quantity;
}

// ============ НАЧАЛО ФОРМАТИРОВАНИЯ ЦЕНЫ ============
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// ============ НАЧАЛО ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ ============
function displayResults(calculation) {
    const resultsDiv = document.getElementById('results');
    const resultDetails = document.getElementById('resultDetails');
    
    if (!resultsDiv || !resultDetails) return;
    
    // Определяем количество замен в месяц
    let replacementsPerMonth = 4;
    if (calculation.frequency.includes('1 раз в две недели')) replacementsPerMonth = 2;
    else if (calculation.frequency.includes('2 раза в неделю')) replacementsPerMonth = 8;
    else if (calculation.frequency.includes('3 раза в неделю')) replacementsPerMonth = 12;
    else if (calculation.frequency.includes('4 раза в неделю')) replacementsPerMonth = 16;
    else if (calculation.frequency.includes('5 раз в неделю')) replacementsPerMonth = 20;
    else if (calculation.frequency.includes('6 раз в неделю')) replacementsPerMonth = 24;
    else if (calculation.frequency.includes('7 раз в неделю')) replacementsPerMonth = 28;
    
    // Создаем HTML результатов
    resultDetails.innerHTML = `
        <div class="result-item">
            <div class="result-label">Регион</div>
            <div class="result-value">${calculation.region}</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Размер ковра</div>
            <div class="result-value">${calculation.size}</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Периодичность замены</div>
            <div class="result-value">${calculation.frequency}</div>
            <div class="result-hint">(${replacementsPerMonth} замен в месяц)</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Количество ковров</div>
            <div class="result-value">${calculation.quantity} шт.</div>
        </div>
        
        <div class="result-item" style="background: rgba(22, 160, 133, 0.2);">
            <div class="result-label">Цена за одну замену</div>
            <div class="result-value">${calculation.formattedPrice}</div>
            <div class="result-hint">Включена доставка и чистка</div>
        </div>
        
        <div class="result-item" style="background: rgba(52, 152, 219, 0.2);">
            <div class="result-label">Стоимость в месяц</div>
            <div class="result-value">${calculation.formattedMonthly}</div>
            <div class="result-hint">За ${calculation.quantity} ковр${calculation.quantity === 1 ? 'а' : 'ов'}</div>
        </div>
    `;
    
    // Показываем результаты
    resultsDiv.style.display = 'block';
    
    // Добавляем анимацию
    resultsDiv.style.animation = 'none';
    setTimeout(() => {
        resultsDiv.style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
}

// ============ НАЧАЛО ОТПРАВКИ В TELEGRAM ============
function sendToTelegram() {
    if (!currentCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    try {
        // Формируем сообщение
        const message = createCalculationMessage();
        
        // Кодируем для URL
        const encodedMessage = encodeURIComponent(message);
        
        // Создаем ссылку на Telegram
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        // Открываем Telegram
        window.open(telegramUrl, '_blank');
        
        console.log('📤 Расчет отправлен в Telegram');
        
        // Показываем подтверждение
        setTimeout(() => {
            alert('Открывается Telegram с готовым расчетом. Просто нажмите "Отправить"!\n\nМы свяжемся с вами для уточнения деталей.');
        }, 500);
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, скопируйте результаты расчета и отправьте нам напрямую через Telegram.');
    }
}

// ============ НАЧАЛО ОТПРАВКИ НА EMAIL ============
function sendToEmail() {
    if (!currentCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    try {
        // Формируем сообщение
        const message = createCalculationMessage();
        
        // Создаем ссылку на Email
        const subject = encodeURIComponent(`Расчет аренды ковров МИРУМ - ${currentCalculation.region}`);
        const body = encodeURIComponent(message);
        const emailUrl = `mailto:matservice@yandex.ru?subject=${subject}&body=${body}`;
        
        // Открываем почтовый клиент
        window.open(emailUrl, '_blank');
        
        console.log('📧 Расчет отправлен на Email');
        
        // Показываем подтверждение
        setTimeout(() => {
            alert('Открывается почтовый клиент с готовым письмом. Просто нажмите "Отправить"!\n\nМы ответим вам в течение рабочего дня.');
        }, 500);
        
    } catch (error) {
        console.error('Ошибка отправки на Email:', error);
        alert('Произошла ошибка. Пожалуйста, скопируйте результаты расчета и отправьте нам на matservice@yandex.ru');
    }
}

// ============ НАЧАЛО СОЗДАНИЯ СООБЩЕНИЯ С РАСЧЕТОМ ============
function createCalculationMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ 🧮\n\n`;
    
    message += `📍 Регион: ${calc.region}\n`;
    message += `📏 Размер ковра: ${calc.size}\n`;
    message += `🔄 Частота замены: ${calc.frequency}\n`;
    message += `📦 Количество: ${calc.quantity} шт.\n\n`;
    
    message += `💰 Цена за замену: ${calc.formattedPrice}\n`;
    message += `📊 Стоимость в месяц: ${calc.formattedMonthly}\n\n`;
    
    message += `📞 Для заказа или уточнения деталей:\n`;
    message += `• Telegram: https://t.me/+79770005127\n`;
    message += `• Email: matservice@yandex.ru\n\n`;
    
    message += `⏰ Расчет выполнен: ${new Date().toLocaleString('ru-RU')}\n`;
    message += `🌐 Страница: Калькулятор аренды ковров`;
    
    return message;
}

// ============ НАЧАЛО ЭКСПОРТА ФУНКЦИЙ ============
// Делаем функции доступными глобально
window.initCalculator = initCalculator;
window.performCalculation = performCalculation;
window.sendToTelegram = sendToTelegram;
window.sendToEmail = sendToEmail;

// ============ НАЧАЛО АВТОМАТИЧЕСКОЙ ИНИЦИАЛИЗАЦИИ ============
// Автоматически инициализируем калькулятор при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.calculator-section')) {
        console.log('🔍 Страница калькулятора обнаружена, запускаем инициализацию...');
        setTimeout(initCalculator, 500);
    }
});

// ============ КОНЕЦ CALCULATOR.JS ============