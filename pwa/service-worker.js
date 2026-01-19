// service-worker.js для PWA приложения МИРУМ
const CACHE_NAME = 'mirum-calculator-pwa-v3-2026-01-18';
const urlsToCache = [
  '/pwa/mirum-pwa.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  '/img/favicon-192.png',
  '/img/favicon-512.png',
  '/img/apple-touch-icon.png',
  '/img/logo.png',
  '/site.webmanifest'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('🔄 Установка Service Worker для PWA МИРУМ Калькулятор');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэшируем файлы для офлайн-работы PWA');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ Некоторые файлы не закэшированы:', error);
        });
      })
      .then(() => {
        console.log('✅ Service Worker для PWA установлен');
        return self.skipWaiting();
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  // Пропускаем запросы к внешним сервисам
  if (event.request.url.includes('t.me') || 
      event.request.url.includes('mailto:') ||
      event.request.url.includes('tel:') ||
      event.request.url.includes('api.')) {
    return;
  }
  
  // Для страницы PWA всегда пытаемся использовать кэш
  if (event.request.url.includes('mirum-pwa.html')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Возвращаем из кэша если есть
          if (response) {
            console.log('📄 PWA: Загружаем из кэша:', event.request.url);
            return response;
          }
          
          // Иначе загружаем из сети
          return fetch(event.request)
            .then(response => {
              // Кэшируем для будущего использования
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                  console.log('💾 PWA: Закэшировали:', event.request.url);
                });
              
              return response;
            })
            .catch(error => {
              console.log('❌ PWA: Ошибка загрузки:', error);
              // Возвращаем fallback-страницу для PWA
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>МИРУМ Калькулятор - Офлайн</title>
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                      padding: 40px 20px; 
                      text-align: center; 
                      background: linear-gradient(135deg, #1a3a5f 0%, #2c5aa0 100%);
                      color: white;
                      min-height: 100vh;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    }
                    h1 { 
                      color: white; 
                      font-size: 2.5rem;
                      margin-bottom: 20px;
                    }
                    .logo {
                      font-size: 3rem;
                      margin-bottom: 20px;
                      color: #16a085;
                    }
                    p { 
                      font-size: 1.2rem; 
                      max-width: 600px;
                      margin: 10px auto;
                      line-height: 1.6;
                    }
                    .btn { 
                      background: #16a085; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      margin: 20px 10px;
                      font-weight: 600;
                      font-size: 1.1rem;
                      border: none;
                      cursor: pointer;
                      transition: all 0.3s ease;
                    }
                    .btn:hover {
                      background: #138a72;
                      transform: translateY(-2px);
                      box-shadow: 0 6px 20px rgba(22, 160, 133, 0.3);
                    }
                    .container {
                      max-width: 800px;
                      background: rgba(255,255,255,0.1);
                      padding: 30px;
                      border-radius: 15px;
                      backdrop-filter: blur(10px);
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="logo">
                      <i class="fas fa-calculator"></i>
                    </div>
                    <h1>📱 МИРУМ Калькулятор</h1>
                    <p><strong>Приложение работает в офлайн-режиме.</strong></p>
                    <p>Основные функции доступны, но некоторые данные могут быть устаревшими.</p>
                    <p>Подключитесь к интернету для получения актуальной информации.</p>
                    <button class="btn" onclick="location.reload()">
                      <i class="fas fa-sync-alt"></i> Перезагрузить
                    </button>
                  </div>
                  <script>
                    document.addEventListener('DOMContentLoaded', function() {
                      if (navigator.onLine) {
                        setTimeout(() => {
                          location.reload();
                        }, 3000);
                      }
                    });
                  </script>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
              });
            });
        })
    );
  } else {
    // Для других страниц - обычная логика (но в основном будем работать в пределах /pwa/)
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// Очистка старого кэша
self.addEventListener('activate', event => {
  console.log('🔧 Активация нового Service Worker для PWA');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ PWA: Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ PWA: Кэш очищен');
      return self.clients.claim();
    })
  );
});

// Периодическая синхронизация (если поддерживается)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    console.log('🔄 PWA: Периодическая синхронизация кэша');
    event.waitUntil(updateCache());
  }
});

// Сообщение от клиента
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Функция обновления кэша
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    for (const url of urlsToCache) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('🔄 PWA: Обновлен кэш для:', url);
        }
      } catch (error) {
        console.log('⚠️ PWA: Не удалось обновить:', url, error);
      }
    }
    
    console.log('✅ PWA: Кэш обновлен');
  } catch (error) {
    console.log('❌ PWA: Ошибка обновления кэша:', error);
  }
}

// Фоновая синхронизация
self.addEventListener('sync', event => {
  if (event.tag === 'update-prices') {
    console.log('📊 PWA: Фоновая синхронизация данных');
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Здесь можно добавить синхронизацию данных с сервером
    // Например, обновление цен из внешнего источника
    console.log('✅ PWA: Данные синхронизированы');
  } catch (error) {
    console.log('❌ PWA: Ошибка синхронизации:', error);
  }
}

// Push-уведомления
self.addEventListener('push', event => {
  console.log('📬 PWA: Получено push-уведомление');
  
  const title = 'МИРУМ Калькулятор';
  const options = {
    body: event.data ? event.data.text() : 'Обновление данных доступно',
    icon: '/img/favicon-192.png',
    badge: '/img/favicon-192.png',
    tag: 'mirum-update',
    renotify: true,
    actions: [
      { action: 'open', title: 'Открыть приложение' },
      { action: 'close', title: 'Закрыть' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('👆 PWA: Клик по уведомлению');
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/pwa/mirum-pwa.html')
    );
  }
});