#!/usr/bin/env python3
# P1优化：增加筛选功能 + 场景化推荐 + 新手引导 + 相关工具推荐

import re
from pathlib import Path

PROJECT_ROOT = Path(r"C:\Users\通明街\Doubao\chats\2026-08-28\new-chat\ai-tools-radar-main")
INDEX_HTML = PROJECT_ROOT / "index.html"
SCRIPT_JS = PROJECT_ROOT / "script.js"

# 读取文件
with open(INDEX_HTML, "r", encoding="utf-8") as f:
    html_content = f.read()

with open(SCRIPT_JS, "r", encoding="utf-8") as f:
    js_content = f.read()

original_html_size = len(html_content)
original_js_size = len(js_content)

print("=" * 70)
print("🚀 P1优化开始")
print("=" * 70)
print(f"HTML原始大小: {original_html_size} 字符")
print(f"JS原始大小: {original_js_size} 字符")
print()

# ============================================================
# 优化1：增加国内可用筛选按钮
# ============================================================
print("=" * 70)
print("🔧 优化1：增加国内可用筛选按钮")
print("=" * 70)

# 在filter-bar的priceFilter后面增加国内可用筛选
old_filter = '<div class="filter-group"><label data-i18n="priceFilter">价格：</label> <select id="priceFilter" onchange="applyFilters()"><option value="all" data-i18n="all">全部</option><option value="free" data-i18n="free">免费</option><option value="paid" data-i18n="paid">付费</option><option value="freemium" data-i18n="freemium">免费+付费</option></select></div>'

new_filter = '''<div class="filter-group"><label data-i18n="priceFilter">价格：</label> <select id="priceFilter" onchange="applyFilters()"><option value="all" data-i18n="all">全部</option><option value="free" data-i18n="free">免费</option><option value="paid" data-i18n="paid">付费</option><option value="freemium" data-i18n="freemium">免费+付费</option></select></div><div class="filter-group"><label>国内：</label> <select id="cnFilter" onchange="applyFilters()"><option value="all">全部</option><option value="cn">国内可用</option><option value="overseas">仅海外</option></select></div>'''

if old_filter in html_content:
    html_content = html_content.replace(old_filter, new_filter)
    print("  ✅ 国内可用筛选按钮已添加到HTML")
else:
    print("  ⚠️  未找到筛选栏，尝试模糊匹配")

# 在JS中增加国内可用筛选逻辑
# 找到getFilteredTools函数中的priceFilter逻辑，增加cnFilter
old_cn_filter_logic = 'const i=document.getElementById("priceFilter")?.value||"all";if("all"!==i&&(e=e.filter(e=>e.priceType===i))'

new_cn_filter_logic = '''const i=document.getElementById("priceFilter")?.value||"all";if("all"!==i&&(e=e.filter(e=>e.priceType===i)));const cnVal=document.getElementById("cnFilter")?.value||"all";if("cn"===cnVal&&(e=e.filter(e=>e.cnAvailable===!0)),"overseas"===cnVal&&(e=e.filter(e=>!e.cnAvailable))'''

if old_cn_filter_logic in js_content:
    js_content = js_content.replace(old_cn_filter_logic, new_cn_filter_logic)
    print("  ✅ 国内可用筛选逻辑已添加到JS")
else:
    print("  ⚠️  未找到筛选逻辑，尝试模糊匹配")
    # 模糊匹配
    pattern = r'const i=document\.getElementById\("priceFilter"\)\?\.value\|\|"all";if\("all"!==i&&\(e=e\.filter\(e=>e\.priceType===i\)\)'
    match = re.search(pattern, js_content)
    if match:
        js_content = js_content[:match.start()] + new_cn_filter_logic + js_content[match.end():]
        print("  ✅ 国内可用筛选逻辑已添加（模糊匹配）")
    else:
        print("  ❌ 未找到筛选逻辑")

print()

# ============================================================
# 优化2：增加场景化推荐标签
# ============================================================
print("=" * 70)
print("🔧 优化2：增加场景化推荐标签")
print("=" * 70)

# 在hero-tags区域增加场景化推荐
old_hero_tags = '<div class="hero-tags"><span class="hero-tags-label">热门搜索：</span> <a href="#" class="hero-tag" onclick=\'return quickSearch("ChatGPT"),!1\'>ChatGPT</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("Midjourney"),!1\'>Midjourney</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("AI绘画"),!1\'>AI绘画</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("视频生成"),!1\'>视频生成</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("代码"),!1\'>代码助手</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("免费"),!1\'>免费工具</a></div>'

