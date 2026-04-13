# Tasks

- [x] Task 1: 英文菜单项本地化为中文
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 中，找到 `createTray()` 的 `contextMenu` 定义，将 `Settings`, `About`, `Exit` 分别替换为 `设置`, `关于`, `退出`。
  - [x] SubTask 1.2: 找到 `ipcMain.on('show-context-menu', ...)` 的 `template` 定义，做同样的替换：`设置`, `关于`, `退出`。

- [x] Task 2: 悬浮界面禁止手动调整窗口大小
  - [x] SubTask 2.1: 在 `client/src/main/index.ts` 中，找到 `createWindow()` 里初始化 `mainWindow = new BrowserWindow(...)` 的配置参数。
  - [x] SubTask 2.2: 在该配置对象中添加 `resizable: false` 属性。由于该窗口本身已经无边框（`frame: false`），这会完全禁止通过边缘缩放。

- [x] Task 3: 允许鼠标左键拖动界面
  - [x] SubTask 3.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，找到 `return` 语句里嵌套的最外层第二个 `div` 元素。
  - [x] SubTask 3.2: 移除其 `style` 属性中导致无法拖动的 `{ WebkitAppRegion: 'no-drag', cursor: 'pointer' }` 属性，让内部元素默认继承最外层 `div` 定义的 `WebkitAppRegion: 'drag'` 属性。

# Task Dependencies
- 这三个任务完全独立，可并行或任意顺序处理。
