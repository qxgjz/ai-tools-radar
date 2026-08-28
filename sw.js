// Service Worker for AI Tools Radar - 优化版
const CACHE_NAME = 'ai-tools-radar-v2';
const STATIC_CACHE = 'ai-tools-radar-static-v2';

// 核心静态资源（安装时缓存）
const coreAssets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './enhancer.js',
    './manifest.json'
];

// 安装时缓存核心文件
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(coreAssets))
            .then(() => self.skipWaiting())
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 智能缓存策略
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // 只处理 GET 请求
    if (request.method !== 'GET') return;
    
    const url = new URL(request.url);
    
    // 静态资源：缓存优先，网络备用
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/i)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.status === 200) {
                        const clone = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return response;
                }).catch(() => cached);
            })
        );
        return;
    }
    
    // HTML 页面：网络优先，缓存备用（离线时显示缓存）
    if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(
            fetch(request).then((response) => {
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            }).catch(() => {
                return caches.match(request).then((cached) => {
                    if (cached) return cached;
                    return caches.match('./index.html');
                });
            })
        );
        return;
    }
    
    // 其他请求：网络优先，缓存备用
    event.respondWith(
        fetch(request).then((response) => {
            if (response.status === 200 && url.origin === location.origin) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
        }).catch(() => caches.match(request))
    );
});
