# 一键清理本地数据 Spec

## Why
“安全盯盘”强调隐私与可控性。在商业化场景中，用户需要一个明确的“一键清理数据”入口，用于快速清除本地敏感信息（自选列表、预警文案与免打扰配置），降低泄露风险，并便于在不同环境下快速恢复到“干净状态”。

## What Changes
- 在“其它”设置页增加“数据与隐私”区域，提供“一键清理数据”按钮并带二次确认。
- 清理范围仅包含与盯盘数据/预警相关的本地持久化 keys（不清除外观设置与快捷键设置，避免误伤）。

## Impact
- Affected specs: 设置界面（其它）、本地隐私与安全
- Affected code:
  - `client/src/renderer/src/components/settings/OtherTab.tsx`

## ADDED Requirements
### Requirement: 一键清理本地数据
系统 SHALL 在设置-其它页提供“一键清理数据”按钮，用于清理本地敏感数据。

#### Scenario: 成功清理
- **WHEN** 用户点击“一键清理数据”并确认
- **THEN** 系统应删除以下 store keys（不存在也应安全忽略）：
  - `stocks`
  - `alerts`
  - `alertsGlobalPaused`
  - `alertsTempPausedUntil`
  - `alertsDndEnabled`
  - `alertsDndStart`
  - `alertsDndEnd`
  - `alertsDndAllowedMethods`
- **AND** UI 提示清理成功。

## MODIFIED Requirements
无

## REMOVED Requirements
无

