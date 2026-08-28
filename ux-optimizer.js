// ===== 第十二轮：UX优化器 =====
// 1. Hero区域优化（价值主张+双CTA+信任背书+统计数据）
// 2. 首次访问引导浮层（3步onboarding）
// 3. 移动端体验优化提示

(function(){
'use strict';

// ===== 1. Hero区域优化 =====
function optimizeHero(){
  var hero = document.getElementById('hero');
  if(!hero) return;

  // 检查是否已经优化过
  if(hero.querySelector('.hero-optimized')) return;

  // 找到hero内容区域
  var heroContent = hero.querySelector('.hero-content') || hero;

  // 创建优化后的Hero内容
  var optimizedHtml = '<div class="hero-optimized" style="position:relative;z-index:2;text-align:center;padding:60px 20px 40px;max-width:900px;margin:0 auto;">';

  // 标签
  optimizedHtml += '<div style="display:inline-block;padding:6px 16px;background:rgba(102,126,234,0.15);border:1px solid rgba(102,126,234,0.3);border-radius:20px;font-size:.8rem;color:#667eea;margin-bottom:20px;font-weight:500;">';
  optimizedHtml += '🔥 2026年最新AI工具实测数据库';
  optimizedHtml += '</div>';

  // 主标题
  optimizedHtml += '<h1 style="font-size:clamp(1.8rem,5vw,3rem);font-weight:800;margin:0 0 15px;line-height:1.2;background:linear-gradient(135deg,#333 0%,#667eea 50%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">';
  optimizedHtml += '30款AI工具实测对比<br>帮你选对不选贵';
  optimizedHtml += '</h1>';

  // 副标题
  optimizedHtml += '<p style="font-size:clamp(.95rem,2vw,1.15rem);color:var(--text-secondary,#666);margin:0 0 30px;line-height:1.7;max-width:600px;margin-left:auto;margin-right:auto;">';
  optimizedHtml += '每款工具都经过真实测试，数据说话，不吹不黑。<br>覆盖写作、图像、视频、编程、音频、效率6大领域。';
  optimizedHtml += '</p>';

  // 双CTA按钮
  optimizedHtml += '<div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin-bottom:35px;">';
  optimizedHtml += '<button onclick="document.getElementById(\'hotSection\').scrollIntoView({behavior:\'smooth\'})" style="padding:14px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:30px;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all .3s;" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 6px 20px rgba(102,126,234,0.5)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'0 4px 15px rgba(102,126,234,0.4)\'">';
  optimizedHtml += '🚀 开始对比工具';
  optimizedHtml += '</button>';
  optimizedHtml += '<button onclick="navigateTo(\'blog\')" style="padding:14px 32px;background:var(--bg-primary,#fff);color:var(--text-primary,#333);border:2px solid var(--border-color,#ddd);border-radius:30px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .3s;" onmouseover="this.style.borderColor=\'#667eea\';this.style.color=\'#667eea\'" onmouseout="this.style.borderColor=\'var(--border-color,#ddd)\';this.style.color=\'var(--text-primary,#333)\'">';
  optimizedHtml += '📖 查看深度评测';
  optimizedHtml += '</button>';
  optimizedHtml += '</div>';

  // 信任背书 + 统计数据
  optimizedHtml += '<div style="display:flex;gap:30px;justify-content:center;flex-wrap:wrap;padding-top:25px;border-top:1px solid var(--border-color,#eee);">';
  optimizedHtml += '<div style="text-align:center;"><div style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">30+</div><div style="font-size:.8rem;color:var(--text-secondary,#888);margin-top:2px;">款工具实测</div></div>';
  optimizedHtml += '<div style="text-align:center;"><div style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">10</div><div style="font-size:.8rem;color:var(--text-secondary,#888);margin-top:2px;">篇深度评测</div></div>';
  optimizedHtml += '<div style="text-align:center;"><div style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6</div><div style="font-size:.8rem;color:var(--text-secondary,#888);margin-top:2px;">大内容领域</div></div>';
  optimizedHtml += '<div style="text-align:center;"><div style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">100%</div><div style="font-size:.8rem;color:var(--text-secondary,#888);margin-top:2px;">真实测试数据</div></div>';
  optimizedHtml += '</div>';

  optimizedHtml += '</div>';

  // 替换hero内容
  if(hero.querySelector('.hero-content')){
    hero.querySelector('.hero-content').innerHTML = optimizedHtml;
  } else {
    hero.innerHTML = optimizedHtml;
  }

  if(typeof trackEvent === 'function') trackEvent('hero_optimized', {});
}

// ===== 2. 首次访问引导浮层 =====
var OnboardingSteps = [
  {
    title: '欢迎来到AI工具雷达！',
    desc: '这里有30款AI工具的真实测试数据，帮你快速找到最适合的工具。',
    icon: '👋',
    highlight: null
  },
  {
    title: '点击工具查看详细评测',
    desc: '每款工具都有实测数据、优缺点分析、价格对比和使用建议。',
    icon: '🔍',
    highlight: '#toolGrid'
  },
  {
    title: '订阅获取免费PDF榜单',
    desc: '留下邮箱，立即获取《2026年30款最佳AI工具榜单》PDF，以及每周最新AI工具资讯。',
    icon: '📧',
    highlight: null,
    showEmail: true
  }
];

var currentStep = 0;

function showOnboarding(){
  // 检查是否已经看过引导
  if(localStorage.getItem('onboarding_completed') === 'true') return;

  currentStep = 0;
  renderOnboardingStep();
}

function renderOnboardingStep(){
  // 移除旧的引导层
  var old = document.getElementById('onboarding-overlay');
  if(old) old.remove();

  var step = OnboardingSteps[currentStep];

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

  // 创建引导卡片
  var card = document.createElement('div');
  card.style.cssText = 'background:var(--bg-primary,#fff);border-radius:20px;padding:35px 30px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;z-index:99999;animation:onboardingIn .4s ease-out;';

  // 图标
  card.innerHTML = '<div style="font-size:3.5rem;margin-bottom:15px;">' + step.icon + '</div>';

  // 标题
  card.innerHTML += '<h3 style="margin:0 0 10px;font-size:1.3rem;font-weight:700;color:var(--text-primary,#333);">' + step.title + '</h3>';

  // 描述
  card.innerHTML += '<p style="margin:0 0 20px;font-size:.95rem;color:var(--text-secondary,#666);line-height:1.6;">' + step.desc + '</p>';

  // 邮件输入框（最后一步）
  if(step.showEmail){
    card.innerHTML += '<div style="margin-bottom:20px;"><input type="email" id="onboarding-email" placeholder="输入你的邮箱" style="width:100%;padding:12px 16px;border:2px solid var(--border-color,#ddd);border-radius:10px;font-size:.95rem;box-sizing:border-box;outline:none;transition:border-color .2s;" onfocus="this.style.borderColor=\'#667eea\'" onblur="this.style.borderColor=\'var(--border-color,#ddd)\'"></div>';
  }

  // 进度指示器
  card.innerHTML += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;">';
  for(var i = 0; i < OnboardingSteps.length; i++){
    card.innerHTML += '<div style="width:' + (i === currentStep ? '24px' : '8px') + ';height:8px;border-radius:4px;background:' + (i <= currentStep ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'var(--border-color,#ddd)') + ';transition:all .3s;"></div>';
  }
  card.innerHTML += '</div>';

  // 按钮
  card.innerHTML += '<div style="display:flex;gap:10px;justify-content:center;">';

  if(currentStep > 0){
    card.innerHTML += '<button onclick="window.prevOnboardingStep()" style="padding:10px 24px;background:var(--bg-secondary,#f5f5f5);color:var(--text-secondary,#666);border:none;border-radius:25px;font-size:.9rem;cursor:pointer;font-weight:500;">上一步</button>';
  }

  if(currentStep < OnboardingSteps.length - 1){
    card.innerHTML += '<button onclick="window.nextOnboardingStep()" style="padding:10px 28px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:25px;font-size:.9rem;cursor:pointer;font-weight:600;box-shadow:0 4px 12px rgba(102,126,234,0.3);">下一步 →</button>';
  } else {
    card.innerHTML += '<button onclick="window.completeOnboarding()" style="padding:10px 28px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:25px;font-size:.9rem;cursor:pointer;font-weight:600;box-shadow:0 4px 12px rgba(102,126,234,0.3);">🎉 开始探索</button>';
  }

  card.innerHTML += '</div>';

  // 跳过按钮
  card.innerHTML += '<button onclick="window.skipOnboarding()" style="position:absolute;top:12px;right:15px;background:none;border:none;font-size:1.2rem;color:var(--text-secondary,#999);cursor:pointer;padding:5px;" title="跳过引导">✕</button>';

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // 添加动画样式
  if(!document.getElementById('onboarding-style')){
    var style = document.createElement('style');
    style.id = 'onboarding-style';
    style.textContent = '@keyframes onboardingIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}';
    document.head.appendChild(style);
  }

  // 高亮目标元素
  if(step.highlight){
    var target = document.querySelector(step.highlight);
    if(target){
      target.style.scrollIntoView && target.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(function(){
        target.style.outline = '3px solid #667eea';
        target.style.outlineOffset = '5px';
        target.style.borderRadius = '12px';
      }, 500);
    }
  }
}

function nextOnboardingStep(){
  if(currentStep < OnboardingSteps.length - 1){
    currentStep++;
    renderOnboardingStep();
  }
}

function prevOnboardingStep(){
  if(currentStep > 0){
    // 清除上一步的高亮
    var prevStep = OnboardingSteps[currentStep];
    if(prevStep.highlight){
      var target = document.querySelector(prevStep.highlight);
      if(target){ target.style.outline = ''; target.style.outlineOffset = ''; }
    }
    currentStep--;
    renderOnboardingStep();
  }
}

function completeOnboarding(){
  // 如果有邮箱，保存
  var emailInput = document.getElementById('onboarding-email');
  if(emailInput && emailInput.value){
    if(typeof saveSubscriber === 'function'){
      saveSubscriber(emailInput.value);
    }
    if(typeof trackEvent === 'function') trackEvent('onboarding_email_submit', { source: 'onboarding' });
  }

  finishOnboarding();
}

function skipOnboarding(){
  finishOnboarding();
  if(typeof trackEvent === 'function') trackEvent('onboarding_skip', { step: currentStep });
}

function finishOnboarding(){
  var overlay = document.getElementById('onboarding-overlay');
  if(overlay) overlay.remove();

  // 清除所有高亮
  document.querySelectorAll('[style*="outline"]').forEach(function(el){
    el.style.outline = '';
    el.style.outlineOffset = '';
  });

  localStorage.setItem('onboarding_completed', 'true');
  if(typeof trackEvent === 'function') trackEvent('onboarding_complete', { steps: currentStep + 1 });
}

// 暴露全局函数
window.nextOnboardingStep = nextOnboardingStep;
window.prevOnboardingStep = prevOnboardingStep;
window.completeOnboarding = completeOnboarding;
window.skipOnboarding = skipOnboarding;
window.showOnboarding = showOnboarding;

// ===== 3. 移动端优化提示 =====
function mobileOptimization(){
  // 检测移动端
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  if(isMobile){
    // 确保表格可横向滚动
    var style = document.createElement('style');
    style.textContent = 'table{max-width:100%;display:block;overflow-x:auto;} .tool-card{padding:12px;} .hero-optimized{padding:40px 15px 30px;}';
    document.head.appendChild(style);
  }
}

// ===== 初始化 =====
function init(){
  // Hero优化（延迟执行，确保DOM加载完成）
  setTimeout(optimizeHero, 300);

  // 首次访问引导（延迟2秒，让用户先看到页面）
  setTimeout(function(){
    if(!localStorage.getItem('onboarding_completed')){
      showOnboarding();
    }
  }, 2000);

  // 移动端优化
  mobileOptimization();
}

// DOM加载完成后初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('%c🎨 UX优化器已加载：Hero区域优化 + 首次访问引导 + 移动端优化', 'color:#667eea;font-size:12px;font-weight:bold');

})();
