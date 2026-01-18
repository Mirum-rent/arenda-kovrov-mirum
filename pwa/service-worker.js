// service-worker.js
const CACHE_NAME = 'mirum-calculator-v2';
const urlsToCache = [
  '/',
  '/mirum-pwa.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  '/img/favicon-192.png',
  '/img/favicon-512.png',
  '/img/apple-touch-icon.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэшируем файлы для офлайн-работы');
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  // Пропускаем запросы к Telegram и Email
  if (event.request.url.includes('t.me') || 
      event.request.url.includes('mailto:') ||
      event.request.url.includes('tel:')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кэша если есть
        if (response) {
          return response;
        }
        
        // Иначе загружаем из сети
        return fetch(event.request)
          .then(response => {
            // Не кэшируем если ответ не валидный
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Клонируем ответ для кэширования
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.log('❌ Ошибка загрузки:', error);
            // Можно вернуть fallback-страницу
            return new Response('Офлайн режим. Расчеты доступны.', {
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          });
      })
  );
});

// Очистка старого кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Периодическая синхронизация (если поддерживается)
if (self.registration && self.registration.periodicSync) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-cache') {
      event.waitUntil(updateCache());
    }
  });
}

// Функция обновления кэша
async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of urlsToCache) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log('Не удалось обновить:', url, error);
    }
  }
}