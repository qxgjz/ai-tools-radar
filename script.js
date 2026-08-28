// AI 工具数据
const tools = [
    {
        name: "ChatGPT",
        icon: "🤖",
        desc: "OpenAI 开发的强大对话式 AI，支持文本生成、代码编写、问题解答等多种功能。",
        category: "writing",
        tags: ["对话", "写作", "通用"],
        link: "https://chat.openai.com"
    },
    {
        name: "Claude",
        icon: "📝",
        desc: "Anthropic 推出的 AI 助手，擅长长文本处理、写作和分析，支持超长上下文。",
        category: "writing",
        tags: ["对话", "写作", "长文本"],
        link: "https://claude.ai"
    },
    {
        name: "Midjourney",
        icon: "🎨",
        desc: "最流行的 AI 图像生成工具，通过文字描述生成高质量艺术图片和设计素材。",
        category: "image",
        tags: ["图像生成", "艺术", "设计"],
        link: "https://www.midjourney.com"
    },
    {
        name: "DALL·E 3",
        icon: "🖼️",
        desc: "OpenAI 的图像生成模型，能精准理解文字描述，生成细节丰富的高质量图片。",
        category: "image",
        tags: ["图像生成", "OpenAI"],
        link: "https://openai.com/dall-e-3"
    },
    {
        name: "Stable Diffusion",
        icon: "🌅",
        desc: "开源的 AI 图像生成模型，可本地部署，支持自定义训练和丰富的插件生态。",
        category: "image",
        tags: ["开源", "图像生成", "本地部署"],
        link: "https://stability.ai"
    },
    {
        name: "Runway",
        icon: "🎬",
        desc: "专业的 AI 视频生成和编辑工具，支持文生视频、图生视频、视频风格转换等。",
        category: "video",
        tags: ["视频生成", "视频编辑"],
        link: "https://runwayml.com"
    },
    {
        name: "Sora",
        icon: "📹",
        desc: "OpenAI 的文生视频模型，能根据文字描述生成长达一分钟的高质量视频。",
        category: "video",
        tags: ["视频生成", "OpenAI"],
        link: "https://openai.com/sora"
    },
    {
        name: "Pika",
        icon: "✨",
        desc: "简单易用的 AI 视频生成工具，支持文字、图片转视频，以及视频风格转换。",
        category: "video",
        tags: ["视频生成", "易用"],
        link: "https://pika.art"
    },
    {
        name: "GitHub Copilot",
        icon: "💻",
        desc: "GitHub 与 OpenAI 合作的 AI 编程助手，实时代码补全，支持多种编程语言和 IDE。",
        category: "code",
        tags: ["代码补全", "编程", "IDE插件"],
        link: "https://github.com/copilot"
    },
    {
        name: "Cursor",
        icon: "⌨️",
        desc: "AI 原生代码编辑器，基于 VS Code 构建，支持智能代码生成、重构和对话式编程。",
        category: "code",
        tags: ["代码编辑器", "AI编程"],
        link: "https://cursor.sh"
    },
    {
        name: "CodeLlama",
        icon: "🦙",
        desc: "Meta 开源的代码大模型，支持代码生成、补全和调试，可本地部署。",
        category: "code",
        tags: ["开源", "代码生成", "本地部署"],
        link: "https://ai.meta.com/research/publications/codellama-open-foundation-models-for-code"
    },
    {
        name: "ElevenLabs",
        icon: "🎙️",
        desc: "最先进的 AI 语音生成平台，支持文本转语音、声音克隆和多语言配音。",
        category: "audio",
        tags: ["语音合成", "声音克隆"],
        link: "https://elevenlabs.io"
    },
    {
        name: "Whisper",
        icon: "🎧",
        desc: "OpenAI 开源的语音识别模型，支持多语言语音转文字，准确率高，可本地部署。",
        category: "audio",
        tags: ["语音识别", "开源", "转文字"],
        link: "https://openai.com/research/whisper"
    },
    {
        name: "Suno",
        icon: "🎵",
        desc: "AI 音乐生成工具，输入文字描述即可生成完整歌曲，支持多种风格和语言。",
        category: "audio",
        tags: ["音乐生成", "歌曲创作"],
        link: "https://suno.com"
    },
    {
        name: "Notion AI",
        icon: "📚",
        desc: "集成在 Notion 中的 AI 助手，支持写作、总结、翻译、头脑风暴等多种功能。",
        category: "productivity",
        tags: ["笔记", "写作", "效率"],
        link: "https://www.notion.so/product/ai"
    },
    {
        name: "Gamma",
        icon: "📊",
        desc: "AI 演示文稿生成工具，输入主题即可自动生成精美的 PPT，支持多种模板和风格。",
        category: "productivity",
        tags: ["PPT", "演示文稿"],
        link: "https://gamma.app"
    },
    {
        name: "Perplexity",
        icon: "🔍",
        desc: "AI 搜索引擎，结合大语言模型和实时网络搜索，给出带引用来源的准确答案。",
        category: "productivity",
        tags: ["搜索", "问答", "研究"],
        link: "https://www.perplexity.ai"
    },
    {
        name: "Grammarly",
        icon: "✏️",
        desc: "AI 写作助手，实时检查语法、拼写、语气和风格，支持英文写作优化和润色。",
        category: "writing",
        tags: ["语法检查", "写作润色"],
        link: "https://www.grammarly.com"
    },
    {
        name: "Remove.bg",
        icon: "✂️",
        desc: "AI 背景移除工具，一键去除图片背景，支持批量处理和高清输出。",
        category: "image",
        tags: ["抠图", "背景移除"],
        link: "https://www.remove.bg"
    },
    {
        name: "Otter.ai",
        icon: "📝",
        desc: "AI 会议记录工具，实时转录会议内容，生成带说话人识别的文字记录和摘要。",
        category: "productivity",
        tags: ["会议记录", "转录", "效率"],
        link: "https://otter.ai"
    }
];

let currentCategory = 'all';
let currentSearch = '';

// 渲染工具卡片
function renderTools(toolsToRender) {
    const grid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    
    if (toolsToRender.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    grid.innerHTML = toolsToRender.map(tool => `
        <div class="tool-card">
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-desc">${tool.desc}</p>
            <div class="tool-tags">
                ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-link">
                访问官网 →
            </a>
        </div>
    `).join('');
}

// 过滤工具
function filterTools() {
    let filtered = tools;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }
    
    // 按搜索词过滤
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(searchLower) ||
            tool.desc.toLowerCase().includes(searchLower) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    renderTools(filtered);
}

// 搜索
function searchTools() {
    currentSearch = document.getElementById('searchInput').value.trim();
    filterTools();
}

// 分类筛选
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        filterTools();
    });
});

// 回车搜索
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchTools();
    }
});

// 实时搜索
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    filterTools();
});

// 初始化
renderTools(tools);
