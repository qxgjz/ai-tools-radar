# AI工具雷达 - 自动化采集系统

> AI Tools Radar - Automation System
> 自动发现、采集、整理最新的AI工具信息

## 📋 项目简介

本项目是AI工具雷达网站的自动化数据采集系统，用于自动发现和整理最新的AI工具信息，减少人工收集的工作量，提升效率。

## ✨ 功能特性

- **自动采集**：从Product Hunt RSS Feed自动采集最新产品
- **AI过滤**：智能过滤AI相关产品，准确率高
- **去重处理**：自动与现有工具库对比，去除重复
- **数据验证**：验证工具数据的完整性和有效性
- **报告生成**：生成结构化的新工具发现报告
- **定时运行**：支持GitHub Actions定时自动运行
- **审核流程**：自动创建GitHub Issue，方便人工审核

## 🛠️ 技术栈

- **语言**：Python 3.11+
- **HTTP请求**：urllib（内置，无依赖）
- **HTML解析**：BeautifulSoup4 + lxml
- **浏览器自动化**：Playwright（可选，用于反爬强的网站）
- **数据格式**：JSON
- **定时任务**：GitHub Actions

## 📁 项目结构

```
automation/
├── main.py                          # 主程序入口
├── config.py                        # 配置文件
├── requirements.txt                 # Python依赖
├── README.md                        # 项目说明
├── scrapers/                        # 爬虫模块
│   ├── __init__.py
│   ├── producthunt_rss_scraper.py  # Product Hunt RSS爬虫
│   └── producthunt_scraper.py      # Product Hunt网页爬虫（备用）
├── utils/                           # 工具模块
│   ├── __init__.py
│   └── helpers.py                   # 通用工具函数
├── data/                            # 数据目录
│   ├── raw/                         # 原始采集数据
│   └── processed/                   # 处理后的数据
├── output/                          # 输出报告
└── .github/
    └── workflows/
        └── ai-tools-collector.yml   # GitHub Actions定时任务
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 运行采集

```bash
# 采集Product Hunt的AI工具
python main.py --sources producthunt

# 详细日志模式
python main.py --sources producthunt --verbose
```

### 3. 查看结果

采集结果保存在以下目录：
- `data/raw/`：原始采集数据
- `data/processed/`：处理后的精简数据
- `output/`：完整的发现报告

## 📊 数据源

### 当前支持

| 数据源 | 状态 | 说明 |
|--------|------|------|
| Product Hunt RSS | ✅ 已支持 | 每日更新，50个产品，AI过滤后约20-25个 |

### 计划支持

| 数据源 | 状态 | 说明 |
|--------|------|------|
| GitHub Trending | 🔄 开发中 | 热门AI开源项目 |
| G2 | ⏳ 计划中 | 需要突破反爬 |
| AlternativeTo | ⏳ 计划中 | 需要突破反爬 |
| Capterra | ⏳ 计划中 | 需要突破反爬 |

## ⚙️ 配置说明

主要配置在 `config.py` 中：

```python
# 爬虫配置
SCRAPER_CONFIG = {
    "request_delay": 2,        # 请求间隔（秒）
    "timeout": 30,              # 超时时间（秒）
    "max_retries": 3,           # 最大重试次数
}

# Product Hunt配置
PRODUCT_HUNT_CONFIG = {
    "topics": ["ai", "artificial-intelligence", ...],  # AI关键词
}
```

## 🤖 GitHub Actions 自动运行

项目配置了GitHub Actions定时任务，每周一早上9点（北京时间）自动运行：

1. 自动采集Product Hunt最新AI工具
2. 自动去重和验证
3. 自动提交数据到仓库
4. 自动创建GitHub Issue，提醒人工审核

### 手动触发

在GitHub仓库的Actions页面，可以手动触发工作流。

## 📝 审核流程

1. **自动采集**：系统自动采集新工具
2. **自动去重**：与现有工具库对比，去除重复
3. **创建Issue**：自动创建审核Issue
4. **人工审核**：人工检查工具信息准确性
5. **录入工具库**：审核通过后录入网站工具库

## 📈 效率对比

| 方式 | 10个工具耗时 | 准确率 | 成本 |
|------|-------------|--------|------|
| 人工收集 | ~150分钟 | 高 | 高 |
| 自动化采集 | ~1分钟 | 中（需人工审核） | 低 |
| **效率提升** | **150倍** | - | - |

## ⚠️ 注意事项

1. **合规使用**：只采集公开数据，遵守网站的robots.txt和使用条款
2. **请求频率**：控制请求频率，不给目标网站造成压力
3. **数据质量**：自动采集的数据需要人工审核后再使用
4. **反爬机制**：部分网站有反爬机制，可能需要使用Playwright或API
5. **数据更新**：定期更新工具信息，确保数据的时效性

## 🔧 故障排除

### Q: Product Hunt返回403？
A: Product Hunt网页有Cloudflare验证，请使用RSS Feed版本（`producthunt_rss_scraper.py`）。

### Q: 如何添加新的数据源？
A: 在 `scrapers/` 目录下创建新的爬虫类，继承基础结构，然后在 `main.py` 中添加调用。

### Q: 如何调整AI过滤关键词？
A: 修改 `producthunt_rss_scraper.py` 中的 `AI_KEYWORDS` 列表。

## 📄 许可证

本项目仅供内部使用，数据版权归原网站所有。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进本项目。

---

*最后更新：2026-08-29*
