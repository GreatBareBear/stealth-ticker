# Tighten Content Security Policy (CSP) Spec

## Why
当前渲染进程（`index.html`）的 CSP（内容安全策略）过于宽松。其中 `connect-src *` 允许应用连接任意外部域，`script-src 'unsafe-inline'` 允许执行任意内联脚本。对于一款主打“安全、隐蔽”的金融盯盘工具而言，这极大地增加了数据泄露和跨站脚本攻击（XSS）的风险，与安全目标背道而驰。

## What Changes
- 修改 `client/src/renderer/index.html` 中的 `<meta http-equiv="Content-Security-Policy">` 标签。
- **收紧 `connect-src`**：移除 `*`，替换为白名单列表：`'self'`、腾讯行情 API 域名（`https://qt.gtimg.cn https://smartbox.gtimg.cn`）以及本地开发所需的 WebSocket 地址（`ws://localhost:* ws://127.0.0.1:*`）。
- **收紧 `script-src`**：移除 `'unsafe-inline'`，仅保留 `'self'`。
- **保留 `style-src` 的 `'unsafe-inline'`**：由于项目使用了 Ant Design 组件库，其底层的 CSS-in-JS 方案强依赖动态注入 `<style>` 标签，如果移除会导致应用丢失所有样式，因此作为折中安全方案予以保留。

## Impact
- Affected specs: 渲染进程安全边界。
- Affected code: `client/src/renderer/index.html`

## MODIFIED Requirements
### Requirement: 严格的渲染进程 CSP
所有的外部请求和脚本执行必须受到严格限制：
- **WHEN** 渲染进程尝试发起网络请求（Fetch/XHR/WebSocket）
- **THEN** 只有白名单内的域名（如腾讯 API 和本地开发服务器）被允许，其他请求将被浏览器直接拦截。
- **WHEN** 页面尝试执行内联 `<script>`
- **THEN** 该行为将被 CSP 拦截（仅允许加载和执行本地文件系统/同源的 JS 文件）。