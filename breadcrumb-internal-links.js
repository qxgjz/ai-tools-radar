// ===== 第十六轮：面包屑导航 + SEO内部链接优化 =====
// 1. 面包屑导航（首页 > 分类 > 工具/文章）
// 2. 文章中自动添加内部链接（工具名链接到详情页）
// 3. 工具详情页相关工具/文章链接
// 4. 面包屑结构化数据（BreadcrumbList JSON-LD）
// 5. 内部链接点击追踪

(function(){
'use strict';

// 分类名称映射
var CategoryNames = {
  writing: 'AI写作工具',
  image: 'AI图像工具',
  video: 'AI视频工具',
  code: 'AI编程工具',
  audio: 'AI音频工具',
  productivity: 'AI效率工具'
};

// 工具名称映射（用于文章内链）
var ToolNameMap = {
  'ChatGPT': 'chatgpt',
  'GPT-4': 'chatgpt',
  'GPT-4o': 'chatgpt',
  'Claude': 'claude',
  'Claude 3': 'claude',
  'Claude 3.5': 'claude',
  'Gemini': 'gemini',
  'Gemini 1.5': 'gemini',
  'Midjourney': 'midjourney',
  'DALL-E': 'dall-e-3',
  'DALL-E 3': 'dall-e-3',
  'Stable Diffusion': 'stable-diffusion',
  'GitHub Copilot': 'github-copilot',
  'Copilot': 'github-copilot',
  'Cursor': 'cursor',
  'Jasper': 'jasper',
  'Copy.ai': 'copy-ai',
  'Writesonic': 'writesonic',
  'Notion AI': 'notion-ai',
  'Notion': 'notion-ai',
  'Grammarly': 'grammarly',
  'Suno': 'suno',
  'ElevenLabs': 'elevenlabs',
  'Runway': 'runway',
  'Pika': 'pika',
  'Sora': 'sora',
  'Leonardo AI': 'leonardo-ai',
  'Adobe Firefly': 'adobe-firefly',
  'CapCut': 'capcut',
  'HeyGen': 'heygen',
  'Mistral': 'mistral',
  'Mistral Large': 'mistral',
  'Anthropic': 'claude',
  'OpenAI': 'chatgpt',
  'Google': 'gemini'
};

// 渲染面包屑导航
function renderBreadcrumb(items){
  if(!items || items.length === 0) return '';

  var html = '<nav class="breadcrumb" aria-label="面包屑导航" style="margin:15px 0;padding:10px 16px;background:var(--bg-secondary);border-radius:8px;font-size:.85rem;">';
  html += '<ol style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;align-items:center;gap:5px;">';

  items.forEach(function(item, index){
    var isLast = index === items.length - 1;
    if(isLast){
      html += '<li aria-current="page" style="color:var(--text-primary);font-weight:600;">' + item.name + '</li>';
    } else {
      html += '<li><a href="' + item.url + '" style="color:var(--text-secondary);text-decoration:none;transition:color .2s;" onmouseover="this.style.color=\'#667eea\'" onmouseout="this.style.color=\'var(--text-secondary)\'">' + item.name + '</a></li>';
      html += '<li style="color:var(--text-tertiary,#ccc);">/</li>';
    }
  });

  html += '</ol></nav>';

  // 注入面包屑结构化数据
  injectBreadcrumbSchema(items);

  return html;
}

// 注入面包屑结构化数据
function injectBreadcrumbSchema(items){
  var existing = document.getElementById('breadcrumb-schema');
  if(existing) existing.remove();

  var itemListElement = items.map(function(item, index){
    return {
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url || window.location.href
    };
  });

  var schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemListElement
  };

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'breadcrumb-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// 在文章详情页添加面包屑
function addArticleBreadcrumb(article){
  var articleView = document.getElementById('blogArticleView');
  if(!articleView || articleView.style.display === 'none') return;

  var container = articleView.querySelector('.detail-container');
  if(!container) return;

  // 检查是否已有面包屑
  if(container.querySelector('.breadcrumb-injected')) return;

  var category = article.category || 'writing';
  var categoryName = CategoryNames[category] || 'AI工具';

  var breadcrumbItems = [
    { name: '首页', url: '#' },
    { name: '深度评测', url: '#/blog' },
    { name: categoryName, url: '#/blog?category=' + category },
    { name: article.title.substring(0, 30) + (article.title.length > 30 ? '...' : '') }
  ];

  var breadcrumbHtml = renderBreadcrumb(breadcrumbItems);
  var wrapper = document.createElement('div');
  wrapper.className = 'breadcrumb-injected';
  wrapper.innerHTML = breadcrumbHtml;

  // 插入到返回按钮之后
  var backBtn = container.querySelector('.back-btn');
  if(backBtn){
    backBtn.parentNode.insertBefore(wrapper, backBtn.nextSibling);
  } else {
    container.insertBefore(wrapper, container.firstChild);
  }
}

// 在工具详情页添加面包屑
function addToolBreadcrumb(tool){
  var detailView = document.getElementById('detailView');
  if(!detailView || detailView.style.display === 'none') return;

  var container = detailView.querySelector('.detail-container');
  if(!container) return;

  if(container.querySelector('.breadcrumb-injected')) return;

  var category = tool.category || 'writing';
  var categoryName = CategoryNames[category] || 'AI工具';

  var breadcrumbItems = [
    { name: '首页', url: '#' },
    { name: categoryName, url: '#?category=' + category },
    { name: tool.name }
  ];

  var breadcrumbHtml = renderBreadcrumb(breadcrumbItems);
  var wrapper = document.createElement('div');
  wrapper.className = 'breadcrumb-injected';
  wrapper.innerHTML = breadcrumbHtml;

  var backBtn = container.querySelector('.back-btn');
  if(backBtn){
    backBtn.parentNode.insertBefore(wrapper, backBtn.nextSibling);
  } else {
    container.insertBefore(wrapper, container.firstChild);
  }
}

// 文章内容自动内链优化
function addInternalLinksToArticle(articleContent){
  if(!articleContent) return;

  // 获取所有文本节点（排除链接、代码、标题）
  var walker = document.createTreeWalker(
    articleContent,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node){
        var parent = node.parentNode;
        if(!parent) return NodeFilter.FILTER_REJECT;
        // 跳过链接、代码、标题中的文本
        if(parent.tagName === 'A' || parent.tagName === 'CODE' || parent.tagName === 'PRE') return NodeFilter.FILTER_REJECT;
        if(parent.closest('a, code, pre, h1, h2, h3')) return NodeFilter.FILTER_REJECT;
        // 只处理有足够长度的文本
        if(node.textContent.length < 20) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  var textNodes = [];
  var node;
  while(node = walker.nextNode()){
    textNodes.push(node);
  }

  // 对每个文本节点进行内链替换（每个工具名只替换一次）
  var usedTools = {};
  var linkCount = 0;
  var maxLinks = 8; // 每篇文章最多8个内链

  textNodes.forEach(function(textNode){
    if(linkCount >= maxLinks) return;

    var text = textNode.textContent;
    var replaced = false;

    for(var toolName in ToolNameMap){
      if(usedTools[toolName]) continue;
      if(linkCount >= maxLinks) break;

      // 使用单词边界匹配（避免部分匹配）
      var regex = new RegExp('\\b' + toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if(regex.test(text)){
        var toolId = ToolNameMap[toolName];
        var match = text.match(regex);
        if(match){
          var linkHtml = '<a href="#tool/' + toolId + '" class="internal-link" data-tool="' + toolId + '" style="color:#667eea;text-decoration:none;border-bottom:1px dashed #667eea;transition:all .2s;" onmouseover="this.style.background=\'rgba(102,126,234,0.1)\'" onmouseout="this.style.background=\'transparent\'" onclick="trackInternalLinkClick(\'' + toolId + '\',\'' + toolName + '\')">' + match[0] + '</a>';

          var newHtml = text.replace(regex, linkHtml);
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = newHtml;

          // 替换文本节点
          while(tempDiv.firstChild){
            textNode.parentNode.insertBefore(tempDiv.firstChild, textNode);
          }
          textNode.parentNode.removeChild(textNode);

          usedTools[toolName] = true;
          linkCount++;
          replaced = true;
          break; // 一个文本节点只替换一个工具名
        }
      }
    }
  });

  return linkCount;
}

// 追踪内链点击
function trackInternalLinkClick(toolId, toolName){
  if(typeof trackEvent === 'function'){
    trackEvent('internal_link_click', {
      tool_id: toolId,
      tool_name: toolName,
      source: 'article_internal_link'
    });
  }
}

// 工具详情页添加相关工具链接
function addRelatedToolsLinks(tool){
  var detailContent = document.getElementById('detailContent');
  if(!detailContent) return;
  if(detailContent.querySelector('.related-tools-injected')) return;

  var allTools = window.tools || [];
  var category = tool.category;
  var relatedTools = allTools.filter(function(t){
    return t.category === category && t.name !== tool.name;
  }).slice(0, 5);

  if(relatedTools.length === 0) return;

  var html = '<div class="related-tools-injected" style="margin-top:25px;padding:20px;background:var(--bg-secondary);border-radius:12px;">';
  html += '<h4 style="margin:0 0 12px;font-size:1rem;">🔗 相关' + (CategoryNames[category] || '工具') + '</h4>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
  relatedTools.forEach(function(t){
    var toolId = (t.id || t.name || '').toLowerCase().replace(/\s+/g, '-');
    html += '<a href="#tool/' + toolId + '" onclick="trackInternalLinkClick(\'' + toolId + '\',\'' + t.name + '\')" style="padding:6px 14px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:20px;text-decoration:none;color:var(--text-primary);font-size:.85rem;transition:all .2s;" onmouseover="this.style.borderColor=\'#667eea\';this.style.color=\'#667eea\'" onmouseout="this.style.borderColor=\'var(--border-color)\';this.style.color=\'var(--text-primary)\'">' + (t.icon || '🛠️') + ' ' + t.name + '</a>';
  });
  html += '</div></div>';

  detailContent.appendChild(document.createRange().createContextualFragment(html));
}

// 监听页面变化
var observer = new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    if(mutation.addedNodes){
      mutation.addedNodes.forEach(function(node){
        if(node.nodeType !== 1) return;

        // 文章详情页
        if(node.id === 'blogArticleView' || node.querySelector('#blogArticleContent')){
          setTimeout(function(){
            var articleContent = document.getElementById('blogArticleContent');
            if(articleContent){
              // 添加内链
              var linkCount = addInternalLinksToArticle(articleContent);
              if(linkCount > 0){
                console.log('%c🔗 文章内链优化：添加了 ' + linkCount + ' 个内部链接', 'color:#667eea;font-size:11px;');
              }
            }
          }, 400);
        }
      });
    }
  });
});

