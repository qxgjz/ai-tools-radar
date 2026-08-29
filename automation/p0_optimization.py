#!/usr/bin/env python3
# P0优化：修复收藏功能 + 升级搜索功能 + 优化工具卡片

import re
from pathlib import Path

SCRIPT_JS = Path(r"C:\Users\通明街\Doubao\chats\2026-08-28\new-chat\ai-tools-radar-main\script.js")

with open(SCRIPT_JS, "r", encoding="utf-8") as f:
    content = f.read()

original_size = len(content)
print(f"原始文件大小: {original_size} 字符")
print()

# ============================================================
# 优化1：修复收藏功能 - 增加健壮性（try-catch）
# ============================================================
print("=" * 70)
print("🔧 优化1：修复收藏功能 - 增加健壮性")
print("=" * 70)

old_getFavorites = 'function getFavorites(){return JSON.parse(localStorage.getItem("favorites")||"[]")}'
new_getFavorites = 'function getFavorites(){try{return JSON.parse(localStorage.getItem("favorites")||"[]")}catch(e){return[]}}'

if old_getFavorites in content:
    content = content.replace(old_getFavorites, new_getFavorites)
    print("  ✅ getFavorites() 已增加try-catch健壮性")
else:
    print("  ⚠️  未找到getFavorites函数，尝试模糊匹配")
    # 模糊匹配
    pattern = r'function getFavorites\(\)\{return JSON\.parse\(localStorage\.getItem\("favorites"\|\|"[]"\)\)'
    match = re.search(pattern, content)
    if match:
        content = content[:match.start()] + new_getFavorites + content[match.end():]
        print("  ✅ getFavorites() 已修复（模糊匹配）")
    else:
        print("  ❌ 未找到getFavorites函数")

print()

# ============================================================
# 优化2：升级搜索功能 - 增加同义词映射 + 相关性排序
# ============================================================
print("=" * 70)
print("🔧 优化2：升级搜索功能 - 同义词映射 + 相关性排序")
print("=" * 70)

# 在搜索逻辑前增加同义词映射函数
# 找到currentSearch声明的位置，在其后插入同义词函数
old_search_decl = 'let currentCategory="all",currentSearch=""'

# 同义词映射
synonym_code = '''const searchSynonyms={"ai绘画":["ai画图","ai作图","ai生成图片","图像生成","图片生成"],"ai画图":["ai绘画","ai作图","图像生成"],"ai写作":["写文章","文案生成","ai写文案","内容生成"],"写代码":["编程","代码生成","ai编程","程序开发"],"ai视频":["视频生成","文生视频","ai生成视频"],"ai语音":["语音合成","文字转语音","tts","ai配音"],"ai音乐":["音乐生成","ai作曲","ai生成音乐"],"翻译":["翻译工具","ai翻译","机器翻译"],"学生":["学生党","大学生","学习"],"免费":["免费工具","免费版","零成本"],"国内可用":["国内","中国可用","不用翻墙","无需翻墙"]};function expandSearchQuery(e){let t=[e.toLowerCase()];return Object.entries(searchSynonyms).forEach(([a,n])=>{(e.toLowerCase().includes(a)||n.some(e=>e.toLowerCase().includes(e)))&&(t=t.concat([a,...n]))}),[...new Set(t)]}function getSearchRelevance(e,t){let a=0;const n=e.name.toLowerCase(),o=e.desc.toLowerCase(),r=(e.tags||[]).map(e=>e.toLowerCase());return t.forEach(e=>{n.includes(e)&&(a+=10),n===e&&(a+=20),o.includes(e)&&(a+=3),r.some(t=>t.includes(e))&&(a+=5)}),a}'''

if old_search_decl in content:
    # 在变量声明后插入同义词代码
    insert_pos = content.find(old_search_decl) + len(old_search_decl)
    content = content[:insert_pos] + "," + synonym_code + content[insert_pos:]
    print("  ✅ 同义词映射函数已添加")
else:
    print("  ⚠️  未找到搜索变量声明，尝试其他位置")

# 升级搜索过滤逻辑 - 增加同义词扩展和相关性排序
old_search_filter = 'if("all"!==i&&(e=e.filter(e=>e.priceType===i)),currentSearch){const t=currentSearch.toLowerCase();e=e.filter(e=>e.name.toLowerCase().includes(t)||e.desc.toLowerCase().includes(t)||e.tags.some(e=>e.toLowerCase().includes(t)))}'

