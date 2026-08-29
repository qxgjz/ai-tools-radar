# Firecrawl 爬虫集成文档

## 概述

Firecrawl是一个专为AI设计的网页抓取API，可以突破反爬，输出干净的Markdown/JSON。本项目集成了Firecrawl，用于采集G2、Capterra等反爬强的网站，以及工具官网详情。

## 核心优势

- ✅ **突破反爬**：成功抓取G2、Capterra、AlternativeTo等之前403的网站
- ✅ **干净输出**：直接输出Markdown，无需复杂的HTML解析
- ✅ **JS渲染**：支持JavaScript渲染的现代网站
- ✅ **无需注册**：无API Key也可使用（有限速）
- ✅ **免费额度**：1000 credits/月，Scrape 1 credit/page

## 已实现的爬虫

### 1. Firecrawl基础爬虫 (`scrapers/firecrawl_scraper.py`)

基础类，封装Firecrawl API调用。

**功能：**
- `scrape(url)` - 抓取单个网页
- `search(query, limit)` - 搜索网页
- `scrape_with_retry(url, max_retries)` - 带重试的抓取
- `batch_scrape(urls, delay)` - 批量抓取

**使用示例：**
```python
from scrapers.firecrawl_scraper import FirecrawlScraper

scraper = FirecrawlScraper()  # 无需API Key
result = scraper.scrape("https://www.g2.com/categories/ai-writing-assistant")
markdown = result.get("markdown", "")
```

### 2. G2分类页爬虫 (`scrapers/g2_scraper.py`)

从G2分类页采集AI工具列表和评分。

**支持的分类：**
- ai-writing-assistant - AI写作助手
- ai-image-generator - AI图像生成
- ai-video-generator - AI视频生成
- ai-voice-generator - AI语音生成
- ai-chatbot - AI聊天机器人
- ai-code-assistant - AI代码助手
- ai-search-engine - AI搜索引擎
- ai-productivity - AI生产力工具

**使用示例：**
```python
from scrapers.g2_scraper import G2Scraper

scraper = G2Scraper()
tools = scraper.scrape_category("ai-writing-assistant", max_tools=20)
# 或抓取所有分类
all_tools = scraper.scrape_all_categories(max_tools_per_category=15)
```

### 3. 工具官网详情爬虫 (`scrapers/tool_website_scraper.py`)

从工具官网自动提取详细信息。

**提取的信息：**
- 名称、标语、描述
- 功能列表（最多20个）
- 定价信息（套餐、价格）
- 目标用户
- 使用场景
- 集成
- 分类、标签
- 元数据（标题、描述、关键词）

**使用示例：**
```python
from scrapers.tool_website_scraper import ToolWebsiteScraper

scraper = ToolWebsiteScraper()
tool_info = scraper.scrape_tool_website("https://www.jasper.ai/", "Jasper")
```

## 主程序集成

### 命令行使用

```bash
# 仅Product Hunt
python main.py --sources producthunt

# 仅G2
python main.py --sources g2

# Product Hunt + G2 + 工具详情
python main.py --sources producthunt g2 tool_details

# 详细日志
python main.py --sources g2 --verbose
```

### 编程使用

```python
from main import AIToolsCollector

collector = AIToolsCollector()

# 从G2采集
g2_tools = collector.collect_from_g2(
    categories=["ai-writing-assistant", "ai-image-generator"],
    max_tools=20
)

# 处理工具
result = collector.process_tools(g2_tools, "g2")

# 采集工具详情
detailed_tools = collector.collect_tool_details(g2_tools[:5])

# 生成报告
output = collector.generate_output()
```

## 测试结果

### Firecrawl API测试（2026-08-29）

| 网站 | 状态 | Markdown长度 | 耗时 |
|------|------|-------------|------|
| G2 - AI Writing | ✅ 成功 | 44,329字符 | 7.3秒 |
| Capterra - AI Writing | ✅ 成功 | 27,952字符 | 8.6秒 |
| AlternativeTo - AI Writing | ✅ 成功 | 20,976字符 | 8.0秒 |
| Jasper AI官网 | ✅ 成功 | 41,537字符 | 3.2秒 |
| Product Hunt产品页 | ✅ 成功 | 2,132字符 | 2.8秒 |

**结论：5/5完全成功，Firecrawl完全突破了反爬！**

### G2爬虫测试

- 从AI写作助手分类提取到76个工具（含少量噪音，需优化）
- 成功提取工具名称、G2 URL、评分
- 评论数提取待优化

## API Key（可选）

无API Key也可使用，但注册后可提升限额。

**注册步骤：**
1. 访问 https://www.firecrawl.dev/
2. 点击"Sign Up"注册账号
3. 在Dashboard中获取API Key（格式：`fc-...`）
4. 使用时传入：

```python
scraper = FirecrawlScraper(api_key="fc-你的APIKey")
```

**免费额度：**
- 1000 credits/月
- Scrape: 1 credit/page
- Search: 2 credits/10 results
- 无需信用卡

**付费套餐：**
- Hobby: $29/月，5000 credits
- Standard: $149/月，50000 credits
- Scale: $399/月，250000 credits

## 注意事项

1. **请求间隔**：建议每个请求之间间隔2-3秒，避免触发限速
2. **内容过滤**：G2爬虫提取的工具可能包含少量噪音（如评分、评论数），需要进一步过滤
3. **评论数提取**：当前版本评论数提取不够准确，后续可优化
4. **免费额度**：1000次/月，小规模使用足够，大规模使用需考虑付费
5. **数据来源**：G2数据受其服务条款约束，商用需确认授权

## 后续优化方向

- [ ] 优化G2工具提取逻辑，过滤噪音
- [ ] 改进评论数和评分提取
- [ ] 添加Capterra爬虫
- [ ] 添加AlternativeTo爬虫
- [ ] 添加工具对比功能
- [ ] 集成到GitHub Actions定时任务
- [ ] 自动更新现有工具库信息
- [ ] 添加数据质量评分
- [ ] 支持更多G2分类
- [ ] 添加API Key配置文件支持

## 文件结构

```
automation/
├── scrapers/
│   ├── firecrawl_scraper.py      # Firecrawl基础爬虫
│   ├── g2_scraper.py             # G2分类页爬虫
│   ├── tool_website_scraper.py   # 工具官网详情爬虫
│   ├── base_scraper.py           # 基础爬虫抽象类
│   ├── producthunt_rss_scraper.py # Product Hunt RSS爬虫
│   └── producthunt_scraper.py    # Product Hunt网页爬虫（备用）
├── main.py                        # 主程序
├── config.py                      # 配置
├── test_firecrawl.py              # Firecrawl测试脚本
├── requirements.txt               # 依赖
└── README.md                      # 本文档
```

## 相关链接

- Firecrawl官网: https://www.firecrawl.dev/
- Firecrawl文档: https://docs.firecrawl.dev/introduction
- Firecrawl GitHub: https://github.com/mendableai/firecrawl
- G2: https://www.g2.com/
- Capterra: https://www.capterra.com/
