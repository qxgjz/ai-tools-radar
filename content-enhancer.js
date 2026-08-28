// ===== 第十一轮：内容增强器 =====
// 1. 工具详情页内容扩展（使用场景、FAQ、相关文章）
// 2. 4大内容集群内部链接网络
// 3. 面包屑导航增强
// 4. 相关文章推荐模块

(function(){
'use strict';

// 内容集群定义
var ContentClusters = {
  writing: {
    name: 'AI写作工具集群',
    icon: '✍️',
    pillar: 'best-ai-writing-tools-2026',
    articles: ['best-ai-writing-tools-2026'],
    tools: ['chatgpt', 'claude', 'jasper', 'copy-ai', 'writesonic', 'notion-ai', 'grammarly', 'sudowrite', 'anyword', 'scalenut', 'rytr']
  },
  image: {
    name: 'AI图像工具集群',
    icon: '🎨',
    pillar: 'best-ai-image-tools-2026',
    articles: ['best-ai-image-tools-2026'],
    tools: ['midjourney', 'dall-e-3', 'stable-diffusion', 'leonardo-ai', 'adobe-firefly', 'ideogram', 'recraft', 'canva-magic', 'krea', 'getimg-ai']
  },
  video: {
    name: 'AI视频工具集群',
    icon: '🎬',
    pillar: 'best-ai-video-tools-2026',
    articles: ['best-ai-video-tools-2026'],
    tools: ['runway', 'pika', 'sora', 'kling', 'luma', 'heygen', 'capcut', 'synthesia', 'kaiber', 'd-id']
  },
  code: {
    name: 'AI编程工具集群',
    icon: '💻',
    pillar: 'best-ai-coding-tools-2026',
    articles: ['best-ai-coding-tools-2026'],
    tools: ['github-copilot', 'cursor', 'claude-code', 'windsurf', 'amazon-q', 'tabnine', 'coderabbit', 'replit', 'sourcegraph-cody', 'mintlify']
  },
  audio: {
    name: 'AI音频工具集群',
    icon: '🎵',
    pillar: 'best-ai-audio-tools-2026',
    articles: ['best-ai-audio-tools-2026'],
    tools: ['suno', 'udio', 'elevenlabs', 'descript', 'adobe-podcast', 'murf-ai', 'soundraw', 'aiva', 'krisp', 'audioshake']
  },
  productivity: {
    name: 'AI效率工具集群',
    icon: '⚡',
    pillar: 'best-ai-productivity-tools-2026',
    articles: ['best-ai-productivity-tools-2026'],
    tools: ['notion-ai', 'mem', 'taskade', 'fathom', 'superhuman', 'otter-ai', 'zapier', 'grammarly', 'calendly', 'clickup', 'obsidian']
  }
};

// 分类名称映射
var categoryNames = {
  writing: 'AI写作', image: 'AI图像', video: 'AI视频',
  code: 'AI编程', audio: 'AI音频', productivity: 'AI效率'
};

// 渲染内容集群导航
function renderClusterNav(activeCategory){
  var html = '<div class="cluster-nav" style="background:var(--bg-secondary,#f8f9fa);border-radius:12px;padding:15px 20px;margin:15px 0;">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-size:1.1rem;">🗂️</span><strong style="font-size:.95rem;">内容集群导航</strong></div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
  for(var key in ContentClusters){
    var cluster = ContentClusters[key];
    var isActive = key === activeCategory;
    html += '<a href="#" onclick="return showCluster(\'' + key + '\'),!1" style="padding:6px 14px;background:' + (isActive ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'var(--bg-primary,#fff)') + ';color:' + (isActive ? '#fff' : 'var(--text-primary,#333)') + ';border-radius:20px;text-decoration:none;font-size:.85rem;border:1px solid var(--border-color,#ddd);transition:all .2s;" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'translateY(0)\'">' + cluster.icon + ' ' + cluster.name.replace('集群','') + '</a>';
  }
  html += '</div></div>';
  return html;
}

// 渲染集群页面
function renderClusterPage(category){
  var cluster = ContentClusters[category];
  if(!cluster) return '';

  var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
  html += '<div style="margin:20px 0;">';
  html += '<div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;">';
  html += '<div style="font-size:3rem;">' + cluster.icon + '</div>';
  html += '<div><h1 style="margin:0;font-size:1.8rem;">' + cluster.name + '</h1>';
  html += '<p style="color:var(--text-secondary);margin:5px 0 0;">' + cluster.tools.length + '款工具 | ' + cluster.articles.length + '篇深度评测 | 持续更新</p></div></div>';

  // 内容集群导航
  html += renderClusterNav(category);

  // 支柱文章
  html += '<h2 style="margin:25px 0 15px;font-size:1.3rem;">📖 支柱内容（深度评测）</h2>';
  html += '<div style="display:grid;gap:12px;">';
  cluster.articles.forEach(function(articleId){
    var article = findArticle(articleId);
    if(article){
      html += '<a href="#" onclick="return showBlogArticle(\'' + article.id + '\'),!1" style="display:block;padding:20px;background:var(--bg-secondary);border-radius:12px;text-decoration:none;color:var(--text-primary);border-left:4px solid #667eea;transition:all .2s;" onmouseover="this.style.transform=\'translateX(5px)\'" onmouseout="this.style.transform=\'translateX(0)\'">';
      html += '<div style="font-weight:600;font-size:1.05rem;margin-bottom:5px;">' + article.title + '</div>';
      html += '<div style="font-size:.85rem;color:var(--text-secondary);">' + article.excerpt + '</div>';
      html += '<div style="margin-top:8px;font-size:.75rem;color:#667eea;">阅读时间：' + article.readTime + ' | ' + article.date + '</div>';
      html += '</a>';
    }
  });
  html += '</div>';

  // 集群工具
  html += '<h2 style="margin:25px 0 15px;font-size:1.3rem;">🛠️ 集群工具（' + cluster.tools.length + '款）</h2>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
  cluster.tools.forEach(function(toolId){
    var tool = findTool(toolId);
    if(tool){
      html += '<a href="#" onclick="return showToolDetail(\'' + (tool.id || tool.name) + '\'),!1" style="display:block;padding:15px;background:var(--bg-secondary);border-radius:10px;text-decoration:none;color:var(--text-primary);border:1px solid var(--border-color);transition:all .2s;" onmouseover="this.style.borderColor=\'#667eea\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border-color)\';this.style.transform=\'translateY(0)\'">';
      html += '<div style="font-size:1.5rem;margin-bottom:5px;">' + (tool.icon || '🛠️') + '</div>';
      html += '<div style="font-weight:600;font-size:.9rem;margin-bottom:3px;">' + tool.name + '</div>';
      html += '<div style="font-size:.75rem;color:var(--text-secondary);">⭐ ' + (tool.rating || '4.5') + ' | ' + (tool.price || '免费') + '</div>';
      html += '</a>';
    }
  });
  html += '</div>';

  html += '</div></div>';
  return html;
}

// 查找文章
function findArticle(articleId){
  var allArticles = window.ARTICLES || [];
  if(window.ARTICLES_V2) allArticles = allArticles.concat(window.ARTICLES_V2);
  if(window.ARTICLES_V3) allArticles = allArticles.concat(window.ARTICLES_V3);
  if(window.ARTICLES_V4) allArticles = allArticles.concat(window.ARTICLES_V4);
  return allArticles.find(function(a){ return a.id === articleId || a.slug === articleId; });
}

// 查找工具
function findTool(toolId){
  var allTools = window.tools || [];
  return allTools.find(function(t){
    var id = (t.id || t.name || '').toLowerCase().replace(/\s+/g, '-');
    return id === toolId || t.name === toolId;
  });
}

// 渲染相关文章推荐
function renderRelatedArticles(category, currentArticleId){
  var cluster = ContentClusters[category];
  if(!cluster) return '';

  var relatedArticles = cluster.articles.filter(function(id){ return id !== currentArticleId; });
  // 也添加其他集群的文章
  for(var key in ContentClusters){
    if(key !== category){
      ContentClusters[key].articles.forEach(function(id){
        if(relatedArticles.length < 4 && !relatedArticles.includes(id)){
          relatedArticles.push(id);
        }
      });
    }
  }

  if(relatedArticles.length === 0) return '';

  var html = '<div style="margin-top:30px;padding-top:20px;border-top:1px solid var(--border-color);">';
  html += '<h3 style="margin-bottom:15px;font-size:1.1rem;">📚 相关深度评测</h3>';
  html += '<div style="display:grid;gap:10px;">';
  relatedArticles.slice(0, 4).forEach(function(articleId){
    var article = findArticle(articleId);
    if(article){
      html += '<a href="#" onclick="return showBlogArticle(\'' + article.id + '\'),!1" style="display:flex;gap:12px;padding:12px;background:var(--bg-secondary);border-radius:10px;text-decoration:none;color:var(--text-primary);transition:all .2s;" onmouseover="this.style.background=\'var(--bg-primary)\';this.style.transform=\'translateX(3px)\'" onmouseout="this.style.background=\'var(--bg-secondary)\';this.style.transform=\'translateX(0)\'">';
      html += '<div style="font-size:1.5rem;">📖</div>';
      html += '<div style="flex:1;"><div style="font-weight:600;font-size:.9rem;margin-bottom:3px;">' + article.title.substring(0, 60) + (article.title.length > 60 ? '...' : '') + '</div>';
      html += '<div style="font-size:.75rem;color:var(--text-secondary);">' + article.readTime + ' | ' + article.date + '</div></div></a>';
    }
  });
  html += '</div></div>';
  return html;
}

// 渲染工具详情页内容扩展
function renderToolContentExtension(tool){
  if(!tool) return '';
  var category = tool.category;
  var cluster = ContentClusters[category];

  var html = '';

  // 内容集群导航
  if(cluster){
    html += renderClusterNav(category);
  }

  // 使用场景
  var useCases = generateUseCases(tool);
  if(useCases.length > 0){
    html += '<div style="margin-top:20px;padding:20px;background:var(--bg-secondary);border-radius:12px;">';
    html += '<h4 style="margin:0 0 12px;font-size:1.05rem;">🎯 典型使用场景</h4>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">';
    useCases.forEach(function(uc){
      html += '<div style="padding:12px;background:var(--bg-primary);border-radius:8px;border-left:3px solid #667eea;">';
      html += '<div style="font-weight:600;font-size:.85rem;margin-bottom:3px;">' + uc.title + '</div>';
      html += '<div style="font-size:.75rem;color:var(--text-secondary);">' + uc.desc + '</div></div>';
    });
    html += '</div></div>';
  }

  // 常见问题
  var faqs = generateToolFAQs(tool);
  if(faqs.length > 0){
    html += '<div style="margin-top:20px;padding:20px;background:var(--bg-secondary);border-radius:12px;">';
    html += '<h4 style="margin:0 0 12px;font-size:1.05rem;">❓ 常见问题</h4>';
    faqs.forEach(function(faq, index){
      html += '<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border-color);' + (index === faqs.length - 1 ? 'border-bottom:none;margin-bottom:0;padding-bottom:0;' : '') + '">';
      html += '<div style="font-weight:600;font-size:.9rem;margin-bottom:5px;">Q: ' + faq.q + '</div>';
      html += '<div style="font-size:.85rem;color:var(--text-secondary);line-height:1.6;">A: ' + faq.a + '</div></div>';
    });
    html += '</div>';
  }

  // 相关文章推荐
  if(cluster){
    html += renderRelatedArticles(category, null);
  }

  return html;
}

// 生成使用场景
function generateUseCases(tool){
  var category = tool.category;
  var name = tool.name || '';
  var useCases = [];

  if(category === 'writing'){
    useCases = [
      { title: '博客文章写作', desc: '快速生成高质量博客文章和长文内容' },
      { title: '营销文案', desc: '生成广告文案、社交媒体帖子、邮件营销内容' },
      { title: 'SEO内容优化', desc: '优化现有内容的SEO，提升搜索引擎排名' },
      { title: '学术写作辅助', desc: '辅助论文写作、文献总结、研究报告' }
    ];
  } else if(category === 'image'){
    useCases = [
      { title: '社交媒体配图', desc: '快速生成社交媒体帖子和广告配图' },
      { title: '产品设计原型', desc: '生成产品设计概念图和视觉原型' },
      { title: '营销素材', desc: '生成广告横幅、海报、宣传册等营销素材' },
      { title: '艺术创作', desc: '探索艺术风格，创作独特的数字艺术作品' }
    ];
  } else if(category === 'video'){
    useCases = [
      { title: '短视频创作', desc: '快速生成抖音、TikTok、Reels等短视频内容' },
      { title: '产品演示视频', desc: '生成产品介绍和演示视频，提升转化率' },
      { title: '社交媒体内容', desc: '生成社交媒体视频内容，提升 engagement' },
      { title: '营销广告视频', desc: '生成广告视频素材，降低制作成本' }
    ];
  } else if(category === 'code'){
    useCases = [
      { title: '代码补全', desc: '智能代码补全，提升编码速度' },
      { title: '代码重构', desc: '辅助代码重构，提升代码质量' },
      { title: 'Bug修复', desc: '快速定位和修复Bug' },
      { title: '测试生成', desc: '自动生成单元测试和集成测试' }
    ];
  } else if(category === 'audio'){
    useCases = [
      { title: '音乐创作', desc: '快速生成歌曲和背景音乐' },
      { title: '播客制作', desc: '辅助播客录制、编辑和发布' },
      { title: '视频配音', desc: '生成视频配音和旁白' },
      { title: '有声书制作', desc: '将文本转换为高质量有声书' }
    ];
  } else if(category === 'productivity'){
    useCases = [
      { title: '会议纪要', desc: '自动生成会议纪要和行动项' },
      { title: '知识管理', desc: '整理和管理个人知识库' },
      { title: '任务管理', desc: '智能任务分解和项目管理' },
      { title: '邮件处理', desc: '智能邮件分类和回复' }
    ];
  }

  return useCases;
}

// 生成工具FAQ
function generateToolFAQs(tool){
  var name = tool.name || '这个工具';
  return [
    { q: name + '是免费的吗？', a: (tool.price || '免费') + '。具体价格方案请查看上方价格表格，大部分工具提供免费版或免费试用。' },
    { q: name + '支持中文吗？', a: '大部分主流AI工具都支持中文，但中文质量因工具而异。建议查看上方的多语言评分。' },
    { q: name + '生成的内容可以商用吗？', a: '取决于具体工具的服务条款。付费版通常允许商用，免费版可能有限制。建议仔细阅读每个工具的隐私政策和服务条款。' },
    { q: name + '和其他同类工具相比有什么优势？', a: '请查看上方的优缺点分析和横向对比表格，每个工具都有其独特的优势和适用场景。' },
    { q: '如何选择适合自己的AI工具？', a: '建议根据你的使用场景、预算、技术能力来选择。可以先免费试用2-3款工具，根据实际体验选择最适合的。' }
  ];
}

// 暴露全局函数
window.renderClusterNav = renderClusterNav;
window.renderClusterPage = renderClusterPage;
window.renderRelatedArticles = renderRelatedArticles;
window.renderToolContentExtension = renderToolContentExtension;
window.ContentClusters = ContentClusters;

// 显示集群页面
window.showCluster = function(category){
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','metricsView','roadmapView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  var container = document.getElementById('clusterView');
  if(!container){
    container = document.createElement('div');
    container.id = 'clusterView';
    document.body.appendChild(container);
  }
  container.innerHTML = renderClusterPage(category);
  container.style.display = 'block';
  window.scrollTo(0,0);
  if(typeof trackEvent === 'function') trackEvent('view_cluster', { category: category });
};

// 拦截工具详情页，注入内容扩展
var originalRenderToolDetail3 = window.renderToolDetail;
window.renderToolDetail = function(tool){
  if(originalRenderToolDetail3){
    originalRenderToolDetail3(tool);
  }
  setTimeout(function(){
    var detailContent = document.getElementById('detailContent');
    if(detailContent && tool){
      // 注入内容扩展（如果还没有）
      if(!detailContent.querySelector('.content-extension-injected')){
        var extensionHtml = renderToolContentExtension(tool);
        if(extensionHtml){
          var wrapper = document.createElement('div');
          wrapper.className = 'content-extension-injected';
          wrapper.innerHTML = extensionHtml;
          detailContent.appendChild(wrapper);
        }
      }
    }
  }, 250);
};

// 拦截文章页，注入相关文章
var originalShowBlogArticle2 = window.showBlogArticle;
window.showBlogArticle = function(articleId){
  if(originalShowBlogArticle2){
    originalShowBlogArticle2(articleId);
  }
  setTimeout(function(){
    var articleContent = document.getElementById('blogArticleContent');
    if(articleContent){
      var article = findArticle(articleId);
      if(article && article.category && !articleContent.querySelector('.related-articles-injected')){
        var relatedHtml = renderRelatedArticles(article.category, articleId);
        if(relatedHtml){
          var wrapper = document.createElement('div');
          wrapper.className = 'related-articles-injected';
          wrapper.innerHTML = relatedHtml;
          articleContent.appendChild(wrapper);
        }
      }
    }
  }, 300);
};

// 在首页注入内容集群导航
function initClusterNavOnHome(){
  var hotSection = document.getElementById('hotSection');
  if(hotSection && !document.getElementById('clusterNavContainer')){
    var container = document.createElement('div');
    container.id = 'clusterNavContainer';
    container.style.cssText = 'max-width:1200px;margin:0 auto;padding:0 20px;';
    container.innerHTML = renderClusterNav(null);
    hotSection.parentNode.insertBefore(container, hotSection);
  }
}

setTimeout(initClusterNavOnHome, 800);

console.log('%c📚 内容增强器已加载：工具详情扩展 + 6大内容集群 + 相关文章推荐', 'color:#22c55e;font-size:12px;font-weight:bold');

})();
