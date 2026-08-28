// ========== AI 工具数据 ==========
const tools = [
    { name: "ChatGPT", icon: "🤖", desc: "OpenAI 开发的强大对话式 AI，支持文本生成、代码编写、问题解答等多种功能。", category: "writing", tags: ["对话", "写作", "通用"], link: "https://chat.openai.com", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["GPT-4o", "代码解释器", "DALL·E 3", "语音对话"] },
    { name: "Claude", icon: "📝", desc: "Anthropic 推出的 AI 助手，擅长长文本处理、写作和分析，支持 200K 超长上下文。", category: "writing", tags: ["对话", "写作", "长文本"], link: "https://claude.ai", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["Claude 3.5 Sonnet", "200K上下文", "文件分析", "代码生成"] },
    { name: "Gemini", icon: "💎", desc: "Google 推出的多模态 AI 模型，支持文本、图像、视频、音频的理解和生成。", category: "writing", tags: ["多模态", "Google", "对话"], link: "https://gemini.google.com", price: "免费/付费 $19.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["Gemini 1.5 Pro", "多模态", "Google集成", "实时搜索"] },
    { name: "Grammarly", icon: "✏️", desc: "AI 写作助手，实时检查语法、拼写、语气和风格，支持英文写作优化和润色。", category: "writing", tags: ["语法检查", "写作润色"], link: "https://www.grammarly.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web", "Chrome扩展", "Desktop", "iOS"], features: ["语法检查", "风格建议", "抄袭检测", "语气调整"] },
    { name: "Jasper", icon: "📋", desc: "专业的 AI 营销文案生成工具，支持博客文章、广告文案、社交媒体内容等 50+ 模板。", category: "writing", tags: ["营销文案", "内容创作"], link: "https://www.jasper.ai", price: "付费 $49/月起", priceType: "paid", platforms: ["Web"], features: ["50+模板", "品牌声音", "SEO模式", "团队协作"] },
    { name: "Notion AI", icon: "📚", desc: "集成在 Notion 中的 AI 助手，支持写作、总结、翻译、头脑风暴等多种功能。", category: "writing", tags: ["笔记", "写作", "效率"], link: "https://www.notion.so/product/ai", price: "付费 $8/月起", priceType: "paid", platforms: ["Web", "Desktop", "iOS", "Android"], features: ["写作辅助", "文档总结", "翻译", "头脑风暴"] },
    { name: "Writesonic", icon: "✍️", desc: "AI 写作平台，生成文章、广告、产品描述，支持 SEO 优化和多语言内容。", category: "writing", tags: ["内容创作", "SEO"], link: "https://writesonic.com", price: "免费/付费 $12.67/月", priceType: "freemium", platforms: ["Web"], features: ["文章生成", "SEO优化", "多语言", "Chatsonic"] },
    { name: "Copy.ai", icon: "📄", desc: "AI 文案生成工具，专为营销团队设计，支持广告、邮件、社交媒体内容自动化。", category: "writing", tags: ["营销文案", "自动化"], link: "https://www.copy.ai", price: "免费/付费 $36/月", priceType: "freemium", platforms: ["Web"], features: ["营销文案", "工作流自动化", "团队协作", "90+工具"] },
    { name: "Jenni.ai", icon: "🖋️", desc: "AI 写作助手，帮助学术写作、研究组织和逻辑生成，支持实时自动补全。", category: "writing", tags: ["学术写作", "自动补全"], link: "https://jenni.ai", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["自动补全", "学术写作", "引用生成", "PDF分析"] },
    { name: "Sudowrite", icon: "📖", desc: "专为小说作家设计的 AI 写作工具，通过自然语言描述生成和编辑小说、故事。", category: "writing", tags: ["小说创作", "创意写作"], link: "https://www.sudowrite.com", price: "付费 $12/月起", priceType: "paid", platforms: ["Web"], features: ["小说生成", "角色发展", "情节建议", "风格模仿"] },
    { name: "HyperWrite", icon: "⌨️", desc: "AI 写作伴侣和文本生成器，支持邮件、文档、社交媒体内容的智能写作。", category: "writing", tags: ["写作助手", "文本生成"], link: "https://hyperwriteai.com", price: "免费/付费 $19.99/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["写作助手", "自动补全", "文档生成", "浏览器助手"] },
    { name: "DeepL", icon: "🌐", desc: "最准确的 AI 翻译工具，支持 30+ 语言，翻译质量远超传统机器翻译。", category: "writing", tags: ["翻译", "多语言"], link: "https://www.deepl.com/translator", price: "免费/付费 €5.99/月", priceType: "freemium", platforms: ["Web", "Desktop", "iOS", "Android"], features: ["高质量翻译", "文档翻译", "术语库", "API"] },
    { name: "QuillBot", icon: "🔄", desc: "AI 改写和润色工具，支持同义替换、语法检查、摘要生成，提升写作质量。", category: "writing", tags: ["改写", "润色", "摘要"], link: "https://quillbot.com", price: "免费/付费 $9.95/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["改写", "语法检查", "摘要生成", "翻译"] },
    { name: "Rytr", icon: "✒️", desc: "经济实惠的 AI 写作工具，40+ 使用场景，20+ 语气，30+ 语言支持。", category: "writing", tags: ["内容创作", "多语言"], link: "https://rytr.me", price: "免费/付费 $9/月", priceType: "freemium", platforms: ["Web"], features: ["40+场景", "20+语气", "30+语言", "SEO分析"] },
    { name: "Anyword", icon: "🎯", desc: "AI 营销文案平台，数据驱动的文案生成，预测文案表现，提升转化率。", category: "writing", tags: ["营销", "转化率"], link: "https://anyword.com", price: "付费 $24/月起", priceType: "paid", platforms: ["Web"], features: ["文案预测", "A/B测试", "品牌声音", "多平台"] },
    { name: "Phrasly", icon: "💬", desc: "AI 文本人性化工具，去除 AI 写作痕迹，让文本更自然，绕过 AI 检测。", category: "writing", tags: ["人性化", "AI检测"], link: "https://phrasly.ai", price: "付费 $9.99/月起", priceType: "paid", platforms: ["Web"], features: ["AI检测绕过", "文本人性化", "语法检查", "多语言"] },
    { name: "Originality.ai", icon: "🔍", desc: "AI 内容检测和抄袭检查工具，帮助识别 AI 生成内容，确保内容原创性。", category: "writing", tags: ["AI检测", "原创性"], link: "https://originality.ai", price: "付费 $14.95/月", priceType: "paid", platforms: ["Web", "Chrome扩展"], features: ["AI检测", "抄袭检测", "团队管理", "API"] },
    { name: "Moonbeam", icon: "🌙", desc: "AI 长文写作工具，从想法到完整文章，支持博客、论文、故事等长内容创作。", category: "writing", tags: ["长文", "博客"], link: "https://www.gomoonbeam.com", price: "免费/付费 $15/月", priceType: "freemium", platforms: ["Web"], features: ["长文生成", "博客写作", "大纲生成", "风格定制"] },
    { name: "Copysmith", icon: "📝", desc: "AI 驱动的写作助手，专注电商和营销文案，支持批量生成产品描述。", category: "writing", tags: ["电商", "产品描述"], link: "https://www.copysmith.ai", price: "付费 $19/月起", priceType: "paid", platforms: ["Web"], features: ["产品描述", "批量生成", "电商集成", "品牌声音"] },
    { name: "Writer.com", icon: "✍️", desc: "企业级 AI 写作平台，统一品牌语气，确保内容一致性，适合大型团队。", category: "writing", tags: ["企业", "品牌"], link: "https://writer.com", price: "付费 定制报价", priceType: "paid", platforms: ["Web", "API"], features: ["品牌声音", "内容治理", "团队协作", "API集成"] },
    { name: "Midjourney", icon: "🎨", desc: "最流行的 AI 图像生成工具，通过文字描述生成高质量艺术图片和设计素材。", category: "image", tags: ["图像生成", "艺术", "设计"], link: "https://www.midjourney.com", price: "付费 $10/月起", priceType: "paid", platforms: ["Web", "Discord"], features: ["V6模型", "高分辨率", "风格多样", "社区灵感"] },
    { name: "DALL·E 3", icon: "🖼️", desc: "OpenAI 的图像生成模型，能精准理解文字描述，生成细节丰富的高质量图片。", category: "image", tags: ["图像生成", "OpenAI"], link: "https://openai.com/dall-e-3", price: "付费 $20/月(ChatGPT Plus)", priceType: "paid", platforms: ["Web", "API"], features: ["精准理解", "高质量", "ChatGPT集成", "API"] },
    { name: "Stable Diffusion", icon: "🌅", desc: "开源的 AI 图像生成模型，可本地部署，支持自定义训练和丰富的插件生态。", category: "image", tags: ["开源", "图像生成", "本地部署"], link: "https://stability.ai", price: "免费开源/付费云服务", priceType: "free", platforms: ["本地", "Web", "API"], features: ["开源", "本地部署", "LoRA训练", "ControlNet"] },
    { name: "Remove.bg", icon: "✂️", desc: "AI 背景移除工具，一键去除图片背景，支持批量处理和高清输出。", category: "image", tags: ["抠图", "背景移除"], link: "https://www.remove.bg", price: "免费/付费按张计费", priceType: "freemium", platforms: ["Web", "API", "Photoshop插件"], features: ["一键抠图", "批量处理", "高清输出", "API"] },
    { name: "Canva AI", icon: "🎯", desc: "在线设计平台 Canva 的 AI 功能，支持智能设计、图像生成、文字排版等。", category: "image", tags: ["设计", "图像生成"], link: "https://www.canva.com", price: "免费/付费 $12.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["AI设计", "图像生成", "模板丰富", "团队协作"] },
    { name: "Adobe Firefly", icon: "🔥", desc: "Adobe 推出的创意生成式 AI，集成在 Photoshop、Illustrator 等软件中。", category: "image", tags: ["Adobe", "创意设计"], link: "https://firefly.adobe.com", price: "免费/付费 $4.99/月", priceType: "freemium", platforms: ["Web", "Photoshop", "Illustrator"], features: ["生成填充", "文字效果", "矢量生成", "商业安全"] },
    { name: "Leonardo.ai", icon: "🎭", desc: "专业级 AI 图像生成平台，专为游戏资产、概念艺术设计，支持精细控制。", category: "image", tags: ["游戏资产", "概念艺术"], link: "https://leonardo.ai", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web"], features: ["游戏资产", "精细控制", "模型训练", "Canvas编辑"] },
    { name: "Ideogram", icon: "💡", desc: "AI 图像生成工具，擅长在图片中生成准确的文字，适合海报、Logo 设计。", category: "image", tags: ["文字生成", "海报设计"], link: "https://ideogram.ai", price: "免费/付费 $8/月", priceType: "freemium", platforms: ["Web"], features: ["文字渲染", "海报设计", "Logo生成", "高质量"] },
    { name: "Recraft", icon: "🔧", desc: "AI 矢量图形生成工具，生成可编辑的 SVG 图标、插画和品牌视觉素材。", category: "image", tags: ["矢量图", "图标", "品牌"], link: "https://www.recraft.ai", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web"], features: ["矢量生成", "SVG导出", "图标库", "品牌套件"] },
    { name: "Flux", icon: "⚡", desc: "Black Forest Labs 推出的开源图像生成模型，画质出色，支持快速生成。", category: "image", tags: ["开源", "高质量"], link: "https://blackforestlabs.ai", price: "免费开源/付费API", priceType: "free", platforms: ["本地", "API"], features: ["开源", "高画质", "快速生成", "可商用"] },
    { name: "ClipDrop", icon: "📸", desc: "AI 图像编辑工具集，包含抠图、放大、清理、重绘等多种实用功能。", category: "image", tags: ["图像编辑", "工具集"], link: "https://clipdrop.co", price: "免费/付费 $9/月", priceType: "freemium", platforms: ["Web", "iOS", "Android", "Photoshop"], features: ["抠图", "图像放大", "清理", "重绘"] },
    { name: "Topaz Labs", icon: "💎", desc: "专业 AI 图像和视频增强软件，照片放大、降噪、锐化，画质提升显著。", category: "image", tags: ["图像增强", "专业"], link: "https://www.topazlabs.com", price: "付费 $79.99起", priceType: "paid", platforms: ["Windows", "Mac"], features: ["照片放大", "降噪", "锐化", "视频增强"] },
    { name: "Remini", icon: "📷", desc: "AI 照片增强和修复工具，一键提升照片清晰度，修复老照片，人像美化。", category: "image", tags: ["照片修复", "人像美化"], link: "https://www.remini.ai", price: "免费/付费 $4.99/月", priceType: "freemium", platforms: ["iOS", "Android", "Web"], features: ["照片增强", "老照片修复", "人像美化", "AI头像"] },
    { name: "Upscayl", icon: "🔍", desc: "开源免费的 AI 图像放大工具，本地运行，保护隐私，支持批量处理。", category: "image", tags: ["开源", "图像放大", "免费"], link: "https://upscayl.org", price: "免费开源", priceType: "free", platforms: ["Windows", "Mac", "Linux"], features: ["开源免费", "本地运行", "批量处理", "多模型"] },
    { name: "Cleanup.pictures", icon: "🧹", desc: "AI 图片清理工具，涂抹即可移除图片中不需要的物体、文字、水印。", category: "image", tags: ["物体移除", "修图"], link: "https://cleanup.pictures", price: "免费/付费 $5/月", priceType: "freemium", platforms: ["Web"], features: ["物体移除", "文字移除", "水印移除", "高清输出"] },
    { name: "Photoroom", icon: "🏠", desc: "AI 背景编辑工具，专为电商产品图设计，一键更换背景，生成专业产品照。", category: "image", tags: ["电商", "背景编辑"], link: "https://www.photoroom.com", price: "免费/付费 $9.49/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["背景编辑", "产品图", "批量处理", "模板"] },
    { name: "Magnific", icon: "🌟", desc: "高端 AI 图像增强工具，超分辨率放大，细节增强，适合专业设计师和摄影师。", category: "image", tags: ["超分辨率", "专业"], link: "https://magnific.ai", price: "付费 $39/月起", priceType: "paid", platforms: ["Web"], features: ["超分辨率", "细节增强", "高倍率", "专业级"] },
    { name: "Krea", icon: "🎨", desc: "AI 创意设计平台，实时图像生成，支持风格融合、参考图控制，创意工作流。", category: "image", tags: ["创意设计", "实时生成"], link: "https://www.krea.ai", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web"], features: ["实时生成", "风格融合", "参考图控制", "Canvas"] },
    { name: "Playground AI", icon: "🎮", desc: "免费 AI 图像生成平台，每日免费额度，支持多种模型，适合个人创作者。", category: "image", tags: ["免费", "图像生成"], link: "https://playground.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web"], features: ["免费额度", "多模型", "编辑功能", "社区"] },
    { name: "Fotor", icon: "🖼️", desc: "在线 AI 照片编辑器和设计工具，支持 AI 修图、拼图、设计模板，简单易用。", category: "image", tags: ["照片编辑", "设计模板"], link: "https://www.fotor.com", price: "免费/付费 $8.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["AI修图", "设计模板", "拼图", "HDR"] },
    { name: "Runway", icon: "🎬", desc: "专业的 AI 视频生成和编辑工具，支持文生视频、图生视频、视频风格转换等。", category: "video", tags: ["视频生成", "视频编辑"], link: "https://runwayml.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web"], features: ["Gen-3 Alpha", "文生视频", "图生视频", "运动笔刷"] },
    { name: "Sora", icon: "📹", desc: "OpenAI 的文生视频模型，能根据文字描述生成长达一分钟的高质量视频。", category: "video", tags: ["视频生成", "OpenAI"], link: "https://openai.com/sora", price: "付费 $20/月(ChatGPT Plus)", priceType: "paid", platforms: ["Web"], features: ["文生视频", "60秒长视频", "高质量", "ChatGPT集成"] },
    { name: "Pika", icon: "✨", desc: "简单易用的 AI 视频生成工具，支持文字、图片转视频，以及视频风格转换。", category: "video", tags: ["视频生成", "易用"], link: "https://pika.art", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web", "Discord"], features: ["文生视频", "图生视频", "风格转换", "Pika 2.0"] },
    { name: "HeyGen", icon: "🧑‍💼", desc: "AI 数字人视频生成平台，支持虚拟主播、多语言配音、口型同步等功能。", category: "video", tags: ["数字人", "虚拟主播"], link: "https://www.heygen.com", price: "免费/付费 $24/月", priceType: "freemium", platforms: ["Web"], features: ["数字人", "多语言配音", "口型同步", "模板"] },
    { name: "CapCut", icon: "🎞️", desc: "字节跳动推出的视频编辑工具，内置 AI 字幕、AI 特效、智能剪辑等功能。", category: "video", tags: ["视频编辑", "AI字幕"], link: "https://www.capcut.com", price: "免费/付费 $7.99/月", priceType: "freemium", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], features: ["AI字幕", "智能剪辑", "特效", "模板"] },
    { name: "Kling", icon: "🎥", desc: "可灵 AI，快手推出的文生视频大模型，支持高质量视频生成和图生视频。", category: "video", tags: ["视频生成", "快手"], link: "https://www.klingai.com", price: "免费/付费 ¥66/月起", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["文生视频", "图生视频", "高质量", "10秒视频"] },
    { name: "Veo", icon: "🎬", desc: "Google DeepMind 推出的文生视频大模型，生成电影级高质量视频。", category: "video", tags: ["视频生成", "Google"], link: "https://deepmind.google/models/veo", price: "付费(Google AI Studio)", priceType: "paid", platforms: ["Web"], features: ["电影级质量", "文生视频", "Google集成", "高分辨率"] },
    { name: "Hailuo", icon: "🐚", desc: "MiniMax 推出的海螺 AI，文生视频大模型，支持高质量视频生成。", category: "video", tags: ["视频生成", "MiniMax"], link: "https://hailuoai.video", price: "免费/付费 ¥59/月起", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["文生视频", "高质量", "快速生成", "中文优化"] },
    { name: "Fliki", icon: "🎬", desc: "AI 视频生成工具，将博客文章、文字脚本快速转为带配音的视频，支持多语言。", category: "video", tags: ["文本转视频", "配音"], link: "https://fliki.ai", price: "免费/付费 $8/月", priceType: "freemium", platforms: ["Web"], features: ["文本转视频", "博客转视频", "多语言配音", "素材库"] },
    { name: "OpusClip", icon: "✂️", desc: "AI 自动剪辑工具，将长视频一键转为多个短视频，自动选择精彩片段，加字幕。", category: "video", tags: ["自动剪辑", "短视频"], link: "https://www.opus.pro", price: "免费/付费 $19/月", priceType: "freemium", platforms: ["Web"], features: ["长转短", "自动选段", "AI字幕", "病毒式评分"] },
    { name: "Synthesia", icon: "🎭", desc: "AI 视频生成平台，创建带有 AI 头像和多语言支持的专业培训和营销视频。", category: "video", tags: ["AI头像", "培训视频"], link: "https://www.synthesia.io", price: "付费 $22/月起", priceType: "paid", platforms: ["Web"], features: ["AI头像", "120+语言", "模板", "屏幕录制"] },
    { name: "Descript", icon: "🎚️", desc: "AI 音频和视频编辑工具，支持文字编辑音频、AI 语音克隆、自动去除填充词。", category: "video", tags: ["音频编辑", "播客"], link: "https://www.descript.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Windows", "Mac", "Web"], features: ["文字编辑", "语音克隆", "播客录制", "视频编辑"] },
    { name: "VEED.IO", icon: "🎬", desc: "在线视频编辑平台，提供 AI 脚本、字幕、配音、文生视频和一体化功能。", category: "video", tags: ["在线编辑", "字幕"], link: "https://www.veed.io", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web"], features: ["AI字幕", "视频编辑", "文生视频", "屏幕录制"] },
    { name: "Invideo", icon: "🎥", desc: "在线 AI 视频创作平台，从脚本生成带有媒体、字幕和语音的视频，5000+ 模板。", category: "video", tags: ["视频创作", "模板"], link: "https://invideo.io", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web"], features: ["5000+模板", "AI脚本", "文本转视频", "品牌套件"] },
    { name: "Pictory", icon: "📹", desc: "AI 视频创作工具，将长文内容、博客文章转为短视频，自动提取亮点加字幕。", category: "video", tags: ["文本转视频", "博客"], link: "https://pictory.ai", price: "付费 $19/月起", priceType: "paid", platforms: ["Web"], features: ["博客转视频", "自动摘要", "AI字幕", "品牌声音"] },
    { name: "D-ID", icon: "👤", desc: "通过 AI 生成逼真数字人视频，用于营销、培训和多语言客户服务交互。", category: "video", tags: ["数字人", "营销"], link: "https://www.d-id.com", price: "免费/付费 $5.99/月", priceType: "freemium", platforms: ["Web", "API"], features: ["数字人", "照片动起来", "多语言", "API"] },
    { name: "Lumen5", icon: "💡", desc: "AI 视频制作工具，将博客文章和文章自动转为吸引人的视频，适合内容营销。", category: "video", tags: ["内容营销", "博客转视频"], link: "https://lumen5.com", price: "免费/付费 $19/月", priceType: "freemium", platforms: ["Web"], features: ["博客转视频", "自动剪辑", "素材库", "品牌套件"] },
    { name: "Captions", icon: "💬", desc: "AI 视频编辑和 3D 虚拟人工具，支持自动字幕、多语言配音和风格同步。", category: "video", tags: ["字幕", "虚拟人"], link: "https://www.captions.ai", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["iOS", "Web"], features: ["AI字幕", "虚拟人", "多语言", "眼睛接触"] },
    { name: "WiseCut", icon: "🎯", desc: "AI 视频编辑工具，自动去除沉默和停顿，自动加字幕，智能剪辑，节省编辑时间。", category: "video", tags: ["自动剪辑", "去沉默"], link: "https://www.wisecutvideo.com", price: "免费/付费 $19/月", priceType: "freemium", platforms: ["Web"], features: ["去沉默", "自动字幕", "智能剪辑", "背景音乐"] },
    { name: "Higgsfield", icon: "🎬", desc: "AI 视频制作工具，通过精确的镜头控制创建电影级视觉效果，适合创意视频。", category: "video", tags: ["电影级", "创意"], link: "https://higgsfield.ai", price: "付费 $20/月起", priceType: "paid", platforms: ["Web"], features: ["电影级效果", "镜头控制", "角色一致性", "高分辨率"] },
    { name: "GitHub Copilot", icon: "💻", desc: "GitHub 与 OpenAI 合作的 AI 编程助手，实时代码补全，支持多种编程语言和 IDE。", category: "code", tags: ["代码补全", "编程", "IDE插件"], link: "https://github.com/copilot", price: "付费 $10/月", priceType: "paid", platforms: ["VS Code", "JetBrains", "Neovim", "Visual Studio"], features: ["代码补全", "Chat", "代码解释", "PR描述"] },
    { name: "Cursor", icon: "⌨️", desc: "AI 原生代码编辑器，基于 VS Code 构建，支持智能代码生成、重构和对话式编程。", category: "code", tags: ["代码编辑器", "AI编程"], link: "https://cursor.sh", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Windows", "Mac", "Linux"], features: ["AI编辑", "代码生成", "重构", "多模型支持"] },
    { name: "CodeLlama", icon: "🦙", desc: "Meta 开源的代码大模型，支持代码生成、补全和调试，可本地部署。", category: "code", tags: ["开源", "代码生成", "本地部署"], link: "https://ai.meta.com/research/publications/codellama-open-foundation-models-for-code", price: "免费开源", priceType: "free", platforms: ["本地", "API"], features: ["开源", "代码生成", "代码补全", "可商用"] },
    { name: "Tabnine", icon: "📝", desc: "AI 代码补全工具，支持多种 IDE 和编程语言，注重隐私保护，可本地部署。", category: "code", tags: ["代码补全", "隐私"], link: "https://www.tabnine.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["VS Code", "JetBrains", "Eclipse", "更多"], features: ["代码补全", "团队模型", "本地部署", "隐私保护"] },
    { name: "Replit", icon: "🔄", desc: "在线代码编辑器和部署平台，内置 AI 助手，支持多种语言，一键部署应用。", category: "code", tags: ["在线IDE", "部署"], link: "https://replit.com", price: "免费/付费 $7/月", priceType: "freemium", platforms: ["Web"], features: ["在线IDE", "AI助手", "一键部署", "协作"] },
    { name: "Aider", icon: "🤝", desc: "终端中的 AI 结对编程工具，直接在你的代码库中工作，支持 Git 集成，自动提交。", category: "code", tags: ["终端", "结对编程"], link: "https://aider.chat", price: "免费开源(需API Key)", priceType: "free", platforms: ["终端", "Mac", "Linux", "Windows"], features: ["终端操作", "Git集成", "多文件编辑", "自动提交"] },
    { name: "Claude Code", icon: "🔧", desc: "Anthropic 推出的命令行 AI 编程助手，深度理解代码库，支持复杂重构和调试。", category: "code", tags: ["命令行", "Anthropic"], link: "https://docs.anthropic.com/en/docs/claude-code", price: "付费(需Claude订阅)", priceType: "paid", platforms: ["终端", "Mac", "Linux"], features: ["命令行", "代码库理解", "复杂重构", "调试"] },
    { name: "Codeium", icon: "⚡", desc: "免费 AI 代码补全和聊天工具，支持 70+ 语言，40+ IDE，个人使用完全免费。", category: "code", tags: ["免费", "代码补全"], link: "https://codeium.com", price: "免费个人版/企业版", priceType: "free", platforms: ["VS Code", "JetBrains", "Vim", "更多"], features: ["免费", "代码补全", "AI聊天", "70+语言"] },
    { name: "Windsurf", icon: "🌊", desc: "AI 代码编辑器，由 Codeium 团队打造，支持 Cascade 流式代理编程，深度代码理解。", category: "code", tags: ["代码编辑器", "代理编程"], link: "https://codeium.com/windsurf", price: "免费/付费 $15/月", priceType: "freemium", platforms: ["Windows", "Mac", "Linux"], features: ["Cascade代理", "代码理解", "多模型", "基于VS Code"] },
    { name: "Continue", icon: "➡️", desc: "开源 AI 编程助手插件，可在 VS Code 和 JetBrains 中使用，支持自定义模型和本地模型。", category: "code", tags: ["开源", "插件", "本地模型"], link: "https://www.continue.dev", price: "免费开源", priceType: "free", platforms: ["VS Code", "JetBrains"], features: ["开源", "自定义模型", "本地模型", "代码库索引"] },
    { name: "LM Studio", icon: "🏠", desc: "在本地电脑上运行大语言模型的桌面应用，支持多种模型，图形界面，无需命令行。", category: "code", tags: ["本地部署", "LLM", "桌面应用"], link: "https://lmstudio.ai", price: "免费", priceType: "free", platforms: ["Windows", "Mac", "Linux"], features: ["本地运行", "图形界面", "多模型", "API服务器"] },
    { name: "Ollama", icon: "🦙", desc: "本地运行大语言模型的工具，一行命令启动，支持 Llama、Mistral 等多种开源模型。", category: "code", tags: ["本地部署", "LLM", "开源"], link: "https://ollama.com", price: "免费开源", priceType: "free", platforms: ["Mac", "Linux", "Windows"], features: ["一行命令", "多模型", "API", "Modelfile"] },
    { name: "v0", icon: "🎨", desc: "Vercel 推出的 AI 前端代码生成工具，用文字描述生成 React + Tailwind 组件，一键部署。", category: "code", tags: ["前端", "React", "Vercel"], link: "https://v0.dev", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web"], features: ["React组件", "Tailwind", "一键部署", "迭代生成"] },
    { name: "Bolt.new", icon: "⚡", desc: "StackBlitz 推出的 AI 全栈应用生成工具，用提示词创建完整 Web 应用，实时预览。", category: "code", tags: ["全栈", "Web应用"], link: "https://bolt.new", price: "免费/付费", priceType: "freemium", platforms: ["Web"], features: ["全栈生成", "实时预览", "WebContainer", "一键部署"] },
    { name: "Lovable", icon: "💖", desc: "AI 应用构建平台，用自然语言描述生成完整的 Web 应用，支持数据库、认证和部署。", category: "code", tags: ["无代码", "Web应用"], link: "https://lovable.dev", price: "免费/付费", priceType: "freemium", platforms: ["Web"], features: ["自然语言", "数据库", "认证", "部署"] },
    { name: "ElevenLabs", icon: "🎙️", desc: "最先进的 AI 语音生成平台，支持文本转语音、声音克隆和多语言配音。", category: "audio", tags: ["语音合成", "声音克隆"], link: "https://elevenlabs.io", price: "免费/付费 $5/月", priceType: "freemium", platforms: ["Web", "API"], features: ["语音合成", "声音克隆", "多语言", "API"] },
    { name: "Whisper", icon: "🎧", desc: "OpenAI 开源的语音识别模型，支持多语言语音转文字，准确率高，可本地部署。", category: "audio", tags: ["语音识别", "开源", "转文字"], link: "https://openai.com/research/whisper", price: "免费开源", priceType: "free", platforms: ["本地", "API"], features: ["开源", "多语言", "高准确率", "本地部署"] },
    { name: "Suno", icon: "🎵", desc: "AI 音乐生成工具，输入文字描述即可生成完整歌曲，支持多种风格和语言。", category: "audio", tags: ["音乐生成", "歌曲创作"], link: "https://suno.com", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["歌曲生成", "多风格", "人声", "自定义歌词"] },
    { name: "Udio", icon: "🎸", desc: "高质量 AI 音乐生成平台，支持生成带人声的完整歌曲，音质出色。", category: "audio", tags: ["音乐生成", "高质量"], link: "https://www.udio.com", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web"], features: ["高质量", "人声", "多风格", "歌曲扩展"] },
    { name: "Murf", icon: "🎤", desc: "AI 语音生成平台，120+ 逼真语音，20+ 语言，适合视频配音、播客和有声书。", category: "audio", tags: ["语音合成", "配音"], link: "https://murf.ai", price: "免费/付费 $19/月", priceType: "freemium", platforms: ["Web"], features: ["120+语音", "20+语言", "语音克隆", "视频同步"] },
    { name: "Play.ht", icon: "▶️", desc: "AI 语音生成工具，800+ 语音，140+ 语言，支持声音克隆，适合商业用途。", category: "audio", tags: ["语音合成", "多语言"], link: "https://play.ht", price: "免费/付费 $19/月", priceType: "freemium", platforms: ["Web", "API"], features: ["800+语音", "140+语言", "声音克隆", "商业授权"] },
    { name: "Speechify", icon: "📖", desc: "文本转语音工具，将任何文字转为自然语音，支持网页、PDF、电子书，适合阅读障碍。", category: "audio", tags: ["文本转语音", "阅读辅助"], link: "https://speechify.com", price: "免费/付费 $11.58/月", priceType: "freemium", platforms: ["Web", "iOS", "Android", "Chrome扩展"], features: ["文本转语音", "PDF朗读", "网页朗读", "多语音"] },
    { name: "AIVA", icon: "🎹", desc: "AI 音乐作曲平台，为视频、游戏、广告创作原创背景音乐，支持多种风格和情绪。", category: "audio", tags: ["音乐作曲", "背景音乐"], link: "https://www.aiva.ai", price: "免费/付费 €11/月", priceType: "freemium", platforms: ["Web"], features: ["音乐作曲", "多风格", "情绪控制", "商业授权"] },
    { name: "Soundraw", icon: "🎼", desc: "AI 音乐生成平台，创建免版税音乐，可自定义长度、节奏、乐器，适合视频创作者。", category: "audio", tags: ["免版税", "背景音乐"], link: "https://soundraw.io", price: "付费 $16.99/月", priceType: "paid", platforms: ["Web"], features: ["免版税", "自定义", "无限下载", "商用授权"] },
    { name: "Boomy", icon: "🎧", desc: "AI 音乐创作平台，几秒内生成原创歌曲，可发布到流媒体平台赚取版税。", category: "audio", tags: ["音乐创作", "变现"], link: "https://boomy.com", price: "免费/付费 $9.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["快速生成", "多风格", "发布变现", "社区"] },
    { name: "Krisp", icon: "🔇", desc: "AI 降噪工具，实时消除会议和录音中的背景噪音，支持 Zoom、Teams 等会议软件。", category: "audio", tags: ["降噪", "会议"], link: "https://krisp.ai", price: "免费/付费 $9.99/月", priceType: "freemium", platforms: ["Windows", "Mac"], features: ["AI降噪", "回声消除", "会议软件集成", "语音增强"] },
    { name: "Adobe Enhance", icon: "✨", desc: "Adobe 推出的 AI 语音增强工具，一键提升录音质量，去除噪音，增强人声。", category: "audio", tags: ["语音增强", "Adobe"], link: "https://podcast.adobe.com/enhance", price: "免费", priceType: "free", platforms: ["Web"], features: ["语音增强", "去噪音", "一键处理", "Adobe品质"] },
    { name: "Riffusion", icon: "🎸", desc: "开源 AI 音乐生成工具，通过图像生成音乐，支持实时音乐风格转换和混合。", category: "audio", tags: ["开源", "音乐生成"], link: "https://riffusion.com", price: "免费开源", priceType: "free", platforms: ["Web", "本地"], features: ["开源", "实时生成", "风格混合", "频谱图"] },
    { name: "Lovo", icon: "🎙️", desc: "AI 语音和视频生成平台，500+ 语音，100+ 语言，支持声音克隆和数字人视频。", category: "audio", tags: ["语音合成", "数字人"], link: "https://www.lovo.ai", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web"], features: ["500+语音", "100+语言", "声音克隆", "数字人视频"] },
    { name: "Perplexity", icon: "🔍", desc: "AI 搜索引擎，结合大语言模型和实时网络搜索，给出带引用来源的准确答案。", category: "productivity", tags: ["搜索", "问答", "研究"], link: "https://www.perplexity.ai", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["AI搜索", "引用来源", "实时搜索", "多模态"] },
    { name: "Gamma", icon: "📊", desc: "AI 演示文稿生成工具，输入主题即可自动生成精美的 PPT，支持多种模板和风格。", category: "productivity", tags: ["PPT", "演示文稿"], link: "https://gamma.app", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web"], features: ["AI生成PPT", "多模板", "交互式", "导出"] },
    { name: "Otter.ai", icon: "📝", desc: "AI 会议记录工具，实时转录会议内容，生成带说话人识别的文字记录和摘要。", category: "productivity", tags: ["会议记录", "转录", "效率"], link: "https://otter.ai", price: "免费/付费 $16.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["实时转录", "说话人识别", "摘要生成", "会议集成"] },
    { name: "Zapier AI", icon: "⚡", desc: "自动化工作流平台的 AI 功能，支持用自然语言创建自动化流程，连接数千款应用。", category: "productivity", tags: ["自动化", "工作流"], link: "https://zapier.com", price: "免费/付费 $19.99/月", priceType: "freemium", platforms: ["Web"], features: ["5000+应用", "AI创建流程", "多步骤自动化", "团队协作"] },
    { name: "n8n", icon: "🔗", desc: "可自托管的开源低代码自动化平台，连接多种服务，支持 AI 节点，构建复杂工作流。", category: "productivity", tags: ["开源", "自动化", "自托管"], link: "https://n8n.io", price: "免费开源/云服务 €20/月", priceType: "free", platforms: ["自托管", "Web", "Desktop"], features: ["开源", "自托管", "AI节点", "400+集成"] },
    { name: "Notion", icon: "📚", desc: "可定制的一体化协作空间，集笔记、数据库、任务与 AI 助手于一体。", category: "productivity", tags: ["笔记", "协作", "数据库"], link: "https://www.notion.so", price: "免费/付费 $8/月", priceType: "freemium", platforms: ["Web", "Desktop", "iOS", "Android"], features: ["笔记", "数据库", "任务管理", "AI助手"] },
    { name: "Obsidian", icon: "🪨", desc: "Markdown 本地笔记工具，支持插件与强大双向链接，构建个人知识库。", category: "productivity", tags: ["笔记", "知识管理", "本地"], link: "https://obsidian.md", price: "免费/付费 $8/月(同步)", priceType: "free", platforms: ["Windows", "Mac", "Linux", "iOS", "Android"], features: ["本地存储", "双向链接", "插件生态", "Markdown"] },
    { name: "Calendly", icon: "📅", desc: "自动化日程管理工具，一键安排会议，去除多余沟通成本，集成日历和视频会议。", category: "productivity", tags: ["日程", "会议安排"], link: "https://calendly.com", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["日程安排", "日历集成", "视频会议", "团队调度"] },
    { name: "Tally", icon: "📋", desc: "无代码表单工具，类似 Notion 式编辑，免费创建多样表单，支持高级逻辑和支付。", category: "productivity", tags: ["表单", "无代码"], link: "https://tally.so", price: "免费/付费 $29/月", priceType: "freemium", platforms: ["Web"], features: ["无代码", "高级逻辑", "支付集成", "无限表单"] },
    { name: "Scribe", icon: "📖", desc: "自动捕捉操作并生成带截图的步骤指南，用 AI 快速输出流程文档和 SOP。", category: "productivity", tags: ["文档生成", "SOP"], link: "https://scribehow.com", price: "免费/付费 $12/月", priceType: "freemium", platforms: ["Web", "Chrome扩展", "Desktop"], features: ["自动录制", "步骤生成", "AI编辑", "团队共享"] },
    { name: "Fireflies", icon: "🔥", desc: "AI 会议助手，自动录制、转录、总结会议，支持搜索会议内容，集成主流会议平台。", category: "productivity", tags: ["会议记录", "AI助手"], link: "https://fireflies.ai", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["自动录制", "转录总结", "语义搜索", "会议集成"] },
    { name: "Fathom", icon: "🎯", desc: "免费 AI 会议笔记工具，自动录制、转录、高亮和总结会议，支持 Zoom、Teams、Meet。", category: "productivity", tags: ["会议记录", "免费"], link: "https://fathom.video", price: "免费", priceType: "free", platforms: ["Mac", "Windows", "Web"], features: ["免费", "自动总结", "高亮标记", "会议集成"] },
    { name: "TL;DV", icon: "⏱️", desc: "AI 会议录制和笔记工具，自动转录和总结，支持时间戳标记，集成 Zoom、Google Meet。", category: "productivity", tags: ["会议记录", "转录"], link: "https://tldv.io", price: "免费/付费 $20/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["录制转录", "AI总结", "时间戳", "会议集成"] },
    { name: "Wolfram Alpha", icon: "🧮", desc: "AI 驱动的计算知识引擎，回答数学、科学、历史等专业问题，提供精确计算和数据。", category: "productivity", tags: ["计算", "知识引擎"], link: "https://www.wolframalpha.com", price: "免费/付费 $5.49/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["精确计算", "知识查询", "数据分析", "可视化"] },
    { name: "Canva", icon: "🎨", desc: "拖放式多功能设计平台，提供 AI 智能模板，用于社交媒体图形、演示文稿和视频创作。", category: "productivity", tags: ["设计", "模板"], link: "https://www.canva.com", price: "免费/付费 $12.99/月", priceType: "freemium", platforms: ["Web", "iOS", "Android"], features: ["AI设计", "模板丰富", "团队协作", "品牌套件"] },
    { name: "Durable", icon: "🏗️", desc: "AI 网站构建器，30 秒内创建完整商业网站，包含文案、图片、联系表单和在线商店。", category: "productivity", tags: ["网站构建", "AI建站"], link: "https://durable.co", price: "付费 $12/月起", priceType: "paid", platforms: ["Web"], features: ["AI建站", "30秒生成", "在线商店", "CRM"] },
    { name: "Taskade", icon: "✅", desc: "AI 任务管理和协作平台，结构化列表、笔记、思维导图，支持 AI 代理自动化任务。", category: "productivity", tags: ["任务管理", "协作"], link: "https://www.taskade.com", price: "免费/付费 $8/月", priceType: "freemium", platforms: ["Web", "Desktop", "iOS", "Android"], features: ["任务管理", "思维导图", "AI代理", "实时协作"] },
    { name: "Motion", icon: "🤖", desc: "AI 项目和时间管理助手，自动规划任务和日程，智能排优先级，提升工作效率。", category: "productivity", tags: ["时间管理", "AI规划"], link: "https://www.usemotion.com", price: "付费 $19/月", priceType: "paid", platforms: ["Web", "Mac", "Windows", "iOS", "Android"], features: ["AI日程", "任务规划", "优先级", "日历集成"] },
    { name: "Bardeen", icon: "🤖", desc: "AI 自动化工具，用自然语言创建自动化流程，自动执行网页操作、数据提取和任务。", category: "productivity", tags: ["自动化", "浏览器"], link: "https://www.bardeen.ai", price: "免费/付费 $10/月", priceType: "freemium", platforms: ["Web", "Chrome扩展"], features: ["自然语言", "网页自动化", "数据提取", "预构建流程"] }
];

// ========== 分类配置 ==========
const categories = [
    { id: "all", name: "全部", icon: "🌐" },
    { id: "writing", name: "写作", icon: "✍️" },
    { id: "image", name: "图像", icon: "🎨" },
    { id: "video", name: "视频", icon: "🎬" },
    { id: "code", name: "编程", icon: "💻" },
    { id: "audio", name: "音频", icon: "🎵" },
    { id: "productivity", name: "效率", icon: "⚡" }
];

// ========== 多语言 ==========
const i18n = {
    zh: {
        subtitle: "发现最优质的 AI 工具，提升你的工作效率",
        tools: "个工具",
        categories: "个分类",
        visits: "次访问",
        searchPlaceholder: "搜索 AI 工具名称、描述或标签...",
        search: "搜索",
        all: "全部",
        free: "免费",
        paid: "付费",
        freemium: "免费+付费",
        priceFilter: "价格：",
        sortBy: "排序：",
        sortDefault: "默认",
        sortRating: "评分最高",
        sortName: "名称 A-Z",
        compare: "⚖️ 对比模式",
        compareSelected: "已选择：",
        toolsUnit: "个工具",
        clearCompare: "清空",
        startCompare: "开始对比",
        submitTool: "➕ 提交工具",
        back: "返回列表",
        noResults: "没有找到匹配的工具",
        clearFilters: "清除筛选"
    },
    en: {
        subtitle: "Discover the best AI tools to boost your productivity",
        tools: "tools",
        categories: "categories",
        visits: "visits",
        searchPlaceholder: "Search AI tools by name, description or tags...",
        search: "Search",
        all: "All",
        free: "Free",
        paid: "Paid",
        freemium: "Freemium",
        priceFilter: "Price:",
        sortBy: "Sort:",
        sortDefault: "Default",
        sortRating: "Top Rated",
        sortName: "Name A-Z",
        compare: "⚖️ Compare",
        compareSelected: "Selected:",
        toolsUnit: "tools",
        clearCompare: "Clear",
        startCompare: "Compare",
        submitTool: "➕ Submit Tool",
        back: "Back",
        noResults: "No tools found",
        clearFilters: "Clear Filters"
    }
};

// ========== 状态 ==========
let currentCategory = 'all';
let currentSearch = '';
let showFavoritesOnly = false;
let currentView = 'grid';
let currentDetailTool = null;
let tempRating = 0;
let currentPage = 1;
const itemsPerPage = 24;
let compareMode = false;
let compareList = [];
let currentLang = localStorage.getItem('lang') || 'zh';

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLang();
    initStats();
    initCategoryFilters();
    initViewToggle();
    initBackToTop();
    initRouter();
    renderTools();
    updateFavCount();
    document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('zh-CN');
});

// ========== 多语言 ==========
function initLang() {
    applyLang();
    document.getElementById('langToggle').addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        applyLang();
        renderTools();
    });
}

function applyLang() {
    const t = i18n[currentLang];
    document.getElementById('langToggle').textContent = currentLang === 'zh' ? '🌐 EN' : '🌐 中';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
}

function t(key) {
    return i18n[currentLang][key] || key;
}

// ========== 路由系统 ==========
function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash;
    hideAllViews();
    
    if (hash.startsWith('#/tool/')) {
        const toolName = decodeURIComponent(hash.replace('#/tool/', ''));
        showDetail(toolName);
    } else if (hash === '#/compare') {
        showCompareView();
    } else if (hash === '#/about') {
        document.getElementById('aboutView').style.display = 'block';
    } else if (hash === '#/privacy') {
        document.getElementById('privacyView').style.display = 'block';
    } else if (hash === '#/404') {
        document.getElementById('notFoundView').style.display = 'block';
    } else {
        showHome();
    }
    window.scrollTo(0, 0);
}

function hideAllViews() {
    ['homeView', 'detailView', 'compareView', 'aboutView', 'privacyView', 'notFoundView'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

function navigateTo(view, param) {
    if (view === 'home') window.location.hash = '';
    else if (view === 'detail' && param) window.location.hash = '#/tool/' + encodeURIComponent(param);
    else if (view === 'compare') window.location.hash = '#/compare';
    else if (view === 'about') window.location.hash = '#/about';
    else if (view === 'privacy') window.location.hash = '#/privacy';
}

function showHome() {
    document.getElementById('homeView').style.display = 'block';
    currentDetailTool = null;
}

// ========== 工具筛选和排序 ==========
function getFilteredTools() {
    let filtered = [...tools];
    const ratings = getRatings();
    
    if (showFavoritesOnly) {
        filtered = filtered.filter(tool => getFavorites().includes(tool.name));
    } else if (currentCategory !== 'all') {
        filtered = filtered.filter(tool => tool.category === currentCategory);
    }
    
    const priceFilter = document.getElementById('priceFilter')?.value || 'all';
    if (priceFilter !== 'all') {
        filtered = filtered.filter(tool => tool.priceType === priceFilter);
    }
    
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(searchLower) ||
            tool.desc.toLowerCase().includes(searchLower) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    const sortBy = document.getElementById('sortBy')?.value || 'default';
    if (sortBy === 'rating') {
        filtered.sort((a, b) => {
            const aRating = ratings[a.name]?.length ? ratings[a.name].reduce((x,y)=>x+y,0)/ratings[a.name].length : 0;
            const bRating = ratings[b.name]?.length ? ratings[b.name].reduce((x,y)=>x+y,0)/ratings[b.name].length : 0;
            return bRating - aRating;
        });
    } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
}

function applyFilters() {
    currentPage = 1;
    renderTools();
}

// ========== 工具列表渲染 ==========
function renderTools() {
    const grid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');
    const filtered = getFilteredTools();
    const ratings = getRatings();
    
    document.getElementById('resultCount').textContent = `${filtered.length} ${t('tools')}`;
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        pagination.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * itemsPerPage;
    const pageTools = filtered.slice(start, start + itemsPerPage);
    
    grid.innerHTML = pageTools.map((tool, index) => {
        const isFav = getFavorites().includes(tool.name);
        const catName = categories.find(c => c.id === tool.category)?.name || '';
        const toolRatings = ratings[tool.name] || [];
        const avgRating = toolRatings.length > 0 ? (toolRatings.reduce((a,b)=>a+b,0)/toolRatings.length).toFixed(1) : null;
        const isSelected = compareList.includes(tool.name);
        
        return `
        <div class="tool-card ${compareMode ? 'compare-mode' : ''} ${isSelected ? 'selected' : ''}" 
             style="animation-delay: ${Math.min(index * 0.03, 1)}s"
             onclick="${compareMode ? `toggleCompare('${tool.name}')` : `navigateTo('detail', '${tool.name}')`}">
            ${compareMode ? `<div class="compare-checkbox ${isSelected ? 'checked' : ''}">${isSelected ? '✓' : ''}</div>` : ''}
            <button class="tool-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${tool.name}')" title="${isFav ? '取消收藏' : '收藏'}">${isFav ? '⭐' : '☆'}</button>
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-content">
                <h3 class="tool-name">${tool.name}</h3>
                ${avgRating ? `<div class="card-rating"><span class="card-rating-stars">★</span> ${avgRating} (${toolRatings.length})</div>` : ''}
                <p class="tool-desc">${tool.desc}</p>
                <div class="tool-tags">
                    ${tool.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="tool-footer">
                    <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-link" onclick="event.stopPropagation(); trackOutboundLink('${tool.name}')">访问官网 →</a>
                    <span class="tool-category">${catName}</span>
                </div>
            </div>
        </div>
    `}).join('');
    
    // 分页
    if (totalPages > 1) {
        let paginationHTML = '';
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
        
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
        
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
        pagination.innerHTML = paginationHTML;
    } else {
        pagination.innerHTML = '';
    }
}

function changePage(page) {
    currentPage = page;
    renderTools();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 对比模式 ==========
function toggleCompareMode() {
    compareMode = !compareMode;
    compareList = [];
    document.getElementById('compareBtn').classList.toggle('active', compareMode);
    document.getElementById('compareBar').style.display = compareMode ? 'flex' : 'none';
    renderTools();
}

function toggleCompare(name) {
    if (compareList.includes(name)) {
        compareList = compareList.filter(n => n !== name);
    } else {
        if (compareList.length >= 4) {
            showToast('最多对比 4 个工具');
            return;
        }
        compareList.push(name);
    }
    document.getElementById('compareCount').textContent = compareList.length;
    renderTools();
}

function clearCompare() {
    compareList = [];
    document.getElementById('compareCount').textContent = '0';
    renderTools();
}

function showCompareView() {
    if (compareList.length < 2) {
        showToast('请至少选择 2 个工具进行对比');
        navigateTo('home');
        return;
    }
    document.getElementById('compareView').style.display = 'block';
    const compareTools = compareList.map(name => tools.find(t => t.name === name)).filter(Boolean);
    const ratings = getRatings();
    
    const content = document.getElementById('compareContent');
    content.innerHTML = `
        <h1 style="margin: 20px 0;">⚖️ 工具对比</h1>
        <div style="overflow-x: auto;">
        <table class="compare-table">
            <thead>
                <tr>
                    <th>对比项</th>
                    ${compareTools.map(tool => `<th style="text-align:center;">
                        <div class="tool-icon-cell">${tool.icon}</div>
                        <div class="tool-name-cell">${tool.name}</div>
                    </th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>描述</strong></td>
                    ${compareTools.map(tool => `<td>${tool.desc}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>价格</strong></td>
                    ${compareTools.map(tool => `<td>${tool.price}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>价格类型</strong></td>
                    ${compareTools.map(tool => `<td><span class="tag">${tool.priceType}</span></td>`).join('')}
                </tr>
                <tr>
                    <td><strong>支持平台</strong></td>
                    ${compareTools.map(tool => `<td>${(tool.platforms || []).join(', ')}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>核心功能</strong></td>
                    ${compareTools.map(tool => `<td>${(tool.features || []).map(f => `✓ ${f}`).join('<br>')}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>用户评分</strong></td>
                    ${compareTools.map(tool => {
                        const r = ratings[tool.name] || [];
                        const avg = r.length ? (r.reduce((a,b)=>a+b,0)/r.length).toFixed(1) : '暂无';
                        return `<td>⭐ ${avg} (${r.length}条)</td>`;
                    }).join('')}
                </tr>
                <tr>
                    <td><strong>分类</strong></td>
                    ${compareTools.map(tool => `<td>${categories.find(c => c.id === tool.category)?.name || ''}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>官方链接</strong></td>
                    ${compareTools.map(tool => `<td><a href="${tool.link}" target="_blank" rel="noopener" class="tool-link">访问官网 →</a></td>`).join('')}
                </tr>
            </tbody>
        </table>
        </div>
    `;
}

// ========== 详情页渲染 ==========
function showDetail(toolName) {
    const tool = tools.find(t => t.name === toolName);
    if (!tool) { navigateTo('home'); return; }
    currentDetailTool = tool;
    document.getElementById('detailView').style.display = 'block';
    renderDetail(tool);
    trackPageView('/tool/' + toolName, tool.name + ' - AI Tools Radar');
}

function renderDetail(tool) {
    const ratings = getRatings();
    const toolRatings = ratings[tool.name] || [];
    const avgRating = toolRatings.length > 0 ? (toolRatings.reduce((a, b) => a + b, 0) / toolRatings.length).toFixed(1) : '暂无';
    const userRating = getUserRating(tool.name);
    const relatedTools = tools.filter(t => t.category === tool.category && t.name !== tool.name).slice(0, 4);
    
    const content = document.getElementById('detailContent');
    content.innerHTML = `
        <div class="detail-hero">
            <div class="detail-icon">${tool.icon}</div>
            <div class="detail-info">
                <h1 class="detail-title">${tool.name}</h1>
                <span class="detail-category">${categories.find(c => c.id === tool.category)?.name || ''}</span>
                <p class="detail-desc">${tool.desc}</p>
                <div class="detail-tags">
                    ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="detail-actions">
                    <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="detail-btn detail-btn-primary" onclick="trackOutboundLink('${tool.name}')">🔗 访问官网</a>
                    <button class="detail-btn detail-btn-secondary" onclick="toggleFavorite('${tool.name}'); renderDetail(currentDetailTool);">
                        ${getFavorites().includes(tool.name) ? '⭐ 已收藏' : '☆ 收藏'}
                    </button>
                    <button class="detail-share-btn" onclick="openShare('${tool.name}')">🔗 分享</button>
                </div>
            </div>
        </div>

        <div class="detail-grid">
            <div class="info-card">
                <div class="info-card-title">💰 价格</div>
                <div class="info-card-value">${tool.price || '未知'}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">📱 支持平台</div>
                <div class="info-card-value">${(tool.platforms || []).join(', ')}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">⭐ 用户评分</div>
                <div class="info-card-value">${avgRating} / 5.0</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">📂 分类</div>
                <div class="info-card-value">${categories.find(c => c.id === tool.category)?.name || ''}</div>
            </div>
        </div>

        <div class="info-card" style="margin: 20px 0;">
            <div class="info-card-title">✨ 核心功能</div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                ${(tool.features || []).map(f => `<span class="tag" style="font-size: 0.85rem; padding: 6px 12px;">✓ ${f}</span>`).join('')}
            </div>
        </div>

        <div class="rating-section">
            <h3 class="rating-title">⭐ 用户评分</h3>
            <div class="rating-display">
                <div class="rating-score">${avgRating}</div>
                <div>
                    <div class="rating-stars">${renderStars(parseFloat(avgRating) || 0)}</div>
                    <div class="rating-count">${toolRatings.length} 条评分</div>
                </div>
            </div>
            <div class="rating-input">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">你的评分：</span>
                ${[1,2,3,4,5].map(n => `<span class="star-input ${userRating >= n ? 'active' : ''}" onclick="setTempRating(${n})" onmouseenter="previewRating(${n})" onmouseleave="resetRatingPreview()">★</span>`).join('')}
                <button class="rating-submit" onclick="submitRating('${tool.name}')">提交评分</button>
            </div>
            ${userRating > 0 ? `<div class="user-rating">你已评分：${userRating} 星</div>` : ''}
        </div>

        ${relatedTools.length > 0 ? `
        <div class="related-section">
            <h3 class="related-title">🔗 相关工具</h3>
            <div class="related-grid">
                ${relatedTools.map(t => `
                    <div class="related-card" onclick="navigateTo('detail', '${t.name}')">
                        <div class="related-card-icon">${t.icon}</div>
                        <div class="related-card-name">${t.name}</div>
                        <div class="related-card-desc">${t.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

// ========== 评分系统 ==========
function getRatings() {
    try { return JSON.parse(localStorage.getItem('toolRatings') || '{}'); }
    catch { return {}; }
}

function getUserRating(toolName) {
    const ratings = getRatings();
    return ratings[toolName + '_user'] || 0;
}

function setTempRating(n) {
    tempRating = n;
    document.querySelectorAll('.star-input').forEach((el, i) => el.classList.toggle('active', i < n));
}

function previewRating(n) {
    document.querySelectorAll('.star-input').forEach((el, i) => el.classList.toggle('active', i < n));
}

function resetRatingPreview() {
    const userRating = getUserRating(currentDetailTool.name);
    document.querySelectorAll('.star-input').forEach((el, i) => el.classList.toggle('active', i < userRating));
}

function submitRating(toolName) {
    if (tempRating === 0) { showToast('请先选择评分星级'); return; }
    const ratings = getRatings();
    if (!ratings[toolName]) ratings[toolName] = [];
    const oldRating = ratings[toolName + '_user'];
    if (oldRating > 0) {
        const idx = ratings[toolName].indexOf(oldRating);
        if (idx > -1) ratings[toolName].splice(idx, 1);
    }
    ratings[toolName].push(tempRating);
    ratings[toolName + '_user'] = tempRating;
    localStorage.setItem('toolRatings', JSON.stringify(ratings));
    showToast('评分提交成功！');
    renderDetail(currentDetailTool);
    trackEvent('rating_submit', { tool: toolName, rating: tempRating });
}

function renderStars(rating) {
    const full = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < 5; i++) stars += i < full ? '★' : '☆';
    return stars;
}

// ========== 分享功能 ==========
let shareToolName = '';

function openShare(name) {
    shareToolName = name;
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShare() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToTwitter() {
    const tool = tools.find(t => t.name === shareToolName);
    const text = encodeURIComponent(`Check out ${tool.name} - ${tool.desc}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(tool.link)}`, '_blank');
    closeShare();
}

function shareToFacebook() {
    const tool = tools.find(t => t.name === shareToolName);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tool.link)}`, '_blank');
    closeShare();
}

function shareToWeibo() {
    const tool = tools.find(t => t.name === shareToolName);
    const text = encodeURIComponent(`${tool.name} - ${tool.desc}`);
    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(tool.link)}&title=${text}`, '_blank');
    closeShare();
}

function copyShareLink() {
    const tool = tools.find(t => t.name === shareToolName);
    navigator.clipboard.writeText(tool.link).then(() => {
        showToast('链接已复制到剪贴板');
        closeShare();
    }).catch(() => {
        showToast('复制失败，请手动复制');
    });
}

// ========== 提交工具 ==========
function showSubmitTool() {
    document.getElementById('submitModal').style.display = 'flex';
}

function closeSubmitTool() {
    document.getElementById('submitModal').style.display = 'none';
}

function submitTool(e) {
    e.preventDefault();
    const name = document.getElementById('submitName').value;
    const link = document.getElementById('submitLink').value;
    const category = document.getElementById('submitCategory').value;
    const desc = document.getElementById('submitDesc').value;
    const price = document.getElementById('submitPrice').value;
    
    // 保存到本地待审核列表
    const pending = JSON.parse(localStorage.getItem('pendingTools') || '[]');
    pending.push({ name, link, category, desc, price, date: new Date().toISOString() });
    localStorage.setItem('pendingTools', JSON.stringify(pending));
    
    showToast('提交成功！我们会尽快审核添加');
    closeSubmitTool();
    e.target.reset();
    trackEvent('tool_submit', { tool: name });
}

// 点击弹窗外部关闭
document.addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') closeShare();
    if (e.target.id === 'submitModal') closeSubmitTool();
});

// ========== Toast 提示 ==========
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ========== 主题切换 ==========
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
        trackEvent('theme_toggle', { theme: isDark ? 'dark' : 'light' });
    });
}

// ========== 统计数据 ==========
function initStats() {
    document.getElementById('totalTools').textContent = tools.length;
    document.getElementById('totalCategories').textContent = categories.length - 1;
    
    let visits = parseInt(localStorage.getItem('visitCount') || '0');
    visits++;
    localStorage.setItem('visitCount', visits.toString());
    document.getElementById('visitCount').textContent = visits.toLocaleString();
}

// ========== 分类筛选 ==========
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
            applyFilters();
            trackEvent('category_filter', { category: currentCategory });
        });
    });
}

// ========== 视图切换 ==========
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

// ========== 回到顶部 ==========
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('visible');
        else btn.classList.remove('visible');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== 收藏功能 ==========
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
    if (!currentDetailTool) renderTools();
    trackEvent('favorite_toggle', { tool: name, action: favorites.includes(name) ? 'add' : 'remove' });
}

function updateFavCount() {
    document.getElementById('favCount').textContent = getFavorites().length;
}

document.getElementById('favToggle').addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    document.getElementById('favToggle').classList.toggle('active', showFavoritesOnly);
    if (showFavoritesOnly) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        currentCategory = 'all';
    }
    applyFilters();
});

// ========== 搜索 ==========
function searchTools() {
    currentSearch = document.getElementById('searchInput').value.trim();
    applyFilters();
    if (currentSearch) trackEvent('search', { query: currentSearch });
}

function clearFilters() {
    currentSearch = '';
    currentCategory = 'all';
    showFavoritesOnly = false;
    document.getElementById('searchInput').value = '';
    document.getElementById('favToggle').classList.remove('active');
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('sortBy').value = 'default';
    document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    applyFilters();
}

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchTools();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    applyFilters();
});

// ========== Google Analytics 追踪 ==========
function trackPageView(path, title) {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', { page_path: path, page_title: title });
    }
}

function trackEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params);
}

function trackOutboundLink(toolName) {
    trackEvent('outbound_click', { tool: toolName });
}
