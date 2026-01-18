// ============================================
// CALCULATOR.JS - Основной скрипт калькулятора МИРУМ
// Версия: 12.2 (Исправлена логика НДС - расчет всегда без НДС по умолчанию)
// ============================================

// ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
let positions = [];
let includeVAT = false; // По умолчанию НДС ВЫКЛЮЧЕН
const VAT_RATE = 0.22; // 22% НДС
let shouldAutoAdd = true; // Флаг для автоматического добавления

// ============ ОСТАВЛЯЕМ ВСЕ ФУНКЦИИ ДО updateTotalResult() БЕЗ ИЗМЕНЕНИЙ ============

// ============ ИЗМЕНЯЕМ ФУНКЦИЮ updateTotalResult() ============
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
                        <span style="font-weight: bold;">${includeVAT ? 'Расчет с НДС 22%' : 'Работаем без НДС'}</span>
                        <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">
                            ${includeVAT ? 
                                'Включен расчет с НДС. Можем работать как с НДС, так и без НДС.' :
                                'Можем работать с НДС 22%. Включите переключатель для расчета с НДС.'
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

// ============ ИЗМЕНЯЕМ ФУНКЦИЮ createTelegramMessage() ============
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
    
    if (includeVAT) {
        message += `РАСЧЕТ С НДС 22%:\n`;
        message += `Общая стоимость без НДС: ${formatPrice(totalCostWithoutVAT)}\n`;
        message += `НДС 22%: ${formatPrice(totalCostWithVAT - totalCostWithoutVAT)}\n`;
        message += `Общая стоимость с НДС: ${formatPrice(totalCostWithVAT)}\n\n`;
    } else {
        message += `Общая стоимость (без НДС): ${formatPrice(totalCostWithoutVAT)}\n\n`;
    }
    
    // Добавляем информацию о возможности работы с НДС
    if (!includeVAT) {
        message += `ℹ️ МОЖЕМ РАБОТАТЬ С НДС 22%\n`;
        message += `Стоимость с НДС: ${formatPrice(totalCostWithVAT)}\n\n`;
    }
    
    message += `ДЛЯ ЗАКЛЮЧЕНИЯ ДОГОВОРА ПРИШЛИТЕ:\n`;
    message += `• Реквизиты компании\n`;
    message += `• Подписант (ФИО, основание полномочий)\n`;
    message += `• Точный адрес объекта и название, вывеска\n`;
    message += `• Режим работы объекта\n`;
    message += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
    
    message += `Telegram: @+79770005127\n`;
    message += `WhatsApp: +7 (977) 000-51-27\n`;
    message += `Email: matservice@yandex.ru\n`;
    message += `Сайт: arenda-kovrov-mirum.ru\n`;
    
    return message;
}

// ============ ИЗМЕНЯЕМ ФУНКЦИЮ sendToEmail() ============
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
        
        if (includeVAT) {
            body += `РАСЧЕТ С НДС 22%:\n`;
            body += `Общая стоимость без НДС: ${totalCostWithoutVAT.toLocaleString('ru-RU')} руб.\n`;
            body += `НДС 22%: ${(totalCostWithVAT - totalCostWithoutVAT).toLocaleString('ru-RU')} руб.\n`;
            body += `Общая стоимость с НДС: ${totalCostWithVAT.toLocaleString('ru-RU')} руб.\n\n`;
        } else {
            body += `Общая стоимость (без НДС): ${totalCostWithoutVAT.toLocaleString('ru-RU')} руб.\n\n`;
        }
        
        // Добавляем информацию о возможности работы с НДС
        if (!includeVAT) {
            body += `ℹ️ МОЖЕМ РАБОТАТЬ С НДС 22%\n`;
            body += `Стоимость с НДС: ${totalCostWithVAT.toLocaleString('ru-RU')} руб.\n\n`;
        }
        
        body += `ДЛЯ ЗАКЛЮЧЕНИЯ ДОГОВОРА ПРИШЛИТЕ:\n`;
        body += `• Реквизиты компании\n`;
        body += `• Подписант (ФИО, основание полномочий)\n`;
        body += `• Точный адрес объекта и название, вывеска\n`;
        body += `• Режим работы объекта\n`;
        body += `• Контактное лицо (ФИО, телефон) для связи с курьером\n\n`;
        
        body += `Telegram: @+79770005127\n`;
        body += `WhatsApp: +7 (977) 000-51-27\n`;
        body += `Email: matservice@yandex.ru\n`;
        body += `Сайт: https://arenda-kovrov-mirum.ru\n\n`;
        
        body += `Мы свяжемся с вами в течение 15 минут!`;
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const emailUrl = `mailto:matservice@yandex.ru?subject=${encodedSubject}&body=${encodedBody}`;
        
        window.open(emailUrl, '_blank');
        
        setTimeout(() => {
            alert('✅ Письмо сформировано!\n\n' +
                  '1. В открывшемся почтовом клиенте проверьте письмо\n' +
                  '2. При необходимости отредактируйте текст\n' +
                  '3. Отправьте письмо\n\n' +
                  'Мы получим ваше письмо и свяжемся с вами!');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки на Email:', error);
        alert('Произошла ошибка при формировании письма. Пожалуйста, отправьте email на matservice@yandex.ru');
    }
}

// ============ ИЗМЕНЯЕМ ФУНКЦИЮ updatePositionsList() ============
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

// ============ ОСТАЛЬНЫЙ КОД БЕЗ ИЗМЕНЕНИЙ ============