// AI 工具数据
const tools = [
    // 写作类
    { name: "ChatGPT", icon: "🤖", desc: "OpenAI 开发的强大对话式 AI，支持文本生成、代码编写、问题解答等多种功能。", category: "writing", tags: ["对话", "写作", "通用"], link: "https://chat.openai.com" },
    { name: "Claude", icon: "📝", desc: "Anthropic 推出的 AI 助手，擅长长文本处理、写作和分析，支持超长上下文。", category: "writing", tags: ["对话", "写作", "长文本"], link: "https://claude.ai" },
    { name: "Gemini", icon: "💎", desc: "Google 推出的多模态 AI 模型，支持文本、图像、视频、音频的理解和生成。", category: "writing", tags: ["多模态", "Google", "对话"], link: "https://gemini.google.com" },
    { name: "Grammarly", icon: "✏️", desc: "AI 写作助手，实时检查语法、拼写、语气和风格，支持英文写作优化和润色。", category: "writing", tags: ["语法检查", "写作润色"], link: "https://www.grammarly.com" },
    { name: "Jasper", icon: "📋", desc: "专业的 AI 营销文案生成工具，支持博客文章、广告文案、社交媒体内容等多种场景。", category: "writing", tags: ["营销文案", "内容创作"], link: "https://www.jasper.ai" },
    { name: "Notion AI", icon: "📚", desc: "集成在 Notion 中的 AI 助手，支持写作、总结、翻译、头脑风暴等多种功能。", category: "writing", tags: ["笔记", "写作", "效率"], link: "https://www.notion.so/product/ai" },
    
    // 图像类
    { name: "Midjourney", icon: "🎨", desc: "最流行的 AI 图像生成工具，通过文字描述生成高质量艺术图片和设计素材。", category: "image", tags: ["图像生成", "艺术", "设计"], link: "https://www.midjourney.com" },
    { name: "DALL·E 3", icon: "🖼️", desc: "OpenAI 的图像生成模型，能精准理解文字描述，生成细节丰富的高质量图片。", category: "image", tags: ["图像生成", "OpenAI"], link: "https://openai.com/dall-e-3" },
    { name: "Stable Diffusion", icon: "🌅", desc: "开源的 AI 图像生成模型，可本地部署，支持自定义训练和丰富的插件生态。", category: "image", tags: ["开源", "图像生成", "本地部署"], link: "https://stability.ai" },
    { name: "Remove.bg", icon: "✂️", desc: "AI 背景移除工具，一键去除图片背景，支持批量处理和高清输出。", category: "image", tags: ["抠图", "背景移除"], link: "https://www.remove.bg" },
    { name: "Canva AI", icon: "🎯", desc: "在线设计平台 Canva 的 AI 功能，支持智能设计、图像生成、文字排版等。", category: "image", tags: ["设计", "图像生成"], link: "https://www.canva.com" },
    { name: "Adobe Firefly", icon: "🔥", desc: "Adobe 推出的创意生成式 AI，集成在 Photoshop、Illustrator 等软件中。", category: "image", tags: ["Adobe", "创意设计"], link: "https://firefly.adobe.com" },
    
    // 视频类
    { name: "Runway", icon: "🎬", desc: "专业的 AI 视频生成和编辑工具，支持文生视频、图生视频、视频风格转换等。", category: "video", tags: ["视频生成", "视频编辑"], link: "https://runwayml.com" },
    { name: "Sora", icon: "📹", desc: "OpenAI 的文生视频模型，能根据文字描述生成长达一分钟的高质量视频。", category: "video", tags: ["视频生成", "OpenAI"], link: "https://openai.com/sora" },
    { name: "Pika", icon: "✨", desc: "简单易用的 AI 视频生成工具，支持文字、图片转视频，以及视频风格转换。", category: "video", tags: ["视频生成", "易用"], link: "https://pika.art" },
    { name: "HeyGen", icon: "🧑‍💼", desc: "AI 数字人视频生成平台，支持虚拟主播、多语言配音、口型同步等功能。", category: "video", tags: ["数字人", "虚拟主播"], link: "https://www.heygen.com" },
    { name: "CapCut", icon: "🎞️", desc: "字节跳动推出的视频编辑工具，内置 AI 字幕、AI 特效、智能剪辑等功能。", category: "video", tags: ["视频编辑", "AI字幕"], link: "https://www.capcut.com" },
    
    // 编程类
    { name: "GitHub Copilot", icon: "💻", desc: "GitHub 与 OpenAI 合作的 AI 编程助手，实时代码补全，支持多种编程语言和 IDE。", category: "code", tags: ["代码补全", "编程", "IDE插件"], link: "https://github.com/copilot" },
    { name: "Cursor", icon: "⌨️", desc: "AI 原生代码编辑器，基于 VS Code 构建，支持智能代码生成、重构和对话式编程。", category: "code", tags: ["代码编辑器", "AI编程"], link: "https://cursor.sh" },
    { name: "CodeLlama", icon: "🦙", desc: "Meta 开源的代码大模型，支持代码生成、补全和调试，可本地部署。", category: "code", tags: ["开源", "代码生成", "本地部署"], link: "https://ai.meta.com/research/publications/codellama-open-foundation-models-for-code" },
    { name: "Tabnine", icon: "📝", desc: "AI 代码补全工具，支持多种 IDE 和编程语言，注重隐私保护，可本地部署。", category: "code", tags: ["代码补全", "隐私"], link: "https://www.tabnine.com" },
    { name: "Replit", icon: "🔄", desc: "在线代码编辑器和部署平台，内置 AI 助手，支持多种语言，一键部署应用。", category: "code", tags: ["在线IDE", "部署"], link: "https://replit.com" },
    
    // 音频类
    { name: "ElevenLabs", icon: "🎙️", desc: "最先进的 AI 语音生成平台，支持文本转语音、声音克隆和多语言配音。", category: "audio", tags: ["语音合成", "声音克隆"], link: "https://elevenlabs.io" },
    { name: "Whisper", icon: "🎧", desc: "OpenAI 开源的语音识别模型，支持多语言语音转文字，准确率高，可本地部署。", category: "audio", tags: ["语音识别", "开源", "转文字"], link: "https://openai.com/research/whisper" },
    { name: "Suno", icon: "🎵", desc: "AI 音乐生成工具，输入文字描述即可生成完整歌曲，支持多种风格和语言。", category: "audio", tags: ["音乐生成", "歌曲创作"], link: "https://suno.com" },
    { name: "Udio", icon: "🎸", desc: "高质量 AI 音乐生成平台，支持生成带人声的完整歌曲，音质出色。", category: "audio", tags: ["音乐生成", "高质量"], link: "https://www.udio.com" },
    { name: "Descript", icon: "🎚️", desc: "AI 音频和视频编辑工具，支持文字编辑音频、AI 语音克隆、自动去除填充词。", category: "audio", tags: ["音频编辑", "播客"], link: "https://www.descript.com" },
    
    // 效率类
    { name: "Perplexity", icon: "🔍", desc: "AI 搜索引擎，结合大语言模型和实时网络搜索，给出带引用来源的准确答案。", category: "productivity", tags: ["搜索", "问答", "研究"], link: "https://www.perplexity.ai" },
    { name: "Gamma", icon: "📊", desc: "AI 演示文稿生成工具，输入主题即可自动生成精美的 PPT，支持多种模板和风格。", category: "productivity", tags: ["PPT", "演示文稿"], link: "https://gamma.app" },
    { name: "Otter.ai", icon: "📝", desc: "AI 会议记录工具，实时转录会议内容，生成带说话人识别的文字记录和摘要。", category: "productivity", tags: ["会议记录", "转录", "效率"], link: "https://otter.ai" },
    { name: "Tidio", icon: "💬", desc: "AI 客服聊天机器人平台，支持自动回复、客户管理、多渠道集成等功能。", category: "productivity", tags: ["客服", "聊天机器人"], link: "https://www.tidio.com" },
    { name: "Zapier AI", icon: "⚡", desc: "自动化工作流平台的 AI 功能，支持用自然语言创建自动化流程，连接数千款应用。", category: "productivity", tags: ["自动化", "工作流"], link: "https://zapier.com" },
    { name: "Mem", icon: "🧠", desc: "AI 驱动的笔记工具，自动整理和关联笔记内容，支持智能搜索和知识管理。", category: "productivity", tags: ["笔记", "知识管理"], link: "https://get.mem.ai" }
];

