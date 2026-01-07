// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 7.6 (07.01.2026) - НЕЗАВИСИМЫЙ ОТ ДРУГИХ ФАЙЛОВ
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let currentCalculation = null;
let priceDataLoaded = false;
let isSendingToTelegram = false;

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора (независимая версия)...');
    
    // Проверяем, что мы на странице калькулятора
    const calculatorSection = document.querySelector('.calculator-section, .calculator-form, #calculator-form');
    if (!calculatorSection) {
        console.log('⚠️ Калькулятор не найден на этой странице');
        return;
    }
    
    console.log('✅ Страница калькулятора обнаружена');
    
    // Ждем загрузки DOM
    setTimeout(() => {
        // Инициализация элементов интерфейса
        initInterface();
        
        // Проверяем загрузку цен
        checkPriceData();
        
        // Назначаем обработчики событий
        setupEventHandlers();
        
        console.log('✅ Калькулятор успешно инициализирован');
    }, 100);
}

// ============ НАЧАЛО ПРОВЕРКИ ДАННЫХ ЦЕН ============
function checkPriceData() {
    const checkInterval = setInterval(() => {
        if (typeof window.priceData !== 'undefined') {
            priceDataLoaded = true;
            clearInterval(checkInterval);
            console.log('✅ База цен загружена');
            populateRegions();
        } else if (typeof window.PriceUtils !== 'undefined') {
            priceDataLoaded = true;
            clearInterval(checkInterval);
            console.log('✅ PriceUtils загружен');
            populateRegions();
        }
    }, 100);
    
    setTimeout(() => {
        if (!priceDataLoaded) {
            clearInterval(checkInterval);
            console.error('❌ База цен не загружена! Используем резервный метод...');
            populateRegionsFallback();
        }
    }, 3000);
}

// ============ НАЧАЛО ИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА ============
function initInterface() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const resultsDiv = document.getElementById('results');
    
    // Устанавливаем начальные состояния
    if (regionSelect) {
        regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    }
    
    if (sizeSelect) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
    }
    
    if (frequencySelect) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
    }
    
    // Скрываем результаты
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    // Убедимся, что quantity имеет значение по умолчанию
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && !quantityInput.value) {
        quantityInput.value = 1;
    }
}

// ============ НАЧАЛО ЗАПОЛНЕНИЯ РЕГИОНОВ ============
function populateRegions() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    let regions = [];
    
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        try {
            regions = window.PriceUtils.getRegions();
        } catch (error) {
            console.error('Ошибка в PriceUtils.getRegions():', error);
        }
    }
    
    if (regions.length === 0 && typeof window.priceData !== 'undefined') {
        try {
            regions = Object.keys(window.priceData);
        } catch (error) {
            console.error('Ошибка в window.priceData:', error);
        }
    }
    
    if (regions.length === 0) {
        regions = getFallbackRegions();
    }
    
    regions.sort();
    regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

// ============ НАЧАЛО РЕЗЕРВНОГО СПИСКА РЕГИОНОВ ============
function populateRegionsFallback() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    const fallbackRegions = getFallbackRegions();
    regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    
    fallbackRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

function getFallbackRegions() {
    return [
        "Москва",
        "Московская область",
        "Санкт-Петербург",
        "Ленинградская область",
        "Астрахань",
        "Астраханская область",
        "Волгоград",
        "Волгоградская область",
        "Воронеж",
        "Воронежская область",
        "Екатеринбург",
        "Свердловская область",
        "Иркутск",
        "Иркутская область",
        "Казань",
        "Республика Татарстан",
        "Красноярск",
        "Красноярский край",
        "Нижний Новгород",
        "Нижегородская область",
        "Новосибирск",
        "Новосибирская область",
        "Омск",
        "Омская область",
        "Пермь",
        "Пермский край",
        "Ростов-на-Дону",
        "Ростовская область",
        "Саратов",
        "Саратовская область",
        "Сургут",
        "ХМАО",
        "Томск",
        "Томская область",
        "Тюмень",
        "Тюменская область",
        "Улан-Удэ",
        "Республика Бурятия",
        "Уфа",
        "Республика Башкортостан",
        "Челябинск",
        "Челябинская область"
    ];
}

