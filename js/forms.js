// ============================================
// FORMS.JS - Обработка всех форм на сайте
// Версия: 8.0 (20.02.2026) - С ЯВНЫМ СОГЛАСИЕМ НА ОБРАБОТКУ ПДн
// ============================================

(function() {
    'use strict';
    
    console.log('📋 Инициализация обработки форм');
    
    // ============ КОНСТАНТЫ И НАСТРОЙКИ ============
    const TELEGRAM_CHAT_ID = '+79581118514';
    const DEFAULT_EMAIL = 'matservice@yandex.ru';
    
    // ============ УТИЛИТНЫЕ ФУНКЦИИ ============
    
    /**
     * Валидация телефона
     */
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return /^[78]\d{10}$/.test(cleanPhone);
    }
    
    /**
     * Валидация email
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Форматирование телефона
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
     * Создание сообщения для Telegram
     */
    function createShortTelegramMessage(data) {
        let message = `📋 Заявка с сайта МИРУМ\n\n`;
        
        if (data.name) message += `👤 Имя: ${data.name}\n`;
        if (data.phone) message += `📞 Телефон: ${data.phone}\n`;
        if (data.email) message += `📧 Email: ${data.email}\n`;
        if (data.company) message += `🏢 Компания: ${data.company}\n`;
        if (data.city) message += `📍 Город: ${data.city}\n`;
        if (data.service) message += `🔧 Услуга: ${data.service}\n`;
        
        if (data.message) {
            message += `📝 Сообщение: ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}\n`;
        }
        
        message += `\n🌐 Страница: ${window.location.href}\n`;
        message += `🕒 Время: ${new Date().toLocaleString('ru-RU')}`;
        
        return message;
    }
    
    /**
     * Показать уведомление (toast)
     */
    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.form-toast');
        if (existingToast) existingToast.remove();
        
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
            z-index: 100000;
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
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Показать сообщение об ошибке
     */
    function showError(message) {
        showToast(message, 'error');
    }
    
    /**
     * Показать сообщение об успехе
     */
    function showSuccess(message) {
        showToast(message, 'success');
    }
    
    /**
     * Открыть Telegram с сообщением
     */
    function openTelegramWithMessage(message) {
        try {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = message;
            tempTextArea.style.position = 'fixed';
            tempTextArea.style.left = '-9999px';
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            
            const successful = document.execCommand('copy');
            if (successful) {
                const telegramUrl = `https://t.me/${TELEGRAM_CHAT_ID}`;
                window.open(telegramUrl, '_blank');
                
                setTimeout(() => {
                    showSuccess('Текст сообщения скопирован! Вставьте его в Telegram и отправьте.');
                }, 1000);
                return true;
            }
        } catch (err) {
            console.error('Ошибка копирования:', err);
            
            const encodedMessage = encodeURIComponent(message);
            const fallbackUrl = `https://t.me/${TELEGRAM_CHAT_ID}?text=${encodedMessage}`;
            window.open(fallbackUrl, '_blank');
            return true;
        }
        return false;
    }
    
    /**
     * Отправка формы с явным согласием
     */
    function submitFormWithConsent(formData, formElement) {
        const message = createShortTelegramMessage(formData);
        const success = openTelegramWithMessage(message);
        
        if (success) {
            formElement.reset();
            showSuccess('Заявка отправлена! Свяжемся с вами, как можно скорее.');
            
            // Отправляем в аналитику
            if (typeof ym !== 'undefined') {
                ym(100898517, 'reachGoal', 'form_consent_given');
            }
        }
    }
    
    /**
     * Общий обработчик отправки формы
     */
    function handleFormSubmit(e, formId, fields) {
        e.preventDefault();
        
        const form = e.target;
        const formData = {};
        
        // Собираем данные
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                formData[field.name] = element.value.trim();
            }
        });
        
        // Проверяем обязательные поля
        for (let field of fields) {
            if (field.required && !formData[field.name]) {
                showError(`Пожалуйста, заполните поле ${field.label}`);
                document.getElementById(field.id)?.focus();
                return;
            }
        }
        
        // Проверяем телефон
        if (formData.phone && !validatePhone(formData.phone)) {
            showError('Пожалуйста, введите корректный номер телефона');
            document.getElementById('calcPhone')?.focus();
            return;
        }
        
        // Проверяем email
        if (formData.email && !validateEmail(formData.email)) {
            showError('Пожалуйста, введите корректный email адрес');
            document.getElementById('calcEmail')?.focus();
            return;
        }
        
        // Показываем модальное окно с согласием
        if (typeof window.showConsentModal === 'function') {
            window.showConsentModal(formData, form);
        }
    }
    
    // ============ ИНИЦИАЛИЗАЦИЯ ФОРМ ============
    
    function initCalculatorContactForm() {
        const form = document.getElementById('calculatorContactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'calculatorContactForm', [
                { name: 'name', id: 'calcName', label: 'Имя', required: true },
                { name: 'phone', id: 'calcPhone', label: 'Телефон', required: true },
                { name: 'question', id: 'calcQuestion', label: 'Вопрос', required: false }
            ]);
        });
        
        // Форматирование телефона
        const phoneInput = document.getElementById('calcPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }
    }
    
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            handleFormSubmit(e, 'contactForm', [
                { name: 'name', id: 'contactName', label: 'Имя', required: true },
                { name: 'email', id: 'contactEmail', label: 'Email', required: false },
                { name: 'phone', id: 'contactPhone', label: 'Телефон', required: true },
                { name: 'message', id: 'contactMessage', label: 'Сообщение', required: false }
            ]);
        });
        
        const phoneInput = document.getElementById('contactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }
    }
    
    function initWindowCleaningForm() {
        const form = document.getElementById('window-cleaning-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            const serviceType = document.getElementById('service-type');
            const serviceTypeText = {
                'regular': 'Регулярная мойка',
                'one-time': 'Разовая мойка',
                'complex': 'Комплексная мойка фасада',
                'subscription': 'Абонентское обслуживание',
                '': 'Не указано'
            }[serviceType?.value] || 'Не указано';
            
            handleFormSubmit(e, 'window-cleaning-form', [
                { name: 'company', id: 'company', label: 'Компания', required: true },
                { name: 'city', id: 'city', label: 'Город', required: true },
                { name: 'phone', id: 'phone', label: 'Телефон', required: true },
                { name: 'service', id: 'service-type', label: 'Услуга', required: false },
                { name: 'message', id: 'message', label: 'Сообщение', required: false }
            ]);
            
            // Добавляем выбранную услугу
            if (serviceType) {
                e.target.querySelector('#service-type').value = serviceTypeText;
            }
        });
    }
    
    function initQuickForm() {
        const form = document.getElementById('quickContactForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            const service = document.getElementById('quickService');
            const serviceText = {
                'kovry': 'Аренда ковров',
                'vitriny': 'Мойка витрин',
                'poly': 'Восстановление полов',
                'outstaffing': 'Аутстаффинг',
                '': 'Не указана'
            }[service?.value] || 'Не указана';
            
            handleFormSubmit(e, 'quickContactForm', [
                { name: 'name', id: 'quickName', label: 'Имя', required: true },
                { name: 'phone', id: 'quickPhone', label: 'Телефон', required: true },
                { name: 'service', id: 'quickService', label: 'Услуга', required: false }
            ]);
            
            if (service) {
                e.target.querySelector('#quickService').value = serviceText;
            }
        });
    }
    
    function initAllForms() {
        console.log('📝 Инициализация форм на странице');
        
        initCalculatorContactForm();
        initContactForm();
        initWindowCleaningForm();
        initQuickForm();
        
        // Форматирование всех телефонных полей
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        });
        
        console.log('✅ Формы инициализированы');
    }
    
    // ============ ЭКСПОРТ ============
    window.FormsManager = {
        initAllForms,
        validatePhone,
        validateEmail,
        formatPhone,
        createShortTelegramMessage,
        openTelegramWithMessage,
        showToast,
        submitFormWithConsent
    };
    
    // Автоматическая инициализация
    document.addEventListener('DOMContentLoaded', initAllForms);
    
})();