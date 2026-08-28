// ===== 第十轮：SEO优化器 =====
// 1. 工具详情页动态标题和Meta描述
// 2. 文章页动态标题、Meta、OG标签
// 3. 注入Article、FAQPage、BreadcrumbList结构化数据
// 4. 工具详情页注入Review结构化数据

(function(){
'use strict';

var SEOMeta = {
  // 分类中文名称映射
  categoryNames: {
    writing: 'AI写作工具',
    image: 'AI绘画工具',
    video: 'AI视频工具',
    code: 'AI编程工具',
    audio: 'AI音频工具',
    productivity: 'AI效率工具'
  },

  // 更新页面标题
  setTitle: function(title){
    if(title && title !== document.title){
      document.title = title;
    }
  },

  // 更新Meta描述
  setMetaDescription: function(desc){
    if(!desc) return;
    var meta = document.querySelector('meta[name="description"]');
    if(meta){
      meta.setAttribute('content', desc.substring(0, 160));
    }
  },

  // 更新OG标签
  setOGTags: function(title, desc, url, image){
    var tags = {
      'og:title': title,
      'og:description': desc ? desc.substring(0, 160) : '',
      'og:url': url || window.location.href,
      'og:image': image || 'https://qxgjz.github.io/ai-tools-radar/og-image.png'
    };
    for(var key in tags){
      var meta = document.querySelector('meta[property="' + key + '"]');
      if(meta && tags[key]){
        meta.setAttribute('content', tags[key]);
      }
    }
    // Twitter Card
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if(twTitle && title) twTitle.setAttribute('content', title);
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if(twDesc && desc) twDesc.setAttribute('content', desc.substring(0, 160));
  },

  // 注入结构化数据（JSON-LD）
  injectSchema: function(id, data){
    // 移除旧的
    var old = document.getElementById(id);
    if(old) old.remove();
    // 注入新的
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  },

  // 移除动态注入的结构化数据
  removeDynamicSchemas: function(){
    ['dynamic-article-schema', 'dynamic-faq-schema', 'dynamic-breadcrumb-schema', 'dynamic-review-schema'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.remove();
    });
  },

  // 生成面包屑结构化数据
  generateBreadcrumbSchema: function(items){
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map(function(item, index){
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        };
      })
    };
  },

  // 生成文章结构化数据
  generateArticleSchema: function(article){
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt || article.description,
      author: {
        '@type': 'Organization',
        name: article.author || 'AI Tools Radar 编辑部'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI Tools Radar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://qxgjz.github.io/ai-tools-radar/og-image.png'
        }
      },
      datePublished: article.date || new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0],
      image: 'https://qxgjz.github.io/ai-tools-radar/og-image.png',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': window.location.href
      }
    };
  },

  // 生成FAQ结构化数据
  generateFAQSchema: function(faqs){
    if(!faqs || faqs.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(function(faq){
        return {
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        };
      })
    };
  },

  // 生成Review结构化数据（工具详情页）
  generateReviewSchema: function(tool){
    var rating = tool.rating || 4.5;
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'AI Tool',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: tool.price === '免费' ? '0' : '0',
          priceCurrency: 'USD'
        }
      },
      author: {
        '@type': 'Organization',
        name: 'AI Tools Radar'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: '5',
        worstRating: '1'
      },
      datePublished: new Date().toISOString().split('T')[0]
    };
  },

  // 从文章HTML中提取FAQ
  extractFAQs: function(html){
    var faqs = [];
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var headings = temp.querySelectorAll('h3');
    for(var i = 0; i < headings.length; i++){
      var h = headings[i];
      if(h.textContent.indexOf('Q') === 0 || h.textContent.indexOf('问') === 0){
        var answer = '';
        var next = h.nextElementSibling;
        while(next && next.tagName !== 'H3' && next.tagName !== 'H2'){
          answer += next.textContent + ' ';
          next = next.nextElementSibling;
        }
        if(answer){
          faqs.push({ q: h.textContent.replace(/^Q\d+[：:]\s*/, '').replace(/^问[：:]\s*/, ''), a: answer.trim() });
        }
      }
    }
    return faqs.slice(0, 8); // 最多8个FAQ
  }
};

// 暴露全局
window.SEOMeta = SEOMeta;

// 拦截工具详情页渲染
var originalRenderToolDetail = window.renderToolDetail;
window.renderToolDetail = function(tool){
  if(originalRenderToolDetail){
    originalRenderToolDetail(tool);
  }

  setTimeout(function(){
    if(!tool) return;

    // 1. 动态标题
    var catName = SEOMeta.categoryNames[tool.category] || 'AI工具';
    var title = tool.name + ' - ' + catName + '评测、价格、替代品 | AI Tools Radar';
    SEOMeta.setTitle(title);

    // 2. 动态Meta描述
    var desc = tool.name + '是一款' + catName + '工具。' + (tool.description || '') + ' 评分' + (tool.rating || '4.5') + '分，' + (tool.price || '免费') + '。查看详细评测、优缺点、价格对比和替代品。';
    SEOMeta.setMetaDescription(desc);

    // 3. OG标签
    SEOMeta.setOGTags(title, desc, window.location.href);

    // 4. 面包屑结构化数据
    var breadcrumb = SEOMeta.generateBreadcrumbSchema([
      { name: '首页', url: 'https://qxgjz.github.io/ai-tools-radar/' },
      { name: catName, url: 'https://qxgjz.github.io/ai-tools-radar/#/category/' + tool.category },
      { name: tool.name, url: window.location.href }
    ]);
    SEOMeta.injectSchema('dynamic-breadcrumb-schema', breadcrumb);

    // 5. Review结构化数据
    var review = SEOMeta.generateReviewSchema(tool);
    SEOMeta.injectSchema('dynamic-review-schema', review);

    console.log('%c🔍 SEO优化：工具详情页标题和Meta已更新', 'color:#667eea;font-size:11px');
  }, 150);
};

