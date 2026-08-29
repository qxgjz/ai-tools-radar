# Product Hunt 爬虫
# Scrape AI tools information from Product Hunt

import json
import time
from typing import Dict, List, Optional
from datetime import datetime

from curl_cffi import requests as cffi_requests
from bs4 import BeautifulSoup

from config import PRODUCT_HUNT_CONFIG, SCRAPER_CONFIG
from utils.helpers import (
    logger,
    save_json,
    clean_text,
    get_timestamp,
    delay,
    extract_domain,
)


class ProductHuntScraper:
    """Product Hunt AI工具爬虫"""

    def __init__(self):
        self.base_url = PRODUCT_HUNT_CONFIG["base_url"]
        self.topics = PRODUCT_HUNT_CONFIG["topics"]
        self.max_products = PRODUCT_HUNT_CONFIG["max_products_per_topic"]
        self.session = cffi_requests.Session(impersonate="chrome")
        self.session.headers.update({
            "User-Agent": SCRAPER_CONFIG["user_agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        self.all_products = []

    def search_ai_tools(self, topic: str = "ai") -> List[Dict]:
        """
        搜索Product Hunt上的AI工具

        Args:
            topic: 搜索主题

        Returns:
            工具列表
        """
        logger.info(f"开始搜索Product Hunt主题: {topic}")
        products = []

        try:
            # 方法1：通过主题页面获取
            url = f"{self.base_url}/topics/{topic}"
            logger.info(f"访问: {url}")

            response = self.session.get(url, timeout=SCRAPER_CONFIG["timeout"])
            if response.status_code == 200:
                products = self._parse_product_list(response.text)
                logger.info(f"从主题页面获取到 {len(products)} 个产品")
            else:
                logger.warning(f"访问失败，状态码: {response.status_code}")

            delay()

        except Exception as e:
            logger.error(f"搜索Product Hunt失败: {e}")

        return products[:self.max_products]

    def _parse_product_list(self, html: str) -> List[Dict]:
        """
        解析产品列表页面

        Args:
            html: 页面HTML

        Returns:
            产品列表
        """
        products = []
        soup = BeautifulSoup(html, "lxml")

        # 尝试多种选择器来找到产品卡片
        product_cards = []

        # 选择器1: 标准产品卡片
        product_cards = soup.select('[data-test="product-card"]')
        if not product_cards:
            # 选择器2: 列表项
            product_cards = soup.select('.styles_item__Dk_nz')
        if not product_cards:
            # 选择器3: 通用链接
            product_cards = soup.select('a[href^="/products/"]')

        logger.info(f"找到 {len(product_cards)} 个产品卡片")

        for card in product_cards[:self.max_products]:
            try:
                product = self._parse_product_card(card)
                if product and product.get("name"):
                    products.append(product)
            except Exception as e:
                logger.warning(f"解析产品卡片失败: {e}")
                continue

        return products

    def _parse_product_card(self, card) -> Optional[Dict]:
        """
        解析单个产品卡片

        Args:
            card: BeautifulSoup元素

        Returns:
            产品信息字典
        """
        product = {
            "name": "",
            "url": "",
            "tagline": "",
            "description": "",
            "votes": 0,
            "category": "",
            "logo_url": "",
            "source": "producthunt",
            "scraped_at": get_timestamp(),
        }

        # 产品名称
        name_elem = card.select_one('[data-test="product-name"]')
        if not name_elem:
            name_elem = card.select_one("h3")
        if not name_elem:
            name_elem = card.select_one("h2")
        if name_elem:
            product["name"] = clean_text(name_elem.get_text())

        # 产品链接
        link_elem = card.select_one('a[href^="/products/"]')
        if link_elem:
            href = link_elem.get("href", "")
            if href:
                product["url"] = f"{self.base_url}{href}" if href.startswith("/") else href

        # 如果卡片本身就是链接
        if not product["url"] and card.name == "a":
            href = card.get("href", "")
            if href:
                product["url"] = f"{self.base_url}{href}" if href.startswith("/") else href

        # 产品标语/描述
        tagline_elem = card.select_one('[data-test="product-tagline"]')
        if not tagline_elem:
            tagline_elem = card.select_one("p")
        if tagline_elem:
            product["tagline"] = clean_text(tagline_elem.get_text())
            product["description"] = product["tagline"]

        # 投票数
        votes_elem = card.select_one('[data-test="vote-button"]')
        if not votes_elem:
            votes_elem = card.select_one(".styles_voteCount__")
        if votes_elem:
            votes_text = clean_text(votes_elem.get_text())
            try:
                product["votes"] = int(votes_text.replace(",", ""))
            except ValueError:
                pass

        # 产品Logo
        logo_elem = card.select_one("img")
        if logo_elem:
            product["logo_url"] = logo_elem.get("src", "")

        return product if product["name"] else None

    def get_product_details(self, product_url: str) -> Optional[Dict]:
        """
        获取产品详细信息

        Args:
            product_url: 产品页面URL

        Returns:
            产品详细信息
        """
        logger.info(f"获取产品详情: {product_url}")

        try:
            response = self.session.get(product_url, timeout=SCRAPER_CONFIG["timeout"])
            if response.status_code != 200:
                logger.warning(f"访问产品详情失败: {response.status_code}")
                return None

            soup = BeautifulSoup(response.text, "lxml")
            details = {}

            # 产品描述
            desc_elem = soup.select_one('[data-test="product-description"]')
            if not desc_elem:
                desc_elem = soup.select_one(".styles_description__")
            if desc_elem:
                details["description"] = clean_text(desc_elem.get_text())

            # 产品官网链接
            website_elem = soup.select_one('a[rel="noopener noreferrer"]')
            if website_elem:
                details["website_url"] = website_elem.get("href", "")

            # 分类
            categories = []
            category_elems = soup.select('[data-test="topic-tag"]')
            for cat in category_elems:
                cat_name = clean_text(cat.get_text())
                if cat_name:
                    categories.append(cat_name)
            details["categories"] = categories

            # 发布日期
            date_elem = soup.select_one("time")
            if date_elem:
                details["launch_date"] = date_elem.get("datetime", "")

            delay()
            return details

        except Exception as e:
            logger.error(f"获取产品详情失败: {e}")
            return None

    def scrape_all_topics(self) -> List[Dict]:
        """
        抓取所有主题的AI工具

        Returns:
            所有工具列表
        """
        logger.info("开始抓取Product Hunt所有AI主题")
        all_products = []
        seen_names = set()

        for topic in self.topics:
            logger.info(f"处理主题: {topic}")
            products = self.search_ai_tools(topic)

            for product in products:
                name = product.get("name", "").lower()
                if name and name not in seen_names:
                    seen_names.add(name)
                    all_products.append(product)

            logger.info(f"主题 {topic} 完成，累计 {len(all_products)} 个唯一产品")

        self.all_products = all_products
        return all_products

    def save_results(self, products: List[Dict] = None) -> str:
        """
        保存抓取结果

        Args:
            products: 产品列表，默认使用self.all_products

        Returns:
            保存的文件名
        """
        if products is None:
            products = self.all_products

        timestamp = get_timestamp()
        filename = f"producthunt_ai_tools_{timestamp}.json"

        result = {
            "source": "producthunt",
            "scraped_at": timestamp,
            "total_count": len(products),
            "topics": self.topics,
            "products": products,
        }

        save_json(result, filename)
        logger.info(f"Product Hunt结果已保存: {filename}")
        return filename


def main():
    """主函数：执行Product Hunt爬虫"""
    print("🚀 启动 Product Hunt AI工具爬虫")
    print(f"主题: {PRODUCT_HUNT_CONFIG['topics']}")
    print(f"每主题最大产品数: {PRODUCT_HUNT_CONFIG['max_products_per_topic']}")

    scraper = ProductHuntScraper()

    # 抓取所有主题
    products = scraper.scrape_all_topics()

    print(f"\n✅ 抓取完成，共获取 {len(products)} 个AI工具")

    # 保存结果
    filename = scraper.save_results(products)
    print(f"📁 结果已保存: {filename}")

    # 打印前5个产品
    print("\n📋 前5个产品:")
    for i, product in enumerate(products[:5], 1):
        print(f"  {i}. {product.get('name', 'N/A')} - {product.get('tagline', 'N/A')[:50]}")

    return products


if __name__ == "__main__":
    main()
