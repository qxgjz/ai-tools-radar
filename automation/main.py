#!/usr/bin/env python3
# AI工具信息自动采集器 - 主程序
# AI Tools Radar - Main Automation Script

import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from config import (
    OUTPUT_DIR,
    PROCESSED_DATA_DIR,
    EXISTING_TOOLS_FILE,
)
from utils.helpers import (
    logger,
    save_json,
    load_json,
    get_timestamp,
    get_date_string,
    is_duplicate,
    validate_tool_data,
    print_summary,
    normalize_tool_name,
)
from scrapers.producthunt_rss_scraper import ProductHuntRSSScraper
from scrapers.g2_scraper import G2Scraper
from scrapers.tool_website_scraper import ToolWebsiteScraper


class AIToolsCollector:
    """AI工具信息采集器主类"""

    def __init__(self):
        self.existing_tools = self._load_existing_tools()
        self.new_tools = []
        self.duplicates = []
        self.invalid = []
        self.all_scraped = []

    def _load_existing_tools(self) -> list:
        """
        加载现有工具库，用于去重

        Returns:
            现有工具列表
        """
        if EXISTING_TOOLS_FILE.exists():
            try:
                with open(EXISTING_TOOLS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                tools = data.get("tools", data) if isinstance(data, dict) else data
                logger.info(f"加载现有工具库: {len(tools)} 个工具")
                return tools
            except Exception as e:
                logger.warning(f"加载现有工具库失败: {e}")
        else:
            logger.info("现有工具库文件不存在，将创建新的")
        return []

    def collect_from_producthunt(self) -> list:
        """
        从Product Hunt采集AI工具（使用RSS Feed）

        Returns:
            采集到的工具列表
        """
        logger.info("开始从Product Hunt RSS采集AI工具")
        scraper = ProductHuntRSSScraper()
        products = scraper.scrape(filter_ai=True)
        scraper.save_results(products)
        return products

    def collect_from_g2(self, categories: list = None, max_tools: int = 20) -> list:
        """
        从G2采集AI工具（使用Firecrawl突破反爬）

        Args:
            categories: 分类列表，默认全部
            max_tools: 每个分类最大工具数

        Returns:
            采集到的工具列表
        """
        logger.info("开始从G2采集AI工具")
        scraper = G2Scraper()
        tools = scraper.scrape_all_categories(categories=categories, max_tools_per_category=max_tools)
        scraper.save_results("g2_tools.json")
        return tools

    def collect_tool_details(self, tools: list, delay: int = 3) -> list:
        """
        采集工具官网详细信息

        Args:
            tools: 工具列表，每个包含name和url
            delay: 请求间隔

        Returns:
            包含详细信息的工具列表
        """
        logger.info(f"开始采集 {len(tools)} 个工具官网详情")
        scraper = ToolWebsiteScraper()
        detailed_tools = scraper.batch_scrape_tools(tools, delay=delay)
        scraper.save_results("tool_details.json")
        return detailed_tools

    def process_tools(self, tools: list, source: str = "unknown") -> dict:
        """
        处理采集到的工具：去重、验证、分类

        Args:
            tools: 工具列表
            source: 数据来源

        Returns:
            处理结果统计
        """
        logger.info(f"处理来自 {source} 的 {len(tools)} 个工具")

        for tool in tools:
            self.all_scraped.append(tool)

            # 检查重复
            tool_name = tool.get("name", "")
            if is_duplicate(tool_name, self.existing_tools + self.new_tools):
                self.duplicates.append(tool)
                logger.debug(f"重复工具: {tool_name}")
                continue

            # 验证数据
            validation = validate_tool_data(tool)
            if not validation["is_valid"]:
                self.invalid.append({
                    "tool": tool,
                    "errors": validation["errors"],
                })
                logger.debug(f"无效工具: {tool_name}, 错误: {validation['errors']}")
                continue

            # 添加来源和时间戳
            tool["source"] = source
            tool["discovered_at"] = get_timestamp()
            tool["status"] = "pending_review"

            self.new_tools.append(tool)
            logger.info(f"新增工具: {tool_name}")

        return {
            "total": len(tools),
            "new": len(self.new_tools),
            "duplicates": len(self.duplicates),
            "invalid": len(self.invalid),
        }

    def generate_output(self) -> dict:
        """
        生成最终输出

        Returns:
            输出结果字典
        """
        timestamp = get_timestamp()
        date_str = get_date_string()

        output = {
            "report_title": "AI工具雷达 - 新工具发现报告",
            "generated_at": timestamp,
            "date": date_str,
            "summary": {
                "total_scraped": len(self.all_scraped),
                "new_tools": len(self.new_tools),
                "duplicates": len(self.duplicates),
                "invalid": len(self.invalid),
                "existing_tools": len(self.existing_tools),
            },
            "new_tools": self.new_tools,
            "duplicates": [
                {"name": t.get("name"), "url": t.get("url")}
                for t in self.duplicates
            ],
            "invalid_tools": self.invalid,
            "recommendations": self._generate_recommendations(),
        }

        # 保存完整报告
        report_filename = f"new_tools_report_{timestamp}.json"
        save_json(output, report_filename, OUTPUT_DIR)

        # 保存精简版（仅新工具，便于审核）
        simple_output = {
            "generated_at": timestamp,
            "count": len(self.new_tools),
            "tools": self.new_tools,
        }
        simple_filename = f"new_tools_simple_{date_str}.json"
        save_json(simple_output, simple_filename, PROCESSED_DATA_DIR)

        output["output_file"] = str(OUTPUT_DIR / report_filename)
        output["simple_file"] = str(PROCESSED_DATA_DIR / simple_filename)

        return output

    def _generate_recommendations(self) -> list:
        """
        生成工具审核和录入建议

        Returns:
            建议列表
        """
        recommendations = []

        if self.new_tools:
            # 按投票数排序（如果有）
            sorted_tools = sorted(
                self.new_tools,
                key=lambda x: x.get("votes", 0),
                reverse=True,
            )

            recommendations.append({
                "priority": "high",
                "action": "优先审核和录入",
                "tools": [t.get("name") for t in sorted_tools[:5]],
                "reason": "Product Hunt热门AI工具，用户关注度高",
            })

        if len(self.new_tools) > 5:
            recommendations.append({
                "priority": "medium",
                "action": "常规审核和录入",
                "tools": [t.get("name") for t in sorted_tools[5:]],
                "reason": "有一定价值，可在本周内完成审核",
            })

        if self.duplicates:
            recommendations.append({
                "priority": "low",
                "action": "检查是否需要更新现有工具信息",
                "tools": [t.get("name") for t in self.duplicates[:10]],
                "reason": "工具已存在，可检查是否有新信息需要更新",
            })

        return recommendations

    def run(self, sources: list = None) -> dict:
        """
        运行完整的采集流程

        Args:
            sources: 数据源列表，默认全部
                     支持: producthunt, g2, tool_details

        Returns:
            采集结果
        """
        if sources is None:
            sources = ["producthunt"]

        logger.info(f"启动AI工具采集器，数据源: {sources}")
        start_time = datetime.now()

        # 从各数据源采集
        if "producthunt" in sources:
            try:
                ph_tools = self.collect_from_producthunt()
                self.process_tools(ph_tools, "producthunt")
            except Exception as e:
                logger.error(f"Product Hunt采集失败: {e}")

        if "g2" in sources:
            try:
                g2_tools = self.collect_from_g2(max_tools=15)
                self.process_tools(g2_tools, "g2")
            except Exception as e:
                logger.error(f"G2采集失败: {e}")

        if "tool_details" in sources:
            try:
                # 对新发现的工具采集官网详情
                if self.new_tools:
                    logger.info(f"为 {len(self.new_tools)} 个新工具采集官网详情")
                    detailed_tools = self.collect_tool_details(self.new_tools)
                    # 更新new_tools
                    self.new_tools = detailed_tools
            except Exception as e:
                logger.error(f"工具详情采集失败: {e}")

        # 生成输出
        output = self.generate_output()

        # 计算耗时
        elapsed = (datetime.now() - start_time).total_seconds()
        output["elapsed_seconds"] = elapsed

        # 打印摘要
        print_summary(output["summary"])
        print(f"⏱️  总耗时: {elapsed:.1f} 秒")
        print(f"📄 完整报告: {output.get('output_file', 'N/A')}")
        print(f"📋 精简列表: {output.get('simple_file', 'N/A')}")

        return output


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="AI工具信息自动采集器")
    parser.add_argument(
        "--sources",
        nargs="+",
        default=["producthunt"],
        help="数据源列表 (默认: producthunt，支持: producthunt, g2, tool_details)",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="显示详细日志",
    )

    args = parser.parse_args()

    if args.verbose:
        import logging
        logging.getLogger().setLevel(logging.DEBUG)

    print("=" * 60)
    print("🤖 AI工具雷达 - 自动采集器")
    print("=" * 60)
    print(f"数据源: {', '.join(args.sources)}")
    print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")

    collector = AIToolsCollector()
    result = collector.run(sources=args.sources)

    return result


if __name__ == "__main__":
    main()
