# 🛰️ AI Tools Radar - AI 工具导航与评测

发现最优质的 AI 工具，120+ 精选工具，涵盖写作、图像、视频、编程、音频、效率等分类，含详细评测、价格对比和用户评分。

## ✨ 功能特性

- 🔍 **智能搜索** - 实时搜索工具名称、描述和标签
- 🏷️ **分类筛选** - 6 大分类，快速定位所需工具
- ⭐ **用户评分** - 5 星评分系统，查看其他用户评价
- ❤️ **工具收藏** - 收藏喜欢的工具，本地保存
- 🌙 **暗色模式** - 一键切换明暗主题，保护眼睛
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 📊 **详细信息** - 每个工具含价格、平台、功能、评分
- 🔗 **相关推荐** - 详情页展示同类相关工具
- 📈 **SEO 优化** - sitemap、robots、结构化数据

## 🚀 快速开始

### 本地预览

直接用浏览器打开 `index.html` 即可。

### 部署到 GitHub Pages

1. Fork 或上传本仓库到 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 `main` 分支，文件夹选择 `/ (root)`
4. 保存后等待部署，访问 `https://<用户名>.github.io/<仓库名>/`

## ⚙️ 配置指南

### 1. 配置 Google AdSense（广告变现）

1. 申请 Google AdSense 账号：https://www.google.com/adsense
2. 审核通过后，获取发布商 ID（格式：`ca-pub-XXXXXXXXXXXXXXXX`）
3. 编辑 `index.html`，找到 AdSense 相关注释代码
4. 取消注释并替换 `ca-pub-XXXXXXXXXXXXXXXX` 为你的发布商 ID
5. 同样替换所有 `data-ad-client` 和 `data-ad-slot` 的值
6. 提交代码，等待广告显示

### 2. 配置 Google Analytics（流量统计）

1. 创建 Google Analytics 4 账号：https://analytics.google.com
2. 获取衡量 ID（格式：`G-XXXXXXXXXX`）
3. 编辑 `index.html`，找到 Google Analytics 注释代码
4. 取消注释并替换所有 `G-XXXXXXXXXX` 为你的衡量 ID
5. 提交代码，24 小时后可查看流量数据

### 3. 配置自定义域名

1. 购买域名（推荐：Namecheap、Cloudflare、阿里云）
2. 在域名 DNS 管理中添加 CNAME 记录：
   - 主机记录：`www`（或 `@`）
   - 记录值：`<用户名>.github.io`
3. 在本仓库根目录创建 `CNAME` 文件，内容为你的域名（如 `www.aitoolsradar.com`）
4. 进入仓库 Settings → Pages，在 Custom domain 中填入你的域名
5. 等待 DNS 生效（通常几分钟到几小时）
6. 勾选 Enforce HTTPS

### 4. 提交到 Google Search Console

1. 访问 https://search.google.com/search-console
2. 添加资源，选择网址前缀，输入你的网站地址
3. 验证所有权（推荐用 HTML 标签验证）
4. 提交 sitemap：`https://你的域名/sitemap.xml`
5. 等待 Google 收录

## 📁 项目结构

```
ai-tools-radar/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 脚本文件（含工具数据）
├── sitemap.xml         # SEO 站点地图
├── robots.txt          # 爬虫规则
├── README.md           # 项目说明
└── .github/
    └── workflows/
        └── maintain.yml # 自动维护工作流
```

## 🔧 添加新工具

编辑 `script.js`，在 `tools` 数组中添加新对象：

```javascript
{
    name: "工具名称",
    icon: "🎯",           // emoji 图标
    desc: "工具描述",
    category: "writing",   // writing/image/video/code/audio/productivity
    tags: ["标签1", "标签2"],
    link: "https://example.com",
    price: "免费/付费 $XX/月",
    platforms: ["Web", "iOS"],
    features: ["功能1", "功能2"]
}
```

## 🤖 自动化维护

项目包含 GitHub Actions 工作流（`.github/workflows/maintain.yml`）：

- **每周一自动运行**
- 检查网站、sitemap、robots 可访问性
- 自动创建 Issue 提醒更新工具数据
- 支持手动触发

## 📊 技术栈

- 纯 HTML + CSS + JavaScript（无框架）
- LocalStorage 存储用户数据（收藏、评分、访问计数）
- Hash 路由实现详情页
- GitHub Pages 免费托管
- GitHub Actions 自动化维护

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**AI Tools Radar** - 让 AI 工具触手可及 🚀
