# Tasks

- [x] Task 1: 移除 `WebkitAppRegion` 并替换为自定义 Pointer 事件
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，删除 `WebkitAppRegion: 'drag'` 和 `WebkitAppRegion: 'no-drag'` 属性。
  - [x] SubTask 1.2: 添加 `isDragging` 状态（`useState(false)`）和 `dragPosRef` 引用（`useRef({ x: 0, y: 0 })`）。
  - [x] SubTask 1.3: 实现 `handlePointerDown`，当 `e.button === 0` 时，调用 `e.currentTarget.setPointerCapture(e.pointerId)`，设置 `isDragging(true)`，记录初始坐标 `e.screenX` 和 `e.screenY`。
  - [x] SubTask 1.4: 实现 `handlePointerMove`，如果在拖拽中，计算 `deltaX` 和 `deltaY`，更新 `dragPosRef`，并调用 `window.electron.ipcRenderer.send('drag-window', { deltaX, deltaY })`。
  - [x] SubTask 1.5: 实现 `handlePointerUp`，当 `e.button === 0` 时，调用 `e.currentTarget.releasePointerCapture(e.pointerId)` 并停止拖拽。
  - [x] SubTask 1.6: 将上述三个处理函数绑定到最外层 `div` 的 `onPointerDown`、`onPointerMove` 和 `onPointerUp` 上。

- [x] Task 2: 主进程接收拖拽增量并更新窗口位置
  - [x] SubTask 2.1: 在 `client/src/main/index.ts` 中，增加 `ipcMain.on('drag-window', (event, { deltaX, deltaY }) => { ... })`。
  - [x] SubTask 2.2: 在回调中，获取对应的 `BrowserWindow`，读取其当前位置 `const [x, y] = win.getPosition()`。
  - [x] SubTask 2.3: 调用 `win.setPosition(x + deltaX, y + deltaY)` 实时更新位置。

# Task Dependencies
- [Task 1] 与 [Task 2] 可以并行处理。
