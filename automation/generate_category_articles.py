#!/usr/bin/env python3
# 生成6篇"Best AI XXX Tools 2026"分类榜单文章
# 插入到script.js的blogPosts数组中

import re
import json
from pathlib import Path
from datetime import datetime, timedelta

PROJECT_ROOT = Path(r"C:\Users\通明街\Doubao\chats\2026-08-28\new-chat\ai-tools-radar-main")
SCRIPT_JS = PROJECT_ROOT / "script.js"

# 6篇分类榜单文章
NEW_ARTICLES = [
    {
        "id": "best-ai-writing-tools-2026",
        "title": "2026年10大最佳AI写作工具对比评测：从免费到专业全覆盖",
        "excerpt": "深度对比ChatGPT、Claude、Gemini、Grammarly、Jasper等10款主流AI写作工具，从写作质量、价格、易用性、适用场景等维度全面评测，帮你找到最适合的写作助手。学生、职场人、作家、营销人都能找到答案。",
        "category": "写作",
        "icon": "✍️",
        "date": "2026-08-29",
        "readTime": "15 分钟",
        "cover": "linear-gradient(135deg, #667eea, #764ba2)",
    },
    {
        "id": "best-ai-image-tools-2026",
        "title": "2026年12款最佳AI绘画工具全面评测：Midjourney、DALL·E、Stable Diffusion谁最强",
        "excerpt": "Midjourney、DALL·E 3、Stable Diffusion、Flux、Canva AI等12款AI绘画工具横向对比，含画质、提示词理解、易用性、价格、商用授权。设计师、自媒体人、电商卖家都能找到最适合的AI绘画工具。",
        "category": "图像",
        "icon": "🎨",
        "date": "2026-08-29",
        "readTime": "18 分钟",
        "cover": "linear-gradient(135deg, #f093fb, #f5576c)",
    },
    {
        "id": "best-ai-video-tools-2026",
        "title": "AI视频生成工具终极指南：Sora、Runway、可灵等10款对比，哪款最适合你",
        "excerpt": "文生视频、图生视频、数字人视频、AI剪辑，10款主流AI视频工具深度对比，含价格、画质、易用性、适用场景。短视频创作者、自媒体人、企业培训都能找到最适合的AI视频工具。",
        "category": "视频",
        "icon": "🎬",
        "date": "2026-08-29",
        "readTime": "16 分钟",
        "cover": "linear-gradient(135deg, #4facfe, #00f2fe)",
    },
    {
        "id": "best-ai-audio-tools-2026",
        "title": "AI语音合成与音乐生成工具对比：ElevenLabs、Suno、Murf等8款评测",
        "excerpt": "文字转语音、AI音乐生成、播客制作、语音克隆，8款主流AI音频工具深度评测，含音质、价格、支持语言、使用场景。有声书创作者、视频配音、播客主、音乐爱好者都能找到最适合的声音工具。",
        "category": "音频",
        "icon": "🎵",
        "date": "2026-08-29",
        "readTime": "14 分钟",
        "cover": "linear-gradient(135deg, #fa709a, #fee140)",
    },
    {
        "id": "best-ai-coding-tools-2026",
        "title": "程序员必备：10款最佳AI编程工具推荐，GitHub Copilot vs Cursor vs Claude Code深度对比",
        "excerpt": "从代码补全、Bug修复、代码解释、多文件编辑、价格等10个维度，深度对比GitHub Copilot、Cursor、v0、Replit等主流AI编程助手，帮你选择最适合的编程搭档，提升编码效率10倍。",
        "category": "编程",
        "icon": "💻",
        "date": "2026-08-29",
        "readTime": "16 分钟",
        "cover": "linear-gradient(135deg, #43e97b, #38f9d7)",
    },
    {
        "id": "best-ai-productivity-tools-2026",
        "title": "效率翻倍：15款AI办公效率工具推荐（2026最新），打工人到创业者都能用",
        "excerpt": "笔记整理、会议纪要、邮件写作、任务管理、文档处理、AI搜索，15款AI办公效率工具全覆盖，从打工人到创业者都能用，让你的工作效率提升10倍。Notion、Perplexity、Gamma、Otter.ai等热门工具深度评测。",
        "category": "效率",
        "icon": "⚡",
        "date": "2026-08-29",
        "readTime": "17 分钟",
        "cover": "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    },
]

print("=" * 70)
print("📝 生成6篇Best AI XXX Tools 2026文章")
print("=" * 70)

# 读取script.js
with open(SCRIPT_JS, "r", encoding="utf-8") as f:
    content = f.read()

# 找到blogPosts数组
match = re.search(r'blogPosts=\[(.*?)\],i18n=', content, re.DOTALL)
if not match:
    print("❌ 未找到blogPosts数组")
    exit(1)

blog_posts_str = match.group(1)

# 统计现有文章数量
existing_count = len(re.findall(r'\{id:"', blog_posts_str))
print(f"📊 现有文章数量: {existing_count} 篇")

# 检查新文章是否已存在
new_articles_to_add = []
for article in NEW_ARTICLES:
    if article["id"] in blog_posts_str:
        print(f"  ⚠️  文章已存在: {article['title'][:50]}...")
    else:
        new_articles_to_add.append(article)
        print(f"  ✅ 新增文章: {article['title'][:50]}...")

if not new_articles_to_add:
    print("\n所有文章已存在，无需添加")
    exit(0)

# 生成JS格式的文章对象
def generate_js_article(article):
    """生成JS格式的文章对象"""
    js = (
        f'{{id:"{article["id"]}",'
        f'title:"{article["title"]}",'
        f'excerpt:"{article["excerpt"]}",'
        f'category:"{article["category"]}",'
        f'icon:"{article["icon"]}",'
        f'date:"{article["date"]}",'
        f'readTime:"{article["readTime"]}",'
        f'cover:"{article["cover"]}"}}'
    )
    return js

# 在blogPosts数组开头插入新文章
new_articles_js = ",".join(generate_js_article(a) for a in new_articles_to_add)
new_blog_posts_str = new_articles_js + "," + blog_posts_str

# 替换blogPosts数组
new_content = content[:match.start(1)] + new_blog_posts_str + content[match.end(1):]

# 保存更新后的script.js
with open(SCRIPT_JS, "w", encoding="utf-8") as f:
    f.write(new_content)

print("\n" + "=" * 70)
print(f"✅ 文章生成完成: 新增 {len(new_articles_to_add)} 篇文章")
print(f"   文章总数: {existing_count + len(new_articles_to_add)} 篇")
print(f"   文件已保存: {SCRIPT_JS}")
print("=" * 70)
print("\n📋 新增文章列表:")
for i, article in enumerate(new_articles_to_add, 1):
    print(f"  {i}. [{article['icon']}] {article['category']} - {article['title'][:60]}...")
    print(f"     阅读时间: {article['readTime']} | 发布日期: {article['date']}")
