// ============================================
// FORMS.JS - Обработка всех форм на сайте
// Версия: 6.0 (05.01.2026)
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
     * Показать сообщение об успехе
     * @param {string} message - Текст сообщения
     */
    function showSuccess(message) {
        alert(message);
    }
    
    /**
     * Показать сообщение об ошибке
     * @param {string} message - Текст сообщения
     */
    function showError(message) {
        alert('❌ ' + message);
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
            const telegramMessage = `📋 НОВАЯ ЗАЯВКА С САЙТА 📋\n\n` +
                                  `👤 Имя: ${name}\n` +
                                  `📞 Телефон: ${formatPhone(phone)}\n` +
                                  (email ? `📧 Email: ${email}\n` : '') +
                                  (message ? `📝 Сообщение:\n${message}\n` : '') +
                                  `🌐 Страница: ${window.location.href}\n` +
                                  `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            // Открываем Telegram
            const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}?text=${encodeURIComponent(telegramMessage)}`;
            window.open(telegramUrl, '_blank');
            
            // Очищаем форму
            form.reset();
            
            // Показываем сообщение об успехе
            showSuccess('Открывается Telegram с готовым сообщением. Просто нажмите "Отправить"!');
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
            
            // Формируем сообщение для Telegram
            const serviceTypeText = {
                'regular': 'Регулярная мойка',
                'one-time': 'Разовая мойка',
                'complex': 'Комплексная мойка фасада',
                'subscription': 'Абонентское обслуживание',
                '': 'Не указано'
            }[serviceType] || 'Не указано';
            
            const telegramMessage = `📋 ЗАЯВКА НА МОЙКУ ВИТРИН 📋\n\n` +
                                  `🏢 Компания: ${company}\n` +
                                  `📍 Город: ${city}\n` +
                                  `📞 Телефон: ${formatPhone(phone)}\n` +
                                  `🔧 Тип услуги: ${serviceTypeText}\n` +
                                  (message ? `📝 Дополнительно:\n${message}\n` : '') +
                                  `🌐 Страница: ${window.location.href}\n` +
                                  `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            // Открываем Telegram
            const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}?text=${encodeURIComponent(telegramMessage)}`;
            window.open(telegramUrl, '_blank');
            
            // Очищаем форму
            form.reset();
            
            // Показываем сообщение об успехе
            showSuccess('Открывается Telegram с готовым сообщением. Просто нажмите "Отправить"!');
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
            const telegramMessage = `📋 БЫСТРАЯ ЗАЯВКА С САЙТА 📋\n\n` +
                                  `👤 Имя: ${name}\n` +
                                  `📞 Телефон: ${formatPhone(phone)}\n` +
                                  `🔧 Услуга: ${serviceText}\n\n` +
                                  `🌐 Страница: ${window.location.href}\n` +
                                  `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
            
            // Открываем Telegram
            const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID.replace('+', '')}?text=${encodeURIComponent(telegramMessage)}`;
            window.open(telegramUrl, '_blank');
            
            // Очищаем форму
            form.reset();
            
            // Показываем сообщение об успехе
            showSuccess('Открывается Telegram с готовым сообщением. Просто нажмите "Отправить"!');
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
        
        console.log(`✅ Формы инициализированы`);
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ============
    document.addEventListener('DOMContentLoaded', initAllForms);
    
    // ============ ЭКСПОРТ ============
    window.FormsManager = {
        initAllForms,
        validatePhone,
        validateEmail,
        formatPhone
    };
    
})();
// ============ КОНЕЦ FORMS.JS ============