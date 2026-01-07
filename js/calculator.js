// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 7.2 (07.01.2026) - С исправленной загрузкой регионов
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let currentCalculation = null;
let priceDataLoaded = false;

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора...');
    
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
            console.log('✅ База цен загружена:', Object.keys(window.priceData).length, 'регионов');
            populateRegions();
        } else if (typeof window.PriceUtils !== 'undefined') {
            priceDataLoaded = true;
            clearInterval(checkInterval);
            console.log('✅ PriceUtils загружен');
            populateRegions();
        }
    }, 100);
    
    // Таймаут через 3 секунды
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
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    
    // Проверяем наличие необходимых элементов
    if (!regionSelect) {
        console.error('❌ Элемент #region не найден');
        // Попробуем найти альтернативные селекторы
        const altRegionSelect = document.querySelector('select[name="region"], select[data-role="region"]');
        if (altRegionSelect) {
            altRegionSelect.id = 'region';
            console.log('✅ Найден альтернативный элемент region');
        }
    }
    
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
    if (!regionSelect) {
        console.error('❌ Элемент #region не найден для заполнения');
        return;
    }
    
    let regions = [];
    
    // 1. Пробуем использовать PriceUtils
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        try {
            regions = window.PriceUtils.getRegions();
            console.log('📊 Используем PriceUtils.getRegions():', regions.length, 'регионов');
        } catch (error) {
            console.error('Ошибка в PriceUtils.getRegions():', error);
        }
    }
    
    // 2. Если PriceUtils не сработал, используем window.priceData
    if (regions.length === 0 && typeof window.priceData !== 'undefined') {
        try {
            regions = Object.keys(window.priceData);
            console.log('📊 Используем window.priceData:', regions.length, 'регионов');
        } catch (error) {
            console.error('Ошибка в window.priceData:', error);
        }
    }
    
    // 3. Если оба метода не сработали, используем резервный список
    if (regions.length === 0) {
        console.warn('⚠️ Используем резервный список регионов');
        regions = getFallbackRegions();
    }
    
    // Сортируем регионы
    regions.sort();
    
    // Очищаем список
    regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    
    // Добавляем регионы в выпадающий список
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
    
    console.log(`✅ Загружено ${regions.length} регионов`);
    console.log('📋 Регионы:', regions);
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
    
    console.log(`✅ Загружено ${fallbackRegions.length} регионов из резервного списка`);
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
    const frequencySelect = document.getElementById('frequency');
    const calculateBtn = document.getElementById('calculateBtn');
    const sendToTelegramBtn = document.getElementById('sendToTelegram');
    const sendToEmailBtn = document.getElementById('sendToEmail');
    
    // Обработчик выбора региона
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            console.log('🌍 Выбран регион:', this.value);
            handleRegionChange(this.value);
        });
        
        // Также добавим обработчик для мобильных
        regionSelect.addEventListener('click', function() {
            console.log('Клик по региону');
        });
    } else {
        console.error('❌ Элемент #region не найден для установки обработчика');
    }
    
    // Обработчик выбора размера
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            console.log('📏 Выбран размер:', this.value);
            handleSizeChange(regionSelect ? regionSelect.value : '', this.value);
        });
    }
    
    // Обработчик кнопки расчета
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🧮 Нажата кнопка расчета');
            performCalculation();
        });
        
        // Добавим обработчик для Enter в форме
        const calculatorForm = document.querySelector('.calculator-form, #calculator-form, form');
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('📝 Отправка формы калькулятора');
                performCalculation();
            });
        }
    } else {
        console.error('❌ Кнопка #calculateBtn не найдена');
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
            console.log('📦 Изменено количество:', this.value);
            // Если уже был расчет, пересчитываем
            if (currentCalculation) {
                performCalculation();
            }
        });
        
        quantityInput.addEventListener('input', function() {
            // Валидация в реальном времени
            if (this.value < 1) {
                this.value = 1;
            } else if (this.value > 100) {
                this.value = 100;
            }
        });
    }
    
    // Дебаунс для изменения селектов
    let debounceTimer;
    [regionSelect, sizeSelect, frequencySelect].forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (regionSelect.value && sizeSelect.value && frequencySelect.value) {
                        console.log('Все поля заполнены, можно рассчитывать');
                    }
                }, 300);
            });
        }
    });
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РЕГИОНА ============
function handleRegionChange(region) {
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const resultsDiv = document.getElementById('results');
    
    if (!sizeSelect || !frequencySelect) {
        console.error('❌ Элементы #size или #frequency не найдены');
        return;
    }
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        
        // Скрываем результаты
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
        return;
    }
    
    console.log('🔄 Обработка региона:', region);
    
    // Получаем доступные размеры для региона
    let sizes = [];
    
    // 1. Пробуем использовать PriceUtils
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getSizesForRegion === 'function') {
        try {
            sizes = window.PriceUtils.getSizesForRegion(region);
            console.log('📏 Используем PriceUtils.getSizesForRegion():', sizes.length, 'размеров');
        } catch (error) {
            console.error('Ошибка в PriceUtils.getSizesForRegion():', error);
        }
    }
    
    // 2. Если PriceUtils не сработал, используем window.priceData
    if (sizes.length === 0 && window.priceData && window.priceData[region]) {
        try {
            sizes = Object.keys(window.priceData[region]);
            console.log('📏 Используем window.priceData[region]:', sizes.length, 'размеров');
        } catch (error) {
            console.error('Ошибка в window.priceData[region]:', error);
        }
    }
    
    // 3. Если оба метода не сработали, используем резервные размеры
    if (sizes.length === 0) {
        console.warn('⚠️ Используем резервные размеры для региона:', region);
        sizes = getFallbackSizes();
    }
    
    // Сортируем размеры
    sizes.sort();
    
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
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    console.log(`✅ Загружено ${sizes.length} размеров для региона ${region}`);
}

