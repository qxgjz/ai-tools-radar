// ===== 第十一轮：增长优化器 =====
// 1. 退出意图弹窗（Exit Intent Popup）
// 2. 邮件订阅激励（订阅赠送独家内容）
// 3. 自定义事件追踪（工具点击、收藏、搜索、文章浏览等）
// 4. 本地数据统计仪表盘

(function(){
'use strict';

// ==========================================
// 1. 事件追踪系统
// ==========================================
var EventTracker = {
  events: [],
  maxEvents: 500,

  init: function(){
    // 加载历史事件
    var saved = localStorage.getItem('tracked_events');
    if(saved){
      try { this.events = JSON.parse(saved); } catch(e){ this.events = []; }
    }
  },

  track: function(eventName, properties){
    var event = {
      name: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer
    };
    this.events.push(event);
    if(this.events.length > this.maxEvents){
      this.events = this.events.slice(-this.maxEvents);
    }
    localStorage.setItem('tracked_events', JSON.stringify(this.events));

    // 如果GA可用，发送到GA
    if(typeof gtag === 'function'){
      gtag('event', eventName, properties);
    }

    // 控制台输出（开发模式）
    if(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'){
      console.log('%c📊 事件追踪: ' + eventName, 'color:#667eea;font-size:11px', properties);
    }
  },

  getStats: function(){
    var stats = {
      totalEvents: this.events.length,
      byName: {},
      byDay: {},
      toolClicks: {},
      searches: [],
      articleViews: {},
      favorites: 0,
      newsletterSignups: 0
    };
    this.events.forEach(function(e){
      stats.byName[e.name] = (stats.byName[e.name] || 0) + 1;
      var day = e.timestamp.split('T')[0];
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
      if(e.name === 'tool_click' && e.properties && e.properties.tool){
        stats.toolClicks[e.properties.tool] = (stats.toolClicks[e.properties.tool] || 0) + 1;
      }
      if(e.name === 'search' && e.properties && e.properties.query){
        stats.searches.push(e.properties.query);
      }
      if(e.name === 'article_view' && e.properties && e.properties.article){
        stats.articleViews[e.properties.article] = (stats.articleViews[e.properties.article] || 0) + 1;
      }
      if(e.name === 'tool_favorite') stats.favorites++;
      if(e.name === 'newsletter_signup') stats.newsletterSignups++;
    });
    return stats;
  },

  // 暴露全局
  showDashboard: function(){
    var stats = this.getStats();
    console.log('%c📊 AI Tools Radar 数据仪表盘', 'color:#667eea;font-size:14px;font-weight:bold');
    console.log('总事件数:', stats.totalEvents);
    console.log('按事件类型:', stats.byName);
    console.log('工具点击Top5:', Object.entries(stats.toolClicks).sort(function(a,b){return b[1]-a[1];}).slice(0,5));
    console.log('搜索关键词:', stats.searches.slice(-10));
    console.log('文章浏览:', stats.articleViews);
    console.log('收藏数:', stats.favorites);
    console.log('邮件订阅:', stats.newsletterSignups);
  }
};

// 初始化事件追踪
EventTracker.init();
window.EventTracker = EventTracker;
window.trackEvent = function(name, props){ EventTracker.track(name, props); };

// ==========================================
// 2. 拦截关键行为，自动追踪事件
// ==========================================

// 拦截工具点击（访问官网）
var originalOpenToolLink = window.openToolLink;
window.openToolLink = function(tool){
  EventTracker.track('tool_click', {
    tool: tool ? tool.name : 'unknown',
    category: tool ? tool.category : 'unknown',
    source: 'tool_detail'
  });
  if(originalOpenToolLink){
    originalOpenToolLink(tool);
  }
};

// 拦截收藏
var originalToggleFavorite2 = window.toggleFavorite;
window.toggleFavorite = function(toolId){
  EventTracker.track('tool_favorite', { tool: toolId, action: 'toggle' });
  if(originalToggleFavorite2){
    originalToggleFavorite2(toolId);
  }
};

// 拦截搜索
var originalSearchTools = window.searchTools;
window.searchTools = function(){
  var query = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
  if(query && query.trim()){
    EventTracker.track('search', { query: query.trim(), source: 'hero_search' });
  }
  if(originalSearchTools){
    originalSearchTools();
  }
};

// 拦截邮件订阅
var originalSubscribeNewsletter = window.subscribeNewsletter;
window.subscribeNewsletter = function(e){
  if(e) e.preventDefault();
  var email = '';
  var emailInput = document.getElementById('newsletterEmail') || document.getElementById('footerEmail');
  if(emailInput) email = emailInput.value;
  if(email && email.indexOf('@') > -1){
    EventTracker.track('newsletter_signup', { email: email, source: 'newsletter_form' });
    // 保存订阅者
    var subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if(!subscribers.includes(email)){
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
  }
  if(originalSubscribeNewsletter){
    originalSubscribeNewsletter(e);
  }
};

// 页面浏览追踪
var pageViewCount = 0;
function trackPageView(viewName){
  pageViewCount++;
  EventTracker.track('page_view', { page: viewName, viewNumber: pageViewCount });
}

// 拦截导航
var originalNavigateTo2 = window.navigateTo;
window.navigateTo = function(view){
  trackPageView(view);
  if(originalNavigateTo2){
    originalNavigateTo2(view);
  }
};

// 首次页面浏览
setTimeout(function(){ trackPageView('home_initial'); }, 1000);

// ==========================================
// 3. 退出意图弹窗（Exit Intent Popup）
// ==========================================
var ExitIntentPopup = {
  shown: false,
  maxShowsPerDay: 1,

  init: function(){
    // 检查今天是否已经显示过
    var lastShow = localStorage.getItem('exit_popup_last_show');
    var today = new Date().toDateString();
    if(lastShow === today){
      this.shown = true;
      return;
    }

    // 监听鼠标移出页面顶部
    document.addEventListener('mouseout', function(e){
      if(e.clientY <= 0 && !ExitIntentPopup.shown){
        ExitIntentPopup.show();
      }
    });

    // 移动端：停留30秒后显示
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      setTimeout(function(){
        if(!ExitIntentPopup.shown){
          ExitIntentPopup.show();
        }
      }, 30000);
    }
  },

  show: function(){
    this.shown = true;
    localStorage.setItem('exit_popup_last_show', new Date().toDateString());
    EventTracker.track('exit_intent_shown', {});

    var overlay = document.createElement('div');
    overlay.id = 'exitIntentOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease;';

    var popup = document.createElement('div');
    popup.style.cssText = 'background:#fff;border-radius:20px;max-width:500px;width:100%;padding:40px;position:relative;box-shadow:0 25px 80px rgba(0,0,0,.3);animation:slideUp .4s ease;max-height:90vh;overflow-y:auto;';

    popup.innerHTML = `
      <button id="exitPopupClose" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:1.8rem;cursor:pointer;color:#999;line-height:1;">×</button>
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:3.5rem;margin-bottom:15px;">🎁</div>
        <h2 style="margin:0 0 10px;font-size:1.5rem;color:#1a1a2e;">别走！免费领取这份礼物</h2>
        <p style="color:#666;margin:0;font-size:.95rem;">订阅我们的每周AI工具速递，免费获取：</p>
      </div>
      <div style="background:linear-gradient(135deg,#f0f4ff,#faf5ff);border-radius:12px;padding:20px;margin-bottom:20px;">
        <ul style="margin:0;padding-left:20px;font-size:.9rem;line-height:2;">
          <li><strong>《2026年100款最佳AI工具完整榜单》</strong>（PDF，价值$29）</li>
          <li><strong>每周5个最值得关注的新AI工具</strong>（第一时间送达）</li>
          <li><strong>独家深度评测和使用教程</strong>（网站未发布内容）</li>
          <li><strong>限时优惠和独家折扣</strong>（AI工具专属优惠码）</li>
        </ul>
      </div>
      <form id="exitPopupForm" style="margin-bottom:15px;">
        <div style="display:flex;gap:10px;margin-bottom:10px;">
          <input type="email" id="exitPopupEmail" placeholder="输入你的邮箱地址" required style="flex:1;padding:14px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:.95rem;outline:none;transition:border-color .2s;" onfocus="this.style.borderColor='#667eea'">
          <button type="submit" style="padding:14px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:.9rem;white-space:nowrap;">免费领取</button>
        </div>
      </form>
      <p style="text-align:center;font-size:.75rem;color:#999;margin:0;">🔒 我们尊重你的隐私，随时可以取消订阅。已有 <strong>10,000+</strong> 人订阅。</p>
      <div id="exitPopupSuccess" style="display:none;text-align:center;padding:20px 0;">
        <div style="font-size:3rem;margin-bottom:10px;">🎉</div>
        <h3 style="margin:0 0 10px;color:#22c55e;">订阅成功！</h3>
        <p style="color:#666;margin:0;font-size:.9rem;">请查收你的邮箱，确认订阅后即可领取免费礼物。</p>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // 关闭按钮
    document.getElementById('exitPopupClose').addEventListener('click', function(){
      ExitIntentPopup.close();
      EventTracker.track('exit_intent_closed', { reason: 'close_button' });
    });

    // 点击背景关闭
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){
        ExitIntentPopup.close();
        EventTracker.track('exit_intent_closed', { reason: 'background_click' });
      }
    });

    // 表单提交
    document.getElementById('exitPopupForm').addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('exitPopupEmail').value;
      if(email && email.indexOf('@') > -1){
        EventTracker.track('newsletter_signup', { email: email, source: 'exit_intent_popup' });
        var subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if(!subscribers.includes(email)){
          subscribers.push(email);
          localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }
        document.getElementById('exitPopupForm').style.display = 'none';
        document.getElementById('exitPopupSuccess').style.display = 'block';
        setTimeout(function(){ ExitIntentPopup.close(); }, 3000);
      }
    });
  },

  close: function(){
    var overlay = document.getElementById('exitIntentOverlay');
    if(overlay){
      overlay.style.animation = 'fadeOut .3s ease';
      setTimeout(function(){ if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 300);
    }
  }
};

// 初始化退出意图弹窗（延迟2秒，不影响首屏）
setTimeout(function(){ ExitIntentPopup.init(); }, 2000);

// ==========================================
// 4. 邮件订阅激励（在现有订阅表单旁添加福利提示）
// ==========================================
function enhanceNewsletterForms(){
  // 给所有邮件订阅表单添加福利提示
  var forms = document.querySelectorAll('.newsletter-form, form[onsubmit*="subscribeNewsletter"]');
  forms.forEach(function(form){
    if(form.parentNode && !form.parentNode.querySelector('.newsletter-bonus')){
      var bonus = document.createElement('div');
      bonus.className = 'newsletter-bonus';
      bonus.style.cssText = 'margin-top:12px;font-size:.8rem;color:#667eea;display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;';
      bonus.innerHTML = '🎁 订阅即送《2026年100款最佳AI工具榜单》PDF + 每周独家推荐';
      form.parentNode.insertBefore(bonus, form.nextSibling);
    }
  });
}

setTimeout(enhanceNewsletterForms, 1500);

// ==========================================
// 5. 相关工具推荐模块（在工具详情页底部）
// ==========================================
function renderRelatedTools(tool){
  if(!tool || !tool.category) return '';
  var allTools = window.tools || [];
  var related = allTools.filter(function(t){
    return t.category === tool.category && t.name !== tool.name;
  }).slice(0, 4);

  if(related.length === 0) return '';

  var html = '<div style="margin-top:30px;padding-top:20px;border-top:1px solid var(--border-color);">';
  html += '<h3 style="margin-bottom:15px;font-size:1.1rem;">🔗 相关' + (SEOMeta.categoryNames[tool.category] || '工具') + '推荐</h3>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
  related.forEach(function(t){
    html += '<a href="#" onclick="return showToolDetail(\'' + (t.id || t.name) + '\'),!1" style="display:block;padding:15px;background:var(--bg-secondary);border-radius:10px;text-decoration:none;color:var(--text-primary);border:1px solid var(--border-color);transition:all .2s;" onmouseover="this.style.borderColor=\'#667eea\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border-color)\';this.style.transform=\'translateY(0)\'">';
    html += '<div style="font-size:1.5rem;margin-bottom:5px;">' + (t.icon || '🛠️') + '</div>';
    html += '<div style="font-weight:600;font-size:.9rem;margin-bottom:3px;">' + t.name + '</div>';
    html += '<div style="font-size:.75rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (t.description || '').substring(0, 40) + '</div>';
    html += '</a>';
  });
  html += '</div></div>';
  return html;
}

// 暴露全局
window.renderRelatedTools = renderRelatedTools;

// 拦截工具详情页渲染，注入相关工具推荐
var originalRenderToolDetail2 = window.renderToolDetail;
window.renderToolDetail = function(tool){
  if(originalRenderToolDetail2){
    originalRenderToolDetail2(tool);
  }
  setTimeout(function(){
    var detailContent = document.getElementById('detailContent');
    if(detailContent && tool){
      // 追踪文章/工具浏览
      EventTracker.track('tool_view', { tool: tool.name, category: tool.category });

      // 注入相关工具推荐（如果还没有）
      if(!detailContent.querySelector('.related-tools-injected')){
        var relatedHtml = renderRelatedTools(tool);
        if(relatedHtml){
          var wrapper = document.createElement('div');
          wrapper.className = 'related-tools-injected';
          wrapper.innerHTML = relatedHtml;
          detailContent.appendChild(wrapper);
        }
      }
    }
  }, 200);
};

// ==========================================
// 6. 添加CSS动画
// ==========================================
var style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
`;
document.head.appendChild(style);

// ==========================================
// 7. 控制台命令：显示数据仪表盘
// ==========================================
window.showStats = function(){ EventTracker.showDashboard(); };

console.log('%c🚀 增长优化器已加载：退出意图弹窗 + 邮件激励 + 事件追踪 + 相关推荐', 'color:#22c55e;font-size:12px;font-weight:bold');
console.log('%c💡 提示：在控制台输入 showStats() 查看数据仪表盘', 'color:#667eea;font-size:11px');

})();
