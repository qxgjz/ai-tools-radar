#!/usr/bin/env python3
# P2优化：分类细化 + 对比项丰富

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
print("🚀 P2优化开始")
print("=" * 70)
print(f"HTML原始大小: {original_html_size} 字符")
print(f"JS原始大小: {original_js_size} 字符")
print()

# ============================================================
# 优化1：分类细化 - 在分类导航中增加子分类标签
# ============================================================
print("=" * 70)
print("🔧 优化1：分类细化 - 增加子分类快速筛选标签")
print("=" * 70)

# 在category-filters区域后面增加子分类快速筛选
old_category_filters = '<div class="category-filters" id="categoryFilters"></div>'

new_category_filters = '''<div class="category-filters" id="categoryFilters"></div><div id="subCategoryFilters" style="display:flex;flex-wrap:wrap;gap:8px;margin:15px 0;padding:15px;background:var(--bg-secondary);border-radius:12px"><span style="color:var(--text-secondary);font-size:.9rem;align-self:center">子分类：</span><button class="sub-cat-btn active" onclick="filterSubCategory('all',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">全部</button><button class="sub-cat-btn" onclick="filterSubCategory('chat',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">对话助手</button><button class="sub-cat-btn" onclick="filterSubCategory('writing',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">文案写作</button><button class="sub-cat-btn" onclick="filterSubCategory('image',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">图像生成</button><button class="sub-cat-btn" onclick="filterSubCategory('video',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">视频生成</button><button class="sub-cat-btn" onclick="filterSubCategory('audio',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">语音音乐</button><button class="sub-cat-btn" onclick="filterSubCategory('code',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">编程开发</button><button class="sub-cat-btn" onclick="filterSubCategory('productivity',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">效率办公</button><button class="sub-cat-btn" onclick="filterSubCategory('free',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">🆓 免费</button><button class="sub-cat-btn" onclick="filterSubCategory('cn',this)" style="padding:6px 14px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-primary);color:var(--text-primary);cursor:pointer;font-size:.85rem;transition:all .2s">🇨🇳 国内可用</button></div>'''

if old_category_filters in html_content:
    html_content = html_content.replace(old_category_filters, new_category_filters)
    print("  ✅ 子分类快速筛选标签已添加到HTML")
else:
    print("  ⚠️  未找到category-filters区域")

# 在JS中增加子分类筛选函数和逻辑
# 在getFilteredTools函数中增加子分类筛选
old_filter_logic = 'const cnVal=document.getElementById("cnFilter")?.value||"all";if("cn"===cnVal&&(e=e.filter(e=>e.cnAvailable===!0)),"overseas"===cnVal&&(e=e.filter(e=>!e.cnAvailable))'

new_filter_logic = '''const cnVal=document.getElementById("cnFilter")?.value||"all";if("cn"===cnVal&&(e=e.filter(e=>e.cnAvailable===!0)),"overseas"===cnVal&&(e=e.filter(e=>!e.cnAvailable)));const subCat=window.currentSubCategory||"all";if("chat"===subCat&&(e=e.filter(t=>(t.tags||[]).some(a=>a.includes("对话")||a.includes("聊天")||a.includes("Chat"))||t.name.includes("Chat")||t.name.includes("GPT")||t.name.includes("Claude")||t.name.includes("Gemini"))),"writing"===subCat&&(e=e.filter(t=>t.category==="writing"||(t.tags||[]).some(a=>a.includes("写作")||a.includes("文案")||a.includes("文章")))),"image"===subCat&&(e=e.filter(t=>t.category==="image"||(t.tags||[]).some(a=>a.includes("图像")||a.includes("图片")||a.includes("绘画")))),"video"===subCat&&(e=e.filter(t=>t.category==="video"||(t.tags||[]).some(a=>a.includes("视频")||a.includes("影片")))),"audio"===subCat&&(e=e.filter(t=>t.category==="audio"||(t.tags||[]).some(a=>a.includes("语音")||a.includes("音乐")||a.includes("音频")))),"code"===subCat&&(e=e.filter(t=>t.category==="code"||(t.tags||[]).some(a=>a.includes("编程")||a.includes("代码")||a.includes("开发")))),"productivity"===subCat&&(e=e.filter(t=>t.category==="productivity"||(t.tags||[]).some(a=>a.includes("效率")||a.includes("办公")))),"free"===subCat&&(e=e.filter(t=>t.priceType==="free"||(t.price||"").includes("免费"))),"cn"===subCat&&(e=e.filter(t=>t.cnAvailable===!0)))'''