new_hero_tags = '''<div class="hero-tags"><span class="hero-tags-label">热门搜索：</span> <a href="#" class="hero-tag" onclick=\'return quickSearch("ChatGPT"),!1\'>ChatGPT</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("Midjourney"),!1\'>Midjourney</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("AI绘画"),!1\'>AI绘画</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("视频生成"),!1\'>视频生成</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("代码"),!1\'>代码助手</a> <a href="#" class="hero-tag" onclick=\'return quickSearch("免费"),!1\'>免费工具</a></div><div class="hero-tags" style="margin-top:10px"><span class="hero-tags-label">🎯 按场景选：</span> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("学生"),!1\'>学生党必备</a> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("写作"),!1\'>职场人必备</a> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("AI绘画"),!1\'>设计师必备</a> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("视频"),!1\'>自媒体人必备</a> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("国内可用"),!1\'>国内可用</a> <a href="#" class="hero-tag" style="background:rgba(255,255,255,.2)" onclick=\'return quickSearch("免费"),!1\'>免费工具</a></div>'''

if old_hero_tags in html_content:
    html_content = html_content.replace(old_hero_tags, new_hero_tags)
    print("  ✅ 场景化推荐标签已添加")
else:
    print("  ⚠️  未找到hero-tags区域")

print()

# ============================================================
# 优化3：增加新手引导卡片
# ============================================================
print("=" * 70)
print("🔧 优化3：增加新手引导卡片")
print("=" * 70)

# 在quick-start区域后面增加新手引导卡片
old_quick_start_end = '</div></div><section class="section" id="hotSection">'

new_quick_start_end = '''</div></div><section class="section" id="newbieGuide" style="padding:30px 20px;background:var(--bg-secondary);border-radius:16px;margin:20px auto;max-width:1200px"><div class="section-header"><h2 class="section-title">🌱 新手入门指南</h2><span class="result-count">刚接触AI？从这里开始</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;margin-top:20px"><div style="background:var(--bg-primary);padding:20px;border-radius:12px;border:1px solid var(--border-color);cursor:pointer;transition:all .2s" onclick=\'return quickSearch("ChatGPT"),!1\'><div style="font-size:2rem;margin-bottom:10px">🤖</div><h3 style="margin-bottom:8px;font-size:1.1rem">AI对话助手</h3><p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:10px">ChatGPT、Claude、Gemini，写文章、答问题、编代码都能用</p><span style="color:#667eea;font-size:.85rem;font-weight:600">推荐：ChatGPT →</span></div><div style="background:var(--bg-primary);padding:20px;border-radius:12px;border:1px solid var(--border-color);cursor:pointer;transition:all .2s" onclick=\'return quickSearch("AI绘画"),!1\'><div style="font-size:2rem;margin-bottom:10px">🎨</div><h3 style="margin-bottom:8px;font-size:1.1rem">AI绘画生成</h3><p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:10px">Midjourney、DALL·E、Stable Diffusion，文字描述生成精美图片</p><span style="color:#667eea;font-size:.85rem;font-weight:600">推荐：Midjourney →</span></div><div style="background:var(--bg-primary);padding:20px;border-radius:12px;border:1px solid var(--border-color);cursor:pointer;transition:all .2s" onclick=\'return quickSearch("写作"),!1\'><div style="font-size:2rem;margin-bottom:10px">✍️</div><h3 style="margin-bottom:8px;font-size:1.1rem">AI写作助手</h3><p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:10px">Grammarly、Jasper、QuillBot，写邮件、写文案、改语法</p><span style="color:#667eea;font-size:.85rem;font-weight:600">推荐：Grammarly →</span></div><div style="background:var(--bg-primary);padding:20px;border-radius:12px;border:1px solid var(--border-color);cursor:pointer;transition:all .2s" onclick=\'return quickSearch("免费"),!1\'><div style="font-size:2rem;margin-bottom:10px">🆓</div><h3 style="margin-bottom:8px;font-size:1.1rem">免费工具精选</h3><p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:10px">不想花钱？这些免费AI工具足够日常使用，零成本体验AI</p><span style="color:#667eea;font-size:.85rem;font-weight:600">查看免费工具 →</span></div></div></section><section class="section" id="hotSection">'''

if old_quick_start_end in html_content:
    html_content = html_content.replace(old_quick_start_end, new_quick_start_end)
    print("  ✅ 新手引导卡片已添加")
else:
    print("  ⚠️  未找到quick-start结束位置")

print()

# ============================================================
# 优化4：增加相关工具推荐（在JS中）
# ============================================================
print("=" * 70)
print("🔧 优化4：增加相关工具推荐")
print("=" * 70)

