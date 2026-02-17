// ============================================
// FORMS.JS - Обработка всех форм на сайте МИРУМ
// Версия: 7.2 (18.02.2026) - ПОЛНАЯ, С ВАЛИДАЦИЕЙ
// ============================================

(function() {
    'use strict';
    
    console.log('📝 forms.js загружен, версия 7.2');
    
    // Конфигурация
    const CONFIG = {
        TELEGRAM: '+79770005127',
        EMAIL: 'matservice@yandex.ru',
        VAT_RATE: 0.22
    };
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📋 Инициализация обработки форм...');
        
        initAllForms();
        initCalculatorForm();
        initTenderForm();
        initFloorForm();
        initWindowForm();
        initOutstaffingForm();
        initFAQForm();
        initContactForm();
    });
    
    // ============ ОБЩАЯ ОБРАБОТКА ВСЕХ ФОРМ ============
    function initAllForms() {
        document.querySelectorAll('form').forEach(form => {
            // Добавляем защиту от повторной отправки
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn && submitBtn.disabled) {
                    e.preventDefault();
                    return;
                }
            });
        });
    }
    
    // ============ ВАЛИДАЦИЯ ТЕЛЕФОНА ============
    function validatePhone(phone) {
        const clean = phone.replace(/\D/g, '');
        return clean.length === 11 && (clean.startsWith('7') || clean.startsWith('8'));
    }
    
    // ============ ВАЛИДАЦИЯ EMAIL ============
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ============ ПРОВЕРКА СОГЛАСИЯ ============
    function checkConsent(formId) {
        const consent = document.querySelector(`#${formId} input[type="checkbox"]`);
        if (!consent || !consent.checked) {
            alert('Пожалуйста, дайте согласие на обработку персональных данных');
            if (consent) consent.focus();
            return false;
        }
        return true;
    }
    
    // ============ ОТПРАВКА В TELEGRAM ============
    function sendToTelegram(message, form) {
        try {
            // Копируем сообщение в буфер
            const textarea = document.createElement('textarea');
            textarea.value = message;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                // Открываем Telegram
                window.open(`https://t.me/${CONFIG.TELEGRAM.replace('+', '')}`, '_blank');
                
                setTimeout(() => {
                    alert('✅ Сообщение скопировано!\n\n1. В открывшемся Telegram нажмите на поле ввода\n2. Вставьте текст (Ctrl+V)\n3. Отправьте сообщение');
                    
                    // Очищаем форму
                    if (form) form.reset();
                }, 500);
            } else {
                // Fallback - открываем с текстом в URL
                const encoded = encodeURIComponent(message);
                window.open(`https://t.me/${CONFIG.TELEGRAM.replace('+', '')}?text=${encoded}`, '_blank');
                
                setTimeout(() => {
                    alert('Telegram открыт! Нажмите "Отправить"');
                    if (form) form.reset();
                }, 500);
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка. Пожалуйста, отправьте сообщение вручную:\n' + message);
            return false;
        }
    }
    
    // ============ КАЛЬКУЛЯТОР АРЕНДЫ КОВРОВ ============
    function initCalculatorForm() {
        const form = document.getElementById('calculatorForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('calculatorForm')) return;
            
            const region = document.getElementById('calc-region')?.value;
            const size = document.getElementById('calc-size')?.value;
            const frequency = document.getElementById('calc-frequency')?.value;
            const quantity = document.getElementById('calc-quantity')?.value;
            
            if (!region || !size || !frequency || !quantity) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Получаем цену из priceData
            let price = 1000; // Заглушка
            if (window.priceData && window.priceData[region] && window.priceData[region][size]) {
                price = window.priceData[region][size][frequency] || 1000;
            }
            
            const total = price * parseInt(quantity) * getFrequencyMultiplier(frequency);
            
            const message = createCalculatorMessage({
                region, size, frequency, quantity, price, total
            });
            
            sendToTelegram(message, form);
        });
    }
    
    function getFrequencyMultiplier(freq) {
        const multipliers = {
            '1 раз в две недели': 2,
            '1 раз в неделю': 4,
            '2 раза в неделю': 8,
            '3 раза в неделю': 12,
            '4 раза в неделю': 16,
            '5 раз в неделю': 20,
            '6 раз в неделю': 24,
            '7 раз в неделю': 28
        };
        return multipliers[freq] || 4;
    }
    
    function createCalculatorMessage(data) {
        return `🧮 НОВЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ

📍 Регион: ${data.region}
📏 Размер: ${data.size}
🔄 Периодичность: ${data.frequency}
🔢 Количество: ${data.quantity} шт.
💰 Цена за замену: ${data.price} ₽
📊 Итого за месяц: ${data.total} ₽

🌐 Страница: Калькулятор
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
    }
    
    // ============ ТЕНДЕРНЫЙ КАЛЬКУЛЯТОР ============
    function initTenderForm() {
        const form = document.getElementById('tenderForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('tenderForm')) return;
            
            const region = document.getElementById('tender-region')?.value;
            const size = document.getElementById('tender-size')?.value;
            
            if (!region || !size) {
                alert('Пожалуйста, выберите регион и размер');
                return;
            }
            
            // Собираем данные по месяцам
            let message = `📋 ТЕНДЕРНЫЙ РАСЧЕТ АРЕНДЫ КОВРОВ\n\n`;
            message += `📍 Регион: ${region}\n`;
            message += `📏 Размер: ${size}\n\n`;
            message += `📅 Детализация по месяцам:\n`;
            
            let total = 0;
            const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
            
            months.forEach(month => {
                const qty = document.getElementById(`${month}-qty`)?.value;
                const changes = document.getElementById(`${month}-changes`)?.value;
                
                if (qty && changes && parseInt(qty) > 0 && parseInt(changes) > 0) {
                    const monthTotal = 1000 * parseInt(qty) * parseInt(changes); // Заглушка
                    total += monthTotal;
                    message += `• ${month}: ${qty} ковров × ${changes} замен = ${monthTotal.toLocaleString('ru-RU')} ₽\n`;
                }
            });
            
            message += `\n💰 ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n`;
            message += `🌐 Страница: Тендерный калькулятор\n`;
            message += `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(message, form);
        });
    }
    
    // ============ ВОССТАНОВЛЕНИЕ ПОЛОВ ============
    function initFloorForm() {
        const form = document.getElementById('floorRestorationForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('floorRestorationForm')) return;
            
            const name = document.getElementById('contactName')?.value.trim();
            const phone = document.getElementById('contactPhone')?.value.trim();
            const floorType = document.getElementById('floorType')?.value;
            const area = document.getElementById('area')?.value;
            
            if (!name || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            const floorTypes = {
                'parket': 'Паркет',
                'marble': 'Мрамор',
                'granite': 'Гранит',
                'linoleum': 'Линолеум',
                'ceramic': 'Керамогранит',
                'other': 'Другое'
            };
            
            const message = `📋 ЗАЯВКА НА ВОССТАНОВЛЕНИЕ ПОЛОВ

👤 Имя: ${name}
📞 Телефон: ${phone}
🏢 Тип пола: ${floorTypes[floorType] || 'Не указан'}
📏 Площадь: ${area || 'Не указана'} м²

🌐 Страница: Восстановление полов
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(message, form);
        });
    }
    
    // ============ МОЙКА ВИТРИН ============
    function initWindowForm() {
        const form = document.getElementById('windowCleaningForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('windowCleaningForm')) return;
            
            const company = document.getElementById('company')?.value.trim();
            const city = document.getElementById('city')?.value.trim();
            const phone = document.getElementById('contactPhone')?.value.trim();
            const serviceType = document.getElementById('serviceType')?.value;
            
            if (!company || !city || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            const services = {
                'regular': 'Регулярная мойка',
                'one-time': 'Разовая мойка',
                'complex': 'Комплексная мойка фасада',
                'highrise': 'Высотные работы'
            };
            
            const message = `📋 ЗАЯВКА НА МОЙКУ ВИТРИН

🏢 Компания: ${company}
📍 Город: ${city}
📞 Телефон: ${phone}
🔧 Услуга: ${services[serviceType] || 'Не указана'}

🌐 Страница: Мойка витрин
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(message, form);
        });
    }
    
    // ============ АУТСТАФФИНГ ============
    function initOutstaffingForm() {
        const form = document.getElementById('outstaffingForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('outstaffingForm')) return;
            
            const name = document.getElementById('outstaffName')?.value.trim();
            const phone = document.getElementById('outstaffPhone')?.value.trim();
            const company = document.getElementById('outstaffCompany')?.value.trim();
            const employees = document.getElementById('outstaffEmployees')?.value;
            
            if (!name || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            const message = `📋 ЗАЯВКА НА АУТСТАФФИНГ

👤 Имя: ${name}
📞 Телефон: ${phone}
🏢 Компания: ${company || 'Не указана'}
👥 Количество сотрудников: ${employees || 'Не указано'}

🌐 Страница: Аутстаффинг
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(message, form);
        });
    }
    
    // ============ ФОРМА FAQ ============
    function initFAQForm() {
        const form = document.getElementById('faqForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('faqForm')) return;
            
            const name = document.getElementById('name')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const category = document.getElementById('faqCategory')?.value;
            const question = document.getElementById('question')?.value.trim();
            
            if (!name || !phone || !question) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            if (email && !validateEmail(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            const categories = {
                'kovry': 'Аренда ковров',
                'vitrini': 'Мойка витрин',
                'poly': 'Восстановление полов',
                'outstaff': 'Аутстаффинг',
                'other': 'Другое'
            };
            
            const message = `❓ НОВЫЙ ВОПРОС ИЗ FAQ

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || 'не указан'}
🏷 Категория: ${categories[category] || 'Не указана'}

❔ Вопрос:
${question}

🌐 Страница: FAQ
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(message, form);
        });
    }
    
    // ============ КОНТАКТНАЯ ФОРМА ============
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkConsent('contactForm')) return;
            
            const name = document.getElementById('contactName')?.value.trim();
            const phone = document.getElementById('contactPhone')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();
            
            if (!name || !phone || !email) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            const telegramMessage = `📋 НОВОЕ СООБЩЕНИЕ

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}

💬 Сообщение:
${message || 'не указано'}

🌐 Страница: Контакты
🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            sendToTelegram(telegramMessage, form);
        });
    }
    
    // Экспорт для использования в других скриптах
    window.Forms = {
        sendToTelegram,
        validatePhone,
        validateEmail
    };
    
})();