// 分类配置
const categories = [
    { id: "all", name: "全部", icon: "🌐" },
    { id: "writing", name: "写作", icon: "✍️" },
    { id: "image", name: "图像", icon: "🎨" },
    { id: "video", name: "视频", icon: "🎬" },
    { id: "code", name: "编程", icon: "💻" },
    { id: "audio", name: "音频", icon: "🎵" },
    { id: "productivity", name: "效率", icon: "⚡" }
];

// 状态
let currentCategory = 'all';
let currentSearch = '';
let showFavoritesOnly = false;
let currentView = 'grid';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStats();
    initCategoryFilters();
    initViewToggle();
    initBackToTop();
    renderTools();
    updateFavCount();
    document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('zh-CN');
});

// 主题切换
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        document.getElementById('themeToggle').textContent = '☀️';
    }
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// 统计数据
function initStats() {
    document.getElementById('totalTools').textContent = tools.length;
    document.getElementById('totalCategories').textContent = categories.length - 1;
    
    // 访问计数
    let visits = parseInt(localStorage.getItem('visitCount') || '0');
    visits++;
    localStorage.setItem('visitCount', visits.toString());
    document.getElementById('visitCount').textContent = visits.toLocaleString();
}

// 分类筛选按钮
function initCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">${cat.icon} ${cat.name}</button>`
    ).join('');
    
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            showFavoritesOnly = false;
            document.getElementById('favToggle').classList.remove('active');
            renderTools();
        });
    });
}

