# RVS 规格书生成器 Pro

RVS 照明产品规格书生成工具，基于 Next.js 14 + React + TypeScript 重构。

## 功能

- **多产品管理** — 创建、编辑、复制、删除产品规格书，数据持久化在浏览器本地
- **A4 规格书编辑** — 所见即所得的 A4 规格书编辑器，支持产品图、线图、配件图、配光曲线上传
- **参数编辑** — 22 项照明参数（功率、光通量、色温、CRI 等），支持自定义补充信息字段
- **PDF 导出** — 浏览器原生打印导出高质量 PDF，打印时自动隐藏空行和编辑元素
- **中英文切换** — 完整 i18n 支持，一键切换中/英文界面
- **图片压缩** — 上传图片自动压缩，灰色背景自动处理
- **拖拽上传** — 所有图片区域支持拖拽上传
- **自动保存** — 编辑即保存，刷新不丢失

## 技术栈

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- next-intl (i18n)
- Zustand (状态管理 + localStorage 持久化)

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:3000

## 部署

### Vercel

1. Fork / 推送到 GitHub
2. 在 Vercel 导入仓库
3. 自动识别 Next.js，点击部署

### 其他平台

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局 (html/body)
│   ├── page.tsx                # 根页面 (重定向到 /zh)
│   ├── globals.css             # 全局样式 + 打印 CSS
│   └── [locale]/
│       ├── layout.tsx          # 区域布局 (i18n provider + header)
│       ├── page.tsx            # 首页 (产品列表)
│       └── editor/[id]/
│           └── page.tsx        # 编辑器页面
├── components/
│   ├── SpecSheetEditor.tsx     # 规格书编辑器 (核心组件)
│   ├── ProductList.tsx         # 产品列表
│   ├── ImageUploader.tsx       # 可复用图片上传组件
│   ├── LanguageSwitcher.tsx    # 语言切换
│   └── DefaultLogo.ts          # 默认 LOGO 路径
├── store/
│   └── productStore.ts         # Zustand 状态管理 + 持久化
├── types/
│   └── index.ts                # 类型定义 + 默认模板
├── i18n/
│   ├── routing.ts              # 路由配置
│   └── request.ts              # 请求配置
└── proxy.ts                    # i18n 中间件
messages/
├── zh.json                     # 中文翻译
└── en.json                     # 英文翻译
```

## 与原项目的区别

| 特性 | 原项目 (rvsspeclitebeta) | 新项目 (rvsspec-pro) |
|------|--------------------------|----------------------|
| 技术栈 | Flask + 原生 HTML/JS | Next.js + React + TS |
| 架构 | 单文件 1200 行 HTML | 组件化，类型安全 |
| 数据持久化 | 无（刷新丢失） | localStorage 自动保存 |
| 多产品 | 不支持 | 完整 CRUD |
| 多语言 | data-i18n 属性但未实现 | next-intl 完整实现 |
| PDF 导出 | window.print() | 优化的 print CSS |
| 代码复用 | 大量重复代码 | 可复用组件 |
| 部署 | Flask + Vercel/Zeabur | 纯前端，Vercel 零配置 |

## License

MIT