// 暴露全局函数
window.renderBreadcrumb = renderBreadcrumb;
window.addArticleBreadcrumb = addArticleBreadcrumb;
window.addToolBreadcrumb = addToolBreadcrumb;
window.addInternalLinksToArticle = addInternalLinksToArticle;
window.addRelatedToolsLinks = addRelatedToolsLinks;
window.trackInternalLinkClick = trackInternalLinkClick;

// 初始化
function init(){
  observer.observe(document.body, { childList: true, subtree: true });

  // 拦截文章显示，添加面包屑
  var originalShowBlogArticle = window.showBlogArticle;
  if(originalShowBlogArticle){
    window.showBlogArticle = function(articleId){
      originalShowBlogArticle(articleId);
      setTimeout(function(){
        // 查找文章对象
        var allArticles = [];
        if(window.ARTICLES) allArticles = allArticles.concat(window.ARTICLES);
        for(var i = 2; i <= 6; i++){
          if(window['ARTICLES_V' + i]) allArticles = allArticles.concat(window['ARTICLES_V' + i]);
        }
        var article = allArticles.find(function(a){ return a.id === articleId || a.slug === articleId; });
        if(article) addArticleBreadcrumb(article);
      }, 350);
    };
  }

  // 拦截工具详情显示，添加面包屑和相关工具
  var originalShowToolDetail = window.showToolDetail;
  if(originalShowToolDetail){
    window.showToolDetail = function(tool){
      originalShowToolDetail(tool);
      setTimeout(function(){
        var toolObj = typeof tool === 'string' ? (window.tools || []).find(function(t){ return (t.id || t.name || '').toLowerCase().replace(/\s+/g,'-') === tool; }) : tool;
        if(toolObj){
          addToolBreadcrumb(toolObj);
          addRelatedToolsLinks(toolObj);
        }
      }, 350);
    };
  }

  console.log('%c🍞 面包屑导航+内链优化已加载：面包屑结构化数据 + 文章自动内链 + 相关工具链接', 'color:#f59e0b;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
