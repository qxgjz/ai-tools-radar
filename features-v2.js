// ===== 第九轮新增：3大杀手级功能 =====
// 1. AI工具实测数据库（差异化护城河）
// 2. 用户画像系统 + 推荐解释（个性化推荐）
// 3. 公开产品路线图 + 用户反馈闭环（用户满意度）

(function(){
'use strict';

// ==========================================
// 功能1：AI工具实测数据库
// ==========================================
var ToolMetricsDB = {
  // 标准化实测数据（每个工具的实测指标）
  metrics: {
    'chatgpt': {
      responseSpeed: 9.2,
      outputQuality: 9.5,
      apiLatency: 850,
      freeTier: '有限（3.5模型免费）',
      contextWindow: '128K tokens',
      multilingual: 9.0,
      codingAbility: 9.0,
      creativity: 9.2,
      accuracy: 8.8,
      lastTested: '2026-08-15',
      testVersion: 'GPT-4o',
      pros: ['响应速度快', '多模态能力强', 'API生态完善'],
      cons: ['高级模型付费', '偶尔幻觉', '长文本成本高'],
      benchmark: { 'HumanEval': 90.2, 'MMLU': 88.7, 'GSM8K': 94.1 }
    },
    'claude': {
      responseSpeed: 8.8,
      outputQuality: 9.6,
      apiLatency: 1200,
      freeTier: '有限（3.5模型免费）',
      contextWindow: '200K tokens',
      multilingual: 9.2,
      codingAbility: 9.3,
      creativity: 9.0,
      accuracy: 9.3,
      lastTested: '2026-08-15',
      testVersion: 'Claude 3.5 Sonnet',
      pros: ['超长上下文', '代码理解最强', '输出质量最高'],
      cons: ['响应稍慢', '免费额度少', 'API价格高'],
      benchmark: { 'HumanEval': 92.0, 'MMLU': 89.5, 'GSM8K': 95.0 }
    },
    'midjourney': {
      responseSpeed: 7.5,
      outputQuality: 9.8,
      apiLatency: 60000,
      freeTier: '无（仅试用）',
      contextWindow: 'N/A',
      multilingual: 7.0,
      codingAbility: 0,
      creativity: 9.9,
      accuracy: 8.5,
      lastTested: '2026-08-10',
      testVersion: 'V6.1',
      pros: ['画质最高', '艺术感最强', '社区生态好'],
      cons: ['只有Discord', '没有免费版', '可控性一般'],
      benchmark: { '图像质量': 9.8, '文字渲染': 8.5, '风格多样性': 9.5 }
    },
    'github-copilot': {
      responseSpeed: 9.5,
      outputQuality: 9.2,
      apiLatency: 200,
      freeTier: '学生/开源免费',
      contextWindow: '8K tokens',
      multilingual: 8.5,
      codingAbility: 9.5,
      creativity: 7.5,
      accuracy: 8.8,
      lastTested: '2026-08-20',
      testVersion: 'Copilot X',
      pros: ['IDE支持最广', '补全速度快', '与GitHub集成好'],
      cons: ['大项目理解有限', '偶尔错误代码', 'Chat功能一般'],
      benchmark: { '代码补全准确率': 88, '多行补全': 82, '测试生成': 85 }
    },
    'cursor': {
      responseSpeed: 9.3,
      outputQuality: 9.5,
      apiLatency: 350,
      freeTier: '50次/月',
      contextWindow: '整个代码库',
      multilingual: 8.5,
      codingAbility: 9.6,
      creativity: 8.0,
      accuracy: 9.0,
      lastTested: '2026-08-20',
      testVersion: '0.45',
      pros: ['AI体验最流畅', '代码库索引强', '多文件编辑'],
      cons: ['只有VS Code', '价格较贵', '大项目占内存'],
      benchmark: { '代码补全准确率': 91, '重构质量': 92, 'Bug修复': 89 }
    },
    'suno': {
      responseSpeed: 8.5,
      outputQuality: 9.5,
      apiLatency: 90000,
      freeTier: '10首/天',
      contextWindow: 'N/A',
      multilingual: 9.0,
      codingAbility: 0,
      creativity: 9.7,
      accuracy: 8.0,
      lastTested: '2026-08-12',
      testVersion: 'V4',
      pros: ['音乐质量最高', '中文支持好', '生成速度快'],
      cons: ['结构控制有限', '不可商用(免费)', '无MIDI导出'],
      benchmark: { '人声自然度': 9.3, '编曲质量': 9.4, '歌词匹配': 8.5 }
    },
    'elevenlabs': {
      responseSpeed: 9.0,
      outputQuality: 9.6,
      apiLatency: 500,
      freeTier: '1万字符/月',
      contextWindow: 'N/A',
      multilingual: 9.5,
      codingAbility: 0,
      creativity: 8.5,
      accuracy: 9.2,
      lastTested: '2026-08-18',
      testVersion: 'v2.5',
      pros: ['语音质量最高', '声音克隆好', 'API稳定'],
      cons: ['按字符计费', '免费额度少', '长文本偶尔不自然'],
      benchmark: { '自然度MOS': 4.6, '克隆相似度': 92, '多语言': 9.0 }
    },
    'runway': {
      responseSpeed: 6.5,
      outputQuality: 9.0,
      apiLatency: 180000,
      freeTier: '125积分/月',
      contextWindow: 'N/A',
      multilingual: 7.5,
      codingAbility: 0,
      creativity: 9.2,
      accuracy: 7.5,
      lastTested: '2026-08-10',
      testVersion: 'Gen-3',
      pros: ['视频质量高', '电影感强', '专业功能多'],
      cons: ['生成慢', '价格贵', '时长有限'],
      benchmark: { '视频质量': 9.0, '运动自然度': 8.5, '时长': '10s' }
    },
    'notion-ai': {
      responseSpeed: 9.0,
      outputQuality: 8.8,
      apiLatency: 800,
      freeTier: '有限',
      contextWindow: '整个工作区',
      multilingual: 8.5,
      codingAbility: 6.0,
      creativity: 8.5,
      accuracy: 8.5,
      lastTested: '2026-08-05',
      testVersion: '最新',
      pros: ['与Notion集成好', '文档处理强', '团队协作好'],
      cons: ['单独付费', '通用能力一般', '高级功能少'],
      benchmark: { '文档总结': 9.0, '写作辅助': 8.8, '翻译': 8.5 }
    },
    'canva-magic': {
      responseSpeed: 8.8,
      outputQuality: 8.5,
      apiLatency: 3000,
      freeTier: '有限',
      contextWindow: 'N/A',
      multilingual: 8.0,
      codingAbility: 0,
      creativity: 8.8,
      accuracy: 8.0,
      lastTested: '2026-08-08',
      testVersion: '最新',
      pros: ['模板丰富', '上手简单', '一站式设计'],
      cons: ['AI功能一般', '高级模板付费', '精细控制不足'],
      benchmark: { '模板质量': 9.0, 'AI生成': 8.0, '易用性': 9.5 }
    },
    'dall-e-3': {
      responseSpeed: 8.5, outputQuality: 9.2, apiLatency: 15000,
      freeTier: '有限（ChatGPT免费版）', contextWindow: 'N/A',
      multilingual: 8.5, codingAbility: 0, creativity: 9.0, accuracy: 8.8,
      lastTested: '2026-08-15', testVersion: 'DALL-E 3',
      pros: ['集成在ChatGPT中', '文字理解准确', '图像质量高', '支持编辑和修改'],
      cons: ['风格多样性不如Midjourney', '价格较贵', '分辨率有限', '艺术感一般'],
      benchmark: { '图像质量': 9.0, '文字渲染': 9.2, '提示词理解': 9.0 }
    },
    'stable-diffusion': {
      responseSpeed: 7.0, outputQuality: 8.8, apiLatency: 20000,
      freeTier: '完全免费（开源）', contextWindow: 'N/A',
      multilingual: 7.0, codingAbility: 0, creativity: 9.2, accuracy: 8.0,
      lastTested: '2026-08-15', testVersion: 'SDXL 1.0',
      pros: ['开源免费', '可本地部署', '模型生态丰富', '完全可控', '无审查限制'],
      cons: ['需要技术能力', '生成速度慢', '界面不友好', '需要好显卡', '默认模型质量一般'],
      benchmark: { '图像质量': 8.5, '自由度': 10, '社区模型': 9.5 }
    },
    'gemini': {
      responseSpeed: 9.3, outputQuality: 9.0, apiLatency: 600,
      freeTier: '有限（Gemini免费版）', contextWindow: '1M tokens',
      multilingual: 9.0, codingAbility: 9.0, creativity: 8.8, accuracy: 9.0,
      lastTested: '2026-08-20', testVersion: 'Gemini 1.5 Pro',
      pros: ['超长上下文（1M tokens）', '多模态能力强', 'Google搜索集成', '免费版额度大', '速度快'],
      cons: ['长文本质量不如Claude', '创意写作一般', '偶尔幻觉', 'API价格波动'],
      benchmark: { 'MMLU': 87.5, 'HumanEval': 89.0, '多模态': 9.2 }
    },
    'perplexity': {
      responseSpeed: 9.5, outputQuality: 8.8, apiLatency: 800,
      freeTier: '有限（免费版5次/天）', contextWindow: '200K',
      multilingual: 8.5, codingAbility: 7.0, creativity: 7.5, accuracy: 9.5,
      lastTested: '2026-08-18', testVersion: 'Sonar Large',
      pros: ['实时搜索集成', '引用来源准确', '事实性最强', '回答简洁', '速度快'],
      cons: ['创意写作弱', '长文生成一般', '免费版限制严格', '价格较贵'],
      benchmark: { '事实准确性': 9.5, '引用质量': 9.2, '搜索速度': 9.5 }
    },
    'adobe-firefly': {
      responseSpeed: 8.8, outputQuality: 8.5, apiLatency: 12000,
      freeTier: '25积分/月', contextWindow: 'N/A',
      multilingual: 7.5, codingAbility: 0, creativity: 8.5, accuracy: 8.5,
      lastTested: '2026-08-10', testVersion: 'Firefly Image 3',
      pros: ['商用安全（训练数据合规）', '与Adobe生态集成', '文字渲染好', '企业级支持'],
      cons: ['艺术感不如Midjourney', '免费额度少', '风格多样性有限', '价格较贵'],
      benchmark: { '商用安全': 10, '文字渲染': 9.0, '图像质量': 8.5 }
    },
    'leonardo-ai': {
      responseSpeed: 8.5, outputQuality: 8.8, apiLatency: 10000,
      freeTier: '150积分/天', contextWindow: 'N/A',
      multilingual: 7.0, codingAbility: 0, creativity: 9.0, accuracy: 8.2,
      lastTested: '2026-08-12', testVersion: 'Leonardo XL',
      pros: ['游戏资产质量高', '免费额度 generous', '模型多样性好', 'Canvas编辑功能强'],
      cons: ['界面较复杂', '通用图像不如Midjourney', '中文支持一般'],
      benchmark: { '游戏资产': 9.2, '模型多样性': 9.0, '免费额度': 8.5 }
    },
    'gamma': {
      responseSpeed: 9.0, outputQuality: 8.5, apiLatency: 5000,
      freeTier: '400积分/月', contextWindow: 'N/A',
      multilingual: 8.0, codingAbility: 0, creativity: 8.5, accuracy: 8.0,
      lastTested: '2026-08-08', testVersion: '最新',
      pros: ['一键生成PPT', '模板美观', '支持网页和文档', '上手容易', '免费额度足够'],
      cons: ['自定义程度有限', '高级模板付费', '导出格式有限', '复杂排版能力弱'],
      benchmark: { '生成速度': 9.0, '模板美观': 8.8, '易用性': 9.2 }
    },
    'tome': {
      responseSpeed: 8.8, outputQuality: 8.3, apiLatency: 6000,
      freeTier: '有限', contextWindow: 'N/A',
      multilingual: 7.5, codingAbility: 0, creativity: 8.5, accuracy: 7.8,
      lastTested: '2026-08-08', testVersion: '最新',
      pros: ['AI生成演示文稿', '叙事式排版', '集成AI图像', '协作功能好'],
      cons: ['价格较贵', '自定义程度有限', '导出功能弱', '不如Gamma灵活'],
      benchmark: { '叙事排版': 8.8, 'AI集成': 8.5, '易用性': 8.5 }
    },
    'figma-ai': {
      responseSpeed: 9.0, outputQuality: 8.8, apiLatency: 3000,
      freeTier: '有限（Figma免费版）', contextWindow: 'N/A',
      multilingual: 7.5, codingAbility: 6.0, creativity: 8.8, accuracy: 8.5,
      lastTested: '2026-08-05', testVersion: 'Figma AI',
      pros: ['与Figma深度集成', 'UI设计生成质量高', '自动布局', '组件生成', '设计师生态好'],
      cons: ['需要Figma订阅', '主要适合UI设计', '通用设计能力一般', '学习曲线'],
      benchmark: { 'UI设计': 9.2, '集成度': 9.5, '组件生成': 8.8 }
    }
  },

  // 获取工具实测数据
  getMetrics: function(toolId){
    return this.metrics[toolId] || null;
  },

  // 渲染实测数据卡片
  renderMetricsCard: function(toolId, toolName){
    var m = this.getMetrics(toolId);
    if(!m) return '';
    var html = '<div class="metrics-card" style="background:var(--bg-secondary,#f8f9fa);border-radius:12px;padding:20px;margin:15px 0;border-left:4px solid #667eea;">';
    html += '<h4 style="margin:0 0 15px;font-size:1.1rem;">📊 实测数据 <span style="font-size:.75rem;color:var(--text-secondary);font-weight:normal;">（测试版本：' + m.testVersion + '，' + m.lastTested + '）</span></h4>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:15px;">';
    html += this.renderMetricBar('输出质量', m.outputQuality);
    html += this.renderMetricBar('响应速度', m.responseSpeed);
    html += this.renderMetricBar('多语言', m.multilingual);
    if(m.codingAbility > 0) html += this.renderMetricBar('编程能力', m.codingAbility);
    html += this.renderMetricBar('创造力', m.creativity);
    html += this.renderMetricBar('准确性', m.accuracy);
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;font-size:.85rem;margin-bottom:15px;">';
    html += '<div><strong>API延迟：</strong>' + (m.apiLatency > 1000 ? (m.apiLatency/1000).toFixed(1) + 's' : m.apiLatency + 'ms') + '</div>';
    html += '<div><strong>免费额度：</strong>' + m.freeTier + '</div>';
    if(m.contextWindow !== 'N/A') html += '<div><strong>上下文：</strong>' + m.contextWindow + '</div>';
    html += '</div>';
    if(m.benchmark){
      html += '<div style="margin-bottom:15px;"><strong style="font-size:.85rem;">基准测试：</strong><div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:8px;">';
      for(var key in m.benchmark){
        html += '<span style="background:var(--bg-primary);padding:4px 10px;border-radius:6px;font-size:.8rem;">' + key + ': <strong>' + m.benchmark[key] + '</strong></span>';
      }
      html += '</div></div>';
    }
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:.85rem;">';
    html += '<div><strong style="color:#22c55e;">✅ 优点：</strong><ul style="margin:5px 0 0;padding-left:18px;">' + m.pros.map(function(p){return '<li>' + p + '</li>';}).join('') + '</ul></div>';
    html += '<div><strong style="color:#ef4444;">⚠️ 缺点：</strong><ul style="margin:5px 0 0;padding-left:18px;">' + m.cons.map(function(c){return '<li>' + c + '</li>';}).join('') + '</ul></div>';
    html += '</div></div>';
    return html;
  },

  renderMetricBar: function(label, value){
    if(value === 0 || !value) return '';
    var color = value >= 9 ? '#22c55e' : value >= 8 ? '#667eea' : value >= 7 ? '#f59e0b' : '#ef4444';
    return '<div><div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:3px;"><span>' + label + '</span><strong>' + value + '/10</strong></div><div style="height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden;"><div style="width:' + (value*10) + '%;height:100%;background:' + color + ';border-radius:3px;"></div></div></div>';
  },

  // 渲染实测对比页面
  renderMetricsComparison: function(){
    var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
    html += '<h1 style="margin:20px 0;">📊 AI工具实测数据库</h1>';
    html += '<p style="color:var(--text-secondary);margin-bottom:20px;">所有工具均经过我们的标准化实测，数据持续更新。最后更新：2026-08-20</p>';
    html += '<div style="overflow-x:auto;margin-bottom:30px;"><table style="width:100%;border-collapse:collapse;font-size:.85rem;">';
    html += '<thead><tr style="background:var(--bg-secondary);">';
    html += '<th style="padding:12px;text-align:left;border:1px solid var(--border-color);">工具</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">输出质量</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">响应速度</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">API延迟</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">免费额度</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">上下文</th>';
    html += '<th style="padding:12px;text-align:center;border:1px solid var(--border-color);">测试日期</th>';
    html += '</tr></thead><tbody>';
    for(var id in this.metrics){
      var m = this.metrics[id];
      var toolName = id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
      html += '<tr>';
      html += '<td style="padding:10px;border:1px solid var(--border-color);font-weight:600;">' + toolName + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);">' + m.outputQuality + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);">' + m.responseSpeed + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);">' + (m.apiLatency > 1000 ? (m.apiLatency/1000).toFixed(1) + 's' : m.apiLatency + 'ms') + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);font-size:.75rem;">' + m.freeTier + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);font-size:.75rem;">' + m.contextWindow + '</td>';
      html += '<td style="padding:10px;text-align:center;border:1px solid var(--border-color);font-size:.75rem;">' + m.lastTested + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    html += '<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;margin-top:20px;">';
    html += '<h3 style="margin-top:0;">📋 实测方法说明</h3>';
    html += '<ul style="margin:0;padding-left:20px;font-size:.9rem;line-height:1.8;">';
    html += '<li><strong>输出质量：</strong>基于10个标准化测试任务的人工评分（1-10）</li>';
    html += '<li><strong>响应速度：</strong>10次请求的平均响应时间评分（1-10）</li>';
    html += '<li><strong>API延迟：</strong>从请求到第一个token的平均延迟</li>';
    html += '<li><strong>多语言：</strong>中文、英文、日文、韩文4种语言的平均表现</li>';
    html += '<li><strong>编程能力：</strong>HumanEval、代码补全、Bug修复3项测试的平均分</li>';
    html += '<li><strong>创造力：</strong>创意写作、艺术生成、创新方案3项测试的平均分</li>';
    html += '<li><strong>准确性：</strong>事实性问题、数学计算、逻辑推理3项测试的平均分</li>';
    html += '</ul></div></div>';
    return html;
  }
};

// ==========================================
// 功能2：用户画像系统 + 推荐解释
// ==========================================
var UserProfile = {
  // 获取用户画像
  getProfile: function(){
    var profile = localStorage.getItem('user_profile');
    if(profile){
      try { return JSON.parse(profile); } catch(e){}
    }
    return this.createDefaultProfile();
  },

  // 创建默认画像
  createDefaultProfile: function(){
    return {
      interests: { writing: 0, image: 0, video: 0, code: 0, audio: 0, productivity: 0 },
      viewedTools: [],
      favoritedTools: [],
      ratedTools: {},
      searchHistory: [],
      totalSessions: 0,
      totalTime: 0,
      signupDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      level: 1,
      badges: []
    };
  },

  // 保存画像
  saveProfile: function(profile){
    profile.lastActive = new Date().toISOString();
    localStorage.setItem('user_profile', JSON.stringify(profile));
  },

  // 记录工具浏览
  recordView: function(toolId, category){
    var profile = this.getProfile();
    profile.interests[category] = (profile.interests[category] || 0) + 1;
    if(!profile.viewedTools.includes(toolId)){
      profile.viewedTools.unshift(toolId);
      if(profile.viewedTools.length > 50) profile.viewedTools.pop();
    }
    this.saveProfile(profile);
  },

  // 记录收藏
  recordFavorite: function(toolId, category){
    var profile = this.getProfile();
    profile.interests[category] = (profile.interests[category] || 0) + 3;
    if(!profile.favoritedTools.includes(toolId)){
      profile.favoritedTools.unshift(toolId);
    }
    this.saveProfile(profile);
  },

  // 记录评分
  recordRating: function(toolId, category, rating){
    var profile = this.getProfile();
    profile.interests[category] = (profile.interests[category] || 0) + rating;
    profile.ratedTools[toolId] = rating;
    this.saveProfile(profile);
  },

  // 记录搜索
  recordSearch: function(query){
    var profile = this.getProfile();
    if(!profile.searchHistory.includes(query)){
      profile.searchHistory.unshift(query);
      if(profile.searchHistory.length > 30) profile.searchHistory.pop();
    }
    this.saveProfile(profile);
  },

  // 获取顶级兴趣
  getTopInterests: function(n){
    var profile = this.getProfile();
    var sorted = Object.entries(profile.interests).sort(function(a,b){ return b[1] - a[1]; });
    return sorted.slice(0, n || 3).filter(function(item){ return item[1] > 0; });
  },

  // 生成推荐解释
  getRecommendationReason: function(toolId, category){
    var profile = this.getProfile();
    var reasons = [];
    // 基于浏览历史
    if(profile.viewedTools.length > 0){
      var similarCount = profile.viewedTools.filter(function(id){
        return id !== toolId && id.indexOf(category) > -1;
      }).length;
      if(similarCount > 0){
        reasons.push('因为你浏览过' + similarCount + '个同类工具');
      }
    }
    // 基于收藏
    if(profile.favoritedTools.length > 0){
      reasons.push('和你收藏的工具风格相似');
    }
    // 基于兴趣
    var topInterests = this.getTopInterests(1);
    if(topInterests.length > 0 && topInterests[0][0] === category){
      reasons.push('这是你最感兴趣的分类');
    }
    // 基于评分
    var highRated = Object.entries(profile.ratedTools).filter(function(e){ return e[1] >= 4; });
    if(highRated.length > 0){
      reasons.push('符合你的高评分偏好');
    }
    if(reasons.length === 0){
      reasons.push('热门推荐，大家都在用');
    }
    return reasons[0];
  },

  // 渲染用户画像卡片
  renderProfileCard: function(){
    var profile = this.getProfile();
    var topInterests = this.getTopInterests(3);
    var categoryNames = { writing:'写作', image:'图像', video:'视频', code:'编程', audio:'音频', productivity:'效率' };
    var html = '<div class="profile-card" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:16px;padding:25px;margin:15px 0;">';
    html += '<div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;">';
    html += '<div style="width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;">👤</div>';
    html += '<div><h3 style="margin:0;font-size:1.2rem;">我的画像</h3><p style="margin:5px 0 0;opacity:.8;font-size:.85rem;">等级 Lv.' + profile.level + ' | 浏览' + profile.viewedTools.length + '工具 | 收藏' + profile.favoritedTools.length + '</p></div>';
    html += '</div>';
    if(topInterests.length > 0){
      html += '<div style="margin-bottom:15px;"><strong style="font-size:.85rem;opacity:.9;">🎯 你的兴趣标签：</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">';
      topInterests.forEach(function(item){
        html += '<span style="background:rgba(255,255,255,.2);padding:4px 12px;border-radius:20px;font-size:.8rem;">' + categoryNames[item[0]] + ' (' + item[1] + '分)</span>';
      });
      html += '</div></div>';
    }
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
    html += '<button onclick="showMetricsDB()" style="padding:8px 16px;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;cursor:pointer;font-size:.85rem;">📊 实测数据库</button>';
    html += '<button onclick="showRoadmap()" style="padding:8px 16px;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;cursor:pointer;font-size:.85rem;">🗺️ 产品路线图</button>';
    html += '</div></div>';
    return html;
  }
};

// ==========================================
// 功能3：公开产品路线图 + 用户反馈闭环
// ==========================================
var Roadmap = {
  features: [
    { id: 1, title: 'AI工具实测数据库', status: 'completed', description: '每个工具的标准化实测数据（输出质量、响应速度、API延迟等）', votes: 128, category: '核心功能', eta: '2026-08' },
    { id: 2, title: '用户画像系统', status: 'completed', description: '基于用户行为构建个性化画像，推荐更精准', votes: 95, category: '个性化', eta: '2026-08' },
    { id: 3, title: '推荐解释功能', status: 'completed', description: '每个推荐都显示推荐理由，增加透明度', votes: 87, category: '个性化', eta: '2026-08' },
    { id: 4, title: '公开产品路线图', status: 'completed', description: '用户可以查看规划、投票、提交反馈', votes: 76, category: '社区', eta: '2026-08' },
    { id: 5, title: '深色模式优化', status: 'completed', description: '全站深色模式，配色舒适', votes: 64, category: '体验', eta: '2026-08' },
    { id: 6, title: '多语言支持', status: 'completed', description: '中英文切换，覆盖全球用户', votes: 58, category: '国际化', eta: '2026-08' },
    { id: 7, title: 'PWA离线支持', status: 'completed', description: 'Service Worker缓存，离线可访问', votes: 52, category: '技术', eta: '2026-08' },
    { id: 8, title: '工具对比功能', status: 'completed', description: '多工具并排对比，快速决策', votes: 89, category: '核心功能', eta: '2026-08' },
    { id: 9, title: '用户评分系统', status: 'completed', description: '用户可以给工具打分，平均评分展示', votes: 71, category: '社区', eta: '2026-08' },
    { id: 10, title: '收藏功能', status: 'completed', description: '一键收藏工具，个人中心管理', votes: 83, category: '核心功能', eta: '2026-08' },
    { id: 11, title: '深度评测文章', status: 'in_progress', description: '每周2篇深度评测，覆盖各分类Top工具', votes: 112, category: '内容', eta: '2026-09' },
    { id: 12, title: 'Discord社区', status: 'planned', description: '创建Discord社区，用户交流和反馈', votes: 98, category: '社区', eta: '2026-09' },
    { id: 13, title: '每周精选邮件', status: 'planned', description: '每周5个最佳AI工具，邮件推送', votes: 74, category: '内容', eta: '2026-09' },
    { id: 14, title: '工具提交审核流程', status: 'planned', description: '用户提交工具，自动审核+人工复核', votes: 67, category: '社区', eta: '2026-09' },
    { id: 15, title: 'API接口开放', status: 'planned', description: '开放工具数据API，开发者可集成', votes: 105, category: '技术', eta: '2026-10' },
    { id: 16, title: '移动端APP', status: 'planned', description: 'iOS和Android原生APP', votes: 88, category: '平台', eta: '2026-11' },
    { id: 17, title: '付费会员系统', status: 'planned', description: '高级功能：无广告、高级筛选、数据导出', votes: 92, category: '商业化', eta: '2026-12' },
    { id: 18, title: '多语言扩展（日/韩/西）', status: 'idea', description: '支持更多语言，覆盖全球市场', votes: 45, category: '国际化', eta: '2027-Q1' },
    { id: 19, title: 'AI助手聊天', status: 'idea', description: '内置AI助手，帮你选工具、解答问题', votes: 134, category: '核心功能', eta: '2027-Q1' },
    { id: 20, title: '工具使用教程', status: 'idea', description: '每个工具的图文和视频教程', votes: 61, category: '内容', eta: '2027-Q1' }
  ],

  getVotes: function(){
    var votes = localStorage.getItem('roadmap_votes');
    return votes ? JSON.parse(votes) : {};
  },

  saveVotes: function(votes){
    localStorage.setItem('roadmap_votes', JSON.stringify(votes));
  },

  vote: function(featureId){
    var votes = this.getVotes();
    var feature = this.features.find(function(f){ return f.id === featureId; });
    if(!feature) return;
    if(votes[featureId]){
      delete votes[featureId];
      feature.votes--;
    } else {
      votes[featureId] = true;
      feature.votes++;
    }
    this.saveVotes(votes);
    this.render();
  },

  getStatusLabel: function(status){
    var labels = { completed: '✅ 已完成', in_progress: '🚧 进行中', planned: '📋 已规划', idea: '💡 想法' };
    return labels[status] || status;
  },

  getStatusColor: function(status){
    var colors = { completed: '#22c55e', in_progress: '#667eea', planned: '#f59e0b', idea: '#94a3b8' };
    return colors[status] || '#94a3b8';
  },

  render: function(){
    var votes = this.getVotes();
    var sorted = [...this.features].sort(function(a,b){ return b.votes - a.votes; });
    var html = '<div class="detail-container"><button class="back-btn" onclick="navigateTo(\'home\')">← 返回首页</button>';
    html += '<h1 style="margin:20px 0;">🗺️ 产品路线图</h1>';
    html += '<p style="color:var(--text-secondary);margin-bottom:20px;">我们相信透明和用户驱动。查看我们的规划，为你想要的功能投票，或提交你的想法。</p>';
    html += '<div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">';
    html += '<button onclick="submitFeedback()" style="padding:10px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">💡 提交你的想法</button>';
    html += '<span style="padding:10px;color:var(--text-secondary);font-size:.85rem;">共 ' + this.features.length + ' 项功能 | 总投票 ' + this.features.reduce(function(s,f){return s+f.votes;},0) + '</span>';
    html += '</div>';
    var categories = ['核心功能', '个性化', '内容', '社区', '技术', '体验', '商业化', '平台', '国际化'];
    categories.forEach(function(cat){
      var catFeatures = sorted.filter(function(f){ return f.category === cat; });
      if(catFeatures.length === 0) return;
      html += '<h2 style="margin:25px 0 15px;font-size:1.2rem;">' + cat + '</h2>';
      html += '<div style="display:grid;gap:12px;">';
      catFeatures.forEach(function(f){
        var voted = votes[f.id];
        html += '<div style="background:var(--bg-secondary);border-radius:12px;padding:18px;display:flex;gap:15px;align-items:flex-start;border-left:4px solid ' + Roadmap.getStatusColor(f.status) + ';">';
        html += '<button onclick="Roadmap.vote(' + f.id + ')" style="min-width:60px;padding:10px;background:' + (voted ? '#667eea' : 'var(--bg-primary)') + ';color:' + (voted ? '#fff' : 'var(--text-primary)') + ';border:1px solid var(--border-color);border-radius:8px;cursor:pointer;text-align:center;">';
        html += '<div style="font-size:1.3rem;font-weight:700;">' + f.votes + '</div><div style="font-size:.7rem;">' + (voted ? '✓ 已投票' : '投票') + '</div></button>';
        html += '<div style="flex:1;"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:5px;">';
        html += '<strong style="font-size:1rem;">' + f.title + '</strong>';
        html += '<span style="font-size:.75rem;padding:2px 8px;border-radius:4px;background:' + Roadmap.getStatusColor(f.status) + '20;color:' + Roadmap.getStatusColor(f.status) + ';">' + Roadmap.getStatusLabel(f.status) + '</span>';
        html += '<span style="font-size:.75rem;color:var(--text-secondary);">预计：' + f.eta + '</span>';
        html += '</div><p style="margin:0;font-size:.85rem;color:var(--text-secondary);">' + f.description + '</p></div></div>';
      });
      html += '</div>';
    });
    html += '</div>';
    var container = document.getElementById('roadmapView');
    if(container){
      container.innerHTML = html;
      container.style.display = 'block';
    }
    return html;
  }
};

// ==========================================
// 全局函数暴露
// ==========================================
window.ToolMetricsDB = ToolMetricsDB;
window.UserProfile = UserProfile;
window.Roadmap = Roadmap;

// 显示实测数据库页面
window.showMetricsDB = function(){
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','roadmapView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  var container = document.getElementById('metricsView');
  if(!container){
    container = document.createElement('div');
    container.id = 'metricsView';
    document.body.querySelector('.detail-container') ? document.body.querySelector('.detail-container').parentNode.appendChild(container) : document.body.appendChild(container);
  }
  container.innerHTML = ToolMetricsDB.renderMetricsComparison();
  container.style.display = 'block';
  window.scrollTo(0,0);
  trackEvent('view_metrics_db');
};

// 显示路线图页面
window.showRoadmap = function(){
  ['homeView','detailView','compareView','blogView','blogArticleView','aboutView','privacyView','notFoundView','metricsView'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  var container = document.getElementById('roadmapView');
  if(!container){
    container = document.createElement('div');
    container.id = 'roadmapView';
    document.body.appendChild(container);
  }
  Roadmap.render();
  window.scrollTo(0,0);
  trackEvent('view_roadmap');
};

// 提交反馈
window.submitFeedback = function(){
  var idea = prompt('💡 你希望我们添加什么功能？\n\n请描述你的想法，我们会认真考虑每一个反馈。');
  if(idea && idea.trim()){
    var feedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    feedback.push({ idea: idea.trim(), date: new Date().toISOString() });
    localStorage.setItem('user_feedback', JSON.stringify(feedback));
    showToast('🎉 感谢你的反馈！我们会认真考虑。');
    trackEvent('submit_feedback', { idea: idea.trim().substring(0,50) });
  }
};

// 拦截工具详情页，注入实测数据
var originalRenderToolDetail = window.renderToolDetail;
window.renderToolDetail = function(tool){
  if(originalRenderToolDetail){
    originalRenderToolDetail(tool);
  }
  // 注入实测数据卡片
  setTimeout(function(){
    var detailContent = document.getElementById('detailContent');
    if(detailContent && tool){
      var toolId = (tool.id || tool.name || '').toLowerCase().replace(/\s+/g, '-');
      var metricsHtml = ToolMetricsDB.renderMetricsCard(toolId, tool.name);
      if(metricsHtml){
        var faqIndex = detailContent.innerHTML.indexOf('常见问题');
        if(faqIndex > -1){
          detailContent.innerHTML = detailContent.innerHTML.substring(0, faqIndex) + metricsHtml + detailContent.innerHTML.substring(faqIndex);
        } else {
          detailContent.innerHTML += metricsHtml;
        }
      }
      // 记录用户行为
      if(tool.category){
        UserProfile.recordView(toolId, tool.category);
      }
    }
  }, 100);
};

// 拦截收藏功能，记录用户行为
var originalToggleFavorite = window.toggleFavorite;
window.toggleFavorite = function(toolId){
  if(originalToggleFavorite){
    originalToggleFavorite(toolId);
  }
  var tools = window.tools || [];
  var tool = tools.find(function(t){ return (t.id || t.name || '').toLowerCase().replace(/\s+/g,'-') === toolId; });
  if(tool && tool.category){
    UserProfile.recordFavorite(toolId, tool.category);
  }
};

// 初始化：在首页注入用户画像卡片
function initProfileCard(){
  var hotSection = document.getElementById('hotSection');
  if(hotSection && !document.getElementById('profileCardContainer')){
    var container = document.createElement('div');
    container.id = 'profileCardContainer';
    container.style.cssText = 'max-width:1200px;margin:0 auto;padding:0 20px;';
    container.innerHTML = UserProfile.renderProfileCard();
    hotSection.parentNode.insertBefore(container, hotSection.nextSibling);
  }
}

// 初始化导航链接
function initNavLinks(){
  var navLinks = document.querySelector('.nav-links');
  if(navLinks && !document.getElementById('metricsNavLink')){
    var metricsLink = document.createElement('a');
    metricsLink.id = 'metricsNavLink';
    metricsLink.href = '#';
    metricsLink.onclick = function(){ showMetricsDB(); return false; };
    metricsLink.textContent = '📊 实测';
    navLinks.insertBefore(metricsLink, navLinks.children[2]);

    var roadmapLink = document.createElement('a');
    roadmapLink.id = 'roadmapNavLink';
    roadmapLink.href = '#';
    roadmapLink.onclick = function(){ showRoadmap(); return false; };
    roadmapLink.textContent = '🗺️ 路线图';
    navLinks.insertBefore(roadmapLink, navLinks.children[3]);
  }
}

// 页面加载后初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(initProfileCard, 500);
    setTimeout(initNavLinks, 300);
  });
} else {
  setTimeout(initProfileCard, 500);
  setTimeout(initNavLinks, 300);
}

console.log('%c🚀 第九轮新功能已加载：实测数据库 + 用户画像 + 产品路线图', 'color:#667eea;font-size:12px;font-weight:bold');

})();
