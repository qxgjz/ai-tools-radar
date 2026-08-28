// ===== 第十五轮：迭代更新系统核心 =====
// 1. 版本管理（semver）
// 2. 更新日志数据
// 3. A/B测试框架
// 4. 行为数据收集与分析
// 5. 迭代优化决策引擎

(function(){
'use strict';

// ===== 1. 版本管理 =====
var VersionManager = {
  currentVersion: '2.5.0',
  versionHistory: [
    { version: '1.0.0', date: '2026-08-20', type: 'release', title: '初始版本', changes: ['网站上线', '基础工具导航', '工具详情页'] },
    { version: '1.5.0', date: '2026-08-22', type: 'minor', title: '内容增强', changes: ['新增4篇深度文章', '工具对比功能', '用户评分系统'] },
    { version: '2.0.0', date: '2026-08-25', type: 'major', title: 'SEO与增长', changes: ['SEO优化器', '6种结构化数据', '退出意图弹窗', '邮件订阅系统'] },
    { version: '2.2.0', date: '2026-08-27', type: 'minor', title: 'UX与变现', changes: ['Hero区域优化', '首次访问引导', '联盟营销系统', '全局搜索(Ctrl+K)'] },
    { version: '2.3.0', date: '2026-08-28', type: 'minor', title: 'PWA与性能', changes: ['PWA支持(可安装+离线)', 'RSS订阅', '404页面', '暗色模式', '回到顶部按钮'] },
    { version: '2.5.0', date: '2026-08-29', type: 'minor', title: '迭代系统', changes: ['版本管理系统', '更新日志', 'A/B测试框架', '用户反馈收集', '迭代路线图'] }
  ],

  getCurrentVersion: function(){ return this.currentVersion; },

  getVersionHistory: function(){ return this.versionHistory; },

  getLatestVersion: function(){ return this.versionHistory[this.versionHistory.length - 1]; },

  compareVersions: function(v1, v2){
    var parts1 = v1.split('.').map(Number);
    var parts2 = v2.split('.').map(Number);
    for(var i = 0; i < 3; i++){
      if(parts1[i] > parts2[i]) return 1;
      if(parts1[i] < parts2[i]) return -1;
    }
    return 0;
  },

  checkForUpdate: function(){
    var lastSeen = localStorage.getItem('aitools_last_seen_version');
    if(!lastSeen){
      localStorage.setItem('aitools_last_seen_version', this.currentVersion);
      return false;
    }
    if(this.compareVersions(this.currentVersion, lastSeen) > 0){
      localStorage.setItem('aitools_last_seen_version', this.currentVersion);
      return true;
    }
    return false;
  }
};

// ===== 2. A/B测试框架 =====
var ABTestFramework = {
  tests: {},
  userBucket: null,

  init: function(){
    // 为用户分配一个稳定的分桶（0-99）
    var bucket = localStorage.getItem('aitools_ab_bucket');
    if(!bucket){
      bucket = Math.floor(Math.random() * 100);
      localStorage.setItem('aitools_ab_bucket', bucket);
    }
    this.userBucket = parseInt(bucket);
    console.log('%c🧪 A/B测试框架已初始化，用户分桶: ' + this.userBucket, 'color:#f59e0b;font-size:11px;');
  },

  registerTest: function(testId, config){
    // config: { name, variants: [{id, weight, description}], goal, duration }
    this.tests[testId] = {
      id: testId,
      name: config.name,
      variants: config.variants,
      goal: config.goal || 'conversion',
      startDate: config.startDate || new Date().toISOString(),
      status: 'running',
      results: {}
    };

    // 初始化各变体的结果统计
    config.variants.forEach(function(v){
      this.tests[testId].results[v.id] = {
        impressions: 0,
        conversions: 0,
        events: {}
      };
    }.bind(this));

    // 从localStorage恢复数据
    var saved = localStorage.getItem('ab_test_' + testId);
    if(saved){
      try {
        this.tests[testId].results = JSON.parse(saved);
      } catch(e){}
    }
  },

  getVariant: function(testId){
    var test = this.tests[testId];
    if(!test) return null;

    var totalWeight = test.variants.reduce(function(sum, v){ return sum + (v.weight || 1); }, 0);
    var bucketPos = (this.userBucket / 100) * totalWeight;
    var cumulative = 0;

    for(var i = 0; i < test.variants.length; i++){
      cumulative += test.variants[i].weight || 1;
      if(bucketPos < cumulative){
        return test.variants[i];
      }
    }
    return test.variants[test.variants.length - 1];
  },

  trackImpression: function(testId){
    var variant = this.getVariant(testId);
    if(!variant) return;
    var test = this.tests[testId];
    if(!test) return;

    test.results[variant.id].impressions++;
    this.saveTestResults(testId);
  },

  trackConversion: function(testId, eventName){
    var variant = this.getVariant(testId);
    if(!variant) return;
    var test = this.tests[testId];
    if(!test) return;

    test.results[variant.id].conversions++;
    if(eventName){
      test.results[variant.id].events[eventName] = (test.results[variant.id].events[eventName] || 0) + 1;
    }
    this.saveTestResults(testId);

    if(typeof trackEvent === 'function'){
      trackEvent('ab_conversion', { test: testId, variant: variant.id, event: eventName });
    }
  },

  saveTestResults: function(testId){
    var test = this.tests[testId];
    if(!test) return;
    localStorage.setItem('ab_test_' + testId, JSON.stringify(test.results));
  },

  getTestResults: function(testId){
    var test = this.tests[testId];
    if(!test) return null;

    var results = [];
    for(var variantId in test.results){
      var r = test.results[variantId];
      var conversionRate = r.impressions > 0 ? (r.conversions / r.impressions * 100).toFixed(2) : 0;
      results.push({
        variant: variantId,
        impressions: r.impressions,
        conversions: r.conversions,
        conversionRate: conversionRate + '%',
        events: r.events
      });
    }
    return {
      testId: testId,
      name: test.name,
      status: test.status,
      goal: test.goal,
      variants: results
    };
  },

  getAllResults: function(){
    var all = [];
    for(var testId in this.tests){
      all.push(this.getTestResults(testId));
    }
    return all;
  }
};

// ===== 3. 行为数据收集与分析 =====
var BehaviorTracker = {
  sessionStart: null,
  events: [],
  maxEvents: 500,

  init: function(){
    this.sessionStart = new Date();
    // 从localStorage恢复历史事件
    var saved = localStorage.getItem('aitools_behavior_events');
    if(saved){
      try { this.events = JSON.parse(saved); } catch(e){ this.events = []; }
    }

    // 记录页面访问
    this.trackEvent('page_view', {
      path: window.location.hash || '/',
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });

    // 监听hash变化
    window.addEventListener('hashchange', function(){
      this.trackEvent('page_view', {
        path: window.location.hash || '/',
        timestamp: new Date().toISOString()
      });
    }.bind(this));

    // 定期保存
    setInterval(function(){ this.saveEvents(); }.bind(this), 30000);

    console.log('%c📊 行为数据收集器已初始化', 'color:#10b981;font-size:11px;');
  },

  trackEvent: function(eventName, data){
    var event = {
      name: eventName,
      data: data || {},
      timestamp: new Date().toISOString(),
      sessionDuration: Math.floor((new Date() - this.sessionStart) / 1000)
    };

    this.events.push(event);

    // 限制事件数量
    if(this.events.length > this.maxEvents){
      this.events = this.events.slice(-this.maxEvents);
    }

    // 关键事件立即保存
    if(['conversion', 'signup', 'purchase', 'tool_click', 'article_view'].includes(eventName)){
      this.saveEvents();
    }
  },

  saveEvents: function(){
    try {
      localStorage.setItem('aitools_behavior_events', JSON.stringify(this.events));
    } catch(e){
      // 存储空间不足，清理旧事件
      this.events = this.events.slice(-Math.floor(this.maxEvents / 2));
      try {
        localStorage.setItem('aitools_behavior_events', JSON.stringify(this.events));
      } catch(e2){}
    }
  },

  getSessionStats: function(){
    var pageViews = this.events.filter(function(e){ return e.name === 'page_view'; }).length;
    var toolClicks = this.events.filter(function(e){ return e.name === 'tool_click' || e.name === 'affiliate_click'; }).length;
    var articleViews = this.events.filter(function(e){ return e.name === 'article_view'; }).length;
    var searches = this.events.filter(function(e){ return e.name === 'search' || e.name === 'search_select'; }).length;
    var duration = Math.floor((new Date() - this.sessionStart) / 1000);

    return {
      sessionDuration: duration,
      pageViews: pageViews,
      toolClicks: toolClicks,
      articleViews: articleViews,
      searches: searches,
      totalEvents: this.events.length
    };
  },

  getTopTools: function(limit){
    var toolCounts = {};
    this.events.forEach(function(e){
      if(e.name === 'tool_click' || e.name === 'tool_view'){
        var tool = e.data.tool || e.data.toolName || 'unknown';
        toolCounts[tool] = (toolCounts[tool] || 0) + 1;
      }
    });
    return Object.entries(toolCounts)
      .sort(function(a,b){ return b[1] - a[1]; })
      .slice(0, limit || 10)
      .map(function(item){ return { tool: item[0], count: item[1] }; });
  },

  getTopArticles: function(limit){
    var articleCounts = {};
    this.events.forEach(function(e){
      if(e.name === 'article_view'){
        var article = e.data.article || e.data.title || 'unknown';
        articleCounts[article] = (articleCounts[article] || 0) + 1;
      }
    });
    return Object.entries(articleCounts)
      .sort(function(a,b){ return b[1] - a[1]; })
      .slice(0, limit || 5);
  },

  exportData: function(){
    return {
      version: VersionManager.getCurrentVersion(),
      sessionStats: this.getSessionStats(),
      topTools: this.getTopTools(10),
      topArticles: this.getTopArticles(5),
      abTests: ABTestFramework.getAllResults(),
      events: this.events.slice(-100)
    };
  }
};

// ===== 4. 迭代优化决策引擎 =====
var OptimizationEngine = {
  rules: [
    {
      id: 'hero_cta_optimization',
      name: 'Hero CTA优化',
      condition: function(data){
        // 如果首页跳出率高，优化Hero CTA
        return data.sessionStats.pageViews <= 1 && data.sessionStats.sessionDuration < 30;
      },
      action: '优化Hero区域CTA按钮，增加价值主张清晰度',
      priority: 'high'
    },
    {
      id: 'search_usage_low',
      name: '搜索功能使用率低',
      condition: function(data){
        return data.sessionStats.pageViews > 3 && data.sessionStats.searches === 0;
      },
      action: '增加搜索框可见性，添加搜索引导提示',
      priority: 'medium'
    },
    {
      id: 'tool_click_low',
      name: '工具点击率低',
      condition: function(data){
        return data.sessionStats.pageViews > 2 && data.sessionStats.toolClicks === 0;
      },
      action: '优化工具卡片设计，增加点击引导',
      priority: 'high'
    },
    {
      id: 'article_engagement',
      name: '文章参与度',
      condition: function(data){
        return data.sessionStats.articleViews > 0 && data.sessionStats.sessionDuration > 120;
      },
      action: '在文章底部增加相关文章推荐和邮件订阅引导',
      priority: 'medium'
    }
  ],

  analyze: function(){
    var data = BehaviorTracker.exportData();
    var recommendations = [];

    this.rules.forEach(function(rule){
      try {
        if(rule.condition(data)){
          recommendations.push({
            id: rule.id,
            name: rule.name,
            action: rule.action,
            priority: rule.priority,
            timestamp: new Date().toISOString()
          });
        }
      } catch(e){}
    });

    return recommendations;
  },

  getOptimizationSuggestions: function(){
    return this.analyze();
  }
};

// ===== 5. 注册默认A/B测试 =====
function registerDefaultTests(){
  ABTestFramework.registerTest('hero_cta_test', {
    name: 'Hero CTA文案测试',
    variants: [
      { id: 'control', weight: 50, description: '开始对比工具' },
      { id: 'variant_a', weight: 50, description: '免费发现最佳AI工具' }
    ],
    goal: 'hero_cta_click'
  });

  ABTestFramework.registerTest('email_incentive_test', {
    name: '邮件订阅激励测试',
    variants: [
      { id: 'control', weight: 50, description: '订阅获取最新AI工具资讯' },
      { id: 'variant_a', weight: 50, description: '免费获取30款AI工具榜单PDF' }
    ],
    goal: 'email_subscribe'
  });
}

// ===== 初始化 =====
function init(){
  ABTestFramework.init();
  BehaviorTracker.init();
  registerDefaultTests();

  // 检查是否有新版本
  var hasUpdate = VersionManager.checkForUpdate();
  if(hasUpdate){
    setTimeout(function(){
      showUpdateNotification();
    }, 3000);
  }

  // 暴露全局
  window.VersionManager = VersionManager;
  window.ABTestFramework = ABTestFramework;
  window.BehaviorTracker = BehaviorTracker;
  window.OptimizationEngine = OptimizationEngine;

  console.log('%c🔄 迭代更新系统已加载：版本 ' + VersionManager.getCurrentVersion() + ' | A/B测试: ' + Object.keys(ABTestFramework.tests).length + '个 | 行为追踪已启动', 'color:#667eea;font-size:12px;font-weight:bold');
}

// ===== 更新通知横幅 =====
function showUpdateNotification(){
  var latest = VersionManager.getLatestVersion();

  var banner = document.createElement('div');
  banner.id = 'update-notification';
  banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:16px 24px;border-radius:12px;box-shadow:0 10px 40px rgba(102,126,234,0.4);z-index:99999;display:flex;align-items:center;gap:15px;max-width:500px;width:90%;transition:transform .4s ease;';

  banner.innerHTML = '<div style="font-size:1.5rem;">🎉</div>' +
    '<div style="flex:1;">' +
      '<div style="font-weight:700;font-size:.95rem;margin-bottom:2px;">网站已更新到 v' + latest.version + '</div>' +
      '<div style="font-size:.8rem;opacity:.9;">' + latest.title + ' — ' + latest.changes.slice(0, 2).join('、') + '</div>' +
    '</div>' +
    '<button onclick="document.getElementById(\'update-notification\').style.transform=\'translateX(-50%) translateY(100px)\';setTimeout(function(){document.getElementById(\'update-notification\').remove()},400);" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">×</button>';

  document.body.appendChild(banner);

  setTimeout(function(){
    banner.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);

  // 8秒后自动隐藏
  setTimeout(function(){
    if(banner.parentNode){
      banner.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(function(){ banner.remove(); }, 400);
    }
  }, 8000);

  if(typeof trackEvent === 'function'){
    trackEvent('update_notification_shown', { version: latest.version });
  }
}

// DOM加载完成后初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