// ============ НАЧАЛО НАСТРОЙКИ ОБРАБОТЧИКОВ СОБЫТИЙ ============
function setupEventHandlers() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
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
            handleSizeChange(regionSelect ? regionSelect.value : '', this.value);
        });
    }
    
    // Обработчик кнопки расчета
    if (calculateBtn) {
        // Удаляем старые обработчики
        calculateBtn.replaceWith(calculateBtn.cloneNode(true));
        const newCalculateBtn = document.getElementById('calculateBtn');
        
        newCalculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performCalculation();
        });
        
        // Обработчик для формы
        const calculatorForm = document.querySelector('.calculator-form, #calculator-form, form');
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                performCalculation();
            });
        }
    }
    
    // Обработчик отправки в Telegram
    if (sendToTelegramBtn) {
        // Удаляем старые обработчики
        sendToTelegramBtn.replaceWith(sendToTelegramBtn.cloneNode(true));
        const newTelegramBtn = document.getElementById('sendToTelegram');
        
        newTelegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isSendingToTelegram) return;
            
            isSendingToTelegram = true;
            
            // Вызываем нашу функцию
            sendCalculatorToTelegram();
            
            setTimeout(() => {
                isSendingToTelegram = false;
            }, 3000);
        });
    }
    
    // Обработчик отправки на Email
    if (sendToEmailBtn) {
        sendToEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendCalculatorToEmail();
        });
    }
    
    // Обработчик изменения количества
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
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
    const resultsDiv = document.getElementById('results');
    
    if (!sizeSelect || !frequencySelect) return;
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
        return;
    }
    
    let sizes = [];
    
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getSizesForRegion === 'function') {
        try {
            sizes = window.PriceUtils.getSizesForRegion(region);
        } catch (error) {
            console.error('Ошибка в PriceUtils.getSizesForRegion():', error);
        }
    }
    
    if (sizes.length === 0 && window.priceData && window.priceData[region]) {
        try {
            sizes = Object.keys(window.priceData[region]);
        } catch (error) {
            console.error('Ошибка в window.priceData[region]:', error);
        }
    }
    
    if (sizes.length === 0) {
        sizes = getFallbackSizes();
    }
    
    sizes.sort();
    sizeSelect.innerHTML = '<option value="">Выберите размер ковра</option>';
    
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    sizeSelect.disabled = false;
    frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
    frequencySelect.disabled = true;
    
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function getFallbackSizes() {
    return [
        "85*60",
        "85*150",
        "115*200",
        "115*400",
        "150*240",
        "150*300",
        "115*180",
        "115*240",
        "150*250",
        "60*90",
        "90*150",
        "120*180",
        "120*250",
        "115*300",
        "85*300",
        "150*600"
    ];
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РАЗМЕРА ============
function handleSizeChange(region, size) {
    const frequencySelect = document.getElementById('frequency');
    const resultsDiv = document.getElementById('results');
    
    if (!frequencySelect) return;
    
    if (!region || !size) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    let frequencies = [];
    
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getFrequenciesForSize === 'function') {
        try {
            frequencies = window.PriceUtils.getFrequenciesForSize(region, size);
        } catch (error) {
            console.error('Ошибка в PriceUtils.getFrequenciesForSize():', error);
        }
    }
    
    if (frequencies.length === 0 && window.priceData && window.priceData[region] && window.priceData[region][size]) {
        try {
            frequencies = Object.keys(window.priceData[region][size]);
        } catch (error) {
            console.error('Ошибка в window.priceData[region][size]:', error);
        }
    }
    
    if (frequencies.length === 0) {
        frequencies = getFallbackFrequencies();
    }
    
    frequencies.sort();
    frequencySelect.innerHTML = '<option value="">Выберите периодичность замены</option>';
    
    frequencies.forEach(frequency => {
        const option = document.createElement('option');
        option.value = frequency;
        option.textContent = frequency;
        frequencySelect.appendChild(option);
    });
    
    frequencySelect.disabled = false;
    
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function getFallbackFrequencies() {
    return [
        "1 раз в две недели",
        "1 раз в неделю",
        "2 раза в неделю",
        "3 раза в неделю",
        "4 раза в неделю",
        "5 раз в неделю",
        "6 раз в неделю",
        "7 раз в неделю"
    ];
}

// ============ НАЧАЛО ВЫПОЛНЕНИЯ РАСЧЕТА ============
function performCalculation() {
    const region = document.getElementById('region') ? document.getElementById('region').value : '';
    const size = document.getElementById('size') ? document.getElementById('size').value : '';
    const frequency = document.getElementById('frequency') ? document.getElementById('frequency').value : '';
    const quantity = document.getElementById('quantity') ? parseInt(document.getElementById('quantity').value) || 1 : 1;
    
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля калькулятора');
        return;
    }
    
    if (quantity < 1 || quantity > 100) {
        alert('Пожалуйста, укажите количество от 1 до 100');
        if (document.getElementById('quantity')) {
            document.getElementById('quantity').value = Math.min(Math.max(quantity, 1), 100);
        }
        return;
    }
    
    const calculation = calculatePrice(region, size, frequency, quantity);
    currentCalculation = calculation;
    displayResults(calculation);
}