// ============ НАЧАЛО РЕЗЕРВНЫХ РАЗМЕРОВ ============
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
    
    if (!frequencySelect) {
        console.error('❌ Элемент #frequency не найден');
        return;
    }
    
    if (!region || !size) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    console.log('🔄 Обработка размера:', size, 'для региона:', region);
    
    // Получаем доступные частоты для размера
    let frequencies = [];
    
    // 1. Пробуем использовать PriceUtils
    if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getFrequenciesForSize === 'function') {
        try {
            frequencies = window.PriceUtils.getFrequenciesForSize(region, size);
            console.log('🔄 Используем PriceUtils.getFrequenciesForSize():', frequencies.length, 'частот');
        } catch (error) {
            console.error('Ошибка в PriceUtils.getFrequenciesForSize():', error);
        }
    }
    
    // 2. Если PriceUtils не сработал, используем window.priceData
    if (frequencies.length === 0 && window.priceData && window.priceData[region] && window.priceData[region][size]) {
        try {
            frequencies = Object.keys(window.priceData[region][size]);
            console.log('🔄 Используем window.priceData[region][size]:', frequencies.length, 'частот');
        } catch (error) {
            console.error('Ошибка в window.priceData[region][size]:', error);
        }
    }
    
    // 3. Если оба метода не сработали, используем резервные частоты
    if (frequencies.length === 0) {
        console.warn('⚠️ Используем резервные частоты для размера:', size);
        frequencies = getFallbackFrequencies();
    }
    
    // Сортируем частоты
    frequencies.sort();
    
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
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    console.log(`✅ Загружено ${frequencies.length} частот для размера ${size}`);
}

