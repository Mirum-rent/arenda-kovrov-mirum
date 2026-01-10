// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 8.1 (07.01.2026) - РЕАЛЬНОЕ ВРЕМЯ РАСЧЕТА + РЕГИОН В ТГ
// ============================================

// ============ НАЧАЛО ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ ============
let currentCalculation = null;
let priceDataLoaded = false;
let isSendingToTelegram = false;
let positions = []; // Массив для хранения позиций
let tenderPositions = []; // Массив для тендерных позиций

// ============ НАЧАЛО ОСНОВНОЙ ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора (реальное время расчета)...');
    
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
        
        // Инициализируем расчет в реальном времени
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
    
    // События для расчета в реальном времени
    const calculateRealTime = () => {
        const region = regionSelect.value;
        const size = sizeSelect.value;
        const frequency = frequencySelect.value;
        const quantity = parseInt(quantityInput.value) || 1;
        
        if (region && size && frequency && quantity > 0) {
            const pricePerReplacement = getPriceForPosition(region, size, frequency);
            const replacements = getReplacementsCount(frequency);
            const monthlyCost = pricePerReplacement * replacements * quantity;
            
            // Обновляем превью расчета
            updateCalculationPreview(region, size, frequency, quantity, pricePerReplacement, monthlyCost);
        } else {
            hideCalculationPreview();
        }
    };
    
    // Вешаем обработчики на все поля
    regionSelect.addEventListener('change', calculateRealTime);
    sizeSelect.addEventListener('change', calculateRealTime);
    frequencySelect.addEventListener('change', calculateRealTime);
    quantityInput.addEventListener('input', calculateRealTime);
    
    // Создаем элемент для превью расчета
    createCalculationPreview();
}

// ============ НАЧАЛО СОЗДАНИЯ ПРЕВЬЮ РАСЧЕТА ============
function createCalculationPreview() {
    const form = document.querySelector('.calculator-form');
    if (!form) return;
    
    const previewDiv = document.createElement('div');
    previewDiv.id = 'calculationPreview';
    previewDiv.style.cssText = `
        background: linear-gradient(135deg, #e8f4fd 0%, #d4e7fa 100%);
        padding: 20px;
        border-radius: 12px;
        margin-top: 20px;
        border-left: 4px solid #3498db;
        display: none;
        transition: all 0.3s ease;
    `;
    
    previewDiv.innerHTML = `
        <h4 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 1.1rem;">
            <i class="fas fa-eye"></i> Предварительный расчет
        </h4>
        <div id="previewContent" style="font-size: 0.95rem;">
            <!-- Контент будет обновляться -->
        </div>
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button id="addFromPreview" style="flex: 1; background: #3498db; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-plus"></i> Добавить эту позицию
            </button>
            <button id="clearPreview" style="background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; width: 40px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Вставляем после формы или перед кнопками
    const addPositionBtn = document.getElementById('addPositionBtn');
    if (addPositionBtn) {
        form.insertBefore(previewDiv, addPositionBtn);
    } else {
        form.appendChild(previewDiv);
    }
    
    // Обработчики кнопок превью
    document.getElementById('addFromPreview').addEventListener('click', function() {
        addPositionFromPreview();
    });
    
    document.getElementById('clearPreview').addEventListener('click', function() {
        hideCalculationPreview();
    });
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ ПРЕВЬЮ РАСЧЕТА ============
function updateCalculationPreview(region, size, frequency, quantity, pricePerReplacement, monthlyCost) {
    const previewDiv = document.getElementById('calculationPreview');
    const previewContent = document.getElementById('previewContent');
    
    if (!previewDiv || !previewContent) return;
    
    const replacements = getReplacementsCount(frequency);
    
    previewContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div><strong>Регион:</strong></div>
            <div>${region}</div>
            
            <div><strong>Размер:</strong></div>
            <div>${size.replace('*', '×')}</div>
            
            <div><strong>Частота:</strong></div>
            <div>${frequency}</div>
            
            <div><strong>Количество:</strong></div>
            <div>${quantity} шт.</div>
        </div>
        
        <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 10px;">
            <div style="color: #2c3e50; font-weight: 600; margin-bottom: 5px;">Расчет:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9rem;">
                <div>Цена за замену:</div>
                <div><strong>${formatPrice(pricePerReplacement)}</strong></div>
                
                <div>Замен в месяц:</div>
                <div>${replacements}</div>
                
                <div>Стоимость в месяц:</div>
                <div style="color: #e74c3c; font-weight: 700; font-size: 1.1rem;">
                    ${formatPrice(monthlyCost)}
                </div>
            </div>
        </div>
    `;
    
    previewDiv.style.display = 'block';
    
    // Анимация появления
    setTimeout(() => {
        previewDiv.style.opacity = '1';
        previewDiv.style.transform = 'translateY(0)';
    }, 10);
}

