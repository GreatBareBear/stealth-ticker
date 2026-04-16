# Enhance DND Tag Interactivity Spec

## Why
当免打扰处于关闭状态时，默认的灰色胶囊（Tag）视觉上过于扁平，缺乏可点击的交互暗示（Affordance），容易被用户误认为是纯静态的文本提示，从而找不到设置入口。

## What Changes
- 在免打扰关闭状态下，将左侧图标从 `MinusCircleOutlined` 更改为 `SettingOutlined`，强化“设置入口”的语义。
- 在胶囊文本的右侧统一追加一个 `RightOutlined`（向右小箭头）图标，这是业界通用的“点击进入/展开”的视觉暗示。
- 为该胶囊增加 `Tooltip` 悬浮提示（“点击设置免打扰”），提供更明确的交互反馈。

## Impact
- Affected specs: 免打扰设置入口 UI。
- Affected code: `client/src/renderer/src/components/settings/StocksTab.tsx`

## MODIFIED Requirements
### Requirement: 免打扰入口 UI 交互性增强
免打扰状态胶囊必须具备明确的可点击视觉特征：
- 必须包含指示可点击的箭头图标。
- 关闭状态下必须使用设置类图标以表明其入口属性。
- 必须提供悬浮提示以明确告知用户其功能。
