# Refine Settings Tabs Spec

## Why
目前设置界面中的“关注的股票”命名不够贴切，改为“自选股票”更符合股票软件的行业通用术语。
同时，“高级”选项卡（`AdvancedTab`）与“显示”选项卡（`DisplayTab`）中存在大量重叠的设置项（如文字大小、行距、背景颜色、透明度、刷新间隔等）。并且行情界面 `Monitor.tsx` 实际绑定的是 `DisplayTab` 中的键值（如 `bgColor`、`refreshRate`、`opacity(10-100)`），因此需要清理冗余，将外观与显示相关的设置统一收口到 `DisplayTab`，让配置逻辑更清晰。

## What Changes
- 将 `Settings.tsx` 中的“关注的股票”标签重命名为“自选股票”。
- 移除 `AdvancedTab.tsx` 中的“外观与显示”整个模块（包含 `fontSize`、`lineHeight`、`backgroundColor`、`opacity`）。
- 移除 `AdvancedTab.tsx` 中的“行为与控制”模块里的“刷新间隔”（`refreshInterval`）设置项，因为 `DisplayTab.tsx` 中已经有了 `refreshRate`。
- 将 `AdvancedTab.tsx` 中的一键重置逻辑更新，剔除被移除的字段。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`

## ADDED Requirements
无新增功能，仅做清理和统一。

## MODIFIED Requirements
### Requirement: 统一外观与显示设置
The system SHALL centralize all display-related settings (font size, line height, background color, opacity, refresh rate) into the Display tab, removing duplicates from the Advanced tab.

## REMOVED Requirements
### Requirement: 高级设置中的重复项
**Reason**: 与 Display tab 重叠，且 `Monitor.tsx` 并不使用 `AdvancedTab` 里的这些重复键名（如 `backgroundColor`, `refreshInterval`）。
**Migration**: 直接从 `AdvancedTab` 删除相关 UI 及 `initialValues` 和重置逻辑。用户需统一在“显示”Tab 进行调节。