// 视图切换
function initViewToggle() {
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    
    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        document.getElementById('toolsGrid').classList.remove('list-view');
    });
    
    listBtn.addEventListener('click', () => {
        currentView = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        document.getElementById('toolsGrid').classList.add('list-view');
    });
}

// 回到顶部
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 收藏功能
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(name) {
    let favorites = getFavorites();
    if (favorites.includes(name)) {
        favorites = favorites.filter(f => f !== name);
    } else {
        favorites.push(name);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavCount();
    renderTools();
}

function updateFavCount() {
    document.getElementById('favCount').textContent = getFavorites().length;
}

// 收藏切换按钮
document.getElementById('favToggle').addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    document.getElementById('favToggle').classList.toggle('active', showFavoritesOnly);
    if (showFavoritesOnly) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        currentCategory = 'all';
    }
    renderTools();
});

// 渲染工具卡片
function renderTools() {
    const grid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    const favorites = getFavorites();
    
    let filtered = tools;
    
    // 收藏筛选
    if (showFavoritesOnly) {
        filtered = filtered.filter(tool => favorites.includes(tool.name));
    }
    // 分类筛选
    else if (currentCategory !== 'all') {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }
    
    // 搜索筛选
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(searchLower) ||
            tool.desc.toLowerCase().includes(searchLower) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    // 更新结果计数
    document.getElementById('resultCount').textContent = `共 ${filtered.length} 个工具`;
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    grid.innerHTML = filtered.map((tool, index) => {
        const isFav = favorites.includes(tool.name);
        const catName = categories.find(c => c.id === tool.category)?.name || '';
        return `
        <div class="tool-card" style="animation-delay: ${index * 0.05}s">
            <button class="tool-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${tool.name}')" title="${isFav ? '取消收藏' : '收藏'}">${isFav ? '⭐' : '☆'}</button>
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-content">
                <h3 class="tool-name">${tool.name}</h3>
                <p class="tool-desc">${tool.desc}</p>
                <div class="tool-tags">
                    ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="tool-footer">
                    <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-link" onclick="event.stopPropagation()">访问官网 →</a>
                    <span class="tool-category">${catName}</span>
                </div>
            </div>
        </div>
    `}).join('');
}

// 搜索
function searchTools() {
    currentSearch = document.getElementById('searchInput').value.trim();
    renderTools();
}

function clearFilters() {
    currentSearch = '';
    currentCategory = 'all';
    showFavoritesOnly = false;
    document.getElementById('searchInput').value = '';
    document.getElementById('favToggle').classList.remove('active');
    document.querySelectorAll('.filter-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
    renderTools();
}

// 回车搜索
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchTools();
});

// 实时搜索
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderTools();
});
