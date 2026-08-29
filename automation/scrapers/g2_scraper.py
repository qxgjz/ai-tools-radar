#!/usr/bin/env python3
# G2 分类页爬虫
# 使用Firecrawl抓取G2分类页，提取AI工具列表和评分

import sys
import re
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent))

from scrapers.firecrawl_scraper import FirecrawlScraper
from utils.helpers import logger, get_timestamp, clean_text


class G2Scraper(FirecrawlScraper):
    """G2分类页爬虫"""

    # G2 AI工具分类URL
    CATEGORIES = {
        "ai-writing-assistant": {
            "name": "AI写作助手",
            "url": "https://www.g2.com/categories/ai-writing-assistant",
        },
        "ai-image-generator": {
            "name": "AI图像生成",
            "url": "https://www.g2.com/categories/ai-image-generator",
        },
        "ai-video-generator": {
            "name": "AI视频生成",
            "url": "https://www.g2.com/categories/ai-video-generator",
        },
        "ai-voice-generator": {
            "name": "AI语音生成",
            "url": "https://www.g2.com/categories/ai-voice-generators",
        },
        "ai-chatbot": {
            "name": "AI聊天机器人",
            "url": "https://www.g2.com/categories/ai-chatbot",
        },
        "ai-code-assistant": {
            "name": "AI代码助手",
            "url": "https://www.g2.com/categories/ai-code-assistant",
        },
        "ai-search-engine": {
            "name": "AI搜索引擎",
            "url": "https://www.g2.com/categories/ai-search-engine",
        },
        "ai-productivity": {
            "name": "AI生产力工具",
            "url": "https://www.g2.com/categories/ai-productivity",
        },
    }

    def __init__(self, api_key: str = None):
        super().__init__(api_key)
        self.source_name = "g2"

    def scrape_category(self, category_key: str, max_tools: int = 30) -> List[Dict]:
        """
        抓取G2分类页，提取工具列表

        Args:
            category_key: 分类键
            max_tools: 最大提取工具数

        Returns:
            工具列表
        """
        category = self.CATEGORIES.get(category_key)
        if not category:
            logger.error(f"未知分类: {category_key}")
            return []

        url = category["url"]
        category_name = category["name"]

        logger.info(f"抓取G2分类: {category_name} ({category_key})")

        # 抓取页面
        result = self.scrape_with_retry(url, formats=["markdown", "html"])

        if not result:
            logger.warning(f"抓取失败: {url}")
            return []

        markdown = result.get("markdown", "")
        html = result.get("html", "")

        # 从Markdown中提取工具
        tools = self._extract_tools_from_markdown(markdown, category_key, category_name)

        logger.info(f"从 {category_name} 提取到 {len(tools)} 个工具")
        return tools[:max_tools]

    def _extract_tools_from_markdown(self, markdown: str, category_key: str, category_name: str) -> List[Dict]:
        """
        从G2 Markdown中提取工具信息

        Args:
            markdown: Markdown内容
            category_key: 分类键
            category_name: 分类名称

        Returns:
            工具列表
        """
        tools = []

        # G2产品链接格式：https://www.g2.com/products/xxx/reviews（不带查询参数）
        # 过滤掉带查询参数的链接（如 /reviews?qs=pros-and-cons）
        product_pattern = r'\[([^\]]+)\]\((https://www\.g2\.com/products/[^/?]+/reviews)\)'
        matches = re.findall(product_pattern, markdown)

        # 需要过滤的名称关键词（评价维度、按钮等）
        filter_keywords = [
            "ease of use", "writing improvement", "incorrect corrections",
            "learning curve", "quality of support", "meets requirements",
            "recommendation", "likelihood to recommend", "get a quote",
            "sign up", "log in", "login", "register", "download",
            "read more", "learn more", "click here", "view all",
            "compare", "overview", "highest rated", "easiest to use",
            "free", "leader", "contender", "niche", "emerging",
            "products", "categories", "reviews", "pros and cons",
            "what do you like best", "what do you dislike",
        ]

        seen_names = set()

        for name, url in matches:
            name = clean_text(name)

            # 过滤条件
            if not name or len(name) < 2 or len(name) > 50:
                continue
            if name.lower() in seen_names:
                continue
            # 过滤包含括号数字的（如 "Ease of Use (4749)"）
            if re.search(r'\(\d+\)', name):
                continue
            # 过滤评价维度和按钮关键词
            name_lower = name.lower()
            if any(keyword in name_lower for keyword in filter_keywords):
                continue
            # 过滤纯数字或纯符号
            if re.match(r'^[\d\s\.\,\(\)\-\+\*\/]+$', name):
                continue

            seen_names.add(name_lower)

            tool = {
                "name": name,
                "url": url,
                "g2_url": url,
                "category": category_name,
                "category_key": category_key,
                "source": "g2",
                "scraped_at": get_timestamp(),
                "description": "",
                "rating": None,
                "reviews_count": None,
            }

            tools.append(tool)

        # 提取评分和评论数
        for tool in tools:
            name = tool["name"]
            # 找到工具名称在markdown中的位置（找第一个出现的位置）
            name_pos = markdown.find(name)
            if name_pos >= 0:
                # 查看名称附近500字符的内容
                context = markdown[name_pos:name_pos + 500]

                # 提取评分（格式：4.7/5 或 4.7 out of 5）
                rating_match = re.search(r'(\d\.\d)\s*(?:/5|out of 5|stars?)', context, re.IGNORECASE)
                if rating_match:
                    tool["rating"] = float(rating_match.group(1))

                # 提取评论数（格式：1,234 reviews 或 (14,072)）
                reviews_match = re.search(r'\(([\d,]+)\)', context)
                if reviews_match:
                    reviews_str = reviews_match.group(1).replace(",", "")
                    try:
                        reviews_count = int(reviews_str)
                        if 10 < reviews_count < 1000000:  # 合理范围
                            tool["reviews_count"] = reviews_count
                    except ValueError:
                        pass

                # 如果没找到，尝试另一种格式
                if not tool["reviews_count"]:
                    reviews_match2 = re.search(r'([\d,]+)\s*reviews?', context, re.IGNORECASE)
                    if reviews_match2:
                        reviews_str = reviews_match2.group(1).replace(",", "")
                        try:
                            tool["reviews_count"] = int(reviews_str)
                        except ValueError:
                            pass

        return tools

    def scrape_all_categories(self, categories: List[str] = None, max_tools_per_category: int = 20) -> List[Dict]:
        """
        抓取多个分类

        Args:
            categories: 分类键列表，默认全部
            max_tools_per_category: 每个分类最大工具数

        Returns:
            所有工具列表（去重）
        """
        if categories is None:
            categories = list(self.CATEGORIES.keys())

        all_tools = []
        seen_urls = set()

        for category_key in categories:
            logger.info(f"处理分类: {category_key}")
            tools = self.scrape_category(category_key, max_tools=max_tools_per_category)

            for tool in tools:
                url = tool.get("url", "")
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    all_tools.append(tool)

            # 避免请求过快
            if category_key != categories[-1]:
                import time
                time.sleep(3)

        logger.info(f"所有分类抓取完成: {len(all_tools)} 个唯一工具")
        self.results = all_tools
        return all_tools

    def get_tool_details(self, g2_url: str) -> Optional[Dict]:
        """
        获取单个工具在G2上的详细信息

        Args:
            g2_url: G2产品页面URL

        Returns:
            工具详细信息
        """
        logger.info(f"获取G2工具详情: {g2_url}")

        result = self.scrape_with_retry(g2_url, formats=["markdown"])

        if not result:
            return None

        markdown = result.get("markdown", "")
        metadata = result.get("metadata", {})

        details = {
            "url": g2_url,
            "title": metadata.get("title", ""),
            "description": "",
            "rating": None,
            "reviews_count": None,
            "pros": [],
            "cons": [],
            "pricing": "",
            "features": [],
            "alternatives": [],
        }

        # 提取描述（通常在标题后面）
        desc_match = re.search(r'##\s+(.+?)\n\n(.+?)(?=\n##|\Z)', markdown, re.DOTALL)
        if desc_match:
            details["description"] = clean_text(desc_match.group(2))[:500]

        # 提取评分
        rating_match = re.search(r'(\d\.\d)\s*(?:/5|out of 5)', markdown)
        if rating_match:
            details["rating"] = float(rating_match.group(1))

        # 提取评论数
        reviews_match = re.search(r'([\d,]+)\s*reviews?', markdown, re.IGNORECASE)
        if reviews_match:
            details["reviews_count"] = int(reviews_match.group(1).replace(",", ""))

        # 提取优点
        pros_section = re.search(r'(?:pros|what do you like best|liked most)[^\n]*\n(.+?)(?=\n##|\n###|\Z)', markdown, re.IGNORECASE | re.DOTALL)
        if pros_section:
            pros_text = pros_section.group(1)
            pros = re.findall(r'[-*]\s+(.+?)(?=\n[-*]|\n\n|\Z)', pros_text, re.DOTALL)
            details["pros"] = [clean_text(p)[:200] for p in pros[:5]]

        # 提取缺点
        cons_section = re.search(r'(?:cons|what do you dislike|disliked most)[^\n]*\n(.+?)(?=\n##|\n###|\Z)', markdown, re.IGNORECASE | re.DOTALL)
        if cons_section:
            cons_text = cons_section.group(1)
            cons = re.findall(r'[-*]\s+(.+?)(?=\n[-*]|\n\n|\Z)', cons_text, re.DOTALL)
            details["cons"] = [clean_text(c)[:200] for c in cons[:5]]

        return details


def test_g2_scraper():
    """测试G2爬虫"""
    print("=" * 60)
    print("🏢 G2 爬虫测试")
    print("=" * 60)

    scraper = G2Scraper()

    # 测试单个分类
    print("\n测试分类: AI写作助手")
    tools = scraper.scrape_category("ai-writing-assistant", max_tools=15)

    print(f"\n✅ 提取到 {len(tools)} 个工具")
    print("\n工具列表:")
    print("-" * 60)
    for i, tool in enumerate(tools[:10], 1):
        name = tool.get("name", "N/A")[:30]
        rating = tool.get("rating", "N/A")
        reviews = tool.get("reviews_count", "N/A")
        url = tool.get("url", "N/A")[:50]
        print(f"{i:2d}. {name:<30} 评分:{rating} 评论:{reviews}")
        print(f"    {url}")

    # 保存结果
    filename = scraper.save_results("g2_ai_writing_test.json")
    print(f"\n💾 结果已保存: {filename}")

    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)


if __name__ == "__main__":
    test_g2_scraper()
