// AI 工具数据 - 120+ 精选工具
const tools = [
    // ========== 写作类 ==========
    { name: "ChatGPT", icon: "🤖", desc: "OpenAI 开发的强大对话式 AI，支持文本生成、代码编写、问题解答等多种功能。", category: "writing", tags: ["对话", "写作", "通用"], link: "https://chat.openai.com" },
    { name: "Claude", icon: "📝", desc: "Anthropic 推出的 AI 助手，擅长长文本处理、写作和分析，支持超长上下文。", category: "writing", tags: ["对话", "写作", "长文本"], link: "https://claude.ai" },
    { name: "Gemini", icon: "💎", desc: "Google 推出的多模态 AI 模型，支持文本、图像、视频、音频的理解和生成。", category: "writing", tags: ["多模态", "Google", "对话"], link: "https://gemini.google.com" },
    { name: "Grammarly", icon: "✏️", desc: "AI 写作助手，实时检查语法、拼写、语气和风格，支持英文写作优化和润色。", category: "writing", tags: ["语法检查", "写作润色"], link: "https://www.grammarly.com" },
    { name: "Jasper", icon: "📋", desc: "专业的 AI 营销文案生成工具，支持博客文章、广告文案、社交媒体内容等多种场景。", category: "writing", tags: ["营销文案", "内容创作"], link: "https://www.jasper.ai" },
    { name: "Notion AI", icon: "📚", desc: "集成在 Notion 中的 AI 助手，支持写作、总结、翻译、头脑风暴等多种功能。", category: "writing", tags: ["笔记", "写作", "效率"], link: "https://www.notion.so/product/ai" },
    { name: "Writesonic", icon: "✍️", desc: "AI 写作平台，生成文章、广告、产品描述，支持 SEO 优化和多语言内容。", category: "writing", tags: ["内容创作", "SEO"], link: "https://writesonic.com" },
    { name: "Copy.ai", icon: "📄", desc: "AI 文案生成工具，专为营销团队设计，支持广告、邮件、社交媒体内容自动化。", category: "writing", tags: ["营销文案", "自动化"], link: "https://www.copy.ai" },
    { name: "Jenni.ai", icon: "🖋️", desc: "AI 写作助手，帮助学术写作、研究组织和逻辑生成，支持实时自动补全。", category: "writing", tags: ["学术写作", "自动补全"], link: "https://jenni.ai" },
    { name: "Sudowrite", icon: "📖", desc: "专为小说作家设计的 AI 写作工具，通过自然语言描述生成和编辑小说、故事。", category: "writing", tags: ["小说创作", "创意写作"], link: "https://www.sudowrite.com" },
    { name: "HyperWrite", icon: "⌨️", desc: "AI 写作伴侣和文本生成器，支持邮件、文档、社交媒体内容的智能写作。", category: "writing", tags: ["写作助手", "文本生成"], link: "https://hyperwriteai.com" },
    { name: "DeepL", icon: "🌐", desc: "最准确的 AI 翻译工具，支持 30+ 语言，翻译质量远超传统机器翻译。", category: "writing", tags: ["翻译", "多语言"], link: "https://www.deepl.com/translator" },
    { name: "QuillBot", icon: "🔄", desc: "AI 改写和润色工具，支持同义替换、语法检查、摘要生成，提升写作质量。", category: "writing", tags: ["改写", "润色", "摘要"], link: "https://quillbot.com" },
    { name: "Rytr", icon: "✒️", desc: "经济实惠的 AI 写作工具，40+ 使用场景，20+ 语气，30+ 语言支持。", category: "writing", tags: ["内容创作", "多语言"], link: "https://rytr.me" },
    { name: "Anyword", icon: "🎯", desc: "AI 营销文案平台，数据驱动的文案生成，预测文案表现，提升转化率。", category: "writing", tags: ["营销", "转化率"], link: "https://anyword.com" },
    { name: "Phrasly", icon: "💬", desc: "AI 文本人性化工具，去除 AI 写作痕迹，让文本更自然，绕过 AI 检测。", category: "writing", tags: ["人性化", "AI检测"], link: "https://phrasly.ai" },
    { name: "Originality.ai", icon: "🔍", desc: "AI 内容检测和抄袭检查工具，帮助识别 AI 生成内容，确保内容原创性。", category: "writing", tags: ["AI检测", "原创性"], link: "https://originality.ai" },
    { name: "Moonbeam", icon: "🌙", desc: "AI 长文写作工具，从想法到完整文章，支持博客、论文、故事等长内容创作。", category: "writing", tags: ["长文", "博客"], link: "https://www.gomoonbeam.com" },
    { name: "Copysmith", icon: "📝", desc: "AI 驱动的写作助手，专注电商和营销文案，支持批量生成产品描述。", category: "writing", tags: ["电商", "产品描述"], link: "https://www.copysmith.ai" },
    { name: "Writer.com", icon: "✍️", desc: "企业级 AI 写作平台，统一品牌语气，确保内容一致性，适合大型团队。", category: "writing", tags: ["企业", "品牌"], link: "https://writer.com" },

    // ========== 图像类 ==========
    { name: "Midjourney", icon: "🎨", desc: "最流行的 AI 图像生成工具，通过文字描述生成高质量艺术图片和设计素材。", category: "image", tags: ["图像生成", "艺术", "设计"], link: "https://www.midjourney.com" },
    { name: "DALL·E 3", icon: "🖼️", desc: "OpenAI 的图像生成模型，能精准理解文字描述，生成细节丰富的高质量图片。", category: "image", tags: ["图像生成", "OpenAI"], link: "https://openai.com/dall-e-3" },
    { name: "Stable Diffusion", icon: "🌅", desc: "开源的 AI 图像生成模型，可本地部署，支持自定义训练和丰富的插件生态。", category: "image", tags: ["开源", "图像生成", "本地部署"], link: "https://stability.ai" },
    { name: "Remove.bg", icon: "✂️", desc: "AI 背景移除工具，一键去除图片背景，支持批量处理和高清输出。", category: "image", tags: ["抠图", "背景移除"], link: "https://www.remove.bg" },
    { name: "Canva AI", icon: "🎯", desc: "在线设计平台 Canva 的 AI 功能，支持智能设计、图像生成、文字排版等。", category: "image", tags: ["设计", "图像生成"], link: "https://www.canva.com" },
    { name: "Adobe Firefly", icon: "🔥", desc: "Adobe 推出的创意生成式 AI，集成在 Photoshop、Illustrator 等软件中。", category: "image", tags: ["Adobe", "创意设计"], link: "https://firefly.adobe.com" },
    { name: "Leonardo.ai", icon: "🎭", desc: "专业级 AI 图像生成平台，专为游戏资产、概念艺术设计，支持精细控制。", category: "image", tags: ["游戏资产", "概念艺术"], link: "https://leonardo.ai" },
    { name: "Ideogram", icon: "💡", desc: "AI 图像生成工具，擅长在图片中生成准确的文字，适合海报、Logo 设计。", category: "image", tags: ["文字生成", "海报设计"], link: "https://ideogram.ai" },
    { name: "Recraft", icon: "🔧", desc: "AI 矢量图形生成工具，生成可编辑的 SVG 图标、插画和品牌视觉素材。", category: "image", tags: ["矢量图", "图标", "品牌"], link: "https://www.recraft.ai" },
    { name: "Flux", icon: "⚡", desc: "Black Forest Labs 推出的开源图像生成模型，画质出色，支持快速生成。", category: "image", tags: ["开源", "高质量"], link: "https://blackforestlabs.ai" },
    { name: "ClipDrop", icon: "📸", desc: "AI 图像编辑工具集，包含抠图、放大、清理、重绘等多种实用功能。", category: "image", tags: ["图像编辑", "工具集"], link: "https://clipdrop.co" },
    { name: "Topaz Labs", icon: "💎", desc: "专业 AI 图像和视频增强软件，照片放大、降噪、锐化，画质提升显著。", category: "image", tags: ["图像增强", "专业"], link: "https://www.topazlabs.com" },
    { name: "Remini", icon: "📷", desc: "AI 照片增强和修复工具，一键提升照片清晰度，修复老照片，人像美化。", category: "image", tags: ["照片修复", "人像美化"], link: "https://www.remini.ai" },
    { name: "Upscayl", icon: "🔍", desc: "开源免费的 AI 图像放大工具，本地运行，保护隐私，支持批量处理。", category: "image", tags: ["开源", "图像放大", "免费"], link: "https://upscayl.org" },
    { name: "Cleanup.pictures", icon: "🧹", desc: "AI 图片清理工具，涂抹即可移除图片中不需要的物体、文字、水印。", category: "image", tags: ["物体移除", "修图"], link: "https://cleanup.pictures" },
    { name: "Photoroom", icon: "🏠", desc: "AI 背景编辑工具，专为电商产品图设计，一键更换背景，生成专业产品照。", category: "image", tags: ["电商", "背景编辑"], link: "https://www.photoroom.com" },
    { name: "Magnific", icon: "🌟", desc: "高端 AI 图像增强工具，超分辨率放大，细节增强，适合专业设计师和摄影师。", category: "image", tags: ["超分辨率", "专业"], link: "https://magnific.ai" },
    { name: "Krea", icon: "🎨", desc: "AI 创意设计平台，实时图像生成，支持风格融合、参考图控制，创意工作流。", category: "image", tags: ["创意设计", "实时生成"], link: "https://www.krea.ai" },
    { name: "Playground AI", icon: "🎮", desc: "免费 AI 图像生成平台，每日免费额度，支持多种模型，适合个人创作者。", category: "image", tags: ["免费", "图像生成"], link: "https://playground.com" },
    { name: "Fotor", icon: "🖼️", desc: "在线 AI 照片编辑器和设计工具，支持 AI 修图、拼图、设计模板，简单易用。", category: "image", tags: ["照片编辑", "设计模板"], link: "https://www.fotor.com" },

    // ========== 视频类 ==========
    { name: "Runway", icon: "🎬", desc: "专业的 AI 视频生成和编辑工具，支持文生视频、图生视频、视频风格转换等。", category: "video", tags: ["视频生成", "视频编辑"], link: "https://runwayml.com" },
    { name: "Sora", icon: "📹", desc: "OpenAI 的文生视频模型，能根据文字描述生成长达一分钟的高质量视频。", category: "video", tags: ["视频生成", "OpenAI"], link: "https://openai.com/sora" },
    { name: "Pika", icon: "✨", desc: "简单易用的 AI 视频生成工具，支持文字、图片转视频，以及视频风格转换。", category: "video", tags: ["视频生成", "易用"], link: "https://pika.art" },
    { name: "HeyGen", icon: "🧑‍💼", desc: "AI 数字人视频生成平台，支持虚拟主播、多语言配音、口型同步等功能。", category: "video", tags: ["数字人", "虚拟主播"], link: "https://www.heygen.com" },
    { name: "CapCut", icon: "🎞️", desc: "字节跳动推出的视频编辑工具，内置 AI 字幕、AI 特效、智能剪辑等功能。", category: "video", tags: ["视频编辑", "AI字幕"], link: "https://www.capcut.com" },
    { name: "Kling", icon: "🎥", desc: "可灵 AI，快手推出的文生视频大模型，支持高质量视频生成和图生视频。", category: "video", tags: ["视频生成", "快手"], link: "https://www.klingai.com" },
    { name: "Veo", icon: "🎬", desc: "Google DeepMind 推出的文生视频大模型，生成电影级高质量视频。", category: "video", tags: ["视频生成", "Google"], link: "https://deepmind.google/models/veo" },
    { name: "Hailuo", icon: "🐚", desc: "MiniMax 推出的海螺 AI，文生视频大模型，支持高质量视频生成。", category: "video", tags: ["视频生成", "MiniMax"], link: "https://hailuoai.video" },
    { name: "Fliki", icon: "🎬", desc: "AI 视频生成工具，将博客文章、文字脚本快速转为带配音的视频，支持多语言。", category: "video", tags: ["文本转视频", "配音"], link: "https://fliki.ai" },
    { name: "OpusClip", icon: "✂️", desc: "AI 自动剪辑工具，将长视频一键转为多个短视频，自动选择精彩片段，加字幕。", category: "video", tags: ["自动剪辑", "短视频"], link: "https://www.opus.pro" },
    { name: "Synthesia", icon: "🎭", desc: "AI 视频生成平台，创建带有 AI 头像和多语言支持的专业培训和营销视频。", category: "video", tags: ["AI头像", "培训视频"], link: "https://www.synthesia.io" },
    { name: "Descript", icon: "🎚️", desc: "AI 音频和视频编辑工具，支持文字编辑音频、AI 语音克隆、自动去除填充词。", category: "video", tags: ["音频编辑", "播客"], link: "https://www.descript.com" },
    { name: "VEED.IO", icon: "🎬", desc: "在线视频编辑平台，提供 AI 脚本、字幕、配音、文生视频和一体化功能。", category: "video", tags: ["在线编辑", "字幕"], link: "https://www.veed.io" },
    { name: "Invideo", icon: "🎥", desc: "在线 AI 视频创作平台，从脚本生成带有媒体、字幕和语音的视频，5000+ 模板。", category: "video", tags: ["视频创作", "模板"], link: "https://invideo.io" },
    { name: "Pictory", icon: "📹", desc: "AI 视频创作工具，将长文内容、博客文章转为短视频，自动提取亮点加字幕。", category: "video", tags: ["文本转视频", "博客"], link: "https://pictory.ai" },
    { name: "D-ID", icon: "👤", desc: "通过 AI 生成逼真数字人视频，用于营销、培训和多语言客户服务交互。", category: "video", tags: ["数字人", "营销"], link: "https://www.d-id.com" },
    { name: "Lumen5", icon: "💡", desc: "AI 视频制作工具，将博客文章和文章自动转为吸引人的视频，适合内容营销。", category: "video", tags: ["内容营销", "博客转视频"], link: "https://lumen5.com" },
    { name: "Captions", icon: "💬", desc: "AI 视频编辑和 3D 虚拟人工具，支持自动字幕、多语言配音和风格同步。", category: "video", tags: ["字幕", "虚拟人"], link: "https://www.captions.ai" },
    { name: "WiseCut", icon: "🎯", desc: "AI 视频编辑工具，自动去除沉默和停顿，自动加字幕，智能剪辑，节省编辑时间。", category: "video", tags: ["自动剪辑", "去沉默"], link: "https://www.wisecutvideo.com" },
    { name: "Higgsfield", icon: "🎬", desc: "AI 视频制作工具，通过精确的镜头控制创建电影级视觉效果，适合创意视频。", category: "video", tags: ["电影级", "创意"], link: "https://higgsfield.ai" },

    // ========== 编程类 ==========
    { name: "GitHub Copilot", icon: "💻", desc: "GitHub 与 OpenAI 合作的 AI 编程助手，实时代码补全，支持多种编程语言和 IDE。", category: "code", tags: ["代码补全", "编程", "IDE插件"], link: "https://github.com/copilot" },
    { name: "Cursor", icon: "⌨️", desc: "AI 原生代码编辑器，基于 VS Code 构建，支持智能代码生成、重构和对话式编程。", category: "code", tags: ["代码编辑器", "AI编程"], link: "https://cursor.sh" },
    { name: "CodeLlama", icon: "🦙", desc: "Meta 开源的代码大模型，支持代码生成、补全和调试，可本地部署。", category: "code", tags: ["开源", "代码生成", "本地部署"], link: "https://ai.meta.com/research/publications/codellama-open-foundation-models-for-code" },
    { name: "Tabnine", icon: "📝", desc: "AI 代码补全工具，支持多种 IDE 和编程语言，注重隐私保护，可本地部署。", category: "code", tags: ["代码补全", "隐私"], link: "https://www.tabnine.com" },
    { name: "Replit", icon: "🔄", desc: "在线代码编辑器和部署平台，内置 AI 助手，支持多种语言，一键部署应用。", category: "code", tags: ["在线IDE", "部署"], link: "https://replit.com" },
    { name: "Aider", icon: "🤝", desc: "终端中的 AI 结对编程工具，直接在你的代码库中工作，支持 Git 集成，自动提交。", category: "code", tags: ["终端", "结对编程"], link: "https://aider.chat" },
    { name: "Claude Code", icon: "🔧", desc: "Anthropic 推出的命令行 AI 编程助手，深度理解代码库，支持复杂重构和调试。", category: "code", tags: ["命令行", "Anthropic"], link: "https://docs.anthropic.com/en/docs/claude-code" },
    { name: "Codeium", icon: "⚡", desc: "免费 AI 代码补全和聊天工具，支持 70+ 语言，40+ IDE，个人使用完全免费。", category: "code", tags: ["免费", "代码补全"], link: "https://codeium.com" },
    { name: "Windsurf", icon: "🌊", desc: "AI 代码编辑器，由 Codeium 团队打造，支持 Cascade 流式代理编程，深度代码理解。", category: "code", tags: ["代码编辑器", "代理编程"], link: "https://codeium.com/windsurf" },
    { name: "Continue", icon: "➡️", desc: "开源 AI 编程助手插件，可在 VS Code 和 JetBrains 中使用，支持自定义模型和本地模型。", category: "code", tags: ["开源", "插件", "本地模型"], link: "https://www.continue.dev" },
    { name: "LM Studio", icon: "🏠", desc: "在本地电脑上运行大语言模型的桌面应用，支持多种模型，图形界面，无需命令行。", category: "code", tags: ["本地部署", "LLM", "桌面应用"], link: "https://lmstudio.ai" },
    { name: "Ollama", icon: "🦙", desc: "本地运行大语言模型的工具，一行命令启动，支持 Llama、Mistral 等多种开源模型。", category: "code", tags: ["本地部署", "LLM", "开源"], link: "https://ollama.com" },
    { name: "v0", icon: "🎨", desc: "Vercel 推出的 AI 前端代码生成工具，用文字描述生成 React + Tailwind 组件，一键部署。", category: "code", tags: ["前端", "React", "Vercel"], link: "https://v0.dev" },
    { name: "Bolt.new", icon: "⚡", desc: "StackBlitz 推出的 AI 全栈应用生成工具，用提示词创建完整 Web 应用，实时预览。", category: "code", tags: ["全栈", "Web应用"], link: "https://bolt.new" },
    { name: "Lovable", icon: "💖", desc: "AI 应用构建平台，用自然语言描述生成完整的 Web 应用，支持数据库、认证和部署。", category: "code", tags: ["无代码", "Web应用"], link: "https://lovable.dev" },

    // ========== 音频类 ==========
    { name: "ElevenLabs", icon: "🎙️", desc: "最先进的 AI 语音生成平台，支持文本转语音、声音克隆和多语言配音。", category: "audio", tags: ["语音合成", "声音克隆"], link: "https://elevenlabs.io" },
    { name: "Whisper", icon: "🎧", desc: "OpenAI 开源的语音识别模型，支持多语言语音转文字，准确率高，可本地部署。", category: "audio", tags: ["语音识别", "开源", "转文字"], link: "https://openai.com/research/whisper" },
    { name: "Suno", icon: "🎵", desc: "AI 音乐生成工具，输入文字描述即可生成完整歌曲，支持多种风格和语言。", category: "audio", tags: ["音乐生成", "歌曲创作"], link: "https://suno.com" },
    { name: "Udio", icon: "🎸", desc: "高质量 AI 音乐生成平台，支持生成带人声的完整歌曲，音质出色。", category: "audio", tags: ["音乐生成", "高质量"], link: "https://www.udio.com" },
    { name: "Descript", icon: "🎚️", desc: "AI 音频和视频编辑工具，支持文字编辑音频、AI 语音克隆、自动去除填充词。", category: "audio", tags: ["音频编辑", "播客"], link: "https://www.descript.com" },
    { name: "Murf", icon: "🎤", desc: "AI 语音生成平台，120+ 逼真语音，20+ 语言，适合视频配音、播客和有声书。", category: "audio", tags: ["语音合成", "配音"], link: "https://murf.ai" },
    { name: "Play.ht", icon: "▶️", desc: "AI 语音生成工具，800+ 语音，140+ 语言，支持声音克隆，适合商业用途。", category: "audio", tags: ["语音合成", "多语言"], link: "https://play.ht" },
    { name: "Speechify", icon: "📖", desc: "文本转语音工具，将任何文字转为自然语音，支持网页、PDF、电子书，适合阅读障碍。", category: "audio", tags: ["文本转语音", "阅读辅助"], link: "https://speechify.com" },
    { name: "AIVA", icon: "🎹", desc: "AI 音乐作曲平台，为视频、游戏、广告创作原创背景音乐，支持多种风格和情绪。", category: "audio", tags: ["音乐作曲", "背景音乐"], link: "https://www.aiva.ai" },
    { name: "Soundraw", icon: "🎼", desc: "AI 音乐生成平台，创建免版税音乐，可自定义长度、节奏、乐器，适合视频创作者。", category: "audio", tags: ["免版税", "背景音乐"], link: "https://soundraw.io" },
    { name: "Boomy", icon: "🎧", desc: "AI 音乐创作平台，几秒内生成原创歌曲，可发布到流媒体平台赚取版税。", category: "audio", tags: ["音乐创作", "变现"], link: "https://boomy.com" },
    { name: "Krisp", icon: "🔇", desc: "AI 降噪工具，实时消除会议和录音中的背景噪音，支持 Zoom、Teams 等会议软件。", category: "audio", tags: ["降噪", "会议"], link: "https://krisp.ai" },
    { name: "Adobe Enhance", icon: "✨", desc: "Adobe 推出的 AI 语音增强工具，一键提升录音质量，去除噪音，增强人声。", category: "audio", tags: ["语音增强", "Adobe"], link: "https://podcast.adobe.com/enhance" },
    { name: "Riffusion", icon: "🎸", desc: "开源 AI 音乐生成工具，通过图像生成音乐，支持实时音乐风格转换和混合。", category: "audio", tags: ["开源", "音乐生成"], link: "https://riffusion.com" },
    { name: "Lovo", icon: "🎙️", desc: "AI 语音和视频生成平台，500+ 语音，100+ 语言，支持声音克隆和数字人视频。", category: "audio", tags: ["语音合成", "数字人"], link: "https://www.lovo.ai" },

    // ========== 效率类 ==========
    { name: "Perplexity", icon: "🔍", desc: "AI 搜索引擎，结合大语言模型和实时网络搜索，给出带引用来源的准确答案。", category: "productivity", tags: ["搜索", "问答", "研究"], link: "https://www.perplexity.ai" },
    { name: "Gamma", icon: "📊", desc: "AI 演示文稿生成工具，输入主题即可自动生成精美的 PPT，支持多种模板和风格。", category: "productivity", tags: ["PPT", "演示文稿"], link: "https://gamma.app" },
    { name: "Otter.ai", icon: "📝", desc: "AI 会议记录工具，实时转录会议内容，生成带说话人识别的文字记录和摘要。", category: "productivity", tags: ["会议记录", "转录", "效率"], link: "https://otter.ai" },
    { name: "Zapier AI", icon: "⚡", desc: "自动化工作流平台的 AI 功能，支持用自然语言创建自动化流程，连接数千款应用。", category: "productivity", tags: ["自动化", "工作流"], link: "https://zapier.com" },
    { name: "n8n", icon: "🔗", desc: "可自托管的开源低代码自动化平台，连接多种服务，支持 AI 节点，构建复杂工作流。", category: "productivity", tags: ["开源", "自动化", "自托管"], link: "https://n8n.io" },
    { name: "Notion", icon: "📚", desc: "可定制的一体化协作空间，集笔记、数据库、任务与 AI 助手于一体。", category: "productivity", tags: ["笔记", "协作", "数据库"], link: "https://www.notion.so" },
    { name: "Obsidian", icon: "🪨", desc: "Markdown 本地笔记工具，支持插件与强大双向链接，构建个人知识库。", category: "productivity", tags: ["笔记", "知识管理", "本地"], link: "https://obsidian.md" },
    { name: "Calendly", icon: "📅", desc: "自动化日程管理工具，一键安排会议，去除多余沟通成本，集成日历和视频会议。", category: "productivity", tags: ["日程", "会议安排"], link: "https://calendly.com" },
    { name: "Tally", icon: "📋", desc: "无代码表单工具，类似 Notion 式编辑，免费创建多样表单，支持高级逻辑和支付。", category: "productivity", tags: ["表单", "无代码"], link: "https://tally.so" },
    { name: "Scribe", icon: "📖", desc: "自动捕捉操作并生成带截图的步骤指南，用 AI 快速输出流程文档和 SOP。", category: "productivity", tags: ["文档生成", "SOP"], link: "https://scribehow.com" },
    { name: "Fireflies", icon: "🔥", desc: "AI 会议助手，自动录制、转录、总结会议，支持搜索会议内容，集成主流会议平台。", category: "productivity", tags: ["会议记录", "AI助手"], link: "https://fireflies.ai" },
    { name: "Fathom", icon: "🎯", desc: "免费 AI 会议笔记工具，自动录制、转录、高亮和总结会议，支持 Zoom、Teams、Meet。", category: "productivity", tags: ["会议记录", "免费"], link: "https://fathom.video" },
    { name: "TL;DV", icon: "⏱️", desc: "AI 会议录制和笔记工具，自动转录和总结，支持时间戳标记，集成 Zoom、Google Meet。", category: "productivity", tags: ["会议记录", "转录"], link: "https://tldv.io" },
    { name: "Grammarly", icon: "✏️", desc: "跨平台 AI 写作助手，提供实时语法、风格、语气检查和文本建议。", category: "productivity", tags: ["写作", "语法检查"], link: "https://www.grammarly.com" },
    { name: "Wolfram Alpha", icon: "🧮", desc: "AI 驱动的计算知识引擎，回答数学、科学、历史等专业问题，提供精确计算和数据。", category: "productivity", tags: ["计算", "知识引擎"], link: "https://www.wolframalpha.com" },
    { name: "Canva", icon: "🎨", desc: "拖放式多功能设计平台，提供 AI 智能模板，用于社交媒体图形、演示文稿和视频创作。", category: "productivity", tags: ["设计", "模板"], link: "https://www.canva.com" },
    { name: "Durable", icon: "🏗️", desc: "AI 网站构建器，30 秒内创建完整商业网站，包含文案、图片、联系表单和在线商店。", category: "productivity", tags: ["网站构建", "AI建站"], link: "https://durable.co" },
    { name: "Taskade", icon: "✅", desc: "AI 任务管理和协作平台，结构化列表、笔记、思维导图，支持 AI 代理自动化任务。", category: "productivity", tags: ["任务管理", "协作"], link: "https://www.taskade.com" },
    { name: "Motion", icon: "🤖", desc: "AI 项目和时间管理助手，自动规划任务和日程，智能排优先级，提升工作效率。", category: "productivity", tags: ["时间管理", "AI规划"], link: "https://www.usemotion.com" },
    { name: "Bardeen", icon: "🤖", desc: "AI 自动化工具，用自然语言创建自动化流程，自动执行网页操作、数据提取和任务。", category: "productivity", tags: ["自动化", "浏览器"], link: "https://www.bardeen.ai" }
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
        <div class="tool-card" style="animation-delay: ${Math.min(index * 0.03, 1)}s">
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
