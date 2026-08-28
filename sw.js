// ===== AI Tools Radar - Service Worker =====
// 离线缓存 + PWA支持

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `ai-tools-radar-${CACHE_VERSION}`;
const BASE_PATH = '/ai-tools-radar';

// 预缓存的关键资源
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon.svg`,
  `${BASE_PATH}/robots.txt`,
  `${BASE_PATH}/sitemap.xml`,
  // 核心JS模块
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/features-v2.js`,
  `${BASE_PATH}/seo-optimizer.js`,
  `${BASE_PATH}/growth-optimizer.js`,
  `${BASE_PATH}/content-enhancer.js`,
  `${BASE_PATH}/ux-optimizer.js`,
  `${BASE_PATH}/affiliate-system.js`,
  `${BASE_PATH}/search-feature.js`,
  `${BASE_PATH}/dark-mode.js`,
  `${BASE_PATH}/performance-enhancer.js`,
  // 文章数据
  `${BASE_PATH}/articles.js`,
  `${BASE_PATH}/articles-v2.js`,
  `${BASE_PATH}/articles-v3.js`,
  `${BASE_PATH}/articles-v4.js`,
  `${BASE_PATH}/articles-v5.js`
];

// 安装：预缓存关键资源
self.addEventListener('install', function(event){
  console.log('[SW] 安装中，缓存版本:', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        console.log('[SW] 预缓存关键资源');
        // 逐个缓存，失败不影响整体
        return Promise.allSettled(
          PRECACHE_URLS.map(function(url){
            return cache.add(url).catch(function(err){
              console.warn('[SW] 缓存失败:', url, err);
            });
          })
        );
      })
      .then(function(){
        console.log('[SW] 预缓存完成');
        return self.skipWaiting();
      })
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', function(event){
  console.log('[SW] 激活中，清理旧缓存');

  event.waitUntil(
    caches.keys()
      .then(function(cacheNames){
        return Promise.all(
          cacheNames
            .filter(function(name){
              return name.startsWith('ai-tools-radar-') && name !== CACHE_NAME;
            })
            .map(function(name){
              console.log('[SW] 删除旧缓存:', name);
              return caches.delete(name);
            })
        );
      })
      .then(function(){
        console.log('[SW] 旧缓存清理完成');
        return self.clients.claim();
      })
  );
});

// 请求拦截：缓存优先策略
self.addEventListener('fetch', function(event){
  var request = event.request;

  // 只处理GET请求
  if(request.method !== 'GET') return;

  // 跳过非http请求
  if(!request.url.startsWith('http')) return;

  // 跳过GitHub API请求（不缓存）
  if(request.url.includes('api.github.com')) return;

  // 跳过分析/追踪请求
  if(request.url.includes('google-analytics.com') ||
     request.url.includes('googletagmanager.com') ||
     request.url.includes('doubleclick.net')) return;

  event.respondWith(
    caches.match(request)
      .then(function(cachedResponse){
        // 缓存命中：返回缓存，同时后台更新
        if(cachedResponse){
          // 后台更新缓存（stale-while-revalidate）
          fetch(request)
            .then(function(networkResponse){
              if(networkResponse && networkResponse.status === 200){
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache){
                  cache.put(request, responseClone);
                });
              }
            })
            .catch(function(){
              // 网络失败，使用缓存
            });

          return cachedResponse;
        }

        // 缓存未命中：网络请求，成功后缓存
        return fetch(request)
          .then(function(networkResponse){
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque'){
              return networkResponse;
            }

            // 只缓存同源资源
            if(new URL(request.url).origin === self.location.origin){
              var responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(function(cache){
                cache.put(request, responseClone);
              });
            }

            return networkResponse;
          })
          .catch(function(){
            // 网络失败且无缓存：返回离线页面
            if(request.mode === 'navigate'){
              return caches.match(`${BASE_PATH}/index.html`);
            }
            return new Response('离线状态', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

// 接收消息：更新缓存
self.addEventListener('message', function(event){
  if(event.data === 'SKIP_WAITING'){
    self.skipWaiting();
  }
  if(event.data === 'CLEAR_CACHE'){
    caches.keys().then(function(names){
      names.forEach(function(name){
        if(name.startsWith('ai-tools-radar-')){
          caches.delete(name);
        }
      });
    });
  }
});

console.log('[SW] Service Worker 已加载，版本:', CACHE_VERSION);
