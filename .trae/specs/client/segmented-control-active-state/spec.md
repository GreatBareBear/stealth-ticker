# Segmented Control Active State Spec

## Why
在设置界面中，“开启/关闭”等控件大量使用了 Ant Design 的 `Segmented` 组件。但由于当前主题和默认样式的限制，`Segmented` 选中的那一项（Active 项）与未选中项的背景颜色/阴影对比度过低，导致用户在视觉上很难分辨哪个选项处于选中状态，降低了交互体验。

## What Changes
- 通过在 `client/src/renderer/src/pages/Settings.tsx` 中配置 `ConfigProvider` 的全局主题，重写 `Segmented` 组件的样式 Token。
- 具体包括：增强选中项背景色的对比度（例如使用主色带透明度的背景、或者纯色+较深阴影），同时加深选中项文字的颜色，以确保活动状态清晰可辨。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`

## ADDED Requirements
无新增系统功能，仅优化控件视觉效果。

## MODIFIED Requirements
### Requirement: Segmented 控件视觉反馈
The Segmented controls in the settings UI MUST provide high-contrast visual feedback for the selected (active) state, clearly distinguishing it from unselected options.