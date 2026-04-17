# Minimalist DND Button Spec

## Why
目前的 `Tag`（状态胶囊）设计带有 `免打扰: 关闭 ＞` 的文字和箭头，文字较为冗长（“关闭”二字在未开启时显得多余），且 Tag 控件在 Ant Design 语境中偏向“静态数据展示”，即便加入了悬浮和箭头，仍不如标准按钮（Button）直观，导致视觉上依然不够简洁自然。

## What Changes
- 废弃现有的 `Tag` 标签方案，改用高度标准的 `<Button>` 组件。
- **状态驱动的按钮样式与文案**：
  - **未开启（默认状态）**：使用 `type="text"` 的幽灵按钮，文案极简为 `[时钟图标] 免打扰`。不再显示“关闭”二字，视觉上与普通操作入口无异。
  - **时间段生效时**：切换为 `type="primary"` 的蓝色按钮，文案变为 `[时钟图标] 免打扰生效中`，起到醒目的状态指示作用。
  - **临时暂停时**：切换为 `type="primary" danger` 的橙红/红色按钮，文案变为 `[时钟图标] 剩余 XX分钟`，提供最强烈的倒计时状态感知。
- 移除多余的 `RightOutlined`（向右箭头）和 `Tooltip`，因为 Button 自带的 hover 背景色变化已经能完美提供可点击的交互暗示（Affordance）。

## Impact
- Affected specs: 免打扰设置入口 UI。
- Affected code: `client/src/renderer/src/components/settings/StocksTab.tsx`

## MODIFIED Requirements
### Requirement: 免打扰入口与状态展示
免打扰入口必须是一个标准的按钮，兼具“状态展示”和“点击设置”双重属性。
- **关闭时**必须极致低调，不占用多余注意力。
- **生效时**必须高亮显示，确保用户清楚当前处于免打扰状态及其剩余时间。