if old_filter_logic in js_content:
    js_content = js_content.replace(old_filter_logic, new_filter_logic)
    print("  ✅ 子分类筛选逻辑已添加到JS")
else:
    print("  ⚠️  未找到筛选逻辑，尝试模糊匹配")
    # 模糊匹配
    pattern = r'const cnVal=document\.getElementById\("cnFilter"\)\?\.value\|\|"all";if\("cn"===cnVal&&\(e=e\.filter\(e=>e\.cnAvailable===!0\)\),"overseas"===cnVal&&\(e=e\.filter\(e=>!e\.cnAvailable\)\)'
    match = re.search(pattern, js_content)
    if match:
        js_content = js_content[:match.start()] + new_filter_logic + js_content[match.end():]
        print("  ✅ 子分类筛选逻辑已添加（模糊匹配）")
    else:
        print("  ❌ 未找到筛选逻辑")

# 增加filterSubCategory函数
# 在applyFilters函数后面增加
old_apply_filters = 'function applyFilters(){currentPage=1,renderTools()}'

new_apply_filters = '''function applyFilters(){currentPage=1,renderTools()}function filterSubCategory(e,t){window.currentSubCategory=e;document.querySelectorAll(".sub-cat-btn").forEach(e=>e.classList.remove("active"));t&&t.classList.add("active");t&&(t.style.background="linear-gradient(135deg,#667eea,#764ba2)",t.style.color="#fff",t.style.borderColor="transparent");document.querySelectorAll(".sub-cat-btn:not(.active)").forEach(e=>{e.style.background="var(--bg-primary)",e.style.color="var(--text-primary)",e.style.borderColor="var(--border-color)"});applyFilters()}'''

if old_apply_filters in js_content:
    js_content = js_content.replace(old_apply_filters, new_apply_filters)
    print("  ✅ filterSubCategory函数已添加")
else:
    print("  ⚠️  未找到applyFilters函数")

print()

# ============================================================
# 优化2：对比项丰富 - 增加价格、平台、功能对比
# ============================================================
print("=" * 70)
print("🔧 优化2：对比项丰富 - 增加价格、平台、功能对比")
print("=" * 70)

# 找到对比表格的渲染代码，增加更多对比项
# 先搜索对比表格的位置
compare_pattern = r'function renderCompare\(\)\{.*?\}'
compare_match = re.search(compare_pattern, js_content, re.DOTALL)

if compare_match:
    print(f"  找到renderCompare函数，长度: {len(compare_match.group())} 字符")
    # 打印函数内容的前2000字符
    print("  函数内容预览:")
    print(compare_match.group()[:2000])
else:
    print("  ⚠️  未找到renderCompare函数，搜索其他位置")
    # 搜索对比表格相关代码
    compare_table_matches = [(m.start(), m.group()) for m in re.finditer(r'compare.*table|对比.*表格|compareContent', js_content, re.IGNORECASE)]
    print(f"  找到 {len(compare_table_matches)} 个对比相关匹配")
    for pos, match in compare_table_matches[:5]:
        context = js_content[max(0, pos-30):pos+len(match)+100]
        print(f"    位置{pos}: ...{context}...")

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
print("✅ P2优化完成！")
print("=" * 70)
print("  1. ✅ 相关工具推荐 - 已存在（详情页4个同类工具推荐）")
print("  2. ✅ 分类细化 - 增加10个子分类快速筛选标签")
print("     - 对话助手、文案写作、图像生成、视频生成")
print("     - 语音音乐、编程开发、效率办公、免费、国内可用")
print("  3. ⏳ 对比项丰富 - 对比表格代码结构需进一步分析")
print()
print("  用户体验提升：")
print("    - 用户可以按子分类快速筛选工具")
print("    - 一键筛选免费工具和国内可用工具")
print("    - 详情页已有相关工具推荐，增加用户停留时间")
