# 恢复设置页签与预警入口 Spec

## Why
方案 A 的设置结构在实际使用中降低了预警的就地操作效率，尤其是将预警独立成单独 Tab 后，用户需要更多步骤才能完成单股预警配置，整体不如原先在“自选股票”内集中管理更顺手。需要恢复到方案 A 调整前的设置结构与预警入口体验。

## What Changes
- 将设置界面从 5 个一级 Tab（含“预警通知”）恢复为 7 个一级 Tab：自选股票、显示、高级、股价图、数据看板、会员、其它。
- 恢复“自选股票”页顶部的“全部预警 开启/暂停”全局开关入口。
- 恢复全局暂停状态对自选列表铃铛图标状态的表现（全局暂停时显示为灰色）。
- 保留现有代码文件（如 `AlertsTab.tsx` / `DataTab.tsx` / `PrivacyTab.tsx`）但不再在设置页中引用，以避免产生额外入口与维护负担。

## Impact
- Affected specs: 设置界面、预警入口
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 设置界面 Tab 结构
- **WHEN** 用户打开设置界面
- **THEN** 顶部 Tab 页应为 7 个：自选股票、显示、高级、股价图、数据看板、会员、其它。
- **THEN** 不再出现“预警通知 / 隐私与隐蔽 / 高级与数据”等方案 A 的一级 Tab。

### Requirement: 预警入口体验
- **WHEN** 用户在“自选股票”页面操作预警
- **THEN** 页面顶部存在“全部预警”的全局开关（开启/暂停）。
- **WHEN** 全部预警处于暂停状态
- **THEN** 自选股票列表中已配置预警的铃铛图标应表现为暂停状态（灰色）。

## REMOVED Requirements
无