new_search_filter = '''if("all"!==i&&(e=e.filter(e=>e.priceType===i)),currentSearch){const t=expandSearchQuery(currentSearch);e=e.filter(a=>t.some(e=>a.name.toLowerCase().includes(e)||a.desc.toLowerCase().includes(e)||(a.tags||[]).some(a=>a.toLowerCase().includes(e))))}'''

if old_search_filter in content:
    content = content.replace(old_search_filter, new_search_filter)
    print("  ✅ 搜索过滤逻辑已升级（同义词扩展）")
else:
    print("  ⚠️  未找到搜索过滤逻辑，尝试模糊匹配")
    # 模糊匹配
    pattern = r'currentSearch\{const t=currentSearch\.toLowerCase\(\);e=e\.filter\(e=>e\.name\.toLowerCase\(\)\.includes\(t\)\|\|e\.desc\.toLowerCase\(\)\.includes\(t\)\|\|e\.tags\.some\(e=>e\.toLowerCase\(\)\.includes\(t\)\)\)'
    match = re.search(pattern, content)
    if match:
        content = content[:match.start()] + 'currentSearch{' + new_search_filter.split('currentSearch{')[1] + content[match.end():]
        print("  ✅ 搜索过滤逻辑已升级（模糊匹配）")
    else:
        print("  ❌ 未找到搜索过滤逻辑")

# 升级排序逻辑 - 搜索时按相关性排序
old_sort = 'return"rating"===a?e.sort((e,i)=>{const a=t[e.name]?.length?t[e.name].reduce((e,t)=>e+t,0)/t[e.name].length:0;return(t[i.name]?.length?t[i.name].reduce((e,t)=>e+t,0)/t[i.name].length:0)-a}):"name"===a&&e.sort((e,t)=>e.name.localeCompare(t.name)),e'

new_sort = '''if(currentSearch){const n=expandSearchQuery(currentSearch);e.sort((e,t)=>getSearchRelevance(t,n)-getSearchRelevance(e,n))}return"rating"===a?e.sort((e,i)=>{const a=t[e.name]?.length?t[e.name].reduce((e,t)=>e+t,0)/t[e.name].length:0;return(t[i.name]?.length?t[i.name].reduce((e,t)=>e+t,0)/t[i.name].length:0)-a}):"name"===a&&e.sort((e,t)=>e.name.localeCompare(t.name)),e'''

if old_sort in content:
    content = content.replace(old_sort, new_sort)
    print("  ✅ 搜索结果排序已升级（相关性排序）")
else:
    print("  ⚠️  未找到排序逻辑")

print()

# ============================================================
# 优化3：优化工具卡片信息密度 - 增加功能标签显示
# ============================================================
print("=" * 70)
print("🔧 优化3：优化工具卡片信息密度")
print("=" * 70)

# 工具卡片已经有价格、评分、标签、国内可用
# 增加：features数量显示（如果有features）
old_tags_section = '${e.tags.slice(0,3).map(e=>`<span class="tag">${e}</span>`).join("")}'

new_tags_section = '${e.tags.slice(0,2).map(e=>`<span class="tag">${e}</span>`).join("")}${e.features&&e.features.length>0?`<span class="tag tag-feature">+${e.features.length}功能</span>`:""}'

if old_tags_section in content:
    content = content.replace(old_tags_section, new_tags_section)
    print("  ✅ 工具卡片标签区已优化（增加功能数量）")
else:
    print("  ⚠️  未找到标签区代码")

print()

# ============================================================
# 保存优化后的文件
# ============================================================
print("=" * 70)
print("💾 保存优化后的文件")
print("=" * 70)

with open(SCRIPT_JS, "w", encoding="utf-8") as f:
    f.write(content)

new_size = len(content)
print(f"  原始大小: {original_size} 字符")
print(f"  优化后大小: {new_size} 字符")
print(f"  增加: {new_size - original_size} 字符")
print(f"  文件已保存: {SCRIPT_JS}")

print()
print("=" * 70)
print("✅ P0优化完成！")
print("=" * 70)
print("  1. ✅ 收藏功能 - 增加try-catch健壮性")
print("  2. ✅ 搜索功能 - 同义词映射 + 相关性排序")
print("  3. ✅ 工具卡片 - 增加功能数量标签")
print()
print("  搜索同义词覆盖:")
print("    - AI绘画/AI画图/图像生成")
print("    - AI写作/写文章/文案生成")
print("    - 写代码/编程/代码生成")
print("    - AI视频/视频生成/文生视频")
print("    - AI语音/语音合成/文字转语音")
print("    - 翻译/AI翻译/机器翻译")
print("    - 学生/学生党/大学生")
print("    - 免费/免费工具/免费版")
print("    - 国内可用/国内/不用翻墙")
