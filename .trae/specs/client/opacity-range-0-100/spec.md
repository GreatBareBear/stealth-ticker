# 悬浮窗透明度范围 0–100 Spec

## Why
当前“悬浮窗透明度”滑块最小值为 10，无法将透明度调整到完全透明（0）。用户希望透明度支持 0–100 的完整范围，以便在特定场景下实现更高的隐蔽性。

## What Changes
- 将 `client/src/renderer/src/components/settings/DisplayTab.tsx` 中“悬浮窗透明度”滑块的最小值从 10 调整为 0，最大值保持 100。
- 更新滑块刻度显示，使 0 与 100 的语义更清晰（例如 0 = 全透明，100 = 不透明）。

## Impact
- Affected code:
  - `client/src/renderer/src/components/settings/DisplayTab.tsx`
  - `client/src/renderer/src/pages/Monitor.tsx`（已有逻辑支持 0–100，作为联动验证点）

## ADDED Requirements
无新增系统功能，仅扩展既有设置项的可选范围。

## MODIFIED Requirements
### Requirement: 透明度范围
The opacity setting SHALL accept a value range of 0 to 100 inclusive.

#### Scenario: Success case
- **WHEN** user sets opacity to 0
- **THEN** the floating monitor window becomes fully transparent.
- **WHEN** user sets opacity to 100
- **THEN** the floating monitor window becomes fully opaque.
