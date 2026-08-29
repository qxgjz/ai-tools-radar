# 通用工具函数
# Utility functions for AI Tools Radar Automation

import json
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from config import (
    RAW_DATA_DIR,
    PROCESSED_DATA_DIR,
    OUTPUT_DIR,
    SCRAPER_CONFIG,
    LOG_CONFIG,
)

# 配置日志
logging.basicConfig(
    level=getattr(logging, LOG_CONFIG["level"]),
    format=LOG_CONFIG["format"],
    handlers=[
        logging.FileHandler(LOG_CONFIG["file"], encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("ai-tools-radar")


def save_json(data: Any, filename: str, directory: Path = RAW_DATA_DIR) -> Path:
    """
    保存数据为JSON文件

    Args:
        data: 要保存的数据
        filename: 文件名
        directory: 保存目录

    Returns:
        保存的文件路径
    """
    filepath = directory / filename
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"数据已保存: {filepath}")
    return filepath


def load_json(filename: str, directory: Path = RAW_DATA_DIR) -> Optional[Any]:
    """
    从JSON文件加载数据

    Args:
        filename: 文件名
        directory: 文件目录

    Returns:
        加载的数据，文件不存在时返回None
    """
    filepath = directory / filename
    if not filepath.exists():
        logger.warning(f"文件不存在: {filepath}")
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    logger.info(f"数据已加载: {filepath}")
    return data


def get_timestamp() -> str:
    """
    获取当前时间戳字符串

    Returns:
        时间戳字符串，格式：YYYYMMDD_HHMMSS
    """
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def get_date_string() -> str:
    """
    获取当前日期字符串

    Returns:
        日期字符串，格式：YYYY-MM-DD
    """
    return datetime.now().strftime("%Y-%m-%d")


def delay(seconds: float = None):
    """
    延迟等待，避免请求过快

    Args:
        seconds: 延迟秒数，默认使用配置值
    """
    if seconds is None:
        seconds = SCRAPER_CONFIG["request_delay"]
    time.sleep(seconds)


def clean_text(text: str) -> str:
    """
    清理文本，去除多余空白和特殊字符

    Args:
        text: 原始文本

    Returns:
        清理后的文本
    """
    if not text:
        return ""
    # 去除多余空白
    text = " ".join(text.split())
    # 去除首尾空白
    text = text.strip()
    return text


def normalize_tool_name(name: str) -> str:
    """
    标准化工具名称，用于去重比较

    Args:
        name: 工具名称

    Returns:
        标准化后的名称
    """
    if not name:
        return ""
    # 转小写
    name = name.lower()
    # 去除特殊字符
    name = "".join(c for c in name if c.isalnum() or c.isspace())
    # 去除多余空白
    name = " ".join(name.split())
    return name


def is_duplicate(tool_name: str, existing_tools: List[Dict]) -> bool:
    """
    检查工具是否已存在

    Args:
        tool_name: 工具名称
        existing_tools: 现有工具列表

    Returns:
        是否重复
    """
    normalized_name = normalize_tool_name(tool_name)
    for tool in existing_tools:
        existing_name = normalize_tool_name(tool.get("name", ""))
        if existing_name == normalized_name:
            return True
        # 检查URL域名
        existing_url = tool.get("url", "").lower()
        if existing_url and normalized_name in existing_url:
            return True
    return False


def extract_domain(url: str) -> str:
    """
    从URL中提取域名

    Args:
        url: URL字符串

    Returns:
        域名
    """
    if not url:
        return ""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc
        # 去除www前缀
        if domain.startswith("www."):
            domain = domain[4:]
        return domain
    except Exception:
        return ""


def validate_tool_data(tool_data: Dict) -> Dict[str, Any]:
    """
    验证工具数据的完整性

    Args:
        tool_data: 工具数据字典

    Returns:
        验证结果，包含is_valid和errors
    """
    errors = []
    required_fields = ["name", "url", "description"]

    for field in required_fields:
        if not tool_data.get(field):
            errors.append(f"缺少必填字段: {field}")

    # 验证URL格式
    url = tool_data.get("url", "")
    if url and not url.startswith(("http://", "https://")):
        errors.append("URL格式不正确，应以http://或https://开头")

    # 验证描述长度
    description = tool_data.get("description", "")
    if description and len(description) < 10:
        errors.append("描述过短，至少10个字符")

    return {
        "is_valid": len(errors) == 0,
        "errors": errors,
    }


def print_summary(results: Dict[str, Any]):
    """
    打印采集结果摘要

    Args:
        results: 采集结果字典
    """
    print("\n" + "=" * 60)
    print("📊 采集结果摘要")
    print("=" * 60)
    print(f"采集时间: {results.get('timestamp', 'N/A')}")
    print(f"数据源: {results.get('source', 'N/A')}")
    print(f"采集工具数: {results.get('total_scraped', 0)}")
    print(f"新增工具数: {results.get('new_tools', 0)}")
    print(f"重复工具数: {results.get('duplicates', 0)}")
    print(f"无效工具数: {results.get('invalid', 0)}")
    if results.get("output_file"):
        print(f"输出文件: {results['output_file']}")
    print("=" * 60 + "\n")


def retry_on_failure(func, max_retries: int = None, delay_seconds: float = None):
    """
    重试装饰器，用于网络请求等可能失败的操作

    Args:
        func: 要执行的函数
        max_retries: 最大重试次数
        delay_seconds: 重试间隔秒数

    Returns:
        函数执行结果
    """
    if max_retries is None:
        max_retries = SCRAPER_CONFIG["max_retries"]
    if delay_seconds is None:
        delay_seconds = SCRAPER_CONFIG["request_delay"]

    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"操作失败，已达最大重试次数: {e}")
                raise
            logger.warning(f"操作失败（第{attempt + 1}次），{delay_seconds}秒后重试: {e}")
            time.sleep(delay_seconds)
