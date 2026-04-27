# Add Loading Watchdog and Diagnostics Spec

## Why
用户反馈监控面板仍存在 “Loading...” 且已多次尝试修复未能在真实环境中闭环。当前虽然已增加 `stock-poll-status` 与 `Not Found` 标识，但若出现“主进程未启动轮询 / IPC 未连通 / 轮询事件未到达渲染层 / 轮询卡死但无错误抛出”等情况，UI 仍可能表现为持续 Loading，缺少可复制、可定位的诊断信息。

## What Changes
- **主进程：增强轮询可观测性**
  - 在 `stock-poll-status` 中补充关键字段：HTTP 状态码、响应字节数、解析到的 symbol 数量、最近一次事件时间。
  - 缓存最近一次 `stock-poll-status`，并提供一个 IPC 查询接口（例如 `get-stock-poll-status`）用于渲染层主动拉取，避免仅依赖推送。
- **渲染进程：Loading 看门狗与诊断导出**
  - 在 Monitor 页面增加 “Polling Status” 轻量状态条：显示最近一次轮询事件（start/success/error）的时间与摘要；若超过阈值未收到任何事件，显示 “Polling not running / IPC disconnected”。
  - 增加一个“复制诊断信息”入口（按钮或上下文菜单项），将 stocks 配置、refreshRate、最近一次 status 及关键字段复制到剪贴板，便于用户直接粘贴反馈。

## Impact
- Affected specs: 行情展示可观测性与故障定位能力。
- Affected code:
  - `src/main/alertService.ts`
  - `src/main/index.ts`（若 IPC handler 放在此处）
  - `src/preload/index.ts`
  - `src/preload/index.d.ts`
  - `src/renderer/src/env.d.ts`
  - `src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: Poll Status Watchdog
The system SHALL detect when no polling status events are received within a configured threshold and show an explicit “Polling not running” state instead of indefinite “Loading...”.

#### Scenario: No polling events
- **WHEN** the renderer does not receive any `stock-poll-status` event for a duration > `max(2 * refreshRate, 10s)`
- **THEN** the UI shows a watchdog warning indicating polling is not running or IPC is disconnected.

### Requirement: Diagnostic Export
The system SHALL allow users to export/copy diagnostics for the stock polling subsystem, including latest status payload and current stock configuration.

#### Scenario: Copy diagnostics
- **WHEN** user triggers “Copy diagnostics”
- **THEN** the clipboard contains a text payload with stocks list, refreshRate, and latest poll status fields.