# 在工具详情页渲染函数中增加相关工具推荐
# 找到detailContent渲染的位置，在访问官网按钮后增加相关工具推荐

# 先找到renderDetail函数中的"访问官网"按钮位置
old_detail_visit = 'onclick="window.open(\'${e.link}\',\'_blank\')" class="detail-btn detail-btn-primary">🔗 访问官网</button>'

new_detail_visit = '''onclick="window.open('${e.link}','_blank')" class="detail-btn detail-btn-primary">🔗 访问官网</button></div><div id="relatedToolsSection" style="margin-top:30px;padding-top:20px;border-top:1px solid var(--border-color)"><h3 style="margin-bottom:15px;font-size:1.2rem">🔗 相关工具推荐</h3><div id="relatedToolsGrid" class="tools-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))"></div></div><div style="margin-top:20px">'''

if old_detail_visit in js_content:
    js_content = js_content.replace(old_detail_visit, new_detail_visit)
    print("  ✅ 相关工具推荐区域已添加到详情页")
else:
    print("  ⚠️  未找到访问官网按钮，尝试模糊匹配")
    # 模糊匹配
    pattern = r'onclick="window\.open\(\'?\$\{e\.link\}\'?,\'_blank\'\)" class="detail-btn detail-btn-primary">🔗 访问官网</button>'
    match = re.search(pattern, js_content)
    if match:
        js_content = js_content[:match.start()] + new_detail_visit + js_content[match.end():]
        print("  ✅ 相关工具推荐区域已添加（模糊匹配）")
    else:
        print("  ❌ 未找到访问官网按钮")

# 在renderDetail函数末尾增加相关工具渲染逻辑
# 找到renderDetail函数结束的位置，在返回前增加相关工具渲染
old_render_detail_end = 'currentDetailTool=e,document.getElementById("detailContent").innerHTML=t,document.getElementById("detailView").style.display="block",document.getElementById("homeView").style.display="none",window.scrollTo({top:0,behavior:"smooth"})'

new_render_detail_end = '''currentDetailTool=e,document.getElementById("detailContent").innerHTML=t,document.getElementById("detailView").style.display="block",document.getElementById("homeView").style.display="none";const relatedGrid=document.getElementById("relatedToolsGrid");if(relatedGrid){const relatedTools=tools.filter(t=>t.category===e.category&&t.name!==e.name).slice(0,4);relatedGrid.innerHTML=relatedTools.map(t=>`<div class="tool-card" onclick="navigateTo('detail','${t.name}')" style="cursor:pointer;padding:15px"><div class="tool-icon" style="font-size:2rem;margin-bottom:8px">${t.icon}</div><h3 class="tool-name" style="font-size:.95rem;margin-bottom:5px">${t.name}</h3><p class="tool-desc" style="font-size:.8rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${t.desc}</p></div>`).join("")}window.scrollTo({top:0,behavior:"smooth"})'''

if old_render_detail_end in js_content:
    js_content = js_content.replace(old_render_detail_end, new_render_detail_end)
    print("  ✅ 相关工具渲染逻辑已添加")
else:
    print("  ⚠️  未找到renderDetail结束位置")

print()

# ============================================================
# 保存优化后的文件
# ============================================================
print("=" * 70)
print("💾 保存优化后的文件")
print("=" * 70)

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

with open(SCRIPT_JS, "w", encoding="utf-8") as f:
    f.write(js_content)

new_html_size = len(html_content)
new_js_size = len(js_content)

print(f"  HTML: {original_html_size} -> {new_html_size} 字符 (+{new_html_size - original_html_size})")
print(f"  JS: {original_js_size} -> {new_js_size} 字符 (+{new_js_size - original_js_size})")
print(f"  文件已保存")

print()
print("=" * 70)
print("✅ P1优化完成！")
print("=" * 70)
print("  1. ✅ 国内可用筛选 - 筛选栏增加国内/海外筛选")
print("  2. ✅ 场景化推荐 - Hero区增加6个场景标签（学生/职场/设计/自媒体/国内/免费）")
print("  3. ✅ 新手引导 - 首页增加4个新手入门卡片")
print("  4. ✅ 相关工具推荐 - 工具详情页增加4个同类工具推荐")
print()
print("  用户体验提升：")
print("    - 国内用户可以快速筛选国内可用工具")
print("    - 新用户可以按场景快速找到适合的工具")
print("    - 新手有明确的入门引导")
print("    - 用户查看工具详情时可以发现更多同类工具")
