// ===== 第十三轮：暗色模式 =====
// 1. 一键切换明暗主题
// 2. localStorage 记忆用户偏好
// 3. 首次访问跟随系统主题
// 4. 平滑过渡动画
// 5. 导航栏切换按钮

(function(){
'use strict';

var DARK_KEY = 'aitools_dark_mode';

// 暗色模式CSS变量
var darkStyles = `
  :root {
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --bg-tertiary: #252525;
    --text-primary: #e8e8e8;
    --text-secondary: #a0a0a0;
    --text-tertiary: #666;
    --border-color: #333;
    --shadow-color: rgba(0,0,0,0.5);
    --card-bg: #1a1a1a;
    --card-hover: #252525;
  }

  body {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
  }

  /* 通用元素暗色适配 */
  div, section, article, header, footer, nav, main, aside {
    background-color: inherit;
  }

  /* 卡片 */
  .tool-card, .article-card, .feature-card, .metric-card, .stat-card {
    background: var(--card-bg) !important;
    border-color: var(--border-color) !important;
  }
  .tool-card:hover, .article-card:hover {
    background: var(--card-hover) !important;
  }

  /* 表格 */
  table {
    color: var(--text-primary) !important;
  }
  th {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
  }
  td {
    border-color: var(--border-color) !important;
  }
  tr:nth-child(even) {
    background: var(--bg-secondary) !important;
  }

  /* 输入框 */
  input, textarea, select {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
  }
  input::placeholder, textarea::placeholder {
    color: var(--text-tertiary) !important;
  }

  /* 按钮 */
  button {
    color: var(--text-primary);
  }

  /* 链接 */
  a {
    color: #8b9cf9;
  }

  /* 代码块 */
  code, pre {
    background: var(--bg-tertiary) !important;
    color: #e8e8e8 !important;
  }

  /* 弹窗/模态框 */
  #search-overlay > div,
  #onboarding-overlay > div,
  .modal-content,
  .popup-content {
    background: var(--bg-primary) !important;
    border-color: var(--border-color) !important;
  }

  /* 搜索结果 */
  .search-result-item:hover,
  .search-result-item.selected {
    background: var(--bg-secondary) !important;
  }

  /* 滚动条 */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 选中文字 */
  ::selection {
    background: rgba(102,126,234,0.4);
    color: #fff;
  }

  /* 平滑过渡 */
  body, .tool-card, .article-card, table, th, td, input, textarea {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
`;

var darkStyleElement = null;

// 应用暗色模式
function applyDarkMode(enabled){
  if(enabled){
    if(!darkStyleElement){
      darkStyleElement = document.createElement('style');
      darkStyleElement.id = 'dark-mode-styles';
      darkStyleElement.textContent = darkStyles;
      document.head.appendChild(darkStyleElement);
    }
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');
  } else {
    if(darkStyleElement){
      darkStyleElement.remove();
      darkStyleElement = null;
    }
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-mode');
  }

  // 更新切换按钮图标
  updateToggleButton(enabled);
}

// 切换暗色模式
function toggleDarkMode(){
  var current = isDarkMode();
  var next = !current;
  localStorage.setItem(DARK_KEY, next ? 'true' : 'false');
  applyDarkMode(next);

  if(typeof trackEvent === 'function'){
    trackEvent('theme_toggle', { theme: next ? 'dark' : 'light' });
  }
}

// 检查是否暗色模式
function isDarkMode(){
  var stored = localStorage.getItem(DARK_KEY);
  if(stored !== null){
    return stored === 'true';
  }
  // 首次访问跟随系统
  if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    return true;
  }
  return false;
}

// 更新切换按钮
function updateToggleButton(isDark){
  var btn = document.getElementById('dark-mode-toggle');
  if(btn){
    btn.innerHTML = isDark ? '☀️' : '🌙';
    btn.title = isDark ? '切换到亮色模式' : '切换到暗色模式';
  }
}

// 添加切换按钮到导航栏
function addToggleButton(){
  var nav = document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('header');
  if(!nav) return;

  if(document.getElementById('dark-mode-toggle')) return;

  var btn = document.createElement('button');
  btn.id = 'dark-mode-toggle';
  btn.innerHTML = isDarkMode() ? '☀️' : '🌙';
  btn.title = isDarkMode() ? '切换到亮色模式' : '切换到暗色模式';
  btn.style.cssText = 'padding:8px 12px;background:var(--bg-secondary,#f5f5f5);border:1px solid var(--border-color,#ddd);border-radius:50%;cursor:pointer;font-size:1rem;transition:all .2s;width:38px;height:38px;display:flex;align-items:center;justify-content:center;';
  btn.onmouseover = function(){ this.style.transform = 'scale(1.1)'; };
  btn.onmouseout = function(){ this.style.transform = 'scale(1)'; };
  btn.onclick = toggleDarkMode;

  if(nav.querySelector('.nav-right') || nav.querySelector('.nav-actions')){
    var target = nav.querySelector('.nav-right') || nav.querySelector('.nav-actions');
    target.insertBefore(btn, target.firstChild);
  } else {
    nav.appendChild(btn);
  }
}

// 监听系统主题变化
if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
    // 只有用户没有手动设置过时才跟随系统
    if(localStorage.getItem(DARK_KEY) === null){
      applyDarkMode(e.matches);
    }
  });
}

// 初始化
function init(){
  // 立即应用主题（避免闪烁）
  applyDarkMode(isDarkMode());

  // 添加切换按钮
  setTimeout(addToggleButton, 300);

  console.log('%c🌙 暗色模式已加载：当前主题 = ' + (isDarkMode() ? '暗色' : '亮色'), 'color:#a78bfa;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 暴露全局函数
window.toggleDarkMode = toggleDarkMode;
window.isDarkMode = isDarkMode;

})();
