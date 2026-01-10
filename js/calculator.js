// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 9.0 (Упрощенный интерфейс с реальным расчетом)
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let positions = [];
let currentCalculation = null;
let priceDataLoaded = false;

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация упрощенного калькулятора...');
    
    const calculatorSection = document.querySelector('.calculator-section, .calculator-form, #calculator-form');
    if (!calculatorSection) {
        console.log('⚠️ Калькулятор не найден на этой странице');
        return;
    }
    
    console.log('✅ Страница калькулятора обнаружена');
    
    // Ждем загрузки DOM
    setTimeout(() => {
        initInterface();
        checkPriceData();
        setupEventHandlers();
        initRealTimeCalculation();
        
        console.log('✅ Калькулятор успешно инициализирован');
    }, 100);
}

// ============ НАЧАЛО ИНИЦИАЛИЗАЦИИ РАСЧЕТА В РЕАЛЬНОМ ВРЕМЕНИ ============
function initRealTimeCalculation() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const quantityInput = document.getElementById('quantity');
    
    if (!regionSelect || !sizeSelect || !frequencySelect || !quantityInput) return;
    
    const calculateRealTime = () => {
        const region = regionSelect.value;
        const size = sizeSelect.value;
        const frequency = frequencySelect.value;
        const quantity = parseInt(quantityInput.value) || 1;
        
        if (region && size && frequency && quantity > 0) {
            const pricePerReplacement = getPriceForPosition(region, size, frequency);
            const replacementsPerMonth = getReplacementsCount(frequency);
            const monthlyCost = pricePerReplacement * replacementsPerMonth * quantity;
            
            // Сразу показываем результат для текущей позиции
            updateSinglePositionResult(region, size, frequency, quantity, pricePerReplacement, monthlyCost);
        } else {
            hideSinglePositionResult();
        }
    };
    
    regionSelect.addEventListener('change', calculateRealTime);
    sizeSelect.addEventListener('change', calculateRealTime);
    frequencySelect.addEventListener('change', calculateRealTime);
    quantityInput.addEventListener('input', calculateRealTime);
    
    createSinglePositionResult();
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ РЕЗУЛЬТАТА ДЛЯ ОДНОЙ ПОЗИЦИИ ============
function updateSinglePositionResult(region, size, frequency, quantity, pricePerReplacement, monthlyCost) {
    const resultDiv = document.getElementById('singlePositionResult');
    if (!resultDiv) return;
    
    const replacements = getReplacementsCount(frequency);
    const costPer4Weeks = pricePerReplacement * 4 * quantity; // Стоимость за 4 недели
    
    resultDiv.innerHTML = `
        <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #16a085;">
            <h4 style="margin: 0 0 15px 0; color: #2c3e50;">
                <i class="fas fa-calculator"></i> Расчет для текущей позиции
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div><strong>Регион:</strong></div>
                <div>${region}</div>
                
                <div><strong>Размер:</strong></div>
                <div>${size.replace('*', '×')}</div>
                
                <div><strong>Частота замен:</strong></div>
                <div>${frequency}</div>
                
                <div><strong>Количество:</strong></div>
                <div>${quantity} шт.</div>
                
                <div><strong>Цена за замену:</strong></div>
                <div>${formatPrice(pricePerReplacement)}</div>
                
                <div><strong>Стоимость за 4 недели:</strong></div>
                <div style="color: #e74c3c; font-weight: 700;">${formatPrice(costPer4Weeks)}</div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p style="margin: 0 0 10px 0; font-size: 0.9rem; color: #666;">
                    <i class="fas fa-check-circle" style="color: #16a085;"></i> 
                    В стоимость входит: аренда ковра, чистка/сушка, доставка
                </p>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="addCurrentPosition()" style="flex: 1; background: #3498db; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-plus"></i> Добавить эту позицию
                    </button>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

// ============ НАЧАЛО ДОБАВЛЕНИЯ ТЕКУЩЕЙ ПОЗИЦИИ ============
function addCurrentPosition() {
    const region = document.getElementById('region').value;
    const size = document.getElementById('size').value;
    const frequency = document.getElementById('frequency').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (!region || !size || !frequency) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    const pricePerReplacement = getPriceForPosition(region, size, frequency);
    
    if (pricePerReplacement === 0) {
        alert('Не удалось определить цену для выбранных параметров');
        return;
    }
    
    const replacements = getReplacementsCount(frequency);
    const monthlyCost = pricePerReplacement * replacements * quantity;
    const costPer4Weeks = pricePerReplacement * 4 * quantity;
    
    const position = {
        id: Date.now() + Math.random(),
        region,
        size,
        frequency,
        quantity,
        pricePerReplacement,
        monthlyCost,
        costPer4Weeks,
        replacements
    };
    
    positions.push(position);
    updatePositionsList();
    updateTotalResult();
    
    // Сбрасываем поля для новой позиции
    document.getElementById('quantity').value = 1;
    hideSinglePositionResult();
    
    // Прокручиваем к списку позиций
    const positionsList = document.getElementById('positionsList');
    if (positionsList) {
        positionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ СПИСКА ПОЗИЦИЙ ============
function updatePositionsList() {
    const positionsContainer = document.getElementById('positionsContainer');
    if (!positionsContainer) return;
    
    if (positions.length === 0) {
        positionsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Позиции не добавлены</p>';
        return;
    }
    
    let html = '';
    
    positions.forEach((position, index) => {
        html += `
            <div class="position-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #3498db; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">
                            ${position.size.replace('*', '×')} × ${position.quantity} шт.
                        </div>
                        <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">
                            ${position.frequency}
                        </div>
                        <div style="font-size: 0.9rem; color: #27ae60;">
                            <strong>Цена за замену:</strong> ${formatPrice(position.pricePerReplacement)}
                        </div>
                        <div style="font-size: 0.9rem; color: #c0392b; margin-top: 5px;">
                            <strong>Стоимость за 4 недели:</strong> ${formatPrice(position.costPer4Weeks)}
                        </div>
                        <div style="font-size: 0.85rem; color: #7f8c8d; margin-top: 5px;">
                            <i class="fas fa-map-marker-alt"></i> ${position.region}
                        </div>
                    </div>
                    <button onclick="removePosition(${index})" style="background: #e74c3c; color: white; border: none; width: 40px; height: 40px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    positionsContainer.innerHTML = html;
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ ИТОГОВОГО РЕЗУЛЬТАТА ============
function updateTotalResult() {
    const totalResult = document.getElementById('totalResult');
    if (!totalResult) return;
    
    if (positions.length === 0) {
        totalResult.style.display = 'none';
        return;
    }
    
    let totalCost4Weeks = 0;
    let allSameRegion = true;
    const firstRegion = positions[0].region;
    
    positions.forEach(position => {
        totalCost4Weeks += position.costPer4Weeks;
        if (position.region !== firstRegion) {
            allSameRegion = false;
        }
    });
    
    let regionDisplay = allSameRegion ? firstRegion : 'Разные регионы';
    
    totalResult.innerHTML = `
        <div style="background: #16a085; color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h4 style="margin: 0 0 15px 0; color: white;">
                <i class="fas fa-receipt"></i> ИТОГОВЫЙ РАСЧЕТ
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div><strong>Регион:</strong></div>
                <div>${regionDisplay}</div>
                
                <div><strong>Количество позиций:</strong></div>
                <div>${positions.length}</div>
                
                <div><strong>Общая стоимость за 4 недели:</strong></div>
                <div style="font-size: 1.5rem; font-weight: 700;">${formatPrice(totalCost4Weeks)}</div>
            </div>
            
            <p style="margin: 10px 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                <i class="fas fa-check-circle"></i> В стоимость входит: аренда ковра, чистка/сушка, доставка
            </p>
        </div>
        
        <div class="results-actions" style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <button class="btn btn-telegram" id="sendToTelegram" style="background: #0088cc; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fab fa-telegram"></i> Отправить в Telegram
            </button>
            <button class="btn btn-primary" id="sendToEmail" style="background: #16a085; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-envelope"></i> Отправить на Email
            </button>
        </div>
    `;
    
    totalResult.style.display = 'block';
    
    // Обновляем обработчики кнопок
    document.getElementById('sendToTelegram').addEventListener('click', sendToTelegram);
    document.getElementById('sendToEmail').addEventListener('click', sendToEmail);
}

// ============ НАЧАЛО УДАЛЕНИЯ ПОЗИЦИИ ============
function removePosition(index) {
    if (index >= 0 && index < positions.length) {
        positions.splice(index, 1);
        updatePositionsList();
        updateTotalResult();
        
        if (positions.length === 0) {
            const positionsList = document.getElementById('positionsList');
            if (positionsList) {
                positionsList.style.display = 'none';
            }
        }
    }
}

// ============ НАЧАЛО СОЗДАНИЯ БЛОКА РЕЗУЛЬТАТА ДЛЯ ОДНОЙ ПОЗИЦИИ ============
function createSinglePositionResult() {
    const form = document.querySelector('.calculator-form');
    if (!form) return;
    
    const resultDiv = document.createElement('div');
    resultDiv.id = 'singlePositionResult';
    resultDiv.style.cssText = `
        display: none;
        margin-top: 20px;
        transition: all 0.3s ease;
    `;
    
    const addPositionBtn = document.getElementById('addPositionBtn');
    if (addPositionBtn) {
        form.insertBefore(resultDiv, addPositionBtn);
    } else {
        form.appendChild(resultDiv);
    }
}

// ============ НАЧАЛО СКРЫТИЯ РЕЗУЛЬТАТА ДЛЯ ОДНОЙ ПОЗИЦИИ ============
function hideSinglePositionResult() {
    const resultDiv = document.getElementById('singlePositionResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// ============ НАЧАЛО ИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА ============
function initInterface() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const totalResult = document.getElementById('totalResult');
    
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
    
    // Устанавливаем значение по умолчанию для количества
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && !quantityInput.value) {
        quantityInput.value = 1;
    }
    
    // Скрываем итоговый результат
    if (totalResult) {
        totalResult.style.display = 'none';
    }
    
    // Очищаем позиции
    positions = [];
    updatePositionsList();
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

// ============ НАЧАЛО НАСТРОЙКИ ОБРАБОТЧИКОВ СОБЫТИЙ ============
function setupEventHandlers() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const addPositionBtn = document.getElementById('addPositionBtn');
    
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            handleRegionChange(this.value);
        });
    }
    
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            handleSizeChange(regionSelect ? regionSelect.value : '', this.value);
        });
    }
    
    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addCurrentPosition();
        });
    }
    
    // Обработчики для тендерного калькулятора
    const tenderRegionSelect = document.getElementById('tender-region');
    const calculateTenderBtn = document.getElementById('calculateTenderBtn');
    const sendTenderToTelegramBtn = document.getElementById('sendTenderToTelegram');
    
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
    
    if (!sizeSelect || !frequencySelect) return;
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        hideSinglePositionResult();
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
    
    hideSinglePositionResult();
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РЕГИОНА ДЛЯ ТЕНДЕРА ============
function handleTenderRegionChange(region) {
    const tenderSizeSelect = document.getElementById('tender-size');
    
    if (!tenderSizeSelect) return;
    
    if (!region) {
        tenderSizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        tenderSizeSelect.disabled = true;
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
}

// ============ НАЧАЛО ОБРАБОТКИ ВЫБОРА РАЗМЕРА ============
function handleSizeChange(region, size) {
    const frequencySelect = document.getElementById('frequency');
    
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

// ============ НАЧАЛО ОТПРАВКИ В TELEGRAM ============
function sendToTelegram() {
    if (positions.length === 0) {
        alert('Сначала добавьте хотя бы одну позицию');
        return;
    }
    
    try {
        const message = createTelegramMessage();
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        
        setTimeout(() => {
            alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\nМы свяжемся с вами в течение 15 минут.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
    }
}

// ============ НАЧАЛО СОЗДАНИЯ СООБЩЕНИЯ ДЛЯ TELEGRAM ============
function createTelegramMessage() {
    let totalCost4Weeks = 0;
    let allSameRegion = true;
    const firstRegion = positions[0].region;
    
    positions.forEach(position => {
        totalCost4Weeks += position.costPer4Weeks;
        if (position.region !== firstRegion) {
            allSameRegion = false;
        }
    });
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
    
    if (allSameRegion) {
        message += `📍 Регион: ${firstRegion}\n`;
    }
    
    message += `💰 Общая стоимость за 4 недели: ${formatPrice(totalCost4Weeks)}\n\n`;
    
    message += `📄 Состав заказа:\n`;
    positions.forEach((position, index) => {
        if (!allSameRegion) {
            message += `\n📍 Регион: ${position.region}\n`;
        }
        message += `${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   ${position.frequency}\n`;
        message += `   Цена за одну замену: ${formatPrice(position.pricePerReplacement)}\n`;
        message += `   Стоимость за 4 недели: ${formatPrice(position.costPer4Weeks)}\n`;
    });
    
    message += `\n📋 В стоимость входит:\n`;
    message += `• Аренда ковра\n`;
    message += `• Чистка/сушка\n`;
    message += `• Доставка\n\n`;
    
    message += `📞 Связь:\n`;
    message += `Telegram: t.me/+79770005127\n`;
    message += `Email: matservice@yandex.ru\n`;
    message += `Сайт: arenda-kovrov-mirum.ru`;
    
    return message;
}

// ============ НАЧАЛО ОТПРАВКИ НА EMAIL ============
function sendToEmail() {
    if (positions.length === 0) {
        alert('Сначала добавьте хотя бы одну позицию');
        return;
    }
    
    try {
        let totalCost4Weeks = 0;
        let allSameRegion = true;
        const firstRegion = positions[0].region;
        
        positions.forEach(position => {
            totalCost4Weeks += position.costPer4Weeks;
            if (position.region !== firstRegion) {
                allSameRegion = false;
            }
        });
        
        let subject = 'Расчет аренды ковров МИРУМ';
        if (allSameRegion) {
            subject += ` - ${firstRegion}`;
        }
        
        let body = 'Расчет аренды ковров МИРУМ\n\n';
        
        if (allSameRegion) {
            body += `Регион: ${firstRegion}\n`;
        }
        
        body += `Общая стоимость за 4 недели: ${totalCost4Weeks.toLocaleString('ru-RU')} руб.\n\n`;
        
        body += `Состав заказа:\n\n`;
        positions.forEach((position, index) => {
            if (!allSameRegion) {
                body += `Регион: ${position.region}\n`;
            }
            body += `${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
            body += `   ${position.frequency}\n`;
            body += `   Цена за одну замену: ${position.pricePerReplacement.toLocaleString('ru-RU')} руб.\n`;
            body += `   Стоимость за 4 недели: ${position.costPer4Weeks.toLocaleString('ru-RU')} руб.\n\n`;
        });
        
        body += `В стоимость входит:\n`;
        body += `• Аренда ковра\n`;
        body += `• Чистка/сушка\n`;
        body += `• Доставка\n\n`;
        
        body += `Телефон: +7 (977) 000-51-27\n`;
        body += `Email: matservice@yandex.ru\n`;
        body += `Сайт: https://arenda-kovrov-mirum.ru`;
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const emailUrl = `mailto:matservice@yandex.ru?subject=${encodedSubject}&body=${encodedBody}`;
        
        window.open(emailUrl, '_blank');
        
        setTimeout(() => {
            alert('Почтовый клиент открыт! Нажмите "Отправить" чтобы отправить расчет.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки на Email:', error);
        alert('Произошла ошибка. Пожалуйста, отправьте email на matservice@yandex.ru');
    }
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
    
    window.tenderCalculation = {
        positions: tenderPositions,
        totalCost,
        region,
        size,
        pricePerReplacement
    };
    
    tenderResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
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

// ============ НАЧАЛО ЭКСПОРТА ФУНКЦИЙ ============
window.Calculator = {
    init: initCalculator,
    addPosition: addCurrentPosition,
    removePosition: removePosition,
    calculateTender: calculateTender,
    sendToTelegram: sendToTelegram,
    sendTenderToTelegram: sendTenderToTelegram,
    sendToEmail: sendToEmail
};

window.removePosition = removePosition;

// ============ НАЧАЛО АВТОМАТИЧЕСКОЙ ИНИЦИАЛИЗАЦИИ ============
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