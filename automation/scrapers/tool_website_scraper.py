#!/usr/bin/env python3
# 工具官网详情爬虫
# 使用Firecrawl抓取工具官网，自动提取工具详细信息

import sys
import re
import json
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent))

from scrapers.firecrawl_scraper import FirecrawlScraper
from utils.helpers import logger, get_timestamp, clean_text


class ToolWebsiteScraper(FirecrawlScraper):
    """工具官网详情爬虫"""

    def __init__(self, api_key: str = None):
        super().__init__(api_key)
        self.source_name = "tool_website"

    def scrape_tool_website(self, url: str, tool_name: str = None) -> Optional[Dict]:
        """
        抓取工具官网，提取详细信息

        Args:
            url: 工具官网URL
            tool_name: 工具名称（可选）

        Returns:
            工具详细信息字典
        """
        logger.info(f"抓取工具官网: {url}")

        # 抓取页面
        result = self.scrape_with_retry(url, formats=["markdown", "html"])

        if not result:
            logger.warning(f"抓取失败: {url}")
            return None

        markdown = result.get("markdown", "")
        metadata = result.get("metadata", {})

        # 提取工具信息
        tool_info = self._extract_tool_info(markdown, metadata, url, tool_name)

        logger.info(f"提取完成: {tool_info.get('name', 'Unknown')} - {len(tool_info.get('features', []))} 个功能")
        return tool_info

    def _extract_tool_info(self, markdown: str, metadata: dict, url: str, tool_name: str = None) -> Dict:
        """
        从Markdown中提取工具信息

        Args:
            markdown: Markdown内容
            metadata: 页面元数据
            url: 官网URL
            tool_name: 工具名称

        Returns:
            工具信息字典
        """
        tool_info = {
            "name": tool_name or metadata.get("title", ""),
            "url": url,
            "tagline": "",
            "description": "",
            "features": [],
            "pricing": "",
            "pricing_tiers": [],
            "target_users": [],
            "use_cases": [],
            "integrations": [],
            "pros": [],
            "cons": [],
            "category": "",
            "tags": [],
            "source": "tool_website",
            "scraped_at": get_timestamp(),
            "metadata": {
                "title": metadata.get("title", ""),
                "description": metadata.get("description", ""),
                "keywords": metadata.get("keywords", ""),
                "language": metadata.get("language", ""),
            },
        }

        # 提取标语（通常在H1或页面开头）
        tool_info["tagline"] = self._extract_tagline(markdown)

        # 提取描述
        tool_info["description"] = self._extract_description(markdown, metadata)

        # 提取功能列表
        tool_info["features"] = self._extract_features(markdown)

        # 提取定价信息
        pricing_info = self._extract_pricing(markdown)
        tool_info["pricing"] = pricing_info.get("summary", "")
        tool_info["pricing_tiers"] = pricing_info.get("tiers", [])

        # 提取目标用户
        tool_info["target_users"] = self._extract_target_users(markdown)

        # 提取使用场景
        tool_info["use_cases"] = self._extract_use_cases(markdown)

        # 提取集成
        tool_info["integrations"] = self._extract_integrations(markdown)

        # 提取分类和标签
        tool_info["category"] = self._extract_category(markdown, url)
        tool_info["tags"] = self._extract_tags(markdown)

        return tool_info

    def _extract_tagline(self, markdown: str) -> str:
        """提取标语"""
        # 尝试从H1提取
        h1_match = re.search(r'^#\s+(.+?)$', markdown, re.MULTILINE)
        if h1_match:
            tagline = clean_text(h1_match.group(1))
            if len(tagline) > 5 and len(tagline) < 200:
                return tagline

        # 尝试从页面开头的粗体或引用提取
        first_lines = markdown[:500]
        bold_match = re.search(r'\*\*(.+?)\*\*', first_lines)
        if bold_match:
            tagline = clean_text(bold_match.group(1))
            if len(tagline) > 5 and len(tagline) < 200:
                return tagline

        return ""

    def _extract_description(self, markdown: str, metadata: dict) -> str:
        """提取描述"""
        # 优先使用meta description
        meta_desc = metadata.get("description", "")
        if meta_desc and len(meta_desc) > 20:
            return clean_text(meta_desc)[:500]

        # 从页面内容中提取第一段有意义的文字
        paragraphs = re.findall(r'\n\n(.+?)\n\n', markdown, re.DOTALL)
        for p in paragraphs:
            p = clean_text(p)
            if len(p) > 50 and len(p) < 500:
                # 排除导航、菜单等
                if not any(skip in p.lower() for skip in ["sign up", "log in", "menu", "navigation", "cookie"]):
                    return p[:500]

        return ""

    def _extract_features(self, markdown: str) -> List[str]:
        """提取功能列表"""
        features = []

        # 方法1：提取列表项（- 或 * 开头）
        list_items = re.findall(r'^[-*]\s+(.+?)$', markdown, re.MULTILINE)
        for item in list_items:
            item = clean_text(item)
            if 10 < len(item) < 150:
                # 排除导航、链接等
                if not any(skip in item.lower() for skip in ["sign up", "log in", "read more", "learn more", "click here"]):
                    if item not in features:
                        features.append(item)

        # 方法2：提取H2/H3标题作为功能
        headings = re.findall(r'^#{2,3}\s+(.+?)$', markdown, re.MULTILINE)
        for heading in headings:
            heading = clean_text(heading)
            if 5 < len(heading) < 80:
                if not any(skip in heading.lower() for skip in ["pricing", "faq", "contact", "about", "blog", "home", "features"]):
                    if heading not in features:
                        features.append(heading)

        return features[:20]  # 最多20个功能

    def _extract_pricing(self, markdown: str) -> Dict:
        """提取定价信息"""
        result = {
            "summary": "",
            "tiers": [],
        }

        # 查找定价部分
        pricing_section = ""
        pricing_match = re.search(r'(?:pricing|价格|定价|plans|套餐)[^\n]*\n(.+?)(?=\n##|\n###|\Z)', markdown, re.IGNORECASE | re.DOTALL)
        if pricing_match:
            pricing_section = pricing_match.group(1)

        if not pricing_section:
            # 如果没有找到明确的定价部分，在全文搜索价格
            pricing_section = markdown

        # 提取价格（$XX/月 或 $XX/年 或 Free）
        price_patterns = [
            r'\$(\d+(?:\.\d+)?)\s*(?:/|per|每)\s*(?:month|月|mo|year|年|yr)',
            r'(\$\d+(?:\.\d+)?)\s*(?:/|per|每)\s*(?:month|月|mo|year|年|yr)',
            r'(Free|免费)\s*(?:plan|套餐|版)?',
            r'\$(\d+(?:\.\d+)?)',
        ]

        prices_found = []
        for pattern in price_patterns:
            matches = re.findall(pattern, pricing_section, re.IGNORECASE)
            prices_found.extend(matches)

        if prices_found:
            result["summary"] = f"找到 {len(prices_found)} 个价格点: {', '.join(str(p) for p in prices_found[:5])}"

        # 提取定价套餐
        tier_patterns = [
            r'(Free|Starter|Basic|Pro|Business|Enterprise|Team|个人|专业|企业|团队|免费|入门)[^\n]*\n(.+?)(?=\n[A-Z]|\n##|\Z)',
        ]

        for pattern in tier_patterns:
            matches = re.findall(pattern, pricing_section, re.IGNORECASE | re.DOTALL)
            for tier_name, tier_desc in matches:
                tier_name = clean_text(tier_name)
                tier_desc = clean_text(tier_desc)[:200]
                if tier_name and tier_desc:
                    # 提取价格
                    price_match = re.search(r'\$(\d+(?:\.\d+)?)', tier_desc)
                    price = price_match.group(1) if price_match else ""

                    result["tiers"].append({
                        "name": tier_name,
                        "price": price,
                        "description": tier_desc,
                    })

        return result

    def _extract_target_users(self, markdown: str) -> List[str]:
        """提取目标用户"""
        users = []

        # 查找"for XXX"或"适合XXX"
        user_patterns = [
            r'(?:for|适合|面向|针对)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'(?:designed for|built for|made for)\s+(.+?)(?:\.|,|\n)',
        ]

        for pattern in user_patterns:
            matches = re.findall(pattern, markdown, re.IGNORECASE)
            for match in matches:
                user = clean_text(match)
                if 3 < len(user) < 50 and user not in users:
                    users.append(user)

        return users[:10]

    def _extract_use_cases(self, markdown: str) -> List[str]:
        """提取使用场景"""
        use_cases = []

        # 查找"use cases"或"使用场景"部分
        uc_match = re.search(r'(?:use cases?|使用场景|应用场景)[^\n]*\n(.+?)(?=\n##|\n###|\Z)', markdown, re.IGNORECASE | re.DOTALL)
        if uc_match:
            uc_section = uc_match.group(1)
            items = re.findall(r'[-*]\s+(.+?)(?=\n[-*]|\n\n|\Z)', uc_section, re.DOTALL)
            for item in items:
                item = clean_text(item)
                if 10 < len(item) < 150 and item not in use_cases:
                    use_cases.append(item)

        return use_cases[:10]

    def _extract_integrations(self, markdown: str) -> List[str]:
        """提取集成"""
        integrations = []

        # 查找"integrations"或"集成"部分
        int_match = re.search(r'(?:integrations?|集成|整合)[^\n]*\n(.+?)(?=\n##|\n###|\Z)', markdown, re.IGNORECASE | re.DOTALL)
        if int_match:
            int_section = int_match.group(1)
            # 提取集成名称（通常是链接或列表）
            items = re.findall(r'\[([^\]]+)\]\(', int_section)
            for item in items:
                item = clean_text(item)
                if 2 < len(item) < 50 and item not in integrations:
                    integrations.append(item)

        return integrations[:15]

    def _extract_category(self, markdown: str, url: str) -> str:
        """提取分类"""
        # 根据URL和内容判断分类
        category_keywords = {
            "writing": ["writing", "写作", "copy", "文案", "content", "内容"],
            "image": ["image", "图像", "图片", "photo", "照片", "design", "设计"],
            "video": ["video", "视频", "movie", "电影"],
            "audio": ["audio", "音频", "voice", "语音", "speech", "tts", "music", "音乐"],
            "coding": ["code", "代码", "coding", "编程", "developer", "开发", "programming"],
            "chatbot": ["chat", "聊天", "bot", "机器人", "assistant", "助手"],
            "productivity": ["productivity", "生产力", "效率", "task", "任务", "project", "项目"],
            "marketing": ["marketing", "营销", "seo", "广告", "social", "社交"],
            "search": ["search", "搜索", "research", "研究"],
            "data": ["data", "数据", "analytics", "分析", "dashboard", "仪表盘"],
        }

        text = (markdown + " " + url).lower()

        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    return category

        return "other"

    def _extract_tags(self, markdown: str) -> List[str]:
        """提取标签"""
        tags = []

        # 从meta keywords提取
        # 从内容中提取常见标签词
        common_tags = [
            "AI", "GPT", "LLM", "Machine Learning", "Deep Learning",
            "NLP", "Computer Vision", "Automation", "Productivity",
            "SaaS", "Cloud", "API", "Open Source", "Freemium",
        ]

        text = markdown.lower()
        for tag in common_tags:
            if tag.lower() in text:
                tags.append(tag)

        return tags[:10]

    def batch_scrape_tools(self, tools: List[Dict], delay: int = 3) -> List[Dict]:
        """
        批量抓取工具官网详情

        Args:
            tools: 工具列表，每个包含name和url
            delay: 每个请求之间的延迟

        Returns:
            包含详细信息的工具列表
        """
        results = []

        for i, tool in enumerate(tools, 1):
            name = tool.get("name", f"Tool {i}")
            url = tool.get("url", "")

            if not url:
                logger.warning(f"跳过 {name}: 无URL")
                continue

            logger.info(f"批量抓取 ({i}/{len(tools)}): {name}")

            tool_info = self.scrape_tool_website(url, name)
            if tool_info:
                # 合并原始信息
                merged = {**tool, **tool_info}
                results.append(merged)
            else:
                results.append(tool)

            if i < len(tools):
                import time
                time.sleep(delay)

        logger.info(f"批量抓取完成: {len(results)}/{len(tools)} 成功")
        self.results = results
        return results


