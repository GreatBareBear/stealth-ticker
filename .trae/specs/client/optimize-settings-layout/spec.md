# Optimize Settings Layout Spec

## Why
目前在客户端的设置界面中，包含“设置”标题的顶部栏（header）与下方的 Tabs 页签之间的空白区域显得过大，导致视觉布局不够紧凑，空间利用率较低，用户体验不够精致。需要将标签栏上移，优化这两者之间的布局间距。

## What Changes
- 修改 `client/src/renderer/src/pages/Settings.tsx` 中顶部标题栏的 `padding`，减小垂直方向的间距。
- 移除或调整顶部标题栏与 Tabs 容器之间的 `borderBottom` 或背景色的割裂感，使 Tabs 栏在视觉上更靠近标题。
- 调整 `Tabs` 组件的 `tabBarStyle`，去除多余的外边距（例如顶部的默认留白），实现更加紧凑、现代的设置页布局。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`

## ADDED Requirements
无新增功能，仅对现有界面的 UI 布局进行视觉调优。

## MODIFIED Requirements
### Requirement: 紧凑的设置页顶部布局
The settings page SHALL have a compact top layout, reducing unnecessary vertical spacing between the page title ("设置") and the navigation tabs, ensuring a more cohesive and polished UI.
