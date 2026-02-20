// ============================================
// CALCULATOR.JS - ПОЛНЫЙ КАЛЬКУЛЯТОР АРЕНДЫ КОВРОВ
// Версия: 16.0 (20.02.2026) - ВОССТАНОВЛЕННЫЙ ФУНКЦИОНАЛ
// ============================================

(function() {
    'use strict';
    
    console.log('🧮 calculator.js загружен, версия 16.0 (полный функционал)');
    
    // ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
    let positions = [];
    let includeVAT = false;
    const VAT_RATE = 0.22;
    let shouldAutoAdd = true;
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', function() {
        // Проверяем наличие калькулятора на странице
        if (!document.querySelector('.calculator-section') && 
            !document.getElementById('region') && 
            !document.getElementById('calculatorForm')) {
            return;
        }
        
        console.log('🧮 Инициализация полного калькулятора...');
        
        // Ждем загрузки priceData
        const checkPriceData = setInterval(function() {
            if (window.priceData || window.PriceUtils) {
                clearInterval(checkPriceData);
                initCalculator();
                console.log('✅ Калькулятор успешно инициализирован');
            }
        }, 100);
        
        // Таймаут на случай ошибки
        setTimeout(function() {
            clearInterval(checkPriceData);
            if (!window.priceData && !window.PriceUtils) {
                console.warn('⚠️ База цен не загружена, использую резервные данные');
                initCalculator();
            }
        }, 3000);
    });
    
    // ============ ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ============
    function initCalculator() {
        initInterface();
        setupEventHandlers();
        setupAddPositionButton();
        restoreSavedState();
    }
    
    // ============ ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ ============
    function restoreSavedState() {
        // Восстанавливаем последний выбранный регион из localStorage
        const savedRegion = localStorage.getItem('lastSelectedRegion');
        if (savedRegion) {
            const regionSelect = document.getElementById('region');
            if (regionSelect) {
                regionSelect.value = savedRegion;
                handleRegionChange(savedRegion);
            }
        }
        
        // Восстанавливаем состояние НДС
        const savedVAT = localStorage.getItem('includeVAT');
        if (savedVAT === 'true') {
            includeVAT = true;
            const vatToggle = document.getElementById('vatToggle');
            if (vatToggle) vatToggle.checked = true;
        }
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
    function initInterface() {
        const regionSelect = document.getElementById('region');
        const sizeSelect = document.getElementById('size');
        const frequencySelect = document.getElementById('frequency');
        const quantityInput = document.getElementById('quantity');
        const vatToggle = document.getElementById('vatToggle');
        
        // Заполняем регионы
        populateRegions();
        
        // Сбрасываем остальные поля
        if (sizeSelect) {
            sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
            sizeSelect.disabled = true;
        }
        
        if (frequencySelect) {
            frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
            frequencySelect.disabled = true;
        }
        
        if (quantityInput && !quantityInput.value) {
            quantityInput.value = 1;
        }
        
        // Обработчик переключателя НДС
        if (vatToggle) {
            vatToggle.addEventListener('change', function() {
                includeVAT = this.checked;
                localStorage.setItem('includeVAT', includeVAT);
                updatePositionsList();
                updateTotalResult();
                showToast(`НДС ${includeVAT ? 'включен' : 'отключен'}`, 'info');
            });
        }
        
        // Очищаем позиции
        positions = [];
        shouldAutoAdd = true;
        updatePositionsList();
        hideTotalResult();
        
        // Инициализируем тендерный калькулятор
        initTenderMonths();
    }
    
    // ============ ЗАПОЛНЕНИЕ РЕГИОНОВ ============
    function populateRegions() {
        const regionSelect = document.getElementById('region');
        const tenderRegionSelect = document.getElementById('tender-region');
        
        if (!regionSelect && !tenderRegionSelect) return;
        
        let regions = [];
        
        // Получаем регионы из PriceUtils
        if (window.PriceUtils && typeof window.PriceUtils.getRegions === 'function') {
            regions = window.PriceUtils.getRegions();
        } 
        // Fallback на priceData
        else if (window.priceData) {
            regions = Object.keys(window.priceData).sort();
        }
        // Резервные регионы
        else {
            regions = getFallbackRegions();
        }
        
        // Заполняем обычный селект
        if (regionSelect) {
            regionSelect.innerHTML = '<option value="">Выберите регион</option>';
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
            console.log(`✅ Загружено ${regions.length} регионов`);
        }
        
        // Заполняем тендерный селект
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
    
    // ============ РЕЗЕРВНЫЕ РЕГИОНЫ ============
    function getFallbackRegions() {
        return [
            "Москва",
            "Московская область",
            "Санкт-Петербург",
            "Ленинградская область",
            "Астрахань",
            "Воронеж",
            "Екатеринбург",
            "Казань",
            "Краснодар",
            "Нижний Новгород",
            "Новосибирск",
            "Пермь",
            "Ростов-на-Дону",
            "Самара",
            "Саратов",
            "Тюмень",
            "Уфа",
            "Челябинск"
        ];
    }
    
    // ============ РЕЗЕРВНЫЕ РАЗМЕРЫ ============
    function getFallbackSizes() {
        return [
            "85×60",
            "85×150",
            "115×200",
            "115×400",
            "150×240",
            "150×300",
            "115×180",
            "115×240",
            "150×250",
            "60×90",
            "90×150",
            "120×180",
            "120×250",
            "115×300",
            "85×300",
            "150×600"
        ];
    }
    
    // ============ РЕЗЕРВНЫЕ ПЕРИОДИЧНОСТИ ============
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
    
    // ============ НАСТРОЙКА ОБРАБОТЧИКОВ ============
    function setupEventHandlers() {
        const regionSelect = document.getElementById('region');
        const sizeSelect = document.getElementById('size');
        const frequencySelect = document.getElementById('frequency');
        const quantityInput = document.getElementById('quantity');
        const tenderRegion = document.getElementById('tender-region');
        const tenderSize = document.getElementById('tender-size');
        const calculateTenderBtn = document.getElementById('calculateTenderBtn');
        const sendTenderBtn = document.getElementById('sendTenderToTelegram');
        const sendToTelegramBtn = document.getElementById('sendToTelegram');
        const sendToEmailBtn = document.getElementById('sendToEmail');
        
        // Обработчик региона
        if (regionSelect) {
            regionSelect.addEventListener('change', function() {
                localStorage.setItem('lastSelectedRegion', this.value);
                handleRegionChange(this.value);
            });
        }
        
        // Обработчик размера
        if (sizeSelect) {
            sizeSelect.addEventListener('change', function() {
                const region = regionSelect.value;
                handleSizeChange(region, this.value);
            });
        }
        
        // Обработчик периодичности
        if (frequencySelect) {
            frequencySelect.addEventListener('change', function() {
                if (shouldAutoAdd) {
                    checkAndAddPosition();
                }
            });
        }
        
        // Обработчик количества
        if (quantityInput) {
            quantityInput.addEventListener('input', function() {
                if (shouldAutoAdd) {
                    checkAndAddPosition();
                }
            });
        }
        
        // Обработчик тендерного региона
        if (tenderRegion) {
            tenderRegion.addEventListener('change', function() {
                handleTenderRegionChange(this.value);
            });
        }
        
        // Обработчик расчета тендера
        if (calculateTenderBtn) {
            calculateTenderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                calculateTender();
            });
        }
        
        // Обработчик отправки тендера
        if (sendTenderBtn) {
            sendTenderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sendTenderToTelegram();
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
    }
    
    // ============ ОБРАБОТКА РЕГИОНА ============
    function handleRegionChange(region) {
        const sizeSelect = document.getElementById('size');
        const frequencySelect = document.getElementById('frequency');
        
        if (!sizeSelect || !frequencySelect) return;
        
        if (!region) {
            sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
            sizeSelect.disabled = true;
            frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
            frequencySelect.disabled = true;
            return;
        }
        
        let sizes = [];
        
        // Получаем размеры через PriceUtils
        if (window.PriceUtils && typeof window.PriceUtils.getSizes === 'function') {
            sizes = window.PriceUtils.getSizes(region);
        }
        // Fallback на priceData
        else if (window.priceData && window.priceData[region]) {
            sizes = Object.keys(window.priceData[region]).sort();
        }
        // Резервные размеры
        else {
            sizes = getFallbackSizes();
        }
        
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
    }
    
    // ============ ОБРАБОТКА РАЗМЕРА ============
    function handleSizeChange(region, size) {
        const frequencySelect = document.getElementById('frequency');
        
        if (!frequencySelect) return;
        
        if (!region || !size) {
            frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
            frequencySelect.disabled = true;
            return;
        }
        
        let frequencies = [];
        
        // Получаем периодичность через PriceUtils
        if (window.PriceUtils && typeof window.PriceUtils.getFrequencies === 'function') {
            frequencies = window.PriceUtils.getFrequencies(region, size);
        }
        // Fallback на priceData
        else if (window.priceData && window.priceData[region] && window.priceData[region][size]) {
            frequencies = Object.keys(window.priceData[region][size]).sort();
        }
        // Резервные периодичности
        else {
            frequencies = getFallbackFrequencies();
        }
        
        frequencySelect.innerHTML = '<option value="">Выберите периодичность замены</option>';
        frequencies.forEach(freq => {
            const option = document.createElement('option');
            option.value = freq;
            option.textContent = freq;
            frequencySelect.appendChild(option);
        });
        
        frequencySelect.disabled = false;
    }
    
    // ============ ОБРАБОТКА ТЕНДЕРНОГО РЕГИОНА ============
    function handleTenderRegionChange(region) {
        const sizeSelect = document.getElementById('tender-size');
        
        if (!sizeSelect) return;
        
        if (!region) {
            sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
            sizeSelect.disabled = true;
            return;
        }
        
        let sizes = [];
        
        if (window.PriceUtils && typeof window.PriceUtils.getSizes === 'function') {
            sizes = window.PriceUtils.getSizes(region);
        } else if (window.priceData && window.priceData[region]) {
            sizes = Object.keys(window.priceData[region]).sort();
        } else {
            sizes = getFallbackSizes();
        }
        
        sizeSelect.innerHTML = '<option value="">Выберите размер ковра</option>';
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
        
        sizeSelect.disabled = false;
    }
    
    // ============ ПОЛУЧЕНИЕ ЦЕНЫ ============
    function getPriceForPosition(region, size, frequency) {
        // 1. Используем PriceUtils
        if (window.PriceUtils && typeof window.PriceUtils.getPrice === 'function') {
            const price = window.PriceUtils.getPrice(region, size, frequency);
            if (price > 0) return price;
        }
        
        // 2. Проверяем priceData напрямую
        if (window.priceData && window.priceData[region] && 
            window.priceData[region][size] && 
            window.priceData[region][size][frequency]) {
            return window.priceData[region][size][frequency];
        }
        
        // 3. Резервная цена
        return getFallbackPrice(size);
    }
    
    // ============ РЕЗЕРВНАЯ ЦЕНА ============
    function getFallbackPrice(size) {
        const basePrices = {
            "85×60": 500,
            "85×150": 800,
            "115×200": 1200,
            "115×400": 2200,
            "150×240": 1500,
            "150×300": 2000,
            "115×180": 1100,
            "115×240": 1400,
            "150×250": 1800,
            "60×90": 400,
            "90×150": 700,
            "120×180": 1300,
            "120×250": 1700,
            "115×300": 1600,
            "85×300": 1200,
            "150×600": 4000
        };
        
        // Нормализуем размер (заменяем * на × если нужно)
        const normalizedSize = size.replace('*', '×');
        return basePrices[normalizedSize] || 1000;
    }
    
    // ============ РАСЧЕТ КОЛИЧЕСТВА ЗАМЕН В МЕСЯЦ ============
    function getReplacementsPerMonth(frequency) {
        const replacements = {
            "1 раз в две недели": 2,
            "1 раз в неделю": 4,
            "2 раза в неделю": 8,
            "3 раза в неделю": 12,
            "4 раза в неделю": 16,
            "5 раз в неделю": 20,
            "6 раз в неделю": 24,
            "7 раз в неделю": 28
        };
        
        return replacements[frequency] || 4;
    }
    
    // ============ РАСЧЕТ СТОИМОСТИ ЗА 4 НЕДЕЛИ ============
    function calculateCostPer4Weeks(pricePerReplacement, quantity, frequency) {
        const replacementsCount = getReplacementsPerMonth(frequency);
        return pricePerReplacement * replacementsCount * quantity;
    }
    
    // ============ ЦЕНА С УЧЕТОМ НДС ============
    function getPriceWithVAT(price) {
        return includeVAT ? price * (1 + VAT_RATE) : price;
    }
    
    // ============ ПРОВЕРКА И ДОБАВЛЕНИЕ ПОЗИЦИИ ============
    function checkAndAddPosition() {
        if (!shouldAutoAdd) return;
        
        const region = document.getElementById('region')?.value;
        const size = document.getElementById('size')?.value;
        const frequency = document.getElementById('frequency')?.value;
        const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
        
        if (region && size && frequency && quantity > 0) {
            addPosition(region, size, frequency, quantity);
        }
    }
    
    // ============ ДОБАВЛЕНИЕ ПОЗИЦИИ ============
    function addPosition(region, size, frequency, quantity) {
        const pricePerReplacement = getPriceForPosition(region, size, frequency);
        
        if (pricePerReplacement === 0) {
            showToast('Не удалось определить цену для выбранных параметров', 'error');
            return;
        }
        
        // Проверяем, есть ли уже такая позиция
        const existingIndex = positions.findIndex(pos => 
            pos.region === region && 
            pos.size === size && 
            pos.frequency === frequency
        );
        
        const costPer4Weeks = calculateCostPer4Weeks(pricePerReplacement, quantity, frequency);
        
        if (existingIndex >= 0) {
            // Обновляем существующую
            positions[existingIndex].quantity = quantity;
            positions[existingIndex].pricePerReplacement = pricePerReplacement;
            positions[existingIndex].costPer4Weeks = costPer4Weeks;
            showToast('Позиция обновлена', 'success');
        } else {
            // Добавляем новую
            const position = {
                id: Date.now() + Math.random(),
                region,
                size,
                frequency,
                quantity,
                pricePerReplacement,
                costPer4Weeks
            };
            
            positions.push(position);
            showToast('Позиция добавлена в расчет', 'success');
        }
        
        updatePositionsList();
        updateTotalResult();
    }
    
    // ============ НАСТРОЙКА КНОПКИ ДОБАВЛЕНИЯ ============
    function setupAddPositionButton() {
        let addBtn = document.getElementById('addPositionBtn');
        
        if (!addBtn) {
            const container = document.querySelector('.calculator-actions');
            if (!container) return;
            
            addBtn = document.createElement('button');
            addBtn.id = 'addPositionBtn';
            addBtn.className = 'btn btn-primary';
            addBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Добавить позицию в расчет';
            container.insertBefore(addBtn, container.firstChild);
        }
        
        addBtn.addEventListener('click', function() {
            shouldAutoAdd = false;
            
            const region = document.getElementById('region')?.value;
            const size = document.getElementById('size')?.value;
            const frequency = document.getElementById('frequency')?.value;
            const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
            
            if (!region || !size || !frequency) {
                showToast('Заполните все поля формы', 'error');
                shouldAutoAdd = true;
                return;
            }
            
            addPosition(region, size, frequency, quantity);
            
            // Сбрасываем поля для новой позиции
            document.getElementById('size').value = '';
            document.getElementById('frequency').innerHTML = '<option value="">Сначала выберите размер</option>';
            document.getElementById('frequency').disabled = true;
            
            shouldAutoAdd = true;
        });
    }
    
    // ============ ОБНОВЛЕНИЕ СПИСКА ПОЗИЦИЙ ============
    function updatePositionsList() {
        const container = document.getElementById('positionsContainer');
        const list = document.getElementById('positionsList');
        
        if (!container || !list) return;
        
        if (positions.length === 0) {
            list.style.display = 'none';
            return;
        }
        
        let html = '';
        positions.forEach((pos, index) => {
            const priceWithVAT = getPriceWithVAT(pos.pricePerReplacement);
            const costWithVAT = getPriceWithVAT(pos.costPer4Weeks);
            
            html += `
                <div class="position-item" data-index="${index}">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <span style="background: #16a085; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px;">${index + 1}</span>
                                <strong>${pos.size} × ${pos.quantity} шт.</strong>
                            </div>
                            <div style="font-size: 0.9rem; color: #666; margin-bottom: 3px; padding-left: 34px;">
                                <i class="fas fa-map-marker-alt" style="color: #16a085; margin-right: 5px;"></i>${pos.region}
                            </div>
                            <div style="font-size: 0.9rem; color: #666; margin-bottom: 3px; padding-left: 34px;">
                                <i class="fas fa-sync-alt" style="color: #16a085; margin-right: 5px;"></i>${pos.frequency}
                            </div>
                            <div style="font-size: 0.9rem; color: #16a085; padding-left: 34px;">
                                <strong>${formatPrice(priceWithVAT)}</strong> за замену
                            </div>
                            <div style="font-size: 0.9rem; color: #e74c3c; padding-left: 34px; margin-top: 5px;">
                                <strong>${formatPrice(costWithVAT)}</strong> в месяц
                            </div>
                        </div>
                        <button class="remove-position" onclick="Calculator.removePosition(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        list.style.display = 'block';
    }
    
    // ============ УДАЛЕНИЕ ПОЗИЦИИ ============
    window.removePosition = function(index) {
        positions.splice(index, 1);
        updatePositionsList();
        updateTotalResult();
        showToast('Позиция удалена', 'info');
    };
    
    // ============ ОБНОВЛЕНИЕ ИТОГОВ ============
    function updateTotalResult() {
        const totalBlock = document.getElementById('totalBlock');
        if (!totalBlock) return;
        
        if (positions.length === 0) {
            totalBlock.style.display = 'none';
            return;
        }
        
        let totalWithoutVAT = positions.reduce((sum, pos) => sum + pos.costPer4Weeks, 0);
        let totalWithVAT = totalWithoutVAT * (1 + VAT_RATE);
        
        document.getElementById('totalWithoutVAT').textContent = formatPrice(totalWithoutVAT);
        document.getElementById('totalWithVAT').textContent = formatPrice(totalWithVAT);
        
        const vatRow = document.getElementById('withVATRow');
        const vatToggle = document.getElementById('vatToggle');
        
        if (vatToggle && vatRow) {
            vatRow.style.display = vatToggle.checked ? 'flex' : 'none';
        }
        
        totalBlock.style.display = 'block';
    }
    
    // ============ СКРЫТИЕ ИТОГОВ ============
    function hideTotalResult() {
        const totalBlock = document.getElementById('totalBlock');
        if (totalBlock) totalBlock.style.display = 'none';
    }
    
    // ============ ФОРМАТИРОВАНИЕ ЦЕНЫ ============
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
    
    // ============ ПОКАЗ УВЕДОМЛЕНИЯ ============
    function showToast(message, type = 'info') {
        // Удаляем предыдущее уведомление
        const existingToast = document.querySelector('.calculator-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'calculator-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ============ ПРОВЕРКА СОГЛАСИЯ ============
    function checkConsent() {
        const consentCheckbox = document.getElementById('calcConsent');
        if (!consentCheckbox || !consentCheckbox.checked) {
            showToast('Необходимо дать согласие на обработку персональных данных', 'error');
            return false;
        }
        return true;
    }
    
    // ============ СОЗДАНИЕ СООБЩЕНИЯ ДЛЯ ОТПРАВКИ ============
    function createTelegramMessage() {
        let totalWithoutVAT = positions.reduce((sum, pos) => sum + pos.costPer4Weeks, 0);
        let totalWithVAT = totalWithoutVAT * (1 + VAT_RATE);
        
        let message = `🧮 РАСЧЕТ АРЕНДЫ КОВРОВ МИРУМ\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        positions.forEach((pos, index) => {
            const priceWithVAT = getPriceWithVAT(pos.pricePerReplacement);
            const costWithVAT = getPriceWithVAT(pos.costPer4Weeks);
            
            message += `${index + 1}. ${pos.size} × ${pos.quantity} шт.\n`;
            message += `   📍 ${pos.region}\n`;
            message += `   🔄 ${pos.frequency}\n`;
            message += `   💰 Цена за замену: ${formatPrice(priceWithVAT)}\n`;
            message += `   📊 Стоимость в месяц: ${formatPrice(costWithVAT)}\n\n`;
        });
        
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💰 ИТОГО: ${formatPrice(totalWithVAT)} (в месяц)\n`;
        
        if (!includeVAT) {
            message += `   (без НДС: ${formatPrice(totalWithoutVAT)})\n`;
            message += `   (с НДС 22%: ${formatPrice(totalWithVAT)})\n`;
        } else {
            message += `   (включая НДС 22%)\n`;
        }
        
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📄 ДЛЯ ЗАКЛЮЧЕНИЯ ДОГОВОРА:\n`;
        message += `• Реквизиты компании\n`;
        message += `• Подписант (ФИО, основание)\n`;
        message += `• Адрес объекта\n`;
        message += `• Режим работы\n`;
        message += `• Контактное лицо\n\n`;
        
        message += `⚡ Договор заключаем в день обращения\n`;
        message += `📄 Работаем по ЭДО (Диадок, СБИС)\n`;
        message += `💳 Оплата: безналичный расчет или карта\n\n`;
        
        message += `📞 Telegram: @+79770005127\n`;
        message += `📧 Email: matservice@yandex.ru\n`;
        message += `🌐 Сайт: arenda-kovrov-mirum.ru`;
        
        return message;
    }
    
    // ============ ОТПРАВКА В TELEGRAM ============
    function sendToTelegram() {
        if (positions.length === 0) {
            showToast('Добавьте хотя бы одну позицию', 'error');
            return;
        }
        
        if (!checkConsent()) return;
        
        const message = createTelegramMessage();
        
        try {
            // Пытаемся скопировать в буфер обмена
            const textarea = document.createElement('textarea');
            textarea.value = message;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                window.open('https://t.me/+79770005127', '_blank');
                
                setTimeout(() => {
                    showToast('✅ Текст расчета скопирован! Вставьте его в Telegram (Ctrl+V)', 'success');
                    
                    // Показываем подробную инструкцию
                    showConsentModal('Текст расчета скопирован!', message);
                }, 500);
            } else {
                // Fallback - открываем с текстом в URL
                const encoded = encodeURIComponent(message);
                window.open(`https://t.me/+79770005127?text=${encoded}`, '_blank');
                
                setTimeout(() => {
                    showToast('Telegram открыт! Проверьте сообщение', 'success');
                }, 500);
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            showConsentModal('Ошибка отправки', message);
        }
    }
    
    // ============ ОТПРАВКА НА EMAIL ============
    function sendToEmail() {
        if (positions.length === 0) {
            showToast('Добавьте хотя бы одну позицию', 'error');
            return;
        }
        
        if (!checkConsent()) return;
        
        const message = createTelegramMessage();
        const subject = encodeURIComponent('Расчет аренды ковров МИРУМ');
        const body = encodeURIComponent(message);
        
        window.open(`mailto:matservice@yandex.ru?subject=${subject}&body=${body}`, '_blank');
        
        setTimeout(() => {
            showToast('Почтовый клиент открыт! Проверьте письмо', 'success');
        }, 500);
    }
    
    // ============ ПОКАЗ МОДАЛЬНОГО ОКНА С СОГЛАСИЕМ ============
    function showConsentModal(title, message) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 500px; width: 100%;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">${title}</h3>
                <p style="color: #666; margin-bottom: 20px;">Текст расчета скопирован в буфер обмена. Вы можете отправить его вручную.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
                    <pre style="font-size: 12px; white-space: pre-wrap;">${message}</pre>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="color: #666; font-size: 0.9rem;">Нажимая "Отправить", вы подтверждаете свое согласие с <a href="/privacy-policy.html" target="_blank" style="color: #16a085;">политикой обработки персональных данных</a></p>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="this.closest('.modal').remove()" style="flex: 1; padding: 12px; background: #16a085; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ МЕСЯЦЕВ ДЛЯ ТЕНДЕРА ============
    function initTenderMonths() {
        const container = document.getElementById('monthInputs');
        if (!container) return;
        
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        let html = '';
        months.forEach(month => {
            html += `
                <div class="month-box">
                    <label>${month}</label>
                    <input type="number" class="tender-qty" data-month="${month}" placeholder="Кол-во ковров" min="0" value="0">
                    <input type="number" class="tender-changes" data-month="${month}" placeholder="Кол-во замен" min="0" value="0">
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // ============ РАСЧЕТ ТЕНДЕРА ============
    function calculateTender() {
        const region = document.getElementById('tender-region')?.value;
        const size = document.getElementById('tender-size')?.value;
        
        if (!region || !size) {
            showToast('Пожалуйста, выберите регион и размер', 'error');
            return;
        }
        
        // Получаем цену за замену (используем "1 раз в неделю" как базовую)
        const pricePerReplacement = getPriceForPosition(region, size, "1 раз в неделю");
        
        if (pricePerReplacement === 0) {
            showToast('Не удалось определить цену для выбранных параметров', 'error');
            return;
        }
        
        const qtyInputs = document.querySelectorAll('.tender-qty');
        const changesInputs = document.querySelectorAll('.tender-changes');
        
        let totalCost = 0;
        let details = '<h4 style="color: white; margin-bottom: 15px;">Детализация:</h4>';
        
        for (let i = 0; i < qtyInputs.length; i++) {
            const qty = parseInt(qtyInputs[i].value) || 0;
            const changes = parseInt(changesInputs[i].value) || 0;
            
            if (qty > 0 && changes > 0) {
                const monthTotal = pricePerReplacement * qty * changes;
                totalCost += monthTotal;
                
                const monthName = qtyInputs[i].dataset.month;
                details += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>${monthName}:</span>
                        <span><strong>${formatPrice(monthTotal)}</strong> (${qty} ковров × ${changes} замен)</span>
                    </div>
                `;
            }
        }
        
        if (totalCost === 0) {
            showToast('Укажите данные хотя бы для одного месяца', 'error');
            return;
        }
        
        document.getElementById('tenderTotal').textContent = formatPrice(totalCost);
        document.getElementById('tenderDetails').innerHTML = details;
        document.getElementById('tenderResult').style.display = 'block';
        
        // Сохраняем данные для отправки
        window.tenderData = {
            region,
            size,
            pricePerReplacement,
            totalCost,
            months: getTenderMonthsData()
        };
    }
    
    // ============ ПОЛУЧЕНИЕ ДАННЫХ ТЕНДЕРА ============
    function getTenderMonthsData() {
        const qtyInputs = document.querySelectorAll('.tender-qty');
        const changesInputs = document.querySelectorAll('.tender-changes');
        const months = [];
        
        for (let i = 0; i < qtyInputs.length; i++) {
            const qty = parseInt(qtyInputs[i].value) || 0;
            const changes = parseInt(changesInputs[i].value) || 0;
            
            if (qty > 0 && changes > 0) {
                months.push({
                    name: qtyInputs[i].dataset.month,
                    quantity: qty,
                    changes: changes
                });
            }
        }
        
        return months;
    }
    
    // ============ ОТПРАВКА ТЕНДЕРА В TELEGRAM ============
    function sendTenderToTelegram() {
        if (!window.tenderData) {
            showToast('Сначала выполните расчет тендера', 'error');
            return;
        }
        
        const data = window.tenderData;
        
        let message = `📋 ТЕНДЕРНЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📍 Регион: ${data.region}\n`;
        message += `📏 Размер: ${data.size}\n`;
        message += `💰 Цена за замену: ${formatPrice(data.pricePerReplacement)}\n\n`;
        
        message += `📅 Детализация по месяцам:\n`;
        data.months.forEach(month => {
            const monthTotal = data.pricePerReplacement * month.quantity * month.changes;
            message += `• ${month.name}: ${month.quantity} ковров × ${month.changes} замен = ${formatPrice(monthTotal)}\n`;
        });
        
        message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💰 ИТОГО: ${formatPrice(data.totalCost)}\n\n`;
        
        message += `⚡ Договор заключаем в день обращения\n`;
        message += `📄 Работаем по ЭДО\n`;
        message += `💳 Оплата по карте или безналичный расчет\n\n`;
        message += `📞 Telegram: @+79770005127\n`;
        message += `📧 Email: matservice@yandex.ru`;
        
        try {
            const textarea = document.createElement('textarea');
            textarea.value = message;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                window.open('https://t.me/+79770005127', '_blank');
                showToast('✅ Текст тендера скопирован! Вставьте его в Telegram', 'success');
            } else {
                const encoded = encodeURIComponent(message);
                window.open(`https://t.me/+79770005127?text=${encoded}`, '_blank');
                showToast('Telegram открыт!', 'success');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            showConsentModal('Тендерный расчет', message);
        }
    }
    
    // ============ ЭКСПОРТ ============
    window.Calculator = {
        addPosition,
        removePosition: window.removePosition,
        calculateTender,
        sendTenderToTelegram,
        sendToTelegram,
        sendToEmail,
        formatPrice,
        getPriceWithVAT: function(price) {
            return includeVAT ? price * (1 + VAT_RATE) : price;
        }
    };
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .position-item {
            transition: all 0.3s;
        }
        .position-item:hover {
            transform: translateX(5px);
        }
        .remove-position {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: #e74c3c;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .remove-position:hover {
            background: #c0392b;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
})();