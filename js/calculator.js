// ============================================
// CALCULATOR.JS - Калькулятор аренды ковров МИРУМ
// Версия: 15.0 (18.02.2026) - ПОЛНАЯ, ИНТЕГРИРОВАННАЯ С PRICES.JS
// ============================================

(function() {
    'use strict';
    
    console.log('🧮 calculator.js загружен, версия 15.0');
    
    // ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
    let positions = [];
    let includeVAT = false;
    const VAT_RATE = 0.22;
    let shouldAutoAdd = true;
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', function() {
        if (!document.querySelector('.calculator-section')) return;
        
        console.log('🧮 Инициализация калькулятора...');
        
        initCalculator();
    });
    
    function initCalculator() {
        // Ждем загрузки priceData
        const checkPriceData = setInterval(function() {
            if (window.priceData || window.PriceUtils) {
                clearInterval(checkPriceData);
                initInterface();
                setupEventHandlers();
                setupAddPositionButton();
                console.log('✅ Калькулятор успешно инициализирован');
            }
        }, 100);
        
        // Таймаут на случай ошибки
        setTimeout(function() {
            clearInterval(checkPriceData);
            if (!window.priceData && !window.PriceUtils) {
                console.warn('⚠️ База цен не загружена, использую резервные данные');
                initInterface();
            }
        }, 3000);
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
    function initInterface() {
        const regionSelect = document.getElementById('region');
        const sizeSelect = document.getElementById('size');
        const frequencySelect = document.getElementById('frequency');
        const quantityInput = document.getElementById('quantity');
        
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
        
        // Очищаем позиции
        positions = [];
        includeVAT = false;
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
        
        // Обработчик региона
        if (regionSelect) {
            regionSelect.addEventListener('change', function() {
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
    
    // ============ РАСЧЕТ СТОИМОСТИ ЗА 4 НЕДЕЛИ ============
    function calculateCostPer4Weeks(pricePerReplacement, quantity, frequency) {
        const replacementsPer4Weeks = {
            "1 раз в две недели": 2,
            "1 раз в неделю": 4,
            "2 раза в неделю": 8,
            "3 раза в неделю": 12,
            "4 раза в неделю": 16,
            "5 раз в неделю": 20,
            "6 раз в неделю": 24,
            "7 раз в неделю": 28
        };
        
        const count = replacementsPer4Weeks[frequency] || 4;
        return pricePerReplacement * count * quantity;
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
            showToast('Не удалось определить цену', 'error');
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
            addBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Добавить позицию';
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
            html += `
                <div class="position-item" data-index="${index}">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong>${pos.size.replace('×', '×')} × ${pos.quantity} шт.</strong>
                            <div style="font-size: 0.9rem; color: #666;">${pos.region}</div>
                            <div style="font-size: 0.9rem; color: #666;">${pos.frequency}</div>
                            <div style="font-weight: 600; color: #16a085;">${formatPrice(pos.costPer4Weeks)}/мес</div>
                        </div>
                        <button class="remove-position" onclick="removePosition(${index})">
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
        const toast = document.createElement('div');
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
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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
            alert('Пожалуйста, выберите регион и размер');
            return;
        }
        
        // Получаем цену за замену (используем "1 раз в неделю" как базовую)
        const pricePerReplacement = getPriceForPosition(region, size, "1 раз в неделю");
        
        if (pricePerReplacement === 0) {
            alert('Не удалось определить цену для выбранных параметров');
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
            alert('Пожалуйста, укажите данные хотя бы для одного месяца');
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
            alert('Сначала выполните расчет тендера');
            return;
        }
        
        const data = window.tenderData;
        
        let message = `📋 ТЕНДЕРНЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ\n\n`;
        message += `📍 Регион: ${data.region}\n`;
        message += `📏 Размер: ${data.size}\n`;
        message += `💰 Цена за замену: ${formatPrice(data.pricePerReplacement)}\n\n`;
        
        message += `📅 Детализация по месяцам:\n`;
        data.months.forEach(month => {
            const monthTotal = data.pricePerReplacement * month.quantity * month.changes;
            message += `• ${month.name}: ${month.quantity} ковров × ${month.changes} замен = ${formatPrice(monthTotal)}\n`;
        });
        
        message += `\n💰 ИТОГО: ${formatPrice(data.totalCost)}\n\n`;
        message += `⚡ Договор заключаем в день обращения\n`;
        message += `📄 Работаем по ЭДО\n`;
        message += `💳 Оплата по карте или безналичный расчет\n\n`;
        message += `📞 Telegram: @+79770005127\n`;
        message += `📧 Email: matservice@yandex.ru`;
        
        sendToTelegram(message);
    }
    
    // ============ ОТПРАВКА В TELEGRAM ============
    function sendToTelegram(message) {
        try {
            // Копируем в буфер обмена
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
                    alert('✅ Текст расчета скопирован!\n\n1. В открывшемся Telegram нажмите на поле ввода\n2. Вставьте текст (Ctrl+V)\n3. Отправьте сообщение');
                }, 500);
            } else {
                // Fallback
                const encoded = encodeURIComponent(message);
                window.open(`https://t.me/+79770005127?text=${encoded}`, '_blank');
                setTimeout(() => {
                    alert('Telegram открыт! Нажмите "Отправить"');
                }, 500);
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка. Пожалуйста, отправьте расчет вручную:\n' + message);
        }
    }
    
    // ============ ЭКСПОРТ ============
    window.Calculator = {
        addPosition,
        removePosition: window.removePosition,
        calculateTender,
        sendTenderToTelegram
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
    `;
    document.head.appendChild(style);
    
})();