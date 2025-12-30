/* Дополнительные стили для мобильного калькулятора */
@media (max-width: 768px) {
    /* Улучшенная кнопка удаления */
    .btn-remove {
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    /* Адаптивная форма */
    .send-form {
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .send-form .form-group {
        margin-bottom: 15px;
    }
    
    .send-form input {
        width: 100%;
        padding: 12px;
        font-size: 16px; /* Предотвращает масштабирование iOS */
    }
    
    /* Уведомления */
    .alert {
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
        border: 1px solid transparent;
    }
    
    .alert-success {
        background-color: #d4edda;
        border-color: #c3e6cb;
        color: #155724;
    }
    
    .alert-warning {
        background-color: #fff3cd;
        border-color: #ffeaa7;
        color: #856404;
    }
    
    /* Вкладки на мобильных */
    .calculator-tabs {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 5px;
        margin-bottom: 20px;
        -webkit-overflow-scrolling: touch;
    }
    
    .tab-btn {
        flex-shrink: 0;
        padding: 12px 20px;
        margin-right: 5px;
    }
    
    /* Герой секция компактнее */
    .calculator-hero .hero-content {
        padding: 0 10px;
    }
    
    /* Улучшенная видимость на маленьких экранах */
    .result-table td, .result-table th {
        font-size: 14px;
        padding: 8px 4px;
    }
    
    /* Кнопки действий в один столбец */
    .send-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .send-buttons .btn {
        width: 100%;
    }
    
    /* Заголовки секций */
    .section-title h2 {
        font-size: 1.4rem;
        margin-bottom: 10px;
    }
    
    .section-title p {
        font-size: 0.9rem;
        line-height: 1.4;
    }
}

/* Для очень маленьких экранов */
@media (max-width: 480px) {
    .calculator-hero h1 {
        font-size: 1.5rem !important;
    }
    
    .hero-subtitle {
        font-size: 0.85rem !important;
    }
    
    .feature-badge {
        font-size: 0.7rem !important;
        padding: 5px 8px !important;
    }
    
    .tab-btn {
        padding: 10px 15px !important;
        font-size: 0.8rem !important;
    }
    
    /* Улучшенное отображение таблиц */
    .result-table {
        font-size: 12px;
    }
    
    .result-table th, .result-table td {
        padding: 6px 3px;
        min-width: 60px;
    }
    
    /* Формы */
    .form-group label {
        font-size: 0.85rem;
    }
    
    .form-group select, .form-group input {
        font-size: 16px; /* Предотвращает масштабирование */
        height: 46px;
    }
    
    /* Кнопки */
    .btn {
        padding: 14px 10px;
        font-size: 0.95rem;
    }
}