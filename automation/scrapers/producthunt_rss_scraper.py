#!/usr/bin/env python3
# Product Hunt 爬虫 - 使用RSS Feed
# Scrape AI tools from Product Hunt RSS Feed

import sys
import re
import html
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent))

from config import SCRAPER_CONFIG
from utils.helpers import (
    logger,
    save_json,
    clean_text,
    get_timestamp,
    delay,
)


class ProductHuntRSSScraper:
    """Product Hunt RSS Feed爬虫"""

    # AI相关关键词，用于过滤产品
    AI_KEYWORDS = [
        "ai", "artificial intelligence", "machine learning", "ml",
        "gpt", "chatgpt", "llm", "large language model",
        "deep learning", "neural network", "nlp",
        "computer vision", "image generation", "text generation",
        "chatbot", "assistant", "copilot",
        "stable diffusion", "midjourney", "dall-e",
        "whisper", "speech", "voice", "tts",
        "code generation", "coding assistant",
        "automation", "agent", "autonomous",
        "prompt", "prompt engineering",
        "embedding", "vector", "rag",
        "fine-tuning", "training",
        "transcription", "translation",
        "summarization", "writing assistant",
        "design", "image editing", "video editing",
        "analytics", "insights", "predictive",
    ]

    def __init__(self):
        self.rss_url = "https://www.producthunt.com/feed"
        self.all_products = []
        self.ai_products = []

    def fetch_rss(self) -> Optional[str]:
        """
        获取RSS Feed内容

        Returns:
            RSS XML内容
        """
        logger.info(f"获取Product Hunt RSS Feed: {self.rss_url}")

        import ssl
        import urllib.request

        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(self.rss_url, headers={
            "User-Agent": SCRAPER_CONFIG["user_agent"],
            "Accept": "application/atom+xml, application/xml, text/xml, */*",
            "Accept-Language": "en-US,en;q=0.9",
        })

        try:
            with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
                content = response.read().decode("utf-8", errors="replace")
                logger.info(f"RSS Feed获取成功，长度: {len(content)} 字符")
                return content
        except Exception as e:
            logger.error(f"RSS Feed获取失败: {e}")
            return None

    def parse_rss(self, xml_content: str) -> List[Dict]:
        """
        解析Atom RSS Feed

        Args:
            xml_content: XML内容

        Returns:
            产品列表
        """
        logger.info("解析RSS Feed...")
        products = []

        try:
            # 注册Atom命名空间
            namespaces = {
                "atom": "http://www.w3.org/2005/Atom",
            }

            root = ET.fromstring(xml_content)

            # 查找所有entry
            entries = root.findall(".//atom:entry", namespaces)
            if not entries:
                # 尝试不带命名空间
                entries = root.findall(".//entry")

            logger.info(f"找到 {len(entries)} 个entry")

            for entry in entries:
                try:
                    product = self._parse_entry(entry, namespaces)
                    if product:
                        products.append(product)
                except Exception as e:
                    logger.warning(f"解析entry失败: {e}")
                    continue

        except Exception as e:
            logger.error(f"解析RSS Feed失败: {e}")

        logger.info(f"成功解析 {len(products)} 个产品")
        return products

    def _parse_entry(self, entry, namespaces) -> Optional[Dict]:
        """
        解析单个entry

        Args:
            entry: XML元素
            namespaces: 命名空间

        Returns:
            产品信息字典
        """
        product = {
            "name": "",
            "url": "",
            "description": "",
            "tagline": "",
            "published_date": "",
            "author": "",
            "producthunt_id": "",
            "source": "producthunt_rss",
            "scraped_at": get_timestamp(),
        }

        # 标题
        title_elem = entry.find("atom:title", namespaces)
        if title_elem is None:
            title_elem = entry.find("title")
        if title_elem is not None and title_elem.text:
            product["name"] = clean_text(title_elem.text)

        # 链接
        link_elem = entry.find("atom:link", namespaces)
        if link_elem is None:
            link_elem = entry.find("link")
        if link_elem is not None:
            href = link_elem.get("href", "")
            if href:
                product["url"] = href

        # 内容/描述
        content_elem = entry.find("atom:content", namespaces)
        if content_elem is None:
            content_elem = entry.find("content")
        if content_elem is not None and content_elem.text:
            # 解码HTML实体
            html_content = html.unescape(content_elem.text)
            # 提取纯文本
            text = re.sub(r"<[^>]+>", " ", html_content)
            text = clean_text(text)
            product["description"] = text
            # 标语通常是第一句
            if text:
                product["tagline"] = text.split(".")[0][:200]

        # 发布日期
        published_elem = entry.find("atom:published", namespaces)
        if published_elem is None:
            published_elem = entry.find("published")
        if published_elem is not None and published_elem.text:
            product["published_date"] = published_elem.text

        # 作者
        author_elem = entry.find(".//atom:name", namespaces)
        if author_elem is None:
            author_elem = entry.find(".//name")
        if author_elem is not None and author_elem.text:
            product["author"] = clean_text(author_elem.text)

        # ID
        id_elem = entry.find("atom:id", namespaces)
        if id_elem is None:
            id_elem = entry.find("id")
        if id_elem is not None and id_elem.text:
            # 从ID中提取数字ID
            id_match = re.search(r"/(\d+)$", id_elem.text)
            if id_match:
                product["producthunt_id"] = id_match.group(1)

        return product if product["name"] else None

    def filter_ai_products(self, products: List[Dict]) -> List[Dict]:
        """
        过滤出AI相关的产品

        Args:
            products: 所有产品列表

        Returns:
            AI相关产品列表
        """
        logger.info(f"过滤AI相关产品，总数: {len(products)}")
        ai_products = []

        for product in products:
            if self._is_ai_product(product):
                ai_products.append(product)

        logger.info(f"过滤出 {len(ai_products)} 个AI相关产品")
        return ai_products

    def _is_ai_product(self, product: Dict) -> bool:
        """
        判断产品是否与AI相关

        Args:
            product: 产品信息

        Returns:
            是否AI相关
        """
        # 合并所有文本字段
        text = " ".join([
            product.get("name", ""),
            product.get("description", ""),
            product.get("tagline", ""),
        ]).lower()

        # 检查是否包含AI关键词
        for keyword in self.AI_KEYWORDS:
            if keyword in text:
                return True

        return False

    def scrape(self, filter_ai: bool = True) -> List[Dict]:
        """
        执行完整的抓取流程

        Args:
            filter_ai: 是否只保留AI相关产品

        Returns:
            产品列表
        """
        logger.info("启动Product Hunt RSS爬虫")

        # 1. 获取RSS
        xml_content = self.fetch_rss()
        if not xml_content:
            logger.error("获取RSS失败，无法继续")
            return []

        # 2. 解析RSS
        products = self.parse_rss(xml_content)
        self.all_products = products

        # 3. 过滤AI产品
        if filter_ai:
            ai_products = self.filter_ai_products(products)
            self.ai_products = ai_products
            return ai_products
        else:
            return products

    def save_results(self, products: List[Dict] = None, filename: str = None) -> str:
        """
        保存抓取结果

        Args:
            products: 产品列表
            filename: 文件名

        Returns:
            保存的文件名
        """
        if products is None:
            products = self.ai_products or self.all_products

        timestamp = get_timestamp()
        if not filename:
            filename = f"producthunt_rss_{timestamp}.json"

        result = {
            "source": "producthunt_rss",
            "scraped_at": timestamp,
            "total_count": len(products),
            "all_products_count": len(self.all_products),
            "ai_products_count": len(self.ai_products),
            "products": products,
        }

        save_json(result, filename)
        logger.info(f"结果已保存: {filename}")
        return filename


def main():
    """主函数"""
    print("=" * 60)
    print("🚀 Product Hunt RSS 爬虫")
    print("=" * 60)

    scraper = ProductHuntRSSScraper()

    # 执行抓取
    products = scraper.scrape(filter_ai=True)

    print(f"\n✅ 抓取完成")
    print(f"   总产品数: {len(scraper.all_products)}")
    print(f"   AI相关产品: {len(products)}")

    # 保存结果
    filename = scraper.save_results(products)
    print(f"   结果文件: {filename}")

    # 打印前10个AI产品
    print("\n📋 前10个AI相关产品:")
    print("-" * 60)
    for i, product in enumerate(products[:10], 1):
        name = product.get("name", "N/A")
        tagline = product.get("tagline", "N/A")[:60]
        date = product.get("published_date", "")[:10]
        print(f"{i:2d}. {name}")
        print(f"    {tagline}")
        print(f"    发布日期: {date}")
        print()

    print("=" * 60)
    return products


if __name__ == "__main__":
    main()
