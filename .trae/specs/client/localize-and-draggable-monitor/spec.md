# Localize and Draggable Monitor Spec

## Why
1. 客户端中系统托盘和右键菜单目前使用的是英文（Settings, About, Exit），与整体中文语境不符。
2. 用户期望股票行情悬浮窗的大小能够完全根据内容自适应，并且防止用户通过拖拽边缘去手动改变窗口尺寸（避免导致布局错乱或留白）。
3. 用户希望能够通过直接使用鼠标左键点击悬浮窗的任何位置来拖动界面，以方便调整悬浮窗在屏幕上的显示位置。

## What Changes
- 将 `client/src/main/index.ts` 中的托盘菜单和右键菜单选项名称从英文更改为中文（设置、关于、退出）。
- 在 `client/src/main/index.ts` 创建 `mainWindow`（行情悬浮窗）时，添加 `resizable: false` 属性，禁止手动拖拽改变窗口大小。由于先前已实现了 `ResizeObserver` 动态发送 IPC `resize-window` 调整大小，所以宽度和高度仍然会跟随内容自动调整。
- 在 `client/src/renderer/src/pages/Monitor.tsx` 中，移除内容包裹层（内层 `div`）上的 `WebkitAppRegion: 'no-drag'` 和 `cursor: 'pointer'` 属性，使得整个悬浮窗区域（包括文字内容区域）都继承外层的 `WebkitAppRegion: 'drag'`，从而支持鼠标左键拖动。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
无全新系统级功能，均为体验优化和本地化调整。

## MODIFIED Requirements
### Requirement: 菜单本地化
The system SHALL display all system tray and context menu items in Chinese.

### Requirement: 悬浮窗自适应与锁定
The floating Monitor window SHALL automatically resize its width and height to fit its content, while strictly prohibiting manual resizing by the user.

### Requirement: 悬浮窗可拖拽
The entire floating Monitor window SHALL be draggable via a left mouse click, regardless of whether the user clicks on the background or the text.
