// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 15.0 (20.02.2026) - Убраны резервные данные, полная функциональность
// ============================================

// ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
let positions = [];
let includeVAT = false; // По умолчанию НДС ВЫКЛЮЧЕН
const VAT_RATE = 0.22; // 22% НДС
let shouldAutoAdd = true; // Флаг для автоматического добавления

// ============ ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ============
function initCalculator() {
    console.log('🧮 Инициализация калькулятора...');
    
    const calculatorSection = document.querySelector('.calculator-section');
    if (!calculatorSection) {
        console.log('⚠️ Калькулятор не найден на этой странице');
        return;
    }
    
    initInterface();
    setupEventHandlers();
    setupAddPositionButton();
    checkPriceData();
    
    console.log('✅ Калькулятор успешно инициализирован');
}

// ============ НАСТРОЙКА КНОПКИ ДОБАВЛЕНИЯ ПОЗИЦИИ ============
function setupAddPositionButton() {
    // Создаем или находим кнопку добавления позиции
    let addPositionBtn = document.getElementById('addPositionBtn');
    
    if (!addPositionBtn) {
        // Создаем контейнер для кнопки
        const buttonsContainer = document.querySelector('.results-actions');
        if (!buttonsContainer) return;
        
        // Добавляем кнопку перед существующими кнопками
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        container.innerHTML = `
            <button id="addPositionBtn" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">
                <i class="fas fa-plus-circle"></i> Добавить новую позицию
            </button>
        `;
        
        buttonsContainer.parentNode.insertBefore(container, buttonsContainer);
        addPositionBtn = document.getElementById('addPositionBtn');
    }
    
    // Обработчик кнопки
    addPositionBtn.addEventListener('click', function() {
        // Сбрасываем поля формы для ввода новой позиции
        resetFormForNewPosition();
        
        // Прокручиваем к началу формы
        const formSection = document.querySelector('.calculator-form');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Включаем автоматическое добавление
        shouldAutoAdd = true;
        
        // Показываем подсказку
        showToast('Заполните поля выше для добавления новой позиции', 'info');
    });
    
    // Настраиваем автоматическое добавление позиций
    setupAutoPositionAddition();
}

// ============ СБРОС ФОРМЫ ДЛЯ НОВОЙ ПОЗИЦИИ ============
function resetFormForNewPosition() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const quantityInput = document.getElementById('quantity');
    
    // Сбрасываем только select-ы, но сохраняем значения по умолчанию
    // НЕ сбрасываем регион, чтобы пользователь не терял выбор
    if (sizeSelect) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
    }
    if (frequencySelect) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
    }
    if (quantityInput) quantityInput.value = '1';
}

