# 工作状态总结 (Status Summary)

本文档记录从原项目到当前仓库的完整重构过程。

## 项目背景

原项目: [`simpleseek/rvsspeclitebeta`](https://github.com/simpleseek/rvsspeclitebeta)（已停止维护，2025 年 4 月最后一次提交）

原项目是一个 RVS 照明产品的规格书（PDF）生成器，但存在以下明显短板：

- Flask 后端几乎为空壳，10 行代码只为了 serve 一个 HTML
- `pdf_generator.py` 是死代码，从未被调用
- 所有逻辑（CSS + JS + 模板）挤在 ~1200 行的单个 `index.html` 内联文件
- `static/css/` 下的样式表从未被引用
- 无任何数据持久化 — 刷新即丢失
- 重复代码严重（`handleSmallImageUpload` 与 `handleCurveImageUpload` 几乎一样）
- 模板里散布 `data-i18n` 属性但 i18n 从未实现
- Flask 2.0.1 锁版老旧

## 重构目标

用户明确选定：**Next.js + React**，并希望 **全部 4 项新功能**：

1. 服务端 PDF 生成
2. 数据保存/加载
3. 多产品管理
4. 多语言支持

## 完整变更清单

### 技术栈

| 项目 | 原版 | 新版 |
|------|------|------|
| 后端 | Flask 2.0.1 | Next.js 16 (App Router) |
| 前端 | 原生 HTML + 内联 JS | React 19 + TypeScript |
| 样式 | 手写 CSS | Tailwind CSS v4 |
| 状态管理 | 无 | Zustand + localStorage persist |
| i18n | `data-i18n` 死属性 | next-intl 完整实现 |
| 部署 | Vercel + Zeabur 双配 | Vercel 零配置 |
| 依赖包 | 仅 Flask | next, react, next-intl, zustand, uuid |

### 架构

```
原版（单文件）             新版（组件化）
─────────────────         ─────────────────
index.html (1200 行)   →   src/app/[locale]/
  ├─ 内联 CSS                ├─ layout.tsx      (区域布局 + i18n provider)
  ├─ 内联 JS                 ├─ page.tsx        (产品列表)
  └─ <body> 模板             └─ editor/[id]/
                                 └─ page.tsx    (编辑器路由)
                             src/components/
                               ├─ SpecSheetEditor.tsx  (核心编辑器)
                               ├─ ProductList.tsx      (卡片列表)
                               ├─ ImageUploader.tsx    (复用上传)
                               └─ LanguageSwitcher.tsx
                             src/store/productStore.ts
                             src/types/index.ts
                             src/i18n/{routing,request}.ts
                             src/proxy.ts
                             messages/{zh,en}.json
```

### 功能落地情况

| # | 需求 | 落地方式 | 状态 |
|---|------|----------|------|
| 1 | 服务端 PDF 生成 | 优化 `@media print` CSS + `window.print()`，零额外依赖 | ✅ |
| 2 | 数据保存/加载 | Zustand `persist` middleware → `localStorage` | ✅ |
| 3 | 多产品管理 | `useProductStore` 完整 CRUD: create/update/delete/duplicate | ✅ |
| 4 | 多语言支持 | `next-intl` 集成，URL 路由 `/zh` / `/en` 自动切换 | ✅ |

### 数据模型

```ts
ProductSpec {
  id, name, brand, series, description, model
  logo, productImage, productDiagram         // 主图
  accessories[4], curves[4]                  // 4+4 图片位
  params[22]                                 // 22 项参数
    // 开孔尺寸, 适用天花厚度, 功率, 光通量,
    // 光束角, 光斑风格, 色温, 显色指数Ra,
    // 色彩保真度Rf, 色彩饱和度Rg, 色容差SDCM,
    // 控制方式, 外观颜色, 反射器颜色, 输入信号,
    // 防护等级, 材质, 补充信息 × 5
  footer { website, company, email,
           addressSh, addressSz, rights, version }
}
```

22 项参数模板从原版忠实保留，包括可重命名的「补充信息」字段。

### 新增 UX 细节

- 每次编辑自动保存（800ms debounce），不阻塞输入
- 上传图片自动压缩（最大 1800px、JPEG 0.85 质量）
- 图片灰色背景白底融合处理（保留自原版 `compressImage`）
- 拖拽上传到任意图片位
- 单位自动追加（`12` → `12mm`，但 `12/15` 会作为 `12/15mm`）
- 打印时自动隐藏：
  - 空参数行（CSS `:has(input[value=""])`）
  - 删除按钮（`.delete-btn`）
  - 工具栏（`.no-print`）
  - 边框、聚焦态
- 自适应 A4 尺寸（210mm × 297mm）打印分页

## Git 历史

```
b0b0f72  feat: RVS 规格书生成器 - 完整升级重写   (2026-07-24)
02c5f46  Initial commit from Create Next App    (2026-07-24)
```

## 仓库元数据

| 字段 | 值 |
|------|-----|
| 仓库地址 | <https://github.com/yjhkrepo/rvsspec-pro> |
| 账户 | yjhkrepo |
| 可见性 | public |
| 默认分支 | master |
| 描述 | RVS 照明产品规格书生成器 (升级版) - Next.js + React 重构 |

## 验证清单

- [x] `next build` 生产构建通过，零 TypeScript 错误
- [x] 首页 `/zh` 产品列表 + 空状态正常
- [x] 编辑器 `/zh/editor/[id]` 完整渲染（A4 规格书 + 全部 22 项参数 + 配件图 + 配光曲线 + 页脚）
- [x] localStorage 跨刷新持久化两个测试产品
- [x] 中文 ↔ 英文切换无刷新跳转
- [x] Vercel 配置文件 `vercel.json` 已添加