// ============ НАЧАЛО РАСЧЕТА ЦЕНЫ ============
function calculatePrice(region, size, frequency, quantity) {
    let pricePerReplacement = 0;
    
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getPrice === 'function') {
        pricePerReplacement = window.PriceUtils.getPrice(region, size, frequency);
    } else if (window.priceData && window.priceData[region] && 
               window.priceData[region][size] && 
               window.priceData[region][size][frequency]) {
        pricePerReplacement = window.priceData[region][size][frequency];
    }
    
    if (pricePerReplacement === 0) {
        pricePerReplacement = getFallbackPrice(size);
    }
    
    let replacements = 4;
    if (frequency.includes('1 раз в две недели')) replacements = 2;
    else if (frequency.includes('2 раза в неделю')) replacements = 8;
    else if (frequency.includes('3 раза в неделю')) replacements = 12;
    else if (frequency.includes('4 раза в неделю')) replacements = 16;
    else if (frequency.includes('5 раз в неделю')) replacements = 20;
    else if (frequency.includes('6 раз в неделю')) replacements = 24;
    else if (frequency.includes('7 раз в неделю')) replacements = 28;
    
    const monthlyCost = pricePerReplacement * replacements * quantity;
    
    return {
        region,
        size,
        frequency,
        quantity,
        pricePerReplacement,
        monthlyCost,
        formattedPrice: formatPrice(pricePerReplacement),
        formattedMonthly: formatPrice(monthlyCost)
    };
}

function getFallbackPrice(size) {
    const fallbackPrices = {
        "85*60": 500,
        "85*150": 800,
        "115*200": 1200,
        "115*400": 2200,
        "150*240": 1500,
        "150*300": 2000,
        "115*180": 1100,
        "115*240": 1400,
        "150*250": 1800,
        "60*90": 400,
        "90*150": 700,
        "120*180": 1300,
        "120*250": 1700,
        "115*300": 1600,
        "85*300": 1200,
        "150*600": 4000
    };
    
    return fallbackPrices[size] || 1000;
}

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
    
    let replacementsPerMonth = 4;
    if (calculation.frequency.includes('1 раз в две недели')) replacementsPerMonth = 2;
    else if (calculation.frequency.includes('2 раза в неделю')) replacementsPerMonth = 8;
    else if (calculation.frequency.includes('3 раза в неделю')) replacementsPerMonth = 12;
    else if (calculation.frequency.includes('4 раза в неделю')) replacementsPerMonth = 16;
    else if (calculation.frequency.includes('5 раз в неделю')) replacementsPerMonth = 20;
    else if (calculation.frequency.includes('6 раз в неделю')) replacementsPerMonth = 24;
    else if (calculation.frequency.includes('7 раз в неделю')) replacementsPerMonth = 28;
    
    resultDetails.innerHTML = `
        <div class="result-item">
            <div class="result-label">Регион</div>
            <div class="result-value">${calculation.region}</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Размер ковра</div>
            <div class="result-value">${calculation.size.replace('*', '×')}</div>
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
    
    resultsDiv.style.display = 'block';
}

// ============ НАЧАЛО СОЗДАНИЯ ПОЛНОГО СООБЩЕНИЯ ДЛЯ TELEGRAM ============
function createCalculatorTelegramMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
    
    message += `📍 Регион: ${calc.region}\n`;
    message += `📏 Размер ковра: ${calc.size.replace('*', '×')}\n`;
    message += `🔄 Частота замены: ${calc.frequency}\n`;
    message += `📦 Количество: ${calc.quantity} шт.\n\n`;
    
    message += `💰 Цена за замену: ${calc.formattedPrice}\n`;
    message += `📊 Стоимость за 4 недели: ${formatPrice(calc.monthlyCost)}\n\n`;
    
    message += `📄 Для заключения договора потребуются:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Подписант (ФИО, основание полномочий)\n`;
    message += `• Точный адрес объекта и название, вывеска\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
    
    message += `📝 Условия:\n`;
    message += `Счёт выставляется только за фактические замены.\n`;
    message += `Возможно включить НДС 22% — цена увеличится на ставку налога.\n\n`;
    
    message += `📞 Связь:\n`;
    message += `Telegram: t.me/+79770005127\n`;
    message += `Email: matservice@yandex.ru\n`;
    message += `Сайт: arenda-kovrov-mirum.ru`;
    
    return message;
}

