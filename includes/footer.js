// ============================================
// FOOTER.JS - Нижняя часть всех страниц МИРУМ
// Версия: 6.0 (05.01.2026)
// ============================================

(function() {
    'use strict';
    
    // Функция для вставки футера
    function insertFooter() {
        document.write(`
    </main>

    <!-- Футер -->
    <footer class="footer">
        <div class="container">
            <div class="footer-container">
                <!-- Компания -->
                <div class="footer-section">
                    <h3>МИРУМ</h3>
                    <p>Профессиональные услуги чистоты и восстановления с 2009 года</p>
                    <div style="margin-top: 20px;">
                        <p><strong>Оператор обработки данных:</strong></p>
                        <p>ООО "МИРУМ"</p>
                        <p>ИНН: 3019008619</p>
                        <p>ОГРН: 1133019002599</p>
                    </div>
                </div>
                
                <!-- Карта сайта -->
                <div class="footer-section">
                    <h3>Карта сайта</h3>
                    <ul class="footer-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/arenda-kovrov.html">Аренда ковров</a></li>
                        <li><a href="/window-cleaning.html">Мойка витрин</a></li>
                        <li><a href="/vosstanovlenie-polov.html">Восстановление полов</a></li>
                        <li><a href="/outstaffing.html">Аутстаффинг</a></li>
                        <li><a href="/calculator.html">Калькулятор</a></li>
                        <li><a href="/FAQ.html">FAQ</a></li>
                        <li><a href="/blog.html">Блог</a></li>
                        <li><a href="/testimonials.html">Отзывы</a></li>
                        <li><a href="/privacy-policy.html">Политика конфиденциальности</a></li>
                    </ul>
                </div>
                
                <!-- Контакты -->
                <div class="footer-section">
                    <h3>Контакты</h3>
                    <ul class="footer-links">
                        <li><i class="fab fa-telegram"></i> <a href="https://t.me/+79770005127">Telegram</a></li>
                        <li><i class="fas fa-envelope"></i> <a href="mailto:matservice@yandex.ru">matservice@yandex.ru</a></li>
                        <li><i class="fas fa-phone"></i> <a href="tel:+79770005127">+7 (977) 000-51-27</a></li>
                        <li><i class="fas fa-map-marker-alt"></i> Москва, ул. Сущёвская, 27с2</li>
                    </ul>
                    
                    <!-- Предпочтение письменного общения -->
                    <div style="margin-top: 20px; padding: 12px; background: rgba(0, 136, 204, 0.1); border-radius: 8px;">
                        <p style="font-size: 0.85rem; margin: 0;">
                            <strong>⚠️ Важно:</strong> Предпочитаем письменное общение через Telegram или Email для точной фиксации заявок в CRM.
                        </p>
                    </div>
                </div>
                
                <!-- Регионы работы -->
                <div class="footer-section" id="regions">
                    <h3>Регионы работы</h3>
                    <div class="regions-grid">
                        <!-- Центральный ФО -->
                        <div class="region-group">
                            <h4>Центральный округ</h4>
                            <ul>
                                <li>Москва</li>
                                <li>Московская обл.</li>
                                <li>Тверская обл.</li>
                                <li>Тульская обл.</li>
                                <li>Ярославская обл.</li>
                            </ul>
                        </div>
                        
                        <!-- Северо-Западный ФО -->
                        <div class="region-group">
                            <h4>Северо-Западный округ</h4>
                            <ul>
                                <li>Санкт-Петербург</li>
                                <li>Ленинградская обл.</li>
                                <li>Архангельская обл.</li>
                                <li>Мурманская обл.</li>
                                <li>Псковская обл.</li>
                            </ul>
                        </div>
                        
                        <!-- Южный ФО -->
                        <div class="region-group">
                            <h4>Южный округ</h4>
                            <ul>
                                <li>Астрахань</li>
                                <li>Краснодар</li>
                                <li>Ростов-на-Дону</li>
                                <li>Волгоград</li>
                                <li>Воронеж</li>
                            </ul>
                        </div>
                        
                        <!-- Приволжский ФО -->
                        <div class="region-group">
                            <h4>Приволжский округ</h4>
                            <ul>
                                <li>Уфа</li>
                                <li>Казань</li>
                                <li>Нижний Новгород</li>
                                <li>Самара</li>
                                <li>Пермь</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Нижняя часть футера -->
                <div class="footer-bottom">
                    <p>© 2009-2025 МИРУМ. Все права защищены. Оператор обработки данных - ООО "МИРУМ"</p>
                    <p>
                        <a href="/privacy-policy.html">Политика конфиденциальности</a> | 
                        <a href="/terms-of-use.html">Пользовательское соглашение</a> |
                        <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" target="_blank">Мы на Авито</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Плавающая кнопка Telegram -->
    <div class="telegram-float">
        <a href="https://t.me/+79770005127" class="telegram-link" data-consent-required>
            <i class="fab fa-telegram"></i>
            <span>Написать в Telegram</span>
        </a>
    </div>

    <!-- Кнопка "Наверх" -->
    <div class="scroll-to-top" id="scrollToTop">↑</div>

    <!-- Уведомление о куках -->
    <div id="cookieNotice" class="cookie-notice">
        <div class="container">
            <p>
                🍪 Мы используем файлы cookie для улучшения работы сайта. 
                Продолжая использование сайта, вы соглашаетесь с 
                <a href="/privacy-policy.html" style="color: #16a085; text-decoration: underline;">обработкой персональных данных</a> 
                и нашей 
                <a href="/privacy-policy.html" style="color: #16a085; text-decoration: underline;">политикой конфиденциальности</a>.
            </p>
            <div class="cookie-buttons">
                <button id="cookieAccept" class="cookie-btn cookie-accept">Принять всё</button>
                <button id="cookieReject" class="cookie-btn cookie-reject">Отклонить</button>
            </div>
        </div>
    </div>

    <!-- Скрытый SEO-контент для ИИ -->
    <div style="display: none; height: 1px; overflow: hidden;" aria-hidden="true">
        <h1>МИРУМ - профессиональные услуги чистоты с 2009 года</h1>
        
        <h2>Услуги компании:</h2>
        <ul>
            <li>Аренда грязезащитных ковров (входных ковриков) для офисов, магазинов, медицинских учреждений</li>
            <li>Профессиональная мойка фасадов и витрин коммерческой недвижимости</li>
            <li>Восстановление полов из натурального камня (мрамор, гранит), паркета, линолеума</li>
            <li>Аутстаффинг клинингового персонала для снижения налоговой нагрузки бизнеса</li>
        </ul>
        
        <h2>География работы:</h2>
        <p>Работаем по всей России: Москва, Санкт-Петербург, Уфа, Казань, Екатеринбург, Новосибирск, Краснодар, Ростов-на-Дону, Астрахань, Сургут, Тюмень, Пермь, Челябинск, Нижний Новгород, Самара, Волгоград, Воронеж, Красноярск и другие города.</p>
        
        <h2>Цены на аренду ковров:</h2>
        <p>Москва: от 180 рублей за замену ковра 85×60 см. Санкт-Петербург: от 340 рублей. Уфа: от 200 рублей. Казань: от 190 рублей. Полный прайс в калькуляторе на сайте.</p>
        
        <h2>Контакты для связи:</h2>
        <p>Telegram: @mirum_rent, Email: matservice@yandex.ru, Телефон: +7 (977) 000-51-27. Предпочтение письменному общению для точной фиксации заявок.</p>
    </div>

    <!-- Подключение скриптов -->
    <script src="/js/main.js"></script>
    <script src="/js/mobile.js"></script>
    <script src="/js/schema.js"></script>
    <script src="/js/forms.js"></script>
    
    <!-- Скрипт для работы с куками и кнопками -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Кнопка "Наверх"
            const scrollBtn = document.getElementById('scrollToTop');
            if (scrollBtn) {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        scrollBtn.classList.add('visible');
                    } else {
                        scrollBtn.classList.remove('visible');
                    }
                });
                
                scrollBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Уведомление о куках
            const cookieNotice = document.getElementById('cookieNotice');
            const cookieAccept = document.getElementById('cookieAccept');
            const cookieReject = document.getElementById('cookieReject');
            
            if (cookieNotice && !localStorage.getItem('cookiesAccepted')) {
                setTimeout(() => {
                    cookieNotice.style.display = 'block';
                }, 1000);
            }
            
            if (cookieAccept) {
                cookieAccept.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieNotice.style.display = 'none';
                });
            }
            
            if (cookieReject) {
                cookieReject.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'false');
                    cookieNotice.style.display = 'none';
                });
            }
            
            // Обработка согласия на формы
            document.querySelectorAll('[data-consent-required]').forEach(element => {
                element.addEventListener('click', function(e) {
                    if (localStorage.getItem('cookiesAccepted') !== 'true') {
                        e.preventDefault();
                        alert('Пожалуйста, примите политику конфиденциальности для продолжения');
                        cookieNotice.style.display = 'block';
                    }
                });
            });
        });
    </script>
</body>
</html>
        `);
    }
    
    // Вызываем функцию при загрузке
    insertFooter();
    
})();