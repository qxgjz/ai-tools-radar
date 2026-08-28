// ===== 第十五轮：更新日志 + 迭代路线图 + 用户反馈 =====
// 1. 更新日志页面渲染
// 2. 迭代路线图展示
// 3. 用户反馈收集系统（建议/Bug报告）
// 4. 数据仪表盘（A/B测试结果+行为统计）

(function(){
'use strict';

// ===== 迭代路线图数据 =====
var RoadmapData = {
  completed: [
    { title: '基础工具导航', date: '2026-08-20', icon: '✅' },
    { title: '工具详情页+对比功能', date: '2026-08-22', icon: '✅' },
    { title: '12篇深度评测文章', date: '2026-08-28', icon: '✅' },
    { title: '30款工具实测数据库', date: '2026-08-28', icon: '✅' },
    { title: 'SEO优化（6种结构化数据）', date: '2026-08-25', icon: '✅' },
    { title: '增长功能（退出弹窗+邮件订阅）', date: '2026-08-27', icon: '✅' },
    { title: '联盟营销系统', date: '2026-08-27', icon: '✅' },
    { title: '全局搜索（Ctrl+K）', date: '2026-08-28', icon: '✅' },
    { title: '暗色模式', date: '2026-08-28', icon: '✅' },
    { title: 'PWA支持（可安装+离线）', date: '2026-08-28', icon: '✅' },
    { title: 'RSS订阅', date: '2026-08-28', icon: '✅' },
    { title: '迭代更新系统', date: '2026-08-29', icon: '✅' }
  ],
  inProgress: [
    { title: '社交媒体冷启动获客', progress: 30, icon: '🚀' },
    { title: '联盟平台接入（Impact/PartnerStack）', progress: 20, icon: '💰' },
    { title: 'GA4+Search Console配置', progress: 10, icon: '📊' }
  ],
  planned: [
    { title: '用户评论系统（Giscus）', priority: 'high', icon: '💬' },
    { title: '工具提交审核流程', priority: 'high', icon: '➕' },
    { title: '多语言支持（中英文切换）', priority: 'medium', icon: '🌐' },
    { title: '高级筛选（按价格/评分/功能）', priority: 'medium', icon: '🔍' },
    { title: '每周AI工具资讯邮件', priority: 'medium', icon: '📧' },
    { title: '付费会员（高级筛选+无广告）', priority: 'low', icon: '⭐' },
    { title: '移动端App（PWA升级）', priority: 'low', icon: '📱' },
    { title: 'API接口开放', priority: 'low', icon: '🔌' }
  ]
};

// ===== 渲染更新日志页面 =====
function renderChangelogPage(){
  var history = window.VersionManager ? window.VersionManager.getVersionHistory() : [];

  var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
  html += '<div style="margin:20px 0;">';

  // 页面标题
  html += '<div style="text-align:center;margin-bottom:40px;">';
  html += '<div style="font-size:3rem;margin-bottom:10px;">📝</div>';
  html += '<h1 style="margin:0 0 10px;font-size:2rem;">更新日志</h1>';
  html += '<p style="color:var(--text-secondary);margin:0;">记录网站的每一次迭代和改进</p>';
  html += '</div>';

  // 统计卡片
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:40px;">';
  html += '<div style="padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;color:#fff;text-align:center;"><div style="font-size:2rem;font-weight:800;">' + history.length + '</div><div style="font-size:.85rem;opacity:.9;">版本更新</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;text-align:center;"><div style="font-size:2rem;font-weight:800;color:#10b981;">' + RoadmapData.completed.length + '</div><div style="font-size:.85rem;color:var(--text-secondary);">已完成功能</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;text-align:center;"><div style="font-size:2rem;font-weight:800;color:#f59e0b;">' + RoadmapData.inProgress.length + '</div><div style="font-size:.85rem;color:var(--text-secondary);">进行中</div></div>';
  html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;text-align:center;"><div style="font-size:2rem;font-weight:800;color:#667eea;">' + RoadmapData.planned.length + '</div><div style="font-size:.85rem;color:var(--text-secondary);">计划中</div></div>';
  html += '</div>';

  // 版本时间线
  html += '<h2 style="margin-bottom:20px;font-size:1.3rem;">📜 版本历史</h2>';
  html += '<div style="position:relative;padding-left:30px;">';
  html += '<div style="position:absolute;left:8px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,#667eea,#764ba2);"></div>';

  history.slice().reverse().forEach(function(version, index){
    var typeColors = { major: '#ef4444', minor: '#667eea', patch: '#10b981', release: '#f59e0b' };
    var typeColor = typeColors[version.type] || '#667eea';
    var typeLabels = { major: '重大更新', minor: '功能更新', patch: '修复更新', release: '首次发布' };

    html += '<div style="position:relative;margin-bottom:30px;">';
    html += '<div style="position:absolute;left:-30px;top:5px;width:18px;height:18px;border-radius:50%;background:' + typeColor + ';border:3px solid var(--bg-primary);box-shadow:0 0 0 2px ' + typeColor + ';"></div>';
    html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;border-left:4px solid ' + typeColor + ';">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap;">';
    html += '<span style="font-weight:700;font-size:1.1rem;">v' + version.version + '</span>';
    html += '<span style="padding:3px 10px;background:' + typeColor + ';color:#fff;border-radius:10px;font-size:.7rem;font-weight:600;">' + (typeLabels[version.type] || version.type) + '</span>';
    html += '<span style="font-size:.8rem;color:var(--text-secondary);">' + version.date + '</span>';
    html += '</div>';
    html += '<div style="font-weight:600;margin-bottom:8px;color:var(--text-primary);">' + version.title + '</div>';
    html += '<ul style="margin:0;padding-left:20px;">';
    version.changes.forEach(function(change){
      html += '<li style="font-size:.9rem;color:var(--text-secondary);margin-bottom:4px;line-height:1.5;">' + change + '</li>';
    });
    html += '</ul>';
    html += '</div></div>';
  });

  html += '</div>';

  // 迭代路线图
  html += '<h2 style="margin:40px 0 20px;font-size:1.3rem;">🗺️ 迭代路线图</h2>';

  // 进行中
  html += '<h3 style="margin-bottom:15px;font-size:1.1rem;color:#f59e0b;">🚧 进行中</h3>';
  html += '<div style="display:grid;gap:10px;margin-bottom:25px;">';
  RoadmapData.inProgress.forEach(function(item){
    html += '<div style="padding:15px 20px;background:var(--bg-secondary);border-radius:10px;border-left:3px solid #f59e0b;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '<span style="font-weight:600;font-size:.95rem;">' + item.icon + ' ' + item.title + '</span>';
    html += '<span style="font-size:.8rem;color:#f59e0b;font-weight:600;">' + item.progress + '%</span>';
    html += '</div>';
    html += '<div style="height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + item.progress + '%;background:linear-gradient(90deg,#f59e0b,#f97316);border-radius:3px;transition:width .5s;"></div></div>';
    html += '</div>';
  });
  html += '</div>';

  // 计划中
  html += '<h3 style="margin-bottom:15px;font-size:1.1rem;color:#667eea;">📋 计划中</h3>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:25px;">';
  RoadmapData.planned.forEach(function(item){
    var priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
    var priorityLabels = { high: '高优先级', medium: '中优先级', low: '低优先级' };
    html += '<div style="padding:14px 16px;background:var(--bg-secondary);border-radius:10px;display:flex;align-items:center;gap:10px;">';
    html += '<span style="font-size:1.2rem;">' + item.icon + '</span>';
    html += '<div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.title + '</div>';
    html += '<div style="font-size:.7rem;color:' + (priorityColors[item.priority] || '#667eea') + ';font-weight:600;margin-top:2px;">' + (priorityLabels[item.priority] || item.priority) + '</div></div>';
    html += '</div>';
  });
  html += '</div>';

  // 已完成
  html += '<h3 style="margin-bottom:15px;font-size:1.1rem;color:#10b981;">✅ 已完成 (' + RoadmapData.completed.length + ')</h3>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
  RoadmapData.completed.forEach(function(item){
    html += '<span style="padding:6px 12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:20px;font-size:.8rem;color:#10b981;">' + item.icon + ' ' + item.title + '</span>';
  });
  html += '</div>';

  html += '</div></div>';
  return html;
}

// ===== 显示更新日志页面 =====
function showChangelog(){
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','metricsView','roadmapView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });

  var container = document.getElementById('changelogView');
  if(!container){
    container = document.createElement('div');
    container.id = 'changelogView';
    document.body.appendChild(container);
  }
  container.innerHTML = renderChangelogPage();
  container.style.display = 'block';
  window.scrollTo(0,0);

  if(typeof trackEvent === 'function') trackEvent('view_changelog', {});
}

// ===== 用户反馈收集系统 =====
function showFeedbackModal(feedbackType){
  var type = feedbackType || 'suggestion';
  var typeConfig = {
    suggestion: { title: '💡 提交建议', icon: '💡', placeholder: '描述你的建议或想法...' },
    bug: { title: '🐛 报告Bug', icon: '🐛', placeholder: '描述你遇到的问题，包括复现步骤...' },
    feature: { title: '✨ 功能请求', icon: '✨', placeholder: '描述你希望添加的功能...' }
  };
  var config = typeConfig[type] || typeConfig.suggestion;

  var modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';

  modal.innerHTML = '<div style="background:var(--bg-primary);border-radius:16px;padding:30px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:feedbackIn .3s ease-out;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
      '<h3 style="margin:0;font-size:1.3rem;">' + config.title + '</h3>' +
      '<button onclick="document.getElementById(\'feedback-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary);">×</button>' +
    '</div>' +
    '<form id="feedback-form" onsubmit="submitFeedback(event,\'' + type + '\')">' +
      '<div style="margin-bottom:15px;"><label style="display:block;font-weight:600;margin-bottom:6px;font-size:.9rem;">类型</label>' +
        '<select id="feedback-type" onchange="switchFeedbackType(this.value)" style="width:100%;padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:.9rem;">' +
          '<option value="suggestion"' + (type==='suggestion'?' selected':'') + '>💡 功能建议</option>' +
          '<option value="bug"' + (type==='bug'?' selected':'') + '>🐛 Bug报告</option>' +
          '<option value="feature"' + (type==='feature'?' selected':'') + '>✨ 功能请求</option>' +
        '</select></div>' +
      '<div style="margin-bottom:15px;"><label style="display:block;font-weight:600;margin-bottom:6px;font-size:.9rem;">标题</label>' +
        '<input type="text" id="feedback-title" required placeholder="简短描述" style="width:100%;padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:.9rem;"></div>' +
      '<div style="margin-bottom:15px;"><label style="display:block;font-weight:600;margin-bottom:6px;font-size:.9rem;">详细描述</label>' +
        '<textarea id="feedback-desc" rows="4" required placeholder="' + config.placeholder + '" style="width:100%;padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:.9rem;resize:vertical;"></textarea></div>' +
      '<div style="margin-bottom:20px;"><label style="display:block;font-weight:600;margin-bottom:6px;font-size:.9rem;">邮箱（可选，用于回复）</label>' +
        '<input type="email" id="feedback-email" placeholder="your@email.com" style="width:100%;padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:.9rem;"></div>' +
      '<div style="display:flex;gap:10px;">' +
        '<button type="button" onclick="document.getElementById(\'feedback-modal\').remove()" style="flex:1;padding:12px;background:var(--bg-secondary);color:var(--text-secondary);border:none;border-radius:8px;font-size:.95rem;cursor:pointer;font-weight:600;">取消</button>' +
        '<button type="submit" style="flex:2;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:.95rem;cursor:pointer;font-weight:600;box-shadow:0 4px 12px rgba(102,126,234,0.3);">提交反馈</button>' +
      '</div>' +
    '</form>' +
  '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target === modal) modal.remove(); });

  // 添加动画样式
  if(!document.getElementById('feedback-style')){
    var style = document.createElement('style');
    style.id = 'feedback-style';
    style.textContent = '@keyframes feedbackIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}';
    document.head.appendChild(style);
  }
}

function submitFeedback(event, type){
  event.preventDefault();
  var title = document.getElementById('feedback-title').value;
  var desc = document.getElementById('feedback-desc').value;
  var email = document.getElementById('feedback-email').value;

  var feedback = {
    type: type,
    title: title,
    description: desc,
    email: email,
    timestamp: new Date().toISOString(),
    version: window.VersionManager ? window.VersionManager.getCurrentVersion() : 'unknown',
    userAgent: navigator.userAgent,
    screenSize: window.innerWidth + 'x' + window.innerHeight
  };

  // 保存到localStorage
  var feedbacks = JSON.parse(localStorage.getItem('aitools_feedbacks') || '[]');
  feedbacks.push(feedback);
  localStorage.setItem('aitools_feedbacks', JSON.stringify(feedbacks));

  if(typeof trackEvent === 'function'){
    trackEvent('feedback_submit', { type: type, title: title });
  }

  // 显示成功提示
  var modal = document.getElementById('feedback-modal');
  if(modal){
    modal.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
      '<div style="font-size:4rem;margin-bottom:20px;">🎉</div>' +
      '<h3 style="margin:0 0 10px;font-size:1.3rem;">感谢你的反馈！</h3>' +
      '<p style="color:var(--text-secondary);margin-bottom:25px;">我们会认真考虑每一条建议，持续改进网站。</p>' +
      '<button onclick="document.getElementById(\'feedback-modal\').remove()" style="padding:12px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">关闭</button>' +
    '</div>';
  }
}

function switchFeedbackType(type){
  var modal = document.getElementById('feedback-modal');
  if(modal){
    modal.remove();
    showFeedbackModal(type);
  }
}

// ===== 数据仪表盘 =====
function showDataDashboard(){
  var stats = window.BehaviorTracker ? window.BehaviorTracker.getSessionStats() : {};
  var abResults = window.ABTestFramework ? window.ABTestFramework.getAllResults() : [];
  var topTools = window.BehaviorTracker ? window.BehaviorTracker.getTopTools(10) : [];

  var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
  html += '<div style="margin:20px 0;">';
  html += '<h1 style="margin-bottom:5px;">📊 数据仪表盘</h1>';
  html += '<p style="color:var(--text-secondary);margin-bottom:25px;">本地收集的行为数据和A/B测试结果</p>';

  // 会话统计
  html += '<h2 style="margin-bottom:15px;font-size:1.2rem;">📈 会话统计</h2>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:30px;">';
  var statItems = [
    { label: '会话时长', value: Math.floor(stats.sessionDuration / 60) + '分' + (stats.sessionDuration % 60) + '秒', icon: '⏱️' },
    { label: '页面浏览', value: stats.pageViews || 0, icon: '👁️' },
    { label: '工具点击', value: stats.toolClicks || 0, icon: '🛠️' },
    { label: '文章阅读', value: stats.articleViews || 0, icon: '📖' },
    { label: '搜索次数', value: stats.searches || 0, icon: '🔍' },
    { label: '事件总数', value: stats.totalEvents || 0, icon: '📊' }
  ];
  statItems.forEach(function(item){
    html += '<div style="padding:18px;background:var(--bg-secondary);border-radius:12px;text-align:center;"><div style="font-size:1.5rem;margin-bottom:5px;">' + item.icon + '</div><div style="font-size:1.3rem;font-weight:800;color:var(--text-primary);">' + item.value + '</div><div style="font-size:.75rem;color:var(--text-secondary);margin-top:3px;">' + item.label + '</div></div>';
  });
  html += '</div>';

  // A/B测试结果
  html += '<h2 style="margin-bottom:15px;font-size:1.2rem;">🧪 A/B测试结果</h2>';
  if(abResults.length === 0){
    html += '<div style="padding:25px;text-align:center;color:var(--text-secondary);background:var(--bg-secondary);border-radius:12px;margin-bottom:30px;">暂无A/B测试数据</div>';
  } else {
    abResults.forEach(function(test){
      html += '<div style="padding:20px;background:var(--bg-secondary);border-radius:12px;margin-bottom:15px;">';
      html += '<div style="font-weight:700;margin-bottom:12px;font-size:1rem;">' + test.name + ' <span style="font-size:.75rem;color:var(--text-secondary);font-weight:400;">(' + test.status + ')</span></div>';
      html += '<div style="display:grid;gap:8px;">';
      test.variants.forEach(function(v){
        html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--bg-primary);border-radius:8px;">';
        html += '<div style="flex:1;font-weight:600;font-size:.88rem;">' + v.variant + '</div>';
        html += '<div style="font-size:.8rem;color:var(--text-secondary);">展示 ' + v.impressions + ' 次</div>';
        html += '<div style="font-size:.8rem;color:var(--text-secondary);">转化 ' + v.conversions + ' 次</div>';
        html += '<div style="font-weight:700;color:#10b981;font-size:.9rem;">' + v.conversionRate + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });
  }

  // 热门工具
  if(topTools.length > 0){
    html += '<h2 style="margin:30px 0 15px;font-size:1.2rem;">🔥 热门工具（本地数据）</h2>';
    html += '<div style="display:grid;gap:8px;">';
    topTools.forEach(function(item, index){
      html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg-secondary);border-radius:10px;">';
      html += '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;">' + (index + 1) + '</div>';
      html += '<div style="flex:1;font-weight:600;font-size:.9rem;">' + item.tool + '</div>';
      html += '<div style="font-weight:700;color:#667eea;font-size:.9rem;">' + item.count + ' 次</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // 导出数据按钮
  html += '<div style="margin-top:30px;padding:20px;background:var(--bg-secondary);border-radius:12px;text-align:center;">';
  html += '<p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:15px;">所有数据仅存储在你的浏览器本地，不会上传到服务器</p>';
  html += '<button onclick="exportBehaviorData()" style="padding:10px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:.9rem;cursor:pointer;font-weight:600;">📥 导出数据（JSON）</button>';
  html += ' <button onclick="clearBehaviorData()" style="padding:10px 24px;background:var(--bg-primary);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:.9rem;cursor:pointer;font-weight:600;">🗑️ 清除数据</button>';
  html += '</div>';

  html += '</div></div>';

  // 显示
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','metricsView','changelogView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });

  var container = document.getElementById('dashboardView');
  if(!container){
    container = document.createElement('div');
    container.id = 'dashboardView';
    document.body.appendChild(container);
  }
  container.innerHTML = html;
  container.style.display = 'block';
  window.scrollTo(0,0);

  if(typeof trackEvent === 'function') trackEvent('view_dashboard', {});
}

function exportBehaviorData(){
  var data = window.BehaviorTracker ? window.BehaviorTracker.exportData() : {};
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'aitools-radar-data-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function clearBehaviorData(){
  if(confirm('确定要清除所有本地数据吗？此操作不可撤销。')){
    localStorage.removeItem('aitools_behavior_events');
    localStorage.removeItem('aitools_feedbacks');
    Object.keys(localStorage).forEach(function(key){
      if(key.startsWith('ab_test_')) localStorage.removeItem(key);
    });
    alert('数据已清除，页面将刷新');
    location.reload();
  }
}

// ===== 在导航栏添加链接 =====
function addNavLinks(){
  var navLinks = document.querySelector('.nav-links');
  if(!navLinks) return;

  // 检查是否已添加
  if(document.getElementById('changelog-nav-link')) return;

  var changelogLink = document.createElement('a');
  changelogLink.id = 'changelog-nav-link';
  changelogLink.href = '#';
  changelogLink.textContent = '更新日志';
  changelogLink.onclick = function(){ showChangelog(); return false; };
  navLinks.insertBefore(changelogLink, navLinks.children[3] || null);

  var feedbackLink = document.createElement('a');
  feedbackLink.href = '#';
  feedbackLink.textContent = '反馈';
  feedbackLink.onclick = function(){ showFeedbackModal('suggestion'); return false; };
  navLinks.insertBefore(feedbackLink, navLinks.children[4] || null);
}

// ===== 暴露全局函数 =====
window.showChangelog = showChangelog;
window.showFeedbackModal = showFeedbackModal;
window.submitFeedback = submitFeedback;
window.switchFeedbackType = switchFeedbackType;
window.showDataDashboard = showDataDashboard;
window.exportBehaviorData = exportBehaviorData;
window.clearBehaviorData = clearBehaviorData;
window.RoadmapData = RoadmapData;

// ===== 初始化 =====
setTimeout(addNavLinks, 500);

console.log('%c📝 更新日志+路线图+反馈系统已加载', 'color:#667eea;font-size:12px;font-weight:bold');

})();