// ============ НАЧАЛО РЕЗЕРВНЫХ ЧАСТОТ ============
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
    
    console.log('🧮 Начало расчета:', { region, size, frequency, quantity });
    
    // Проверяем заполнение полей
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля калькулятора');
        
        // Подсвечиваем незаполненные поля
        if (!region) {
            const regionSelect = document.getElementById('region');
            if (regionSelect) {
                regionSelect.style.borderColor = 'red';
                setTimeout(() => regionSelect.style.borderColor = '', 2000);
            }
        }
        if (!size) {
            const sizeSelect = document.getElementById('size');
            if (sizeSelect) {
                sizeSelect.style.borderColor = 'red';
                setTimeout(() => sizeSelect.style.borderColor = '', 2000);
            }
        }
        if (!frequency) {
            const frequencySelect = document.getElementById('frequency');
            if (frequencySelect) {
                frequencySelect.style.borderColor = 'red';
                setTimeout(() => frequencySelect.style.borderColor = '', 2000);
            }
        }
        
        return;
    }
    
    // Проверяем количество
    if (quantity < 1 || quantity > 100) {
        alert('Пожалуйста, укажите количество от 1 до 100');
        if (document.getElementById('quantity')) {
            document.getElementById('quantity').value = Math.min(Math.max(quantity, 1), 100);
        }
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
    
    console.log('💰 Расчет цены для:', { region, size, frequency, quantity });
    
    // 1. Пробуем использовать PriceUtils
    if (typeof window.PriceUtils !== 'undefined') {
        if (typeof window.PriceUtils.getPrice === 'function') {
            pricePerReplacement = window.PriceUtils.getPrice(region, size, frequency);
            console.log('💰 PriceUtils.getPrice():', pricePerReplacement);
        }
        
        if (typeof window.PriceUtils.calculateMonthlyCost === 'function') {
            monthlyCost = window.PriceUtils.calculateMonthlyCost(region, size, frequency, quantity);
            console.log('💰 PriceUtils.calculateMonthlyCost():', monthlyCost);
        } else {
            // Резервный расчет
            monthlyCost = calculateMonthlyCostManual(pricePerReplacement, frequency, quantity);
        }
    } else {
        // 2. Если PriceUtils не доступен, используем window.priceData
        if (window.priceData && window.priceData[region] && 
            window.priceData[region][size] && 
            window.priceData[region][size][frequency]) {
            pricePerReplacement = window.priceData[region][size][frequency];
            console.log('💰 Из window.priceData:', pricePerReplacement);
        }
        
        monthlyCost = calculateMonthlyCostManual(pricePerReplacement, frequency, quantity);
    }
    
    // 3. Если цена все еще 0, используем резервные цены
    if (pricePerReplacement === 0) {
        console.warn('⚠️ Цена не найдена, используем резервную цену');
        pricePerReplacement = getFallbackPrice(size);
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

// ============ НАЧАЛО РЕЗЕРВНЫХ ЦЕН ============
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
    
    if (!resultsDiv || !resultDetails) {
        console.error('❌ Элементы #results или #resultDetails не найдены');
        return;
    }
    
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
    
    console.log('✅ Результаты отображены');
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
    
    // Определяем количество замен в месяц
    let replacementsPerMonth = 4;
    if (calc.frequency.includes('1 раз в две недели')) replacementsPerMonth = 2;
    else if (calc.frequency.includes('2 раза в неделю')) replacementsPerMonth = 8;
    else if (calc.frequency.includes('3 раза в неделю')) replacementsPerMonth = 12;
    else if (calc.frequency.includes('4 раза в неделю')) replacementsPerMonth = 16;
    else if (calc.frequency.includes('5 раз в неделю')) replacementsPerMonth = 20;
    else if (calc.frequency.includes('6 раз в неделю')) replacementsPerMonth = 24;
    else if (calc.frequency.includes('7 раз в неделю')) replacementsPerMonth = 28;
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ 🧮\n\n`;
    
    message += `📍 Регион: ${calc.region}\n`;
    message += `📏 Размер ковра: ${calc.size}\n`;
    message += `🔄 Частота замены: ${calc.frequency}\n`;
    message += `📦 Количество: ${calc.quantity} шт.\n\n`;
    
    message += `💰 Цена за замену: ${calc.formattedPrice}\n`;
    message += `📊 Стоимость в месяц: ${calc.formattedMonthly}\n`;
    message += `📈 Количество замен в месяц: ${replacementsPerMonth}\n\n`;
    
    message += `📄 Для заключения договора понадобятся:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Кто подписывает договор от имени компании и на основании чего действует\n`;
    message += `• Точный адрес и название организации, вывеска (если есть)\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо ФИО и тел с кем может связаться курьер и кто будет принимать ковры\n\n`;
    
    message += `Счет за обслуживание всегда выставляется только за то количество замен, которые фактически были осуществлены. Если количество замен было меньше или больше - счет соразмерно будет скорректирован\n\n`;
    
    message += `Что входит в стоимость аренды:\n\n`;
    message += `- Бесплатная доставка - привозим чистые ковры прямо к вам\n`;
    message += `- Установка и замена - наши курьеры установят и заберут грязные ковры\n`;
    message += `- Профессиональная чистка - все ковры проходят санитарную обработку\n`;
    message += `- Замена при износе - бесплатно меняем изношенные ковры на новые\n`;
    message += `- Все документы - договор, акты, счета для бухгалтерии\n`;
    message += `- Гибкий график - подстроимся под ваш режим работы\n\n`;
    
    message += `ВНИМАНИЕ! Если нужно, можем включить в счет НДС со ставкой 22%. В этом случае цена будет увеличена на ставку НДС.\n\n`;
    
    message += `📞 Для заказа или уточнения деталей:\n\n`;
    message += `• Telegram: https://t.me/+79770005127\n`;
    message += `• Email: matservice@yandex.ru\n`;
    message += `• Сайт: https://arenda-kovrov-mirum.ru\n\n`;
    
    message += `⏰ Расчет выполнен: ${new Date().toLocaleString('ru-RU')}\n`;
    message += `🌐 Страница: Калькулятор аренды ковров`;
    
    // Проверяем длину сообщения (Telegram имеет ограничение ~4096 символов)
    if (message.length > 4000) {
        // Сокращаем сообщение, если оно слишком длинное
        message = message.substring(0, 3900) + "\n\n[Сообщение было сокращено из-за ограничения длины]";
    }
    
    return message;
}

// ============ НАЧАЛО ДЕБАГ ФУНКЦИЙ ============
function debugCalculator() {
    console.log('🔧 Отладка калькулятора:');
    console.log('1. Проверка элементов:');
    console.log('- #region:', document.getElementById('region') ? 'Найден' : 'Не найден');
    console.log('- #size:', document.getElementById('size') ? 'Найден' : 'Не найден');
    console.log('- #frequency:', document.getElementById('frequency') ? 'Найден' : 'Не найден');
    console.log('- #quantity:', document.getElementById('quantity') ? 'Найден' : 'Не найден');
    console.log('- #calculateBtn:', document.getElementById('calculateBtn') ? 'Найден' : 'Не найден');
    console.log('- #results:', document.getElementById('results') ? 'Найден' : 'Не найден');
    
    console.log('2. Проверка данных:');
    console.log('- window.priceData:', typeof window.priceData !== 'undefined' ? 'Загружен' : 'Не загружен');
    console.log('- window.PriceUtils:', typeof window.PriceUtils !== 'undefined' ? 'Загружен' : 'Не загружен');
    
    if (typeof window.priceData !== 'undefined') {
        console.log('- Количество регионов:', Object.keys(window.priceData).length);
        console.log('- Регионы:', Object.keys(window.priceData));
    }
    
    console.log('3. Текущий расчет:', currentCalculation);
}

// ============ НАЧАЛО ЭКСПОРТА ФУНКЦИЙ ============
// Делаем функции доступными глобально
window.initCalculator = initCalculator;
window.performCalculation = performCalculation;
window.sendToTelegram = sendToTelegram;
window.sendToEmail = sendToEmail;
window.debugCalculator = debugCalculator;

// ============ НАЧАЛО АВТОМАТИЧЕСКОЙ ИНИЦИАЛИЗАЦИИ ============
// Автоматически инициализируем калькулятор при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, проверяем наличие калькулятора...');
    
    // Проверяем наличие калькулятора разными способами
    const hasCalculatorSection = document.querySelector('.calculator-section');
    const hasCalculatorForm = document.querySelector('.calculator-form, #calculator-form');
    const hasRegionSelect = document.getElementById('region');
    
    if (hasCalculatorSection || hasCalculatorForm || hasRegionSelect) {
        console.log('🔍 Калькулятор обнаружен, запускаем инициализацию...');
        
        // Небольшая задержка для загрузки других скриптов
        setTimeout(() => {
            initCalculator();
            
            // Добавляем кнопку отладки в режиме разработки
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                const debugBtn = document.createElement('button');
                debugBtn.textContent = '🔧 Debug';
                debugBtn.style.cssText = 'position:fixed; bottom:10px; right:10px; z-index:9999; padding:5px 10px; background:#f39c12; color:white; border:none; border-radius:3px; cursor:pointer;';
                debugBtn.onclick = debugCalculator;
                document.body.appendChild(debugBtn);
            }
        }, 500);
    } else {
        console.log('⚠️ Калькулятор не найден на этой странице');
    }
});

// Также инициализируем при полной загрузке страницы
window.addEventListener('load', function() {
    console.log('🚀 Страница полностью загружена');
    
    // Двойная проверка для надежности
    setTimeout(() => {
        if (document.getElementById('region') && !priceDataLoaded) {
            console.log('🔄 Повторная проверка инициализации калькулятора');
            initCalculator();
        }
    }, 1000);
});

// ============ КОНЕЦ CALCULATOR.JS ============