# Reorder Settings Tabs Spec

## Why
当前设置界面的 Tab 页面排列顺序（自选股票、会员、显示、高级、股价图、其他、数据看板）在逻辑上不够连贯，会员和数据看板的位置有些突兀。用户期望将顺序调整为更符合功能相关性和使用频率的排列：自选股票、显示、高级、股价图、数据看板、会员、其它。这样可以提供更好的用户体验。

## What Changes
- 修改 `client/src/renderer/src/pages/Settings.tsx` 中的 `items` 数组的顺序。
- 将原本的“其他”重命名为“其它”，以符合用户的命名习惯。
- 调整后的顺序及组件对应关系为：
  1. 自选股票 (`<StocksTab />`)
  2. 显示 (`<DisplayTab />`)
  3. 高级 (`<AdvancedTab />`)
  4. 股价图 (`<ChartTab />`)
  5. 数据看板 (`<DashboardTab />`)
  6. 会员 (`<MembershipTab />`)
  7. 其它 (`<OtherTab />`)

## Impact
- Affected specs: 设置界面 (Settings)
- Affected code: `client/src/renderer/src/pages/Settings.tsx`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 设置界面 Tab 顺序和命名
- **WHEN** 用户打开设置界面时
- **THEN** Tab 页应严格按照以下顺序排列：自选股票、显示、高级、股价图、数据看板、会员、其它。
- **THEN** 原来的“其他”标签名更新为“其它”。

## REMOVED Requirements
无
