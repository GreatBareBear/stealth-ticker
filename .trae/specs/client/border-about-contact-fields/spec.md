# About 联系方式边框化 Spec

## Why
“关于”页面底部的 Home / E-mail / QQ 群目前以可复制文本形式展示，但视觉上不像“可交互的信息栏”，用户不易第一眼判断可复制。将其改为类似输入框的边框样式能增强可读性与可操作性。

## What Changes
- 在“关于”页面底部的三条可复制信息（Home / E-mail / QQ 群）外层增加输入框风格的边框与内边距（含圆角、背景与分隔），整体更像只读文本输入框。
- 保持现有的复制能力与文案不变（仍为 `Home:`、`E-mail:`、`QQ 群:`）。
- 不引入滚动条、不改变“检查更新”按钮布局。

## Impact
- Affected specs: 关于窗口 UI
- Affected code: `client/src/renderer/src/pages/About.tsx`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 关于页面联系方式显示样式
- **WHEN** 用户打开“关于”窗口并查看底部联系方式区域
- **THEN** Home / E-mail / QQ 群三项的值区域应呈现为“输入框风格”的边框容器（边框、圆角、内边距、与背景），且不遮挡复制图标与文案。
- **WHEN** 用户使用复制功能
- **THEN** 复制行为与现有一致（可复制到剪贴板），且样式变化不应影响复制可用性。

## REMOVED Requirements
无