// ============ НАСТРОЙКА АВТОМАТИЧЕСКОГО ДОБАВЛЕНИЯ ============
function setupAutoPositionAddition() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    const quantityInput = document.getElementById('quantity');
    
    if (!regionSelect || !sizeSelect || !frequencySelect || !quantityInput) return;
    
    const checkAndAddPosition = () => {
        if (!shouldAutoAdd) return;
        
        const region = regionSelect.value;
        const size = sizeSelect.value;
        const frequency = frequencySelect.value;
        const quantity = parseInt(quantityInput.value) || 1;
        
        if (region && size && frequency && quantity > 0) {
            const pricePerReplacement = getPriceForPosition(region, size, frequency);
            if (pricePerReplacement === 0) return;
            
            // Проверяем, есть ли уже такая позиция
            const existingPositionIndex = positions.findIndex(pos => 
                pos.region === region && 
                pos.size === size && 
                pos.frequency === frequency
            );
            
            if (existingPositionIndex >= 0) {
                // Обновляем существующую позицию
                positions[existingPositionIndex].quantity = quantity;
                positions[existingPositionIndex].pricePerReplacement = pricePerReplacement;
                positions[existingPositionIndex].costPer4Weeks = calculateCostPer4Weeks(pricePerReplacement, quantity, frequency);
                
                showToast('Позиция обновлена', 'success');
            } else {
                // Добавляем новую позицию
                const costPer4Weeks = calculateCostPer4Weeks(pricePerReplacement, quantity, frequency);
                
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
            
            // Прокручиваем к результатам на мобильных
            if (window.innerWidth <= 768 && positions.length > 0) {
                setTimeout(() => {
                    const totalResult = document.getElementById('totalResult');
                    if (totalResult) {
                        totalResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        }
    };
    
    // Вешаем обработчики на все поля
    regionSelect.addEventListener('change', checkAndAddPosition);
    sizeSelect.addEventListener('change', checkAndAddPosition);
    frequencySelect.addEventListener('change', checkAndAddPosition);
    quantityInput.addEventListener('input', checkAndAddPosition);
}

// ============ ОБНОВЛЕНИЕ СПИСКА ПОЗИЦИЙ ============
function updatePositionsList() {
    const positionsContainer = document.getElementById('positionsContainer');
    const positionsList = document.getElementById('positionsList');
    
    if (!positionsContainer || !positionsList) return;
    
    if (positions.length === 0) {
        positionsContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <i class="fas fa-info-circle" style="font-size: 24px; margin-bottom: 10px; display: block; color: #3498db;"></i>
                <p>Позиции не добавлены</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Заполните форму выше, и позиция добавится автоматически</p>
            </div>
        `;
        positionsList.style.display = 'none';
        return;
    }
    
    let html = '';
    
    positions.forEach((position, index) => {
        // Всегда показываем цены без НДС в списке позиций
        const priceWithoutVAT = position.pricePerReplacement;
        const costWithoutVAT = position.costPer4Weeks;
        
        html += `
            <div class="position-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #3498db; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <div style="background: #3498db; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 10px;">
                                ${index + 1}
                            </div>
                            <div style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">
                                ${position.size.replace('*', '×')} × ${position.quantity} шт.
                            </div>
                        </div>
                        <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px; padding-left: 34px;">
                            <i class="fas fa-sync-alt" style="color: #16a085; margin-right: 5px;"></i>
                            ${position.frequency}
                        </div>
                        <div style="font-size: 0.9rem; color: #27ae60; padding-left: 34px;">
                            <strong>Цена за замену:</strong> ${formatPrice(priceWithoutVAT)}
                        </div>
                        <div style="font-size: 0.9rem; color: #c0392b; margin-top: 5px; padding-left: 34px;">
                            <strong>Стоимость за 4 недели:</strong> ${formatPrice(costWithoutVAT)}
                        </div>
                        <div style="font-size: 0.85rem; color: #7f8c8d; margin-top: 5px; padding-left: 34px;">
                            <i class="fas fa-map-marker-alt" style="color: #e74c3c;"></i> ${position.region}
                        </div>
                    </div>
                    <button class="remove-position-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; margin-left: 10px; min-width: 36px; min-height: 36px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    positionsContainer.innerHTML = html;
    positionsList.style.display = 'block';
}

// ============ ОБНОВЛЕНИЕ ИТОГОВОГО РЕЗУЛЬТАТА ============
function updateTotalResult() {
    const totalResult = document.getElementById('totalResult');
    if (!totalResult) return;
    
    if (positions.length === 0) {
        totalResult.style.display = 'none';
        return;
    }
    
    let totalCostWithoutVAT = 0;
    let totalCostWithVAT = 0;
    let allSameRegion = true;
    const firstRegion = positions[0].region;
    
    positions.forEach(position => {
        totalCostWithoutVAT += position.costPer4Weeks;
        if (position.region !== firstRegion) {
            allSameRegion = false;
        }
    });
    
    totalCostWithVAT = totalCostWithoutVAT * (1 + VAT_RATE);
    
    let regionDisplay = allSameRegion ? firstRegion : 'Разные регионы';
    
    totalResult.innerHTML = `
        <div style="background: #16a085; color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <i class="fas fa-receipt" style="font-size: 24px; margin-right: 10px;"></i>
                <h4 style="margin: 0; color: white;">ИТОГОВЫЙ РАСЧЕТ</h4>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div><strong>Регион:</strong></div>
                <div>${regionDisplay}</div>
                
                <div><strong>Количество позиций:</strong></div>
                <div>${positions.length}</div>
                
                <div><strong>Общая стоимость за 4 недели:</strong></div>
                <div style="font-size: 1.5rem; font-weight: 700;">
                    ${formatPrice(totalCostWithoutVAT)}
                </div>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div>
                        <span style="font-weight: bold;">${includeVAT ? 'Расчет с НДС 22%' : 'Можем работать с НДС 22%'}</span>
                        <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">
                            ${includeVAT ? 
                                'Включен расчет с НДС. Можем работать как с НДС, так и без НДС.' :
                                'Хотите сделать расчет с НДС? Включите переключатель.'
                            }
                        </div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="vatToggle" ${includeVAT ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                ${includeVAT ? 
                    `<div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 5px; margin-top: 10px;">
                        <div style="font-size: 0.9rem;">
                            <strong>Стоимость без НДС:</strong> ${formatPrice(totalCostWithoutVAT)}<br>
                            <strong>НДС 22%:</strong> ${formatPrice(totalCostWithVAT - totalCostWithoutVAT)}<br>
                            <strong>Итого с НДС:</strong> ${formatPrice(totalCostWithVAT)}
                        </div>
                    </div>` : ''
                }
            </div>
            
            <p style="margin: 10px 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                <i class="fas fa-check-circle"></i> В стоимость входит: аренда ковра, чистка/сушка, доставка
            </p>
        </div>
        
        <div class="calculator-actions" style="margin-top: 20px;">
            <button id="addPositionBtn" class="btn btn-secondary" style="width: 100%; margin-bottom: 15px; padding: 15px; font-size: 16px; min-height: 44px;">
                <i class="fas fa-plus-circle"></i> Добавить новую позицию
            </button>
            
            <div class="results-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button class="btn btn-telegram" id="sendToTelegram" style="background: #0088cc; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 44px;">
                    <i class="fab fa-telegram"></i> Отправить в Telegram
                </button>
                <button class="btn btn-primary" id="sendToEmail" style="background: #16a085; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 44px;">
                    <i class="fas fa-envelope"></i> Отправить на Email
                </button>
            </div>
        </div>
    `;
    
    totalResult.style.display = 'block';
    
    // Обновляем обработчики
    const vatToggle = document.getElementById('vatToggle');
    if (vatToggle) {
        vatToggle.addEventListener('change', function() {
            includeVAT = this.checked;
            updatePositionsList();
            updateTotalResult();
        });
    }
    
    // Обработчики для кнопок
    const sendToTelegramBtn = document.getElementById('sendToTelegram');
    if (sendToTelegramBtn) {
        sendToTelegramBtn.addEventListener('click', sendToTelegram);
    }
    
    const sendToEmailBtn = document.getElementById('sendToEmail');
    if (sendToEmailBtn) {
        sendToEmailBtn.addEventListener('click', sendToEmail);
    }
    
    const addPositionBtn = document.getElementById('addPositionBtn');
    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', function() {
            resetFormForNewPosition();
            const formSection = document.querySelector('.calculator-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            shouldAutoAdd = true;
            showToast('Заполните поля выше для добавления новой позиции', 'info');
        });
    }
}

// ============ ОТПРАВКА В TELEGRAM ============
function sendToTelegram() {
    if (positions.length === 0) {
        alert('Сначала добавьте хотя бы одну позицию');
        return;
    }
    
    try {
        const message = createTelegramMessage();
        
        // Используем метод копирования текста
        const telegramUrl = `https://t.me/+79581118514`;
        
        // Создаем временный textarea для копирования
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = message;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.left = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Открываем Telegram
                window.open(telegramUrl, '_blank');
                
                setTimeout(() => {
                    alert('✅ Текст расчета скопирован!\n\n' +
                          '1. В открывшемся Telegram нажмите на поле ввода сообщения\n' +
                          '2. Вставьте текст (Ctrl+V или долгое нажатие → Вставить)\n' +
                          '3. Отправьте сообщение\n\n' +
                          'Свяжемся с вами, как можно скорее!');
                }, 1000);
            } else {
                // Если не удалось скопировать, открываем с текстом в URL
                const encodedMessage = encodeURIComponent(message);
                const fallbackUrl = `https://t.me/+79581118514?text=${encodedMessage}`;
                window.open(fallbackUrl, '_blank');
                
                setTimeout(() => {
                    alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\n' +
                          'Свяжемся с вами, как можно скорее!');
                }, 1000);
            }
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
            
            // Fallback: открываем Telegram с текстом в URL
            const encodedMessage = encodeURIComponent(message);
            const fallbackUrl = `https://t.me/+79581118514?text=${encodedMessage}`;
            window.open(fallbackUrl, '_blank');
            
            setTimeout(() => {
                alert('Telegram открыт! Нажмите "Отправить" чтобы отправить расчет.\n\n' +
                      'Свяжемся с вами, как можно скорее!');
            }, 1000);
        } finally {
            document.body.removeChild(tempTextArea);
        }
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        
        // Показываем сообщение с текстом расчета
        const message = createTelegramMessage();
        const textArea = document.createElement('textarea');
        textArea.value = message;
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.marginTop = '10px';
        textArea.readOnly = true;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 100%;">
                <h3 style="color: #e74c3c; margin-bottom: 15px;">Ошибка отправки</h3>
                <p>Скопируйте текст расчета и отправьте в Telegram вручную:</p>
                <p><strong>Telegram:</strong> @+79581118514</p>
                ${textArea.outerHTML}
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button onclick="copyText(this)" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Копировать текст</button>
                    <button onclick="this.closest('.modal').remove()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
                </div>
            </div>
        `;
        
        modal.classList.add('modal');
        document.body.appendChild(modal);
        
        // Добавляем функцию копирования
        window.copyText = function(btn) {
            const textarea = modal.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            btn.textContent = 'Скопировано!';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                btn.textContent = 'Копировать текст';
                btn.style.background = '#3498db';
            }, 2000);
        };
    }
}

// ============ СОЗДАНИЕ СООБЩЕНИЯ ДЛЯ TELEGRAM ============
function createTelegramMessage() {
    let totalCostWithoutVAT = 0;
    let totalCostWithVAT = 0;
    
    positions.forEach(position => {
        totalCostWithoutVAT += position.costPer4Weeks;
    });
    
    totalCostWithVAT = totalCostWithoutVAT * (1 + VAT_RATE);
    
    let message = `РАСЧЕТ АРЕНДЫ КОВРОВ\n\n`;
    
    positions.forEach((position, index) => {
        const priceWithoutVAT = position.pricePerReplacement;
        const costWithoutVAT = position.costPer4Weeks;
        
        message += `${index + 1}. Размер ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
        message += `   📍 ${position.region}\n`;
        message += `   Замены ${position.frequency}\n`;
        message += `   Цена за 1 чистый ковер: ${formatPrice(priceWithoutVAT)}\n`;
        message += `   📊 Стоимость за 4 недели: ${formatPrice(costWithoutVAT)}\n\n`;
    });
    
    // ТОЛЬКО ЕСЛИ НДС ВКЛЮЧЕН - показываем информацию о НДС
    if (includeVAT) {
        message += `РАСЧЕТ С НДС 22%:\n`;
        message += `Общая стоимость без НДС: ${formatPrice(totalCostWithoutVAT)}\n`;
        message += `НДС 22%: ${formatPrice(totalCostWithVAT - totalCostWithoutVAT)}\n`;
        message += `Общая стоимость с НДС: ${formatPrice(totalCostWithVAT)}\n\n`;
    } else {
        // ЕСЛИ НДС ВЫКЛЮЧЕН - показываем ТОЛЬКО стоимость без НДС
        message += `Общая стоимость: ${formatPrice(totalCostWithoutVAT)}\n\n`;
        // НЕ УПОМИНАЕМ НДС ВООБЩЕ!
    }
    
    message += `ДЛЯ ЗАКЛЮЧЕНИЯ ДОГОВОРА ПРИШЛИТЕ:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Подписант (ФИО, основание полномочий)\n`;
    message += `• Точный адрес объекта и название, вывеска\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
    
    message += `⚡ Договор заключаем в день обращения\n`;
    message += `💳 Возможна оплата по карте и по безналичному расчету\n`;
    message += `📄 Можем работать по ЭДО, если вам так удобно\n`;
    message += `👤 Можем оформить договор с физлицом\n\n`;
    
    message += `Telegram: @+79581118514\n`;
    message += `Email: matservice@yandex.ru\n`;
    message += `Сайт: arenda-kovrov-mirum.ru\n`;
    
    return message;
}

// ============ ОТПРАВКА НА EMAIL ============
function sendToEmail() {
    if (positions.length === 0) {
        alert('Сначала добавьте хотя бы одну позицию');
        return;
    }
    
    try {
        let totalCostWithoutVAT = 0;
        let totalCostWithVAT = 0;
        
        positions.forEach(position => {
            totalCostWithoutVAT += position.costPer4Weeks;
        });
        
        totalCostWithVAT = totalCostWithoutVAT * (1 + VAT_RATE);
        
        let subject = 'Расчет аренды ковров МИРУМ';
        subject += ` - ${new Date().toLocaleDateString('ru-RU')}`;
        
        let body = 'РАСЧЕТ АРЕНДЫ КОВРОВ\n\n';
        
        positions.forEach((position, index) => {
            const priceWithoutVAT = position.pricePerReplacement;
            const costWithoutVAT = position.costPer4Weeks;
            
            body += `${index + 1}. Размер ${position.size.replace('*', '×')} × ${position.quantity} шт.\n`;
            body += `   📍 ${position.region}\n`;
            body += `   Замены ${position.frequency}\n`;
            body += `   Цена за 1 чистый ковер: ${priceWithoutVAT.toLocaleString('ru-RU')} руб.\n`;
            body += `   📊 Стоимость за 4 недели: ${costWithoutVAT.toLocaleString('ru-RU')} руб.\n\n`;
        });
        
        // ТОЛЬКО ЕСЛИ НДС ВКЛЮЧЕН - показываем информацию о НДС
        if (includeVAT) {
            body += `РАСЧЕТ С НДС 22%:\n`;
            body += `Общая стоимость без НДС: ${totalCostWithoutVAT.toLocaleString('ru-RU')} руб.\n`;
            body += `НДС 22%: ${(totalCostWithVAT - totalCostWithoutVAT).toLocaleString('ru-RU')} руб.\n`;
            body += `Общая стоимость с НДС: ${totalCostWithVAT.toLocaleString('ru-RU')} руб.\n\n`;
        } else {
            // ЕСЛИ НДС ВЫКЛЮЧЕН - показываем ТОЛЬКО стоимость без НДС
            body += `Общая стоимость: ${totalCostWithoutVAT.toLocaleString('ru-RU')} руб.\n\n`;
            // НЕ УПОМИНАЕМ НДС ВООБЩЕ!
        }
        
        body += `ДЛЯ ЗАКЛЮЧЕНИЯ ДОГОВОРА ПРИШЛИТЕ:\n`;
        body += `• Реквизиты компании\n`;
        body += `• Подписант (ФИО, основание полномочий)\n`;
        body += `• Точный адрес объекта и название, вывеска\n`;
        body += `• Режим работы объекта\n`;
        body += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
        
        body += `⚡ Договор заключаем в день обращения\n`;
        body += `💳 Возможна оплата по карте и по безналичному расчету\n`;
        body += `📄 Можем работать по ЭДО, если вам так удобно\n`;
        body += `👤 Можем оформить договор с физлицом\n\n`;
        
        body += `Telegram: @+79581118514\n`;
        body += `Email: matservice@yandex.ru\n`;
        body += `Сайт: https://arenda-kovrov-mirum.ru\n\n`;
        
        body += `Свяжемся с вами, как можно скорее!`;
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const emailUrl = `mailto:matservice@yandex.ru?subject=${encodedSubject}&body=${encodedBody}`;
        
        window.open(emailUrl, '_blank');
        
        setTimeout(() => {
            alert('✅ Письмо сформировано!\n\n' +
                  '1. В открывшемся почтовом клиенте проверьте письмо\n' +
                  '2. При необходимости отредактируйте текст\n' +
                  '3. Отправьте письмо\n\n' +
                  'Свяжемся с вами, как можно скорее!');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки на Email:', error);
        alert('Произошла ошибка при формировании письма. Пожалуйста, отправьте email на matservice@yandex.ru');
    }
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function calculateCostPer4Weeks(pricePerReplacement, quantity, frequency) {
    // Определяем количество замен в 4 недели (28 дней)
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
    
    const replacementsCount = replacementsPer4Weeks[frequency] || 4;
    
    // Формула: (цена_за_одну_замену) × (количество_замен_в_4_недели) × (количество_ковров)
    return pricePerReplacement * replacementsCount * quantity;
}

function getPriceForPosition(region, size, frequency) {
    let pricePerReplacement = 0;
    
    // Сначала проверяем window.priceData (из prices.js)
    if (window.priceData && window.priceData[region] && 
        window.priceData[region][size] && 
        window.priceData[region][size][frequency]) {
        pricePerReplacement = window.priceData[region][size][frequency];
    }
    // Затем проверяем PriceUtils
    else if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getPrice === 'function') {
        pricePerReplacement = window.PriceUtils.getPrice(region, size, frequency);
    }
    
    return pricePerReplacement;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function showToast(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingToast = document.querySelector('.calculator-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Создаем уведомление
    const toast = document.createElement('div');
    toast.className = 'calculator-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Добавляем стили анимации
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
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
    }
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ============ ОБРАБОТЧИКИ УДАЛЕНИЯ ПОЗИЦИЙ ============
function removePosition(index) {
    if (index >= 0 && index < positions.length) {
        positions.splice(index, 1);
        updatePositionsList();
        updateTotalResult();
        showToast('Позиция удалена', 'info');
    }
}

// ============ ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
function initInterface() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const frequencySelect = document.getElementById('frequency');
    
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
    
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && !quantityInput.value) {
        quantityInput.value = 1;
    }
    
    // Очищаем позиции
    positions = [];
    includeVAT = false;
    shouldAutoAdd = true;
    updatePositionsList();
    
    // Инициализация месяцев для тендера
    initMonths();
}

