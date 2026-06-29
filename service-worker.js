// ============================================================
// LifeWork Master - Service Worker
// 提供离线缓存和类App体验
// ============================================================

const CACHE_NAME = 'lifework-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/variables.css',
  '/css/reset.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/pages.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/config.js',
  '/js/storage.js',
  '/js/utils/dom.js',
  '/js/utils/format.js',
  '/js/utils/charts.js',
  '/js/data/dimensions.js',
  '/js/data/experts.js',
  '/js/data/questionnaire.js',
  '/js/data/checkin.js',
  '/js/data/tasks.js',
  '/js/engine/scoring.js',
  '/js/engine/analysis.js',
  '/js/engine/coordinator.js',
  '/js/components/toast.js',
  '/js/components/modal.js',
  '/js/components/progress-ring.js',
  '/js/components/navbar.js',
  '/js/components/bottom-nav.js',
  '/js/components/dimension-card.js',
  '/js/components/expert-card.js',
  '/js/components/checkin-card.js',
  '/js/components/task-card.js',
  '/js/components/pomodoro.js',
  '/js/components/ritual.js',
  '/js/pages/home.js',
  '/js/pages/questionnaire.js',
  '/js/pages/report.js',
  '/js/pages/experts.js',
  '/js/pages/checkin.js',
  '/js/pages/action.js',
  '/js/pages/not-found.js',
  '/js/router.js',
  '/js/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 安装：预缓存所有资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.log('Cache addAll error (some CDN assets may fail):', err.message);
      });
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：缓存优先策略（本地文件），CDN走网络
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CDN 资源走网络优先
  if (url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // 本地资源缓存优先
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // 只缓存成功响应
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
