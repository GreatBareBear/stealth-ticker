# Electron Security Boundary Enforcement Spec

## Why
目前 Electron 主进程中创建窗口时（包括主窗口、设置窗口、关于窗口），显式禁用了 `webSecurity` 并且禁用了 `sandbox` (`sandbox: false`, `webSecurity: false`)。对于一个主打“安全盯盘”且会请求外部网络数据（腾讯行情 API）的应用来说，禁用同源策略和沙箱极大地放大了跨站脚本攻击 (XSS) 和任意资源加载的风险。

## What Changes
- 移除所有 `BrowserWindow` 实例中的 `webSecurity: false`。
- 将所有 `BrowserWindow` 实例中的 `sandbox: false` 改为默认的开启状态，或彻底移除该配置（Electron 默认开启）。
- 显式声明 `contextIsolation: true` 和 `nodeIntegration: false`（虽然 Electron 较新版本默认如此，但显式声明能防止意外变更，符合安全最佳实践）。
- 确保行情数据请求（`https://qt.gtimg.cn`，`https://smartbox.gtimg.cn`）在开启 `webSecurity` 后仍然能够正常工作（通常主进程请求不受 CORS 限制，但如果是 Renderer 进程发起的 Fetch，可能需要处理跨域。由于应用本身就是桌面端，如果需要，可通过配置 `webRequest` 绕过特定域的 CORS）。

## Impact
- Affected specs: Electron 窗口安全策略。
- Affected code: `client/src/main/index.ts`

## MODIFIED Requirements
### Requirement: 窗口安全沙箱
所有的 `BrowserWindow` 必须在安全的上下文中运行：
- 必须开启沙箱隔离 (`sandbox`)。
- 必须开启 Web 安全策略 (`webSecurity`)。
- 必须开启上下文隔离 (`contextIsolation`)。
- 必须禁用 Node.js 集成 (`nodeIntegration`)。
