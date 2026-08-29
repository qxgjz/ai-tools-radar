#!/usr/bin/env python3
# 批量采集Top 50工具官网详情
# 使用Firecrawl + ToolWebsiteScraper自动提取功能/定价/目标用户

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from scrapers.tool_website_scraper import ToolWebsiteScraper

PROJECT_ROOT = Path(r"C:\Users\通明街\Doubao\chats\2026-08-28\new-chat\ai-tools-radar-main")
TOP50_FILE = PROJECT_ROOT / "automation" / "data" / "processed" / "top50_tools.json"
OUTPUT_FILE = PROJECT_ROOT / "automation" / "data" / "processed" / "top50_tool_details.json"

# 读取Top 50列表
with open(TOP50_FILE, "r", encoding="utf-8") as f:
    top50_data = json.load(f)
top50_tools = top50_data["tools"]

# 工具官网URL映射（部分工具需要手动指定URL）
TOOL_URLS = {
    "ChatGPT": "https://chat.openai.com",
    "Claude": "https://claude.ai",
    "Gemini": "https://gemini.google.com",
    "Grammarly": "https://www.grammarly.com",
    "Jasper": "https://www.jasper.ai",
    "Copy.ai": "https://www.copy.ai",
    "Writesonic": "https://writesonic.com",
    "QuillBot": "https://quillbot.com",
    "Wordtune": "https://www.wordtune.com",
    "Rytr": "https://rytr.me",
    "Frase": "https://www.frase.io",
    "Surfer SEO": "https://surferseo.com",
    "Notion AI": "https://www.notion.so/product/ai",
    "HyperWrite": "https://hyperwriteai.com",
    "TextCortex": "https://textcortex.com",
    "Midjourney": "https://www.midjourney.com",
    "DALL·E 3": "https://openai.com/dall-e-3",
    "Canva AI": "https://www.canva.com",
    "Stable Diffusion": "https://stability.ai/stablediffusion",
    "Adobe Firefly": "https://firefly.adobe.com",
    "Leonardo.ai": "https://leonardo.ai",
    "Ideogram": "https://ideogram.ai",
    "Recraft": "https://www.recraft.ai",
    "Remove.bg": "https://www.remove.bg",
    "ClipDrop": "https://clipdrop.co",
    "Playground AI": "https://playground.com",
    "NightCafe": "https://creator.nightcafe.studio",
    "Artbreeder": "https://www.artbreeder.com",
    "Krea": "https://www.krea.ai",
    "Fotor": "https://www.fotor.com",
    "Sora": "https://openai.com/sora",
    "Runway": "https://runwayml.com",
    "Pika": "https://pika.art",
    "HeyGen": "https://www.heygen.com",
    "CapCut": "https://www.capcut.com",
    "Kling": "https://www.klingai.com",
    "Veo": "https://deepmind.google/models/veo",
    "Fliki": "https://fliki.ai",
    "OpusClip": "https://www.opus.pro",
    "Synthesia": "https://www.synthesia.io",
    "Descript": "https://www.descript.com",
    "VEED.IO": "https://www.veed.io",
    "Invideo": "https://invideo.io",
    "Lumen5": "https://lumen5.com",
    "D-ID": "https://www.d-id.com",
    "ElevenLabs": "https://elevenlabs.io",
    "Suno": "https://suno.com",
    "Udio": "https://www.udio.com",
    "Replit": "https://replit.com",
    "v0": "https://v0.dev",
    "Perplexity": "https://www.perplexity.ai",
}

print("=" * 70)
print("🔍 Top 50工具官网详情批量采集")
print("=" * 70)
print(f"工具数量: {len(top50_tools)}")
print(f"预计耗时: 5-15分钟")
print("=" * 70)

# 创建爬虫
scraper = ToolWebsiteScraper()

# 准备工具列表
tools_to_scrape = []
for tool_name in top50_tools:
    url = TOOL_URLS.get(tool_name)
    if url:
        tools_to_scrape.append({"name": tool_name, "url": url})
    else:
        print(f"  ⚠️  跳过 {tool_name}（无URL映射）")

print(f"\n📋 待采集工具: {len(tools_to_scrape)} 个")

# 批量采集
results = scraper.batch_scrape_tools(tools_to_scrape, delay=3)

# 保存结果
output_data = {
    "total": len(results),
    "success": sum(1 for r in results if r.get("features")),
    "scraped_at": "2026-08-29",
    "tools": results,
}

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 70)
print(f"✅ 采集完成: {output_data['success']}/{len(results)} 个工具成功采集详情")
print(f"💾 结果已保存: {OUTPUT_FILE}")
print("=" * 70)

# 打印采集成功的工具
print("\n📊 采集结果:")
for i, tool in enumerate(results, 1):
    name = tool.get("name", "Unknown")
    features_count = len(tool.get("features", []))
    pricing = tool.get("pricing", "N/A")[:40]
    status = "✅" if features_count > 0 else "⚠️"
    print(f"  {i:2d}. {status} {name[:25]:<27} 功能:{features_count:2d}个  定价:{pricing}")