// ============ НАЧАЛО СКРЫТИЯ ПРЕВЬЮ ============
function hideCalculationPreview() {
    const previewDiv = document.getElementById('calculationPreview');
    if (previewDiv) {
        previewDiv.style.opacity = '0';
        previewDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            previewDiv.style.display = 'none';
        }, 300);
    }
    
    // Очищаем поля
    document.getElementById('quantity').value = 1;
}

// ============ НАЧАЛО ДОБАВЛЕНИЯ ПОЗИЦИИ ИЗ ПРЕВЬЮ ============
function addPositionFromPreview() {
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
    
    // Скрываем превью
    hideCalculationPreview();
    
    // Прокручиваем к списку позиций
    if (positionsList) {
        positionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Обновляем общий расчет
    updateTotalCalculation();
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ ОБЩЕГО РАСЧЕТА ============
function updateTotalCalculation() {
    if (positions.length === 0) {
        // Скрываем итоговый блок
        const positionsList = document.getElementById('positionsList');
        if (positionsList) {
            positionsList.style.display = 'none';
        }
        return;
    }
    
    let totalMonthlyCost = 0;
    let totalReplacements = 0;
    let totalPositions = positions.length;
    
    positions.forEach(position => {
        totalMonthlyCost += position.monthlyCost;
        totalReplacements += position.replacements * position.quantity;
    });
    
    // Сохраняем расчет для отправки
    currentCalculation = {
        positions: positions,
        totalMonthlyCost,
        totalReplacements,
        totalPositions
    };
    
    // Обновляем итоговый блок в списке позиций
    updateTotalInPositionsList(totalMonthlyCost);
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ ИТОГА В СПИСКЕ ПОЗИЦИЙ ============
function updateTotalInPositionsList(totalMonthlyCost) {
    const totalElement = document.getElementById('positionsTotal');
    if (!totalElement) {
        // Создаем элемент если его нет
        const positionsContainer = document.getElementById('positionsContainer');
        if (positionsContainer) {
            const totalDiv = document.createElement('div');
            totalDiv.id = 'positionsTotal';
            totalDiv.style.cssText = `
                background: #16a085;
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
            `;
            positionsContainer.appendChild(totalDiv);
        }
    }
    
    const totalElementNow = document.getElementById('positionsTotal');
    if (totalElementNow) {
        totalElementNow.innerHTML = `
            <div>Общая стоимость в месяц: ${formatPrice(totalMonthlyCost)}</div>
            <div style="font-size: 14px; font-weight: normal; margin-top: 5px;">
                ${positions.length} позиции, ${currentCalculation.totalReplacements} замен в месяц
            </div>
        `;
    }
}

// ============ НАЧАЛО ОБНОВЛЕНИЯ СПИСКА ПОЗИЦИЙ ============
function updatePositionsList() {
    const positionsContainer = document.getElementById('positionsContainer');
    if (!positionsContainer) return;
    
    if (positions.length === 0) {
        positionsContainer.innerHTML = '<p style="text-align: center; color: #666;">Позиции не добавлены</p>';
        
        // Удаляем итоговый блок если он есть
        const totalElement = document.getElementById('positionsTotal');
        if (totalElement) {
            totalElement.remove();
        }
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
                            ${position.frequency} (${position.replacements} замен/мес)
                        </div>
                        <div style="font-size: 0.9rem; color: #27ae60;">
                            <strong>Цена за замену:</strong> ${formatPrice(position.pricePerReplacement)}
                        </div>
                        <div style="font-size: 0.9rem; color: #c0392b; margin-top: 5px;">
                            <strong>Стоимость в месяц:</strong> ${formatPrice(position.monthlyCost)}
                        </div>
                        <div style="font-size: 0.85rem; color: #7f8c8d; margin-top: 5px;">
                            <i class="fas fa-map-marker-alt"></i> ${position.region}
                        </div>
                    </div>
                    <button onclick="removePosition(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.3s ease; min-width: 30px; min-height: 30px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    positionsContainer.innerHTML = html;
    
    // Обновляем общий расчет
    updateTotalCalculation();
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
        
        // Скрываем результаты если они были показаны
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
    }
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
    
    // Обработчик кнопки добавления позиции (старая кнопка)
    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addPositionFromPreview();
        });
    }
    
    // Обработчик кнопки расчета (показ итогов)
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showFinalResults();
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

// ============ НАЧАЛО ПОКАЗА ФИНАЛЬНЫХ РЕЗУЛЬТАТОВ ============
function showFinalResults() {
    if (positions.length === 0) {
        alert('Пожалуйста, добавьте хотя бы одну позицию');
        return;
    }
    
    const resultsDiv = document.getElementById('results');
    const resultDetails = document.getElementById('resultDetails');
    
    if (!resultsDiv || !resultDetails) return;
    
    let html = `
        <div class="result-item">
            <div class="result-label">Общий регион</div>
            <div class="result-value">${getCommonRegion()}</div>
            <div class="result-hint">Основной регион расчета</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Количество позиций</div>
            <div class="result-value">${currentCalculation.totalPositions} шт.</div>
        </div>
        
        <div class="result-item">
            <div class="result-label">Всего замен в месяц</div>
            <div class="result-value">${currentCalculation.totalReplacements}</div>
        </div>
        
        <div class="result-item" style="background: rgba(52, 152, 219, 0.2);">
            <div class="result-label">Общая стоимость в месяц</div>
            <div class="result-value">${formatPrice(currentCalculation.totalMonthlyCost)}</div>
        </div>
        
        <div style="margin-top: 20px;">
            <h4 style="color: white; margin-bottom: 10px;">Состав заказа:</h4>
    `;
    
    currentCalculation.positions.forEach((position, index) => {
        html += `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 6px; margin-bottom: 8px; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span><strong>${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт.</strong></span>
                    <span style="color: #1abc9c;">${formatPrice(position.monthlyCost)}/мес</span>
                </div>
                <div style="color: #bdc3c7; font-size: 0.85rem;">
                    <div>${position.frequency} (${position.replacements} замен/мес)</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${position.region} | Цена за замену: ${formatPrice(position.pricePerReplacement)}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    resultDetails.innerHTML = html;
    resultsDiv.style.display = 'block';
    
    // Прокручиваем к результатам
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ НАЧАЛО ОПРЕДЕЛЕНИЯ ОБЩЕГО РЕГИОНА ============
function getCommonRegion() {
    if (positions.length === 0) return 'Не указан';
    
    // Проверяем, все ли позиции в одном регионе
    const firstRegion = positions[0].region;
    const allSameRegion = positions.every(pos => pos.region === firstRegion);
    
    if (allSameRegion) {
        return firstRegion;
    } else {
        // Если регионы разные, показываем "Разные регионы"
        return 'Разные регионы';
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
    const commonRegion = getCommonRegion();
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
    
    message += `📍 Регион: ${commonRegion}\n`;
    message += `📊 Количество позиций: ${calc.totalPositions}\n`;
    message += `🔄 Всего замен в месяц: ${calc.totalReplacements}\n`;
    message += `💰 Общая стоимость в месяц: ${formatPrice(calc.totalMonthlyCost)}\n\n`;
    
    message += `📄 Детализация заказа:\n`;
    calc.positions.forEach((position, index) => {
        message += `\n${index + 1}. ${position.region} - ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   ${position.frequency} (${position.replacements} замен/мес)\n`;
        message += `   Цена за одну замену: ${formatPrice(position.pricePerReplacement)}\n`;
        message += `   Стоимость: ${formatPrice(position.monthlyCost)}/мес\n`;
    });
    
    message += `\n📋 ИТОГО: ${formatPrice(calc.totalMonthlyCost)} в месяц\n\n`;
    
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
            // Создаем укороченную версию
            const shortMessage = createShortTelegramMessage();
            const encodedMessage = encodeURIComponent(shortMessage);
            const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
            
            window.open(telegramUrl, '_blank');
        } else {
            const encodedMessage = encodeURIComponent(message);
            const telegramUrl = `https://t.me/+79770005127?text=${encodedMessage}`;
            
            window.open(telegramUrl, '_blank');
        }
        
        console.log('📤 Расчет калькулятора отправлен в Telegram');
        
        setTimeout(() => {
            alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\nМы свяжемся с вами в течение 15 минут.');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
    }
}

// ============ НАЧАЛО СОЗДАНИЯ КОРОТКОГО СООБЩЕНИЯ ДЛЯ TELEGRAM ============
function createShortTelegramMessage() {
    if (!currentCalculation) return '';
    
    const calc = currentCalculation;
    const commonRegion = getCommonRegion();
    
    let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n\n`;
    
    message += `📍 Регион: ${commonRegion}\n`;
    message += `📊 Позиций: ${calc.totalPositions}\n`;
    message += `💰 ИТОГО: ${formatPrice(calc.totalMonthlyCost)}/мес\n\n`;
    
    message += `📄 Позиции:\n`;
    calc.positions.forEach((position, index) => {
        if (index < 5) { // Ограничиваем количество позиций для краткости
            message += `${index + 1}. ${position.size.replace('*', '×')} × ${position.quantity} шт. = ${formatPrice(position.monthlyCost)}/мес\n`;
        }
    });
    
    if (calc.totalPositions > 5) {
        message += `... и еще ${calc.totalPositions - 5} позиций\n`;
    }
    
    message += `\n📞 Связь: t.me/+79770005127`;
    
    return message;
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
            message += `📏 Размер: ${calc.size.replace('*', '×')}\n`;
            message += `💰 ИТОГО: ${formatPrice(calc.totalCost)}\n\n`;
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
    const commonRegion = getCommonRegion();
    
    let message = `Расчет аренды ковров МИРУМ\n\n`;
    
    message += `Регион: ${commonRegion}\n`;
    message += `Количество позиций: ${calc.totalPositions}\n`;
    message += `Всего замен в месяц: ${calc.totalReplacements}\n`;
    message += `Общая стоимость в месяц: ${calc.totalMonthlyCost.toLocaleString('ru-RU')} руб.\n\n`;
    
    message += `Детализация заказа:\n\n`;
    calc.positions.forEach((position, index) => {
        message += `${index + 1}. ${position.region} - ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   ${position.frequency} (${position.replacements} замен в месяц)\n`;
        message += `   Цена за одну замену: ${position.pricePerReplacement.toLocaleString('ru-RU')} руб.\n`;
        message += `   Стоимость в месяц: ${position.monthlyCost.toLocaleString('ru-RU')} руб.\n\n`;
    });
    
    message += `ИТОГО: ${calc.totalMonthlyCost.toLocaleString('ru-RU')} руб. в месяц\n\n`;
    
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
        const subject = encodeURIComponent(`Расчет аренды ковров МИРУМ - ${getCommonRegion()} - ${positions.length} позиций`);
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
    calculate: showFinalResults,
    addPosition: addPositionFromPreview,
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