// ============ НАЧАЛО ОТПРАВКИ КАЛЬКУЛЯТОРА В TELEGRAM ============
function sendCalculatorToTelegram() {
    if (!currentCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    try {
        const message = createCalculatorTelegramMessage();
        
        // Проверка длины сообщения
        if (message.length > 3500) {
            alert('Сообщение слишком длинное. Telegram не пропускает такие длинные сообщения.\n\nПожалуйста, напишите нам в Telegram напрямую: @+79770005127\n\nМы произведем расчет за вас и пришлем готовый результат.');
            return;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        
        console.log('📤 Расчет калькулятора отправлен в Telegram');
        console.log('Длина сообщения:', message.length, 'символов');
        
        setTimeout(() => {
            alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\nМы свяжемся с вами в течение 15 минут.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
    }
}

// ============ НАЧАЛО СОЗДАНИЯ СООБЩЕНИЯ ДЛЯ EMAIL ============
function createCalculatorEmailMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    
    let message = `Расчет аренды ковров МИРУМ\n\n`;
    
    message += `Регион: ${calc.region}\n`;
    message += `Размер ковра: ${calc.size.replace('*', '×')}\n`;
    message += `Периодичность замены: ${calc.frequency}\n`;
    message += `Количество: ${calc.quantity} шт.\n\n`;
    
    message += `Цена за одну замену: ${calc.formattedPrice}\n`;
    message += `Стоимость в месяц: ${calc.formattedMonthly}\n\n`;
    
    message += `Для заключения договора понадобятся:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Подписант (ФИО, основание полномочий)\n`;
    message += `• Точный адрес объекта и название, вывеска\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
    
    message += `Счет выставляется только за фактические замены.\n`;
    message += `Возможно включить НДС 22% — цена увеличится на ставку налога.\n\n`;
    
    message += `Что входит в стоимость:\n`;
    message += `- Бесплатная доставка\n`;
    message += `- Установка и замена\n`;
    message += `- Профессиональная чистка\n`;
    message += `- Замена при износе\n`;
    message += `- Все документы\n`;
    message += `- Гибкий график\n\n`;
    
    message += `Телефон для связи: +7 (977) 000-51-27\n`;
    message += `Email: matservice@yandex.ru\n`;
    message += `Сайт: https://arenda-kovrov-mirum.ru`;
    
    return message;
}

// ============ НАЧАЛО ОТПРАВКИ КАЛЬКУЛЯТОРА НА EMAIL ============
function sendCalculatorToEmail() {
    if (!currentCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    try {
        const subject = encodeURIComponent(`Расчет аренды ковров МИРУМ - ${currentCalculation.region}`);
        const body = encodeURIComponent(createCalculatorEmailMessage());
        const emailUrl = `mailto:matservice@yandex.ru?subject=${subject}&body=${body}`;
        
        window.open(emailUrl, '_blank');
        
        setTimeout(() => {
            alert('Почтовый клиент открыт! Нажмите "Отправить" чтобы отправить расчет.\n\nМы ответим вам в течение рабочего дня.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки на Email:', error);
        alert('Произошла ошибка. Пожалуйста, отправьте email на matservice@yandex.ru');
    }
}

// ============ НАЧАЛО ЭКСПОРТА ФУНКЦИЙ ============
// Только нужные функции для калькулятора
window.Calculator = {
    init: initCalculator,
    calculate: performCalculation,
    sendToTelegram: sendCalculatorToTelegram,
    sendToEmail: sendCalculatorToEmail
};

// ============ НАЧАЛО АВТОМАТИЧЕСКОЙ ИНИЦИАЛИЗАЦИИ ============
// Изолированная инициализация только для калькулятора
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, проверяем калькулятор...');
    
    const hasCalculator = document.querySelector('.calculator-section') || 
                         document.querySelector('.calculator-form') || 
                         document.getElementById('region');
    
    if (hasCalculator) {
        console.log('🔍 Калькулятор обнаружен, запускаем...');
        
        setTimeout(() => {
            initCalculator();
        }, 500);
    }
});

// ============ КОНЕЦ CALCULATOR.JS ============