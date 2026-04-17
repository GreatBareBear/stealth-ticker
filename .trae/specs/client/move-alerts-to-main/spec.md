# Move Alert Trigger to Main Process Spec

## Why
目前行情数据轮询后，所有关于“是否达到告警阈值”的计算、节流控制、以及实际触发 `shell.beep()` 或 `Notification` 的逻辑，都在渲染进程（`Monitor.tsx`）中完成。
将这种后台任务放在渲染进程存在以下问题：
1. **可靠性低**：如果窗口被隐藏（特别是使用了老板键或者系统级最小化），很多操作系统会对渲染进程进行降频休眠（App Nap / Background Throttling），导致告警漏报或严重延迟。
2. **通知权限不稳**：渲染进程使用 Web API `new Notification()` 会受到浏览器严格的策略限制，在某些情况下无法弹窗。
3. **架构不合理**：轮询每几秒就要通过 IPC 大量读取 `store.get('alerts')`、`store.get('alertsGlobalPaused')` 等各种设置，带来无谓的序列化开销和性能浪费。

## What Changes
- **主进程接管轮询与告警逻辑**：在 `main/index.ts`（或一个新建的服务模块）中，创建一个主进程定时器负责向腾讯行情 API 发起请求。
- **主进程管理配置缓存**：主进程可以在启动时读取所有的配置（`stocks`, `alerts`, `settings`），并在 `store:set` 被调用时实时更新其内存中的副本，不再需要每次轮询都去读取持久化文件。
- **触发系统原生通知**：在主进程使用 Electron 原生的 `Notification` 模块（来自 `electron` 包）来发送通知，这比 Web API 更可靠。
- **渲染进程退化为纯 UI**：`Monitor.tsx` 仅负责从主进程接收最新的行情数据用于展示，以及响应用户的 UI 交互。

## Impact
- Affected specs: 行情轮询、告警判定逻辑、IPC 通信、渲染层性能。
- Affected code: `client/src/main/index.ts`, `client/src/renderer/src/pages/Monitor.tsx`, `client/src/preload/index.ts`, `client/src/renderer/src/env.d.ts`

## MODIFIED Requirements
### Requirement: 稳定可靠的后台告警
系统 SHALL 保证在应用处于任何隐藏/后台状态时，告警功能都能稳定、按时触发：
- **WHEN** 应用正在运行，即使窗口被深度隐藏
- **THEN** 行情轮询必须在主进程中不受限制地进行。
- **AND** 一旦满足用户设定的告警条件，必须使用系统级原生 API 触发弹窗、声音或托盘闪烁。