// ============ ПРОВЕРКА И ЗАГРУЗКА ДАННЫХ О ЦЕНАХ ============
function checkPriceData() {
    console.log('🔍 Проверка данных о ценах...');
    
    if (typeof window.priceData !== 'undefined' && Object.keys(window.priceData).length > 0) {
        console.log('✅ База цен загружена из window.priceData');
        console.log('📊 Регионов:', Object.keys(window.priceData).length);
        populateRegions();
    } else if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        console.log('✅ PriceUtils загружен');
        populateRegions();
    } else {
        console.error('❌ База цен не загружена! Проверьте подключение prices.js');
    }
}

// ============ ЗАПОЛНЕНИЕ РЕГИОНОВ ============
function populateRegions() {
    console.log('🗺️ Заполняем регионы...');
    
    const regionSelect = document.getElementById('region');
    const tenderRegionSelect = document.getElementById('tender-region');
    
    if (!regionSelect) {
        console.error('❌ Элемент #region не найден');
        return;
    }
    
    let regions = [];
    
    if (typeof window.priceData !== 'undefined' && Object.keys(window.priceData).length > 0) {
        regions = Object.keys(window.priceData);
        console.log(`✅ Найдено ${regions.length} регионов в window.priceData`);
    } else if (typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getRegions === 'function') {
        regions = window.PriceUtils.getRegions();
        console.log(`✅ Найдено ${regions.length} регионов в PriceUtils`);
    }
    
    if (regions.length === 0) {
        console.error('❌ Регионы не найдены!');
        regionSelect.innerHTML = '<option value="">Ошибка загрузки регионов</option>';
        return;
    }
    
    // Используем правильную сортировку из regionsOrder если доступно
    let orderedRegions = [];
    if (typeof window.regionsOrder !== 'undefined' && window.regionsOrder.length > 0) {
        // Сначала добавляем регионы из порядка
        window.regionsOrder.forEach(region => {
            if (regions.includes(region)) {
                orderedRegions.push(region);
            }
        });
        
        // Затем добавляем остальные регионы (если есть новые)
        regions.forEach(region => {
            if (!orderedRegions.includes(region)) {
                orderedRegions.push(region);
            }
        });
        
        regions = orderedRegions;
        console.log('✅ Использована кастомная сортировка регионов');
    } else {
        regions.sort(); // Обычная сортировка как запасной вариант
        console.log('⚠️ Использована стандартная сортировка (regionsOrder не найден)');
    }
    
    // Заполняем обычный селект
    regionSelect.innerHTML = '<option value="">Выберите регион</option>';
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
    console.log(`✅ Заполнен селект регионов: ${regions.length} регионов`);
    
    // Заполняем тендерный селект
    if (tenderRegionSelect) {
        tenderRegionSelect.innerHTML = '<option value="">Выберите регион</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            tenderRegionSelect.appendChild(option);
        });
        
        tenderRegionSelect.addEventListener('change', function() {
            handleTenderRegionChange(this.value);
        });
    }
    
    // Принудительно вызываем обработчик для региона, если он уже выбран
    if (regionSelect.value) {
        handleRegionChange(regionSelect.value);
    }
}

