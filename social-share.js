// ===== 第十六轮：社交分享系统 =====
// 1. 文章/工具详情页分享按钮
// 2. 支持Twitter/Facebook/微博/LinkedIn/复制链接
// 3. 自动带上标题、URL、描述
// 4. 分享点击追踪
// 5. 浮动分享栏（文章页侧边）

(function(){
'use strict';

// 分享平台配置
var SharePlatforms = {
  twitter: {
    name: 'Twitter',
    icon: '𝕏',
    color: '#000000',
    getUrl: function(title, url){
      return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
    }
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    getUrl: function(title, url){
      return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(title);
    }
  },
  weibo: {
    name: '微博',
    icon: '微',
    color: '#E6162D',
    getUrl: function(title, url){
      return 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    }
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    getUrl: function(title, url){
      return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
    }
  },
  reddit: {
    name: 'Reddit',
    icon: 'r',
    color: '#FF4500',
    getUrl: function(title, url){
      return 'https://www.reddit.com/submit?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    }
  },
  telegram: {
    name: 'Telegram',
    icon: '✈',
    color: '#0088CC',
    getUrl: function(title, url){
      return 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
    }
  }
};

// 获取当前页面信息
function getPageInfo(){
  var title = document.title;
  var url = window.location.href;
  var description = '';

  // 尝试从meta获取描述
  var metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc) description = metaDesc.content;

  // 尝试从文章/工具详情获取标题
  var detailTitle = document.querySelector('#detailContent h1, #blogArticleContent h1');
  if(detailTitle) title = detailTitle.textContent.trim();

  return { title: title, url: url, description: description };
}

// 渲染分享按钮组
function renderShareButtons(layout){
  layout = layout || 'horizontal'; // horizontal | vertical | compact
  var pageInfo = getPageInfo();
  var platforms = ['twitter', 'facebook', 'weibo', 'linkedin', 'reddit', 'telegram'];

  var html = '';

  if(layout === 'vertical'){
    html = '<div class="share-bar-vertical" style="position:fixed;left:20px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px;z-index:1000;">';
    platforms.forEach(function(key){
      var p = SharePlatforms[key];
      html += '<button onclick="shareToPlatform(\'' + key + '\')" title="分享到' + p.name + '" style="width:40px;height:40px;border-radius:50%;border:none;background:' + p.color + ';color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all .2s;" onmouseover="this.style.transform=\'scale(1.15)\'" onmouseout="this.style.transform=\'scale(1)\'">' + p.icon + '</button>';
    });
    html += '<button onclick="copyShareLink()" title="复制链接" style="width:40px;height:40px;border-radius:50%;border:none;background:#666;color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all .2s;" onmouseover="this.style.transform=\'scale(1.15)\'" onmouseout="this.style.transform=\'scale(1)\'">🔗</button>';
    html += '</div>';
  } else if(layout === 'compact'){
    html = '<div class="share-compact" style="display:flex;gap:6px;align-items:center;">';
    html += '<span style="font-size:.8rem;color:var(--text-secondary);margin-right:4px;">分享：</span>';
    platforms.slice(0, 4).forEach(function(key){
      var p = SharePlatforms[key];
      html += '<button onclick="shareToPlatform(\'' + key + '\')" title="分享到' + p.name + '" style="width:32px;height:32px;border-radius:50%;border:none;background:' + p.color + ';color:#fff;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'">' + p.icon + '</button>';
    });
    html += '<button onclick="copyShareLink()" title="复制链接" style="width:32px;height:32px;border-radius:50%;border:none;background:#666;color:#fff;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.transform=\'scale(1.1)\'" onmouseout="this.style.transform=\'scale(1)\'">🔗</button>';
    html += '</div>';
  } else {
    // horizontal (default)
    html = '<div class="share-buttons" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:20px 0;padding:15px;background:var(--bg-secondary);border-radius:12px;">';
    html += '<span style="font-weight:600;font-size:.9rem;color:var(--text-primary);margin-right:5px;">📤 分享这篇文章</span>';
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
    platforms.forEach(function(key){
      var p = SharePlatforms[key];
      html += '<button onclick="shareToPlatform(\'' + key + '\')" title="分享到' + p.name + '" style="padding:8px 14px;border-radius:20px;border:none;background:' + p.color + ';color:#fff;font-size:.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.2)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">' + p.icon + ' ' + p.name + '</button>';
    });
    html += '<button onclick="copyShareLink()" title="复制链接" style="padding:8px 14px;border-radius:20px;border:1px solid var(--border-color);background:var(--bg-primary);color:var(--text-primary);font-size:.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .2s;" onmouseover="this.style.borderColor=\'#667eea\';this.style.color=\'#667eea\'" onmouseout="this.style.borderColor=\'var(--border-color)\';this.style.color=\'var(--text-primary)\'">🔗 复制链接</button>';
    html += '</div></div>';
  }

  return html;
}

// 分享到指定平台
function shareToPlatform(platformKey){
  var p = SharePlatforms[platformKey];
  if(!p) return;

  var pageInfo = getPageInfo();
  var shareUrl = p.getUrl(pageInfo.title, pageInfo.url);

  // 打开分享窗口
  var width = 600, height = 500;
  var left = (window.innerWidth - width) / 2;
  var top = (window.innerHeight - height) / 2;
  window.open(shareUrl, 'share-' + platformKey, 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes');

  // 追踪分享事件
  if(typeof trackEvent === 'function'){
    trackEvent('social_share', { platform: platformKey, title: pageInfo.title, url: pageInfo.url });
  }

  // 显示提示
  showShareToast('正在打开 ' + p.name + '...');
}

// 复制链接
function copyShareLink(){
  var pageInfo = getPageInfo();
  var text = pageInfo.title + '\n' + pageInfo.url;

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){
      showShareToast('✅ 链接已复制到剪贴板');
    }).catch(function(){
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }

  if(typeof trackEvent === 'function'){
    trackEvent('copy_link', { title: pageInfo.title, url: pageInfo.url });
  }
}

function fallbackCopy(text){
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showShareToast('✅ 链接已复制到剪贴板');
  } catch(e){
    showShareToast('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}

// 显示分享提示
function showShareToast(message){
  var existing = document.getElementById('share-toast');
  if(existing) existing.remove();

  var toast = document.createElement('div');
  toast.id = 'share-toast';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--bg-primary,#333);color:var(--text-primary,#fff);padding:12px 24px;border-radius:30px;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:100001;font-size:.9rem;font-weight:500;transition:transform .3s ease;border:1px solid var(--border-color,#444);';
  document.body.appendChild(toast);

  setTimeout(function(){ toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  setTimeout(function(){
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(function(){ toast.remove(); }, 300);
  }, 2500);
}

// 在文章详情页注入分享按钮
function injectShareButtons(){
  // 文章详情页
  var articleContent = document.getElementById('blogArticleContent');
  if(articleContent && !articleContent.querySelector('.share-buttons-injected')){
    var shareHtml = renderShareButtons('horizontal');
    var wrapper = document.createElement('div');
    wrapper.className = 'share-buttons-injected';
    wrapper.innerHTML = shareHtml;

    // 插入到文章末尾（在相关文章之前）
    var relatedSection = articleContent.querySelector('.related-articles-injected');
    if(relatedSection){
      articleContent.insertBefore(wrapper, relatedSection);
    } else {
      articleContent.appendChild(wrapper);
    }

    // 桌面端添加侧边浮动分享栏
    if(window.innerWidth > 1024){
      var verticalBar = document.createElement('div');
      verticalBar.className = 'vertical-share-bar';
      verticalBar.innerHTML = renderShareButtons('vertical');
      verticalBar.style.cssText = 'position:fixed;left:15px;top:50%;transform:translateY(-50%);z-index:1000;';
      document.body.appendChild(verticalBar);
    }
  }

  // 工具详情页
  var detailContent = document.getElementById('detailContent');
  if(detailContent && !detailContent.querySelector('.share-compact-injected')){
    var compactHtml = renderShareButtons('compact');
    var compactWrapper = document.createElement('div');
    compactWrapper.className = 'share-compact-injected';
    compactWrapper.style.cssText = 'margin:15px 0;padding:12px 16px;background:var(--bg-secondary);border-radius:10px;';
    compactWrapper.innerHTML = compactHtml;

    // 插入到工具详情的价格表格之后
    var priceTable = detailContent.querySelector('table');
    if(priceTable && priceTable.parentNode){
      priceTable.parentNode.insertBefore(compactWrapper, priceTable.nextSibling);
    } else {
      detailContent.insertBefore(compactWrapper, detailContent.firstChild.nextSibling);
    }
  }
}

// 监听页面变化，自动注入分享按钮
var shareObserver = new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    if(mutation.addedNodes){
      mutation.addedNodes.forEach(function(node){
        if(node.nodeType === 1 && (node.id === 'blogArticleView' || node.id === 'detailView')){
          setTimeout(injectShareButtons, 300);
        }
      });
    }
  });
});

// 清理侧边分享栏（离开文章页时）
function cleanupVerticalShareBar(){
  var articleView = document.getElementById('blogArticleView');
  if(!articleView || articleView.style.display === 'none'){
    var verticalBar = document.querySelector('.vertical-share-bar');
    if(verticalBar) verticalBar.remove();
  }
}

// 暴露全局函数
window.shareToPlatform = shareToPlatform;
window.copyShareLink = copyShareLink;
window.renderShareButtons = renderShareButtons;
window.SharePlatforms = SharePlatforms;

// 初始化
function init(){
  shareObserver.observe(document.body, { childList: true, subtree: true });

  // 初始检查
  setTimeout(injectShareButtons, 1000);

  // 监听hash变化，清理侧边栏
  window.addEventListener('hashchange', function(){
    setTimeout(cleanupVerticalShareBar, 300);
  });

  console.log('%c📤 社交分享系统已加载：支持Twitter/Facebook/微博/LinkedIn/Reddit/Telegram/复制链接', 'color:#1877F2;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
