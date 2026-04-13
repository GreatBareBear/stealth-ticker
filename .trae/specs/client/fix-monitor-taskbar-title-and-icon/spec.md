# Fix Monitor Taskbar Title and Icon Spec

## Why
在关闭“幽灵模式”时，股票行情悬浮窗会显示在操作系统的任务栏上。然而，当前在任务栏上显示的名称仍然是渲染层 `<title>` 的默认值（比如刚改过的“设置”或者是默认的“Electron”），而不是代表应用的正确名称 `stealth-ticker`。此外，`mainWindow` 目前也没有在所有平台上（如 Windows 下）正确应用自定义图标，这会导致在任务栏中显示的图标是默认的应用程序图标。

## What Changes
- 在 `client/src/main/index.ts` 中创建 `mainWindow` 时，添加 `title: 'stealth-ticker'` 属性。
- 修改 `client/src/main/index.ts` 中创建 `mainWindow` 时的图标配置，将 `...(process.platform === 'linux' ? { icon } : {})` 替换为全局应用的 `icon: icon`（或简写 `icon`），确保所有平台的任务栏都能正确读取和显示小幽灵图案。

## Impact
- Affected code:
  - `client/src/main/index.ts`

## ADDED Requirements
无新增功能，仅作 Bug 修复。

## MODIFIED Requirements
### Requirement: 悬浮窗任务栏显示信息
When the ghost mode is disabled and the main stock monitor window appears on the taskbar, it MUST display the correct icon (ghost theme) and the title MUST be exactly "stealth-ticker" on hover or in the taskbar label.