// ============ НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ ============
function setupEventHandlers() {
    const regionSelect = document.getElementById('region');
    const sizeSelect = document.getElementById('size');
    const calculateTenderBtn = document.getElementById('calculateTenderBtn');
    const sendTenderToTelegramBtn = document.getElementById('sendTenderToTelegram');
    
    // Обработчик для выбора региона
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            handleRegionChange(this.value);
        });
    }
    
    // Обработчик для выбора размера
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            const regionSelect = document.getElementById('region');
            handleSizeChange(regionSelect ? regionSelect.value : '', this.value);
        });
    }
    
    // Обработчик для расчета тендера
    if (calculateTenderBtn) {
        calculateTenderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateTender();
        });
    }
    
    // Обработчик для отправки тендера в Telegram
    if (sendTenderToTelegramBtn) {
        sendTenderToTelegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendTenderToTelegram();
        });
    }
    
    // Обработчик для кнопки удаления позиции
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-position-btn')) {
            const index = e.target.closest('.remove-position-btn').dataset.index;
            removePosition(parseInt(index));
        }
    });
}

// ============ ОБРАБОТКА ИЗМЕНЕНИЯ РЕГИОНА ============
function handleRegionChange(region) {
    console.log(`📍 Выбран регион: ${region}`);
    
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
    
    // Пытаемся получить размеры из window.priceData
    if (window.priceData && window.priceData[region]) {
        try {
            sizes = Object.keys(window.priceData[region]);
            console.log(`✅ Найдено ${sizes.length} размеров для региона ${region}`);
        } catch (error) {
            console.error('Ошибка при получении размеров из window.priceData:', error);
        }
    }
    
    // Если не нашли размеры, проверяем PriceUtils
    if (sizes.length === 0 && typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getSizesForRegion === 'function') {
        try {
            sizes = window.PriceUtils.getSizesForRegion(region);
            console.log(`✅ Найдено ${sizes.length} размеров через PriceUtils для региона ${region}`);
        } catch (error) {
            console.error('Ошибка в PriceUtils.getSizesForRegion():', error);
        }
    }
    
    // Сортируем размеры
    sizes.sort();
    
    // Заполняем селект размеров
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

// ============ ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ============
function handleSizeChange(region, size) {
    console.log(`📏 Выбран размер: ${size} для региона: ${region}`);
    
    const frequencySelect = document.getElementById('frequency');
    
    if (!frequencySelect) return;
    
    if (!region || !size) {
        frequencySelect.innerHTML = '<option value="">Сначала выберите размер</option>';
        frequencySelect.disabled = true;
        return;
    }
    
    let frequencies = [];
    
    // Пытаемся получить периодичности из window.priceData
    if (window.priceData && window.priceData[region] && window.priceData[region][size]) {
        try {
            frequencies = Object.keys(window.priceData[region][size]);
            console.log(`✅ Найдено ${frequencies.length} периодичностей для размера ${size}`);
        } catch (error) {
            console.error('Ошибка при получении периодичностей из window.priceData:', error);
        }
    }
    
    // Если не нашли периодичности, проверяем PriceUtils
    if (frequencies.length === 0 && typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getFrequenciesForSize === 'function') {
        try {
            frequencies = window.PriceUtils.getFrequenciesForSize(region, size);
            console.log(`✅ Найдено ${frequencies.length} периодичностей через PriceUtils для размера ${size}`);
        } catch (error) {
            console.error('Ошибка в PriceUtils.getFrequenciesForSize():', error);
        }
    }
    
    // Сортируем периодичности
    frequencies.sort();
    
    // Заполняем селект периодичностей
    frequencySelect.innerHTML = '<option value="">Выберите периодичность замены</option>';
    frequencies.forEach(frequency => {
        const option = document.createElement('option');
        option.value = frequency;
        option.textContent = frequency;
        frequencySelect.appendChild(option);
    });
    
    frequencySelect.disabled = false;
}

// ============ ОБРАБОТКА ИЗМЕНЕНИЯ РЕГИОНА ДЛЯ ТЕНДЕРА ============
function handleTenderRegionChange(region) {
    console.log(`📍 Выбран регион для тендера: ${region}`);
    
    const sizeSelect = document.getElementById('tender-size');
    
    if (!sizeSelect) return;
    
    if (!region) {
        sizeSelect.innerHTML = '<option value="">Сначала выберите регион</option>';
        sizeSelect.disabled = true;
        return;
    }
    
    let sizes = [];
    
    // Пытаемся получить размеры из window.priceData
    if (window.priceData && window.priceData[region]) {
        try {
            sizes = Object.keys(window.priceData[region]);
            console.log(`✅ Найдено ${sizes.length} размеров для тендера в регионе ${region}`);
        } catch (error) {
            console.error('Ошибка при получении размеров для тендера из window.priceData:', error);
        }
    }
    
    // Если не нашли размеры, проверяем PriceUtils
    if (sizes.length === 0 && typeof window.PriceUtils !== 'undefined' && typeof window.PriceUtils.getSizesForRegion === 'function') {
        try {
            sizes = window.PriceUtils.getSizesForRegion(region);
            console.log(`✅ Найдено ${sizes.length} размеров через PriceUtils для тендера в регионе ${region}`);
        } catch (error) {
            console.error('Ошибка в PriceUtils.getSizesForRegion() для тендера:', error);
        }
    }
    
    // Сортируем размеры
    sizes.sort();
    
    // Заполняем селект размеров для тендера
    sizeSelect.innerHTML = '<option value="">Выберите размер ковра</option>';
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
    
    sizeSelect.disabled = false;
}

// ============ ИНИЦИАЛИЗАЦИЯ МЕСЯЦЕВ ДЛЯ ТЕНДЕРА ============
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

// ============ РАСЧЕТ ТЕНДЕРА ============
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

// ============ ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ТЕНДЕРА ============
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

// ============ ОТПРАВКА ТЕНДЕРА В TELEGRAM ============
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
        
        message += `\n📄 Для заключения договора потребуются:\n`;
        message += `• Реквизиты компании\n`;
        message += `• Подписант (ФИО, основание полномочий)\n`;
        message += `• Точный адрес объекта и название, вывеска\n`;
        message += `• Режим работы объекта\n`;
        message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
        
        message += `⚡ Договор заключаем в день обращения\n`;
        message += `💳 Возможна оплата по карте и по безналичному расчету\n`;
        message += `📄 Можем работать по ЭДО, если вам так удобно\n`;
        message += `👤 Можем оформить договор с физлицом\n\n`;
        
        message += `📞 СВЯЗЬ:\n`;
        message += `Telegram: t.me/+79581118514\n`;
        message += `Email: matservice@yandex.ru\n`;
        message += `Сайт: arenda-kovrov-mirum.ru`;
        
        // Используем метод копирования текста
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = message;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.left = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const telegramUrl = `https://t.me/+79581118514`;
                window.open(telegramUrl, '_blank');
                
                setTimeout(() => {
                    alert('✅ Текст тендерного расчета скопирован!\n\n' +
                          '1. В открывшемся Telegram нажмите на поле ввода сообщения\n' +
                          '2. Вставьте текст (Ctrl+V или долгое нажатие → Вставить)\n' +
                          '3. Отправьте сообщение\n\n' +
                          'Свяжемся с вами, как можно скорее!');
                }, 1000);
            } else {
                const encodedMessage = encodeURIComponent(message);
                const fallbackUrl = `https://t.me/+79581118514?text=${encodedMessage}`;
                window.open(fallbackUrl, '_blank');
                
                setTimeout(() => {
                    alert('Telegram открыт! Нажмите "Отправить" чтобы отправить тендерный расчет.\n\n' +
                          'Свяжемся с вами, как можно скорее!');
                }, 1000);
            }
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
            
            const encodedMessage = encodeURIComponent(message);
            const fallbackUrl = `https://t.me/+79581118514?text=${encodedMessage}`;
            window.open(fallbackUrl, '_blank');
            
            setTimeout(() => {
                alert('Telegram открыт! Нажмите "Отправить" чтобы отправить тендерный расчет.\n\n' +
                      'Свяжемся с вами, как можно скорее!');
            }, 1000);
        } finally {
            document.body.removeChild(tempTextArea);
        }
        
    } catch (error) {
        console.error('Ошибка отправки тендера в Telegram:', error);
        alert('Произошла ошибка. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79581118514');
    }
}

// ============ ЭКСПОРТ ФУНКЦИЙ ============
window.Calculator = {
    init: initCalculator,
    removePosition: removePosition,
    calculateTender: calculateTender,
    sendToTelegram: sendToTelegram,
    sendTenderToTelegram: sendTenderToTelegram,
    sendToEmail: sendToEmail
};

window.removePosition = removePosition;

// ============ АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, проверяем калькулятор...');
    
    const hasCalculator = document.querySelector('.calculator-section') || 
                         document.querySelector('.calculator-form') || 
                         document.getElementById('region');
    
    if (hasCalculator) {
        console.log('🔍 Калькулятор обнаружен, запускаем...');
        
        // Небольшая задержка для гарантии загрузки всех скриптов
        setTimeout(() => {
            initCalculator();
        }, 100);
    }
});

// ============ КОНЕЦ CALCULATOR.JS ============