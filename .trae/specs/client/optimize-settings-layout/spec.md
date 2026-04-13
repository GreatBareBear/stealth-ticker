# Optimize Settings Layout Spec

## Why
目前在客户端的设置界面中，包含“设置”标题的顶部栏（header）与下方的 Tabs 页签之间的空白区域显得过大，导致视觉布局不够紧凑，空间利用率较低，用户体验不够精致。需要将标签栏上移，优化这两者之间的布局间距。
此外，Tabs 内容区内的设置项行间距偏大，同时 Tabs 与内容区的首个设置项之间的间距偏小，整体密度不一致，不符合企业级设置面板的审美与可读性要求。

## What Changes
- 修改 `client/src/renderer/src/pages/Settings.tsx` 中顶部标题栏的 `padding`，减小垂直方向的间距。
- 移除或调整顶部标题栏与 Tabs 容器之间的 `borderBottom` 或背景色的割裂感，使 Tabs 栏在视觉上更靠近标题。
- 调整 `Tabs` 组件的 `tabBarStyle`，去除多余的外边距（例如顶部的默认留白），实现更加紧凑、现代的设置页布局。
- 通过在设置页作用域内覆盖 antd 表单项默认样式，将 `Form.Item` 的默认行间距从约 24px 调整为约 12px（紧凑但仍可读）。
- 为 Tabs 内容区增加一个稳定的顶部内边距，使“页签栏”与“首个设置项”之间保留恰当呼吸感，避免过近。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/assets/main.css`

## ADDED Requirements
无新增功能，仅对现有界面的 UI 布局进行视觉调优。

## MODIFIED Requirements
### Requirement: 紧凑的设置页顶部布局
The settings page SHALL have a compact top layout, reducing unnecessary vertical spacing between the page title ("设置") and the navigation tabs, ensuring a more cohesive and polished UI.

### Requirement: 紧凑的设置项行间距
The settings page SHALL use a compact spacing density for form rows (Form.Item), reducing excessive vertical gaps while maintaining readability.

### Requirement: 页签与内容间距
The settings page SHALL keep a consistent and visually balanced vertical spacing between the tabs bar and the first settings row within each tab pane.
