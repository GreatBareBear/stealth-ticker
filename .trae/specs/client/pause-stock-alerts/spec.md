# Stock Alerts Pause/Resume Spec

## Why
当前预警功能已支持单股预警配置与触发，但在实际使用中，用户可能会在某个时间段不方便接收提醒（会议、分享屏幕、午休等）。如果只能“清除预警再重新设置”，会增加重复操作成本。提供“暂停/恢复”能力可以更符合真实工作流，并进一步提升预警功能的可用性与体验。

## What Changes
- 扩展 `alerts` 存储结构：在每只股票的预警配置中增加 `enabled` 字段，用于表示该股票预警当前是否启用（默认启用）。
- 增加全局预警开关：新增一个布尔存储键（如 `alertsGlobalPaused`），用于一键暂停/恢复所有股票预警触发。
- 设置界面增强：
  - 在“自选股票”Tab 顶部增加“全部暂停/恢复预警”开关，交互参考现有 Switch 开关样式。
  - 在股票列表操作列中增加“暂停/恢复”入口（与预警铃铛、删除并列），用于快速切换单只股票的预警启用状态。
  - 在预警设置弹窗中增加“启用预警”开关（或“暂停该预警”），避免必须退出弹窗才能停用。
- 监控触发逻辑增强：
  - 当全局暂停开启时，不再触发任何预警。
  - 当单只股票预警 `enabled=false` 时，不触发该股票预警。
  - 当从暂停状态恢复时，允许在下一次轮询中按规则正常触发（避免被 `triggeredKeys` 永久抑制）。

## Impact
- Affected specs: 自选股票预警、设置 UI、行情轮询触发逻辑
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx`
  - `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: 单股预警暂停/恢复
The system SHALL allow users to pause and resume alerts per stock without deleting its configuration.

#### Scenario: Pause per stock
- **WHEN** user disables alert for a stock in the settings UI
- **THEN** alert evaluations for that stock SHALL be skipped
- **AND** the alert config SHALL remain stored

### Requirement: 全局预警暂停/恢复
The system SHALL allow users to pause and resume all alerts globally.

#### Scenario: Pause all
- **WHEN** user enables global pause
- **THEN** no alerts SHALL trigger regardless of individual configs

## MODIFIED Requirements
### Requirement: 预警触发规则（含暂停）
The Monitor alert evaluation MUST respect global pause and per-stock enabled status, and MUST not require deleting configs to temporarily disable alerts.

