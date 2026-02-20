// ============================================
// FORMS.JS - Обработка всех форм на сайте
// Версия: 7.0 (Обновленные тексты сообщений)
// ============================================

(function() {
    'use strict';
    
    console.log('📋 Инициализация обработки форм');
    
    // ============ КОНСТАНТЫ И НАСТРОЙКИ ============
    const TELEGRAM_CHAT_ID = '+79770005127';
    const DEFAULT_EMAIL = 'matservice@yandex.ru';
    
    // ============ УТИЛИТНЫЕ ФУНКЦИИ ============
    
    /**
     * Валидация телефона
     * @param {string} phone - Номер телефона
     * @returns {boolean} - Валидный ли номер
     */
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        // Российские номера: начинаются с 7 или 8, длина 11 цифр
        return /^[78]\d{10}$/.test(cleanPhone);
    }
    
    /**
     * Валидация email
     * @param {string} email - Email адрес
     * @returns {boolean} - Валидный ли email
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Форматирование телефона для отображения
     * @param {string} phone - Номер телефона
     * @returns {string} - Отформатированный номер
     */
    function formatPhone(phone) {
        let value = phone.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            value = '+7' + value.substring(1);
        } else if (!value.startsWith('+7') && value.length > 0) {
            value = '+7' + value;
        }
        
        if (value.length > 2) {
            value = value.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
        }
        
        return value;
    }
    
    /**
     * Создание короткого сообщения для Telegram
     * @param {Object} data - Данные формы
     * @returns {string} - Короткое сообщение
     */
    function createShortTelegramMessage(data) {
        let message = `📋 Заявка с сайта МИРУМ\n\n`;
        
        if (data.name) message += `👤 Имя: ${data.name}\n`;
        if (data.phone) message += `📞 Телефон: ${data.phone}\n`;
        if (data.email) message += `📧 Email: ${data.email}\n`;
        if (data.company) message += `🏢 Компания: ${data.company}\n`;
        if (data.city) message += `📍 Город: ${data.city}\n`;
        if (data.service) message += `🔧 Услуга: ${data.service}\n`;
        
        if (data.message && data.message.length > 100) {
            message += `📝 Сообщение: ${data.message.substring(0, 100)}...\n`;
        } else if (data.message) {
            message += `📝 Сообщение: ${data.message}\n`;
        }
        
        message += `\n🌐 Страница: ${window.location.href}\n`;
        message += `🕒 Время: ${new Date().toLocaleTimeString('ru-RU')}`;
        
        // Ограничиваем длину сообщения
        if (message.length > 500) {
            message = message.substring(0, 497) + '...';
        }
        
        return message;
    }
    
    /**
     * Открытие Telegram с сообщением (улучшенная версия)
     * @param {string} message - Сообщение для отправки
     * @returns {boolean} - Успешно ли выполнено
     */
    function openTelegramWithMessage(message) {
        try {
            // Используем метод копирования текста для надежности
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = message;
            tempTextArea.style.position = 'fixed';
            tempTextArea.style.left = '-9999px';
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}`;
                    window.open(telegramUrl, '_blank');
                    
                    setTimeout(() => {
                        alert('✅ Текст сообщения скопирован!\n\n' +
                              '1. В открывшемся Telegram нажмите на поле ввода сообщения\n' +
                              '2. Вставьте текст (Ctrl+V или долгое нажатие → Вставить)\n' +
                              '3. Отправьте сообщение\n\n' +
                              'Свяжемся с вами, как можно скорее!');
                    }, 1000);
                    return true;
                }
            } catch (err) {
                console.error('Не удалось скопировать текст:', err);
            } finally {
                document.body.removeChild(tempTextArea);
            }
            
            // Fallback: старая логика для совместимости
            const encodedMessage = encodeURIComponent(message);
            const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}?text=${encodedMessage}`;
            
            // Проверяем длину URL
            if (telegramUrl.length > 2000) {
                // Создаем еще более короткое сообщение
                const shortMessage = message.length > 200 ? message.substring(0, 197) + '...' : message;
                const shortEncoded = encodeURIComponent(shortMessage);
                const shortUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}?text=${shortEncoded}`;
                
                if (shortUrl.length > 2000) {
                    alert('Сообщение слишком длинное. Пожалуйста, свяжитесь с нами напрямую через Telegram: @+79770005127');
                    return false;
                }
                
                window.open(shortUrl, '_blank');
            } else {
                window.open(telegramUrl, '_blank');
            }
            
            setTimeout(() => {
                alert('✅ Telegram открыт!\n\n' +
                      'Нажмите "Отправить" чтобы отправить заявку.\n' +
                      'Свяжемся с вами, как можно скорее!');
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('Ошибка при открытии Telegram:', error);
            
            // Показываем сообщение с инструкцией
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
                <div style="background: white; padding: 25px; border-radius: 10px; max-width: 500px; width: 100%;">
                    <h3 style="color: #e74c3c; margin-bottom: 15px;">Не удалось открыть Telegram</h3>
                    <p>Пожалуйста, отправьте сообщение вручную:</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Telegram:</p>
                        <p style="margin: 0; font-size: 1.1rem; color: #2c3e50;">@+79770005127</p>
                    </div>
                    <p>Скопируйте текст ниже и отправьте его в Telegram:</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="copyFormText()" style="padding: 12px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Копировать текст</button>
                        <button onclick="this.closest('.modal').remove()" style="padding: 12px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
                    </div>
                </div>
            `;
            
            modal.classList.add('modal');
            document.body.appendChild(modal);
            
            // Добавляем функцию копирования
            window.copyFormText = function() {
                const textDiv = modal.querySelector('div[style*="font-family: monospace"]');
                const text = textDiv.textContent || textDiv.innerText;
                
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = text;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                
                try {
                    document.execCommand('copy');
                    const copyBtn = modal.querySelector('button[onclick*="copyFormText"]');
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.background = '#27ae60';
                    setTimeout(() => {
                        copyBtn.textContent = 'Копировать текст';
                        copyBtn.style.background = '#3498db';
                    }, 2000);
                } catch (err) {
                    console.error('Не удалось скопировать:', err);
                } finally {
                    document.body.removeChild(tempTextArea);
                }
            };
            
            return false;
        }
    }
    
    /**
     * Показать сообщение об успехе
     * @param {string} message - Текст сообщения
     */
    function showSuccess(message) {
        alert('✅ ' + message);
    }
    
    /**
     * Показать сообщение об ошибке
     * @param {string} message - Текст сообщения
     */
    function showError(message) {
        alert('❌ ' + message);
    }
    
    /**
     * Показать уведомление (toast)
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип (success, error, info)
     */
    function showToast(message, type = 'info') {
        // Удаляем существующие уведомления
        const existingToast = document.querySelector('.form-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Создаем уведомление
        const toast = document.createElement('div');
        toast.className = 'form-toast';
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
        if (!document.querySelector('#form-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'form-toast-styles';
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
    
    // ============ ОБРАБОТКА ФОРМ ============
    
    /**
     * Обработка формы обратной связи
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем согласие
            const consentCheckbox = document.getElementById('contactConsent');
            if (!consentCheckbox || !consentCheckbox.checked) {
                showError('Пожалуйста, дайте согласие на обработку персональных данных');
                consentCheckbox?.focus();
                return;
            }
            
            // Собираем данные
            const name = document.getElementById('contactName')?.value.trim() || '';
            const email = document.getElementById('contactEmail')?.value.trim() || '';
            const phone = document.getElementById('contactPhone')?.value.trim() || '';
            const message = document.getElementById('contactMessage')?.value.trim() || '';
            
            // Валидация
            if (!name) {
                showError('Пожалуйста, введите ваше имя');
                document.getElementById('contactName')?.focus();
                return;
            }
            
            if (!phone || !validatePhone(phone)) {
                showError('Пожалуйста, введите корректный номер телефона');
                document.getElementById('contactPhone')?.focus();
                return;
            }
            
            if (email && !validateEmail(email)) {
                showError('Пожалуйста, введите корректный email адрес');
                document.getElementById('contactEmail')?.focus();
                return;
            }
            
            // Формируем сообщение для Telegram
            const telegramMessage = createShortTelegramMessage({
                name,
                phone: formatPhone(phone),
                email,
                message
            });
            
            // Открываем Telegram
            const success = openTelegramWithMessage(telegramMessage);
            
            if (success) {
                // Очищаем форму
                form.reset();
                showToast('Заявка отправлена! Свяжемся с вами, как можно скорее', 'success');
            }
        });
        
        // Автоформатирование телефона
        const phoneInput = document.getElementById('contactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }
    }
    
    /**
     * Обработка формы заявки на мойку витрин
     */
    function initWindowCleaningForm() {
        const form = document.getElementById('window-cleaning-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем согласие
            const consentCheckbox = document.getElementById('privacy-agreement');
            if (!consentCheckbox || !consentCheckbox.checked) {
                showError('Пожалуйста, дайте согласие на обработку персональных данных');
                consentCheckbox?.focus();
                return;
            }
            
            // Собираем данные
            const company = document.getElementById('company')?.value.trim() || '';
            const city = document.getElementById('city')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const serviceType = document.getElementById('service-type')?.value || '';
            const message = document.getElementById('message')?.value.trim() || '';
            
            // Валидация
            if (!company) {
                showError('Пожалуйста, введите название компании');
                document.getElementById('company')?.focus();
                return;
            }
            
            if (!city) {
                showError('Пожалуйста, введите город');
                document.getElementById('city')?.focus();
                return;
            }
            
            if (!phone || !validatePhone(phone)) {
                showError('Пожалуйста, введите корректный номер телефона');
                document.getElementById('phone')?.focus();
                return;
            }
            
            // Текст услуги
            const serviceTypeText = {
                'regular': 'Регулярная мойка',
                'one-time': 'Разовая мойка',
                'complex': 'Комплексная мойка фасада',
                'subscription': 'Абонентское обслуживание',
                '': 'Не указано'
            }[serviceType] || 'Не указано';
            
            // Формируем сообщение для Telegram
            const telegramMessage = createShortTelegramMessage({
                company,
                city,
                phone: formatPhone(phone),
                service: serviceTypeText,
                message
            });
            
            // Открываем Telegram
            const success = openTelegramWithMessage(telegramMessage);
            
            if (success) {
                // Очищаем форму
                form.reset();
                showToast('Заявка на мойку витрин отправлена!', 'success');
            }
        });
    }
    
    /**
     * Обработка быстрой формы на главной
     */
    function initQuickForm() {
        const form = document.getElementById('quickContactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем согласие
            const consentCheckbox = document.getElementById('quickConsent');
            if (!consentCheckbox || !consentCheckbox.checked) {
                showError('Пожалуйста, дайте согласие на обработку персональных данных');
                consentCheckbox?.focus();
                return;
            }
            
            // Собираем данные
            const name = document.getElementById('quickName')?.value.trim() || '';
            const phone = document.getElementById('quickPhone')?.value.trim() || '';
            const service = document.getElementById('quickService')?.value || '';
            
            // Валидация
            if (!name) {
                showError('Пожалуйста, введите ваше имя');
                document.getElementById('quickName')?.focus();
                return;
            }
            
            if (!phone || !validatePhone(phone)) {
                showError('Пожалуйста, введите корректный номер телефона');
                document.getElementById('quickPhone')?.focus();
                return;
            }
            
            // Текст услуги
            const serviceText = {
                'kovry': 'Аренда ковров',
                'vitriny': 'Мойка витрин',
                'poly': 'Восстановление полов',
                'outstaffing': 'Аутстаффинг',
                '': 'Не указана'
            }[service] || 'Не указана';
            
            // Формируем сообщение для Telegram
            const telegramMessage = createShortTelegramMessage({
                name,
                phone: formatPhone(phone),
                service: serviceText
            });
            
            // Открываем Telegram
            const success = openTelegramWithMessage(telegramMessage);
            
            if (success) {
                // Очищаем форму
                form.reset();
                showToast('Быстрая заявка отправлена!', 'success');
            }
        });
    }
    
    /**
     * Инициализация всех форм на странице
     */
    function initAllForms() {
        console.log('📝 Инициализация форм на странице');
        
        initContactForm();
        initWindowCleaningForm();
        initQuickForm();
        
        // Инициализация автоформатирования телефона во всех формах
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        });
        
        // Инициализация форм на странице калькулятора
        initCalculatorContactForm();
        
        console.log(`✅ Формы инициализированы`);
    }
    
    /**
     * Обработка формы контактов на странице калькулятора
     */
    function initCalculatorContactForm() {
        const form = document.getElementById('calculatorContactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const consentCheckbox = document.getElementById('calcConsent');
            if (!consentCheckbox || !consentCheckbox.checked) {
                showError('Пожалуйста, дайте согласие на обработку персональных данных');
                consentCheckbox?.focus();
                return;
            }
            
            const name = document.getElementById('calcName')?.value.trim() || '';
            const phone = document.getElementById('calcPhone')?.value.trim() || '';
            const question = document.getElementById('calcQuestion')?.value.trim() || '';
            
            if (!name) {
                showError('Пожалуйста, введите ваше имя');
                document.getElementById('calcName')?.focus();
                return;
            }
            
            if (!phone || !validatePhone(phone)) {
                showError('Пожалуйста, введите корректный номер телефона');
                document.getElementById('calcPhone')?.focus();
                return;
            }
            
            const message = `❓ ВОПРОС ПО КАЛЬКУЛЯТОРУ АРЕНДЫ КОВРОВ ❓\n\n` +
                           `👤 Имя: ${name}\n` +
                           `📞 Телефон: ${formatPhone(phone)}\n` +
                           `${question ? `❓ Вопрос:\n${question}\n\n` : ''}` +
                           `🌐 Страница: Калькулятор\n` +
                           `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            const success = openTelegramWithMessage(message);
            
            if (success) {
                form.reset();
                showToast('Вопрос отправлен! Свяжемся с вами, как можно скорее', 'success');
            }
        });
        
        // Автоформатирование телефона
        const phoneInput = document.getElementById('calcPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', initAllForms);
    
    // ============ ЭКСПОРТ ============
    window.FormsManager = {
        initAllForms,
        validatePhone,
        validateEmail,
        formatPhone,
        createShortTelegramMessage,
        openTelegramWithMessage,
        showToast
    };
    
})();
// ============ КОНЕЦ FORMS.JS ============