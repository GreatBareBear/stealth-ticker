# Fix Settings Title and Icon Spec

## Why
在之前的任务中，我们已经为 `settingsWindow` 设置了 `title: '设置'` 并修改了托盘图标，但用户反馈设置界面的标题栏仍然显示不正确的名称和图标。
这是因为 Electron 渲染 HTML 文件时，如果 `client/src/renderer/index.html` 中存在 `<title>Electron</title>`，它会在页面加载完成时覆盖我们在主进程中设置的窗口名称。同时，在 Windows 和某些 Linux 系统下，`BrowserWindow` 还需要显式地传递 `icon` 参数才能让窗口标题栏正确显示自定义图标（不仅是任务栏）。

## What Changes
- 修改 `client/src/renderer/index.html`，将原有的 `<title>Electron</title>` 修改为 `<title>设置</title>`，防止页面加载后标题被覆盖。
- 修改 `client/src/main/index.ts` 中的 `settingsWindow` 创建配置，补充 `icon` 属性（原先只在 `process.platform === 'linux'` 时生效，现改为全局传递图标参数）。

## Impact
- Affected code:
  - `client/src/renderer/index.html`
  - `client/src/main/index.ts`

## ADDED Requirements
无新增功能，仅做 Bug 修复。

## MODIFIED Requirements
### Requirement: 标题栏名称和图标修复
The settings window MUST correctly display "设置" as its title and use the custom ghost icon in the window's title bar across all supported platforms.