// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 8.0 (07.01.2026) - С ВОЗМОЖНОСТЬЮ ДОБАВЛЕНИЯ НЕСКОЛЬКИХ ПОЗИЦИЙ
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let currentCalculation = null;
let priceDataLoaded = false;
let isSendingToTelegram = false;
let positions = []; // Массив для хранения позиций
let tenderPositions = []; // Массив для тендерных позиций

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора (версия с несколькими позициями)...');
    
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
    const tenderRegionSelect = document.getElementById('tender-region');
    const tenderSizeSelect = document.getElementById('tender-size');
    
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
    
    if (tenderRegionSelect) {
        tenderRegionSelect.innerHTML = '<option value="">Выберите регион</option>';
    }
    
    if (tenderSizeSelect) {
        tenderSizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        tenderSizeSelect.disabled = true;
    }
    
    // Инициализируем месяцы для тендера
    initMonths();
    
    // Скрываем результаты
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    // Убедимся, что quantity имеет значение по умолчанию
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && !quantityInput.value) {
        quantityInput.value = 1;
    }
    
    // Очищаем список позиций
    positions = [];
    updatePositionsList();
}

// ============ НАЧАЛО ИНИЦИАЛИЗАЦИИ МЕСЯЦЕВ ДЛЯ ТЕНДЕРА ============
function initMonths() {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const container = document.getElementById('monthInputs');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    months.forEach(month => {
        const div = document.createElement('div');
        div.className = 'month-box';
        div.style.cssText = 'padding: 10px; background: #f8f9fa; border-radius: 6px; text-align: center;';
        div.innerHTML = `
            <label style="font-size: 12px; margin-bottom: 5px; display: block;">${month}</label>
            <input type="number" min="0" placeholder="Кол-во" id="${month}-qty" style="padding: 8px; font-size: 14px; margin-bottom: 5px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
            <input type="number" min="0" placeholder="Замены" id="${month}-changes" style="padding: 8px; font-size: 14px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
        `;
        container.appendChild(div);
    });
}

