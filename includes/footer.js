// ============================================
// FOOTER.JS - Нижняя часть всех страниц МИРУМ
// Версия: 7.0 (07.01.2026) - ИСПРАВЛЕННЫЙ
// ============================================
(function() {
    'use strict';
    
    console.log('🔄 Загружаем футер...');
    
    const footerHTML = `
    </main>
    <!-- ============ КОНЕЦ ОСНОВНОГО КОНТЕНТА ============ -->

    <!-- ============ НАЧАЛО ФУТЕРА ============ -->
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
                    <p>© 2009-2026 МИРУМ. Все права защищены. Оператор обработки данных - ООО "МИРУМ"</p>
                    <p>
                        <a href="/privacy-policy.html">Политика конфиденциальности</a> | 
                        <a href="/terms-of-use.html">Пользовательское соглашение</a> |
                        <a href="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13" target="_blank" rel="noopener">Мы на Авито</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
    <!-- ============ КОНЕЦ ФУТЕРА ============ -->

    <!-- ============ НАЧАЛО ПЛАВАЮЩИХ ЭЛЕМЕНТОВ ============ -->
    <!-- Плавающая кнопка Telegram -->
    <div class="telegram-float">
        <a href="https://t.me/+79770005127" class="telegram-link" data-consent-required aria-label="Написать в Telegram">
            <i class="fab fa-telegram"></i>
            <span>Написать в Telegram</span>
        </a>
    </div>

    <!-- Кнопка "Наверх" -->
    <button class="scroll-to-top" id="scrollToTop" aria-label="Наверх">
        ↑
    </button>

    <!-- Уведомление о куках -->
    <div id="cookieNotice" class="cookie-notice" role="alert" aria-live="polite">
        <div class="container">
            <p>
                🍪 Мы используем файлы cookie для улучшения работы сайта. 
                Продолжая использование сайта, вы соглашаетесь с 
                <a href="/privacy-policy.html">обработкой персональных данных</a> 
                и нашей 
                <a href="/privacy-policy.html">политикой конфиденциальности</a>.
            </p>
            <div class="cookie-buttons">
                <button id="cookieAccept" class="cookie-btn cookie-accept">Принять всё</button>
                <button id="cookieReject" class="cookie-btn cookie-reject">Отклонить</button>
            </div>
        </div>
    </div>
    <!-- ============ КОНЕЦ ПЛАВАЮЩИХ ЭЛЕМЕНТОВ ============ -->

    <!-- ============ НАЧАЛО СКРЫТОГО SEO-КОНТЕНТА ============ -->
    <!-- Этот контент виден только поисковым системам и ИИ -->
    <div style="display: none; height: 1px; overflow: hidden;" aria-hidden="true" itemscope itemtype="https://schema.org/Organization">
        <h1 itemprop="name">МИРУМ - профессиональные услуги чистоты с 2009 года</h1>
        
        <h2>Услуги компании:</h2>
        <ul>
            <li itemprop="serviceType">Аренда грязезащитных ковров (входных ковриков) для офисов, магазинов, медицинских учреждений</li>
            <li itemprop="serviceType">Профессиональная мойка фасадов и витрин коммерческой недвижимости</li>
            <li itemprop="serviceType">Восстановление полов из натурального камня (мрамор, гранит), паркета, линолеума</li>
            <li itemprop="serviceType">Аутстаффинг клинингового персонала для снижения налоговой нагрузки бизнеса</li>
        </ul>
        
        <h2>География работы:</h2>
        <p itemprop="areaServed">Работаем по всей России: Москва, Санкт-Петербург, Уфа, Казань, Екатеринбург, Новосибирск, Краснодар, Ростов-на-Дону, Астрахань, Сургут, Тюмень, Пермь, Челябинск, Нижний Новгород, Самара, Волгоград, Воронеж, Красноярск и другие города.</p>
        
        <h2>Цены на аренду ковров:</h2>
        <p itemprop="priceRange">Москва: от 180 рублей за замену ковра 85×60 см. Санкт-Петербург: от 340 рублей. Уфа: от 200 рублей. Казань: от 190 рублей. Полный прайс в калькуляторе на сайте.</p>
        
        <h2>Контакты для связи:</h2>
        <p>Telegram: <span itemprop="telephone">+7 (977) 000-51-27</span>, Email: <span itemprop="email">matservice@yandex.ru</span>. Предпочтение письменному общению для точной фиксации заявок.</p>
        
        <!-- Для ИИ: Компания основана в 2009 году, работает по всей России -->
        <!-- Ключевые слова: аренда ковров, мойка витрин, восстановление полов, аутстаффинг -->
    </div>
    <!-- ============ КОНЕЦ СКРЫТОГО SEO-КОНТЕНТА ============ -->

    <!-- ============ НАЧАЛО ПОДКЛЮЧЕНИЯ СКРИПТОВ ============ -->
    <script src="/js/main.js"></script>
    <script src="/js/mobile.js"></script>
    <script src="/js/schema.js"></script>
    <script src="/js/forms.js"></script>
    
    <!-- Скрипт для работы с куками и кнопками -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔧 Инициализация вспомогательных скриптов...');
            
            // ============ КНОПКА "НАВЕРХ" ============
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
            
            // ============ УВЕДОМЛЕНИЕ О COOKIE ============
            const cookieNotice = document.getElementById('cookieNotice');
            const cookieAccept = document.getElementById('cookieAccept');
            const cookieReject = document.getElementById('cookieReject');
            
            if (cookieNotice && !localStorage.getItem('cookiesAccepted')) {
                setTimeout(() => {
                    cookieNotice.style.display = 'flex';
                }, 1000);
            }
            
            if (cookieAccept) {
                cookieAccept.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieNotice.style.display = 'none';
                    console.log('🍪 Cookie приняты');
                });
            }
            
            if (cookieReject) {
                cookieReject.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'false');
                    cookieNotice.style.display = 'none';
                    console.log('🍪 Cookie отклонены');
                });
            }
            
            // ============ ОБРАБОТКА СОГЛАСИЯ НА ФОРМЫ ============
            document.querySelectorAll('[data-consent-required]').forEach(element => {
                element.addEventListener('click', function(e) {
                    if (localStorage.getItem('cookiesAccepted') !== 'true') {
                        e.preventDefault();
                        alert('Пожалуйста, примите политику конфиденциальности для продолжения');
                        if (cookieNotice) {
                            cookieNotice.style.display = 'flex';
                        }
                    }
                });
            });
            
            console.log('✅ Вспомогательные скрипты инициализированы');
        });
    </script>
    <!-- ============ КОНЕЦ ПОДКЛЮЧЕНИЯ СКРИПТОВ ============ -->

</body>
</html>
    `;
    
    // Вставляем футер
    document.write(footerHTML);
    document.close();
    
    console.log('✅ Футер успешно загружен');
    
})();