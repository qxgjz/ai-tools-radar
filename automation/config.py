# AI工具信息自动采集器 - 配置文件
# AI Tools Radar - Automation Configuration

import os
from pathlib import Path

# 项目根目录
BASE_DIR = Path(__file__).parent

# 数据目录
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
OUTPUT_DIR = BASE_DIR / "output"

# 确保目录存在
for d in [DATA_DIR, RAW_DATA_DIR, PROCESSED_DATA_DIR, OUTPUT_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# 爬虫配置
SCRAPER_CONFIG = {
    # 请求间隔（秒），避免给目标网站造成压力
    "request_delay": 2,
    # 超时时间（秒）
    "timeout": 30,
    # 最大重试次数
    "max_retries": 3,
    # User-Agent
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

# Product Hunt配置
PRODUCT_HUNT_CONFIG = {
    "base_url": "https://www.producthunt.com",
    "search_url": "https://www.producthunt.com/search",
    "topics": ["ai", "artificial-intelligence", "machine-learning", "llm", "chatgpt"],
    "max_products_per_topic": 20,
}

# G2配置
G2_CONFIG = {
    "base_url": "https://www.g2.com",
    "search_url": "https://www.g2.com/search",
    "categories": ["ai-writing-assistant", "ai-image-generator", "ai-video-generator"],
}

# 现有工具库（用于去重）
EXISTING_TOOLS_FILE = BASE_DIR.parent / "ai-team" / "knowledge-base" / "tools-database.json"

# 输出配置
OUTPUT_CONFIG = {
    "format": "json",
    "encoding": "utf-8",
    "include_timestamp": True,
}

# GitHub Actions配置
GITHUB_CONFIG = {
    "enabled": os.getenv("GITHUB_ACTIONS", "false").lower() == "true",
    "repository": os.getenv("GITHUB_REPOSITORY", ""),
    "token": os.getenv("GITHUB_TOKEN", ""),
    "branch": os.getenv("GITHUB_REF_NAME", "main"),
}

# 日志配置
LOG_CONFIG = {
    "level": "INFO",
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    "file": BASE_DIR / "automation.log",
}
