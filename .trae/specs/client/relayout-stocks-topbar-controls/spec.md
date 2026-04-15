# 自选股票顶部控件重排 Spec

## Why
当前“自选股票”页顶部同时承载了“添加股票（搜索+添加）”与“全部预警开关 + 免打扰入口 + 状态文案”，在窄窗口下会显得拥挤，影响主要任务（添加/管理自选）的可读性与操作效率。将预警相关控制移动到列表底部，能让顶部聚焦“添加”，布局更清爽。

## What Changes
- 调整 `client/src/renderer/src/components/settings/StocksTab.tsx` 中顶部工具栏布局：
  - 顶部仅保留“搜索股票 + 添加”。
  - 将“全部预警”开关与“免打扰”入口（含状态文案）移动到表格下方作为底部控制区。
- 底部控制区不改变现有功能与语义，仅改变布局位置与排版。

## Impact
- Affected specs: 自选股票页（预警全局控制、免打扰入口）
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 自选股票页顶部布局简化
- **WHEN** 用户打开“自选股票”页
- **THEN** 顶部区域仅展示“搜索/添加股票”的控件，不再与预警控制混排。

### Requirement: 预警控制区下移
- **WHEN** 用户查看自选列表底部
- **THEN** 存在“全部预警”开关与“免打扰”入口（含状态文案），功能与当前一致。
- **THEN** 该控制区应在不影响表格滚动体验的前提下始终可见（置于表格组件下方即可）。

## REMOVED Requirements
无

