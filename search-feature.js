// ===== 第十三轮：全局搜索功能 =====
// 1. Ctrl+K / Cmd+K 快捷键触发搜索
// 2. 搜索工具（名称、描述、分类、标签）
// 3. 搜索文章（标题、摘要、内容）
// 4. 实时搜索结果展示
// 5. 键盘导航（上下选择，回车跳转）

(function(){
'use strict';

var searchOverlay = null;
var searchInput = null;
var searchResults = null;
var selectedIndex = -1;
var currentResults = [];

// 创建搜索UI
function createSearchUI(){
  if(searchOverlay) return;

  // 遮罩层
  searchOverlay = document.createElement('div');
  searchOverlay.id = 'search-overlay';
  searchOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:100000;display:none;align-items:flex-start;justify-content:center;padding-top:15vh;backdrop-filter:blur(4px);';

  // 搜索容器
  var container = document.createElement('div');
  container.style.cssText = 'background:var(--bg-primary,#fff);border-radius:16px;width:90%;max-width:600px;box-shadow:0 25px 80px rgba(0,0,0,0.3);overflow:hidden;animation:searchIn .25s ease-out;';

  // 搜索输入框区域
  var inputArea = document.createElement('div');
  inputArea.style.cssText = 'display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border-color,#eee);';

  var searchIcon = document.createElement('span');
  searchIcon.textContent = '🔍';
  searchIcon.style.cssText = 'font-size:1.2rem;margin-right:12px;opacity:.6;';

  searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = '搜索工具或文章... (Ctrl+K)';
  searchInput.style.cssText = 'flex:1;border:none;outline:none;font-size:1.05rem;background:transparent;color:var(--text-primary,#333);';

  var closeBtn = document.createElement('button');
  closeBtn.textContent = 'ESC';
  closeBtn.style.cssText = 'padding:4px 10px;background:var(--bg-secondary,#f5f5f5);border:none;border-radius:6px;font-size:.75rem;color:var(--text-secondary,#888);cursor:pointer;font-weight:600;';
  closeBtn.onclick = closeSearch;

  inputArea.appendChild(searchIcon);
  inputArea.appendChild(searchInput);
  inputArea.appendChild(closeBtn);

  // 搜索结果区域
  searchResults = document.createElement('div');
  searchResults.style.cssText = 'max-height:50vh;overflow-y:auto;padding:8px;';

  // 初始提示
  searchResults.innerHTML = '<div style="padding:30px;text-align:center;color:var(--text-secondary,#999);font-size:.9rem;"><div style="font-size:2rem;margin-bottom:10px;">💡</div>输入关键词搜索AI工具或深度文章<br><span style="font-size:.8rem;opacity:.7;">支持按名称、分类、功能搜索</span></div>';

  container.appendChild(inputArea);
  container.appendChild(searchResults);
  searchOverlay.appendChild(container);
  document.body.appendChild(searchOverlay);

  // 添加动画样式
  if(!document.getElementById('search-style')){
    var style = document.createElement('style');
    style.id = 'search-style';
    style.textContent = '@keyframes searchIn{from{opacity:0;transform:translateY(-20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}} .search-result-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;cursor:pointer;transition:background .15s;} .search-result-item:hover,.search-result-item.selected{background:var(--bg-secondary,#f5f5f5);} .search-result-item.selected{background:rgba(102,126,234,0.1);}';
    document.head.appendChild(style);
  }

  // 事件绑定
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keydown', handleKeydown);
  searchOverlay.addEventListener('click', function(e){
    if(e.target === searchOverlay) closeSearch();
  });
}

// 打开搜索
function openSearch(){
  createSearchUI();
  searchOverlay.style.display = 'flex';
  setTimeout(function(){ searchInput.focus(); }, 50);
  selectedIndex = -1;
  if(typeof trackEvent === 'function') trackEvent('search_open', {});
}

// 关闭搜索
function closeSearch(){
  if(searchOverlay){
    searchOverlay.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '<div style="padding:30px;text-align:center;color:var(--text-secondary,#999);font-size:.9rem;"><div style="font-size:2rem;margin-bottom:10px;">💡</div>输入关键词搜索AI工具或深度文章<br><span style="font-size:.8rem;opacity:.7;">支持按名称、分类、功能搜索</span></div>';
  }
  selectedIndex = -1;
  currentResults = [];
}

// 处理搜索
function handleSearch(){
  var query = searchInput.value.trim().toLowerCase();
  if(!query){
    searchResults.innerHTML = '<div style="padding:30px;text-align:center;color:var(--text-secondary,#999);font-size:.9rem;"><div style="font-size:2rem;margin-bottom:10px;">💡</div>输入关键词搜索AI工具或深度文章<br><span style="font-size:.8rem;opacity:.7;">支持按名称、分类、功能搜索</span></div>';
    currentResults = [];
    selectedIndex = -1;
    return;
  }

  var results = [];

  // 搜索工具
  var allTools = window.tools || [];
  allTools.forEach(function(tool){
    var name = (tool.name || '').toLowerCase();
    var desc = (tool.description || tool.desc || '').toLowerCase();
    var category = (tool.category || '').toLowerCase();
    var tags = (tool.tags || []).join(' ').toLowerCase();
    var searchText = name + ' ' + desc + ' ' + category + ' ' + tags;

    if(searchText.includes(query)){
      var score = 0;
      if(name.includes(query)) score += 10;
      if(name.startsWith(query)) score += 5;
      if(category.includes(query)) score += 3;
      if(desc.includes(query)) score += 2;

      results.push({
        type: 'tool',
        item: tool,
        title: tool.name,
        description: tool.description || tool.desc || '',
        icon: tool.icon || '🛠️',
        category: tool.category,
        score: score,
        id: tool.id || tool.name
      });
    }
  });

  // 搜索文章
  var allArticles = [];
  if(window.ARTICLES) allArticles = allArticles.concat(window.ARTICLES);
  if(window.ARTICLES_V2) allArticles = allArticles.concat(window.ARTICLES_V2);
  if(window.ARTICLES_V3) allArticles = allArticles.concat(window.ARTICLES_V3);
  if(window.ARTICLES_V4) allArticles = allArticles.concat(window.ARTICLES_V4);
  if(window.ARTICLES_V5) allArticles = allArticles.concat(window.ARTICLES_V5);

  allArticles.forEach(function(article){
    var title = (article.title || '').toLowerCase();
    var excerpt = (article.excerpt || '').toLowerCase();
    var keywords = (article.keywords || []).join(' ').toLowerCase();
    var category = (article.category || '').toLowerCase();
    var searchText = title + ' ' + excerpt + ' ' + keywords + ' ' + category;

    if(searchText.includes(query)){
      var score = 0;
      if(title.includes(query)) score += 10;
      if(title.startsWith(query)) score += 5;
      if(keywords.includes(query)) score += 4;
      if(excerpt.includes(query)) score += 2;

      results.push({
        type: 'article',
        item: article,
        title: article.title,
        description: article.excerpt || '',
        icon: '📖',
        category: article.category,
        score: score,
        id: article.id || article.slug
      });
    }
  });

  // 按分数排序
  results.sort(function(a,b){ return b.score - a.score; });
  currentResults = results.slice(0, 10);
  selectedIndex = -1;

  // 渲染结果
  renderResults();
}

// 渲染搜索结果
function renderResults(){
  if(currentResults.length === 0){
    searchResults.innerHTML = '<div style="padding:30px;text-align:center;color:var(--text-secondary,#999);font-size:.9rem;"><div style="font-size:2rem;margin-bottom:10px;">🔍</div>未找到相关结果<br><span style="font-size:.8rem;opacity:.7;">试试其他关键词</span></div>';
    return;
  }

  var html = '';

  // 工具结果
  var toolResults = currentResults.filter(function(r){ return r.type === 'tool'; });
  var articleResults = currentResults.filter(function(r){ return r.type === 'article'; });

  if(toolResults.length > 0){
    html += '<div style="padding:6px 12px;font-size:.75rem;font-weight:700;color:var(--text-secondary,#888);text-transform:uppercase;letter-spacing:.5px;">🛠️ AI工具 (' + toolResults.length + ')</div>';
    toolResults.forEach(function(result, index){
      var globalIndex = currentResults.indexOf(result);
      html += renderResultItem(result, globalIndex);
    });
  }

  if(articleResults.length > 0){
    html += '<div style="padding:10px 12px 6px;font-size:.75rem;font-weight:700;color:var(--text-secondary,#888);text-transform:uppercase;letter-spacing:.5px;">📖 深度文章 (' + articleResults.length + ')</div>';
    articleResults.forEach(function(result){
      var globalIndex = currentResults.indexOf(result);
      html += renderResultItem(result, globalIndex);
    });
  }

  searchResults.innerHTML = html;

  // 绑定点击事件
  var items = searchResults.querySelectorAll('.search-result-item');
  items.forEach(function(item, index){
    item.addEventListener('click', function(){
      selectResult(currentResults[index]);
    });
  });
}

function renderResultItem(result, index){
  var isSelected = index === selectedIndex;
  var categoryName = result.category || '';
  var categoryNames = {
    writing: 'AI写作', image: 'AI图像', video: 'AI视频',
    code: 'AI编程', audio: 'AI音频', productivity: 'AI效率'
  };
  var displayCategory = categoryNames[categoryName] || categoryName;

  return '<div class="search-result-item' + (isSelected ? ' selected' : '') + '" data-index="' + index + '">' +
    '<div style="font-size:1.4rem;width:36px;text-align:center;">' + result.icon + '</div>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-weight:600;font-size:.95rem;color:var(--text-primary,#333);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + highlightText(result.title, searchInput.value) + '</div>' +
      '<div style="font-size:.8rem;color:var(--text-secondary,#888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">' + (result.description || '').substring(0, 80) + '</div>' +
    '</div>' +
    '<div style="font-size:.7rem;padding:3px 8px;background:var(--bg-secondary,#f5f5f5);border-radius:10px;color:var(--text-secondary,#888);white-space:nowrap;">' + displayCategory + '</div>' +
  '</div>';
}

// 高亮搜索关键词
function highlightText(text, query){
  if(!query) return text;
  var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(regex, '<mark style="background:rgba(102,126,234,0.2);color:inherit;padding:0 2px;border-radius:3px;">$1</mark>');
}

// 键盘导航
function handleKeydown(e){
  if(e.key === 'Escape'){
    closeSearch();
  } else if(e.key === 'ArrowDown'){
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
    renderResults();
    scrollToSelected();
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    renderResults();
    scrollToSelected();
  } else if(e.key === 'Enter'){
    e.preventDefault();
    if(selectedIndex >= 0 && currentResults[selectedIndex]){
      selectResult(currentResults[selectedIndex]);
    } else if(currentResults.length > 0){
      selectResult(currentResults[0]);
    }
  }
}

function scrollToSelected(){
  var selected = searchResults.querySelector('.search-result-item.selected');
  if(selected){
    selected.scrollIntoView({ block: 'nearest' });
  }
}

// 选择搜索结果
function selectResult(result){
  closeSearch();

  if(typeof trackEvent === 'function'){
    trackEvent('search_select', { type: result.type, query: searchInput.value, result: result.title });
  }

  setTimeout(function(){
    if(result.type === 'tool'){
      if(typeof window.showToolDetail === 'function'){
        window.showToolDetail(result.id);
      }
    } else if(result.type === 'article'){
      if(typeof window.showBlogArticle === 'function'){
        window.showBlogArticle(result.id);
      }
    }
  }, 100);
}

// 添加搜索按钮到导航栏
function addSearchButton(){
  var nav = document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('header');
  if(!nav) return;

  // 检查是否已有搜索按钮
  if(document.getElementById('nav-search-btn')) return;

  var searchBtn = document.createElement('button');
  searchBtn.id = 'nav-search-btn';
  searchBtn.innerHTML = '🔍 <span style="font-size:.8rem;opacity:.7;margin-left:4px;">Ctrl+K</span>';
  searchBtn.style.cssText = 'padding:8px 16px;background:var(--bg-secondary,#f5f5f5);border:1px solid var(--border-color,#ddd);border-radius:20px;cursor:pointer;font-size:.9rem;color:var(--text-secondary,#666);display:flex;align-items:center;gap:6px;transition:all .2s;';
  searchBtn.onmouseover = function(){ this.style.borderColor = '#667eea'; this.style.color = '#667eea'; };
  searchBtn.onmouseout = function(){ this.style.borderColor = 'var(--border-color,#ddd)'; this.style.color = 'var(--text-secondary,#666)'; };
  searchBtn.onclick = openSearch;

  // 插入到导航栏
  if(nav.querySelector('.nav-right') || nav.querySelector('.nav-actions')){
    var target = nav.querySelector('.nav-right') || nav.querySelector('.nav-actions');
    target.insertBefore(searchBtn, target.firstChild);
  } else {
    nav.appendChild(searchBtn);
  }
}

// 全局快捷键
document.addEventListener('keydown', function(e){
  if((e.ctrlKey || e.metaKey) && e.key === 'k'){
    e.preventDefault();
    if(searchOverlay && searchOverlay.style.display === 'flex'){
      closeSearch();
    } else {
      openSearch();
    }
  }
});

// 初始化
function init(){
  createSearchUI();
  setTimeout(addSearchButton, 500);
  console.log('%c🔍 全局搜索已加载：Ctrl+K 触发，支持搜索30款工具和12篇深度文章', 'color:#667eea;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 暴露全局函数
window.openSearch = openSearch;
window.closeSearch = closeSearch;

})();