def test_tool_website_scraper():
    """测试工具官网爬虫"""
    print("=" * 60)
    print("🌐 工具官网爬虫测试")
    print("=" * 60)

    scraper = ToolWebsiteScraper()

    # 测试几个工具官网
    test_tools = [
        {"name": "Jasper", "url": "https://www.jasper.ai/"},
        {"name": "Grammarly", "url": "https://www.grammarly.com/"},
    ]

    for tool in test_tools:
        print(f"\n测试: {tool['name']} - {tool['url']}")
        print("-" * 60)

        result = scraper.scrape_tool_website(tool["url"], tool["name"])

        if result:
            print(f"✅ 抓取成功")
            print(f"   名称: {result.get('name', 'N/A')}")
            print(f"   标语: {result.get('tagline', 'N/A')[:80]}")
            print(f"   描述: {result.get('description', 'N/A')[:100]}...")
            print(f"   功能数: {len(result.get('features', []))}")
            print(f"   功能: {', '.join(result.get('features', [])[:5])}")
            print(f"   定价: {result.get('pricing', 'N/A')[:80]}")
            print(f"   分类: {result.get('category', 'N/A')}")
            print(f"   标签: {', '.join(result.get('tags', []))}")
        else:
            print("❌ 抓取失败")

        print()

    # 保存结果
    filename = scraper.save_results("tool_website_test.json")
    print(f"💾 结果已保存: {filename}")

    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)


if __name__ == "__main__":
    test_tool_website_scraper()