// 拦截文章页渲染
var originalShowBlogArticle = window.showBlogArticle;
window.showBlogArticle = function(articleId){
  if(originalShowBlogArticle){
    originalShowBlogArticle(articleId);
  }

  setTimeout(function(){
    // 查找文章数据
    var article = null;
    if(window.ARTICLES){
      article = window.ARTICLES.find(function(a){ return a.id === articleId || a.slug === articleId; });
    }
    if(!article && window.ARTICLES_V2){
      article = window.ARTICLES_V2.find(function(a){ return a.id === articleId || a.slug === articleId; });
    }
    if(!article) return;

    // 1. 动态标题
    var title = article.title + ' | AI Tools Radar';
    SEOMeta.setTitle(title);

    // 2. 动态Meta描述
    SEOMeta.setMetaDescription(article.excerpt || article.description);

    // 3. OG标签
    SEOMeta.setOGTags(article.title, article.excerpt, window.location.href);

    // 4. 面包屑结构化数据
    var catName = SEOMeta.categoryNames[article.category] || 'AI工具';
    var breadcrumb = SEOMeta.generateBreadcrumbSchema([
      { name: '首页', url: 'https://qxgjz.github.io/ai-tools-radar/' },
      { name: '榜单', url: 'https://qxgjz.github.io/ai-tools-radar/#/blog' },
      { name: catName, url: 'https://qxgjz.github.io/ai-tools-radar/#/category/' + article.category },
      { name: article.title.substring(0, 50), url: window.location.href }
    ]);
    SEOMeta.injectSchema('dynamic-breadcrumb-schema', breadcrumb);

    // 5. Article结构化数据
    var articleSchema = SEOMeta.generateArticleSchema(article);
    SEOMeta.injectSchema('dynamic-article-schema', articleSchema);

    // 6. FAQ结构化数据（从文章内容提取）
    var faqs = SEOMeta.extractFAQs(article.content || '');
    if(faqs.length > 0){
      var faqSchema = SEOMeta.generateFAQSchema(faqs);
      if(faqSchema){
        SEOMeta.injectSchema('dynamic-faq-schema', faqSchema);
      }
    }

    console.log('%c🔍 SEO优化：文章页标题、Meta、结构化数据已更新（' + faqs.length + '个FAQ）', 'color:#667eea;font-size:11px');
  }, 200);
};

// 拦截首页/列表页，恢复默认标题
var originalNavigateTo = window.navigateTo;
window.navigateTo = function(view){
  if(originalNavigateTo){
    originalNavigateTo(view);
  }

  setTimeout(function(){
    if(view === 'home' || view === 'blog' || view === 'about' || view === 'privacy'){
      // 恢复默认标题
      var defaultTitles = {
        home: 'AI Tools Radar - 发现最好用的 AI 工具 | 2026 最新 AI 工具导航',
        blog: 'AI工具榜单 - 最佳AI工具深度评测 | AI Tools Radar',
        about: '关于我们 - AI Tools Radar',
        privacy: '隐私政策 - AI Tools Radar'
      };
      var defaultDescs = {
        home: 'AI Tools Radar 精选 175+ 最好用的 AI 工具，覆盖写作、图像、视频、编程、音频、效率六大领域。含深度评测、价格对比、用户评分，帮你快速找到最适合的 AI 工具。',
        blog: 'AI Tools Radar 精选榜单，深度评测每款AI工具，包含价格对比、优缺点分析、使用场景推荐，帮你做出明智选择。',
        about: 'AI Tools Radar 是一个专注于 AI 工具发现和评测的导航平台，帮助每个人快速找到最适合自己的 AI 工具。',
        privacy: 'AI Tools Radar 隐私政策，了解我们如何收集、使用和保护你的数据。符合GDPR和CCPA要求。'
      };
      if(defaultTitles[view]){
        SEOMeta.setTitle(defaultTitles[view]);
        SEOMeta.setMetaDescription(defaultDescs[view]);
        SEOMeta.setOGTags(defaultTitles[view], defaultDescs[view]);
      }
      // 移除动态结构化数据
      SEOMeta.removeDynamicSchemas();
    }
  }, 100);
};

// 页面加载时初始化默认结构化数据
function initDefaultSchemas(){
  // 面包屑（首页）
  var breadcrumb = SEOMeta.generateBreadcrumbSchema([
    { name: '首页', url: 'https://qxgjz.github.io/ai-tools-radar/' }
  ]);
  SEOMeta.injectSchema('default-breadcrumb-schema', breadcrumb);

  // WebSite Schema（已有，这里补充Organization）
  var orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Tools Radar',
    url: 'https://qxgjz.github.io/ai-tools-radar/',
    logo: 'https://qxgjz.github.io/ai-tools-radar/og-image.png',
    description: '发现最好用的 AI 工具，提升你的工作效率',
    sameAs: [
      'https://github.com/qxgjz/ai-tools-radar'
    ]
  };
  SEOMeta.injectSchema('org-schema', orgSchema);

  console.log('%c🔍 SEO优化器已加载：动态标题+Meta+结构化数据', 'color:#22c55e;font-size:12px;font-weight:bold');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initDefaultSchemas);
} else {
  initDefaultSchemas();
}

})();
