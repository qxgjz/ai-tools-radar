#!/usr/bin/env python3
# 确定Top 50热门工具列表

import re
import json
from pathlib import Path

PROJECT_ROOT = Path(r"C:\Users\通明街\Doubao\chats\2026-08-28\new-chat\ai-tools-radar-main")
SCRIPT_JS = PROJECT_ROOT / "script.js"
OUTPUT_FILE = PROJECT_ROOT / "automation" / "data" / "processed" / "top50_tools.json"

# 读取script.js
with open(SCRIPT_JS, "r", encoding="utf-8") as f:
    content = f.read()

# 提取hotTools
hot_match = re.search(r'hotTools=\[(.*?)\]', content)
hot_tools = []
if hot_match:
    hot_str = hot_match.group(1)
    hot_tools = re.findall(r'"([^"]+)"', hot_str)

print("🔥 网站热门工具 (hotTools):")
for i, tool in enumerate(hot_tools, 1):
    print(f"  {i}. {tool}")

# 提取所有工具，按分类统计
tools_match = re.search(r'const tools=\[(.*?)\],categories=', content, re.DOTALL)
if tools_match:
    tools_str = tools_match.group(1)
    tool_entries = re.findall(r'\{name:"([^"]+)".*?category:"([^"]+)"', tools_str)

    print(f"\n📊 所有工具统计: {len(tool_entries)} 个")

    categories = {}
    for name, cat in tool_entries:
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(name)

    for cat, tools in sorted(categories.items(), key=lambda x: -len(x[1])):
        cat_name = {"writing": "写作", "image": "图像", "video": "视频",
                    "audio": "音频", "code": "编程", "productivity": "效率"}.get(cat, cat)
        print(f"  {cat_name}({cat}): {len(tools)} 个")

# 确定Top 50热门工具
top50 = list(hot_tools)

category_priority = {
    "writing": ["ChatGPT", "Claude", "Gemini", "Grammarly", "Jasper", "Copy.ai", "Writesonic", "QuillBot", "Wordtune", "Rytr", "Frase", "Surfer SEO", "Notion AI", "HyperWrite", "TextCortex"],
    "image": ["Midjourney", "DALL·E 3", "Canva AI", "Stable Diffusion", "Adobe Firefly", "Leonardo.ai", "Ideogram", "Recraft", "Remove.bg", "ClipDrop", "Playground AI", "NightCafe", "Artbreeder", "Krea", "Fotor"],
    "video": ["Sora", "Runway", "Pika", "HeyGen", "CapCut", "Kling", "Veo", "Fliki", "OpusClip", "Synthesia", "Descript", "VEED.IO", "Invideo", "Lumen5", "D-ID"],
    "audio": ["ElevenLabs", "Suno", "Udio", "Murf", "Play.ht", "Speechify", "AIVA", "Soundraw", "Boomy", "Adobe Enhance", "Lovo", "Mubert", "Soundful", "Resemble AI", "WellSaid Labs"],
    "code": ["GitHub Copilot", "Cursor", "v0", "Replit", "Bolt.new", "Lovable", "CodeGeeX", "Sourcegraph Cody", "CodeWP", "Devin", "StackBlitz", "CodePen", "GitHub Codespaces", "Gitpod", "CodeSandbox"],
    "productivity": ["Notion", "Perplexity", "Gamma", "Otter.ai", "Zapier AI", "n8n", "Calendly", "Tally", "Scribe", "Fireflies", "Fathom", "TL;DV", "Wolfram Alpha", "Canva", "Motion"],
}

for cat, tools in category_priority.items():
    for tool in tools:
        if tool not in top50 and len(top50) < 50:
            top50.append(tool)

print(f"\n🎯 Top 50热门工具列表（共{len(top50)}个）:")
for i, tool in enumerate(top50, 1):
    print(f"  {i:2d}. {tool}")

# 保存Top 50列表
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump({"tools": top50, "count": len(top50)}, f, ensure_ascii=False, indent=2)

print(f"\n💾 Top 50列表已保存: {OUTPUT_FILE}")
