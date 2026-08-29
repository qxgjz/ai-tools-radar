#!/usr/bin/env python3
# Firecrawl API 测试脚本
# 测试Firecrawl能否突破G2/Capterra等网站的反爬

import sys
import json
import time
import urllib.request
import ssl
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

FIRECRAWL_API = "https://api.firecrawl.dev/v2/scrape"

# 测试网站列表
TEST_URLS = [
    {
        "name": "G2 - AI Writing Assistant",
        "url": "https://www.g2.com/categories/ai-writing-assistant",
        "expect": "反爬强，之前403",
    },
    {
        "name": "Capterra - AI Writing",
        "url": "https://www.capterra.com/ai-writing-assistant-software/",
        "expect": "反爬强，之前403",
    },
    {
        "name": "AlternativeTo - AI Writing",
        "url": "https://alternativeto.net/browse/search/?q=ai+writing",
        "expect": "反爬强，之前403",
    },
    {
        "name": "Jasper AI官网",
        "url": "https://www.jasper.ai/",
        "expect": "AI工具官网，JS渲染",
    },
    {
        "name": "Product Hunt产品页",
        "url": "https://www.producthunt.com/products/jasper",
        "expect": "Product Hunt，反爬强",
    },
]


def firecrawl_scrape(url, api_key=None, formats=None):
    """
    调用Firecrawl API抓取网页

    Args:
        url: 要抓取的URL
        api_key: API Key（可选，无Key也能调用但有限速）
        formats: 返回格式列表

    Returns:
        抓取结果字典
    """
    if formats is None:
        formats = ["markdown", "html"]

    payload = {
        "url": url,
        "formats": formats,
        "onlyMainContent": True,
    }

    headers = {
        "Content-Type": "application/json",
    }

    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    # 创建不验证SSL的上下文
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(FIRECRAWL_API, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as response:
            result = json.loads(response.read().decode("utf-8"))
            return {
                "success": True,
                "status_code": response.status,
                "data": result,
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        return {
            "success": False,
            "status_code": e.code,
            "error": error_body,
        }
    except Exception as e:
        return {
            "success": False,
            "status_code": 0,
            "error": str(e),
        }


def test_firecrawl():
    """测试Firecrawl API"""
    print("=" * 70)
    print("🔥 Firecrawl API 测试")
    print("=" * 70)
    print(f"API端点: {FIRECRAWL_API}")
    print(f"测试网站数: {len(TEST_URLS)}")
    print()

    results = []

    for i, test in enumerate(TEST_URLS, 1):
        print(f"[{i}/{len(TEST_URLS)}] 测试: {test['name']}")
        print(f"  URL: {test['url']}")
        print(f"  预期: {test['expect']}")
        print("  正在抓取...", end=" ", flush=True)

        start_time = time.time()
        result = firecrawl_scrape(test["url"])
        elapsed = time.time() - start_time

        if result["success"]:
            data = result.get("data", {})
            success = data.get("success", False)
            markdown = data.get("data", {}).get("markdown", "")
            metadata = data.get("data", {}).get("metadata", {})

            print(f"✅ 成功 ({elapsed:.1f}秒)")
            print(f"  状态码: {result['status_code']}")
            print(f"  API成功: {success}")
            print(f"  Markdown长度: {len(markdown)} 字符")
            print(f"  标题: {metadata.get('title', 'N/A')[:60]}")

            if markdown:
                # 打印前300字符
                preview = markdown[:300].replace("\n", " ")
                print(f"  内容预览: {preview}...")

                # 检查是否包含有意义的内容
                content_indicators = ["product", "tool", "ai", "feature", "price", "review"]
                found_indicators = [ind for ind in content_indicators if ind in markdown.lower()]
                print(f"  内容指标: 找到 {len(found_indicators)}/{len(content_indicators)} 个关键词")

            results.append({
                "name": test["name"],
                "url": test["url"],
                "success": success,
                "markdown_length": len(markdown),
                "elapsed": elapsed,
                "status": "success" if success and len(markdown) > 100 else "partial",
            })

        else:
            print(f"❌ 失败 ({elapsed:.1f}秒)")
            print(f"  状态码: {result['status_code']}")
            print(f"  错误: {result.get('error', 'Unknown')[:200]}")
            results.append({
                "name": test["name"],
                "url": test["url"],
                "success": False,
                "markdown_length": 0,
                "elapsed": elapsed,
                "status": "failed",
            })

        print()
        # 避免请求过快
        if i < len(TEST_URLS):
            time.sleep(2)

    # 汇总
    print("=" * 70)
    print("📊 测试结果汇总")
    print("=" * 70)
    print(f"{'网站':<30} {'状态':<10} {'Markdown长度':<15} {'耗时':<10}")
    print("-" * 70)

    success_count = 0
    for r in results:
        status_icon = "✅" if r["status"] == "success" else "⚠️" if r["status"] == "partial" else "❌"
        print(f"{r['name'][:28]:<30} {status_icon} {r['status']:<8} {r['markdown_length']:<15} {r['elapsed']:.1f}s")
        if r["status"] == "success":
            success_count += 1

    print("-" * 70)
    print(f"完全成功: {success_count}/{len(results)}")
    print(f"部分成功: {sum(1 for r in results if r['status'] == 'partial')}/{len(results)}")
    print(f"失败: {sum(1 for r in results if r['status'] == 'failed')}/{len(results)}")
    print("=" * 70)

    # 保存结果
    output_file = Path(__file__).parent / "data" / "raw" / "firecrawl_test_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n💾 结果已保存: {output_file}")

    return results


if __name__ == "__main__":
    test_firecrawl()
