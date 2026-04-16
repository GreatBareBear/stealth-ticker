# 优化免打扰入口和状态显示 Spec

## Why
当前免打扰（DND）设置的入口为“文本按钮 + 状态标签”的形式。从设计审美和操作习惯上看，稍显累赘。用户期望以更极简、美观的方式展示免打扰入口，因此将其合并为一个带有图标的“可点击状态胶囊（Tag）”，既能直观显示当前状态，又能作为点击唤出设置面板的入口，节省空间并符合现代 UI 的直觉。

## What Changes
- 移除原有的“免打扰”文本按钮（`Button type="link"`）。
- 升级右下角的免打扰状态标签（`Tag`），赋予其交互属性（鼠标悬停变手型，可点击触发免打扰面板）。
- 在标签内引入状态图标（如 `MinusCircleOutlined` 或 `ClockCircleOutlined`）增强视觉感知。
- 优化免打扰状态文字，使其更贴合“胶囊内文案”的简练风格（如“免打扰: 开启”、“免打扰: 剩余 30分钟”）。

## Impact
- Affected specs: 免打扰状态和设置入口体验。
- Affected code: `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
### Requirement: 状态胶囊交互
系统应该将免打扰状态指示器转变为可点击的交互式控件。

#### Scenario: 用户点击状态胶囊
- **WHEN** 用户点击底部显示免打扰状态的胶囊（Tag）
- **THEN** 应该直接弹出免打扰设置面板（Modal）

## MODIFIED Requirements
### Requirement: 免打扰入口 UI
将原本分离的“文字入口”和“状态展示”合二为一，统一为带图标的紧凑胶囊标签。
- 未开启时显示为灰色胶囊及关闭文字
- 计划开启（但当前不在时间段内）时显示为蓝色胶囊
- 正在生效（时间段或临时暂停）时显示为高亮（橙色或蓝色）及图标提示
