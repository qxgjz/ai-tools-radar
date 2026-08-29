#!/usr/bin/env python3
# Firecrawl 基础爬虫
# 使用Firecrawl API抓取网页，突破反爬，输出干净Markdown

import sys
import json
import time
import urllib.request
import ssl
from pathlib import Path
from typing import Dict, List, Optional, Any

sys.path.insert(0, str(Path(__file__).parent.parent))

from config import SCRAPER_CONFIG
from utils.helpers import logger, get_timestamp


class FirecrawlScraper:
    """Firecrawl API爬虫基础类"""

    # API端点
    SCRAPE_URL = "https://api.firecrawl.dev/v2/scrape"
    SEARCH_URL = "https://api.firecrawl.dev/v2/search"
    CRAWL_URL = "https://api.firecrawl.dev/v2/crawl"
    MAP_URL = "https://api.firecrawl.dev/v1/map"

    def __init__(self, api_key: str = None):
        """
        初始化Firecrawl爬虫

        Args:
            api_key: Firecrawl API Key（可选，无Key也能调用但有限速）
        """
        self.api_key = api_key
        self.scraped_at = get_timestamp()
        self.results = []

        # 创建不验证SSL的上下文
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def _make_request(self, url: str, payload: dict, timeout: int = 60) -> Optional[dict]:
        """
        发送HTTP请求到Firecrawl API

        Args:
            url: API端点URL
            payload: 请求体
            timeout: 超时时间

        Returns:
            响应JSON，失败返回None
        """
        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=timeout, context=self.ctx) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace")
            logger.warning(f"Firecrawl HTTP错误 {e.code}: {error_body[:200]}")
            return None
        except Exception as e:
            logger.error(f"Firecrawl请求失败: {e}")
            return None

    def scrape(self, url: str, formats: list = None, only_main_content: bool = True,
               wait_for: int = 0, actions: list = None) -> Optional[Dict[str, Any]]:
        """
        抓取单个网页

        Args:
            url: 要抓取的URL
            formats: 返回格式列表（markdown, html, links, screenshot, json）
            only_main_content: 是否只返回主要内容（去除导航、页脚等）
            wait_for: 等待页面加载的毫秒数
            actions: 浏览器操作列表（点击、输入等）

        Returns:
            抓取结果字典，包含markdown、html、metadata等
        """
        if formats is None:
            formats = ["markdown", "html"]

        payload = {
            "url": url,
            "formats": formats,
            "onlyMainContent": only_main_content,
        }

        if wait_for > 0:
            payload["waitFor"] = wait_for

        if actions:
            payload["actions"] = actions

        logger.info(f"Firecrawl抓取: {url}")
        start_time = time.time()

        result = self._make_request(self.SCRAPE_URL, payload)

        elapsed = time.time() - start_time

        if result and result.get("success"):
            data = result.get("data", {})
            markdown = data.get("markdown", "")
            logger.info(f"抓取成功 ({elapsed:.1f}秒): {len(markdown)} 字符 - {url}")
            return data
        else:
            error = result.get("error", "Unknown error") if result else "No response"
            logger.warning(f"抓取失败 ({elapsed:.1f}秒): {error} - {url}")
            return None

    def search(self, query: str, limit: int = 5, scrape_options: dict = None) -> Optional[List[Dict]]:
        """
        搜索网页，返回搜索结果和完整内容

        Args:
            query: 搜索查询
            limit: 返回结果数量
            scrape_options: 抓取选项

        Returns:
            搜索结果列表，每个包含url、title、description、markdown等
        """
        payload = {
            "query": query,
            "limit": limit,
        }

        if scrape_options:
            payload["scrapeOptions"] = scrape_options

        logger.info(f"Firecrawl搜索: {query} (limit={limit})")

        result = self._make_request(self.SEARCH_URL, payload, timeout=60)

        if result and result.get("success"):
            data = result.get("data", {})
            web_results = data.get("web", [])
            logger.info(f"搜索成功: {len(web_results)} 个结果")
            return web_results
        else:
            error = result.get("error", "Unknown error") if result else "No response"
            logger.warning(f"搜索失败: {error}")
            return None

    def scrape_with_retry(self, url: str, max_retries: int = 2, delay: int = 3, **kwargs) -> Optional[Dict]:
        """
        带重试的抓取

        Args:
            url: 要抓取的URL
            max_retries: 最大重试次数
            delay: 重试间隔（秒）
            **kwargs: 其他抓取参数

        Returns:
            抓取结果
        """
        for attempt in range(max_retries + 1):
            result = self.scrape(url, **kwargs)
            if result and result.get("markdown"):
                return result
            if attempt < max_retries:
                logger.info(f"重试 ({attempt + 1}/{max_retries}): {url}")
                time.sleep(delay)
        return None

    def batch_scrape(self, urls: List[str], delay: int = 2, **kwargs) -> List[Dict]:
        """
        批量抓取多个URL

        Args:
            urls: URL列表
            delay: 每个请求之间的延迟（秒）
            **kwargs: 其他抓取参数

        Returns:
            抓取结果列表
        """
        results = []
        for i, url in enumerate(urls, 1):
            logger.info(f"批量抓取 ({i}/{len(urls)}): {url}")
            result = self.scrape_with_retry(url, **kwargs)
            if result:
                results.append({
                    "url": url,
                    "success": True,
                    "data": result,
                })
            else:
                results.append({
                    "url": url,
                    "success": False,
                    "data": None,
                })
            if i < len(urls):
                time.sleep(delay)

        success_count = sum(1 for r in results if r["success"])
        logger.info(f"批量抓取完成: {success_count}/{len(urls)} 成功")
        return results

    def extract_tools_from_markdown(self, markdown: str, source: str = "unknown") -> List[Dict]:
        """
        从Markdown内容中提取工具信息（基础实现，子类可重写）

        Args:
            markdown: Markdown内容
            source: 数据来源

        Returns:
            工具信息列表
        """
        # 这是一个基础实现，具体的提取逻辑由子类实现
        tools = []
        # 子类应该重写这个方法，根据特定网站的结构提取工具信息
        return tools

    def save_results(self, filename: str = None) -> str:
        """
        保存抓取结果

        Args:
            filename: 文件名

        Returns:
            保存的文件名
        """
        from utils.helpers import save_json

        if not filename:
            filename = f"firecrawl_{self.scraped_at}.json"

        result = {
            "source": "firecrawl",
            "scraped_at": self.scraped_at,
            "total_count": len(self.results),
            "results": self.results,
        }

        save_json(result, filename)
        logger.info(f"Firecrawl结果已保存: {filename} ({len(self.results)} 项)")
        return filename


