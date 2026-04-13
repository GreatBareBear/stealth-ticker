# UI and Icon Enhancements Spec

## Why
1. 设置窗口当前的标题为默认的 `Electron`，与应用名称“设置”不相符，降低了产品的完成度。
2. 缺乏一个符合“隐蔽盯盘工具”主题的个性化桌面图标（如小精灵/幽灵），目前的默认图标没有辨识度。
3. 设置界面底部的“确定”和“取消”按钮为原生 HTML `button` 标签，点击时没有交互状态反馈（如 hover、active 时的颜色变化），导致用户体验比较生硬。

## What Changes
- 在 `client/src/main/index.ts` 中初始化 `settingsWindow` 时，将 `title` 属性设为 `'设置'`。
- 使用 `node:fs` 或通过外部能力生成/替换一个具有“幽灵/小精灵”元素的符合“隐蔽”主题的 PNG 或 ICO 图标至 `client/resources/icon.png` 路径。
- 在 `client/src/renderer/src/pages/Settings.tsx` 中，引入 Ant Design 的 `Button` 组件替换原生的 `button` 标签，为“确定”和“取消”按钮提供开箱即用的 hover、click 点击反馈效果，并可通过 `onClick` 挂载对应的保存或关闭窗口事件。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/resources/icon.png` (Asset replacement)

## ADDED Requirements
### Requirement: 应用程序图标
The system SHALL provide a custom icon featuring a stealth-themed "ghost/sprite" visual design for the system tray and window title bars.

### Requirement: 按钮交互反馈
The settings window action buttons (Confirm/Cancel) SHALL exhibit standard UI feedback (hover and active states) upon user interaction.

## MODIFIED Requirements
### Requirement: 设置窗口标题
The window title of the settings menu SHALL be "设置" instead of the default "Electron".
