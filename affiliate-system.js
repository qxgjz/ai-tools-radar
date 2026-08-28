// ===== 第十二轮：联盟营销系统 =====
// 1. 可配置的联盟链接映射表
// 2. 自动替换工具详情页"访问官网"链接
// 3. 联盟链接点击追踪
// 4. 联盟收入预估仪表盘
// 5. 支持未来添加真实联盟链接

(function(){
'use strict';

// ===== 联盟链接配置表 =====
// 目前使用官方链接作为占位符，未来替换为真实联盟链接
// 佣金率基于各平台公开的联盟计划信息
var AffiliateConfig = {
  // AI写作工具
  'chatgpt': {
    name: 'ChatGPT',
    affiliateUrl: 'https://chat.openai.com',
    officialUrl: 'https://chat.openai.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder' // placeholder | active
  },
  'claude': {
    name: 'Claude',
    affiliateUrl: 'https://claude.ai',
    officialUrl: 'https://claude.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'jasper': {
    name: 'Jasper AI',
    affiliateUrl: 'https://www.jasper.ai',
    officialUrl: 'https://www.jasper.ai',
    commission: '30%  recurring commission',
    commissionRate: 0.30,
    network: 'PartnerStack',
    status: 'placeholder',
    signupUrl: 'https://partners.jasper.ai/'
  },
  'copy-ai': {
    name: 'Copy.ai',
    affiliateUrl: 'https://www.copy.ai',
    officialUrl: 'https://www.copy.ai',
    commission: '30% recurring commission',
    commissionRate: 0.30,
    network: 'PartnerStack',
    status: 'placeholder',
    signupUrl: 'https://partners.copy.ai/'
  },
  'writesonic': {
    name: 'Writesonic',
    affiliateUrl: 'https://writesonic.com',
    officialUrl: 'https://writesonic.com',
    commission: '30% recurring commission',
    commissionRate: 0.30,
    network: 'PartnerStack',
    status: 'placeholder',
    signupUrl: 'https://writesonic.com/affiliates'
  },
  'notion-ai': {
    name: 'Notion AI',
    affiliateUrl: 'https://www.notion.so',
    officialUrl: 'https://www.notion.so',
    commission: '50% first year commission',
    commissionRate: 0.50,
    network: 'Notion Affiliate',
    status: 'placeholder',
    signupUrl: 'https://www.notion.so/affiliates'
  },
  'grammarly': {
    name: 'Grammarly',
    affiliateUrl: 'https://www.grammarly.com',
    officialUrl: 'https://www.grammarly.com',
    commission: '$0.20 per free signup + $20 per premium',
    commissionRate: 0.20,
    network: 'Impact',
    status: 'placeholder',
    signupUrl: 'https://www.grammarly.com/affiliates'
  },
  'sudowrite': {
    name: 'Sudowrite',
    affiliateUrl: 'https://www.sudowrite.com',
    officialUrl: 'https://www.sudowrite.com',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },
  'anyword': {
    name: 'Anyword',
    affiliateUrl: 'https://anyword.com',
    officialUrl: 'https://anyword.com',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },
  'scalenut': {
    name: 'Scalenut',
    affiliateUrl: 'https://www.scalenut.com',
    officialUrl: 'https://www.scalenut.com',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },
  'rytr': {
    name: 'Rytr',
    affiliateUrl: 'https://rytr.me',
    officialUrl: 'https://rytr.me',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },

  // AI图像工具
  'midjourney': {
    name: 'Midjourney',
    affiliateUrl: 'https://www.midjourney.com',
    officialUrl: 'https://www.midjourney.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'dall-e-3': {
    name: 'DALL-E 3',
    affiliateUrl: 'https://openai.com/dall-e-3',
    officialUrl: 'https://openai.com/dall-e-3',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'stable-diffusion': {
    name: 'Stable Diffusion',
    affiliateUrl: 'https://stability.ai',
    officialUrl: 'https://stability.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'leonardo-ai': {
    name: 'Leonardo AI',
    affiliateUrl: 'https://leonardo.ai',
    officialUrl: 'https://leonardo.ai',
    commission: '20% recurring',
    commissionRate: 0.20,
    network: '直接',
    status: 'placeholder'
  },
  'adobe-firefly': {
    name: 'Adobe Firefly',
    affiliateUrl: 'https://www.adobe.com/products/firefly.html',
    officialUrl: 'https://www.adobe.com/products/firefly.html',
    commission: '85% first month (Creative Cloud)',
    commissionRate: 0.85,
    network: 'Impact',
    status: 'placeholder',
    signupUrl: 'https://partners.adobe.com/'
  },
  'ideogram': {
    name: 'Ideogram',
    affiliateUrl: 'https://ideogram.ai',
    officialUrl: 'https://ideogram.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'recraft': {
    name: 'Recraft',
    affiliateUrl: 'https://www.recraft.ai',
    officialUrl: 'https://www.recraft.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'canva-magic': {
    name: 'Canva Magic Studio',
    affiliateUrl: 'https://www.canva.com',
    officialUrl: 'https://www.canva.com',
    commission: '$25 per Pro signup',
    commissionRate: 0.10,
    network: 'Impact',
    status: 'placeholder',
    signupUrl: 'https://www.canva.com/affiliates/'
  },
  'krea': {
    name: 'Krea AI',
    affiliateUrl: 'https://www.krea.ai',
    officialUrl: 'https://www.krea.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'getimg-ai': {
    name: 'Getimg AI',
    affiliateUrl: 'https://getimg.ai',
    officialUrl: 'https://getimg.ai',
    commission: '20% recurring',
    commissionRate: 0.20,
    network: '直接',
    status: 'placeholder'
  },

  // AI编程工具
  'github-copilot': {
    name: 'GitHub Copilot',
    affiliateUrl: 'https://github.com/features/copilot',
    officialUrl: 'https://github.com/features/copilot',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'cursor': {
    name: 'Cursor',
    affiliateUrl: 'https://cursor.sh',
    officialUrl: 'https://cursor.sh',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'claude-code': {
    name: 'Claude Code',
    affiliateUrl: 'https://claude.ai',
    officialUrl: 'https://claude.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'windsurf': {
    name: 'Windsurf',
    affiliateUrl: 'https://windsurf.com',
    officialUrl: 'https://windsurf.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },

  // AI视频工具
  'runway': {
    name: 'Runway',
    affiliateUrl: 'https://runwayml.com',
    officialUrl: 'https://runwayml.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'pika': {
    name: 'Pika',
    affiliateUrl: 'https://pika.art',
    officialUrl: 'https://pika.art',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'sora': {
    name: 'Sora',
    affiliateUrl: 'https://openai.com/sora',
    officialUrl: 'https://openai.com/sora',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'heygen': {
    name: 'HeyGen',
    affiliateUrl: 'https://www.heygen.com',
    officialUrl: 'https://www.heygen.com',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },
  'capcut': {
    name: 'CapCut',
    affiliateUrl: 'https://www.capcut.com',
    officialUrl: 'https://www.capcut.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },

  // AI音频工具
  'suno': {
    name: 'Suno',
    affiliateUrl: 'https://suno.com',
    officialUrl: 'https://suno.com',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'elevenlabs': {
    name: 'ElevenLabs',
    affiliateUrl: 'https://elevenlabs.io',
    officialUrl: 'https://elevenlabs.io',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },

  // AI效率工具
  'mem': {
    name: 'Mem',
    affiliateUrl: 'https://get.mem.ai',
    officialUrl: 'https://get.mem.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'taskade': {
    name: 'Taskade',
    affiliateUrl: 'https://www.taskade.com',
    officialUrl: 'https://www.taskade.com',
    commission: '30% recurring',
    commissionRate: 0.30,
    network: '直接',
    status: 'placeholder'
  },
  'fathom': {
    name: 'Fathom',
    affiliateUrl: 'https://fathom.video',
    officialUrl: 'https://fathom.video',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'superhuman': {
    name: 'Superhuman',
    affiliateUrl: 'https://superhuman.com',
    officialUrl: 'https://superhuman.com',
    commission: '$10 per referral',
    commissionRate: 0.05,
    network: '直接',
    status: 'placeholder'
  },
  'otter-ai': {
    name: 'Otter.ai',
    affiliateUrl: 'https://otter.ai',
    officialUrl: 'https://otter.ai',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  },
  'zapier': {
    name: 'Zapier',
    affiliateUrl: 'https://zapier.com',
    officialUrl: 'https://zapier.com',
    commission: '20% recurring',
    commissionRate: 0.20,
    network: 'Zapier Partner',
    status: 'placeholder',
    signupUrl: 'https://zapier.com/platform/partner-program'
  },
  'obsidian': {
    name: 'Obsidian',
    affiliateUrl: 'https://obsidian.md',
    officialUrl: 'https://obsidian.md',
    commission: '暂无公开联盟计划',
    commissionRate: 0,
    network: '直接',
    status: 'placeholder'
  }
};

// ===== 获取联盟链接 =====
function getAffiliateLink(toolId){
  var config = AffiliateConfig[toolId];
  if(!config) return null;
  return {
    url: config.status === 'active' ? config.affiliateUrl : config.officialUrl,
    isAffiliate: config.status === 'active',
    commission: config.commission,
    name: config.name
  };
}

// ===== 追踪联盟点击 =====
function trackAffiliateClick(toolId){
  var config = AffiliateConfig[toolId];
  if(!config) return;

  // 记录点击
  var clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '{}');
  clicks[toolId] = (clicks[toolId] || 0) + 1;
  clicks._total = (clicks._total || 0) + 1;
  clicks._lastClick = new Date().toISOString();
  localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));

  // 事件追踪
  if(typeof trackEvent === 'function'){
    trackEvent('affiliate_click', {
      tool: toolId,
      toolName: config.name,
      isAffiliate: config.status === 'active',
      commission: config.commission
    });
  }
}

// ===== 替换工具详情页的访问官网按钮 =====
function enhanceToolDetailButtons(){
  // 监听工具详情页渲染
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      if(mutation.addedNodes){
        mutation.addedNodes.forEach(function(node){
          if(node.nodeType === 1 && node.id === 'detailView'){
            setTimeout(replaceVisitButtons, 300);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始检查
  setTimeout(replaceVisitButtons, 1000);
}

function replaceVisitButtons(){
  var detailView = document.getElementById('detailView');
  if(!detailView || detailView.style.display === 'none') return;

  // 找到所有"访问官网"类按钮
  var buttons = detailView.querySelectorAll('a[href*="http"], button');
  buttons.forEach(function(btn){
    var text = btn.textContent || '';
    if(text.includes('访问') || text.includes('官网') || text.includes('Visit') || text.includes('Website')){
      // 从URL或上下文推断工具ID
      var toolId = inferToolIdFromContext(btn);
      if(toolId && AffiliateConfig[toolId]){
        var config = AffiliateConfig[toolId];

        // 更新链接
        if(btn.tagName === 'A'){
          btn.href = config.status === 'active' ? config.affiliateUrl : config.officialUrl;
        }
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer sponsored';

        // 添加点击追踪
        btn.addEventListener('click', function(){
          trackAffiliateClick(toolId);
        });

        // 添加联盟标识（如果是活跃联盟链接）
        if(config.status === 'active' && !btn.querySelector('.affiliate-badge')){
          var badge = document.createElement('span');
          badge.className = 'affiliate-badge';
          badge.style.cssText = 'font-size:.65rem;background:#10b981;color:#fff;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;';
          badge.textContent = '联盟';
          btn.appendChild(badge);
        }
      }
    }
  });
}

function inferToolIdFromContext(element){
  // 从detailContent中查找工具名称
  var detailContent = document.getElementById('detailContent');
  if(!detailContent) return null;

  var title = detailContent.querySelector('h1, h2, .tool-name');
  if(title){
    var name = title.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    // 尝试匹配
    for(var key in AffiliateConfig){
      if(name.includes(key) || key.includes(name)){
        return key;
      }
    }
  }
  return null;
}

// ===== 联盟收入预估仪表盘 =====
function showAffiliateDashboard(){
  var clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '{}');
  var totalClicks = clicks._total || 0;

  // 计算预估收入（假设5%转化率，平均$30/订阅，平均25%佣金）
  var estimatedConversions = Math.round(totalClicks * 0.05);
  var estimatedRevenue = (estimatedConversions * 30 * 0.25).toFixed(2);

  var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
  html += '<div style="margin:20px 0;">';
  html += '<h1 style="margin-bottom:5px;">💰 联盟营销仪表盘</h1>';
  html += '<p style="color:var(--text-secondary);margin-bottom:25px;">追踪联盟链接点击和预估收入</p>';

  // 统计卡片
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:15px;margin-bottom:30px;">';
  html += '<div style="padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;color:#fff;"><div style="font-size:.8rem;opacity:.8;margin-bottom:5px;">总点击量</div><div style="font-size:2rem;font-weight:800;">' + totalClicks + '</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;"><div style="font-size:.8rem;color:var(--text-secondary);margin-bottom:5px;">预估转化</div><div style="font-size:2rem;font-weight:800;color:#10b981;">' + estimatedConversions + '</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;"><div style="font-size:.8rem;color:var(--text-secondary);margin-bottom:5px;">预估月收入</div><div style="font-size:2rem;font-weight:800;color:#f59e0b;">$' + estimatedRevenue + '</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;"><div style="font-size:.8rem;color:var(--text-secondary);margin-bottom:5px;">活跃联盟链接</div><div style="font-size:2rem;font-weight:800;color:#667eea;">' + Object.values(AffiliateConfig).filter(function(c){return c.status==='active';}).length + '/' + Object.keys(AffiliateConfig).length + '</div></div>';
  html += '</div>';

  // 各工具点击排行
  html += '<h2 style="margin-bottom:15px;font-size:1.2rem;">📊 工具点击排行</h2>';
  var toolClicks = [];
  for(var key in clicks){
    if(key !== '_total' && key !== '_lastClick'){
      toolClicks.push({ id: key, clicks: clicks[key], config: AffiliateConfig[key] });
    }
  }
  toolClicks.sort(function(a,b){ return b.clicks - a.clicks; });

  if(toolClicks.length === 0){
    html += '<div style="padding:30px;text-align:center;color:var(--text-secondary);background:var(--bg-secondary);border-radius:12px;">暂无点击数据，点击工具详情页的"访问官网"按钮开始追踪</div>';
  } else {
    html += '<div style="display:grid;gap:8px;">';
    toolClicks.slice(0, 15).forEach(function(item, index){
      var config = item.config || { name: item.id, commission: '未知' };
      html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg-secondary);border-radius:10px;">';
      html += '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;">' + (index + 1) + '</div>';
      html += '<div style="flex:1;font-weight:600;font-size:.9rem;">' + config.name + '</div>';
      html += '<div style="font-size:.8rem;color:var(--text-secondary);">' + config.commission + '</div>';
      html += '<div style="font-weight:700;color:#667eea;font-size:.95rem;">' + item.clicks + ' 点击</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // 联盟平台注册指南
  html += '<h2 style="margin:30px 0 15px;font-size:1.2rem;">🔗 高佣金联盟平台注册指南</h2>';
  html += '<div style="display:grid;gap:10px;">';
  var highCommission = Object.values(AffiliateConfig).filter(function(c){ return c.signupUrl; });
  highCommission.forEach(function(config){
    html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--bg-secondary);border-radius:10px;border-left:3px solid #10b981;">';
    html += '<div style="flex:1;"><div style="font-weight:600;font-size:.9rem;">' + config.name + '</div><div style="font-size:.8rem;color:var(--text-secondary);margin-top:2px;">' + config.commission + ' | ' + config.network + '</div></div>';
    html += '<a href="' + config.signupUrl + '" target="_blank" rel="noopener" style="padding:8px 16px;background:#10b981;color:#fff;border-radius:20px;text-decoration:none;font-size:.8rem;font-weight:600;">注册联盟</a>';
    html += '</div>';
  });
  html += '</div>';

  html += '</div></div>';

  // 显示
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','metricsView','roadmapView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });

  var container = document.getElementById('affiliateDashboardView');
  if(!container){
    container = document.createElement('div');
    container.id = 'affiliateDashboardView';
    document.body.appendChild(container);
  }
  container.innerHTML = html;
  container.style.display = 'block';
  window.scrollTo(0,0);

  if(typeof trackEvent === 'function') trackEvent('view_affiliate_dashboard', {});
}

// ===== 暴露全局函数 =====
window.getAffiliateLink = getAffiliateLink;
window.trackAffiliateClick = trackAffiliateClick;
window.showAffiliateDashboard = showAffiliateDashboard;
window.AffiliateConfig = AffiliateConfig;

// ===== 初始化 =====
function init(){
  enhanceToolDetailButtons();
  console.log('%c💰 联盟营销系统已加载：' + Object.keys(AffiliateConfig).length + '个工具配置 | ' + Object.values(AffiliateConfig).filter(function(c){return c.status==='active';}).length + '个活跃联盟链接', 'color:#10b981;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
