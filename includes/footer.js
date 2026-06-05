// ============================================
// FOOTER.JS - Нижняя часть всех страниц МИРУМ
// Версия: 10.3 (05.06.2026) - ДОБАВЛЕНА ПОЛНАЯ JSON-LD РАЗМЕТКА LocalBusiness
// ============================================
(function() {
    'use strict';
    
    console.log('🔄 Загружаем футер v10.3...');
    
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
                    
                    <!-- Контакты для быстрой связи -->
                    <div style="margin-top: 20px; padding: 12px; background: rgba(22, 160, 133, 0.1); border-radius: 8px;">
                        <p><strong style="color: var(--accent-color);">✉️ Предпочтительные каналы:</strong></p>
                        <p style="margin: 8px 0;">
                            <i class="fab fa-telegram" style="color: #0088cc; width: 24px;"></i> 
                            <a href="https://t.me/+79770005127" style="color: #0088cc; font-weight: 600; text-decoration: none;">Telegram</a>
                        </p>
                        <p style="margin: 8px 0;">
                            <i class="fab fa-whatsapp" style="color: #25D366; width: 24px;"></i> 
                            <a href="https://wa.me/79770005127" style="color: #25D366; font-weight: 600; text-decoration: none;">WhatsApp</a>
                        </p>
                        <p style="margin: 8px 0;">
                            <i class="fas fa-comment" style="color: #0055FF; width: 24px;"></i> 
                            <a href="https://max.ru/u/79770005127" style="color: #0055FF; font-weight: 600; text-decoration: none;">MAX</a>
                        </p>
                        <p style="margin: 8px 0;">
                            <i class="fas fa-envelope" style="color: #16a085; width: 24px;"></i> 
                            <a href="mailto:matservice@yandex.ru" style="color: #16a085; font-weight: 600; text-decoration: none;">matservice@yandex.ru</a>
                        </p>
                        <p style="margin: 5px 0 0; font-size: 0.85rem; color: var(--text-light);">
                            <i class="fas fa-clock"></i> Ответ в течение 15 минут
                        </p>
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
                        <li><a href="/calculator.html">Калькулятор</a></li>
                        <li><a href="/FAQ.html">FAQ</a></li>
                        <li><a href="/blog.html">Блог</a></li>
                        <li><a href="/testimonials.html">Отзывы</a></li>
                        <li><a href="/privacy-policy.html">Политика конфиденциальности</a></li>
                        <li><a href="/privacy-policy.html#personal-data">Согласие на обработку данных</a></li>
                    </ul>
                </div>
                
                <!-- Контакты -->
                <div class="footer-section">
                    <h3>Контакты</h3>
                    <ul class="footer-links">
                        <li><i class="fab fa-telegram"></i> <a href="https://t.me/+79770005127">Telegram (предпочтительно)</a></li>
                        <li><i class="fab fa-whatsapp"></i> <a href="https://wa.me/79770005127">WhatsApp</a></li>
                        <li><i class="fas fa-comment"></i> <a href="https://max.ru/u/79770005127">MAX</a></li>
                        <li><i class="fas fa-envelope"></i> <a href="mailto:matservice@yandex.ru">matservice@yandex.ru</a></li>
                        <li><i class="fas fa-phone"></i> <a href="tel:+79770005127">+7 (977) 000-51-27</a></li>
                        <li><i class="fas fa-map-marker-alt"></i> Москва, ул. Сущёвская, 27с2</li>
                        <li><i class="fas fa-clock"></i> Пн-Пт: 9:00-20:00, Сб: 10:00-18:00</li>
                    </ul>
                    
                    <div style="margin-top: 20px; padding: 12px; background: rgba(0, 136, 204, 0.1); border-radius: 8px; border-left: 4px solid #0088cc;">
                        <p style="font-size: 0.85rem; margin: 0;">
                            <strong>⚠️ Важно:</strong> Предпочитаем письменное общение через мессенджеры или Email для точной фиксации заявок.
                        </p>
                    </div>
                </div>
                
                <!-- КНОПКИ МЕССЕНДЖЕРОВ -->
                <div class="footer-section" style="text-align: center;">
                    <h3>Быстрая связь</h3>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px;">
                        <a href="https://t.me/+79770005127" class="btn" style="background: white; color: #2c5aa0; border: 2px solid #2c5aa0; border-radius: 50px; padding: 10px 20px; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fab fa-telegram"></i> Telegram
                        </a>
                        <a href="https://wa.me/79770005127" class="btn" style="background: #25D366; color: white; border-radius: 50px; padding: 10px 20px; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="https://max.ru/u/79770005127" class="btn" style="background: #0055FF; color: white; border-radius: 50px; padding: 10px 20px; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fas fa-comment"></i> MAX
                        </a>
                        <a href="mailto:matservice@yandex.ru" class="btn" style="background: #6c757d; color: white; border-radius: 50px; padding: 10px 20px; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </div>
                </div>
                
                <!-- Регионы работы (ПОЛНЫЙ СПИСОК) -->
                <div class="footer-section" id="regions">
                    <h3>Регионы работы</h3>
                    <div class="regions-grid">
                        <!-- Москва и область -->
                        <div class="region-group">
                            <h4>Москва и Московская обл.</h4>
                            <ul>
                                <li>Москва</li>
                                <li>Балашиха</li>
                                <li>Подольск</li>
                                <li>Химки</li>
                                <li>Мытищи</li>
                                <li>Королёв</li>
                                <li>Люберцы</li>
                                <li>Красногорск</li>
                                <li>Одинцово</li>
                                <li>Домодедово</li>
                                <li>Раменское</li>
                                <li>Серпухов</li>
                                <li>Коломна</li>
                                <li>Орехово-Зуево</li>
                                <li>Сергиев Посад</li>
                                <li>Пушкино</li>
                                <li>Жуковский</li>
                                <li>Долгопрудный</li>
                                <li>Реутов</li>
                                <li>Видное</li>
                                <li>Лобня</li>
                                <li>Электросталь</li>
                                <li>Чехов</li>
                                <li>Дмитров</li>
                                <li>Клин</li>
                                <li>Наро-Фоминск</li>
                                <li>Ивантеевка</li>
                                <li>Воскресенск</li>
                                <li>Щёлково</li>
                            </ul>
                        </div>
                        
                        <!-- СПб и Ленобласть -->
                        <div class="region-group">
                            <h4>СПб и Ленинградская обл.</h4>
                            <ul>
                                <li>Санкт-Петербург</li>
                                <li>Колпино</li>
                                <li>Пушкин</li>
                                <li>Петергоф</li>
                                <li>Кронштадт</li>
                                <li>Всеволожск</li>
                                <li>Гатчина</li>
                                <li>Выборг</li>
                                <li>Кингисепп</li>
                                <li>Кириши</li>
                                <li>Сосновый Бор</li>
                                <li>Тихвин</li>
                                <li>Луга</li>
                                <li>Волхов</li>
                                <li>Приозерск</li>
                                <li>Тосно</li>
                                <li>Сертолово</li>
                                <li>Мурино</li>
                                <li>Кудрово</li>
                            </ul>
                        </div>
                        
                        <!-- Центральный ФО -->
                        <div class="region-group">
                            <h4>Центральный округ</h4>
                            <ul>
                                <li>Тверь</li>
                                <li>Тула</li>
                                <li>Ярославль</li>
                                <li>Брянск</li>
                                <li>Орёл</li>
                                <li>Владимир</li>
                                <li>Иваново</li>
                                <li>Калуга</li>
                                <li>Смоленск</li>
                                <li>Белгород</li>
                                <li>Курск</li>
                                <li>Воронеж</li>
                                <li>Тамбов</li>
                                <li>Рязань</li>
                                <li>Липецк</li>
                                <li>Кострома</li>
                            </ul>
                        </div>
                        
                        <!-- Северо-Запад -->
                        <div class="region-group">
                            <h4>Северо-Западный округ</h4>
                            <ul>
                                <li>Архангельск</li>
                                <li>Мурманск</li>
                                <li>Псков</li>
                                <li>Великий Новгород</li>
                                <li>Калининград</li>
                                <li>Петрозаводск</li>
                                <li>Сыктывкар</li>
                                <li>Вологда</li>
                                <li>Нарьян-Мар</li>
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
                                <li>Севастополь</li>
                                <li>Майкоп</li>
                                <li>Элиста</li>
                            </ul>
                        </div>
                        
                        <!-- Северо-Кавказский округ -->
                        <div class="region-group">
                            <h4>Северо-Кавказский округ</h4>
                            <ul>
                                <li>Махачкала</li>
                                <li>Грозный</li>
                                <li>Нальчик</li>
                                <li>Владикавказ</li>
                                <li>Черкесск</li>
                                <li>Магас</li>
                            </ul>
                        </div>
                        
                        <!-- Крым -->
                        <div class="region-group">
                            <h4>Республика Крым</h4>
                            <ul>
                                <li>Симферополь</li>
                                <li>Севастополь</li>
                            </ul>
                        </div>
                        
                        <!-- Приволжский -->
                        <div class="region-group">
                            <h4>Приволжский округ</h4>
                            <ul>
                                <li>Уфа</li>
                                <li>Казань</li>
                                <li>Нижний Новгород</li>
                                <li>Самара</li>
                                <li>Саратов</li>
                                <li>Пенза</li>
                                <li>Ульяновск</li>
                                <li>Пермь</li>
                                <li>Ижевск</li>
                                <li>Оренбург</li>
                                <li>Йошкар-Ола</li>
                                <li>Саранск</li>
                                <li>Чебоксары</li>
                                <li>Киров</li>
                            </ul>
                        </div>
                        
                        <!-- Уральский -->
                        <div class="region-group">
                            <h4>Уральский округ</h4>
                            <ul>
                                <li>Екатеринбург</li>
                                <li>Тюмень</li>
                                <li>Челябинск</li>
                                <li>Сургут</li>
                                <li>Курган</li>
                                <li>Ханты-Мансийск</li>
                                <li>Когалым</li>
                                <li>Лянтор</li>
                                <li>Пыть-Ях</li>
                            </ul>
                        </div>
                        
                        <!-- Сибирский -->
                        <div class="region-group">
                            <h4>Сибирский округ</h4>
                            <ul>
                                <li>Новосибирск</li>
                                <li>Иркутск</li>
                                <li>Кемерово</li>
                                <li>Томск</li>
                                <li>Омск</li>
                                <li>Красноярск</li>
                                <li>Барнаул</li>
                                <li>Абакан</li>
                                <li>Горно-Алтайск</li>
                                <li>Кызыл</li>
                                <li>Улан-Удэ</li>
                                <li>Чита</li>
                            </ul>
                        </div>
                        
                        <!-- Дальневосточный -->
                        <div class="region-group">
                            <h4>Дальневосточный округ</h4>
                            <ul>
                                <li>Владивосток</li>
                                <li>Хабаровск</li>
                                <li>Якутск</li>
                                <li>Благовещенск</li>
                                <li>Петропавловск-Камчатский</li>
                                <li>Магадан</li>
                                <li>Южно-Сахалинск</li>
                                <li>Биробиджан</li>
                                <li>Анадырь</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Нижняя часть футера -->
                <div class="footer-bottom">
                    <p>© 2009-2026 МИРУМ. Все права защищены. Оператор обработки данных - ООО "МИРУМ"</p>
                    <p>
                        <a href="/privacy-policy.html">Политика конфиденциальности</a> | 
                        <a href="/privacy-policy.html#personal-data">Согласие на обработку данных</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
    <!-- ============ КОНЕЦ ФУТЕРА ============ -->

    <!-- ============ ПЛАВАЮЩИЕ ЭЛЕМЕНТЫ ============ -->
    <div class="telegram-float">
        <a href="https://t.me/+79770005127" class="telegram-link" data-consent-required aria-label="Написать в Telegram">
            <i class="fab fa-telegram"></i>
            <span>Написать в Telegram</span>
        </a>
    </div>

    <button class="scroll-to-top" id="scrollToTop" aria-label="Наверх">
        ↑
    </button>

    <!-- ============ МОДАЛЬНОЕ ОКНО СОГЛАСИЯ ============ -->
    <div id="consentModal" class="consent-modal">
        <div class="consent-modal-content">
            <h3><i class="fas fa-shield-alt"></i> Подтверждение согласия на обработку персональных данных</h3>
            <div class="consent-text">
                <p>Я, субъект персональных данных, в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных», предоставляю ООО «МИРУМ» (ИНН 3019008619) согласие на обработку моих персональных данных, указанных в заявке, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (предоставление доступа) курьерским службам для доставки, обезличивание, блокирование, удаление, уничтожение.</p>
                
                <p><strong>Цели обработки:</strong> обработка заявки, заключение и исполнение договора, обратная связь, направление коммерческих предложений.</p>
                
                <p><strong>Срок действия согласия:</strong> с момента предоставления до достижения целей обработки или отзыва согласия.</p>
                
                <p><strong>Порядок отзыва:</strong> согласие может быть отозвано путем направления письменного уведомления на email: <a href="mailto:matservice@yandex.ru">matservice@yandex.ru</a>.</p>
                
                <p><strong>Передача третьим лицам:</strong> допускается только курьерским службам для доставки и государственным органам в случаях, предусмотренных законом.</p>
            </div>
            <div class="consent-actions">
                <button class="btn btn-primary" id="confirmConsent">
                    <i class="fas fa-check"></i> Подтверждаю согласие
                </button>
                <button class="btn btn-secondary" id="cancelConsent">
                    <i class="fas fa-times"></i> Отмена
                </button>
            </div>
        </div>
    </div>

    <!-- ============ УВЕДОМЛЕНИЕ О COOKIE ============ -->
    <div id="cookieNotice" class="cookie-notice" role="alert" aria-live="polite">
        <div class="container">
            <div class="cookie-content">
                <div class="cookie-text">
                    <p>
                        <strong>🍪 Мы используем файлы cookie</strong>
                    </p>
                    <p>
                        Для улучшения работы сайта, анализа трафика и персонализации мы используем файлы cookie. 
                        Продолжая использование сайта, вы даете свое 
                        <a href="/privacy-policy.html#personal-data" class="cookie-link">согласие на обработку персональных данных</a> 
                        и подтверждаете, что ознакомлены с 
                        <a href="/privacy-policy.html" class="cookie-link">политикой конфиденциальности</a>.
                    </p>
                </div>
                <div class="cookie-buttons">
                    <button id="cookieAccept" class="cookie-btn cookie-accept">
                        <i class="fas fa-check"></i> Принять всё
                    </button>
                    <button id="cookieReject" class="cookie-btn cookie-reject">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ============ СКРЫТЫЙ SEO-КОНТЕНТ (LocalBusiness) ============ -->
    <div style="display: none; height: 1px; overflow: hidden;" aria-hidden="true" itemscope itemtype="https://schema.org/LocalBusiness">
        <span itemprop="name">МИРУМ</span>
        <span itemprop="alternateName">Матсервис</span>
        <span itemprop="alternateName">Ковросервис</span>
        <span itemprop="description">Профессиональные услуги чистоты и восстановления с 2009 года</span>
        <span itemprop="foundingDate">2009</span>
        <span itemprop="email">matservice@yandex.ru</span>
        <span itemprop="telephone">+79770005127</span>
        <span itemprop="priceRange">от 110₽ до 5000₽</span>
        <meta itemprop="openingHours" content="Mo-Fr 09:00-20:00">
        <meta itemprop="openingHours" content="Sa 10:00-18:00">
        <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
            <span itemprop="streetAddress">ул. Сущёвская, 27с2</span>
            <span itemprop="addressLocality">Москва</span>
            <span itemprop="postalCode">127055</span>
            <span itemprop="addressCountry">RU</span>
        </span>
        <span itemprop="geo" itemscope itemtype="https://schema.org/GeoCoordinates">
            <meta itemprop="latitude" content="55.7792">
            <meta itemprop="longitude" content="37.5994">
        </span>
        <span itemprop="sameAs" content="https://t.me/+79770005127"></span>
        <span itemprop="sameAs" content="https://wa.me/79770005127"></span>
        <span itemprop="sameAs" content="https://max.ru/u/79770005127"></span>
        <span itemprop="sameAs" content="https://www.avito.ru/brands/21b68ab1889c8e24497a2089e18e2a13"></span>
        <span itemprop="areaServed" itemscope itemtype="https://schema.org/Country">
            <span itemprop="name">Россия</span>
        </span>
        <span itemprop="hasOfferCatalog" itemscope itemtype="https://schema.org/OfferCatalog">
            <span itemprop="name">Услуги МИРУМ</span>
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/OfferCatalog">
                <span itemprop="name">Аренда грязезащитных ковров</span>
            </span>
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/OfferCatalog">
                <span itemprop="name">Мойка витрин и фасадов</span>
            </span>
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/OfferCatalog">
                <span itemprop="name">Восстановление напольных покрытий</span>
            </span>
        </span>
    </div>
    <!-- ============ КОНЕЦ СКРЫТОГО SEO-КОНТЕНТА ============ -->

    <!-- ============ ПОДКЛЮЧЕНИЕ СКРИПТОВ ============ -->
    <script src="/js/prices.js?v=9.0"></script>
    <script src="/js/calculator.js?v=9.0"></script>
    <script src="/js/forms.js?v=8.0"></script>
    <script src="/js/mobile.js?v=3.1"></script>
    
    <script>
        // ============ ИНИЦИАЛИЗАЦИЯ ВСПОМОГАТЕЛЬНЫХ ФУНКЦИЙ ============
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔧 Инициализация вспомогательных скриптов...');
            
            // ============ МЕНЕДЖЕР СОГЛАСИЙ ============
            const consentModal = document.getElementById('consentModal');
            let pendingFormData = null;
            let pendingFormElement = null;
            
            window.showConsentModal = function(formData, formElement) {
                pendingFormData = formData;
                pendingFormElement = formElement;
                consentModal.classList.add('active');
            };
            
            document.getElementById('confirmConsent').addEventListener('click', function() {
                if (pendingFormData && pendingFormElement) {
                    if (typeof window.FormsManager !== 'undefined') {
                        window.FormsManager.submitFormWithConsent(pendingFormData, pendingFormElement);
                    }
                    consentModal.classList.remove('active');
                    pendingFormData = null;
                    pendingFormElement = null;
                }
            });
            
            document.getElementById('cancelConsent').addEventListener('click', function() {
                consentModal.classList.remove('active');
                pendingFormData = null;
                pendingFormElement = null;
                alert('Для отправки заявки необходимо подтвердить согласие на обработку персональных данных.');
            });
            
            // Закрытие по клику вне модального окна
            consentModal.addEventListener('click', function(e) {
                if (e.target === consentModal) {
                    consentModal.classList.remove('active');
                    pendingFormData = null;
                    pendingFormElement = null;
                }
            });
            
            // ============ КНОПКА "НАВЕРХ" ============
            const scrollBtn = document.getElementById('scrollToTop');
            if (scrollBtn) {
                window.addEventListener('scroll', () => {
                    scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
                });
                
                scrollBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            
            // ============ УВЕДОМЛЕНИЕ О COOKIE ============
            const cookieNotice = document.getElementById('cookieNotice');
            const cookieAccept = document.getElementById('cookieAccept');
            const cookieReject = document.getElementById('cookieReject');
            
            function showCookieNotice() {
                if (cookieNotice) {
                    cookieNotice.style.display = 'flex';
                    cookieNotice.style.opacity = '1';
                    cookieNotice.style.visibility = 'visible';
                }
            }
            
            function hideCookieNotice() {
                if (cookieNotice) {
                    cookieNotice.style.display = 'none';
                }
            }
            
            const cookieChoice = localStorage.getItem('cookiesAccepted');
            
            if (cookieChoice === null) {
                setTimeout(showCookieNotice, 300);
                console.log('🍪 Первый визит - показываем баннер');
            } else {
                hideCookieNotice();
                console.log('🍪 Баннер скрыт (выбор: ' + cookieChoice + ')');
            }
            
            if (cookieAccept) {
                cookieAccept.addEventListener('click', function() {
                    localStorage.setItem('cookiesAccepted', 'true');
                    hideCookieNotice();
                    console.log('🍪 Cookie ПРИНЯТЫ');
                    
                    // Загружаем Яндекс.Метрику
                    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    
                    ym(100898517, "init", {
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true,
                        webvisor: true
                    });
                    console.log('📊 Яндекс.Метрика загружена');
                });
            }
            
            if (cookieReject) {
                cookieReject.addEventListener('click', function() {
                    localStorage.setItem('cookiesAccepted', 'false');
                    hideCookieNotice();
                    console.log('🍪 Cookie ОТКЛОНЕНЫ');
                });
            }
            
            console.log('✅ Вспомогательные скрипты инициализированы');
        });
    </script>
    
    <!-- Стили для модального окна согласия -->
    <style>
        .consent-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 100000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .consent-modal.active {
            display: flex;
        }
        
        .consent-modal-content {
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        
        .consent-modal-content h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        .consent-text {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 0.9rem;
            line-height: 1.6;
            border-left: 4px solid #16a085;
        }
        
        .consent-text p {
            margin-bottom: 10px;
        }
        
        .consent-text a {
            color: #16a085;
        }
        
        .consent-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .consent-modal-content {
                padding: 20px;
            }
            
            .consent-actions {
                flex-direction: column;
            }
            
            .consent-actions .btn {
                width: 100%;
            }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    </style>

</body>
</html>
    `;
    
    // Вставляем футер
    document.write(footerHTML);
    document.close();
    
    console.log('✅ Футер v10.3 успешно загружен');
    
})();