def test_firecrawl():
    """测试Firecrawl爬虫"""
    print("=" * 60)
    print("🔥 Firecrawl 爬虫测试")
    print("=" * 60)

    scraper = FirecrawlScraper()

    # 测试单个抓取
    test_url = "https://www.g2.com/categories/ai-writing-assistant"
    print(f"\n测试抓取: {test_url}")

    result = scraper.scrape(test_url, formats=["markdown"])

    if result:
        markdown = result.get("markdown", "")
        metadata = result.get("metadata", {})
        print(f"✅ 抓取成功")
        print(f"   标题: {metadata.get('title', 'N/A')[:60]}")
        print(f"   Markdown长度: {len(markdown)} 字符")
        print(f"   内容预览: {markdown[:200].replace(chr(10), ' ')}...")
    else:
        print("❌ 抓取失败")

    # 测试搜索
    print(f"\n测试搜索: 'best AI writing tools 2026'")
    search_results = scraper.search("best AI writing tools 2026", limit=3)

    if search_results:
        print(f"✅ 搜索成功: {len(search_results)} 个结果")
        for i, r in enumerate(search_results, 1):
            print(f"   {i}. {r.get('title', 'N/A')[:50]}")
            print(f"      {r.get('url', 'N/A')[:60]}")
    else:
        print("❌ 搜索失败")

    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)


if __name__ == "__main__":
    test_firecrawl()
