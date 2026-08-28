// ===== 第十三轮：性能增强器 =====
// 1. 回到顶部按钮（滚动显示/隐藏，平滑滚动）
// 2. 滚动进度条（页面顶部阅读进度）
// 3. 图片懒加载
// 4. 页面性能监控

(function(){
'use strict';

// ===== 1. 回到顶部按钮 =====
var backToTopBtn = null;

function createBackToTopButton(){
  if(backToTopBtn) return;

  backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.style.cssText = 'position:fixed;bottom:30px;right:30px;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;font-size:1.3rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(102,126,234,0.4);opacity:0;visibility:hidden;transform:translateY(20px);transition:all .3s ease;z-index:9999;display:flex;align-items:center;justify-content:center;';
  backToTopBtn.title = '回到顶部';
  backToTopBtn.onmouseover = function(){ this.style.transform = 'translateY(-3px) scale(1.1)'; this.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)'; };
  backToTopBtn.onmouseout = function(){ this.style.transform = 'translateY(0) scale(1)'; this.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)'; };
  backToTopBtn.onclick = function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(typeof trackEvent === 'function') trackEvent('back_to_top', {});
  };

  document.body.appendChild(backToTopBtn);
}

function toggleBackToTop(){
  if(!backToTopBtn) return;
  if(window.scrollY > 400){
    backToTopBtn.style.opacity = '1';
    backToTopBtn.style.visibility = 'visible';
    backToTopBtn.style.transform = 'translateY(0)';
  } else {
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transform = 'translateY(20px)';
  }
}

// ===== 2. 滚动进度条 =====
var progressBar = null;

function createProgressBar(){
  if(progressBar) return;

  progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#667eea,#764ba2);width:0%;z-index:100001;transition:width .1s ease;box-shadow:0 0 10px rgba(102,126,234,0.5);';

  document.body.appendChild(progressBar);
}

function updateProgressBar(){
  if(!progressBar) return;
  var scrollTop = window.scrollY;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ===== 3. 图片懒加载 =====
function lazyLoadImages(){
  var images = document.querySelectorAll('img[data-src]');
  if(!('IntersectionObserver' in window)){
    // 不支持IntersectionObserver，直接加载所有图片
    images.forEach(function(img){
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  var imageObserver = new IntersectionObserver(function(entries, observer){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var img = entry.target;
        if(img.dataset.src){
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px 0px', threshold: 0.01 });

  images.forEach(function(img){ imageObserver.observe(img); });
}

// ===== 4. 页面性能监控 =====
function trackPerformance(){
  if(!window.performance || !window.performance.timing) return;

  window.addEventListener('load', function(){
    setTimeout(function(){
      var timing = window.performance.timing;
      var pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      var domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      var resourceCount = window.performance.getEntriesByType('resource').length;

      if(typeof trackEvent === 'function'){
        trackEvent('performance', {
          page_load_ms: pageLoadTime,
          dom_ready_ms: domReadyTime,
          resource_count: resourceCount
        });
      }

      console.log('%c⚡ 性能监控：页面加载 ' + pageLoadTime + 'ms | DOM就绪 ' + domReadyTime + 'ms | 资源 ' + resourceCount + '个', 'color:#10b981;font-size:11px;');
    }, 0);
  });
}

// ===== 5. 滚动事件节流 =====
var ticking = false;
function onScroll(){
  if(!ticking){
    window.requestAnimationFrame(function(){
      toggleBackToTop();
      updateProgressBar();
      ticking = false;
    });
    ticking = true;
  }
}

// ===== 初始化 =====
function init(){
  createBackToTopButton();
  createProgressBar();
  lazyLoadImages();
  trackPerformance();

  window.addEventListener('scroll', onScroll, { passive: true });

  // 初始状态检查
  toggleBackToTop();
  updateProgressBar();

  console.log('%c⚡ 性能增强器已加载：回到顶部按钮 + 滚动进度条 + 图片懒加载 + 性能监控', 'color:#10b981;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