// ============ НАЧАЛО ЗАПОЛНЕНИЯ РЕГИОНОВ ============
function populateRegions() {
    const regionSelect = document.getElementById('region');
    const tenderRegionSelect = document.getElementById('tender-region');
    
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
    
    // Заполняем оба селекта
    if (regionSelect) {
        regionSelect.innerHTML = '<option value="">Выберите регион</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
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
}

// ============ НАЧАЛО РЕЗЕРВНОГО СПИСКА РЕГИОНОВ ============
function populateRegionsFallback() {
    const regionSelect = document.getElementById('region');
    const tenderRegionSelect = document.getElementById('tender-region');
    
    const fallbackRegions = getFallbackRegions();
    
    if (regionSelect) {
        regionSelect.innerHTML = '<option value="">Выберите регион</option>';
        fallbackRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }
    
    if (tenderRegionSelect) {
        tenderRegionSelect.innerHTML = '<option value="">Выберите регион</option>';
        fallbackRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            tenderRegionSelect.appendChild(option);
        });
    }
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
    const addPositionBtn = document.getElementById('addPositionBtn');
    const sendToTelegramBtn = document.getElementById('sendToTelegram');
    const sendToEmailBtn = document.getElementById('sendToEmail');
    const tenderRegionSelect = document.getElementById('tender-region');
    const tenderSizeSelect = document.getElementById('tender-size');
    const calculateTenderBtn = document.getElementById('calculateTenderBtn');
    const sendTenderToTelegramBtn = document.getElementById('sendTenderToTelegram');
    
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
    
    // Обработчик кнопки добавления позиции
    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addPosition();
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
            e.stopPropagation();
            
            if (isSendingToTelegram) return;
            
            isSendingToTelegram = true;
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
            // Обновляем расчет при изменении количества
        });
    }
    
    // Обработчики для тендерного калькулятора
    if (tenderRegionSelect) {
        tenderRegionSelect.addEventListener('change', function() {
            handleTenderRegionChange(this.value);
        });
    }
    
    if (calculateTenderBtn) {
        calculateTenderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateTender();
        });
    }
    
    if (sendTenderToTelegramBtn) {
        sendTenderToTelegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendTenderToTelegram();
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

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РЕГИОНА ДЛЯ ТЕНДЕРА ============
function handleTenderRegionChange(region) {
    const tenderSizeSelect = document.getElementById('tender-size');
    const tenderResultDiv = document.getElementById('tender-result');
    
    if (!tenderSizeSelect) return;
    
    if (!region) {
        tenderSizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        tenderSizeSelect.disabled = true;
        
        if (tenderResultDiv) {
            tenderResultDiv.style.display = 'none';
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
    tenderSizeSelect.innerHTML = '<option value="">Выберите размер ковра</option>';
    
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        tenderSizeSelect.appendChild(option);
    });
    
    tenderSizeSelect.disabled = false;
    
    if (tenderResultDiv) {
        tenderResultDiv.style.display = 'none';
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

// ============ НАЧАЛО ДОБАВЛЕНИЯ ПОЗИЦИИ ============
function addPosition() {
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
    
    const pricePerReplacement = getPriceForPosition(region, size, frequency);
    
    if (pricePerReplacement === 0) {
        alert('Не удалось определить цену для выбранных параметров');
        return;
    }
    
    const replacements = getReplacementsCount(frequency);
    const monthlyCost = pricePerReplacement * replacements * quantity;
    
    const position = {
        id: Date.now() + Math.random(),
        region,
        size,
        frequency,
        quantity,
        pricePerReplacement,
        monthlyCost,
        replacements
    };
    
    positions.push(position);
    updatePositionsList();
    
    // Показываем список позиций
    const positionsList = document.getElementById('positionsList');
    if (positionsList) {
        positionsList.style.display = 'block';
    }
    
    // Очищаем форму для следующей позиции
    document.getElementById('quantity').value = 1;
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ СПИСКА ПОЗИЦИЙ ============
function updatePositionsList() {
    const positionsContainer = document.getElementById('positionsContainer');
    if (!positionsContainer) return;
    
    if (positions.length === 0) {
        positionsContainer.innerHTML = '<p style="text-align: center; color: #666;">Позиции не добавлены</p>';
        return;
    }
    
    let html = '';
    let totalMonthlyCost = 0;
    
    positions.forEach((position, index) => {
        totalMonthlyCost += position.monthlyCost;
        
        html += `
            <div class="position-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #3498db; position: relative;">
                <strong>${position.size.replace('*', '×')}</strong> × ${position.quantity} шт.<br>
                ${position.frequency} (${position.replacements} замен в месяц)<br>
                Цена за замену: ${formatPrice(position.pricePerReplacement)}<br>
                <strong>Стоимость в месяц: ${formatPrice(position.monthlyCost)}</strong>
                <button onclick="removePosition(${index})" style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">×</button>
            </div>
        `;
    });
    
    // Добавляем итоговую сумму
    html += `
        <div style="background: #16a085; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 18px; font-weight: bold;">
            Общая стоимость в месяц: ${formatPrice(totalMonthlyCost)}
        </div>
    `;
    
    positionsContainer.innerHTML = html;
}

// ============ НАЧАЛО УДАЛЕНИЯ ПОЗИЦИИ ============
function removePosition(index) {
    if (index >= 0 && index < positions.length) {
        positions.splice(index, 1);
        updatePositionsList();
        
        // Если позиций не осталось, скрываем список
        if (positions.length === 0) {
            const positionsList = document.getElementById('positionsList');
            if (positionsList) {
                positionsList.style.display = 'none';
            }
        }
    }
}

// ============ НАЧАЛО РАСЧЕТА ЦЕНЫ ДЛЯ ПОЗИЦИИ ============
function getPriceForPosition(region, size, frequency) {
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
    
    return pricePerReplacement;
}

// ============ НАЧАЛО РАСЧЕТА КОЛИЧЕСТВА ЗАМЕН ============
function getReplacementsCount(frequency) {
    if (frequency.includes('1 раз в две недели')) return 2;
    else if (frequency.includes('1 раз в неделю')) return 4;
    else if (frequency.includes('2 раза в неделю')) return 8;
    else if (frequency.includes('3 раза в неделю')) return 12;
    else if (frequency.includes('4 раза в неделю')) return 16;
    else if (frequency.includes('5 раз в неделю')) return 20;
    else if (frequency.includes('6 раз в неделю')) return 24;
    else if (frequency.includes('7 раз в неделю')) return 28;
    
    return 4; // По умолчанию
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

// ============ НАЧАЛО ВЫПОЛНЕНИЯ РАСЧЕТА ============
function performCalculation() {
    if (positions.length === 0) {
        alert('Пожалуйста, добавьте хотя бы одну позицию');
        return;
    }
    
    // Рассчитываем общую стоимость
    let totalMonthlyCost = 0;
    let totalReplacements = 0;
    
    positions.forEach(position => {
        totalMonthlyCost += position.monthlyCost;
        totalReplacements += position.replacements * position.quantity;
    });
    
    currentCalculation = {
        positions: positions,
        totalMonthlyCost,
        totalReplacements,
        positionCount: positions.length
    };
    
    displayResults(currentCalculation);
}

// ============ НАЧАЛО ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ ============
function displayResults(calculation) {
    const resultsDiv = document.getElementById('results');
    const resultDetails = document.getElementById('resultDetails');
    
    if (!resultsDiv || !resultDetails) return;
    
    let html = `
        <div class="result-item">
            <div class="result-label">Количество позиций</div>
            <div class="result-value">${calculation.positionCount} шт.</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Всего замен в месяц</div>
            <div class="result-value">${calculation.totalReplacements}</div>
        </div>
        
        <div class="result-item" style="background: rgba(52, 152, 219, 0.2);">
            <div class="result-label">Общая стоимость в месяц</div>
            <div class="result-value">${formatPrice(calculation.totalMonthlyCost)}</div>
        </div>
        
        <div style="margin-top: 20px;">
            <h4 style="color: white; margin-bottom: 10px;">Состав заказа:</h4>
    `;
    
    calculation.positions.forEach((position, index) => {
        html += `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 6px; margin-bottom: 8px; font-size: 0.9rem;">
                ${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт. (${position.frequency}) - ${formatPrice(position.monthlyCost)}/мес
            </div>
        `;
    });
    
    html += '</div>';
    
    resultDetails.innerHTML = html;
    resultsDiv.style.display = 'block';
    
    // Прокручиваем к результатам
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ НАЧАЛО ТЕНДЕРНОГО РАСЧЕТА ============
function calculateTender() {
    const region = document.getElementById('tender-region') ? document.getElementById('tender-region').value : '';
    const size = document.getElementById('tender-size') ? document.getElementById('tender-size').value : '';
    
    if (!region || !size) {
        alert('Пожалуйста, выберите регион и размер');
        return;
    }
    
    const pricePerReplacement = getPriceForPosition(region, size, "1 раз в неделю");
    
    if (pricePerReplacement === 0) {
        alert('Не удалось определить цену для выбранных параметров');
        return;
    }
    
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    let totalCost = 0;
    let tenderPositions = [];
    
    months.forEach(month => {
        const qtyInput = document.getElementById(`${month}-qty`);
        const changesInput = document.getElementById(`${month}-changes`);
        
        const qty = qtyInput ? parseInt(qtyInput.value) || 0 : 0;
        const changes = changesInput ? parseInt(changesInput.value) || 0 : 0;
        
        if (qty > 0 && changes > 0) {
            const cost = pricePerReplacement * qty * changes;
            totalCost += cost;
            
            tenderPositions.push({
                month,
                size,
                quantity: qty,
                changes,
                cost
            });
        }
    });
    
    if (tenderPositions.length === 0) {
        alert('Пожалуйста, укажите данные хотя бы для одного месяца');
        return;
    }
    
    displayTenderResults(tenderPositions, totalCost, region, size, pricePerReplacement);
}

// ============ НАЧАЛО ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ ТЕНДЕРА ============
function displayTenderResults(tenderPositions, totalCost, region, size, pricePerReplacement) {
    const tenderResultDiv = document.getElementById('tender-result');
    const tenderPositionsContainer = document.getElementById('tenderPositions');
    const tenderTotalValue = document.getElementById('tenderTotalValue');
    
    if (!tenderResultDiv || !tenderPositionsContainer) return;
    
    let html = `
        <div class="result-item">
            <div class="result-label">Регион</div>
            <div class="result-value">${region}</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Размер ковра</div>
            <div class="result-value">${size.replace('*', '×')}</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Цена за замену</div>
            <div class="result-value">${formatPrice(pricePerReplacement)}</div>
        </div>
        
        <div style="margin-top: 20px;">
            <h4 style="color: white; margin-bottom: 10px;">Детализация по месяцам:</h4>
    `;
    
    tenderPositions.forEach(position => {
        html += `
            <div class="result-item" style="margin-bottom: 8px;">
                <div class="result-label">${position.month}</div>
                <div class="result-value">${position.quantity} ковров × ${position.changes} замен = ${formatPrice(position.cost)}</div>
            </div>
        `;
    });
    
    tenderPositionsContainer.innerHTML = html;
    
    if (tenderTotalValue) {
        tenderTotalValue.textContent = formatPrice(totalCost);
    }
    
    tenderResultDiv.style.display = 'block';
    
    // Сохраняем данные тендера
    window.tenderCalculation = {
        positions: tenderPositions,
        totalCost,
        region,
        size,
        pricePerReplacement
    };
    
    // Прокручиваем к результатам
    tenderResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ НАЧАЛО СОЗДАНИЯ ПОЛНОГО СООБЩЕНИЯ ДЛЯ TELEGRAM ============
function createCalculatorTelegramMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
    
    message += `📊 Количество позиций: ${calc.positionCount}\n`;
    message += `🔄 Всего замен в месяц: ${calc.totalReplacements}\n`;
    message += `💰 Общая стоимость в месяц: ${formatPrice(calc.totalMonthlyCost)}\n\n`;
    
    message += `📄 Состав заказа:\n`;
    calc.positions.forEach((position, index) => {
        message += `${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   ${position.frequency} (${position.replacements} замен/мес)\n`;
        message += `   Стоимость: ${formatPrice(position.monthlyCost)}/мес\n\n`;
    });
    
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
        
        if (message.length > 3500) {
            alert('Сообщение слишком длинное. Telegram не пропускает такие длинные сообщения.\n\nПожалуйста, напишите нам в Telegram напрямую: @+79770005127\n\nМы произведем расчет за вас и пришлем готовый результат.');
            return;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        
        console.log('📤 Расчет калькулятора отправлен в Telegram');
        
        setTimeout(() => {
            alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\nМы свяжемся с вами в течение 15 минут.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
    }
}

// ============ НАЧАЛО ОТПРАВКИ ТЕНДЕРА В TELEGRAM ============
function sendTenderToTelegram() {
    if (!window.tenderCalculation) {
        alert('Сначала выполните расчет тендера');
        return;
    }
    
    try {
        const calc = window.tenderCalculation;
        
        let message = `📋 ТЕНДЕРНЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
        
        message += `📍 Регион: ${calc.region}\n`;
        message += `📏 Размер ковра: ${calc.size.replace('*', '×')}\n`;
        message += `💰 Цена за замену: ${formatPrice(calc.pricePerReplacement)}\n`;
        message += `💰 Общая стоимость: ${formatPrice(calc.totalCost)}\n\n`;
        
        message += `📅 Детализация по месяцам:\n`;
        calc.positions.forEach(position => {
            message += `• ${position.month}: ${position.quantity} ковров × ${position.changes} замен = ${formatPrice(position.cost)}\n`;
        });
        
        message += `\n📞 Связь:\n`;
        message += `Telegram: t.me/+79770005127\n`;
        message += `Email: matservice@yandex.ru\n`;
        message += `Сайт: arenda-kovrov-mirum.ru`;
        
        if (message.length > 3500) {
            message = `📋 ТЕНДЕРНЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
            message += `📍 Регион: ${calc.region}\n`;
            message += `📏 Размер ковра: ${calc.size.replace('*', '×')}\n`;
            message += `💰 Общая стоимость: ${formatPrice(calc.totalCost)}\n\n`;
            message += `📞 Связь: t.me/+79770005127`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        
        setTimeout(() => {
            alert('Telegram открыт! Нажмите "Отправить" чтобы отправить тендерный расчет.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки тендера в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
    }
}

// ============ НАЧАЛО СОЗДАНИЯ СООБЩЕНИЯ ДЛЯ EMAIL ============
function createCalculatorEmailMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    
    let message = `Расчет аренды ковров МИРУМ\n\n`;
    
    message += `Количество позиций: ${calc.positionCount}\n`;
    message += `Всего замен в месяц: ${calc.totalReplacements}\n`;
    message += `Общая стоимость в месяц: ${calc.totalMonthlyCost.toLocaleString('ru-RU')} руб.\n\n`;
    
    message += `Состав заказа:\n`;
    calc.positions.forEach((position, index) => {
        message += `${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   ${position.frequency} (${position.replacements} замен/мес)\n`;
        message += `   Стоимость: ${position.monthlyCost.toLocaleString('ru-RU')} руб./мес\n\n`;
    });
    
    message += `Для заключения договора понадобятся:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Подписант (ФИО, основание полномочий)\n`;
    message += `• Точный адрес объекта и название, вывеска\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
    
    message += `Счет выставляется только за фактические замены.\n`;
    message += `Возможно включить НДС 22% — цена увеличится на ставку налога.\n\n`;
    
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
        const subject = encodeURIComponent(`Расчет аренды ковров МИРУМ - ${positions.length} позиций`);
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
    addPosition: addPosition,
    removePosition: removePosition,
    calculateTender: calculateTender,
    sendToTelegram: sendCalculatorToTelegram,
    sendTenderToTelegram: sendTenderToTelegram,
    sendToEmail: sendCalculatorToEmail
};

// Экспортируем функции для удаления позиций
window.removePosition = removePosition;

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