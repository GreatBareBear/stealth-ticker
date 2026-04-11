# Tasks

- [x] Task 1: 主进程增加 IPC 监听以调整窗口大小
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 中，`app.whenReady().then(...)` 块内，增加 `ipcMain.on('resize-window', (event, { width, height }) => { ... })`。
  - [x] SubTask 1.2: 根据 `event.sender` 获取到对应的 `BrowserWindow` 实例，调用 `window.setSize(Math.ceil(width), Math.ceil(height))`。

- [x] Task 2: 渲染进程动态计算并发送尺寸
  - [x] SubTask 2.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，为最外层容器（或内容容器）添加 `ref`。
  - [x] SubTask 2.2: 移除最外层容器 `style` 中的 `width: '100vw'` 和 `height: '100vh'`，可以改为 `display: 'inline-flex'`、`minWidth: '150px'` 确保由内容撑开。
  - [x] SubTask 2.3: 使用 `useEffect` 或 `useLayoutEffect`，结合 `ResizeObserver` 监听该 `ref` 容器的尺寸变化。
  - [x] SubTask 2.4: 当尺寸变化时，通过 `window.electron.ipcRenderer.send('resize-window', { width, height })` 将实际宽高发送给主进程。

# Task Dependencies
- [Task 2] depends on [Task 1]
