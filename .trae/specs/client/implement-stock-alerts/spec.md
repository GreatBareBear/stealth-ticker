# Implement Stock Alerts Spec

## Why
当前自选股票列表仅支持基础的展示、添加、删除和排序功能。由于股票市场瞬息万变，用户无法时刻盯盘，可能会错过重要的交易机会。通过为单只股票设置定制化的预警/提醒功能，可以在关键价格或涨跌幅发生时第一时间通知用户，大幅提升产品的实用性和监控价值。

## What Changes
- **新增预警配置入口**：在 `client/src/renderer/src/components/settings/StocksTab.tsx` 的操作列，增加一个“预警”（`BellOutlined`）图标，与“删除”图标并列。
- **新增预警设置弹窗**：点击预警图标弹出一个 `Modal` 表单，用于配置对应股票的预警规则并保存到 Store (`alerts`)。包含以下配置：
  - **预警类型**：价格预警（精度0.01）或 涨跌幅预警（范围 ±0.1% ~ ±20%，步长0.1%）。
  - **触发条件**：高于 / 低于。
  - **提醒文案**：最长 50 汉字，支持变量插值（`${股票名称}`, `${价格}`, `${阈值}`），变量缺失时提供默认降级文本。
  - **提醒方式（三选一）**：屏幕弹窗（3s 后自动消失）、系统提示音、托盘图标闪烁（持续 10s）。
- **增加预警检查逻辑**：在 `client/src/renderer/src/pages/Monitor.tsx` 每次拉取到行情数据后，比对预警条件。若满足条件且未在冷却期内，则触发预警动作。
- **扩展主进程 IPC 能力**：在 `client/src/main/index.ts` 增加预警触发的响应能力，如执行系统提示音 (`shell.beep()`)、控制托盘图标闪烁动画等。

## Impact
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx` (UI for configuring alerts)
  - `client/src/renderer/src/pages/Monitor.tsx` (Polling & trigger evaluation)
  - `client/src/main/index.ts` (IPC handlers for sound and tray blink)

## ADDED Requirements
### Requirement: 股票预警与通知
The system SHALL evaluate stock data against user-defined alert rules on every data fetch. When a rule is met, it SHALL notify the user via the selected method (Popup, Sound, or Tray Blink) using a custom interpolated message.

#### Scenario: Success case
- **WHEN** the user sets a price alert "above 10.00" for a stock with a custom message.
- **AND** the fetched stock price becomes 10.05.
- **THEN** an alert is triggered immediately using the chosen notification method (e.g., a tray icon blinking for 10 seconds).
- **AND** the alert uses the interpolated message like "平安银行当前价格10.05已突破10.00".