# Fix Right Click on Drag Region Spec

## Why
在之前的修改中，为了实现“鼠标左键拖动行情界面”，我们将整个股票行情悬浮窗配置为了 `-webkit-app-region: drag`（Electron 原生拖拽区域）。
但这会引发一个严重的副作用：在 Windows/macOS 系统层级，原生的拖拽区域会拦截包括鼠标右键在内的绝大部分 DOM 鼠标事件。这导致用户在悬浮窗上右键点击时，不会触发应用自定义的右键菜单，而是被操作系统截获（在 Windows 下会显示操作系统的窗口管理菜单，或者完全无响应）。因此，我们需要一种方案，既能平滑拖拽，又能保留正常的右键上下文菜单。

## What Changes
- 在 `client/src/renderer/src/pages/Monitor.tsx` 中，移除根元素的 `WebkitAppRegion: 'drag'` 属性。
- 引入自定义的指针事件（Pointer Events）拖拽逻辑：监听 `onPointerDown`、`onPointerMove` 和 `onPointerUp`。
  - 左键按下时（`e.button === 0`），捕获指针（`setPointerCapture`）并记录初始屏幕坐标。
  - 拖拽移动时，计算 `deltaX` 和 `deltaY`，并通过 IPC `drag-window` 发送给主进程。
  - 左键松开时，释放指针并停止拖拽。
- 在 `client/src/main/index.ts` 中，增加 `ipcMain.on('drag-window', ...)` 事件，通过接收到的增量 `deltaX` 和 `deltaY`，调用 `win.setPosition` 动态更新窗口位置。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: 解决原生拖拽拦截右键菜单的问题
The system SHALL allow both smooth left-click window dragging and standard right-click context menus by replacing the native `-webkit-app-region: drag` with a custom IPC-based pointer dragging implementation.

#### Scenario: Success case
- **WHEN** user left-clicks and drags the monitor window
- **THEN** the window moves smoothly.
- **WHEN** user right-clicks on the monitor window
- **THEN** the application's custom context menu (Settings, About, Exit) is displayed, adhering to the "enableContextMenu" toggle.