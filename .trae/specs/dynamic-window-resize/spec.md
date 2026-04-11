# Dynamic Window Resize Spec

## Why
当前股票行情悬浮窗的尺寸在创建时被固定为宽度 300、高度 100。当用户在设置中添加更多股票，或者修改字体大小和行高时，悬浮窗不会随之动态调整大小，导致股票行情数据展示不完整（被截断）。

## What Changes
- 在渲染进程 `Monitor.tsx` 中，取消外层容器强制使用的 `100vw` 和 `100vh`，改为由内容撑开（`display: inline-flex` 或 `fit-content`）。
- 在渲染进程 `Monitor.tsx` 中，使用 `ResizeObserver` 或 `useEffect` 监听外层容器的实际 DOM 尺寸变化。
- 在主进程 `src/main/index.ts` 中，新增一个 `resize-window` 的 IPC 事件监听器，接收到渲染进程发送的尺寸后，调用 `BrowserWindow.setSize` 动态调整窗口大小。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: 动态调整悬浮窗尺寸
The system SHALL dynamically resize the Monitor floating window to fit its content whenever the number of visible stocks, font size, or line height changes.

#### Scenario: Success case
- **WHEN** user adds a new stock to the monitor
- **THEN** the floating window height expands automatically to reveal the newly added stock without clipping.